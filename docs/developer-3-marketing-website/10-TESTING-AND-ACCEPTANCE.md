# D3-10 — Testing and Acceptance (Marketing)

## 1. Automated tests

| ID | Test |
|---|---|
| M-01 | Every route in the page inventory returns 200 (or 307 for login/register) on staging |
| M-02 | Each page has a unique title, a description and a canonical tag; OG image URL resolves (1200×630) |
| M-03 | `sitemap.xml` lists the static pages + all published slugs; no unpublished slug appears; `robots.txt` correct per env |
| M-04 | JSON-LD parses and validates against schema.org types (CI with a JSON-LD validator *[Rec]*) |
| M-05 | Header: keyboard navigation of the mega menu and mobile sheet; Esc closes; focus returns |
| M-06 | Auth island shows "Go to dashboard" for a logged-in session cookie (staging) without CLS |
| M-07 | CTA links carry the correct `exam`/`next`/UTM params to the student app |
| M-08 | Contact form: validation, Turnstile, success, rate-limit message |
| M-09 | Unpublishing a batch in admin removes it from listings after revalidation (≤ 5 min, or immediately with on-demand) |
| M-10 | Testimonials section is absent when the content file is empty |
| M-11 | axe: no serious/critical violations on all pages |
| M-12 | Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95 on homepage, exam landing and course detail |
| M-13 | 360 px viewport: no horizontal scroll on any page |
| M-14 | Staging pages are `noindex` |

## 2. Manual review checklist

- [ ] Every claim and number has a source (API field or owner-approved document)
- [ ] No placeholder lorem ipsum in production
- [ ] Legal pages approved and dated
- [ ] Images have alt text; product screenshots contain synthetic data only
- [ ] Brand palette and tokens are used (no ad-hoc colours)
- [ ] Consistent look with the student and admin apps (header logo, buttons, cards)

## 3. Acceptance (Developer 3 done)

- [ ] MK-01 … MK-17 implemented
- [ ] M-01 … M-14 pass
- [ ] Core Web Vitals targets met in lab tests; field data monitored after launch
- [ ] Rich Results Test passes for course detail and FAQ pages
- [ ] Works on Workers via OpenNext (ISR with the R2 cache verified)
