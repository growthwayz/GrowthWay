"""
Public API routes for Phase A content.
All GET endpoints return published-only records.
"""

from fastapi import APIRouter, HTTPException
from app.db.mongodb import get_db
from app.models.schemas import (
    IndustryOut, ClientOut, TestimonialOut,
    TeamMemberOut, SiteSettingsOut, ErrorResponse, ServiceOut, ProjectOut
)

router = APIRouter(prefix="/api", tags=["public"])


# ── Projects ─────────────────────────────────────────────

@router.get("/projects", response_model=list[ProjectOut])
async def get_projects(industry: str = None, featured: bool = None):
    """Return published projects, optionally filtered."""
    db = get_db()
    query = {"published": True}
    if industry:
        query["industry"] = industry
    if featured is not None:
        query["featured"] = featured
        
    cursor = db.projects.find(
        query,
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "isPlaceholder": 0}
    ).sort("order", 1)
    return await cursor.to_list(length=100)

@router.get("/projects/{slug}", response_model=ProjectOut)
async def get_project(slug: str):
    """Return a single project by slug."""
    db = get_db()
    doc = await db.projects.find_one(
        {"slug": slug, "published": True},
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "isPlaceholder": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut(**doc)

# ── Services ─────────────────────────────────────────────

@router.get("/services", response_model=list[ServiceOut])
async def get_services():
    """Return all published services, ordered."""
    db = get_db()
    cursor = db.services.find(
        {"published": True},
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "isPlaceholder": 0}
    ).sort("order", 1)
    return await cursor.to_list(length=100)

@router.get("/services/{slug}", response_model=ServiceOut)
async def get_service(slug: str):
    """Return a single service by slug."""
    db = get_db()
    doc = await db.services.find_one(
        {"slug": slug, "published": True},
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "isPlaceholder": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceOut(**doc)


# ── Industries ───────────────────────────────────────────

@router.get("/industries", response_model=list[IndustryOut])
async def get_industries():
    """Return all published industries, ordered."""
    db = get_db()
    cursor = db.industries.find(
        {"published": True},
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "isPlaceholder": 0}
    ).sort("order", 1)
    return await cursor.to_list(length=100)


# ── Clients ──────────────────────────────────────────────

@router.get("/clients", response_model=list[ClientOut])
async def get_clients():
    """Return all approved, published clients."""
    db = get_db()
    cursor = db.clients.find(
        {"published": True, "approved": True},
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "approved": 0, "isPlaceholder": 0}
    ).sort("order", 1)
    return await cursor.to_list(length=100)


# ── Testimonials ─────────────────────────────────────────

@router.get("/testimonials", response_model=list[TestimonialOut])
async def get_testimonials():
    """Return published, permission-approved testimonials."""
    db = get_db()
    cursor = db.testimonials.find(
        {"published": True, "permissionApproved": True},
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "permissionApproved": 0, "isPlaceholder": 0}
    ).sort("_id", -1)
    return await cursor.to_list(length=50)


# ── Team ─────────────────────────────────────────────────

@router.get("/team", response_model=list[TeamMemberOut])
async def get_team():
    """Return published team members."""
    db = get_db()
    cursor = db.team.find(
        {"published": True},
        {"_id": 0, "createdAt": 0, "updatedAt": 0, "createdBy": 0,
         "published": 0, "isPlaceholder": 0, "verified": 0}
    ).sort("order", 1)
    return await cursor.to_list(length=20)


# ── Site Settings ────────────────────────────────────────

@router.get("/site-settings", response_model=SiteSettingsOut)
async def get_site_settings():
    """Return the singleton site settings document."""
    db = get_db()
    doc = await db.site_settings.find_one(
        {},
        {"_id": 0, "updatedAt": 0, "updatedBy": 0}
    )
    if not doc:
        return SiteSettingsOut()
    return SiteSettingsOut(**doc)


# ── Health ───────────────────────────────────────────────

@router.get("/health")
async def health_check():
    """Simple health check."""
    try:
        db = get_db()
        await db.command("ping")
        return {"status": "ok", "db": "connected"}
    except Exception:
        raise HTTPException(status_code=503, detail="Database unavailable")
