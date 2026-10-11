> Updated implementation (11 October 2026): use [CMS guide](docs/CMS_GUIDE.md), [missing inputs](docs/MISSING_INPUTS.md) and [deployment guide](docs/DEPLOYMENT.md) for current setup/status. Earlier completion claims and Excel statuses are historical. Cloudinary image/video uploads are verified. SMTP/GA4 and production deployment remain pending owner details; AI is excluded.

# GrowthWay — Ideas to Impact
> **Creative Growth Agency Web Platform**  
> Built with modern web craft: React 18, Vite, Tailwind CSS, GSAP, FastAPI, MongoDB Atlas, and Cloudinary.

---

## 🌟 Overview

**GrowthWay** is a creative growth agency helping modern brands transform their digital presence through strategy, content, branding, performance marketing, and technical execution. 

This repository contains the complete full-stack web application, featuring a high-aesthetic client-facing agency portal and a secure internal administration suite.

* **Brand Visual Identity:** Olive Green (`#5C9E31`) & Warm Cream (`#FAF8F5`)
* **Design Philosophy:** Editorial typography, smooth micro-interactions, responsive accessibility, and honest credibility.

---

## 🏛️ Architecture & Tech Stack

```
GrowthWay/
├── frontend/               # Client-facing web app & Admin SPA
│   ├── src/
│   │   ├── components/     # Modular UI blocks (Hero, Services, Leads, Signature Experience)
│   │   ├── pages/          # Home, Contact, Portfolio, Admin Dashboard
│   │   ├── lib/            # API client, animation helpers, telemetry
│   │   └── hooks/          # useReducedMotion, custom hooks
│   ├── public/             # Static assets, sitemap.xml, robots.txt
│   └── vite.config.js      # Rollup manual chunk optimization & code-splitting
│
└── backend/                # High-performance asynchronous API
    ├── app/
    │   ├── routes/         # Public, Admin, Leads, AI, and Service endpoints
    │   ├── db/             # Motor async connection, In-Memory fallback, seeds
    │   ├── auth/           # OAuth2 JWT & bcrypt authentication
    │   ├── models/         # Pydantic v2 schemas and validation
    │   └── services/       # Email notifications, Cloudinary signing, seeding
    ├── main.py             # FastAPI entrypoint with security middlewares
    ├── smoke_test.py       # Automated deployment smoke test suite
    └── Dockerfile          # Production container specification
```

### Technology Highlights
* **Frontend:** React 18, Vite, Tailwind CSS, GSAP (ScrollTrigger), Lucide Icons.
* **Backend:** FastAPI (Python 3.12), Pydantic v2, Motor (Async MongoDB), Cloudinary SDK.
* **Database:** **MongoDB Atlas (Cluster0)** with automatic **In-Memory Resilient Fallback** for zero-downtime offline testing.
* **Media Management:** Cloudinary with direct client-to-CDN signed upload architecture.

---

## ✨ Key Features & Modules

1. **8 Official Growthway Services:**
   * Social Media Strategy & Management
   * Content Creation & Reels
   * Branding & Design
   * Digital Marketing / Meta Ads
   * Website Development
   * Brand & Product Shoots
   * Event & Campaign Content
   * Personal Brand Growth
   * *Each service includes dedicated project discussion CTAs linking to `/contact`.*

2. **9 Curated Industry Verticals:**
   * Startups, Hospitality, Cafes & Restaurants, Fashion & Jewellery, Beauty, Real Estate, Events, Personal Brands, Local Businesses.

3. **Lead Generation & Client Enquiry Engine:**
   * Dynamic multistep consultation form with honeypot spam protection.
   * Business type, timeline, services selection, and budget ranges.
   * Real-time submission directly to MongoDB Atlas.

4. **Internal Admin CMS & Intelligence Dashboard (`/admin`):**
   * Secure JWT authentication (`/admin/login`).
   * Live sales pipeline telemetry (*New*, *Contacted*, *Proposal*, *Won*, *Lost*).
   * CMS management for services, industries, projects, and site settings.

5. **Accessibility & Performance Standards:**
   * `prefers-reduced-motion` compliance across all hero, cards, and canvas animations.
   * Global `:focus-visible` accessibility outlines and Skip-to-Content navigation.
   * Route-level code splitting via `React.lazy` and optimized manual Rollup chunks.
   * Comprehensive SEO: `sitemap.xml`, `robots.txt`, OpenGraph, and Twitter Cards.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **Python:** v3.12 or higher
* **Git**

---

### Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv .venv
   .venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   * Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Populate your credentials in `backend/.env`:
     ```env
     MONGODB_URL=mongodb+srv://growthway84_db_user:<password>@cluster0.whxtgfc.mongodb.net/?appName=Cluster0
     MONGODB_DB_NAME=growthway
     CORS_ORIGINS=http://localhost:5173,http://localhost:3000
     CLOUDINARY_API_KEY=<your_api_key>
     CLOUDINARY_API_SECRET=<your_api_secret>
     CLOUDINARY_CLOUD_NAME=growthway
     ```

5. Prime and seed the database:
   ```bash
   python -m app.services.seed
   ```

6. Start the development API server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   *API Swagger Docs will be available at:* [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The website will be running at:* [http://localhost:5173/](http://localhost:5173/)

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🛠️ Deployment & Service API Reference

The backend exposes a dedicated **Service API (`/api/service`)** specifically built for deployment readiness probes, cloud health checks, and CI/CD database migrations:

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/service/health` | `GET` | **Deployment Readiness Probe:** Audits live database connection, ping latency, collection counts, and third-party integration statuses. |
| `/api/service/seed` | `POST` | **Automated Migration Hook:** Idempotently seeds/updates MongoDB Atlas collections during deployment (`?force=true` supported). |
| `/api/service/ping` | `GET` / `POST` | **Liveness Probe:** Zero-overhead check for load balancers (AWS ALB, Render, Railway, Fly.io, Kubernetes). |
| `/api/service/info` | `GET` | **Architecture Manifest:** Returns server version, CORS origins, and registered routes. |

### Running the Deployment Smoke Test Suite

Verify all public and private API endpoints locally or against a staging/production server:
```bash
cd backend
python smoke_test.py
# Or against a remote deployed URL:
python smoke_test.py --url https://api.yourdomain.com
```

### Docker Deployment

Build and run the production backend container:
```bash
cd backend
docker build -t growthway-backend .
docker run -p 8000:8000 --env-file .env growthway-backend
```

---

## 🔐 Default Admin Access

* **Admin Login Route:** `/admin/login`
* **Default Username:** `admin`
* **Default Password:** `password` *(Configurable in `backend/.env` via `SECRET_KEY` and database hash)*

---

## 📄 License & Attribution

© 2026 GrowthWay. All rights reserved.  
*“Ideas to Impact.”*
