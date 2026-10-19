from fastapi import APIRouter, HTTPException, Query, Request, Response
from fastapi.responses import Response as RawResponse
from xml.sax.saxutils import escape
from app.db.mongodb import get_db, get_client, is_live_connection
from app.core.config import get_settings
from app.models.schemas import SiteSettingsOut, EventCreate
from app.core.security import rate_limit
from app.auth.jwt import now

router = APIRouter(prefix='/api', tags=['public'])

PUBLIC_HIDDEN = {'_id': 0, 'createdAt': 0, 'updatedAt': 0, 'createdBy': 0, 'revision': 0, 'published': 0, 'isPlaceholder': 0}
def public_query(collection):
    query = {'published': True, 'isPlaceholder': {'$ne': True}}
    if collection in ('projects', 'clients', 'testimonials'): query['createdBy'] = {'$ne': 'seed'}
    if collection in ('projects', 'testimonials'): query['permissionApproved'] = True
    if collection == 'clients': query['approved'] = True
    if collection == 'team': query['verified'] = True
    return query

@router.get('/projects')
async def projects(response: Response, industry: str | None = None, category: str | None = None, featured: bool | None = None, offset: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=100)):
    query = public_query('projects')
    if industry: query['industry'] = industry
    if category: query['categories'] = category
    if featured is not None: query['featured'] = featured
    response.headers['Cache-Control'] = 'public, max-age=0, must-revalidate'
    return await get_db().projects.find(query, PUBLIC_HIDDEN).sort('order', 1).skip(offset).limit(limit).to_list(limit)

@router.get('/projects/{slug}')
async def project(slug: str):
    doc = await get_db().projects.find_one({**public_query('projects'), 'slug': slug}, PUBLIC_HIDDEN)
    if not doc: raise HTTPException(404, 'Project not found')
    return doc

async def content_list(collection):
    return await get_db()[collection].find(public_query(collection), PUBLIC_HIDDEN).sort('order', 1).to_list(100)

@router.get('/services')
async def services(): return await content_list('services')
@router.get('/services/{slug}')
async def service(slug: str):
    doc = await get_db().services.find_one({**public_query('services'), 'slug': slug}, PUBLIC_HIDDEN)
    if not doc: raise HTTPException(404, 'Service not found')
    return doc
@router.get('/industries')
async def industries(): return await content_list('industries')
@router.get('/categories')
async def categories(): return await content_list('categories')
@router.get('/clients')
async def clients(): return await content_list('clients')
@router.get('/testimonials')
async def testimonials(): return await content_list('testimonials')
@router.get('/team')
async def team(): return await content_list('team')
@router.get('/site-settings')
async def site_settings():
    doc = await get_db().site_settings.find_one({}, {'_id': 0, 'updatedAt': 0, 'updatedBy': 0, 'revision': 0})
    # Legacy fields are intentionally ignored on reads; writes are strictly validated.
    return SiteSettingsOut.model_validate({k: v for k, v in (doc or {}).items() if k in SiteSettingsOut.model_fields}).model_dump()

@router.get('/health')
async def health():
    if is_live_connection():
        try: await get_client().admin.command('ping')
        except Exception: raise HTTPException(503, 'Database unavailable') from None
    else: await get_db().site_settings.find_one({})
    return {'status': 'ok', 'database': 'mongodb' if is_live_connection() else 'test-memory'}

@router.post('/events', status_code=202)
async def event(data: EventCreate, request: Request):
    await rate_limit(request, 'events', 120, 60)
    await get_db().events.insert_one({**data.model_dump(), 'createdAt': now()})
    return {'accepted': True}

@router.get('/sitemap.xml')
async def sitemap():
    settings = await site_settings(); base = (settings['siteUrl'] or get_settings().SITE_URL).rstrip('/')
    if not base: raise HTTPException(503, 'Production site URL is not configured')
    paths = ['/', '/work', '/contact', '/privacy', '/terms']
    for collection, prefix in [('projects', '/work/'), ('services', '/services/')]:
        docs = await get_db()[collection].find(public_query(collection), {'slug': 1, '_id': 0}).to_list(1000)
        paths += [prefix + doc['slug'] for doc in docs]
    xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + escape(base + path) + '</loc></url>' for path in paths) + '</urlset>'
    return RawResponse(xml, media_type='application/xml')
