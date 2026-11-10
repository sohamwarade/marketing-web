# D3-09 — API Integration (Marketing)

Endpoints: [../09 §3](../09-API-CONTRACT-AND-ENDPOINTS.md#3-public-catalogue-marketing--logged-out-student). All are anonymous and cached.

| Page/section | Endpoint | Caching |
|---|---|---|
| Header exam menu, homepage exam cards | `GET /v1/public/examinations` | ISR 300 s |
| Exam landing | `GET /v1/public/examinations/:slug` | ISR 300 s |
| Homepage featured courses | `GET /v1/public/courses?featured=true&pageSize=8` | ISR |
| Homepage popular batches | `GET /v1/public/batches?featured=true&pageSize=6` | ISR |
| Test series | `GET /v1/public/test-series` | ISR |
| Courses listing | `GET /v1/public/courses?examination&subject&free&page&sort` | ISR for page 1; client fetch for filters |
| Course detail | `GET /v1/public/courses/:slug` | ISR |
| Batches listing/detail | `GET /v1/public/batches…`, `GET /v1/public/batches/:slug` | ISR |
| Pricing | `GET /v1/public/batches?pageSize=100`, `GET /v1/public/courses?sellable=true&pageSize=100`, `GET /v1/public/platform-status` | ISR |
| FAQ | `GET /v1/public/faqs?scope=…` | ISR |
| Sitemap | `GET /v1/public/sitemap-entries` | 1 h |
| Maintenance banner, trial count, counts | `GET /v1/public/platform-status` | 60 s |
| Header auth state (client) | `GET /v1/me` with credentials | none |
| Contact | `POST /v1/public/contact` | none |

## Required response fields (marketing perspective)

- `PublicBatchCard`: `id, slug, title, examination {code, name, slug}, kind, academicYear, startsAt, endsAt, validity {mode, days, endsAt}, pricePaise, compareAtPricePaise, isFree, tags[], thumbnailUrl, counts {courses, tests}, enrollment {open, closesAt, seatsLeft}`.
- `PublicCourseCard`: `id, slug, title, examination, subject, pricePaise, compareAtPricePaise, isFree, thumbnailUrl, counts {lessons, videos, pdfs, tests}`.
- `PublicExaminationDetail`: `code, name, slug, description, patternSummary {subjects[], questionTypes[], marking[], durationMinutes, source: 'exam_profile', profileName}, featured {batches[], courses[], testSeries[]}, counts`.
- `platform-status`: `maintenanceMode, features {trialMaxTests, contactEnabled}, counts {publishedQuestions?, publishedTests?}` (counts are present only when the owner enables showing them).

These fields are in the contract ([../09 §3](../09-API-CONTRACT-AND-ENDPOINTS.md#3-public-catalogue-marketing--logged-out-student)). If any are missing when you implement, raise a contract PR. Do not compute them client-side from other calls.

## Error handling

- 404 from a detail endpoint → `notFound()` (Next.js 404 page).
- 5xx/timeouts during ISR → keep serving the last good page (ISR behaviour). On first build: render the empty state.
- Contact errors: `VALIDATION_FAILED` → field errors; `RATE_LIMITED` → "Please try again in a minute".
