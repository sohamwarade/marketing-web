# CLAUDE.md — Marketing Website (apps/marketing) + design tokens / shared UI

Place this file at `apps/marketing/CLAUDE.md`. The root `AGENTS.md` rules also apply.

## Context

You are working on the **Puzzlers public website** (Next.js App Router, TypeScript, Tailwind, shadcn/ui; Cloudflare Workers via OpenNext; ISR with the R2 cache). It is SEO-focused, fast and conversion-oriented. Data comes from the single shared **Hono** API (`apps/api`, on Cloudflare Workers, host `api.puzzlers.in`), through its public endpoints (`/v1/public/*`) and `@puzzlers/api-client`. This site is served at `puzzlers.in` (`www` redirects to the apex). Login, registration, checkout and learning happen in the student app (`app.puzzlers.in`), so this site only links there.

Specs:
- Pages: `docs/developer-3-marketing-website/03-PAGE-BY-PAGE-SPECIFICATION.md`
- Homepage: `04-HOMEPAGE-SECTION-SPECIFICATION.md`
- Content rules: `05-CONTENT-AND-COPYWRITING-GUIDELINES.md`
- SEO/performance: `08-SEO-AND-PERFORMANCE.md`
- Tokens: `docs/shared/03-SHARED-DESIGN-TOKENS.md`

## Fixed stack — never change

Next.js, TypeScript, Tailwind, shadcn/ui, Hono API, Cloudflare Workers/R2, Zod, Sentry. Do not introduce Astro, Gatsby, another CMS framework or a different styling system. **Ask before adding any dependency.**

## You may edit

`apps/marketing/**`, `packages/design-tokens/**`, `packages/ui/**` (shared: changes need review from Dev 1 and Dev 2 when props or visuals change). **You do not edit `apps/api`**: public catalogue endpoints are built by Developer 2.

## Do not edit

`packages/schemas`, `database`, `auth`, `api-client`, `exam-core`; `apps/student`, `apps/admin`, and **all of `apps/api`** (request contract changes from Developer 2 instead).

## Hard rules

1. **Never** write fake testimonials, ratings, student counts, results, rankings or capacity claims. Hide sections that have no real, consented content.
2. Never hard-code prices or catalogue items. Use the API. Static copy lives in `content/`.
3. Never copy text, layout or imagery from competitor sites.
4. Login/register/checkout links go to the student app via `studentUrl()` with validated params.
5. Server Components by default. Client islands only for interactivity. Respect the JS budget (≤ 90 KB gz on the homepage).
6. Every page: metadata (title, description, canonical, OG), accessible landmarks, and no CLS from late-loading UI.
7. Staging must be `noindex`.
8. No business logic in route handlers (the allowed ones are redirects, revalidation, sitemap/robots and OG images). Never create a separate backend, CMS server or database for marketing content.
9. Design tokens only: no raw hex in components, and one amber CTA per viewport.

## Commands

```
pnpm dev:marketing
pnpm --filter @puzzlers/marketing test
pnpm --filter @puzzlers/marketing e2e
pnpm --filter @puzzlers/marketing build && pnpm --filter @puzzlers/marketing preview
pnpm lint && pnpm typecheck
```

## When unsure

If a claim cannot be verified, leave it out. If data is missing from the API, request a contract change. Do not fabricate the data or derive it in the browser.
