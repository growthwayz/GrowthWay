"""
Authentication utilities for Admin panel.
"""

from datetime import datetime, timedelta
from jose import jwt
import bcrypt
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.config import get_settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # bcrypt standard limit is 72 bytes
        plain_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hash_bytes)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    plain_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_bytes, salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    settings = get_settings()
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
