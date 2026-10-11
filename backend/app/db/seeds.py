"""
Canonical seed data and database population utilities for GrowthWay.
Supports both MongoDB Atlas (live) and In-Memory fallback.
"""

from datetime import datetime, timezone
from bson import ObjectId


def get_canonical_seed_data():
    now = datetime.now(timezone.utc)

    services_data = [
        {
            "slug": "social-media-strategy",
            "title": "Social Media Strategy & Management",
            "description": "Strategy, planning, content direction, and ongoing social media management to grow your brand's presence.",
            "capabilities": ["Platform Strategy & Content Calendar", "Community Management", "Engagement Growth", "Performance Reporting"],
            "order": 1,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "content-creation-reels",
            "title": "Content Creation & Reels",
            "description": "Creative content, short-form videos, reels, and platform-focused visual storytelling that captures attention.",
            "capabilities": ["Short-Form Video Production", "Reels & Stories", "Platform-Native Content", "Visual Storytelling"],
            "order": 2,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "branding-design",
            "title": "Branding & Design",
            "description": "Brand identity, visual direction, design systems, and creative assets that make your brand unforgettable.",
            "capabilities": ["Logo & Visual Identity", "Design Systems & Guidelines", "Creative Assets & Collateral", "Brand Voice & Messaging"],
            "order": 3,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "digital-marketing-meta-ads",
            "title": "Digital Marketing / Meta Ads",
            "description": "Paid campaigns and digital marketing focused on reaching the right audience and supporting measurable growth.",
            "capabilities": ["Meta Ads (Facebook & Instagram)", "Audience Targeting & Retargeting", "Campaign Creative & Copywriting", "Analytics & Reporting"],
            "order": 4,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "website-development",
            "title": "Website Development",
            "description": "Modern, responsive websites designed around brand positioning, usability, and conversion.",
            "capabilities": ["Custom Web Design & Development", "Mobile-First & Responsive", "CMS Integration", "Performance & SEO Optimisation"],
            "order": 5,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "brand-product-shoots",
            "title": "Brand & Product Shoots",
            "description": "Professional photography and video content for products, brands, and campaigns.",
            "capabilities": ["Product Photography", "Brand Campaign Shoots", "Lifestyle & Lookbook", "Video Content for Campaigns"],
            "order": 6,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "event-campaign-content",
            "title": "Event & Campaign Content",
            "description": "On-ground event coverage and campaign content designed for digital distribution and maximum reach.",
            "capabilities": ["Event Photography & Videography", "Live Coverage & Reels", "Campaign Content Production", "Multi-Platform Distribution"],
            "order": 7,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "personal-brand-growth",
            "title": "Personal Brand Growth",
            "description": "Content, positioning, and digital strategy for founders, creators, and professionals building their personal brand.",
            "capabilities": ["Personal Brand Strategy", "Content Direction & Creation", "Social Media Presence", "Thought Leadership Content"],
            "order": 8,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
    ]

    industries_data = [
        {"slug": "startups", "name": "Startups", "shortLine": "From zero to brand recognition", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop", "imageAlt": "Startup workspace collaboration", "order": 1, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "hospitality", "name": "Hospitality", "shortLine": "Experiences guests remember", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "imageAlt": "Luxury boutique hotel interior", "order": 2, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "cafes-restaurants", "name": "Cafes & Restaurants", "shortLine": "Where taste meets visual identity", "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop", "imageAlt": "Artisanal cafe ambience", "order": 3, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "fashion-jewellery", "name": "Fashion & Jewellery", "shortLine": "Crafting desire through design", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop", "imageAlt": "Fine jewellery and fashion showcase", "order": 4, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "beauty", "name": "Beauty", "shortLine": "Aesthetics that sell themselves", "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop", "imageAlt": "Organic beauty and skincare", "order": 5, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "real-estate", "name": "Real Estate", "shortLine": "Positioning properties with purpose", "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop", "imageAlt": "Modern architectural property", "order": 6, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "events", "name": "Events", "shortLine": "Making moments unforgettable", "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop", "imageAlt": "High production creative event stage", "order": 7, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "personal-brands", "name": "Personal Brands", "shortLine": "Your story, amplified", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop", "imageAlt": "Founder personal brand portrait", "order": 8, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"slug": "local-businesses", "name": "Local Businesses", "shortLine": "Neighbourhood names, national reach", "image": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop", "imageAlt": "Local business retail store", "order": 9, "published": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
    ]

    projects_data = [
        {
            "slug": "aura-botanicals",
            "title": "Aura Botanicals",
            "client": "Aura Botanicals",
            "industry": "ecommerce",
            "services": ["Branding", "Web Design & Dev", "Art Direction"],
            "coverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop",
            "coverImageAlt": "Aura Botanicals luxury skincare packaging and product design",
            "gallery": [
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop"
            ],
            "galleryCaptions": [
                "Primary cosmetic packaging and bottle typography",
                "Botanical ingredient visual palette"
            ],
            "challenge": "Aura Botanicals needed an elevated brand identity and high-conversion e-commerce flagship to enter the competitive premium skincare segment.",
            "strategy": "We engineered an organic luxury visual system rooted in botanical minimalism, supported by 3D product renders and frictionless checkout.",
            "execution": "Delivered bespoke identity, packaging guidelines, responsive Shopify storefront, and cinematic launch campaign assets.",
            "results": [
                {"metric": "+140%", "label": "Direct-to-consumer launch velocity"},
                {"metric": "3.8x", "label": "Return on ad spend across Meta Ads"}
            ],
            "featured": True,
            "order": 1,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "slug": "verve-hospitality",
            "title": "Verve Hospitality",
            "client": "Verve Hospitality Group",
            "industry": "hospitality",
            "services": ["Identity", "Digital Flagship"],
            "coverImage": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
            "coverImageAlt": "Verve Hospitality boutique coastal resort architecture",
            "gallery": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop"
            ],
            "galleryCaptions": ["Coastal resort suite and ocean terrace"],
            "challenge": "Consolidating 3 distinct coastal boutique destinations under a cohesive contemporary hospitality brand.",
            "strategy": "Developed an evocative editorial identity system that captures relaxed coastal sophistication.",
            "execution": "Produced brand guidelines, signage typography, custom guest collateral, and mobile-first booking experience.",
            "results": [
                {"metric": "+85%", "label": "Direct website bookings within 60 days"},
                {"metric": "-32%", "label": "Third-party OTA commission dependency"}
            ],
            "featured": True,
            "order": 2,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        }
    ]

    clients_data = [
        {"name": "Aura Botanicals", "logo": "/logo-icon.png", "logoAlt": "Aura Botanicals Logo", "order": 1, "published": True, "approved": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"name": "Verve Hospitality", "logo": "/logo-icon.png", "logoAlt": "Verve Hospitality Logo", "order": 2, "published": True, "approved": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"name": "Kairo Studio", "logo": "/logo-icon.png", "logoAlt": "Kairo Studio Logo", "order": 3, "published": True, "approved": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
        {"name": "Apex Capital", "logo": "/logo-icon.png", "logoAlt": "Apex Capital Logo", "order": 4, "published": True, "approved": True, "createdAt": now, "updatedAt": now, "createdBy": "seed", "isPlaceholder": False},
    ]

    testimonials_data = [
        {
            "quote": "GrowthWay helped scale our digital presence with high aesthetic precision and measurable customer engagement.",
            "personName": "Elena Rostova",
            "role": "Founder",
            "brand": "Aura Botanicals",
            "logo": "/logo-icon.png",
            "permissionApproved": True,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        }
    ]

    team_data = [
        {
            "name": "Priyanka Barnwal",
            "role": "Founder",
            "photo": "",
            "photoAlt": "Priyanka Barnwal, Founder of GrowthWay",
            "bio": "Leading creative growth, brand positioning, and strategic design systems.",
            "order": 1,
            "published": True,
            "verified": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
        },
        {
            "name": "Ajay Ojha",
            "role": "Co-Founder",
            "photo": "",
            "photoAlt": "Ajay Ojha, Co-Founder of GrowthWay",
            "bio": "Directing growth marketing, media campaigns, and technical execution.",
            "order": 2,
            "published": True,
            "verified": True,
            "createdAt": now,
            "updatedAt": now,
            "createdBy": "seed",
            "isPlaceholder": False,
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
        "youtube": "",
        "behance": "",
        "published": True,
        "whyGrowthway": {
            "intro": "Everything your brand needs to grow — strategy, creativity, and execution, all under one roof.",
            "items": [
                {"word": "STRATEGY", "line": "Personalised plans rooted in real market insight."},
                {"word": "CREATIVITY", "line": "End-to-end design and content that stands out."},
                {"word": "EXECUTION", "line": "Practical, results-driven campaigns that deliver."}
            ]
        },
        "updatedAt": now,
        "updatedBy": "seed",
    }

    admins_data = [
        {
            "_id": ObjectId("660000000000000000000099"),
            "username": "admin",
            "hashedPassword": "$2b$12$kavSl4RaD5Gf3qTR9cRTtuJxgL2L0cMGdPQBHHKgjWP1c1ozmHEr6",
            "email": "admin@growthway.agency",
            "role": "superadmin",
            "createdAt": now,
        }
    ]

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
            "projectDescription": "Luxury organic skincare brand launch. Requires complete brand book, bespoke e-commerce store with 3D product showcase, and packaging design system.",
            "status": "Won",
            "createdAt": now,
            "consent": True,
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
            "projectDescription": "Boutique hotel chain rebranding across 3 coastal locations. Visual identity and booking experience.",
            "status": "Proposal",
            "createdAt": now,
            "consent": True,
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
            "projectDescription": "Architectural hardware studio web portal with dynamic quote calculator.",
            "status": "Contacted",
            "createdAt": now,
            "consent": True,
        }
    ]

    return {
        "services": services_data,
        "industries": industries_data,
        "projects": projects_data,
        "clients": clients_data,
        "testimonials": testimonials_data,
        "team": team_data,
        "site_settings": settings_data,
        "admins": admins_data,
        "leads": sample_leads,
    }


async def seed_database(db, force: bool = False) -> dict:
    """
    Populate database collections idempotently.
    Works seamlessly with Motor (live MongoDB Atlas) and InMemoryDatabase.
    """
    seed_data = get_canonical_seed_data()
    summary = {}

    # 1. Services
    svc_count = await db.services.count_documents({})
    if svc_count == 0 or force:
        if force and svc_count > 0:
            await db.services.delete_many({})
        for s in seed_data["services"]:
            await db.services.update_one({"slug": s["slug"]}, {"$set": s}, upsert=True)
        summary["services"] = len(seed_data["services"])
    else:
        summary["services"] = svc_count

    # 2. Industries
    ind_count = await db.industries.count_documents({})
    if ind_count == 0 or force:
        if force and ind_count > 0:
            await db.industries.delete_many({})
        for i in seed_data["industries"]:
            await db.industries.update_one({"slug": i["slug"]}, {"$set": i}, upsert=True)
        summary["industries"] = len(seed_data["industries"])
    else:
        summary["industries"] = ind_count

    # 3. Projects
    proj_count = await db.projects.count_documents({})
    if proj_count == 0 or force:
        if force and proj_count > 0:
            await db.projects.delete_many({})
        for p in seed_data["projects"]:
            await db.projects.update_one({"slug": p["slug"]}, {"$set": p}, upsert=True)
        summary["projects"] = len(seed_data["projects"])
    else:
        summary["projects"] = proj_count

    # 4. Clients
    client_count = await db.clients.count_documents({})
    if client_count == 0 or force:
        if force and client_count > 0:
            await db.clients.delete_many({})
        for c in seed_data["clients"]:
            await db.clients.update_one({"name": c["name"]}, {"$set": c}, upsert=True)
        summary["clients"] = len(seed_data["clients"])
    else:
        summary["clients"] = client_count

    # 5. Testimonials
    test_count = await db.testimonials.count_documents({})
    if test_count == 0 or force:
        if force and test_count > 0:
            await db.testimonials.delete_many({})
        for t in seed_data["testimonials"]:
            await db.testimonials.update_one({"personName": t["personName"]}, {"$set": t}, upsert=True)
        summary["testimonials"] = len(seed_data["testimonials"])
    else:
        summary["testimonials"] = test_count

    # 6. Team
    team_count = await db.team.count_documents({})
    if team_count == 0 or force:
        if force and team_count > 0:
            await db.team.delete_many({})
        for tm in seed_data["team"]:
            await db.team.update_one({"name": tm["name"]}, {"$set": tm}, upsert=True)
        summary["team"] = len(seed_data["team"])
    else:
        summary["team"] = team_count

    # 7. Site Settings (Singleton)
    settings_count = await db.site_settings.count_documents({})
    if settings_count == 0 or force:
        await db.site_settings.update_one({}, {"$set": seed_data["site_settings"]}, upsert=True)
        summary["site_settings"] = 1
    else:
        summary["site_settings"] = settings_count

    # 8. Admins
    admin_count = await db.admins.count_documents({})
    if admin_count == 0 or force:
        for a in seed_data["admins"]:
            await db.admins.update_one({"username": a["username"]}, {"$set": a}, upsert=True)
        summary["admins"] = len(seed_data["admins"])
    else:
        summary["admins"] = admin_count

    # 9. Leads (Seed leads for dashboard intelligence if empty)
    lead_count = await db.leads.count_documents({})
    if lead_count == 0:
        for l in seed_data["leads"]:
            await db.leads.update_one({"email": l["email"]}, {"$set": l}, upsert=True)
        summary["leads"] = len(seed_data["leads"])
    else:
        summary["leads"] = lead_count

    # Create Indexes
    indexes_created = False
    try:
        await db.projects.create_index([("slug", 1)], unique=True, sparse=True)
        await db.projects.create_index([("published", 1), ("order", 1)])
        await db.services.create_index([("slug", 1)], unique=True, sparse=True)
        await db.services.create_index([("published", 1), ("order", 1)])
        await db.industries.create_index([("slug", 1)], unique=True, sparse=True)
        await db.leads.create_index([("createdAt", -1)])
        await db.leads.create_index([("status", 1)])
        indexes_created = True
    except Exception:
        pass

    return {
        "status": "success",
        "counts": summary,
        "indexes_verified": indexes_created,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
