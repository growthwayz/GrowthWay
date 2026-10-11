"""API integration tests. Always isolated from Atlas and real email/media accounts."""
import os
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.update(ENVIRONMENT='test', MONGODB_URL='memory://', SECRET_KEY='isolated-test-secret-key-at-least-32-characters', ADMIN_USERNAME='owner', ADMIN_PASSWORD='test-owner-password-2026', CLOUDINARY_CLOUD_NAME='', CLOUDINARY_API_KEY='', CLOUDINARY_API_SECRET='', SMTP_HOST='', SMTP_USER='', SMTP_PASSWORD='', EMAIL_FROM='', NOTIFICATION_EMAIL='', WHATSAPP_NUMBER='', GA_MEASUREMENT_ID='', SITE_URL='', AI_ENABLED='false')
import unittest
from unittest.mock import patch
from bson import ObjectId
from fastapi.testclient import TestClient
from app.core.config import get_settings
from app.db.mongodb import get_db
from app.auth.jwt import now, verify_password, get_password_hash
from main import app

class ApiTests(unittest.TestCase):
    def setUp(self):
        self.context = TestClient(app)
        self.client = self.context.__enter__()
        self.token = self.client.post('/api/admin/login', data={'username': 'owner', 'password': 'test-owner-password-2026'}).json()['access_token']
        self.headers = {'Authorization': 'Bearer ' + self.token}
    def tearDown(self): self.context.__exit__(None, None, None)
    def call(self, method, path, **kwargs): return getattr(self.client, method)(path, headers=self.headers, **kwargs)
    def lead(self, **changes):
        return {'name': 'Test Person', 'brand': 'Test Brand', 'email': 'test@example.com', 'businessType': 'startup', 'servicesNeeded': ['website-development'], 'projectDescription': 'A meaningful website project enquiry.', 'consent': True, **changes}
    def project(self, **changes):
        return {'slug': 'test-project', 'title': 'Test Project', 'coverImage': '/test.jpg', 'coverImageAlt': 'Test project artwork', 'challenge': 'The challenge.', 'strategy': 'Our approach.', 'execution': 'The work delivered.', 'experienceLabel': 'Previous Work', 'attribution': 'Created during a prior engagement; credited with permission.', 'permissionApproved': True, **changes}
    def test_default_password_and_anonymous_access_are_rejected(self):
        self.assertEqual(self.client.post('/api/admin/login', data={'username': 'admin', 'password': 'password'}).status_code, 401)
        other = TestClient(app)
        self.assertEqual(other.get('/api/admin/dashboard').status_code, 401)
        self.assertEqual(self.client.post('/api/service/seed?force=true').status_code, 404)
        self.assertEqual(self.client.post('/api/ai/chat', json={}).status_code, 404)
    def test_health_and_honest_empty_defaults(self):
        self.assertEqual(self.client.get('/health').status_code, 200)
        self.assertEqual(len(self.client.get('/api/services').json()), 8)
        for collection in ['projects', 'clients', 'testimonials']: self.assertEqual(self.client.get('/api/' + collection).json(), [])
        data = self.call('get', '/api/admin/analytics').json()
        self.assertEqual(data['totalLeads'], 0)
        self.assertEqual(sum(data['events'].values()), 0)
        self.assertEqual(self.client.get('/api/site-settings').json()['whatsappNumber'], '')
    def test_project_crud_publishing_filters_and_conflicts(self):
        category = self.call('post', '/api/admin/content/categories', json={'slug': 'branding', 'name': 'Branding', 'published': True})
        self.assertEqual(category.status_code, 201)
        result = self.call('post', '/api/admin/content/projects', json=self.project(categories=['branding']))
        self.assertEqual(result.status_code, 201, result.text)
        record = result.json(); url = '/api/admin/content/projects/' + record['id']
        self.assertEqual(self.client.get('/api/projects').json(), [])
        self.assertEqual(self.client.get('/api/projects/test-project').status_code, 404)
        self.assertEqual(self.call('patch', url, json={'published': True, 'revision': 1}).status_code, 200)
        self.assertEqual(len(self.client.get('/api/projects?category=branding').json()), 1)
        self.assertEqual(self.client.get('/api/projects?category=missing').json(), [])
        self.assertEqual(self.client.get('/api/projects/test-project').status_code, 200)
        self.assertEqual(self.call('patch', url, json={'title': 'Stale update', 'revision': 1}).status_code, 409)
        self.assertEqual(self.call('delete', '/api/admin/content/categories/' + category.json()['id']).status_code, 409)
        self.assertEqual(self.call('delete', url).status_code, 200)
        self.assertEqual(self.call('delete', '/api/admin/content/categories/' + category.json()['id']).status_code, 200)
    def test_publishing_requires_permission_alt_credit_and_verified_results(self):
        for changes in [{'permissionApproved': False}, {'coverImageAlt': ''}, {'attribution': ''}, {'results': [{'label': 'Revenue', 'value': '2x'}]}, {'gallery': ['/image.jpg'], 'galleryAlts': []}, {'isPlaceholder': True}]:
            response = self.call('post', '/api/admin/content/projects', json=self.project(published=True, **changes))
            self.assertEqual(response.status_code, 422, response.text)
        self.assertEqual(self.call('post', '/api/admin/content/testimonials', json={'quote': 'A testimonial.', 'personName': 'Person', 'published': True}).status_code, 422)
        self.assertEqual(self.call('post', '/api/admin/content/clients', json={'name': 'Client', 'published': True}).status_code, 422)
    def test_unique_slugs_and_unknown_fields(self):
        self.assertEqual(self.call('post', '/api/admin/content/services', json={'slug': 'website-development', 'title': 'Duplicate'}).status_code, 409)
        self.assertEqual(self.call('post', '/api/admin/content/services', json={'slug': 'another-service', 'title': 'Valid', 'admin': True}).status_code, 422)
        self.assertEqual(self.call('post', '/api/admin/content/projects', json=self.project(services=['nonexistent'])).status_code, 422)
        self.assertEqual(self.call('post', '/api/admin/content/anything', json={}).status_code, 404)
        self.assertEqual(self.call('post', '/api/admin/content/services', json={'slug': 'script', 'title': 'Bad link', 'image': 'javascript:alert(1)'}).status_code, 422)
    def test_all_content_collections_round_trip(self):
        cases = {'services': {'slug': 'new-service', 'title': 'New service'}, 'industries': {'slug': 'health', 'name': 'Healthcare'}, 'categories': {'slug': 'design', 'name': 'Design'}, 'clients': {'name': 'Approved client', 'approved': True}, 'testimonials': {'personName': 'Approved person', 'quote': 'Approved quote.', 'permissionApproved': True}, 'team': {'name': 'Verified teammate', 'role': 'Designer', 'verified': True}}
        for collection, data in cases.items():
            created = self.call('post', '/api/admin/content/' + collection, json={**data, 'published': True})
            self.assertEqual(created.status_code, 201, created.text)
            record = created.json()
            updated = self.call('patch', f"/api/admin/content/{collection}/{record['id']}", json={'order': 8, 'revision': 1})
            self.assertEqual(updated.status_code, 200, updated.text)
            self.assertTrue(any(item.get('slug') == data.get('slug') and item.get('name') == data.get('name') and item.get('title') == data.get('title') for item in self.client.get('/api/' + collection).json()))
            self.assertEqual(self.call('delete', f"/api/admin/content/{collection}/{record['id']}").status_code, 200)
    def test_lead_validation_consent_and_honeypot(self):
        for changes in [{'email': 'bad'}, {'consent': False}, {'website_fax_hp': 'bot'}, {'servicesNeeded': ['unknown']}, {'projectDescription': 'short'}]:
            response = self.client.post('/api/leads', json=self.lead(**changes))
            self.assertIn(response.status_code, (400, 422), response.text)
        self.assertEqual(self.call('get', '/api/admin/dashboard').json()['totalLeads'], 0)
    def test_lead_attribution_status_audit_and_notification(self):
        response = self.client.post('/api/leads', json=self.lead(utmSource='newsletter', utmCampaign='launch', pageUrl='https://example.com/contact'))
        self.assertEqual(response.status_code, 201, response.text)
        record_id = response.json()['id']
        detail = self.call('get', '/api/admin/leads/' + record_id).json()
        self.assertEqual(detail['utmSource'], 'newsletter')
        self.assertEqual(detail['notificationStatus'], 'unconfigured')
        self.assertEqual(detail['notificationAttempts'], 1)
        self.assertEqual(self.call('patch', f'/api/admin/leads/{record_id}/status', json={'status': 'Unknown', 'revision': 1}).status_code, 422)
        update = self.call('patch', f'/api/admin/leads/{record_id}/status', json={'status': 'Contacted', 'note': 'Discovery scheduled.', 'revision': 1})
        self.assertEqual(update.status_code, 200, update.text)
        self.assertEqual(self.call('patch', f'/api/admin/leads/{record_id}/status', json={'status': 'Won', 'revision': 1}).status_code, 409)
        detail = self.call('get', '/api/admin/leads/' + record_id).json()
        self.assertEqual(detail['history'][0]['changes']['note'], 'Discovery scheduled.')
        self.assertEqual(self.call('get', '/api/admin/leads?status=Contacted&q=Test').json()['total'], 1)
        self.assertEqual(self.call('get', '/api/admin/analytics').json()['stages']['Contacted'], 1)
    def test_notification_failure_preserves_lead(self):
        with patch('app.services.email.send_lead_notification', return_value='failed'):
            record_id = self.client.post('/api/leads', json=self.lead()).json()['id']
        detail = self.call('get', '/api/admin/leads/' + record_id).json()
        self.assertEqual(detail['notificationStatus'], 'failed')
        with patch('app.services.email.send_lead_notification', return_value='sent'):
            self.assertEqual(self.call('post', f'/api/admin/leads/{record_id}/notify', json={}).json()['notificationStatus'], 'sent')
    def test_shared_rate_limit(self):
        for _ in range(5): self.assertEqual(self.client.post('/api/leads', json=self.lead()).status_code, 201)
        response = self.client.post('/api/leads', json=self.lead())
        self.assertEqual(response.status_code, 429)
        self.assertIn('Retry-After', response.headers)
    def test_editor_role_cannot_read_private_leads_or_manage_settings(self):
        created = self.call('post', '/api/admin/users', json={'username': 'editor', 'password': 'editor-test-password', 'role': 'editor'})
        self.assertEqual(created.status_code, 201)
        token = self.client.post('/api/admin/login', data={'username': 'editor', 'password': 'editor-test-password'}).json()['access_token']
        headers = {'Authorization': 'Bearer ' + token}
        for path in ['/api/admin/leads', '/api/admin/analytics', '/api/admin/users', '/api/admin/audit', '/api/service/info']:
            self.assertEqual(self.client.get(path, headers=headers).status_code, 403)
        self.assertEqual(self.client.get('/api/admin/content/projects', headers=headers).status_code, 200)
        self.assertEqual(self.client.put('/api/admin/site-settings', headers=headers, json={}).status_code, 403)
    def test_logout_password_and_cookie_origin(self):
        self.assertEqual(self.client.post('/api/admin/logout', headers={'Origin': 'https://evil.example'}, json={}).status_code, 403)
        self.assertEqual(self.call('post', '/api/admin/logout', json={}).status_code, 200)
        self.assertEqual(self.call('get', '/api/admin/me').status_code, 401)
        token = self.client.post('/api/admin/login', data={'username': 'owner', 'password': 'test-owner-password-2026'}).json()['access_token']
        self.headers = {'Authorization': 'Bearer ' + token}
        self.assertEqual(self.call('post', '/api/admin/password', json={'currentPassword': 'test-owner-password-2026', 'newPassword': 'new-password-for-tests'}).status_code, 200)
        self.assertEqual(self.call('get', '/api/admin/me').status_code, 401)
        self.assertEqual(self.client.post('/api/admin/login', data={'username': 'owner', 'password': 'new-password-for-tests'}).status_code, 200)
    def test_settings_conflict_and_sitemap(self):
        data = self.call('get', '/api/admin/site-settings').json()
        data['siteUrl'] = 'https://example.com'; data['whatsappNumber'] = '919999999999'
        saved = self.call('put', '/api/admin/site-settings', json=data)
        self.assertEqual(saved.status_code, 200, saved.text)
        self.assertEqual(self.call('put', '/api/admin/site-settings', json=data).status_code, 409)
        self.assertEqual(self.client.get('/api/site-settings').json()['whatsappNumber'], '919999999999')
        xml = self.client.get('/api/sitemap.xml')
        self.assertEqual(xml.status_code, 200)
        self.assertIn('https://example.com/services/website-development', xml.text)
        self.assertNotIn('/admin', xml.text)
    def test_media_replacements_are_public_and_unpublishing_removes_project(self):
        settings = self.call('get', '/api/admin/site-settings').json()
        settings['hero'].update(videoUrl='https://res.cloudinary.com/test-cloud/video/upload/first.mp4', videoPermissionApproved=False)
        self.assertEqual(self.call('put', '/api/admin/site-settings', json=settings).status_code, 422)
        settings['hero']['videoPermissionApproved'] = True
        saved = self.call('put', '/api/admin/site-settings', json=settings)
        self.assertEqual(saved.status_code, 200, saved.text)
        self.assertEqual(self.client.get('/api/site-settings').json()['hero']['videoUrl'], settings['hero']['videoUrl'])
        replacement = saved.json()
        replacement['hero'].update(videoUrl='https://res.cloudinary.com/test-cloud/video/upload/second.mp4', poster='/poster.png', posterAlt='Showreel poster')
        self.assertEqual(self.call('put', '/api/admin/site-settings', json=replacement).status_code, 200)
        self.assertEqual(self.client.get('/api/site-settings').json()['hero']['videoUrl'], replacement['hero']['videoUrl'])
        created = self.call('post', '/api/admin/content/projects', json=self.project(published=True, videoUrl=replacement['hero']['videoUrl'], gallery=['/gallery.png'], galleryAlts=['Gallery artwork'], galleryCaptions=['Behind the scenes']))
        self.assertEqual(created.status_code, 201, created.text)
        record = created.json(); path = '/api/admin/content/projects/' + record['id']
        self.assertEqual(self.call('patch', path, json={'coverImage': '/replacement.png', 'coverImageAlt': 'Replacement artwork', 'revision': 1}).status_code, 200)
        public = self.client.get('/api/projects/test-project').json()
        self.assertEqual(public['coverImage'], '/replacement.png')
        self.assertEqual(public['gallery'], ['/gallery.png'])
        self.assertEqual(public['videoUrl'], replacement['hero']['videoUrl'])
        self.assertEqual(self.call('patch', path, json={'published': False, 'revision': 2}).status_code, 200)
        self.assertEqual(self.client.get('/api/projects').json(), [])
        self.assertEqual(self.client.get('/api/projects/test-project').status_code, 404)
    def test_media_requires_configuration_and_valid_resource_type(self):
        self.assertEqual(self.call('post', '/api/admin/media/sign', json={'resourceType': 'raw'}).status_code, 422)
        self.assertEqual(self.call('post', '/api/admin/media/sign', json={'resourceType': 'image'}).status_code, 503)
        self.assertEqual(self.call('post', '/api/admin/media/register', json={'publicId': 'foreign/file'}).status_code, 400)
    def test_media_connection_checks_authentication_and_live_provider_result(self):
        self.assertEqual(TestClient(app).get('/api/admin/media/connection').status_code, 401)
        self.assertEqual(self.call('get', '/api/admin/media/connection').status_code, 503)
        settings = get_settings()
        with patch.object(settings, 'CLOUDINARY_CLOUD_NAME', 'test-cloud'), patch.object(settings, 'CLOUDINARY_API_KEY', 'test-key'), patch.object(settings, 'CLOUDINARY_API_SECRET', 'test-secret'):
            with patch('cloudinary.api.ping', return_value={'status': 'ok'}) as ping:
                response = self.call('get', '/api/admin/media/connection')
                self.assertEqual(response.json(), {'status': 'connected', 'cloudName': 'test-cloud'})
                ping.assert_called_once_with(timeout=15)
            with patch('cloudinary.api.ping', side_effect=Exception('test-secret')):
                response = self.call('get', '/api/admin/media/connection')
                self.assertEqual(response.status_code, 502)
                self.assertNotIn('test-secret', response.text)
            with patch('cloudinary.api.ping', return_value={'status': 'failed'}):
                self.assertEqual(self.call('get', '/api/admin/media/connection').status_code, 502)
    def test_media_registration_verifies_upstream_and_protects_references(self):
        settings = get_settings()
        with patch.object(settings, 'CLOUDINARY_CLOUD_NAME', 'test-cloud'), patch.object(settings, 'CLOUDINARY_API_KEY', 'test-key'), patch.object(settings, 'CLOUDINARY_API_SECRET', 'test-secret'):
            signed = self.call('post', '/api/admin/media/sign', json={'resourceType': 'image'}).json()
            self.assertNotEqual(signed['signature'], 'dummy_signature')
            import cloudinary.utils
            transmitted = {k: ','.join(v) if isinstance(v, list) else str(v) for k, v in signed['params'].items()}
            self.assertEqual(signed['params']['overwrite'], '0')
            self.assertEqual(signed['signature'], cloudinary.utils.api_sign_request(transmitted, 'test-secret'))
            public_id = signed['params']['public_id']; url = 'https://res.cloudinary.com/test-cloud/image/upload/' + public_id + '.jpg'
            fixture = {'secure_url': url, 'format': 'jpg', 'bytes': 1200, 'width': 200, 'height': 200}
            with patch('cloudinary.api.resource', return_value=fixture):
                registered = self.call('post', '/api/admin/media/register', json={'publicId': public_id, 'alt': 'Actual image description', 'caption': 'Caption'})
            self.assertEqual(registered.status_code, 201, registered.text)
            media_id = registered.json()['id']
            project = self.call('post', '/api/admin/content/projects', json=self.project(coverImage=url)).json()
            self.assertEqual(self.call('delete', '/api/admin/media/' + media_id).status_code, 409)
            self.call('delete', '/api/admin/content/projects/' + project['id'])
            with patch('cloudinary.uploader.destroy', return_value={'result': 'ok'}): self.assertEqual(self.call('delete', '/api/admin/media/' + media_id).status_code, 200)
    def test_legacy_demo_data_is_preserved_but_hidden(self):
        db = get_db()
        async def add():
            await db.projects.insert_one({**self.project(published=True), 'createdBy': 'seed', 'order': 1})
            await db.leads.insert_one({**self.lead(), 'status': 'Won', 'isTestData': True, 'createdAt': now()})
        self.client.portal.call(add)
        self.assertEqual(self.client.get('/api/projects').json(), [])
        self.assertEqual(self.call('get', '/api/admin/leads').json()['total'], 0)
        self.assertEqual(self.call('get', '/api/admin/dashboard').json()['totalLeads'], 0)
    def test_security_headers_and_request_limit(self):
        response = self.call('get', '/api/admin/me')
        self.assertEqual(response.headers['Cache-Control'], 'no-store')
        self.assertEqual(response.headers['X-Content-Type-Options'], 'nosniff')
        self.assertEqual(self.client.post('/api/leads', content='x' * 100001).status_code, 413)
    def test_events_validation_and_actual_counts(self):
        self.assertEqual(self.client.post('/api/events', json={'name': 'whatsapp_click', 'path': '/contact'}).status_code, 202)
        self.assertEqual(self.client.post('/api/events', json={'name': 'made_up', 'email': 'private@example.com'}).status_code, 422)
        self.assertEqual(self.call('get', '/api/admin/analytics').json()['events']['whatsapp_click'], 1)
    def test_password_hashes_do_not_truncate_long_passwords(self):
        original = 'x' * 72 + 'first'
        hashed = get_password_hash(original)
        self.assertTrue(verify_password(original, hashed))
        self.assertFalse(verify_password('x' * 72 + 'different', hashed))

if __name__ == '__main__': unittest.main()
