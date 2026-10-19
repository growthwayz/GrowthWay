# ANTIGRAVITY MASTER PROMPT — Growthway: Tracker items 19–59

You are a senior full-stack engineer and front-end art-director working on the **Growthway** creative-agency website (React JSX + Vite + Tailwind CSS + GSAP/ScrollTrigger on the frontend; FastAPI + MongoDB + Cloudinary on the backend). Items 1–18 (foundation, nav/footer, hero, brand statement, portfolio, case study, media gallery, Ideas→Impact, scroll choreography, services overview/hover/detail) already exist in this repository. You are now building **items 19–59**. Everything new must look, feel and behave like what already exists.

---

## 0. FIRST: audit the existing project (do this before writing any code)

1. Read the whole repo structure. List: routes, layout components, shared UI primitives, Tailwind config, global CSS, fonts, animation helpers (GSAP hooks/utilities), API client, backend routers, models, DB connection, config.
2. Extract the **actual** design tokens in use (colors, fonts, type scale, spacing, radius, motion durations, easing) and the naming conventions for components, hooks, files and API routes.
3. Output a short "Existing system summary" (max 40 lines): what you found and what you will **reuse**. If the repo differs from the reference tokens below, **the repo wins**; reconcile and note differences. Never create a parallel style system.
4. Do not rewrite, rename or restyle existing components unless a bug blocks you. If you must touch one, list it.

## 1. Reference design system (use only to fill gaps the repo does not define)

**Theme:** light first. Light canvas by default; dark only for full-bleed media, final CTA and footer. No dark-mode toggle.

| Token | Hex | Use |
|---|---|---|
| gw-canvas | #F1F1F1 | Default light background |
| gw-white | #FFFFFF | Clean panels |
| gw-ink | #111111 | Text on light |
| gw-black | #080808 | Dark sections |
| gw-charcoal | #1C1C1C | Footer / dark panels |
| gw-blush / blush-soft / blush-deep | #F7CDD0 / #F9DDDF / #F7BFC3 | Pink tiles, fills, hover |
| gw-muted / gw-line | #777777 / #E5E3E2 | Secondary text / dividers |
| Chip accents (tiny use only) | pink #E95B9F, purple #B35CE8, green #72B957, orange #F26A21 | Chips, active states |
| Error (functional only) | #C92222 | Form/system errors only |

**Fonts:** Space Grotesk 600/700 for display (uppercase headings, tracking −0.02 to −0.05em, tight leading 0.9–1.05); Inter 400/500/600 for body/UI. Provisional until client fonts arrive; keep font names in one config file so they can be swapped.
**Shape:** radius 0 by default; 4px small, 8px interactive, 12px max. No rounded-full cards, no SaaS-dashboard look.
**Spacing:** scale 4,8,12,16,24,32,48,64,80,96,128,160. Section padding: desktop 120/160, tablet 96/120, mobile 72/96.
**Grid:** 12 col desktop (margin 72), 8 col tablet (40), 4 col mobile (20).
**Buttons:** primary = ink bg, white text, 4px radius, hover inverts; secondary = transparent, 1px ink border, hover fills; text link = underline offset 6px with animated arrow. Min tap target 44px.
**Motion:** durations fast 300ms / normal 600ms / cinematic 1200ms; smooth ease-out; animate **transform and opacity only**. Reuse the project's existing reveal/stagger/clip/parallax helpers. If the repo lacks one (e.g. `staggerText`), add it to the same animation module, not inline.
**Rules:** mobile-first; every hover has tap + keyboard equivalent; visible focus ring (2px ink on light, white on dark, 2px offset); alt text; semantic landmarks; muted autoplay video only; lazy-load below the fold; `prefers-reduced-motion` handled for every animation.
**Content rules:** NO invented clients, projects, metrics, testimonials, quotes or awards. Use clearly labeled placeholders ("Client logo", "Testimonial coming soon"). Sections that require real content (clients, testimonials) **hide themselves** when the API returns empty.
**Founders:** Priyanka Barnwal — Founder; Ajay Ojha — Co-Founder (named in the guidebook; mark "pending client verification" in the admin/seed data; photos/bios are placeholders).

## 2. Global working rules

- Work **phase by phase** in the order below (dependencies matter). After each phase: run lint/build/tests, give a short report (files created/changed, endpoints, how to test, known gaps) and **stop for review** before starting the next phase unless I say "continue".
- Match existing folder structure, naming and code style. Frontend components in `frontend/src/components/<area>/`, pages in `pages/`, hooks in `hooks/`, animation in `lib/animations/`. Backend: `routes/`, `services/`, `models/`, `auth/`, `db/`, `core/`.
- Pydantic models for all request/response. Consistent error schema: `{ "error": { "code": "...", "message": "...", "details": [...] } }`.
- Public GET endpoints return **published only**. Admin endpoints require auth. Add `createdAt`, `updatedAt`, `createdBy`, `published` to content collections.
- Frontend data fetching through the existing API client with `VITE_API_BASE_URL`. Every data-driven section needs **loading (skeleton), empty, and error** states designed in the same style.
- Never commit secrets; update `.env.example` only. No secret keys in frontend code. No `*` CORS with credentials.
- Seed script with **placeholder** records only (clearly marked `isPlaceholder: true`) so layouts can be tested; never ship placeholders as real content.
- Update the Implementation Tracker statuses only for items that are fully working (UI + API + states), per its "How to Use" rules.

---

## PHASE A — Homepage trust sections (items 19–27)

### 19–20 Industries section + interactive visuals
- **API:** `GET /api/industries` → `[{ slug, name, shortLine, image (Cloudinary id/url), order, published }]`; `GET /api/projects?industry=<slug>` returns related projects (reuse the projects endpoint filter).
- **UI (`IndustriesList`):** large typographic list on the light canvas: Startups, Hospitality, Cafes & Restaurants, Fashion & Jewellery, Beauty, Real Estate, Events, Personal Brands, Local Businesses (from DB; this list is the seed). Display type (H2/H3 scale), ink; inactive items fade to `gw-muted` when another is active.
- **Desktop:** hover/focus on an item swaps a large image (clip/crossfade 600ms) and shows `shortLine` + "See related work →" (`/work?industry=<slug>`).
- **Mobile:** tap expands the item (accordion, one open at a time) with image, line and link. Keyboard: Up/Down moves, Enter/Space toggles; `aria-expanded`; same state as hover.
- **Optional chips:** scattered tiny keyword chips (pink/purple/green/orange, 10–12px, radius 2px) drifting on scroll; decorative, `aria-hidden`, off for reduced motion.
- **States:** skeleton rows, empty (hide section), error (quiet inline message).
- **Done when:** filtered `/work?industry=` works with the existing portfolio filter, and the section matches existing type/spacing.

### 21 Why Growthway
- **API:** content via `GET /api/site-settings` (`whyGrowthway: { items: [{ word, line }], intro }`).
- **UI (`WhyGrowthway`):** manifesto, not cards: three stacked display words **STRATEGY / CREATIVITY / EXECUTION**, each with one short line below (personalised, end-to-end, practical). No icons. Each word reveals independently on scroll (stagger 100–120ms). Reduced motion → static.

### 22 Client logos
- **API:** `GET /api/clients` (approved only) → `[{ name, logo, url?, order }]`.
- **UI (`ClientLogos`):** grayscale logo strip/grid on light, color on hover; if none, hide the section. Lazy-load images, fixed aspect boxes to avoid layout shift.

### 23–24 Testimonials + motion
- **API:** `GET /api/testimonials` (published, permission-approved) → `[{ quote, personName, role, brand, logo? }]`.
- **UI (`Testimonials`):** one large quote at a time (H3 scale) with name/brand, or a marquee of quotes. Real only; if empty, hide.
- **Motion:** slow marquee or carousel; **pause on hover and focus**; keyboard-operable prev/next; on mobile swipeable and readable without hover; reduced motion → manual carousel, no autoplay.

### 25–26 Founders + image effects
- **API:** `GET /api/team` → `[{ name, role, photo, bio, order }]`.
- **UI (`FounderCard`):** two large portraits (mobile stacked; desktop side by side with staggered vertical offset), name (H3 display), role (small). Image clip-reveal + subtle parallax (≤ 8%); reduced motion → no parallax. Placeholder gray blocks until photos exist; alt text from `name`.

### 27 Final CTA (+ Footer link-up)
- **UI (`FinalCTA`):** dark section (`gw-black`), huge white display type "Have an idea? Let's turn it into impact." with one `gw-blush` accent word; Primary "Start a Project →" (to `/contact`) and text link "WhatsApp →". Contact config from `site_settings` (whatsappNumber, email, instagram).
- Motion: large type line reveal, CTA hover (magnetic on desktop only).

**Phase A acceptance:** homepage flow matches `Hero → Statement → Selected Work → Ideas→Impact → Services → Industries → Why → Founders → Testimonials/Clients → Final CTA → Footer`; sections hide gracefully with empty data; Lighthouse performance not worse than before.

---

## PHASE B — Lead generation (items 28–29)

### 28 Start a Project form (`/contact`, plus reusable `LeadForm`)
- **Fields:** name*, brand/business*, email*, phone/WhatsApp, business type*, services needed* (multi-select from `/api/services`), budget range (optional), timeline (optional), project description*, consent* (checkbox). Also hidden: `utm_*`, `source`, `pageUrl`.
- **UI:** editorial form: large labels, underline-style inputs (1px `gw-ink` bottom border, no boxed fields), focus line animates to full ink, errors in `#C92222` under the field with `aria-describedby`. Submit button = Primary style, loading state, disabled while sending. Success screen: large type confirmation + WhatsApp link.
- **Validation:** client + server (Pydantic). Email format, length limits, strip HTML, reject empty/gibberish. Honeypot field + timestamp check for spam.
- **API:** `POST /api/leads` → validates → saves to `leads` (status `New`, audit fields) → sends email notification (service in `services/email.py`; provider via env; if it fails, still save the lead and log) → returns `{ id, status }`. Rate limit (e.g. 5/hour/IP).
- **States:** offline/API failure (keep user input, retry button), validation errors, rate-limit message, success.
- **Analytics hook:** fire `enquiry_submitted` on success (wired in Phase F).

### 29 WhatsApp integration
- `WhatsAppFloat`: 56px floating button bottom-right, safe-area aware, doesn't cover the cookie/CTA areas, hides on `/admin`. Pre-filled message based on context (page/project/service): `https://wa.me/<number>?text=<encoded>`. Number from `site_settings`; if missing, don't render. Fires `whatsapp_click`.

---

## PHASE C — Content APIs completeness (support for A, B and CMS)

Ensure all public endpoints exist with Pydantic models, indexes and published-only filtering: `/api/projects`, `/api/projects/{slug}`, `/api/services`, `/api/services/{slug}`, `/api/industries`, `/api/clients`, `/api/testimonials`, `/api/team`, `/api/site-settings`. Add indexes (slug unique, published, industry, featured, order). Add short caching headers where safe. Add a `/health` check if missing.

---

## PHASE D — AI features (items 30–35) — build only after Phases A–B work

**Principles:** LLM stays **behind FastAPI**; provider keys never reach React; provider-agnostic service layer (`services/ai.py` with an interface + one adapter; provider/model from env). The AI **must not invent clients, prices, results or capabilities**; it answers only from approved knowledge. The chatbot is **never required** to browse or convert.

- **30 `ai_knowledge`:** collection of approved services, FAQs, case-study summaries, rules/boundaries (`{ type, title, content, tags, published }`) + admin CRUD (in Phase E) + retrieval function (filtered keyword/tag retrieval first; embeddings only if I ask).
- **31 `POST /api/ai/chat`:** input `{ sessionId, message, history[≤N] }`; validate length/rate-limit (e.g. 20 msgs/session, IP limits); retrieve knowledge → system prompt with strict rules → LLM → validate/sanitize → return `{ reply, suggestions[], cta }`. Never expose the system prompt. Log anonymised usage and unanswered questions.
- **Chat UI (`ChatWidget`):** floating button next to/above WhatsApp (no overlap), opens a light panel (white, 1px line, 4–8px radius, Inter), header "Ask Growthway", welcome prompt chips, message list, input, loading dots, error + retry, **"Talk to a human" always visible** (opens WhatsApp / `/contact`). Respects reduced motion; focus trap + Esc to close; `aria-live` for new messages.
- **32 `POST /api/ai/recommend`:** `{ goal, businessType }` → `{ services: [{ slug, reason }] }` using approved services only; UI as a short guided flow in the widget with links to service pages.
- **33 `POST /api/ai/brief`:** natural-language requirement → structured brief JSON (`businessType, goal, services, budgetRange?, timeline?, summary`) validated by schema; user can edit then "Send as enquiry" (creates a lead).
- **34 Lead qualification:** internal service (and/or `POST /api/ai/qualify`) extracting `business, goal, serviceNeed, budget, urgency, summary` into lead enrichment fields; never blocks lead creation if AI fails.
- **35 `GET/POST /api/ai/search`:** natural-language portfolio search ("restaurant branding work") using filtered retrieval over projects (industry/services/tags); returns project cards; "no result" state suggests related industries.
- **Failure states to build:** AI timeout, provider error, rate limit, empty result, off-topic question (polite redirect), human handoff.

---

## PHASE E — Admin CMS (items 36–43)

**Look and feel:** same tokens, **light theme**, Inter for UI, Space Grotesk for page titles only, blush as the selected/active color, 4–8px radius, minimal motion (fades only). Functional, uncluttered; not a generic dashboard template. Desktop-first, usable on tablet.

- **36 Auth:** `POST /api/admin/login`, JWT (short-lived access token, httpOnly cookie or secure storage per existing pattern), strong password hashing (argon2/bcrypt), role checks (`admin`, `editor`), brute-force rate limit, protected routes (`/admin/*`), logout, session-expiry handling. Seed one admin via CLI/env, never hard-coded.
- **37 Shell:** sidebar (Dashboard, Projects, Services, Industries, Testimonials, Clients, Team, Leads, AI Knowledge, Settings), header, protected layout; `GET /api/admin/dashboard` → counts (new leads, published projects, drafts).
- **38 Portfolio CMS:** project list (search, filter, publish toggle), create/edit form with all case-study fields (title, slug auto, client, industry, services, cover, gallery, challenge, strategy, execution, results *verified only*, featured, published, SEO fields), delete with confirm. `POST/PATCH/DELETE /api/admin/projects`.
- **39 Services CMS:** same pattern (`/api/admin/services`) incl. order, media, details.
- **40 Testimonials / clients / team CMS:** CRUD for each, including "permission approved" checkbox for testimonials/clients and "verified" flag for founders. Plus Industries and `ai_knowledge` CRUD and `site_settings` editor (contact, social, why-growthway copy).
- **41 Lead management:** list with filters (status, date, service, source), detail view, status pipeline **New → Contacted → Proposal → Won/Lost**, notes, audit fields; `GET/PATCH /api/admin/leads`; CSV export optional.
- **42 Cloudinary:** `POST /api/admin/media/sign` returns a signed upload config; frontend uploads directly to Cloudinary; store only `public_id`, URL, width/height, type, alt, caption; admin upload UI with preview, replace, delete; validate type/size server-side.
- **43 Responsive media:** helper `cloudinaryUrl(publicId, preset)` with presets: `thumb`, `card`, `hero-desktop`, `hero-mobile`, `gallery`; `f_auto,q_auto`, `srcset`/`sizes`, lazy loading, width/height attrs; update existing sections to use it.
- **States everywhere:** loading, empty, validation error, API error, unsaved-changes warning, success toast (small, non-blocking).

---

## PHASE F — Analytics (items 44–45)

- Thin `analytics.js` wrapper (GA4 via gtag; no-op if no measurement ID; respects consent if a banner exists). Events: `page_view`, `project_view`, `case_study_cta_click`, `start_project_click`, `whatsapp_click`, `email_click`, `enquiry_submitted`, `ai_chat_started`, `ai_recommendation_accepted`, `instagram_click`.
- Funnel: store `utm_source/medium/campaign`, `referrer`, first landing page in `sessionStorage`, send with the lead payload; optional backend event log for `enquiry_submitted`.
- Document each event name, trigger and params in `docs/analytics.md`.

---

## PHASE G — Accessibility, performance, security, SEO (items 46–51)

- **46:** semantic landmarks, one `h1` per page, logical headings, keyboard path through every interactive section, visible focus, alt text from CMS, contrast checks (ink on canvas OK; never muted text under 14px on blush), skip-to-content link, forms with labels/errors, viewport allows zoom.
- **47:** central `useReducedMotion` hook; verify **every** animation system (hero, work, Ideas→Impact, services, industries, testimonials, founders, chips) degrades to simple fades/static.
- **48:** route-level code splitting, lazy-load heavy modules (GSAP plugins where possible, Three.js only if added), font `display=swap` + preload only critical fonts, image/video optimization, skeletons, API response shaping + indexes. Report bundle size before/after.
- **49:** WebGL is **optional**: do not add unless I approve; if added, one lightweight, lazy-loaded effect (hero **or** Ideas→Impact, not both) that never blocks content and has a static fallback.
- **50:** CORS allowlist from env, rate limits (leads, AI, login), upload validation, input sanitisation, security headers, admin route protection, no secrets in frontend, audit logs for admin writes, HTTPS-only cookies in production.
- **51:** per-page `<title>`/meta description/OG image (react-helmet-async or the project's existing approach), SEO fields from CMS, semantic URLs (`/work/:slug`, `/services/:slug`), `sitemap.xml` + `robots.txt`, canonical tags, structured data (Organization) with **no fabricated data**.

---

## PHASE H — QA (items 52–55)

- Write a test plan and run what can be automated: backend pytest (validation, auth, rate limits, published filtering, error schema), frontend component tests for forms/filters, Playwright smoke tests for core flows (home → work → case study → contact submit; industries tap/hover; chat open/close).
- **52 Responsive:** checklist at 390, 768, 1024, 1440; verify no horizontal scroll, tap targets ≥ 44px.
- **53 Browser:** Chrome, Safari (incl. iOS), Firefox, mobile Chrome; check `100svh`, video autoplay (muted/playsinline), animation smoothness.
- **54 Failure states:** offline/API down, invalid form, AI timeout, rate limit, no portfolio result, empty sections; each has a designed state.
- **55 Content QA:** script/checklist for spelling, broken links, placeholder records (`isPlaceholder`), client permissions, contact details, publish states. **Block release if any placeholder is published.**

---

## PHASE I — Deployment & handover (items 56–59)

Produce files/docs, and do not deploy anything without my confirmation.
- **56 Staging:** `Dockerfile`/start commands as needed, env var matrix (dev/staging/prod), `.env.example`, deployment guide for the chosen hosts (frontend: Vercel/Cloudflare; API: Render/Railway/AWS; MongoDB Atlas; Cloudinary), smoke-test script against staging.
- **57 Production:** checklist for domain, HTTPS, CORS, secrets, DB indexes + backups, monitoring/uptime, error logging, analytics + email verification.
- **58 Admin training:** `docs/admin-guide.md` with screenshots placeholders: projects, services, testimonials, clients, team, leads, media, AI knowledge, settings; roles and credential handoff steps.
- **59 Launch checklist:** final backup, analytics events verified, forms, WhatsApp, SEO, 404 page, performance, security, accessibility, placeholder purge.

---

## 3. Output format for each phase

1. **Plan** (bullets, 10 lines max).
2. **Implementation** (code).
3. **How to run/test** (commands + URLs).
4. **Acceptance checklist** (ticked items above).
5. **Tracker update suggestion** (which row numbers can be marked Completed).
6. **Open questions / assumptions** (only real blockers).

Start with **Section 0 (audit)** and then **Phase A**. Do not begin Phase B until I approve Phase A.
