from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.mongodb import connect_db, close_db
from app.routes import public, leads, admin, service, media

settings = get_settings()
@asynccontextmanager
async def lifespan(app):
    await connect_db()
    yield
    await close_db()

app = FastAPI(title=settings.APP_NAME, lifespan=lifespan, docs_url='/docs' if settings.ENVIRONMENT in ('development', 'test') else None, redoc_url=None)
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(',') if o.strip()], allow_credentials=True, allow_methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allow_headers=['Content-Type', 'Authorization'])

@app.middleware('http')
async def security(request: Request, call_next):
    try:
        content_length = int(request.headers.get('content-length', '0') or 0)
    except ValueError:
        return JSONResponse({'detail': 'Invalid content length'}, status_code=400)
    if content_length > 100000:
        return JSONResponse({'detail': 'Request is too large'}, status_code=413)
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    if request.url.path.startswith('/api/admin'): response.headers['Cache-Control'] = 'no-store'
    if settings.ENVIRONMENT in ('production', 'staging'): response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

@app.exception_handler(Exception)
async def unexpected_error(request, exc):
    # Never expose credentials or personal information through database/SMTP errors.
    logging.getLogger('growthway').error('Request failed: %s %s (%s)', request.method, request.url.path, type(exc).__name__)
    return JSONResponse({'detail': 'Unable to complete this request. Please try again.'}, status_code=503)

for router in (public.router, leads.router, admin.router, media.router, service.router): app.include_router(router)
# The excluded AI implementation stays disabled, including its demo responses.
if settings.AI_ENABLED:
    from app.routes.ai import router
    app.include_router(router)
@app.get('/')
async def root(): return {'message': 'GrowthWay API'}
@app.get('/health')
async def health(): return await public.health()
