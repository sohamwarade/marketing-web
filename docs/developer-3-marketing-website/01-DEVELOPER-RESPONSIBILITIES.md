# D3-01 — Developer Responsibilities

**Developer 3 owns the complete public marketing website at `puzzlers.in`. Developer 3 does not own the main backend.** You consume the public catalogue APIs that Developer 2 builds in `apps/api`.

## 1. What you own

| Area | Location |
|---|---|
| Homepage, about, exam landing pages (MHT-CET, JEE Main, JEE Advanced), courses and batches showcase, test series, pricing, features, FAQ, contact, login/register entry redirects, legal pages ([03](03-PAGE-BY-PAGE-SPECIFICATION.md)) | `apps/marketing` |
| SEO: metadata, sitemap, robots, structured data, OG images ([08](08-SEO-AND-PERFORMANCE.md)) | `apps/marketing` |
| Branding and responsive design: design tokens (lead) and shared UI quality (lead) | `packages/design-tokens`, `packages/ui` |
| Public catalogue integration: consuming `/v1/public/*` via `@puzzlers/api-client`, ISR caching, on-demand revalidation | `apps/marketing` |
| Marketing E2E and Lighthouse checks | `apps/marketing/e2e`, `.github/workflows/lighthouse.yml` *[Rec]* |

## 2. What you do not own

| Area | Owner |
|---|---|
| **All backend code in `apps/api`**, including the `public` module (`/v1/public/*`, contact, sitemap data) | Developer 2 |
| Student application and examination modules | Developer 1 |
| Admin application, authentication, payments, database schema, shared contract packages | Developer 2 |

You do not create a separate content API, CMS server or database. Static copy lives in `apps/marketing/content/`; admin-managed content (FAQs) comes through `apps/api`. When you need a new field or endpoint, open a contract-change request ([../shared/01](../shared/01-SHARED-API-CONTRACT.md)) and Developer 2 implements it.

## 3. Backend module ownership

**None.** Developer 3 has no backend modules. Your API usage is listed in [09](09-API-INTEGRATION.md).

## 4. Dependencies

| You need | From | When |
|---|---|---|
| Public catalogue endpoints | Dev 2 | Phase 3 (mocks from `@puzzlers/schemas` before) |
| Published catalogue data | Dev 2 (admin) | Phase 3 |
| Registration entry URLs and parameters | Dev 1 | Phase 2 |
| FAQ content editing in admin | Dev 2 | Phase 8 (static JSON until then) |
| Real testimonials, results, brand assets, legal texts | Owner | Before launch (D-16, D-21, D-18) |

| Others need from you | Who | When |
|---|---|---|
| Design tokens + base components | Dev 1, Dev 2 | Phase 1 (blocks every UI) |
| Shared `CourseCard`/`BatchCard` for the student explore page | Dev 1 | Phase 3 |
| Legal page URLs for the student app | Dev 1 | Phase 2 |

## 5. Deliverables

1. Marketing site deployed on Workers at `puzzlers.in` (`www` → apex), with all 19 pages in [03](03-PAGE-BY-PAGE-SPECIFICATION.md).
2. `packages/design-tokens` and the base `packages/ui` components used by all three apps.
3. SEO implementation: metadata, sitemap, robots, JSON-LD, OG images.
4. Marketing tests M-01…M-14 ([10](10-TESTING-AND-ACCEPTANCE.md)) and Core Web Vitals targets.

Phase-by-phase plan: [11](11-DEVELOPER-IMPLEMENTATION-ROADMAP.md). Spare capacity in Phases 4–6 goes to shared UI quality, accessibility and performance, not backend work.

## 6. Review responsibilities

| You review | Why |
|---|---|
| Response shapes of the `public` endpoints (as consumer) and contract PRs that touch them | They feed your pages |
| Any `packages/ui` or `design-tokens` change by another developer | You lead those packages |

Your own marketing PRs are reviewed by one other developer, and `packages/ui` prop changes also by the consuming app developers.
