import hashlib
import secrets
from datetime import datetime, timedelta, timezone
import bcrypt
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from app.core.config import get_settings
from app.db.mongodb import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/admin/login', auto_error=False)
def now(): return datetime.now(timezone.utc)
def _password_bytes(password): return hashlib.sha256(password.encode('utf-8')).hexdigest().encode('ascii')
def get_password_hash(password): return 'sha256:' + bcrypt.hashpw(_password_bytes(password), bcrypt.gensalt()).decode()
def verify_password(password, hashed):
    try:
        if hashed.startswith('sha256:'): return bcrypt.checkpw(_password_bytes(password), hashed[7:].encode())
        return bcrypt.checkpw(password.encode()[:72], hashed.encode())
    except (ValueError, TypeError, AttributeError): return False

async def create_session(admin):
    settings = get_settings(); jti = secrets.token_urlsafe(32)
    expire = now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    await get_db().sessions.insert_one({'jti': jti, 'username': admin['username'], 'expiresAt': expire})
    return jwt.encode({'sub': admin['username'], 'jti': jti, 'exp': expire, 'iat': now()}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_admin(request: Request, token: str | None = Depends(oauth2_scheme)):
    settings = get_settings(); cookie_auth = not token
    token = token or request.cookies.get('gw_session')
    if not token: raise HTTPException(401, 'Sign in to continue')
    if cookie_auth and request.method not in ('GET', 'HEAD', 'OPTIONS'):
        if request.headers.get('origin') not in [o.strip() for o in settings.CORS_ORIGINS.split(',')]: raise HTTPException(403, 'Untrusted request origin')
    try: payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError: raise HTTPException(401, 'Invalid or expired session') from None
    session = await get_db().sessions.find_one({'jti': payload.get('jti'), 'username': payload.get('sub'), 'expiresAt': {'$gte': now()}})
    admin = await get_db().admins.find_one({'username': payload.get('sub'), 'active': True})
    if not session or not admin: raise HTTPException(401, 'Session revoked or account disabled')
    return {**admin, 'jti': payload['jti']}

async def require_owner(admin=Depends(get_current_admin)):
    if admin.get('role') != 'admin': raise HTTPException(403, 'Administrator access required')
    return admin
