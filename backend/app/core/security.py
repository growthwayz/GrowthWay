import hashlib
from datetime import timedelta
from fastapi import HTTPException, Request
from pymongo import ReturnDocument
from app.auth.jwt import now
from app.core.config import get_settings
from app.db.mongodb import get_db

async def rate_limit(request: Request, scope: str, limit: int, seconds: int):
    # Ignore untrusted forwarded headers; configure trusted proxies at deployment.
    ip = request.client.host if request.client else 'unknown'
    timestamp = int(now().timestamp()); bucket = timestamp // seconds
    key = hashlib.sha256(f'{get_settings().SECRET_KEY}:{scope}:{ip}:{bucket}'.encode()).hexdigest()
    doc = await get_db().rate_limits.find_one_and_update({'key': key}, {'$inc': {'count': 1}, '$setOnInsert': {'expiresAt': now() + timedelta(seconds=seconds * 2)}}, upsert=True, return_document=ReturnDocument.AFTER)
    if doc['count'] > limit: raise HTTPException(429, 'Too many requests. Please try again later.', headers={'Retry-After': str(seconds - timestamp % seconds)})

async def audit(admin, action, collection, target, changes=None):
    await get_db().audit_logs.insert_one({'actor': admin['username'], 'action': action, 'collection': collection, 'targetId': str(target), 'changes': changes or {}, 'createdAt': now()})
