# DIGInvictus — Website Rebuild & Admin Panel

## Goal

Rebuild the DIGInvictus website as a modern **React** application while keeping the exact layout, visual style, and feel of the current page (captured from `DIGInvictus.html`, an archive of diginvictus.com). Add a **headless content management / admin panel** so non-technical staff can edit every piece of content on the page without touching code.

## Current Site (from HTML archive)

A single-page dark "coming soon" landing for a digital agency (web development, graphic design, SMM, digital marketing, branding).

**Sections (top to bottom):**
1. **Hero** — full-screen, dark purple/navy background, animated 3D sphere (Three.js), logo top-left, "Get in touch" pill button top-right, large serif headline **"Building Digital"**, uppercase sub-title **"New website uploading shortly"**, animated scroll-down arrow.
2. **Highlights ("What we do.")** — section heading, decorative rainbow-glow image. (Styles exist for icon boxes + testimonial carousel that the archive didn't render — likely intended content areas.)
3. **Clients** — heading + logo strip: OTP Bank Albania, Dajti Ekspres, Telesport, GKHair Albania, Bare Flowers, Kryefjala, Kryqi Kuq Shqiptar (Red Cross Albania). Logos shown at low opacity, hover to full.
4. **Footer** — centered social icons, logo, copyright ("© 2023 All rights reserved.").

**Design tokens (from `DIGInvictus_files/default-455938d9.css`):**
- Colors: page bg `#120755` (deep indigo), text `#fafafa` (off-white), accent dark `#343434` / `#010101`, muted text `rgba(250,250,250,0.45–0.8)`.
- Fonts: **Playfair Display** (h1/h2/h3, serif display) + **Poppins** (body/UI, sans-serif).
- Buttons: pill shape (`border-radius: 999rem`), uppercase, letter-spacing `0.1em`, small (`0.75rem`), hollow + filled + inverted variants.
- Backgrounds: subtle film-grain noise overlay, hero background image, rainbow-glow PNG accents, radial-gradient horizontal rules.
- Hero height: ~1287px desktop; responsive padding breakpoints at 40em/60em/64em.

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Frontend framework | **React 18 + Vite** | Fast build, component reuse, easy admin integration |
| Language | **TypeScript** | Type safety across site + admin |
| Styling | **CSS Modules** (or Tailwind) | Match original CSS closely; keep design tokens in one place |
| Routing | **React Router** | `/` public site, `/admin` panel |
| 3D hero sphere | **Three.js (react-three-fiber)** | Reproduce the animated sphere; keep as a lightweight component |
| Backend / API | **Node.js + Express** (or Next.js API routes) | Serve content API + auth for admin |
| Database | **SQLite** (local dev) → PostgreSQL (prod) | Simple start, easy content model |
| Auth | **JWT** (email/password) | Protect `/admin` routes |
| Content access | **REST API** consumed by both site and admin | Single source of truth |

## Architecture

```
diginvictus/
├── client/               # React public site (Vite)
│   ├── src/
│   │   ├── components/   # Hero, Highlights, Clients, Footer, Logo, Button, ThreeScene
│   │   ├── sections/     # Page sections rendered from API data
│   │   ├── api/          # fetch layer to backend
│   │   ├── hooks/        # useContent, useClients, etc.
│   │   └── assets/       # logos, glows, fonts (ported from DIGInvictus_files)
│   └── index.html
├── admin/                # React admin panel (same repo, separate Vite app)
│   └── src/pages/        # Login, Dashboard, SectionEditor, ClientManager
├── server/               # Node/Express API
│   ├── routes/           # /api/content, /api/clients, /api/auth
│   ├── db/               # schema + seed
│   └── middleware/       # JWT auth guard
└── shared/               # TypeScript types for content model
```

- The public site **reads all content from the API** at runtime (loading state → skeleton → content). No hardcoded text.
- The admin panel is a separate React app served at `/admin`, protected by login.

## Content Model (editable in admin)

| Entity | Fields |
|---|---|
| `siteConfig` | site name, tagline, meta description, keywords, footer copyright, social links |
| `hero` | headline, sub-title, scroll-arrow on/off, "Get in touch" label + link, background image |
| `highlights` | heading, list of `{ icon, title, description }` cards |
| `clients` | heading + list of `{ name, logo (image upload), websiteUrl, order, active }` |
| `testimonials` | list of `{ quote, author, role, company }` |
| `footer` | copyright text, social links |

## UI / Layout Requirements (match the HTML)

1. **Hero** — exact layout: logo top-left, CTA top-right, centered serif headline + uppercase sub-title, animated down arrow, Three.js sphere behind (z-index -1), noise overlay. Respect original breakpoints (40em / 60em / 64em).
2. **Highlights** — centered "What we do." heading, rainbow-glow decorative image; render icon cards as a row (original CSS grid intent).
3. **Clients** — heading, logo strip with grayscale/low-opacity logos that brighten on hover; logos scaled to fit (max-height 80px).
4. **Footer** — centered social icons + logo + copyright.
5. Reuse original assets: `logo_white.svg`, client logos, `rainbow-glow-1/2.png`, fonts (Playfair Display + Poppins), hero bg.
6. Use original CSS custom scrollbar + global styles as baseline.

## Admin Panel Features

- **Login screen** (email + password, JWT session).
- **Dashboard** — list all editable sections with preview thumbnails.
- **Section editors** — forms per content entity:
  - Text fields, textareas, image upload (with preview), toggle switches, drag-to-reorder.
  - Live "save" with toast feedback; changes appear on the site on next load/refresh.
- **Clients manager** — add/remove/edit client logos (file upload), reorder, toggle visibility.
- **Testimonials manager** — add/edit/remove testimonials for the carousel.
- **Site settings** — meta/SEO fields, social links, copyright.
- **Role/permission** — simple: one admin user; extensible to multiple later.

## Implementation Phases

1. **Scaffold** — Vite + React + TS workspace, shared types, asset porting (`DIGInvictus_files` → `client/src/assets`).
2. **Static rebuild** — reproduce the exact page with mock content, matching layout + styles + fonts + Three.js sphere.
3. **Backend** — Express API, SQLite schema, seed with current content, JWT auth.
4. **Admin panel** — login + editors for all entities.
5. **Integration** — public site fetches from API; admin CRUD wired to same API.
6. **Polish** — responsive QA, loading states, empty states, error handling.
7. **(Optional) Deploy** — static site + API (Vercel/Railway), asset storage for uploads.

## Open Questions / Notes

- Original JS only included the sphere animation; the highlights-icon-boxes, gallery, testimonials carousel, and hero countdown exist in CSS but not in the archived page — confirm which sections to build now vs. later.
- Confirm branding: is "New website uploading shortly" still correct, or should the rebuilt site show full agency content?
- Image/logo licensing: assets are from the live site's archive; ensure rights to reuse for the rebuild.
- Admin should be protected behind auth from day one (do not expose without login).
