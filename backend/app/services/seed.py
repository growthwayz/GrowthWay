"""
Seed script — populates the database with placeholder records.
All records are marked isPlaceholder: true so they can be purged before launch.
Run: python -m app.services.seed
"""

import asyncio
from datetime import datetime
from app.db.mongodb import connect_db, get_db, close_db


INDUSTRIES = [
    {"slug": "startups", "name": "Startups", "shortLine": "From zero to brand recognition", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop", "order": 1},
    {"slug": "hospitality", "name": "Hospitality", "shortLine": "Experiences guests remember", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "order": 2},
    {"slug": "cafes-restaurants", "name": "Cafes & Restaurants", "shortLine": "Where taste meets visual identity", "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop", "order": 3},
    {"slug": "fashion-jewellery", "name": "Fashion & Jewellery", "shortLine": "Crafting desire through design", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop", "order": 4},
    {"slug": "beauty", "name": "Beauty", "shortLine": "Aesthetics that sell themselves", "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop", "order": 5},
    {"slug": "real-estate", "name": "Real Estate", "shortLine": "Positioning properties with purpose", "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop", "order": 6},
    {"slug": "events", "name": "Events", "shortLine": "Making moments unforgettable", "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop", "order": 7},
    {"slug": "personal-brands", "name": "Personal Brands", "shortLine": "Your story, amplified", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop", "order": 8},
    {"slug": "local-businesses", "name": "Local Businesses", "shortLine": "Neighbourhood names, national reach", "image": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop", "order": 9},
]

SERVICES = [
    {"slug": "branding", "title": "Branding & Identity", "description": "Logo, voice, and visual systems.", "order": 1},
    {"slug": "web-design", "title": "Web Design & UX", "description": "Digital experiences that convert.", "order": 2},
    {"slug": "social-media", "title": "Social Media Strategy", "description": "Engaging your audience where they are.", "order": 3},
    {"slug": "content-production", "title": "Content Production", "description": "High-quality photo and video.", "order": 4},
    {"slug": "seo-marketing", "title": "SEO & Performance Marketing", "description": "Data-driven growth strategies.", "order": 5},
]

CLIENTS = [
    {"name": "Client Logo 1", "logo": "", "order": 1},
    {"name": "Client Logo 2", "logo": "", "order": 2},
    {"name": "Client Logo 3", "logo": "", "order": 3},
    {"name": "Client Logo 4", "logo": "", "order": 4},
    {"name": "Client Logo 5", "logo": "", "order": 5},
    {"name": "Client Logo 6", "logo": "", "order": 6},
]

TESTIMONIALS = [
    {
        "quote": "Testimonial coming soon — pending client permission.",
        "personName": "Client Name",
        "role": "Founder",
        "brand": "Brand Name",
        "permissionApproved": False,
    },
]

TEAM = [
    {
        "name": "Priyanka Barnwal",
        "role": "Founder",
        "photo": "",
        "bio": "Bio pending client verification.",
        "order": 1,
        "verified": False,
    },
    {
        "name": "Ajay Ojha",
        "role": "Co-Founder",
        "photo": "",
        "bio": "Bio pending client verification.",
        "order": 2,
        "verified": False,
    },
]

SITE_SETTINGS = {
    "whatsappNumber": "",
    "email": "hello@growthway.in",
    "instagram": "",
    "linkedin": "",
    "youtube": "",
    "behance": "",
    "phone": "+91 98765 43210",
    "whyGrowthway": {
        "intro": "Everything your brand needs to grow — strategy, creativity, and execution, all under one roof.",
        "items": [
            {"word": "STRATEGY", "line": "Personalised plans rooted in real market insight."},
            {"word": "CREATIVITY", "line": "End-to-end design and content that stands out."},
            {"word": "EXECUTION", "line": "Practical, results-driven campaigns that deliver."},
        ]
    }
}


def _stamp(doc: dict) -> dict:
    """Add common audit fields to a document."""
    now = datetime.utcnow()
    return {
        **doc,
        "createdAt": now,
        "updatedAt": now,
        "createdBy": "seed",
        "published": True,
        "isPlaceholder": True,
    }


async def seed():
    await connect_db()
    db = get_db()

    # Industries
    if await db.industries.count_documents({}) == 0:
        await db.industries.insert_many([_stamp(i) for i in INDUSTRIES])
        print(f"  ✓ Seeded {len(INDUSTRIES)} industries")
    else:
        print("  – Industries already populated, skipping")

    # Clients
    if await db.clients.count_documents({}) == 0:
        docs = [{**_stamp(c), "approved": True} for c in CLIENTS]
        await db.clients.insert_many(docs)
        print(f"  ✓ Seeded {len(CLIENTS)} clients")
    else:
        print("  – Clients already populated, skipping")

    # Testimonials
    if await db.testimonials.count_documents({}) == 0:
        await db.testimonials.insert_many([_stamp(t) for t in TESTIMONIALS])
        print(f"  ✓ Seeded {len(TESTIMONIALS)} testimonials")
    else:
        print("  – Testimonials already populated, skipping")

    # Team
    if await db.team.count_documents({}) == 0:
        await db.team.insert_many([_stamp(t) for t in TEAM])
        print(f"  ✓ Seeded {len(TEAM)} team members")
    else:
        print("  – Team already populated, skipping")

    # Services
    if await db.services.count_documents({}) == 0:
        await db.services.insert_many([_stamp(s) for s in SERVICES])
        print(f"  ✓ Seeded {len(SERVICES)} services")
    else:
        print("  – Services already populated, skipping")

    # Site settings (upsert singleton)
    now = datetime.utcnow()
    await db.site_settings.update_one(
        {},
        {"$setOnInsert": {**SITE_SETTINGS, "updatedAt": now, "updatedBy": "seed"}},
        upsert=True
    )
    print("  ✓ Site settings ensured")

    # Indexes
    await db.industries.create_index("slug", unique=True)
    await db.industries.create_index("published")
    await db.industries.create_index("order")
    await db.clients.create_index("published")
    await db.clients.create_index("order")
    await db.testimonials.create_index("published")
    await db.team.create_index("published")
    await db.team.create_index("order")
    await db.services.create_index("slug", unique=True)
    await db.services.create_index("published")
    await db.services.create_index("order")
    print("  ✓ Indexes created")

    await close_db()
    print("\n✅ Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
