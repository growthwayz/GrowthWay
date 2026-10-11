# GROWTHWAY — DEVELOPER HANDOVER & ARCHITECTURE GUIDE
> **Comprehensive Technical Handover, Architecture Documentation & Future Roadmap**  
> *Written for the incoming engineering team, maintainers, and production deployers.*

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary & Project State](#1-executive-summary--project-state)
2. [Brand Design System & Aesthetics Guidelines](#2-brand-design-system--aesthetics-guidelines)
3. [Full Tech Stack & Dependencies](#3-full-tech-stack--dependencies)
4. [What Has Been Implemented From Scratch](#4-what-has-been-implemented-from-scratch)
   - [Frontend Systems](#41-frontend-systems)
   - [Backend Architecture & Resilient DB Engine](#42-backend-architecture--resilient-db-engine)
   - [Deployment & Service APIs](#43-deployment--service-apis)
   - [Security & Performance Engineering](#44-security--performance-engineering)
5. [Database Schema & Seed Intelligence](#5-database-schema--seed-intelligence)
6. [Credentials & Environment Configuration](#6-credentials--environment-configuration)
7. [Testing & Verification Suites](#7-testing--verification-suites)
8. [Directory Structure Walkthrough](#8-directory-structure-walkthrough)
9. [Developer Step-by-Step Guide for Next Implementation Phase](#9-developer-step-by-step-guide-for-next-implementation-phase)
10. [Known Gotchas, Troubleshooting & Pro-Tips](#10-known-gotchas-troubleshooting--pro-tips)

---

## 1. EXECUTIVE SUMMARY & PROJECT STATE

GrowthWay is a creative growth agency web platform representing an **"Ideas to Impact"** agency philosophy. The repository contains a decoupled architecture:
* **Frontend:** High-performance React 18 single-page application built on Vite, Tailwind CSS, and GSAP ScrollTrigger animations.
* **Backend:** Production-grade asynchronous FastAPI microservice with Pydantic v2 validation, OAuth2 JWT authentication, and motor-driven MongoDB Atlas persistence with an automatic zero-downtime in-memory fallback.

### Current Implementation Milestones:
* **Sequences 1–18 (Foundation & Core Experience):** Pre-existing in repo.
* **Sequence 8 & Sequences 46–55 (Assigned High-Priority Scope):** **100% Completed, Verified & Passing.**
* **Production Credentials Setup:** MongoDB Atlas cluster connected, authenticated, indexed, and seeded; Cloudinary cryptographic signing operational.
* **Deployment Tools:** Containerized `Dockerfile`, 12-endpoint automated `smoke_test.py`, and `/api/service` management endpoints operational.

---

## 2. BRAND DESIGN SYSTEM & AESTHETICS GUIDELINES

The visual identity is strictly calibrated against the official GrowthWay agency specification (`Growthway_Website_Requirements.docx`).

> [!IMPORTANT]
> **Strict Brand Rule:** Any legacy pink (`#E95B9F`) accents were completely eliminated. The website strictly adheres to the Olive + Warm Cream identity. Do not reintroduce arbitrary vibrant colors.

### Color Tokens (CSS Variables in `frontend/src/index.css` & Tailwind)
| Token Name | Hex Code | Purpose | Tailwind Class |
| :--- | :--- | :--- | :--- |
| **`--gw-cream`** | `#FAF8F5` | Primary background, light cards | `bg-brand-cream`, `text-brand-cream` |
| **`--gw-olive`** | `#5C9E31` | Brand accent, badges, active states | `bg-brand-olive`, `text-brand-olive` |
| **`--gw-olive-dark`** | `#4A8226`| Hover states for olive buttons | `bg-brand-olive-dark` |
| **`--gw-dark`** | `#12130F` | Body text, high-contrast headings | `text-brand-dark`, `bg-brand-dark` |
| **`--gw-dark-secondary`**| `#1E1F1A` | Secondary dark, footer background | `bg-brand-dark-secondary` |
| **`--gw-card-bg`** | `#F3EFEA` | Card backgrounds, subtle containers | `bg-brand-card` |
| **`--gw-border`** | `rgba(18, 19, 15, 0.12)` | Subtle hair-line borders | `border-brand-border` |

---

## 3. FULL TECH STACK & DEPENDENCIES

### Frontend Stack (`frontend/`)
* **React 18.3.1:** Core component framework.
* **Vite 8.3.1:** Bundler with custom Rollup code-splitting chunks (`vendor`, `gsap`, `icons`).
* **Tailwind CSS 3.4.17:** Atomic utility framework extended with GrowthWay design tokens.
* **GSAP 3.12.5 + ScrollTrigger:** High-craft scroll choreography and cinematic micro-interactions.
* **Lucide React 1.16.0:** Consistent SVG iconography.
* **React Router DOM 7.3.0:** Client-side SPA routing with lazy-loaded code-splitting.

### Backend Stack (`backend/`)
* **Python 3.12.x:** Runtime environment.
* **FastAPI 0.115.0:** High-throughput asynchronous ASGI web framework.
* **Uvicorn 0.31.0:** ASGI production web server.
* **Motor 3.6.0:** Asynchronous MongoDB client for Python.
* **Pydantic 2.9.2 + Pydantic Settings 2.5.2:** Data validation and `.env` parsing.
* **PyJWT 2.9.0 + Passlib (bcrypt):** Admin authentication and token signing.
* **Cloudinary 1.41.0:** Direct media upload signing and responsive asset management.
* **PyMongo 4.9.1:** MongoDB low-level BSON and wire-protocol support.

---

## 4. WHAT HAS BEEN IMPLEMENTED FROM SCRATCH

### 4.1 Frontend Systems

#### 1. The 8 Official Growthway Services (`frontend/src/components/services/Services.jsx` & `Services.css`)
* Implemented the full agency catalog with detailed capability pills, descriptions, order, and interactive hover states:
  1. `social-media-strategy`: *Social Media Strategy & Management*
  2. `content-creation-reels`: *Content Creation & Reels*
  3. `branding-design`: *Branding & Design*
  4. `digital-marketing-meta-ads`: *Digital Marketing / Meta Ads*
  5. `website-development`: *Website Development*
  6. `brand-product-shoots`: *Brand & Product Shoots*
  7. `event-campaign-content`: *Event & Campaign Content*
  8. `personal-brand-growth`: *Personal Brand Growth*
* Each service card features a **"Discuss Your Project"** CTA routing directly to `/contact?service=<slug>`.

#### 2. The 9 Industry Verticals (`frontend/src/components/industries/IndustriesList.jsx` & `IndustriesList.css`)
* Built responsive grid featuring 9 sectors (*Startups, Hospitality, Cafes & Restaurants, Fashion & Jewellery, Beauty, Real Estate, Events, Personal Brands, Local Businesses*).
* Image zoom, subtle dark overlays, and shortline taglines for each industry.

#### 3. Enterprise Lead Capture Form (`frontend/src/components/forms/LeadForm.jsx` & `LeadForm.css`)
* Multi-attribute lead capture with validation:
  * Name, Brand/Company, Email, Phone/WhatsApp, Business Type.
  * Multi-select services needed, budget brackets (`<5k`, `5k-10k`, `10k-25k`, `>25k`), timeline selections.
* **Honeypot Anti-Spam Trap:** Invisible field (`website_url`) that automatically discards bot submissions without interrupting legitimate clients.
* **Robust Error Handling:** Specifically parses FastAPI's `{ detail: { code, message, details } }`, HTTP 422 validation, and HTTP 429 rate limit exceptions.

#### 4. WhatsApp Floating Experience (`frontend/src/components/chatbot/WhatsAppFloat.jsx` & `WhatsAppFloat.css`)
* Sticky bottom-right chat bubble with pre-filled message (*"Hi GrowthWay team, I'd like to discuss a project..."*).
* Pulse animation, badge counter, and telemetry click tracking.

#### 5. Founder & Leadership Profile (`frontend/src/components/founders/FounderCards.jsx` & `FounderCards.css`)
* Visual cards highlighting **Priyanka Barnwal** (*Founder*) and **Ajay Ojha** (*Co-Founder*).
* Experience positioning rooted in real agency background rather than fabricated claims.

#### 6. Accessibility & Motion System (`frontend/src/hooks/useReducedMotion.js`)
* Hook listening to `prefers-reduced-motion: reduce`.
* Guards injected into `Hero.jsx`, `SignatureExperience.jsx`, `CustomCursor.jsx`, `MicroInteractions.jsx`, and `TiltCard.jsx` to prevent motion sickness and ensure WCAG AA compliance.
* Added `Skip to main content` keyboard navigation link in `frontend/src/App.jsx`.
* Global `:focus-visible` styling with olive accent outline rings in `frontend/src/index.css`.

#### 7. Performance Code Splitting (`frontend/src/App.jsx` & `frontend/vite.config.js`)
* Implemented `React.lazy()` and `<Suspense>` for `ContactPage`, `PortfolioPage`, `ProjectDetail`, `AdminLogin`, and `AdminDashboard`.
* Customized Vite Rollup configuration into isolated bundles:
  * `dist/assets/vendor-*.js` (React, React-DOM, React-Router)
  * `dist/assets/gsap-*.js` (GSAP, ScrollTrigger)
  * `dist/assets/icons-*.js` (Lucide-React)
* Production build outputs in **~1.4 seconds** with zero chunk warnings.

#### 8. SEO Infrastructure
* Generated [`frontend/public/robots.txt`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/frontend/public/robots.txt) allowing crawler indexing while protecting `/admin` routes.
* Generated [`frontend/public/sitemap.xml`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/frontend/public/sitemap.xml) detailing all canonical public routes.
* Configured meta title, description, OpenGraph, and Twitter tags in [`frontend/index.html`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/frontend/index.html).

---

### 4.2 Backend Architecture & Resilient DB Engine

#### 1. Dual-Engine Resilient Database Architecture (`backend/app/db/mongodb.py`)
GrowthWay implements a resilient database layer that never leaves developers or preview deployments with a broken app:
* **Primary Mode (Live MongoDB Atlas):**
  * Connects via Motor to `Cluster0` (`growthway84_db_user`).
  * Timeout configured to `5000ms` for resilient TLS handshake over public cloud networks.
  * Automatically creates compound database indexes on startup.
* **Secondary Mode (In-Memory Studio Database):**
  * If the network drops or MongoDB is unreachable, it automatically spins up an in-memory database that emulates the Motor API (`find`, `find_one`, `insert_one`, `update_one`, `delete_one`, `count_documents`, cursor chaining with `sort`, `skip`, `limit`, and `to_list`).
  * Emulates all collections with pre-populated telemetry leads and CMS records.

#### 2. Canonical Seed System (`backend/app/db/seeds.py`)
* Provides `get_canonical_seed_data()` and `seed_database(db, force=False)`.
* Centralized database truth ensuring both live Atlas and local in-memory engines stay 100% in sync.
* CLI executable via `python -m app.services.seed`.

#### 3. Security Middlewares (`backend/main.py`)
* Injected defensive security headers on all responses:
  * `X-Content-Type-Options: nosniff`
  * `X-Frame-Options: DENY`
  * `X-XSS-Protection: 1; mode=block`
  * `Referrer-Policy: strict-origin-when-cross-origin`
* Strict CORS origins whitelist.

#### 4. Cryptographic Cloudinary Media Signing (`backend/app/routes/admin.py`)
* Endpoint `POST /api/admin/media/sign` requires admin authentication.
* Uses `cloudinary.utils.api_sign_request()` with `CLOUDINARY_API_SECRET` to generate valid SHA signatures and timestamps for client-side uploads directly to Cloudinary CDN.

---

### 4.3 Deployment & Service APIs (`backend/app/routes/service.py`)

A dedicated micro-service router mounted at `/api/service`:
1. `GET /api/service/health`: Returns JSON with server status, uptime, database engine (`MongoDB Atlas` vs `In-Memory`), ping latency, collection counts, and integration health (Cloudinary, SMTP, WhatsApp, AI).
2. `POST /api/service/seed`: Idempotent endpoint for CI/CD deploy hooks (e.g. Render/Railway post-deploy tasks) to seed Atlas without shell access.
3. `GET /api/service/ping`: Ultra-fast probe for cloud load balancers and container health checks.
4. `GET /api/service/info`: System manifest listing registered routes, CORS settings, and Python version.

---

### 4.4 Security & Performance Engineering

* **Admin JWT Tokens:** Signed using `HS256` with expiration.
* **Password Hashing:** Passwords hashed with `bcrypt` (default admin: `admin` / `password`).
* **Indexes:** Slug fields have unique indexes; sorting fields (`order`, `published`, `createdAt`) are indexed for millisecond response times.

---

## 5. DATABASE SCHEMA & SEED INTELLIGENCE

All MongoDB documents are modeled with Pydantic schemas in [`backend/app/models/schemas.py`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/backend/app/models/schemas.py).

### Collections Summary:
1. **`services`:** `slug` (unique), `title`, `description`, `capabilities` (list), `order`, `published`.
2. **`industries`:** `slug` (unique), `name`, `shortLine`, `image`, `imageAlt`, `order`, `published`.
3. **`projects`:** `slug` (unique), `title`, `client`, `industry`, `services` (list), `coverImage`, `gallery`, `challenge`, `strategy`, `execution`, `results` (metrics list), `featured`, `order`, `published`.
4. **`clients`:** `name`, `logo`, `logoAlt`, `order`, `approved` (boolean), `published`.
5. **`testimonials`:** `quote`, `personName`, `role`, `brand`, `permissionApproved` (boolean), `published`.
6. **`team`:** `name`, `role`, `photo`, `bio`, `order`, `verified` (boolean), `published`.
7. **`site_settings`:** Singleton with `siteName`, `contactEmail`, `email`, `whatsappNumber`, `phone`, `instagram`, `linkedin`, `whyGrowthway` (3 pillars).
8. **`admins`:** `username`, `hashedPassword`, `email`, `role`.
9. **`leads`:** `name`, `brand`, `email`, `phone`, `businessType`, `servicesNeeded`, `budgetRange`, `timeline`, `projectDescription`, `consent`, `status` (*New*, *Contacted*, *Proposal*, *Won*, *Lost*), `createdAt`.

---

## 6. CREDENTIALS & ENVIRONMENT CONFIGURATION

### Production Credentials in `backend/.env`
```env
# MongoDB Atlas Cluster0
MONGODB_URL=mongodb+srv://growthway84_db_user:qxrFblZCoii6vgei@cluster0.whxtgfc.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=growthway

# CORS Allowed Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://growthway.in,https://www.growthway.in

# Authentication Secret
SECRET_KEY=growthway-production-secret-key-2026-secure

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=growthway
CLOUDINARY_API_KEY=674479137456112
CLOUDINARY_API_SECRET=KWETojeyu2uL_cXyAD2thrcI7rY

# Contact & Notifications
EMAIL_FROM=noreply@growthway.in
NOTIFICATION_EMAIL=hello@growthway.in
WHATSAPP_NUMBER=+919876543210
```

> [!NOTE]
> If your Cloudinary cloud name differs from `growthway`, change `CLOUDINARY_CLOUD_NAME` in `backend/.env`.

---

## 7. TESTING & VERIFICATION SUITES

### 1. Automated Deployment Smoke Test Suite
We created [`backend/smoke_test.py`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/backend/smoke_test.py) to test all critical endpoints:
```bash
# In backend directory
.venv\Scripts\python.exe smoke_test.py
```
**Output (12/12 Passing):**
```
============================================================
GROWTHWAY API DEPLOYMENT SMOKE TEST: http://localhost:8000
============================================================
[*] Testing Root Route -> http://localhost:8000/ ... [PASS] (200)
[*] Testing Basic Health -> http://localhost:8000/health ... [PASS] (200)
[*] Testing Service Ping (Probe) -> http://localhost:8000/api/service/ping ... [PASS] (200)
[*] Testing Service Health (Readiness) -> http://localhost:8000/api/service/health ... [PASS] (200)
[*] Testing Service Deployment Info -> http://localhost:8000/api/service/info ... [PASS] (200)
[*] Testing Public Services -> http://localhost:8000/api/services ... [PASS] (200)
[*] Testing Public Industries -> http://localhost:8000/api/industries ... [PASS] (200)
[*] Testing Public Projects -> http://localhost:8000/api/projects ... [PASS] (200)
[*] Testing Public Clients -> http://localhost:8000/api/clients ... [PASS] (200)
[*] Testing Public Testimonials -> http://localhost:8000/api/testimonials ... [PASS] (200)
[*] Testing Public Team -> http://localhost:8000/api/team ... [PASS] (200)
[*] Testing Public Site Settings -> http://localhost:8000/api/site-settings ... [PASS] (200)
============================================================
Results: 12/12 passed.
[SUCCESS] All deployment smoke tests passed cleanly!
```

### 2. Frontend Production Build Verification
```bash
# In frontend directory
npm run build
```
Builds cleanly with zero errors in **~1.4 seconds**.

---

## 8. DIRECTORY STRUCTURE WALKTHROUGH

```
GrowthWay/
├── .gitignore                                # Comprehensive ignore (explicitly tracks frontend/src/lib/)
├── README.md                                 # User & architectural project guide
├── DEVELOPER_HANDOVER_GUIDE.md               # (This file) Complete technical documentation
├── Growthway_Implementation_Tracker.xlsx     # 59-item sequence progress spreadsheet
├── Growthway_Implementation_Worklog.md       # Audit history & completed sequences log
│
├── frontend/
│   ├── public/
│   │   ├── robots.txt                        # Search crawler rules
│   │   └── sitemap.xml                       # Canonical route index
│   ├── src/
│   │   ├── components/
│   │   │   ├── chatbot/                      # WhatsAppFloat & ChatWidget
│   │   │   ├── forms/                        # LeadForm (multi-step, honeypot)
│   │   │   ├── founders/                     # FounderCards (Priyanka & Ajay)
│   │   │   ├── industries/                   # IndustriesList (9 sectors)
│   │   │   ├── navigation/                   # Navbar & SkipToContent
│   │   │   ├── services/                     # Services overview (8 services)
│   │   │   ├── signature-experience/         # Interactive Canvas & 3D Cards
│   │   │   └── work/                         # Portfolio showcase & Case studies
│   │   ├── hooks/
│   │   │   └── useReducedMotion.js           # Accessibility reduced motion hook
│   │   ├── lib/                              # [CRITICAL FOR DEPLOYMENT]
│   │   │   ├── animations.js                 # GSAP animation helpers
│   │   │   ├── api.js                        # Unified fetch wrapper with error handling
│   │   │   └── telemetry.js                  # Analytics event tracker
│   │   ├── pages/
│   │   │   ├── ContactPage.jsx               # Dedicated enquiry page
│   │   │   ├── PortfolioPage.jsx             # Portfolio filter grid
│   │   │   ├── ProjectDetail.jsx             # Individual case study view
│   │   │   └── admin/                        # AdminLogin & AdminDashboard
│   │   ├── index.css                         # Design system tokens & global rules
│   │   └── App.jsx                           # Code-split router configuration
│   └── vite.config.js                        # Rollup manual chunking
│
└── backend/
    ├── app/
    │   ├── auth/                             # JWT & password hashing
    │   ├── core/                             # Pydantic Settings (.env loader)
    │   ├── db/
    │   │   ├── mongodb.py                    # Motor connection + In-Memory fallback
    │   │   └── seeds.py                      # Canonical seed data definitions
    │   ├── models/                           # Pydantic schemas (schemas.py, ai.py)
    │   ├── routes/
    │   │   ├── admin.py                      # Admin login, analytics, lead management
    │   │   ├── leads.py                      # Lead submission endpoint
    │   │   ├── public.py                     # CMS endpoints (services, industries, etc.)
    │   │   └── service.py                    # Deployment probes & migration hooks
    │   └── services/
    │       ├── email.py                      # SMTP mail notification worker
    │       └── seed.py                       # CLI seeding utility
    ├── main.py                               # FastAPI entrypoint & security headers
    ├── smoke_test.py                         # 12-test automated deployment smoke suite
    ├── Dockerfile                            # Production container build
    ├── requirements.txt                      # Python dependencies
    └── .env                                  # Active environment secrets
```

---

## 9. DEVELOPER STEP-BY-STEP GUIDE FOR NEXT IMPLEMENTATION PHASE

If you are continuing feature development, follow this sequence:

### Step 1: Adding a New Service
1. **Database:** Add the service record in [`backend/app/db/seeds.py`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/backend/app/db/seeds.py) inside `services_data`.
2. **Sync:** Run `python -m app.services.seed` (or trigger `POST /api/service/seed`).
3. **Frontend:** The frontend `Services.jsx` automatically fetches from `/api/services` and renders the new service dynamically.

### Step 2: Adding a New Real Project / Case Study
1. In [`backend/app/db/seeds.py`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/backend/app/db/seeds.py), add your project dict to `projects_data`:
   ```python
   {
       "slug": "client-name-project",
       "title": "Client Name",
       "client": "Client Brand",
       "industry": "hospitality", # matches one of the 9 industries
       "services": ["Branding", "Content Creation & Reels"],
       "coverImage": "https://res.cloudinary.com/growthway/image/upload/...",
       "coverImageAlt": "Detailed descriptive alt text for accessibility",
       "gallery": ["url1", "url2"],
       "galleryCaptions": ["Caption 1", "Caption 2"],
       "challenge": "Client's original challenge...",
       "strategy": "Strategic approach...",
       "execution": "Execution details...",
       "results": [{"metric": "+120%", "label": "Revenue growth"}],
       "featured": True,
       "order": 3,
       "published": True
   }
   ```
2. The portfolio grid (`/portfolio`) and project detail view (`/portfolio/:slug`) will render the new case study without needing code changes in React.

### Step 3: Enabling Real Email Notifications (SMTP)
1. In `backend/.env`, set:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   NOTIFICATION_EMAIL=leads@growthway.in
   ```
2. When a user submits the `/contact` form, [`backend/app/services/email.py`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/backend/app/services/email.py) will automatically dispatch an email notification to `NOTIFICATION_EMAIL`.

### Step 4: Connecting the AI Chatbot
1. In `backend/.env`, set:
   ```env
   AI_PROVIDER=openai
   AI_API_KEY=sk-...
   AI_MODEL=gpt-4o-mini
   ```
2. The backend route `POST /api/ai/chat` in [`backend/app/routes/ai.py`](file:///c:/D%20drive%20content/Internship_ZerishAI/Grothway_Project/GrowthWay/backend/app/routes/ai.py) will use your OpenAI key to power the interactive chat widget in `ChatWidget.jsx`.

---

## 10. KNOWN GOTCHAS, TROUBLESHOOTING & PRO-TIPS

1. **MongoDB Atlas DNS / SRV Resolution:**
   * On some corporate or VPN networks, MongoDB `+srv://` DNS lookups may fail or take > 3 seconds. The application will log:
     `[INFO] MongoDB Atlas not reachable... Initializing high-fidelity In-Memory Studio Database.`
   * The app will continue functioning seamlessly using the in-memory engine. When regular internet access is restored, it will reconnect to Atlas automatically.

2. **Frontend `lib` Directory in Git:**
   * Ensure `frontend/src/lib/` is **never removed from git**. It contains `api.js`, `animations.js`, and `telemetry.js`, which are vital for production builds. This rule is safeguarded in `.gitignore`.

3. **Cloudinary Uploads:**
   * Always upload via the backend signed route `POST /api/admin/media/sign`. Never expose your `CLOUDINARY_API_SECRET` to the frontend JavaScript bundle.

4. **Running Locally in Two Terminals:**
   * **Terminal 1 (Backend):**
     ```powershell
     cd backend
     .venv\Scripts\Activate.ps1
     uvicorn main:app --reload --port 8000
     ```
   * **Terminal 2 (Frontend):**
     ```powershell
     cd frontend
     npm run dev
     ```

---

*This guide was generated to ensure complete technical continuity. For any questions, refer to the source implementations linked throughout this document.*
