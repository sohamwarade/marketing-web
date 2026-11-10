# D3-03 — Page-by-Page Specification (Marketing)

Render modes: **SSG** = static at build; **ISR** = static + revalidate (300 s) + on-demand; **SSR** only where noted.

## Page inventory

| # | Page | Route | Render | Data |
|---|---|---|---|---|
| 1 | Homepage | `/` | ISR | examinations, featured batches/courses/test series, FAQs |
| 2 | About Puzzlers | `/about` | SSG | static content |
| 3 | MHT-CET landing | `/mht-cet` | ISR | `GET /v1/public/examinations/mht-cet` |
| 4 | JEE Main landing | `/jee-main` | ISR | `…/examinations/jee-main` |
| 5 | JEE Advanced landing | `/jee-advanced` | ISR | `…/examinations/jee-advanced` |
| 6 | Courses listing | `/courses` | ISR + client filters | `GET /v1/public/courses` |
| 7 | Course detail | `/courses/[slug]` | ISR (`generateStaticParams` from sitemap entries; `dynamicParams = true`) | `…/courses/:slug` |
| 8 | Batches listing | `/batches` | ISR + client filters | `GET /v1/public/batches?kind=regular` |
| 9 | Batch detail | `/batches/[slug]` | ISR | `…/batches/:slug` |
| 10 | Test series listing | `/test-series` | ISR | `GET /v1/public/test-series` (detail pages reuse `/batches/[slug]`) |
| 11 | Pricing | `/pricing` | ISR | batches + courses with prices |
| 12 | Features | `/features` | SSG | static |
| 13 | Contact | `/contact` | SSG + client form | `POST /v1/public/contact` |
| 14 | FAQs | `/faq` | ISR | `GET /v1/public/faqs?scope=global` |
| 15 | Login entry | `/login` | Route handler redirect (307) | → `${STUDENT_URL}/login?next=/dashboard` |
| 16 | Registration entry | `/register` | Route handler redirect (307) | → `${STUDENT_URL}/register` (keeps `exam`, `next`, UTM params) |
| 17 | Privacy policy | `/privacy-policy` | SSG (MDX) | owner-approved text |
| 18 | Terms and conditions | `/terms` | SSG (MDX) | owner-approved text |
| 19 | Refund policy | `/refund-policy` | SSG (MDX) | owner-approved text (D-05) |
| — | 404 | `not-found.tsx` | SSG | |
| — | `sitemap.xml` | `app/sitemap.ts` | ISR (1 h) | `GET /v1/public/sitemap-entries` |
| — | `robots.txt` | `app/robots.ts` | SSG | |
| — | OG images | `app/**/opengraph-image.tsx` | on demand | title, exam |

The exam landing pages are implemented by **one** template: `app/(site)/[exam]/page.tsx` with `generateStaticParams()` from `/v1/public/examinations` and `dynamicParams = false`. Static routes (`/about`, `/courses`…) take precedence over the dynamic segment. Reserved slugs that must never be used for an examination: `about, courses, batches, test-series, pricing, features, contact, faq, login, register, privacy-policy, terms, refund-policy` (the admin create-exam form validates this *[Rec: contract validation]*).

## Global layout

- **Header** (sticky, white, a shadow on scroll): logo · "Exams" mega menu (MHT-CET, JEE Main, JEE Advanced, with a one-line description each) · Courses · Batches · Test Series · Pricing · then right-aligned "Login" (ghost) and "Start free" (accent amber). Logged in: "Go to dashboard" replaces both. Mobile: hamburger → full-height sheet with the same items, and CTAs at the bottom.
- **Footer** (navy): about blurb, exam links, product links, legal links, contact (email/phone from settings, D-15), social links (if real accounts exist), "© <year> Puzzlers".
- Maintenance banner (MK-16), cookie/consent banner if required (D-18).

## 1. Homepage — see [04](04-HOMEPAGE-SECTION-SPECIFICATION.md)

## 2. About (`/about`)

Sections: mission (who Puzzlers is for, in plain words), what the platform includes (learning + practice + CBT + analytics), the team/faculty (only real people with consent and photos; otherwise omit), how we build tests (original/licensed questions, exam-pattern fidelity, server-evaluated results), contact CTA. Metadata: "About Puzzlers | MHT-CET & JEE Preparation Platform".

## 3–5. Exam landing pages (`/mht-cet`, `/jee-main`, `/jee-advanced`)

| Section | Content | Data |
|---|---|---|
| Hero | H1 "<Exam> preparation with Puzzlers", a subline on what is included, CTAs: "Start free" (`/register?exam=<slug>`) + "View test series" | examination name/description |
| Exam overview | A short factual pattern summary (subjects, question types, marking) **from the active exam profile**, labelled "Based on the latest official pattern; verify on the official website" | exam detail `patternSummary` |
| Featured batches | Up to 6 `BatchCard`s | `featured.batches` |
| Test series | Up to 3 `TestSeriesCard`s with test counts by kind | `featured.testSeries` |
| Courses | Subject-wise course cards | `featured.courses` |
| How preparation works | A 4-step learning workflow (Learn → Practice → Test → Analyse) | static |
| Exam FAQs | Accordion | `GET /v1/public/faqs?scope=examination:<slug>` |
| CTA band | "Try a free test" (if trial tests exist) or "Start free" | `/v1/public/platform-status` features |

JSON-LD: BreadcrumbList, FAQPage (if FAQs), ItemList of courses.

## 6. Courses listing (`/courses`)

Filters (client-side state in URL; data refetched on the client with TanStack Query *[Rec]*): exam, subject, free/paid; sort (recommended, price ↑/↓). A grid of `CourseCard` (thumbnail, exam badge, subject, title, lessons count, price/"Free", CTA "View course"). Pagination (24 per page) with crawlable `?page=` links. Empty state.

## 7. Course detail (`/courses/[slug]`)

| Block | Content |
|---|---|
| Hero | Title, exam & subject badges, short description, price block (`PriceTag`, validity), CTA: free → "Enroll free" → `${STUDENT}/register?next=/explore/courses/<slug>` (or the student explore page if logged in); paid → "Buy now" → `${STUDENT}/checkout?item=course:<id>` |
| What you get | Counts: lessons, videos, PDFs, practice sets, tests |
| Curriculum | Chapter → topic → lesson titles (accordion; preview lessons marked "Free preview" and linking to the student app) |
| Included in batches | Batches containing this course (cards) |
| FAQs | Course- or exam-scoped FAQs |
| Sticky mobile CTA bar | Price + CTA |

JSON-LD: `Course` (name, description, provider Organization, offers with price INR). 404 for unpublished items. Canonical `/courses/<slug>`.

## 8–9. Batches listing and detail

Listing like courses (filters: exam, free/paid, tags such as Class 12 / Dropper, start month). Detail: hero (title, exam, academic year, start/end, validity, price, seats left if `maxSeats`, "Enrollment closes on …"), included courses (cards), included tests (counts by kind + a schedule table when tests have windows), what you get, FAQs, CTA (Enroll free / Buy / "Enrollment closed" disabled / "Full" disabled). JSON-LD: Product + Offer *[Rec]*.

## 10. Test series (`/test-series`)

Cards for batches with `kind = test_series`: test counts by kind (full mocks, part syllabus, chapter, PYQ), exam, price, schedule link. Detail pages are `/batches/[slug]`, which renders the test-series variant (schedule first).

## 11. Pricing (`/pricing`)

A table/cards grouped by exam: free options first (free batches, trial tests "First N tests free" from `platform-status.features.trialMaxTests`), then paid batches and courses with prices from the API. Notes: taxes (D-17), refund policy link, coupon note ("Have a coupon? Apply at checkout"). No invented "most popular" badges unless the owner configures a tag.

## 12. Features (`/features`)

Factual sections describing actual product capabilities, each with a real UI screenshot (from staging with synthetic data; no real student data):
1. Structured courses (video, PDFs, notes)
2. Topic/chapter practice with solutions
3. Exam-pattern CBT tests (palette, sections, timer, autosave)
4. Detailed analysis (sections, chapters, difficulty, time)
5. Mistakes and notebooks
6. Free trial tests

No feature that is not shipped may be listed. Mark upcoming ones "Coming soon" only with owner approval.

## 13. Contact (`/contact`)

Form: name, email, phone (optional), topic (admissions, technical, payments, other), message (≤ 2,000), Turnstile. `POST /v1/public/contact` → success state "We'll reply within N working days" (D-15). Also shows the support email/phone and hours.

## 14. FAQ (`/faq`)

Grouped accordion (General, Exams, Batches & courses, Tests, Payments & refunds, Technical). Search within the FAQs (client). FAQPage JSON-LD.

## 15–16. Login / Register entry

Route handlers (`app/login/route.ts`, `app/register/route.ts`) that 307-redirect to the student app, preserving the allowed params (`exam`, `next`, `utm_*`). Keeping these routes gives stable, shareable URLs on the marketing domain.

## 17–19. Legal pages

MDX content in `content/legal/*.mdx`, with a "Last updated" date in front-matter, a table of contents, and print-friendly styling. Texts must be supplied or approved by the owner (legal review, D-18). Placeholders in staging are clearly marked "DRAFT – not legal text".
