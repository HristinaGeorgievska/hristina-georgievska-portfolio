# Prioritized SEO Action Plan

**Target Site**: [https://www.hristinageorgievska.com](https://www.hristinageorgievska.com)  
**Date**: October 25, 2026  
**Implementation Timeline**: 4 Phases (Immediate -> 30 Days)

---

## Priority Matrix Overview

| Level | Impact | Effort | Issues |
| :--- | :---: | :---: | :--- |
| **P0: Critical** | 🔴 Maximum | Low-Medium | Static canonical loophole, missing core sitemap pages, soft 404s |
| **P1: High** | 🟠 High | Medium | Schema markup enrichment, bio/E-E-A-T copy, pre-rendering collections |
| **P2: Medium** | 🟡 Moderate | Low-Medium | Section-specific meta descriptions, heading hierarchy, `llms.txt` |
| **P3: Low** | 🟢 Polish | Low | PWA manifest fix, 301 redirect for `/fashion`, social card tweaks |

---

## Phase 1: Critical Fixes (COMPLETED ✅)

### 1. Fix Static Canonical Tag on Collection Pages ✅
* **Status**: Implemented in [`scripts/prerender.js`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/scripts/prerender.js). All 52 collections from Contentful are pre-rendered into individual HTML files (`/collection/:slug/index.html`) with self-referencing canonicals, correct collection titles, custom meta descriptions, and OG preview images.

### 2. Update XML Sitemap with All Core Routes ✅
* **Status**: Implemented in [`scripts/prerender.js`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/scripts/prerender.js) and written to [`public/sitemap.xml`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/public/sitemap.xml). Now includes `/`, `/beauty`, `/video`, `/contact`, and all 52 collections (56 URLs total) with automated updates on every build.

### 3. Resolve Soft 404s ✅
* **Status**: Implemented in [`src/pages/NotFound.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/pages/NotFound.tsx). Injected `<meta name="robots" content="noindex, nofollow" />` and tested via [`src/test/NotFound.test.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/test/NotFound.test.tsx).

---

## Phase 2: High Priority (COMPLETED ✅)

### 4. Enrich Structured Data (LocalBusiness & Socials) ✅
* **Status**: Implemented in [`index.html`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/index.html). Added rich `@graph` schema combining `Person` and `ProfessionalService` with telephone (`+420602367517`), email (`hristina.georgievska1@gmail.com`), priceRange (`$$$`), areaServed (Prague, Czech Republic, Europe), `knowsAbout` topics, and official Instagram link under `sameAs`.

### 5. Add BreadcrumbList Schema to Collections ✅
* **Status**: Implemented in [`src/pages/CollectionDetail.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/pages/CollectionDetail.tsx) and pre-rendered into all 52 collection pages in [`scripts/prerender.js`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/scripts/prerender.js). Search engines now receive the full navigation trail (`Home > Collections > [Title]`).

### 6. Introduce E-E-A-T Editorial Bio & Client Social Proof ✅
* **Status**: Implemented in [`src/components/ContactSection.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/components/ContactSection.tsx) and pre-rendered in [`scripts/prerender.js`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/scripts/prerender.js). Prominently features credentials for **Vogue**, **Elle**, **Harper's Bazaar**, **Marie Claire**, **Vanity Fair Italia**, and **Dolcevita** alongside her 20+ years of international production experience.

---

## Phase 3: Medium Priority (Week 2 - 3)

### 7. Section-Specific Meta Descriptions & Titles
* **Issue**: All pages share identical meta description.
* **Action**:
  - Customize meta descriptions in `scripts/prerender.js`:
    - `/beauty`: *"Explore beauty and editorial makeup by Prague-based artist Hristina Georgievska. Clean skin, bold artistry, and precision hair styling."*
    - `/video`: *"Commercial and editorial video productions featuring makeup and hair styling by Hristina Georgievska."*
    - `/contact`: *"Get in touch with Prague-based make-up artist and hair stylist Hristina Georgievska for fashion, editorial, and commercial bookings."*
* **File**: `scripts/prerender.js`, `src/pages/Index.tsx`

### 8. Implement `llms.txt` for Generative AI Search (GEO)
* **Issue**: AI assistants (ChatGPT, Perplexity, Claude) lack structured plaintext data to cite.
* **Action**:
  - Create `public/llms.txt` summarizing Hristina's credentials, location (Prague), portfolio categories, publications, and contact info in markdown format.
  - Reference `llms.txt` in `public/robots.txt`.
* **File**: `public/llms.txt`, `public/robots.txt`

### 9. Fix Semantic Heading Hierarchy
* **Issue**: Double `<h1>` on Collection Detail pages; missing visible desktop `<h2>` in gallery views.
* **Action**:
  - In `Header.tsx`, check whether the current route is a subpage. If on `/collection/*`, render the artist name as a stylized `<div>` or `<p>` with `role="heading" aria-level="2"` or keep `<h1>` reserved strictly for the collection title.
  - In `MasonryGallery.tsx` and `BeautyGallery.tsx`, add an accessible semantic `<h2>` (`<h2 className="sr-only">Fashion Portfolio</h2>`).
* **File**: `src/components/Header.tsx`, `src/components/MasonryGallery.tsx`

---

## Phase 4: Polish & Maintenance (Week 4)

### 10. Update PWA Manifest (`site.webmanifest`)
* **Issue**: Boilerplate strings `"MyWebSite"` and `"MySite"` remain in `public/site.webmanifest`.
* **Action**:
  - Change `name` to `"Hristina Georgievska | Make-up Artist & Hair Stylist"`
  - Change `short_name` to `"Hristina"`
* **File**: `public/site.webmanifest`

### 11. Clean Up Duplicate `/fashion` Route
* **Issue**: `/fashion` and `/` both serve identical content with HTTP 200.
* **Action**:
  - In `public/_redirects`, add a 301 rule redirecting `/fashion` to `/`:
    ```
    /fashion    /    301!
    ```
* **File**: `public/_redirects`
