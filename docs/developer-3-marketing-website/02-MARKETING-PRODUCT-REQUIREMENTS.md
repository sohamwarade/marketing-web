# D3-02 — Marketing Product Requirements

| ID | Requirement | Priority |
|---|---|---|
| MK-01 | 19 pages as listed in [03](03-PAGE-BY-PAGE-SPECIFICATION.md) | MVP |
| MK-02 | Responsive at 360–1920 px; no horizontal scroll | MVP |
| MK-03 | Unique `<title>`, meta description, canonical URL and Open Graph/Twitter tags on every page | MVP |
| MK-04 | `sitemap.xml` (static pages + catalogue slugs) and `robots.txt` | MVP |
| MK-05 | Structured data: Organization, WebSite, BreadcrumbList, Course (course detail), FAQPage (FAQ blocks), Product/Offer for batches *[Rec; verify Google eligibility]* | MVP |
| MK-06 | Core Web Vitals targets (LCP < 2.5 s, INP < 200 ms, CLS < 0.1 on mobile) | MVP |
| MK-07 | Accessible navigation (keyboard, skip link, focus states, ARIA for menus/accordions), WCAG 2.2 AA | MVP |
| MK-08 | Login/register CTAs link to the student app with `exam` and `next` parameters | MVP |
| MK-09 | Header reflects the logged-in state ("Go to dashboard") without blocking render | MVP |
| MK-10 | Catalogue pages render live data from `/v1/public/*` with ISR (revalidate ≤ 5 min) + on-demand revalidation webhook *[Rec]* | MVP |
| MK-11 | Contact form with Turnstile, validation and a success state | MVP |
| MK-12 | Testimonials/results only from real, consented sources; hidden when absent | MVP |
| MK-13 | Legal pages: privacy, terms, refund (owner-approved text) | MVP |
| MK-14 | 404 and error pages with navigation | MVP |
| MK-15 | Analytics with consent *[Rec, D-18]* | MVP if legally required |
| MK-16 | Maintenance banner when `platform-status.maintenanceMode` | MVP |
| MK-17 | Exam landing pages per examination, data-driven (adding an exam in admin + content makes a page possible) | MVP |
