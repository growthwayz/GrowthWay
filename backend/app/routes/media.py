import secrets
import time
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Body, Query, Request
from starlette.concurrency import run_in_threadpool
import cloudinary
import cloudinary.utils
import cloudinary.api
import cloudinary.uploader
from app.auth.jwt import get_current_admin, now
from app.core.config import get_settings
from app.core.security import rate_limit, audit
from app.db.mongodb import get_db
from app.models.schemas import MediaEdit
from app.routes.admin import serialize, identifier

router = APIRouter(prefix='/api/admin/media', tags=['media'])
MAX_BYTES = {'image': 10 * 1024 * 1024, 'video': 100 * 1024 * 1024}
FORMATS = {'image': {'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'}, 'video': {'mp4', 'webm', 'mov'}}

def configure():
    s = get_settings()
    if not all((s.CLOUDINARY_CLOUD_NAME, s.CLOUDINARY_API_KEY, s.CLOUDINARY_API_SECRET)): raise HTTPException(503, 'Cloudinary cloud name, key and secret are required')
    cloudinary.config(cloud_name=s.CLOUDINARY_CLOUD_NAME, api_key=s.CLOUDINARY_API_KEY, api_secret=s.CLOUDINARY_API_SECRET, secure=True)
    return s

@router.get('/connection')
async def connection(request: Request, admin=Depends(get_current_admin)):
    await rate_limit(request, 'cloudinary-check', 20, 3600)
    s = configure()
    try:
        result = await run_in_threadpool(cloudinary.api.ping, timeout=15)
    except Exception:
        raise HTTPException(502, 'Cloudinary connection failed. Check the backend credentials and network connection.') from None
    if result.get('status') != 'ok':
        raise HTTPException(502, 'Cloudinary did not confirm the connection')
    return {'status': 'connected', 'cloudName': s.CLOUDINARY_CLOUD_NAME}

@router.post('/sign')
async def sign(request: Request, resourceType: str = Body('image', embed=True), admin=Depends(get_current_admin)):
    await rate_limit(request, 'uploads', 30, 3600)
    if resourceType not in MAX_BYTES: raise HTTPException(422, 'Choose image or video')
    s = configure(); public_id = 'growthway/' + secrets.token_hex(16)
    params = cloudinary.utils.cleanup_params({'timestamp': int(time.time()), 'public_id': public_id, 'overwrite': False, 'allowed_formats': sorted(FORMATS[resourceType])})
    signature = cloudinary.utils.api_sign_request(params, s.CLOUDINARY_API_SECRET)
    await get_db().upload_tickets.insert_one({'publicId': public_id, 'owner': admin['username'], 'resourceType': resourceType, 'expiresAt': now() + timedelta(minutes=15), 'used': False})
    return {'cloudName': s.CLOUDINARY_CLOUD_NAME, 'apiKey': s.CLOUDINARY_API_KEY, 'signature': signature, 'params': params, 'resourceType': resourceType, 'maxBytes': MAX_BYTES[resourceType]}

@router.post('/register', status_code=201)
async def register(payload: dict = Body(...), admin=Depends(get_current_admin)):
    if set(payload) - {'publicId', 'alt', 'caption'}: raise HTTPException(422, 'Unexpected media fields')
    public_id = payload.get('publicId'); metadata = MediaEdit.model_validate({k: payload[k] for k in ('alt', 'caption') if k in payload})
    ticket = await get_db().upload_tickets.find_one({'publicId': public_id, 'owner': admin['username'], 'used': False, 'expiresAt': {'$gte': now()}})
    if not ticket: raise HTTPException(400, 'Upload session has expired or was already used')
    configure()
    try: result = await run_in_threadpool(cloudinary.api.resource, public_id, resource_type=ticket['resourceType'])
    except Exception: raise HTTPException(502, 'Unable to verify the uploaded file with Cloudinary') from None
    kind = ticket['resourceType']
    if result.get('format') not in FORMATS[kind] or result.get('bytes', 0) > MAX_BYTES[kind]:
        await run_in_threadpool(cloudinary.uploader.destroy, public_id, resource_type=kind, invalidate=True)
        raise HTTPException(422, 'Uploaded file exceeds the allowed size or format')
    if kind == 'image' and not metadata.alt: raise HTTPException(422, 'Add alt text for this image')
    doc = {**metadata.model_dump(), 'publicId': public_id, 'resourceType': kind, 'url': result['secure_url'], 'format': result.get('format'), 'bytes': result.get('bytes'), 'width': result.get('width'), 'height': result.get('height'), 'duration': result.get('duration'), 'createdAt': now(), 'createdBy': admin['username']}
    from pymongo.errors import DuplicateKeyError
    try: inserted = await get_db().media.insert_one(doc)
    except DuplicateKeyError: raise HTTPException(409, 'This file is already registered') from None
    await get_db().upload_tickets.update_one({'_id': ticket['_id']}, {'$set': {'used': True}})
    await audit(admin, 'uploaded', 'media', inserted.inserted_id)
    return serialize({**doc, '_id': inserted.inserted_id})

@router.get('')
async def media(offset: int = Query(0, ge=0), limit: int = Query(30, ge=1, le=100), admin=Depends(get_current_admin)):
    return {'items': serialize(await get_db().media.find({}).sort('createdAt', -1).skip(offset).limit(limit).to_list(limit)), 'total': await get_db().media.count_documents({})}
@router.patch('/{media_id}')
async def metadata(media_id: str, data: MediaEdit, admin=Depends(get_current_admin)):
    doc = await get_db().media.find_one({'_id': identifier(media_id)})
    if not doc: raise HTTPException(404, 'Media not found')
    if doc['resourceType'] == 'image' and not data.alt: raise HTTPException(422, 'Alt text is required')
    await get_db().media.update_one({'_id': doc['_id']}, {'$set': {**data.model_dump(), 'updatedAt': now()}})
    await audit(admin, 'metadata_updated', 'media', media_id)
    return serialize(await get_db().media.find_one({'_id': doc['_id']}))

def references(value, public_id):
    if isinstance(value, dict): return any(references(v, public_id) for v in value.values())
    if isinstance(value, list): return any(references(v, public_id) for v in value)
    return isinstance(value, str) and public_id in value
@router.delete('/{media_id}')
async def delete(media_id: str, admin=Depends(get_current_admin)):
    doc = await get_db().media.find_one({'_id': identifier(media_id)})
    if not doc: raise HTTPException(404, 'Media not found')
    from app.models.schemas import CONTENT_MODELS
    for collection in [*CONTENT_MODELS, 'site_settings']:
        offset = 0
        while True:
            records = await get_db()[collection].find({}).skip(offset).limit(100).to_list(100)
            if any(references(record, doc['publicId']) for record in records): raise HTTPException(409, 'This file is used by content. Replace or remove that reference first.')
            if len(records) < 100: break
            offset += 100
    configure()
    try: result = await run_in_threadpool(cloudinary.uploader.destroy, doc['publicId'], resource_type=doc['resourceType'], invalidate=True)
    except Exception: raise HTTPException(502, 'Cloudinary deletion failed; the media record has been preserved') from None
    if result.get('result') not in ('ok', 'not found'): raise HTTPException(502, 'Cloudinary did not confirm deletion')
    await get_db().media.delete_one({'_id': doc['_id']}); await audit(admin, 'deleted', 'media', media_id)
    return {'success': True}
