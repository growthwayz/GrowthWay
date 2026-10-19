"""MongoDB is required at runtime; an isolated memory adapter is available only for tests."""
import re
from copy import deepcopy
from types import SimpleNamespace
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

_client = None
_db = None

def matches(doc, query):
    for key, value in (query or {}).items():
        if key == '$or':
            if not any(matches(doc, item) for item in value): return False
            continue
        actual = doc.get(key)
        if isinstance(value, dict):
            for op, operand in value.items():
                if op == '$exists' and (key in doc) != operand: return False
                if op == '$ne' and actual == operand: return False
                if op == '$in' and actual not in operand: return False
                if op == '$gte' and (actual is None or actual < operand): return False
                if op == '$lt' and (actual is None or actual >= operand): return False
                if op == '$regex' and not re.search(operand, str(actual or ''), re.I if value.get('$options') == 'i' else 0): return False
        elif isinstance(actual, list):
            if value not in actual: return False
        elif actual != value: return False
    return True

def project(doc, projection):
    doc = deepcopy(doc)
    if projection:
        includes = [k for k, v in projection.items() if v and k != '_id']
        if includes: doc = {k: v for k, v in doc.items() if k in includes or k == '_id' and projection.get('_id', 1)}
        else: doc = {k: v for k, v in doc.items() if projection.get(k, 1)}
    return doc

class MemoryCursor:
    def __init__(self, docs): self.docs = docs; self.start = 0; self.maximum = None
    def sort(self, key, direction=1):
        self.docs.sort(key=lambda d: (d.get(key) is not None, d.get(key)), reverse=direction == -1)
        return self
    def skip(self, count): self.start = count; return self
    def limit(self, count): self.maximum = count; return self
    async def to_list(self, length=100): return deepcopy(self.docs[self.start:self.start + (self.maximum or length)])

class MemoryCollection:
    def __init__(self): self.docs = []; self.unique = []
    def find(self, query=None, projection=None): return MemoryCursor([project(d, projection) for d in self.docs if matches(d, query)])
    async def find_one(self, query=None, projection=None):
        return next((project(d, projection) for d in self.docs if matches(d, query)), None)
    async def count_documents(self, query): return sum(matches(d, query) for d in self.docs)
    async def insert_one(self, doc):
        from pymongo.errors import DuplicateKeyError
        doc = deepcopy(doc); doc.setdefault('_id', ObjectId())
        if any(any(d.get(k) == doc.get(k) for d in self.docs) for k in self.unique): raise DuplicateKeyError('Duplicate key')
        self.docs.append(doc); return SimpleNamespace(inserted_id=doc['_id'])
    async def update_one(self, query, update, upsert=False):
        doc = next((d for d in self.docs if matches(d, query)), None)
        added = doc is None and upsert
        if added:
            doc = deepcopy(query); doc['_id'] = ObjectId(); self.docs.append(doc)
        if doc is None: return SimpleNamespace(matched_count=0, modified_count=0, upserted_id=None)
        doc.update(deepcopy(update.get('$set', {})))
        if added: doc.update(deepcopy(update.get('$setOnInsert', {})))
        for key, value in update.get('$inc', {}).items(): doc[key] = doc.get(key, 0) + value
        return SimpleNamespace(matched_count=0 if added else 1, modified_count=1, upserted_id=doc['_id'] if added else None)
    async def find_one_and_update(self, query, update, upsert=False, **kwargs):
        await self.update_one(query, update, upsert); return await self.find_one(query)
    async def delete_one(self, query):
        doc = next((d for d in self.docs if matches(d, query)), None)
        if doc is not None: self.docs.remove(doc)
        return SimpleNamespace(deleted_count=int(doc is not None))
    async def create_index(self, key, **kwargs):
        if kwargs.get('unique') and isinstance(key, str): self.unique.append(key)

class InMemoryDatabase:
    def __init__(self): self.collections = {}
    def __getitem__(self, name): return self.collections.setdefault(name, MemoryCollection())
    def __getattr__(self, name): return self[name]

async def connect_db():
    global _client, _db
    settings = get_settings()
    if len(settings.SECRET_KEY) < 32 or settings.SECRET_KEY.startswith('CHANGE'):
        raise RuntimeError('Set a random SECRET_KEY with at least 32 characters.')
    if settings.ENVIRONMENT in ('production', 'staging'):
        origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(',') if origin.strip()]
        if origins != ['*'] and (not origins or any(not origin.startswith('https://') or '*' in origin for origin in origins)):
            raise RuntimeError('Staging and production require HTTPS CORS origins or the temporary * setting.')
    if settings.MONGODB_URL == 'memory://':
        if settings.ENVIRONMENT != 'test': raise RuntimeError('Memory database is only allowed in tests.')
        _db = InMemoryDatabase()
    else:
        _client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=7000, tz_aware=True)
        try: await _client.admin.command('ping')
        except Exception:
            _client.close(); _client = None
            raise RuntimeError('MongoDB connection failed. Check credentials, Atlas network access and DNS.') from None
        _db = _client[settings.MONGODB_DB_NAME]
    for name in ('projects', 'services', 'industries', 'categories'):
        await _db[name].create_index('slug', unique=True, sparse=True)
        await _db[name].create_index([('published', 1), ('order', 1)])
    await _db.projects.create_index([('industry', 1), ('published', 1)])
    await _db.projects.create_index([('categories', 1), ('published', 1)])
    await _db.admins.create_index('username', unique=True)
    await _db.sessions.create_index('jti', unique=True)
    await _db.sessions.create_index('expiresAt', expireAfterSeconds=0)
    await _db.rate_limits.create_index('key', unique=True)
    await _db.rate_limits.create_index('expiresAt', expireAfterSeconds=0)
    await _db.leads.create_index([('status', 1), ('createdAt', -1)])
    await _db.leads.create_index('createdAt')
    await _db.audit_logs.create_index('createdAt')
    await _db.media.create_index('publicId', unique=True)
    await _db.upload_tickets.create_index('expiresAt', expireAfterSeconds=0)
    await _db.events.create_index('createdAt', expireAfterSeconds=90 * 86400)
    from app.db.seeds import seed_database
    await seed_database(_db)

async def close_db():
    global _client, _db
    if _client: _client.close()
    _client = None; _db = None

def get_db():
    if _db is None: raise RuntimeError('Database is unavailable')
    return _db

def get_client(): return _client
def is_live_connection(): return _client is not None
