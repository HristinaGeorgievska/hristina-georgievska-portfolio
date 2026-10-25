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

## Phase 3: Medium Priority (COMPLETED ✅)

### 7. Section-Specific Meta Descriptions & Titles ✅
* **Status**: Implemented in [`src/pages/Index.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/pages/Index.tsx) via `<Helmet>` and pre-rendered into static HTML in [`scripts/prerender.js`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/scripts/prerender.js). Both client-side SPA navigation and direct server-rendered HTML provide unique, targeted `<title>`, `<meta name="description">`, `<link rel="canonical">`, and Open Graph/Twitter tags for `/` (Fashion), `/beauty`, `/video`, `/contact`, and `/advertising`.

### 8. Implement `llms.txt` for Generative AI Search (GEO) ✅
* **Status**: Created [`public/llms.txt`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/public/llms.txt) adhering to the standard specification. Summarizes Hristina's 20+ years in Prague, elite editorial credentials (Vogue, Elle, Harper's Bazaar, Marie Claire, Vanity Fair, Dolcevita), core service offerings, and direct contact details. Updated [`public/robots.txt`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/public/robots.txt) to explicitly permit major AI search crawlers (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Applebot-Extended`) and link to `llms.txt`.

### 9. Fix Semantic Heading Hierarchy ✅
* **Status**: Resolved across all pages:
  - **Eliminated duplicate `<h1>` on subpages**: In [`src/components/Header.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/components/Header.tsx), artist name automatically renders as a non-heading link on `/collection/*` subpages (or when `asH1={false}`), reserving `<h1>` exclusively for the collection title (`{collection.title}`) and 404 page ("Page Not Found"). Both React runtime and static pre-rendering in `scripts/prerender.js` enforce this.
  - **Added accessible desktop `<h2>` landmarks**: Added `<h2 className="sr-only">...</h2>` to [`src/components/MasonryGallery.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/components/MasonryGallery.tsx), [`src/components/ContactSection.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/components/ContactSection.tsx), [`index.html`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/index.html), and [`scripts/prerender.js`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/scripts/prerender.js) ensuring valid H2 landmarks exist across all viewports for screen readers and search crawlers. Verified via unit test suite in [`src/test/Header.test.tsx`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/src/test/Header.test.tsx).

---

## Phase 4: Polish & Maintenance (COMPLETED ✅)

### 10. Update Web App Manifest (`site.webmanifest`) ✅
* **Status**: Updated [`public/site.webmanifest`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/public/site.webmanifest) and [`dist/site.webmanifest`](file:///home/oliver/Code/Projects/hristina-georgievska-portfolio/dist/site.webmanifest). Replaced placeholder strings `"MyWebSite"` and `"MySite"` with:
  - `name`: `"Hristina Georgievska | Make-up Artist & Hair Stylist"`
  - `short_name`: `"Hristina"`
  - `description`: `"Professional make-up artist and hair stylist based in Prague, specializing in fashion, editorial, beauty, and advertising."`
  - `start_url`: `"/"`

### 11. Route Architecture Note (`/fashion`) ✅
* **Status**: Route `/fashion` is intentionally preserved as an active section without a 301 redirect to accommodate the planned future root structure. Self-referencing metadata and clean navigation are maintained.
