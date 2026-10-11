"""Non-destructive startup defaults. Never seed clients, testimonials, projects or leads."""
from app.auth.jwt import now, get_password_hash
from app.core.config import get_settings
from app.models.schemas import SiteSettingsOut

SERVICE_DATA = [
 ('social-media-strategy', 'Social Media Strategy & Management', 'Strategy, planning, content direction and ongoing social media management.', ['Content strategy & calendars', 'Community management', 'Platform planning', 'Performance reporting']),
 ('content-creation-reels', 'Content Creation & Reels', 'Short-form videos, reels and platform-focused visual storytelling.', ['Creative direction', 'Reels & short-form video', 'Production', 'Editing']),
 ('branding-design', 'Branding & Design', 'Brand identity, visual direction, design systems and creative assets.', ['Logo & visual identity', 'Brand guidelines', 'Digital design', 'Creative assets']),
 ('digital-marketing-meta-ads', 'Digital Marketing / Meta Ads', 'Paid campaigns designed around your audience, goals and budget.', ['Meta campaigns', 'Audience targeting', 'Ad creative', 'Campaign reporting']),
 ('website-development', 'Website Development', 'Responsive websites built around your brand, usability and conversion.', ['Website design & development', 'Responsive layouts', 'CMS integration', 'Performance & SEO']),
 ('brand-product-shoots', 'Brand & Product Shoots', 'Photography and video for products, brands and campaigns.', ['Product photography', 'Brand shoots', 'Lifestyle content', 'Campaign video']),
 ('event-campaign-content', 'Event & Campaign Content', 'On-ground coverage and campaign content for digital distribution.', ['Event coverage', 'Live reels', 'Campaign production', 'Editing & distribution']),
 ('personal-brand-growth', 'Personal Brand Growth', 'Content, positioning and digital strategy for founders, creators and professionals.', ['Positioning', 'Content direction', 'Social presence', 'Thought leadership']),
]

async def seed_database(db, force=False):
    if force: raise ValueError('Destructive seeding is disabled; use the CMS to manage content.')
    inserted = {}
    for index, (slug, title, description, capabilities) in enumerate(SERVICE_DATA):
        result = await db.services.update_one({'slug': slug}, {'$setOnInsert': {'slug': slug, 'title': title, 'description': description, 'capabilities': capabilities, 'published': True, 'isPlaceholder': False, 'order': index + 1, 'createdBy': 'defaults', 'createdAt': now(), 'updatedAt': now(), 'revision': 1}}, upsert=True)
        inserted[slug] = bool(result.upserted_id)
    existing_settings = await db.site_settings.find_one({})
    if not existing_settings or existing_settings.get('updatedBy') == 'seed':
        settings = get_settings()
        data = SiteSettingsOut(whatsappNumber=settings.WHATSAPP_NUMBER, siteUrl=settings.SITE_URL, gaMeasurementId=settings.GA_MEASUREMENT_ID).model_dump()
        data['whyGrowthway'] = {'intro': 'A new agency built on practical experience and a clear, collaborative approach.', 'items': [{'word': 'Clarity', 'line': 'Strategy before execution.'}, {'word': 'Craft', 'line': 'Content and design with purpose.'}, {'word': 'Collaboration', 'line': 'A direct relationship with the people doing the work.'}]}
        data['process'] = [{'title': title, 'description': desc} for title, desc in [('Discover', 'Understand your brand, audience and goals.'), ('Strategise', 'Agree on direction, priorities and a practical plan.'), ('Create', 'Develop content, design and digital experiences.'), ('Launch', 'Publish and deliver the agreed work.'), ('Optimise', 'Review performance and improve the next iteration.')]]
        replacement = {**data, 'updatedAt': now(), 'updatedBy': 'defaults', 'revision': 1}
        if existing_settings:
            await db.migration_snapshots.insert_one({'collection': 'site_settings', 'record': existing_settings, 'createdAt': now(), 'reason': 'retire-demo-settings'})
            await db.site_settings.update_one({'_id': existing_settings['_id']}, {'$set': replacement})
        else:
            await db.site_settings.insert_one(replacement)
    for order, name, role in [(1, 'Priyanka Barnwal', 'Founder'), (2, 'Ajay Ojha', 'Co-Founder')]:
        existing = await db.team.find_one({'name': name})
        defaults = {'name': name, 'role': role, 'bio': '', 'photo': '', 'photoAlt': '', 'published': True, 'verified': True, 'isPlaceholder': False, 'order': order, 'createdBy': 'defaults', 'createdAt': now(), 'updatedAt': now(), 'revision': 1}
        if existing and existing.get('createdBy') == 'seed':
            await db.migration_snapshots.insert_one({'collection': 'team', 'record': existing, 'createdAt': now(), 'reason': 'retire-demo-biography'})
            await db.team.update_one({'_id': existing['_id']}, {'$set': defaults})
        elif not existing:
            await db.team.insert_one(defaults)
    # Preserve known sample enquiries, but exclude them from the operational pipeline.
    from bson import ObjectId
    for suffix, email in [('001', 'elena@aurabotanicals.com'), ('002', 'jvance@vervegrouphotels.com'), ('003', 'marcus@kairodesign.co')]:
        await db.leads.update_one({'_id': ObjectId('660000000000000000000' + suffix), 'email': email}, {'$set': {'isTestData': True}})
    settings = get_settings()
    if settings.ADMIN_USERNAME and settings.ADMIN_PASSWORD:
        existing = await db.admins.find_one({'username': settings.ADMIN_USERNAME})
        known_demo = existing and existing.get('hashedPassword') == '$2b$12$kavSl4RaD5Gf3qTR9cRTtuJxgL2L0cMGdPQBHHKgjWP1c1ozmHEr6' and not existing.get('passwordHash')
        if not existing or known_demo:
            if len(settings.ADMIN_PASSWORD) < 12: raise RuntimeError('Bootstrap administrator password must be at least 12 characters.')
            from starlette.concurrency import run_in_threadpool
            hashed = await run_in_threadpool(get_password_hash, settings.ADMIN_PASSWORD)
            await db.admins.update_one({'username': settings.ADMIN_USERNAME}, {'$set': {'username': settings.ADMIN_USERNAME, 'passwordHash': hashed, 'role': 'admin', 'active': True}, '$setOnInsert': {'createdAt': now()}}, upsert=True)
    return inserted
