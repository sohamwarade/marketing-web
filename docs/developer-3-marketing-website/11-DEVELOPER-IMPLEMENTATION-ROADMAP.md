# D3-11 — Developer 3 Implementation Roadmap

Aligned with [../16](../16-IMPLEMENTATION-ROADMAP.md). Developer 3 has **no backend tasks**. Public catalogue endpoints are built by Dev 2; you consume them (mocks first).

| Phase | Tasks | Done when | Depends on |
|---|---|---|---|
| 1 | **`@puzzlers/design-tokens`** + Tailwind theme; base `@puzzlers/ui` (Button with variants incl. `accent`, Input, Card, Badge, Dialog, Sheet, Toast, Skeleton, Accordion); marketing layout (Header, Footer, MegaMenu, MobileNav); PoC P-1 (marketing: SSG + ISR with the R2 cache) | Tokens consumed by all three app shells; marketing shell on staging | Monorepo skeleton |
| 2 | Static pages: About, Features (draft copy), Contact (form UI), FAQ (static JSON), legal page layouts (DRAFT text); AuthStateButton; login/register redirects; `links.ts` | M-05…M-08 pass with mocks | `/v1/me` (Dev 2) |
| 3 | Catalogue: courses/batches/test-series listings + details; exam landing template; sitemap/robots; integrate `/v1/public/*` (built by Dev 2; review response shapes) | M-01…M-03, M-09 pass with real staging data | Admin publishing (Dev 2) |
| 4 | Homepage sections 1–9, 11–13; SEO metadata + JSON-LD; OG images | M-02, M-04 pass | Phase 3 |
| 5 | Performance work (image pipeline, JS budget), Lighthouse CI; help Dev 1/Dev 2 with shared components (`DataTable`, `FilterBar`, cards) | M-12 passes | — |
| 6 | Pricing page with live data; trial messaging | Pricing reflects the admin prices | Phase 7 API partially |
| 7 | Buy/enroll CTAs wired to the student checkout; UTM forwarding | M-07 passes end to end | Checkout (Dev 1) |
| 8 | FAQ from the API (admin-managed), final copy, legal texts, testimonials (if consented content exists), accessibility pass | Content complete | D-16, D-18, D-21 |
| 9 | SEO audit, Rich Results validation, staging `noindex` check, production canonical host + redirects, Search Console | Acceptance complete | DNS for `puzzlers.in` |
