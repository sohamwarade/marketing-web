# D3-04 — Homepage Section Specification

Order, purpose, content, data source and behaviour for each section. Backgrounds alternate white / cream / pale blue to separate sections without heavy dividers.

| # | Section | Background | Data | Hide when |
|---|---|---|---|---|
| 1 | Hero | white + subtle blue gradient accent panel | static + exam list | — |
| 2 | Value proposition strip | white | static | — |
| 3 | Examination categories | cream | `GET /v1/public/examinations` | no active exams |
| 4 | Featured courses | white | `GET /v1/public/courses?featured=true` | 0 items |
| 5 | Popular batches | pale blue | `GET /v1/public/batches?featured=true` | 0 items |
| 6 | Test series | white | `GET /v1/public/test-series` | 0 items |
| 7 | Platform features | cream | static | — |
| 8 | Why choose Puzzlers | white | static (factual) | — |
| 9 | Learning workflow | pale blue | static | — |
| 10 | Testimonials | white | real testimonials source (D-21) | **no consented testimonials** |
| 11 | FAQs | cream | `GET /v1/public/faqs?scope=global` (top 6) | 0 items |
| 12 | Final CTA | navy | static | — |
| 13 | Footer | navy | static/settings | — |

## 1. Hero

- **H1** (display font, `text-display`): a clear, factual promise. Example draft: "Prepare for MHT-CET and JEE with structured courses and real exam-pattern tests." The final copy comes from the owner.
- Subline (1–2 sentences): learning + practice + CBT mocks + analysis in one place.
- CTAs: primary **"Start free"** (amber, navy text) → `/register`; secondary "Explore test series" (outline) → `/test-series`.
- Exam quick-pick chips: MHT-CET · JEE Main · JEE Advanced → landing pages.
- Visual: a real product screenshot (exam screen or analysis) in a device frame, from staging synthetic data. `priority` image (LCP), width/height set, AVIF/WebP.
- Mobile: text first, CTAs full width, image below (smaller, still above the fold if possible).

## 2. Value proposition strip

3–4 short factual statements with icons: "Video lessons and notes", "Chapter-wise practice with solutions", "Exam-pattern mock tests", "Detailed performance analysis". No numbers unless they are real and current (e.g. "1,200+ practice questions" only when the question bank count is real; from `platform-status.counts`).

## 3. Examination categories

Three large cards (MHT-CET, JEE Main, JEE Advanced): name, a one-line description, what is available ("12 courses · 3 test series", from the API counts), CTA "Explore". Keyboard-focusable cards (the whole card is a link with one accessible name).

## 4. Featured courses

A horizontal scroll on mobile, a 3–4 column grid on desktop. `CourseCard`. "View all courses" link.

## 5. Popular batches

`BatchCard`: exam badge, title, academic year, start date, validity, price/compare-at, "Free" badge, CTA. "Popular" means admin-tagged `featured`; never computed or invented.

## 6. Test series

`TestSeriesCard`: test counts by kind, the next scheduled test date (if any), price. CTA "View schedule".

## 7. Platform features

A 2×3 grid of feature tiles (icon, title, 2-line description), each linking to the `/features` anchors.

## 8. Why choose Puzzlers

Factual differentiators, each true for the product as built:
- Tests follow the configured exam pattern (sections, marking, question types).
- Your answers are saved continuously and recover from network drops.
- Results and analysis by section, chapter, difficulty and time.
- Learn, practise and test in one account.

No comparisons naming competitors.

## 9. Learning workflow

A 4-step horizontal stepper (vertical on mobile): **Learn** (courses) → **Practise** (chapter questions) → **Test** (mocks and PYQs) → **Analyse & improve** (weak areas → practise again). A small illustration or icon per step.

## 10. Testimonials (conditional)

- Rendered **only** if the content source contains approved items (`consentOnFile: true`, `approvedBy`, `approvedAt`).
- Each item: name (or initials if the student prefers), exam + year, the quote (verbatim, as approved), and an optional photo (consented).
- No star ratings, no "rank" claims unless verified documentation is on file.
- MVP content source: a typed JSON file `content/testimonials.json` reviewed via PR *[Rec]*. Later: admin-managed.

## 11. FAQs

Top 6 global FAQs, an accordion, a "See all FAQs" link. FAQPage JSON-LD only on `/faq` (or here if `/faq` is not live) to avoid duplicate structured data *[Rec]*.

## 12. Final CTA

A navy band: "Start preparing today" + "Start free" (amber) + "Talk to us" (link to contact).

## Performance budget for the homepage

- LCP element: the hero heading or hero image (≤ 120 KB AVIF).
- JS: only the header menu, the auth-state island and the FAQ accordion hydrate. Everything else is server-rendered HTML.
- No carousels that auto-rotate. No video autoplay.
