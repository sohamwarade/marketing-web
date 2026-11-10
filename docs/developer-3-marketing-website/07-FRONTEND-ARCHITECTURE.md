# D3-07 — Frontend Architecture (apps/marketing)

## 1. Folder structure

```
apps/marketing/
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── layout.tsx               # Header, Footer, data-surface="marketing"
│   │   │   ├── page.tsx                 # homepage
│   │   │   ├── about/  features/  pricing/  contact/  faq/
│   │   │   ├── [exam]/page.tsx          # exam landing template (dynamicParams = false)
│   │   │   ├── courses/page.tsx  courses/[slug]/page.tsx
│   │   │   ├── batches/page.tsx  batches/[slug]/page.tsx
│   │   │   ├── test-series/page.tsx
│   │   │   └── (legal)/privacy-policy/  terms/  refund-policy/
│   │   ├── login/route.ts  register/route.ts       # 307 redirects to the student app
│   │   ├── api/revalidate/route.ts                 # on-demand ISR (secret-protected; UI concern only)
│   │   ├── sitemap.ts  robots.ts  not-found.tsx  error.tsx
│   │   └── opengraph-image.tsx                     # default OG
│   ├── components/                  # marketing-only sections (Hero, ValueStrip, ExamCards, Stepper, CTABand…)
│   ├── content/                     # legal MDX, static copy JSON, testimonials.json (consented only)
│   ├── lib/
│   │   ├── api.ts                   # server api-client (public endpoints, no cookies)
│   │   ├── seo.ts                   # buildMetadata(), jsonLd helpers
│   │   ├── links.ts                 # studentUrl(path, params) with exam/next/utm handling
│   │   └── format.ts
│   └── islands/                     # small client components: AuthStateButton, MobileNav, CatalogFilters, ContactForm, FaqSearch
├── e2e/
└── next.config.ts  open-next.config.ts  wrangler.jsonc
```

## 2. Rendering and caching

| Layer | Mechanism |
|---|---|
| Static pages | SSG at build |
| Catalogue pages | ISR `export const revalidate = 300`, backed by the OpenNext R2 incremental cache |
| On-demand freshness | The API's publish/unpublish events call `POST https://puzzlers.in/api/revalidate` with `REVALIDATE_SECRET` and the paths/tags *[Rec: enqueue from the API `q-jobs` after publish; contract addition for the API side]* |
| API calls at build/ISR | Server-side `fetch` via `api-client` with `next: { revalidate: 300, tags: ['catalog'] }` |
| Client islands | Hydrate only where needed (`"use client"` components in `islands/`) |

Build resilience: if the API is unreachable at build, catalogue pages build with an empty state and revalidate later. The build must not fail.

## 3. Auth state island

`AuthStateButton` (client) calls `GET /v1/me` with `credentials: "include"` after hydration. It renders "Login / Start free" by default and swaps to "Go to dashboard" on 200. It never blocks render, so there is no layout shift (fixed width).

## 4. Links to the student app

```ts
// lib/links.ts
export function studentUrl(path: string, params: Record<string, string | undefined> = {}) {
  const url = new URL(path, process.env.NEXT_PUBLIC_STUDENT_URL);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  return url.toString();
}
// e.g. studentUrl("/register", { exam: "jee-main", next: "/explore/batches/jee-2027-dropper" })
```

UTM parameters on the incoming URL are forwarded to registration links (stored in the profile later *[Rec]*).

## 5. Dependencies

Only `@puzzlers/ui`, `@puzzlers/design-tokens`, `@puzzlers/api-client`, `@puzzlers/schemas`, `next`, MDX support (`@next/mdx`), `katex` (if math appears in course descriptions). No database, no auth server, no exam-core.
