"""
Service and Deployment API for GrowthWay.
Provides deployment readiness probes, database migration/seeding,
system diagnostics, and third-party service verification.
"""

import time
import sys
from datetime import datetime, timezone
from fastapi import APIRouter, Query, Request
from app.core.config import get_settings
from app.db.mongodb import get_db, get_client, is_live_connection
from app.db.seeds import seed_database

router = APIRouter(prefix="/api/service", tags=["service", "deployment"])
START_TIME = time.time()


@router.get("/ping")
@router.post("/ping")
async def ping():
    """Ultra-low latency probe for Docker/Render/Railway/Kubernetes liveness checks."""
    return {
        "status": "ok",
        "ping": "pong",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.get("/health")
async def deployment_health():
    """
    Comprehensive deployment readiness and health audit.
    Verifies MongoDB connection, collection states, and integration secrets.
    """
    settings = get_settings()
    db = get_db()
    client = get_client()
    is_live_atlas = is_live_connection()

    # Test DB latency
    t0 = time.time()
    db_connected = False
    try:
        if is_live_atlas and client:
            await client.admin.command("ping")
        else:
            await db.site_settings.find_one({})
        db_connected = True
    except Exception:
        db_connected = False
    latency_ms = round((time.time() - t0) * 1000, 2)

    # Collection telemetry
    collection_stats = {}
    for col_name in ["services", "industries", "projects", "clients", "testimonials", "team", "site_settings", "leads"]:
        try:
            collection_stats[col_name] = await db[col_name].count_documents({})
        except Exception:
            collection_stats[col_name] = 0

    # Integration diagnostics
    cloudinary_key = settings.CLOUDINARY_API_KEY
    cloudinary_masked = (
        f"{cloudinary_key[:4]}****{cloudinary_key[-4:]}"
        if len(cloudinary_key) >= 8 else ("configured" if cloudinary_key else "missing")
    )

    integrations = {
        "mongodb_atlas": {
            "configured": bool(settings.MONGODB_URL and "mongodb" in settings.MONGODB_URL),
            "connected": db_connected,
            "engine": "MongoDB Atlas Cluster0" if is_live_atlas else "In-Memory Studio Database",
            "latency_ms": latency_ms,
            "database_name": settings.MONGODB_DB_NAME,
        },
        "cloudinary": {
            "configured": bool(settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET),
            "cloud_name": settings.CLOUDINARY_CLOUD_NAME or "(default: growthway)",
            "api_key": cloudinary_masked,
        },
        "email_smtp": {
            "configured": bool(settings.SMTP_HOST and settings.SMTP_USER),
            "from_address": settings.EMAIL_FROM,
            "notification_recipient": settings.NOTIFICATION_EMAIL or "hello@growthway.in",
        },
        "whatsapp": {
            "configured": bool(settings.WHATSAPP_NUMBER),
            "target": settings.WHATSAPP_NUMBER or "+919876543210",
        },
        "ai_copilot": {
            "configured": bool(settings.AI_API_KEY),
            "provider": settings.AI_PROVIDER or "openai",
        }
    }

    uptime_seconds = round(time.time() - START_TIME, 1)
    is_ready = db_connected and (collection_stats.get("services", 0) > 0)

    return {
        "status": "healthy" if is_ready else "degraded",
        "app_name": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "is_ready_for_traffic": is_ready,
        "uptime_seconds": uptime_seconds,
        "integrations": integrations,
        "database_collections": collection_stats,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.post("/seed")
async def deployment_seed(force: bool = Query(False, description="Force overwrite existing collections with seed data")):
    """
    Automated deployment migration / seeding endpoint.
    Idempotently populates MongoDB Atlas with the official 8 services,
    9 industries, portfolio projects, team, testimonials, clients, and site settings.
    """
    db = get_db()
    result = await seed_database(db, force=force)
    return {
        "status": "success",
        "message": "Deployment database seed completed",
        "force_applied": force,
        "engine": "MongoDB Atlas" if is_live_connection() else "In-Memory Database",
        "details": result,
    }


@router.get("/info")
async def deployment_info(request: Request):
    """System information, deployment architecture, and host recommendations."""
    settings = get_settings()
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

    routes_list = []
    for route in request.app.routes:
        if hasattr(route, "path") and hasattr(route, "methods"):
            routes_list.append({"path": route.path, "methods": list(route.methods)})

    return {
        "app_name": settings.APP_NAME,
        "python_version": sys.version.split(" ")[0],
        "fastapi": "0.115.0",
        "cors_origins": origins,
        "deployment_architecture": {
            "frontend_hosting": ["Vercel", "Cloudflare Pages", "Netlify"],
            "api_backend_hosting": ["Render", "Railway", "AWS ECS / App Runner", "Fly.io"],
            "database": "MongoDB Atlas (Cluster0)",
            "media_cdn": "Cloudinary",
        },
        "total_registered_routes": len(routes_list),
        "service_endpoints": [
            {"method": "GET", "path": "/api/service/health", "description": "Deployment readiness and integration probe"},
            {"method": "POST", "path": "/api/service/seed", "description": "Seed/migrate MongoDB Atlas database"},
            {"method": "GET", "path": "/api/service/ping", "description": "Liveness probe for load balancers"},
            {"method": "GET", "path": "/api/service/info", "description": "Deployment architecture and routes manifest"},
        ]
    }
