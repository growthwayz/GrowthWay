import re
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, Body
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId
from pydantic import ValidationError
from pymongo.errors import DuplicateKeyError
from app.auth.jwt import verify_password, get_password_hash, create_session, get_current_admin, require_owner, now
from app.core.config import get_settings
from app.core.security import rate_limit, audit
from app.db.mongodb import get_db
from app.models.schemas import CONTENT_MODELS, SiteSettingsOut, LeadStatusUpdate, PasswordChange, AdminCreate

router = APIRouter(prefix='/api/admin', tags=['admin'])
META = {'_id', 'id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'revision'}

def identifier(value):
    if not ObjectId.is_valid(value): raise HTTPException(404, 'Record not found')
    return ObjectId(value)

def serialize(doc):
    if isinstance(doc, list): return [serialize(v) for v in doc]
    if isinstance(doc, dict): return {('id' if k == '_id' else k): serialize(v) for k, v in doc.items()}
    if isinstance(doc, ObjectId): return str(doc)
    return doc

def validate(model, data):
    try: return model.model_validate(data).model_dump()
    except ValidationError as exc:
        raise HTTPException(422, [{'field': '.'.join(map(str, e['loc'])), 'message': e['msg']} for e in exc.errors()]) from None

def check_urls(data):
    for key, value in data.items():
        if isinstance(value, dict): check_urls(value)
        if isinstance(value, list):
            for item in value:
                if isinstance(item, dict): check_urls(item)
        if key in ('coverImage', 'image', 'photo', 'logo', 'videoUrl', 'poster', 'seoImage', 'ogImage', 'url', 'siteUrl', 'instagram', 'linkedin', 'youtube', 'behance', 'gallery'):
            for item in value if isinstance(value, list) else [value]:
                if item and not (item.startswith('https://') or key not in ('url', 'siteUrl', 'instagram', 'linkedin', 'youtube', 'behance') and item.startswith('/') and not item.startswith('//')):
                    raise HTTPException(422, f'{key} must use HTTPS or a local asset path')

def publish_check(collection, data):
    if not data.get('published'): return
    if data.get('isPlaceholder'): raise HTTPException(422, 'Placeholder content cannot be published')
    approval = {'projects': 'permissionApproved', 'clients': 'approved', 'testimonials': 'permissionApproved', 'team': 'verified'}.get(collection)
    if approval and not data.get(approval): raise HTTPException(422, f'Confirm {approval} before publishing')
    if data.get('results') and not data.get('resultsVerified'): raise HTTPException(422, 'Confirm results are verified before publishing')
    for image, alt in [('coverImage', 'coverImageAlt'), ('image', 'imageAlt'), ('photo', 'photoAlt'), ('logo', 'logoAlt')]:
        if data.get(image) and alt in data and not data.get(alt): raise HTTPException(422, f'Add {alt} before publishing')
    if collection == 'projects':
        if any(not data.get(key) for key in ('coverImage', 'challenge', 'strategy', 'execution')): raise HTTPException(422, 'Published case studies need a cover, challenge, approach and execution')
        if data.get('experienceLabel') != 'Growthway Project' and not data.get('attribution'): raise HTTPException(422, 'Credit previous work before publishing')
        if len(data.get('galleryAlts', [])) < len(data.get('gallery', [])) or any(not x for x in data.get('galleryAlts', [])): raise HTTPException(422, 'Add alt text for every gallery image')

async def check_relations(collection, data):
    if collection != 'projects': return
    for field, related in [('categories', 'categories'), ('services', 'services')]:
        for slug in data.get(field, []):
            if not await get_db()[related].find_one({'slug': slug}): raise HTTPException(422, f'Unknown {field}: {slug}')
    if data.get('industry') and not await get_db().industries.find_one({'slug': data['industry']}): raise HTTPException(422, 'Choose an existing industry')

@router.post('/login')
async def login(request: Request, response: Response, form: OAuth2PasswordRequestForm = Depends()):
    await rate_limit(request, 'login', 10, 900)
    admin = await get_db().admins.find_one({'username': form.username, 'active': True})
    # Perform a hash check even for missing users, avoiding a fast username oracle.
    dummy = '$2b$12$kavSl4RaD5Gf3qTR9cRTtuJxgL2L0cMGdPQBHHKgjWP1c1ozmHEr6'
    from starlette.concurrency import run_in_threadpool
    valid = await run_in_threadpool(verify_password, form.password, admin['passwordHash'] if admin else dummy)
    if not admin or not valid: raise HTTPException(401, 'Invalid username or password')
    token = await create_session(admin)
    response.set_cookie('gw_session', token, httponly=True, secure=get_settings().ENVIRONMENT in ('production', 'staging'), samesite='lax', max_age=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES * 60, path='/api/admin')
    await audit(admin, 'login', 'admins', admin['_id'])
    return {'access_token': token, 'token_type': 'bearer', 'username': admin['username'], 'role': admin['role']}

@router.get('/me')
async def me(admin=Depends(get_current_admin)): return {'username': admin['username'], 'role': admin['role']}
@router.post('/logout')
async def logout(response: Response, admin=Depends(get_current_admin)):
    await get_db().sessions.delete_one({'jti': admin['jti']}); response.delete_cookie('gw_session', path='/api/admin')
    return {'success': True}
@router.post('/password')
async def password(data: PasswordChange, admin=Depends(get_current_admin)):
    from starlette.concurrency import run_in_threadpool
    if not await run_in_threadpool(verify_password, data.currentPassword, admin['passwordHash']): raise HTTPException(400, 'Current password is incorrect')
    hashed = await run_in_threadpool(get_password_hash, data.newPassword)
    await get_db().admins.update_one({'_id': admin['_id']}, {'$set': {'passwordHash': hashed}})
    sessions = await get_db().sessions.find({'username': admin['username']}).to_list(10000)
    for session in sessions: await get_db().sessions.delete_one({'_id': session['_id']})
    await audit(admin, 'password_changed', 'admins', admin['_id'])
    return {'success': True, 'message': 'Password changed. Sign in again.'}
@router.get('/users')
async def users(admin=Depends(require_owner)): return serialize(await get_db().admins.find({}, {'passwordHash': 0}).to_list(100))
@router.post('/users', status_code=201)
async def add_user(data: AdminCreate, admin=Depends(require_owner)):
    from starlette.concurrency import run_in_threadpool
    hashed = await run_in_threadpool(get_password_hash, data.password)
    try: result = await get_db().admins.insert_one({'username': data.username, 'passwordHash': hashed, 'role': data.role, 'active': True, 'createdAt': now()})
    except DuplicateKeyError: raise HTTPException(409, 'Username already exists') from None
    await audit(admin, 'user_created', 'admins', result.inserted_id)
    return {'id': str(result.inserted_id)}
@router.patch('/users/{user_id}')
async def update_user(user_id: str, data: dict = Body(...), admin=Depends(require_owner)):
    if set(data) - {'active', 'role'} or 'role' in data and data['role'] not in ('admin', 'editor') or 'active' in data and not isinstance(data['active'], bool): raise HTTPException(422, 'Only active and role may be changed')
    target = await get_db().admins.find_one({'_id': identifier(user_id)})
    if not target: raise HTTPException(404, 'User not found')
    if target['_id'] == admin['_id']: raise HTTPException(400, 'You cannot disable or demote your current account')
    await get_db().admins.update_one({'_id': target['_id']}, {'$set': data})
    sessions = await get_db().sessions.find({'username': target['username']}).to_list(10000)
    for session in sessions: await get_db().sessions.delete_one({'_id': session['_id']})
    await audit(admin, 'user_updated', 'admins', target['_id'], data)
    return {'success': True}

@router.get('/content/{collection}')
async def list_content(collection: str, q: str = Query('', max_length=120), published: bool | None = None, offset: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100), admin=Depends(get_current_admin)):
    if collection not in CONTENT_MODELS: raise HTTPException(404, 'Unknown content collection')
    query = {}
    if published is not None: query['published'] = published
    if q: query['$or'] = [{key: {'$regex': re.escape(q), '$options': 'i'}} for key in ('title', 'name', 'quote', 'slug')]
    return {'items': serialize(await get_db()[collection].find(query).sort('order', 1).skip(offset).limit(limit).to_list(limit)), 'total': await get_db()[collection].count_documents(query)}
@router.post('/content/{collection}', status_code=201)
async def create_content(collection: str, payload: dict = Body(...), admin=Depends(get_current_admin)):
    if collection not in CONTENT_MODELS: raise HTTPException(404, 'Unknown content collection')
    data = validate(CONTENT_MODELS[collection], payload); check_urls(data); publish_check(collection, data); await check_relations(collection, data)
    data.update(createdAt=now(), updatedAt=now(), createdBy=admin['username'], updatedBy=admin['username'], revision=1)
    try: result = await get_db()[collection].insert_one(data)
    except DuplicateKeyError: raise HTTPException(409, 'This slug already exists') from None
    await audit(admin, 'created', collection, result.inserted_id)
    return serialize({**data, '_id': result.inserted_id})
@router.patch('/content/{collection}/{record_id}')
async def update_content(collection: str, record_id: str, payload: dict = Body(...), admin=Depends(get_current_admin)):
    if collection not in CONTENT_MODELS: raise HTTPException(404, 'Unknown content collection')
    doc = await get_db()[collection].find_one({'_id': identifier(record_id)})
    if not doc: raise HTTPException(404, 'Record not found')
    payload = dict(payload); revision = payload.pop('revision', None)
    if revision != doc.get('revision', 1): raise HTTPException(409, 'This record changed. Reload it before saving.')
    if set(payload) & META: raise HTTPException(422, 'Record metadata cannot be changed')
    base = {k: v for k, v in doc.items() if k in CONTENT_MODELS[collection].model_fields}
    data = validate(CONTENT_MODELS[collection], {**base, **payload}); check_urls(data); publish_check(collection, data); await check_relations(collection, data)
    # Slug changes would invalidate existing case-study links and relations.
    if doc.get('slug') and data.get('slug') != doc['slug']: raise HTTPException(422, 'Keep the existing slug; create a new record if a different URL is needed')
    data.update(updatedAt=now(), updatedBy=admin['username'], revision=revision + 1)
    query = {'_id': doc['_id'], 'revision': doc['revision']} if 'revision' in doc else {'_id': doc['_id'], 'revision': {'$exists': False}}
    try: result = await get_db()[collection].update_one(query, {'$set': data})
    except DuplicateKeyError: raise HTTPException(409, 'This slug already exists') from None
    if not result.matched_count: raise HTTPException(409, 'This record changed. Reload it before saving.')
    # Editing a legacy seeded example is an explicit approval; reclassify its provenance.
    if doc.get('createdBy') == 'seed': await get_db()[collection].update_one({'_id': doc['_id']}, {'$set': {'createdBy': admin['username']}})
    await audit(admin, 'updated', collection, doc['_id'], {'fields': list(payload)})
    return serialize(await get_db()[collection].find_one({'_id': doc['_id']}))
@router.delete('/content/{collection}/{record_id}')
async def delete_content(collection: str, record_id: str, admin=Depends(get_current_admin)):
    if collection not in CONTENT_MODELS: raise HTTPException(404, 'Unknown content collection')
    doc = await get_db()[collection].find_one({'_id': identifier(record_id)})
    if not doc: raise HTTPException(404, 'Record not found')
    if collection in ('services', 'industries', 'categories'):
        field = {'services': 'services', 'industries': 'industry', 'categories': 'categories'}[collection]
        if await get_db().projects.count_documents({field: doc['slug']}): raise HTTPException(409, 'This record is used by a project. Remove that reference first.')
    await get_db()[collection].delete_one({'_id': doc['_id']}); await audit(admin, 'deleted', collection, doc['_id'])
    return {'success': True}

@router.get('/site-settings')
async def settings_get(admin=Depends(get_current_admin)):
    doc = await get_db().site_settings.find_one({}) or {}
    return {**validate(SiteSettingsOut, {k: v for k, v in doc.items() if k in SiteSettingsOut.model_fields}), 'revision': doc.get('revision', 1)}
@router.put('/site-settings')
async def settings_put(payload: dict = Body(...), admin=Depends(require_owner)):
    payload = dict(payload); revision = payload.pop('revision', None)
    data = validate(SiteSettingsOut, payload); check_urls(data)
    if data['hero']['videoUrl'] and not data['hero']['videoPermissionApproved']: raise HTTPException(422, 'Confirm permission for showreel footage')
    if data['hero']['poster'] and not data['hero']['posterAlt']: raise HTTPException(422, 'Add hero poster alt text')
    current = await get_db().site_settings.find_one({})
    if revision != current.get('revision', 1): raise HTTPException(409, 'Settings changed. Reload before saving.')
    query = {'_id': current['_id'], 'revision': current['revision']} if 'revision' in current else {'_id': current['_id'], 'revision': {'$exists': False}}
    result = await get_db().site_settings.update_one(query, {'$set': {**data, 'revision': revision + 1, 'updatedAt': now(), 'updatedBy': admin['username']}})
    if not result.matched_count: raise HTTPException(409, 'Settings changed. Reload before saving.')
    await audit(admin, 'updated', 'site_settings', current['_id'], {'fields': list(data)})
    return {**data, 'revision': revision + 1}

def date_query(days): return {'isTestData': {'$ne': True}, **({'createdAt': {'$gte': now() - timedelta(days=days)}} if days else {})}
@router.get('/dashboard')
async def dashboard(admin=Depends(get_current_admin)):
    db = get_db()
    from app.routes.public import public_query
    visible = await db.projects.count_documents(public_query('projects'))
    return {'totalLeads': await db.leads.count_documents(date_query(0)) if admin['role'] == 'admin' else None, 'newLeads': await db.leads.count_documents({**date_query(0), 'status': 'New'}) if admin['role'] == 'admin' else None, 'publishedProjects': visible, 'unpublishedProjects': await db.projects.count_documents({}) - visible}
@router.get('/analytics')
async def analytics(days: int = Query(30, ge=1, le=365), admin=Depends(require_owner)):
    db = get_db(); query = date_query(days)
    stages = {s: await db.leads.count_documents({**query, 'status': s}) for s in ('New', 'Contacted', 'Proposal', 'Won', 'Lost')}
    events = {s: await db.events.count_documents({**query, 'name': s}) for s in ('page_view', 'whatsapp_click', 'project_cta_click', 'service_cta_click')}
    services = await db.services.find({}, {'slug': 1, 'title': 1, '_id': 0}).to_list(100)
    demand = [{'title': s['title'], 'count': await db.leads.count_documents({**query, 'servicesNeeded': s['slug']})} for s in services]
    return {'days': days, 'totalLeads': sum(stages.values()), 'stages': stages, 'events': events, 'serviceDemand': demand, 'notificationFailures': await db.leads.count_documents({**query, 'notificationStatus': 'failed'}), 'notificationsUnconfigured': await db.leads.count_documents({**query, 'notificationStatus': 'unconfigured'})}
@router.get('/leads')
async def leads(status: str | None = None, q: str = Query('', max_length=120), days: int = Query(0, ge=0, le=3650), offset: int = Query(0, ge=0), limit: int = Query(25, ge=1, le=100), admin=Depends(require_owner)):
    query = date_query(days)
    if status: query['status'] = status
    if q: query['$or'] = [{k: {'$regex': re.escape(q), '$options': 'i'}} for k in ('name', 'brand', 'email')]
    return {'items': serialize(await get_db().leads.find(query).sort('createdAt', -1).skip(offset).limit(limit).to_list(limit)), 'total': await get_db().leads.count_documents(query)}
@router.get('/leads/{lead_id}')
async def lead_detail(lead_id: str, admin=Depends(require_owner)):
    doc = await get_db().leads.find_one({'_id': identifier(lead_id)})
    if not doc: raise HTTPException(404, 'Lead not found')
    history = await get_db().audit_logs.find({'collection': 'leads', 'targetId': lead_id}).sort('createdAt', -1).to_list(100)
    return {**serialize(doc), 'history': serialize(history)}
@router.patch('/leads/{lead_id}/status')
async def lead_status(lead_id: str, data: LeadStatusUpdate, admin=Depends(require_owner)):
    doc = await get_db().leads.find_one({'_id': identifier(lead_id)})
    if not doc: raise HTTPException(404, 'Lead not found')
    if doc.get('revision', 1) != data.revision: raise HTTPException(409, 'Lead changed. Reload before saving.')
    query = {'_id': doc['_id'], 'revision': doc['revision']} if 'revision' in doc else {'_id': doc['_id'], 'revision': {'$exists': False}}
    result = await get_db().leads.update_one(query, {'$set': {'status': data.status, 'updatedAt': now(), 'updatedBy': admin['username'], 'revision': data.revision + 1}})
    if not result.matched_count: raise HTTPException(409, 'Lead changed. Reload before saving.')
    await audit(admin, 'status_changed', 'leads', lead_id, {'from': doc['status'], 'to': data.status, 'note': data.note})
    return serialize(await get_db().leads.find_one({'_id': doc['_id']}))
@router.post('/leads/{lead_id}/notify')
async def lead_notify(lead_id: str, request: Request, admin=Depends(require_owner)):
    await rate_limit(request, 'notify', 10, 3600)
    doc = await get_db().leads.find_one({'_id': identifier(lead_id)})
    if not doc: raise HTTPException(404, 'Lead not found')
    from app.services.email import notify_lead
    status = await notify_lead(doc['_id'])
    await audit(admin, 'notification_retried', 'leads', lead_id, {'status': status})
    return {'notificationStatus': status}
@router.get('/audit')
async def audit_logs(offset: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100), admin=Depends(require_owner)):
    return {'items': serialize(await get_db().audit_logs.find({}).sort('createdAt', -1).skip(offset).limit(limit).to_list(limit)), 'total': await get_db().audit_logs.count_documents({})}
