from fastapi import APIRouter, Depends
from app.auth.jwt import require_owner
from app.core.config import get_settings
from app.db.mongodb import is_live_connection, get_db
from app.routes.public import health

router = APIRouter(prefix='/api/service', tags=['operations'])
@router.get('/ping')
async def ping(): return {'status': 'ok'}
@router.get('/health')
async def readiness(): return await health()
@router.get('/info')
async def integrations(admin=Depends(require_owner)):
    s = get_settings()
    content = await get_db().site_settings.find_one({}) or {}
    return {'environment': s.ENVIRONMENT, 'integrations': {'mongodb': is_live_connection(), 'cloudinary': bool(s.CLOUDINARY_CLOUD_NAME and s.CLOUDINARY_API_KEY and s.CLOUDINARY_API_SECRET), 'email': bool(s.SMTP_HOST and s.EMAIL_FROM and s.NOTIFICATION_EMAIL and (not s.SMTP_USER or s.SMTP_PASSWORD)), 'whatsapp': bool(content.get('whatsappNumber') or s.WHATSAPP_NUMBER), 'ga4': bool(content.get('gaMeasurementId') or s.GA_MEASUREMENT_ID), 'searchConsole': bool(content.get('searchConsoleVerification')), 'productionDomain': bool(content.get('siteUrl') or s.SITE_URL)}}
