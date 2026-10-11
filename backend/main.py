"""
GrowthWay API — FastAPI application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.mongodb import connect_db, close_db
from app.routes.public import router as public_router
from app.routes.leads import router as leads_router
from app.routes.ai import router as ai_router
from app.routes.admin import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    await connect_db()
    yield
    await close_db()


settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
)

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(public_router)
app.include_router(leads_router)
app.include_router(ai_router)
app.include_router(admin_router)


@app.get("/")
async def root():
    return {"message": "GrowthWay API is running"}
