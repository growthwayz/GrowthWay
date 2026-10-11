"""
Pydantic schemas for all Phase A content collections.
Every content model includes createdAt, updatedAt, createdBy, published.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Shared base ──────────────────────────────────────────

class ContentBase(BaseModel):
    """Fields common to all CMS-managed content."""
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    createdBy: str = "system"
    published: bool = True

# ── Projects (Phase C) ───────────────────────────────────

class ProjectOut(BaseModel):
    slug: str
    title: str
    client: str
    industry: str
    services: list[str] = []
    coverImage: str = ""
    coverImageAlt: str = ""
    gallery: list[str] = []
    galleryCaptions: list[str] = []
    challenge: str = ""
    strategy: str = ""
    execution: str = ""
    results: list[dict] = []
    featured: bool = False
    order: int = 0

class ProjectInDB(ContentBase, ProjectOut):
    isPlaceholder: bool = True


# ── Industries (items 19-20) ─────────────────────────────

class IndustryOut(BaseModel):
    slug: str
    name: str
    shortLine: str = ""
    image: str = ""
    imageAlt: str = ""
    order: int = 0

class IndustryInDB(ContentBase, IndustryOut):
    isPlaceholder: bool = True


# ── Clients (item 22) ────────────────────────────────────

class ClientOut(BaseModel):
    name: str
    logo: str = ""
    logoAlt: str = ""
    url: Optional[str] = None
    order: int = 0

class ClientInDB(ContentBase, ClientOut):
    approved: bool = True
    isPlaceholder: bool = True


# ── Testimonials (items 23-24) ───────────────────────────

class TestimonialOut(BaseModel):
    quote: str
    personName: str
    role: str = ""
    brand: str = ""
    logo: Optional[str] = None

class TestimonialInDB(ContentBase, TestimonialOut):
    permissionApproved: bool = False
    isPlaceholder: bool = True


# ── Team / Founders (items 25-26) ────────────────────────

class TeamMemberOut(BaseModel):
    name: str
    role: str
    photo: str = ""
    photoAlt: str = ""
    bio: str = ""
    order: int = 0

class TeamMemberInDB(ContentBase, TeamMemberOut):
    verified: bool = False
    isPlaceholder: bool = True


# ── Site Settings (items 21, 27, 29) ─────────────────────

class WhyGrowthwayItem(BaseModel):
    word: str
    line: str

class WhyGrowthway(BaseModel):
    intro: str = ""
    items: list[WhyGrowthwayItem] = []

class SiteSettingsOut(BaseModel):
    whatsappNumber: str = ""
    email: str = ""
    instagram: str = ""
    linkedin: str = ""
    youtube: str = ""
    behance: str = ""
    phone: str = ""
    whyGrowthway: WhyGrowthway = WhyGrowthway()

class SiteSettingsInDB(SiteSettingsOut):
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    updatedBy: str = "system"


# ── Error schema ─────────────────────────────────────────

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: list[str] = []

class ErrorResponse(BaseModel):
    error: ErrorDetail


# ── Services (Phase B/C) ─────────────────────────────────

class ServiceOut(BaseModel):
    slug: str
    title: str
    description: str = ""
    capabilities: list[str] = []
    order: int = 0

class ServiceInDB(ContentBase, ServiceOut):
    isPlaceholder: bool = True


# ── Leads (Phase B) ──────────────────────────────────────

class LeadCreate(BaseModel):
    name: str
    brand: str
    email: str
    phone: Optional[str] = None
    businessType: str
    servicesNeeded: list[str]
    budgetRange: Optional[str] = None
    timeline: Optional[str] = None
    projectDescription: str
    consent: bool

class LeadInDB(LeadCreate):
    status: str = "New"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    source: str = "organic"
    pageUrl: Optional[str] = None
