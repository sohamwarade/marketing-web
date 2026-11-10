# D3-08 — SEO and Performance

## 1. Metadata

`lib/seo.ts` builds a Next.js `Metadata` object for every page:

| Field | Rule |
|---|---|
| `title` | `<Page title> | Puzzlers` (≤ 60 chars); homepage: "Puzzlers – MHT-CET & JEE Preparation: Courses, Practice & Mock Tests" (draft) |
| `description` | 140–160 chars, unique per page; catalogue pages use the short description |
| `alternates.canonical` | Absolute URL on the canonical host (`https://puzzlers.in`, the apex; `www` redirects to it). Strip query params except `page`. |
| `openGraph` | title, description, url, siteName, `images` (1200×630 from `opengraph-image.tsx`), `locale: en_IN`, `type` |
| `twitter` | `summary_large_image` |
| `robots` | `index, follow` in production; **`noindex` on staging** (env-driven) |
| `metadataBase` | `new URL(process.env.NEXT_PUBLIC_APP_URL)` |

## 2. Sitemap and robots

```ts
// app/sitemap.ts
export const revalidate = 3600;
export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const { examinations, batches, courses } = await api.public.sitemapEntries();
  const statics = ["", "/about", "/courses", "/batches", "/test-series", "/pricing", "/features", "/contact", "/faq",
                   "/privacy-policy", "/terms", "/refund-policy"];
  return [
    ...statics.map(p => ({ url: base + p, changeFrequency: "weekly" as const })),
    ...examinations.map(e => ({ url: `${base}/${e.slug}`, lastModified: e.updatedAt })),
    ...courses.map(c => ({ url: `${base}/courses/${c.slug}`, lastModified: c.updatedAt })),
    ...batches.map(b => ({ url: `${base}/batches/${b.slug}`, lastModified: b.updatedAt })),
  ];
}
// app/robots.ts → production: allow all, sitemap URL; staging: disallow all
```

`/login` and `/register` are excluded from the sitemap and marked `noindex` (they are redirects).

## 3. Structured data (JSON-LD via `<script type="application/ld+json">`)

| Page | Types |
|---|---|
| All | `Organization` (name, url, logo, sameAs only for real profiles), `WebSite` |
| Exam landing | `BreadcrumbList`, `FAQPage` (if FAQs), `ItemList` (courses) |
| Course detail | `Course` (+ `hasCourseInstance` *[Rec]*, `offers` with `price`, `priceCurrency: INR`, `category`), `BreadcrumbList` |
| Batch detail | `Product` + `Offer` *[Rec]*, `BreadcrumbList` |
| FAQ | `FAQPage` |

Validate with the Rich Results Test before launch (test J-12). Never mark up reviews or ratings unless they are real and displayed on the page.

## 4. URL rules

Lowercase, hyphenated slugs. Trailing slash: none (configure `trailingSlash: false`; redirect variants). One canonical host (redirect apex ↔ www via a Cloudflare redirect rule). Old slugs: when an admin changes a slug, store the old one and 301 to the new one *[Rec: `slug_redirects` table: contract/DB addition, Phase 8]*.

## 5. Performance targets and techniques

| Target (mobile, p75) | Value |
|---|---|
| LCP | < 2.5 s |
| INP | < 200 ms |
| CLS | < 0.1 |
| JS on the homepage | ≤ 90 KB gz |
| Lighthouse Performance (lab, mobile) | ≥ 90 |

Techniques:
- Server Components by default. Islands only for interactive bits.
- `next/font` with `display: swap`, subset Latin, two families max.
- Hero image `priority`, explicit dimensions, AVIF/WebP. Other images lazy.
- If OpenNext image optimisation is unavailable (PoC), pre-size images at upload (admin thumbnails stored in 2–3 widths) and use `<img srcset>` *[Rec]*.
- No third-party scripts except consent-gated analytics and Turnstile on contact.
- Cache: catalogue HTML from ISR, API responses with `s-maxage`, static assets immutable.

## 6. Monitoring

- Lighthouse CI on PRs touching `apps/marketing` (homepage, exam landing, course detail) *[Rec]*.
- Search Console (owner account) after launch. Sitemap submitted.
- Sentry for runtime errors.
- Real-user Web Vitals via Cloudflare Web Analytics or the analytics provider (consent per D-18).
