# START HERE — Developer 3: Public Marketing Website

Welcome. This folder contains everything you need to build the Puzzlers public website and lead the shared design tokens and UI components. The documents are copies of the finalized Puzzlers documentation (Version 1.3), with their original paths kept. Internal exam-engine and database documents are intentionally not included, because you do not build them. The file list, reasons and exclusions are in [FILES-INCLUDED.md](FILES-INCLUDED.md).

## 1. Your exact responsibilities

| | |
|---|---|
| **Application** | Marketing website, `apps/marketing` in the monorepo |
| **Domain** | `https://puzzlers.in` (apex; `www.puzzlers.in` 301-redirects to it). Staging: `https://staging.puzzlers.in` |
| **Shared packages you lead** | `packages/design-tokens` and `packages/ui` (others contribute; `packages/ui/src/exam-preview` is maintained by Developer 1) |
| **Backend ownership** | **None.** You consume the public catalogue API (`/v1/public/*` at `https://api.puzzlers.in`) built by Developer 2 |

Full detail: [developer-3-marketing-website/01-DEVELOPER-RESPONSIBILITIES.md](developer-3-marketing-website/01-DEVELOPER-RESPONSIBILITIES.md).

## 2. What you must build

1. **All 19 public pages:** homepage, about, exam landing pages (`/mht-cet`, `/jee-main`, `/jee-advanced`), courses and course detail, batches and batch detail, test series, pricing, features, contact, FAQ, login/register entry redirects, privacy, terms, refund policy. Specs: [developer-3-marketing-website/03-PAGE-BY-PAGE-SPECIFICATION.md](developer-3-marketing-website/03-PAGE-BY-PAGE-SPECIFICATION.md) and [developer-3-marketing-website/04-HOMEPAGE-SECTION-SPECIFICATION.md](developer-3-marketing-website/04-HOMEPAGE-SECTION-SPECIFICATION.md).
2. **Branding and responsive design** using the official palette and tokens ([07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md](07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md), [shared/03-SHARED-DESIGN-TOKENS.md](shared/03-SHARED-DESIGN-TOKENS.md)).
3. **`packages/design-tokens` and the base `packages/ui` components** in Phase 1. All three apps depend on them ([shared/04-SHARED-COMPONENTS.md](shared/04-SHARED-COMPONENTS.md)).
4. **SEO:** metadata, canonical `https://puzzlers.in`, sitemap, robots (staging `noindex`), JSON-LD, OG images, Core Web Vitals ([developer-3-marketing-website/08-SEO-AND-PERFORMANCE.md](developer-3-marketing-website/08-SEO-AND-PERFORMANCE.md)).
5. **Public catalogue integration:** live courses, batches, test series, prices and FAQs from `/v1/public/*`, with ISR (≤ 5 min) and on-demand revalidation.

## 3. What you must NOT build or modify

- **No backend code.** Do not edit `apps/api` and do not create API routes with business logic, a CMS server or a separate database. When you need data or a field, request a contract change from Developer 2 ([shared/01-SHARED-API-CONTRACT.md](shared/01-SHARED-API-CONTRACT.md)).
- Do not build login, registration, checkout or learning features. Those live in the student app at `app.puzzlers.in`, so you only **link** there.
- Do not edit `apps/student`, `apps/admin`, `packages/schemas`, `packages/database`, `packages/auth`, `packages/api-client` or `packages/exam-core`.
- **No fake testimonials, ratings, student counts, results or capacity claims.** No hard-coded prices. Do not copy competitor copy, layout or imagery ([developer-3-marketing-website/05-CONTENT-AND-COPYWRITING-GUIDELINES.md](developer-3-marketing-website/05-CONTENT-AND-COPYWRITING-GUIDELINES.md)).

## 4. Read these first (in order)

1. [developer-3-marketing-website/00-READ-ME-FIRST.md](developer-3-marketing-website/00-READ-ME-FIRST.md)
2. [01-PROJECT-MASTER-DOCUMENT.md](01-PROJECT-MASTER-DOCUMENT.md) and [15-TEAM-COORDINATION-AND-INTEGRATION.md](15-TEAM-COORDINATION-AND-INTEGRATION.md) §1 (you have no backend ownership)
3. [07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md](07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md), [shared/03-SHARED-DESIGN-TOKENS.md](shared/03-SHARED-DESIGN-TOKENS.md), [shared/04-SHARED-COMPONENTS.md](shared/04-SHARED-COMPONENTS.md)
4. [04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md](04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md) and [AGENTS.md](AGENTS.md)
5. [09-API-CONTRACT-AND-ENDPOINTS.md](09-API-CONTRACT-AND-ENDPOINTS.md) **§1 and §3 only** (conventions and public catalogue); other sections are context
6. [developer-3-marketing-website/09-API-INTEGRATION.md](developer-3-marketing-website/09-API-INTEGRATION.md) and [shared/06-AUTHENTICATION-INTEGRATION.md](shared/06-AUTHENTICATION-INTEGRATION.md) §5 (cross-app links)
7. The rest of your package: [05 content rules](developer-3-marketing-website/05-CONTENT-AND-COPYWRITING-GUIDELINES.md), [06 UI](developer-3-marketing-website/06-UI-UX-AND-BRAND-GUIDELINES.md), [07 architecture](developer-3-marketing-website/07-FRONTEND-ARCHITECTURE.md), [08 SEO](developer-3-marketing-website/08-SEO-AND-PERFORMANCE.md), [10 testing](developer-3-marketing-website/10-TESTING-AND-ACCEPTANCE.md), [11 roadmap](developer-3-marketing-website/11-DEVELOPER-IMPLEMENTATION-ROADMAP.md)

## 5. Who you depend on

| You need | From | When |
|---|---|---|
| Monorepo skeleton, CI, staging environment | **Developer 2** | Phase 1 |
| `/v1/me` (header login state) | **Developer 2** | Phase 2 |
| `/v1/public/*` catalogue endpoints + real published data | **Developer 2** | Phase 3 (mocks first) |
| Register/login URLs and the `exam`/`next` parameters on `app.puzzlers.in` | **Developer 1** | Phase 2 |
| Real testimonials, brand assets (logo, fonts), legal texts | **Owner** | Before launch |

Developers 1 and 2 depend on **your design tokens and base components in Phase 1**, which is the first critical path item.

## 6. API integration expectations

- Use only `@puzzlers/api-client` and the `z.infer` types from `@puzzlers/schemas` ([shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md](shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md)).
- Endpoints you use (all anonymous and cached): `GET /v1/public/platform-status`, `/examinations`, `/examinations/:slug`, `/batches`, `/batches/:slug`, `/courses`, `/courses/:slug`, `/test-series`, `/faqs`, `/sitemap-entries`, and `POST /v1/public/contact`. The only call that uses the session cookie is the client-side `GET /v1/me` for the header login state.
- Until Developer 2 ships the endpoints, use the schema-generated mocks. If the API is unreachable at build time, render empty states; the build must not fail.
- Never compute prices, counts or catalogue data in the browser. Show only what the API returns. Payments are Cashfree and happen in the student app; you only link to `https://app.puzzlers.in/checkout?item=…`.

## 7. Git and monorepo rules

- One monorepo (pnpm + Turborepo). Your app is `apps/marketing` ([06-MONOREPO-AND-FOLDER-STRUCTURE.md](06-MONOREPO-AND-FOLDER-STRUCTURE.md)).
- Trunk-based, with short branches such as `feat/marketing-hero`, Conventional Commits and squash merges ([shared/07-GIT-AND-BRANCHING-WORKFLOW.md](shared/07-GIT-AND-BRANCHING-WORKFLOW.md)).
- Changes to tokens or `@puzzlers/ui` props need review from Developers 1 and 2, because they affect every app.
- Before every PR: `pnpm lint`, `pnpm typecheck`, tests, build, and `opennextjs-cloudflare preview`.
- Copy [developer-3-marketing-website/CLAUDE.md](developer-3-marketing-website/CLAUDE.md) to `apps/marketing/CLAUDE.md` for AI coding agents.

## 8. Your first development tasks (Phase 1–2)

1. Build `@puzzlers/design-tokens` (CSS variables + Tailwind v4 theme, exactly as in shared/03) and the base `@puzzlers/ui` components (Button with the `accent` variant, Input, Card, Badge, Dialog, Sheet, Toast, Skeleton, Accordion).
2. Build the marketing layout: header, mega menu, mobile nav, footer.
3. Run proof-of-concept check P-1 for marketing (SSG + ISR with the R2 cache on Workers) and record the result ([04 §5](04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md#5-mandatory-proof-of-concept-phase-1-gate)).
4. Phase 2: about, features, contact form UI, FAQ (static JSON), legal page layouts (marked DRAFT), the header auth-state island, and the `/login` and `/register` redirects.

Full plan: [developer-3-marketing-website/11-DEVELOPER-IMPLEMENTATION-ROADMAP.md](developer-3-marketing-website/11-DEVELOPER-IMPLEMENTATION-ROADMAP.md).

## 9. Confirm before you start

- [ ] You have access to the monorepo, and CODEOWNERS lists you on `apps/marketing`, `packages/ui` and `packages/design-tokens`.
- [ ] You know when Developer 2's mocks and public endpoints will be available.
- [ ] The owner has provided, or scheduled, the logo, wordmark and fonts (D-16), the consented testimonials (D-21) and the approved legal texts (D-18). Until then, keep the placeholders clearly marked.
- [ ] You understand the claims policy: every number on the site must come from the API or an owner-approved source.
