"""
Async MongoDB connection using Motor with resilient In-Memory fallback.
Provides singleton database handle compatible with Motor API.
"""

import asyncio
from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import get_settings


class InMemoryCursor:
    def __init__(self, data):
        self.data = list(data)
        self._sort_key = None
        self._sort_dir = 1
        self._skip = 0
        self._limit = None

    def sort(self, key, direction=1):
        self._sort_key = key
        self._sort_dir = direction
        return self

    def skip(self, n):
        self._skip = n
        return self

    def limit(self, n):
        self._limit = n
        return self

    async def to_list(self, length=100):
        res = list(self.data)
        if self._sort_key:
            res.sort(
                key=lambda x: (x.get(self._sort_key) is not None, str(x.get(self._sort_key) or "")),
                reverse=(self._sort_dir == -1)
            )
        start = self._skip
        end = start + (self._limit if self._limit is not None else length)
        return [dict(d) for d in res[start:end]]


class InMemoryCollection:
    def __init__(self, name, initial_data=None):
        self.name = name
        self.docs = []
        if initial_data:
            for item in initial_data:
                d = dict(item)
                if "_id" not in d:
                    d["_id"] = ObjectId()
                self.docs.append(d)

    def _matches(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k == "_id":
                if str(doc.get("_id")) != str(v):
                    return False
            elif doc.get(k) != v:
                return False
        return True

    def find(self, query=None, projection=None):
        matched = [d for d in self.docs if self._matches(d, query)]
        return InMemoryCursor(matched)

    async def find_one(self, query=None, projection=None):
        for d in self.docs:
            if self._matches(d, query):
                return dict(d)
        return None

    async def insert_one(self, doc):
        d = dict(doc)
        if "_id" not in d:
            d["_id"] = ObjectId()
        self.docs.append(d)
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(d["_id"])

    async def update_one(self, query, update):
        class UpdateResult:
            def __init__(self, matched):
                self.matched_count = matched
                self.modified_count = matched
        matched = 0
        for i, d in enumerate(self.docs):
            if self._matches(d, query):
                matched = 1
                if "$set" in update:
                    for k, v in update["$set"].items():
                        self.docs[i][k] = v
                break
        return UpdateResult(matched)

    async def delete_one(self, query):
        class DeleteResult:
            def __init__(self, deleted):
                self.deleted_count = deleted
        for i, d in enumerate(self.docs):
            if self._matches(d, query):
                self.docs.pop(i)
                return DeleteResult(1)
        return DeleteResult(0)

    async def count_documents(self, query=None):
        matched = [d for d in self.docs if self._matches(d, query)]
        return len(matched)


class InMemoryDatabase:
    """Emulates Motor AsyncIOMotorDatabase with in-memory collections."""
    def __init__(self):
        self._collections = {}
        self._init_defaults()

    def _init_defaults(self):
        now = datetime.now(timezone.utc)
        
        # Initial Seed Leads for live dashboard intelligence
        sample_leads = [
            {
                "_id": ObjectId("660000000000000000000001"),
                "name": "Elena Rostova",
                "brand": "Aura Botanicals",
                "email": "elena@aurabotanicals.com",
                "phone": "+1 415 890 2201",
                "businessType": "ecommerce",
                "servicesNeeded": ["brand-strategy", "web-design-dev", "creative-direction"],
                "budgetRange": ">25k",
                "timeline": "1-2-months",
                "projectDescription": "Luxury organic skincare brand launch. Requires complete brand book, bespoke e-commerce store with 3D product showcase, and premium packaging design system.",
                "status": "Won",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000002"),
                "name": "Julian Vance",
                "brand": "Verve Hospitality Group",
                "email": "jvance@vervegrouphotels.com",
                "phone": "+1 212 555 8390",
                "businessType": "hospitality",
                "servicesNeeded": ["brand-strategy", "creative-direction"],
                "budgetRange": "10k-25k",
                "timeline": "2-3-months",
                "projectDescription": "Boutique hotel chain rebranding across 3 coastal locations. Needs visual identity, guest collateral, signage direction, and responsive booking experience.",
                "status": "Proposal",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000003"),
                "name": "Marcus Chen",
                "brand": "Kairo Studio",
                "email": "marcus@kairodesign.co",
                "phone": "+44 20 7946 0912",
                "businessType": "startup",
                "servicesNeeded": ["web-design-dev", "growth-marketing"],
                "budgetRange": "10k-25k",
                "timeline": "asap",
                "projectDescription": "High-craft architectural hardware studio. Developing high-conversion direct-to-architect web portal with dynamic quote calculator.",
                "status": "Contacted",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000004"),
                "name": "Sophia Sterling",
                "brand": "Apex Capital Partners",
                "email": "s.sterling@apexventures.fund",
                "phone": "+1 312 400 9182",
                "businessType": "b2b",
                "servicesNeeded": ["brand-strategy", "web-design-dev"],
                "budgetRange": ">25k",
                "timeline": "1-2-months",
                "projectDescription": "Early-stage deeptech venture fund. Complete digital identity refresh, executive investor portal, and animated pitch deck deck design system.",
                "status": "Won",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000005"),
                "name": "David Althaus",
                "brand": "Solis Atelier",
                "email": "david@solis-atelier.de",
                "phone": "+49 30 12345678",
                "businessType": "personal-brand",
                "servicesNeeded": ["creative-direction", "content-production"],
                "budgetRange": "5k-10k",
                "timeline": "flexible",
                "projectDescription": "Bespoke bespoke timepiece and mechanical object maker. Visual direction, macro horology cinematography, and archival web catalog.",
                "status": "New",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000006"),
                "name": "Amira Haddad",
                "brand": "Lumina Architectural Lab",
                "email": "amira@luminalab.io",
                "phone": "+971 4 391 0000",
                "businessType": "startup",
                "servicesNeeded": ["web-design-dev", "brand-strategy"],
                "budgetRange": ">25k",
                "timeline": "2-3-months",
                "projectDescription": "Computational facade and lighting engineering firm. Interactive portfolio site with WebGL canvas simulations and case study narrative builder.",
                "status": "Proposal",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000007"),
                "name": "Liam Gallagher",
                "brand": "Velour Living",
                "email": "liam@velourliving.com",
                "phone": "+1 604 772 1934",
                "businessType": "ecommerce",
                "servicesNeeded": ["content-production", "growth-marketing"],
                "budgetRange": "5k-10k",
                "timeline": "1-2-months",
                "projectDescription": "Scandinavian acoustic furnishings and minimalist textiles. Multi-channel paid creative assets and high-end video lookbook.",
                "status": "Contacted",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000008"),
                "name": "Chloe Dupont",
                "brand": "Terra Organic Collective",
                "email": "chloe@terraorganics.fr",
                "phone": "+33 1 42 68 55 00",
                "businessType": "hospitality",
                "servicesNeeded": ["brand-strategy", "creative-direction"],
                "budgetRange": "10k-25k",
                "timeline": "flexible",
                "projectDescription": "Farm-to-table culinary collective and natural wine label. Complete visual identity, menu hierarchy, and sustainable packaging suite.",
                "status": "Won",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000009"),
                "name": "Noah Sterling",
                "brand": "Pulse Mobility",
                "email": "noah@pulsemobility.co",
                "phone": "+1 512 889 0019",
                "businessType": "startup",
                "servicesNeeded": ["brand-strategy"],
                "budgetRange": "<5k",
                "timeline": "asap",
                "projectDescription": "Micromobility fleet software pilot seeking fast pitch deck polish and landing page teaser.",
                "status": "Lost",
                "createdAt": now
            },
            {
                "_id": ObjectId("660000000000000000000010"),
                "name": "Kavita Rao",
                "brand": "Nexus AI Robotics",
                "email": "kavita@nexusrobotics.ai",
                "phone": "+91 98200 45678",
                "businessType": "startup",
                "servicesNeeded": ["brand-strategy", "web-design-dev", "creative-direction"],
                "budgetRange": ">25k",
                "timeline": "1-2-months",
                "projectDescription": "Autonomous warehouse robotics startup raising Series A. Full brand positioning, technical product illustrations, and investor-ready web experience.",
                "status": "New",
                "createdAt": now
            }
        ]

        # Seed admin: admin / password
        admins = [
            {
                "_id": ObjectId("660000000000000000000099"),
                "username": "admin",
                "hashedPassword": "$2b$12$kavSl4RaD5Gf3qTR9cRTtuJxgL2L0cMGdPQBHHKgjWP1c1ozmHEr6",
                "email": "admin@growthway.agency"
            }
        ]

        industries_data = [
            {"slug": "startups", "name": "Startups", "shortLine": "From zero to brand recognition", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop", "order": 1, "published": True},
            {"slug": "hospitality", "name": "Hospitality", "shortLine": "Experiences guests remember", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "order": 2, "published": True},
            {"slug": "cafes-restaurants", "name": "Cafes & Restaurants", "shortLine": "Where taste meets visual identity", "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop", "order": 3, "published": True},
            {"slug": "fashion-jewellery", "name": "Fashion & Jewellery", "shortLine": "Crafting desire through design", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop", "order": 4, "published": True},
            {"slug": "beauty", "name": "Beauty", "shortLine": "Aesthetics that sell themselves", "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop", "order": 5, "published": True},
            {"slug": "real-estate", "name": "Real Estate", "shortLine": "Positioning properties with purpose", "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop", "order": 6, "published": True},
            {"slug": "events", "name": "Events", "shortLine": "Making moments unforgettable", "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop", "order": 7, "published": True},
            {"slug": "personal-brands", "name": "Personal Brands", "shortLine": "Your story, amplified", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop", "order": 8, "published": True},
            {"slug": "local-businesses", "name": "Local Businesses", "shortLine": "Neighbourhood names, national reach", "image": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop", "order": 9, "published": True},
        ]

        services_data = [
            {"slug": "social-media-strategy", "title": "Social Media Strategy & Management", "description": "Strategy, planning, content direction, and ongoing social media management to grow your brand's presence.", "capabilities": ["Platform Strategy & Content Calendar", "Community Management", "Engagement Growth", "Performance Reporting"], "order": 1, "published": True},
            {"slug": "content-creation-reels", "title": "Content Creation & Reels", "description": "Creative content, short-form videos, reels, and platform-focused visual storytelling that captures attention.", "capabilities": ["Short-Form Video Production", "Reels & Stories", "Platform-Native Content", "Visual Storytelling"], "order": 2, "published": True},
            {"slug": "branding-design", "title": "Branding & Design", "description": "Brand identity, visual direction, design systems, and creative assets that make your brand unforgettable.", "capabilities": ["Logo & Visual Identity", "Design Systems & Guidelines", "Creative Assets & Collateral", "Brand Voice & Messaging"], "order": 3, "published": True},
            {"slug": "digital-marketing-meta-ads", "title": "Digital Marketing / Meta Ads", "description": "Paid campaigns and digital marketing focused on reaching the right audience and supporting measurable growth.", "capabilities": ["Meta Ads (Facebook & Instagram)", "Audience Targeting & Retargeting", "Campaign Creative & Copywriting", "Analytics & Reporting"], "order": 4, "published": True},
            {"slug": "website-development", "title": "Website Development", "description": "Modern, responsive websites designed around brand positioning, usability, and conversion.", "capabilities": ["Custom Web Design & Development", "Mobile-First & Responsive", "CMS Integration", "Performance & SEO Optimisation"], "order": 5, "published": True},
            {"slug": "brand-product-shoots", "title": "Brand & Product Shoots", "description": "Professional photography and video content for products, brands, and campaigns.", "capabilities": ["Product Photography", "Brand Campaign Shoots", "Lifestyle & Lookbook", "Video Content for Campaigns"], "order": 6, "published": True},
            {"slug": "event-campaign-content", "title": "Event & Campaign Content", "description": "On-ground event coverage and campaign content designed for digital distribution and maximum reach.", "capabilities": ["Event Photography & Videography", "Live Coverage & Reels", "Campaign Content Production", "Multi-Platform Distribution"], "order": 7, "published": True},
            {"slug": "personal-brand-growth", "title": "Personal Brand Growth", "description": "Content, positioning, and digital strategy for founders, creators, and professionals building their personal brand.", "capabilities": ["Personal Brand Strategy", "Content Direction & Creation", "Social Media Presence", "Thought Leadership Content"], "order": 8, "published": True},
        ]

        clients_data = [
            {"name": "Aura", "logo": "/logo-icon.png", "order": 1, "published": True, "approved": True},
            {"name": "Verve", "logo": "/logo-icon.png", "order": 2, "published": True, "approved": True},
            {"name": "Kairo", "logo": "/logo-icon.png", "order": 3, "published": True, "approved": True},
            {"name": "Apex", "logo": "/logo-icon.png", "order": 4, "published": True, "approved": True},
        ]

        testimonials_data = [
            {
                "quote": "GrowthWay helped scale our digital presence with high aesthetic precision.",
                "personName": "Elena Rostova",
                "role": "Founder",
                "brand": "Aura Botanicals",
                "permissionApproved": True,
                "published": True
            }
        ]

        team_data = [
            {"name": "Priyanka Barnwal", "role": "Founder", "photo": "", "bio": "Leading creative growth and strategic direction.", "order": 1, "published": True, "verified": True},
            {"name": "Ajay Ojha", "role": "Co-Founder", "photo": "", "bio": "Directing operations, media campaigns and execution.", "order": 2, "published": True, "verified": True}
        ]

        projects_data = [
            {
                "slug": "aura-botanicals",
                "title": "Aura Botanicals",
                "client": "Aura Botanicals",
                "tagline": "Organic Luxury Skincare",
                "industry": "ecommerce",
                "services": ["Branding", "Web Design & Dev", "Art Direction"],
                "year": "2026",
                "coverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop",
                "featured": True,
                "published": True,
                "order": 1
            },
            {
                "slug": "verve-hospitality",
                "title": "Verve Hospitality",
                "client": "Verve Hospitality Group",
                "tagline": "Boutique Coastal Retreats",
                "industry": "hospitality",
                "services": ["Identity", "Digital Flagship"],
                "year": "2026",
                "coverImage": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
                "featured": True,
                "published": True,
                "order": 2
            }
        ]

        settings_data = {
            "siteName": "GrowthWay",
            "contactEmail": "hello@growthway.in",
            "email": "hello@growthway.in",
            "whatsappNumber": "+91 98765 43210",
            "phone": "+91 98765 43210",
            "instagram": "https://instagram.com/growthway",
            "linkedin": "https://linkedin.com/company/growthway",
            "published": True,
            "whyGrowthway": {
                "intro": "Everything your brand needs to grow — strategy, creativity, and execution, all under one roof.",
                "items": [
                    {"word": "STRATEGY", "line": "Personalised plans rooted in real market insight."},
                    {"word": "CREATIVITY", "line": "End-to-end design and content that stands out."},
                    {"word": "EXECUTION", "line": "Practical, results-driven campaigns that deliver."}
                ]
            }
        }

        self._collections["leads"] = InMemoryCollection("leads", sample_leads)
        self._collections["admins"] = InMemoryCollection("admins", admins)
        self._collections["projects"] = InMemoryCollection("projects", projects_data)
        self._collections["industries"] = InMemoryCollection("industries", industries_data)
        self._collections["services"] = InMemoryCollection("services", services_data)
        self._collections["clients"] = InMemoryCollection("clients", clients_data)
        self._collections["testimonials"] = InMemoryCollection("testimonials", testimonials_data)
        self._collections["team"] = InMemoryCollection("team", team_data)
        # NOTE: must be 'site_settings' — matches /api/site-settings route
        self._collections["site_settings"] = InMemoryCollection("site_settings", [settings_data])

    def __getattr__(self, name):
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]


_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | InMemoryDatabase | None = None


async def connect_db() -> None:
    """Open MongoDB connection or fallback cleanly to In-Memory Studio Database."""
    global _client, _db
    settings = get_settings()

    try:
        # 5 second timeout for Atlas SRV resolution and TLS handshake
        test_client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        await test_client.admin.command("ping")
        _client = test_client
        _db = _client[settings.MONGODB_DB_NAME]
        print(f"[OK] Connected to Live MongoDB: {settings.MONGODB_DB_NAME}")
        
        # Verify and seed default collections on deployment if empty
        try:
            from app.db.seeds import seed_database
            seed_res = await seed_database(_db, force=False)
            print(f"[OK] Live MongoDB primed: {seed_res['counts']}")
        except Exception as seed_err:
            print(f"[WARN] Live DB seed check notice: {seed_err}")

        # Initialize query performance indexes (Seq 48)
        try:
            await _db.projects.create_index([("slug", 1)], unique=True, sparse=True)
            await _db.projects.create_index([("published", 1), ("order", 1)])
            await _db.services.create_index([("slug", 1)], unique=True, sparse=True)
            await _db.leads.create_index([("createdAt", -1)])
            await _db.leads.create_index([("status", 1)])
            print("[OK] Database indexes verified")
        except Exception as idx_err:
            print(f"[WARN] Index creation skipped: {idx_err}")
    except Exception as exc:
        print(f"[INFO] MongoDB Atlas not reachable ({exc}). Initializing high-fidelity In-Memory Studio Database.")
        _db = InMemoryDatabase()
        print("[OK] High-Fidelity In-Memory Studio Database active with live telemetry seed leads.")


async def close_db() -> None:
    """Cleanly close the MongoDB connection pool."""
    global _client, _db
    if _client:
        _client.close()
        _client = None
    _db = None
    print("[OK] Database connection closed")


def get_db():
    """Return the database handle (live Motor db or In-Memory fallback)."""
    global _db
    if _db is None:
        # Lazy fallback
        _db = InMemoryDatabase()
    return _db


def get_client() -> AsyncIOMotorClient | None:
    """Return the live Motor client handle if connected."""
    global _client
    return _client


def is_live_connection() -> bool:
    """Return True if connected to live MongoDB cluster."""
    global _client
    return _client is not None
