# 09 — API Contract and Endpoints

This is the **single API contract** for all three applications. Schemas named here (e.g. `StartAttemptResponse`) are Zod schemas in `@puzzlers/schemas`; their shapes are in [shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md](shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md). Change rules are in [shared/01-SHARED-API-CONTRACT.md](shared/01-SHARED-API-CONTRACT.md). **Developers do not invent endpoints or response shapes.** A new endpoint is added here first, through a contract PR.

## 1. Conventions

### 1.1 Base URL and versioning

- Base: `https://api.puzzlers.in` (local `http://localhost:8787`).
- Business routes: `/v1/...`. Better Auth: `/auth/...` (Better Auth `basePath: '/auth'`).
- Route families:
  - `/v1/public/*`: anonymous, cacheable (marketing + student catalogue)
  - `/v1/me/*`: the current student's own data
  - `/v1/...` (no prefix): student-facing resources by id (tests, attempts, lessons) with ownership/entitlement checks
  - `/v1/admin/*`: staff only (admin, super admin, faculty with scoped permissions)
  - `/v1/webhooks/*`: provider callbacks (no session; signature-verified)
- Breaking changes need `/v2` for the affected routes. Additive changes (new optional fields, new endpoints) are made in place.

### 1.2 Request rules

- JSON bodies (`Content-Type: application/json`). Exception: the beacon endpoint accepts `text/plain` (§17.2).
- IDs are UUID strings. User ids are opaque strings.
- Timestamps: ISO-8601 UTC strings (`2026-11-06T09:30:00.000Z`).
- Money: integer paise (`amountPaise`).
- Field naming: camelCase in JSON. snake_case exists only in the DB.
- Browsers send `credentials: 'include'`. The session cookie authenticates.

### 1.3 Response envelope

Success:

```json
{ "data": { }, "meta": { "requestId": "01J…" } }
```

List:

```json
{ "data": [ ], "meta": { "requestId": "…", "page": 1, "pageSize": 25, "total": 312 } }
```

Error:

```json
{
  "error": {
    "code": "ATTEMPT_LIMIT_REACHED",
    "message": "You have used all 1 attempts for this test.",
    "details": { "maxAttempts": 1 },
    "requestId": "01J…"
  }
}
```

- `code` is a stable machine-readable string (catalogue in §29). `message` is user-presentable English. `details` is optional and typed per code.
- Validation errors: `400 VALIDATION_FAILED` with `details.issues: [{ path: ["items",0,"itemId"], message }]` (from Zod).

### 1.4 HTTP status usage

| Status | Use |
|---|---|
| 200 | OK (reads, idempotent updates) |
| 201 | Created |
| 202 | Accepted (async job queued) |
| 204 | No content (deletes) |
| 400 | Validation failed |
| 401 | Not authenticated (`UNAUTHENTICATED`, `SESSION_EXPIRED`) |
| 403 | Authenticated but not allowed (`FORBIDDEN`, `NOT_ENTITLED`, `ACCESS_RESTRICTED`, `ACCOUNT_SUSPENDED`) |
| 404 | Not found **or not visible to this user** (never reveal the existence of private resources) |
| 409 | State conflict (`ATTEMPT_ALREADY_SUBMITTED`, `IDEMPOTENCY_KEY_REUSED`, `VERSION_CONFLICT`) |
| 410 | Gone (`ATTEMPT_DEADLINE_PASSED` for writes after deadline + grace) |
| 422 | Business rule violation (`SECTION_ATTEMPT_LIMIT`, `COUPON_INVALID`) |
| 429 | Rate limited (`RATE_LIMITED`, with a `Retry-After` header) |
| 500 | `INTERNAL_ERROR` (Sentry event id in `details.eventId`) |
| 503 | `MAINTENANCE_MODE` |

### 1.5 Pagination, filtering, sorting

- **Admin tables** use offset pagination: `?page=1&pageSize=25` (max 100). The response `meta` has `page`, `pageSize`, `total`.
- **Student feeds and large logs** use cursor pagination: `?cursor=<opaque>&limit=20` (max 50). `meta.nextCursor` is null at the end.
- Filtering: explicit, documented query params per endpoint (`?status=published&examinationId=…`). Multi-value: repeated params (`?status=draft&status=in_review`). Free-text: `?q=` (trigram/ILIKE on documented columns).
- Sorting: `?sort=createdAt:desc` (only the fields each endpoint lists; others give `400`).
- Optimistic concurrency on admin edits: `PATCH` bodies include `expectedUpdatedAt`. A mismatch returns `409 VERSION_CONFLICT`.

### 1.6 Idempotency

- Required header `Idempotency-Key: <uuid>` on: `POST /v1/orders`, `POST /v1/tests/:id/attempts`, `POST /v1/attempts/:id/submit`, `POST /v1/batches/:id/enroll`, `POST /v1/courses/:id/enroll`, `POST /v1/admin/refunds`, `POST /v1/admin/entitlements` and every bulk admin operation.
- The server stores `(userId, route, key) → (requestHash, status, body)` for 24 h. A replay with the same body returns the stored response. The same key with a different body returns `409 IDEMPOTENCY_KEY_REUSED`.
- Exam sync is idempotent by design (`clientEventId` + `seq`) and does not use the header.

### 1.7 Rate limiting

| Bucket | Key | Limit (initial; tune after load tests) |
|---|---|---|
| `auth` (sign-in, sign-up, forgot password) | IP + email | 10 / minute per IP; 5 / 15 min per email |
| `anon` (`/v1/public/*`) | IP | 120 / minute |
| `user` (default authenticated) | user id | 300 / minute |
| `exam-sync` | attempt id | 30 / minute (normal use is ~6 / minute) |
| `admin-bulk` | user id | 10 / minute |
| `webhooks` | provider IP ranges via WAF + signature | n/a |

These use Workers rate-limit bindings plus Cloudflare WAF rules for coarse IP limits. A `429` includes `Retry-After`.

### 1.8 File uploads

1. `POST /v1/admin/uploads` with `{ purpose, fileName, mimeType, sizeBytes }` returns `{ uploadId, uploadUrl, method: 'PUT', headers, expiresAt }` (an R2 presigned URL, 10 min).
2. The browser `PUT`s the file to `uploadUrl`.
3. `POST /v1/admin/uploads/:uploadId/confirm` makes the server `HEAD` the object, check the size and MIME type (magic bytes for PDF/PNG/JPEG/WebP), and mark it confirmed.
4. The upload id is referenced from the entity (lesson material, question image).

Allowed: PDF ≤ 50 MB; images (PNG/JPEG/WebP/SVG→rejected *[Rec: SVG rejected to avoid script injection]*) ≤ 5 MB; CSV/XLSX bulk import ≤ 10 MB.

### 1.9 File access

Private files are never public. `GET /v1/lessons/:id/materials/:materialId/url` checks the entitlement and returns a presigned GET URL valid for 5 minutes (`Content-Disposition: inline` unless the material is downloadable).

### 1.10 Webhooks

`POST /v1/webhooks/cashfree`: raw-body signature verification, timestamp tolerance, idempotent processing (§21.6).

### 1.11 API documentation

- `@hono/zod-openapi` generates `GET /v1/openapi.json` (staging only; disabled in production *[Rec]*).
- `pnpm openapi:export` writes it for Postman import. A Postman collection with environments (local, staging) is kept in `scripts/postman/`.

---

## 2. Authentication (Better Auth, mounted at `/auth/*`)

Better Auth provides these endpoints. Frontends call them through `authClient` from `@puzzlers/auth/client`, never by hand-written fetch.

| Method | Path | Purpose | Notes |
|---|---|---|---|
| POST | `/auth/sign-up/email` | Register | Body `{ name, email, password }` + Turnstile token header *[Rec]*. Additional fields (`phone`) as configured. |
| POST | `/auth/sign-in/email` | Login | Sets the session cookie |
| POST | `/auth/sign-out` | Logout | Revokes the session |
| GET | `/auth/get-session` | Current session | Used by SSR guards |
| POST | `/auth/request-password-reset` | Forgot password | Always 200 (no account enumeration) |
| POST | `/auth/reset-password` | Reset with token | |
| GET | `/auth/verify-email` | Verify email link | |
| POST | `/auth/change-password` | Change password | Option `revokeOtherSessions: true` |
| GET | `/auth/list-sessions` | List my sessions | |
| POST | `/auth/revoke-session`, `/auth/revoke-other-sessions` | Session control | |
| GET/POST | `/auth/sign-in/social` + callback | Google sign-in | **Only if D-09 approves it** |

The exact Better Auth paths depend on the installed version and plugins. The authoritative list is `GET /auth/reference` (Better Auth OpenAPI plugin) in staging. If paths differ, this table is updated through a contract PR.

**Puzzlers wrappers (business data around auth):**

| Method | Path | Auth | Purpose | Request → Response |
|---|---|---|---|---|
| GET | `/v1/me` | student/staff | Current user + roles + permissions + profile | → `MeResponse` |
| PATCH | `/v1/me/profile` | any | Update profile, exam preference | `UpdateProfileRequest` → `MeResponse` |
| POST | `/v1/me/onboarding` | student | Complete onboarding (exam, class, target year) | `OnboardingRequest` → `MeResponse` |

`MeResponse` contains `{ user: {id, name, email, emailVerified, phone, status, userType}, roles: string[], permissions: string[], profile, facultyScopes?: [...] }`. The admin app builds its navigation from `permissions`.

## 3. Public catalogue (marketing + logged-out student)

All are anonymous and return only `published` + `visibility = public` items. Cache: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600`.

| Method | Path | Purpose | Query | Response |
|---|---|---|---|---|
| GET | `/v1/public/platform-status` | Maintenance flag, feature flags, optional public counts | | `{ maintenanceMode, features: { trialMaxTests, contactEnabled, ... }, counts?: { publishedQuestions, publishedTests } }` (counts only when enabled in settings) |
| GET | `/v1/public/examinations` | Exam list for menus and landing pages | | `PublicExamination[]` |
| GET | `/v1/public/examinations/:slug` | Exam landing data | | `PublicExaminationDetail` `{ code, name, slug, description, patternSummary { subjects[], questionTypes[], marking[], durationMinutes, profileName } (from the default active exam profile), featured { batches[], courses[], testSeries[] }, counts }` |
| GET | `/v1/public/batches` | Batch listing | `examination`, `kind`, `tag`, `featured` (= tag `featured`), `free`, `page`, `pageSize`, `sort=displayOrder|priceAsc|priceDesc|startsAt` | `PublicBatchCard[]` `{ id, slug, title, examination, kind, academicYear, startsAt, endsAt, validity, pricePaise, compareAtPricePaise, isFree, tags, thumbnailUrl, counts { courses, tests }, enrollment { open, closesAt, seatsLeft } }` |
| GET | `/v1/public/batches/:slug` | Batch detail | | `PublicBatchDetail` (courses, test counts by kind, validity, price, schedule summary) |
| GET | `/v1/public/courses` | Course listing | `examination`, `subject`, `free`, `featured`, `sellable`, paging, sort | `PublicCourseCard[]` `{ id, slug, title, examination, subject, pricePaise, compareAtPricePaise, isFree, thumbnailUrl, counts { lessons, videos, pdfs, tests } }` |
| GET | `/v1/public/courses/:slug` | Course detail incl. curriculum outline (titles only) + preview lessons | | `PublicCourseDetail` |
| GET | `/v1/public/test-series` | = batches with `kind=test_series` | as batches | `PublicBatchCard[]` |
| GET | `/v1/public/faqs` | FAQ content | `scope=global|examination:<slug>|batch:<slug>` | `Faq[]` *(stored in `system_settings` key `content.faqs` in MVP)* |
| GET | `/v1/public/sitemap-entries` | Slugs + `updatedAt` for the sitemap | | `{ batches, courses, examinations }` |
| POST | `/v1/public/contact` | Contact form | `ContactRequest` + Turnstile | 202 |

Errors: `404 NOT_FOUND` for unpublished/private slugs.

## 4. Students — self-service (`/v1/me/*`)

| Method | Path | Purpose | Response |
|---|---|---|---|
| GET | `/v1/me/dashboard` | One-call dashboard aggregate | `DashboardResponse` `{ activeBatches[], courses[] (with progress), continueLearning?, upcomingTests[], inProgressAttempts[], recentResults[], performanceSummary, announcements[] }` |
| GET | `/v1/me/batches` | My batches (active + expired) | `MyBatch[]` |
| GET | `/v1/me/batches/:batchId` | Batch detail for an enrolled student | `MyBatchDetail` (courses, tests with `studentState`) |
| GET | `/v1/me/courses` | My courses (direct + via batch) | `MyCourse[]` with `accessVia: ('batch'|'course'|'grant')[]` |
| GET | `/v1/me/tests` | All tests I can see | filters `kind`, `batchId`, `state`, cursor → `StudentTestCard[]` |
| GET | `/v1/me/attempts` | Attempt history | cursor → `AttemptSummary[]` |
| GET | `/v1/me/orders` | Purchase history | cursor → `OrderSummary[]` |
| GET | `/v1/me/notifications` | Notifications | cursor, `unreadOnly` → `UserNotification[]` + `meta.unreadCount` |
| POST | `/v1/me/notifications/read` | Mark read | `{ ids: uuid[] } | { all: true }` → 204 |
| GET | `/v1/me/performance` | Historical trend + weak areas | `examinationId` → `PerformanceOverview` |
| GET | `/v1/me/trial` | Trial status | → `{ maxTests, used, remaining, eligibleTests[] }` |

## 5. Admin — users, roles, permissions

| Method | Path | Permission | Purpose |
|---|---|---|---|
| GET | `/v1/admin/students` | `student:view` | Search/filter (`q` name/email/phone, `status`, `batchId`, `courseId`, `examinationId`, `registeredFrom/To`, paging, sort) → `AdminStudentRow[]` |
| GET | `/v1/admin/students/:userId` | `student:view` | Profile + summary counts → `AdminStudentDetail` |
| GET | `/v1/admin/students/:userId/entitlements` | `student:view` | Entitlements + overrides + trial usage |
| GET | `/v1/admin/students/:userId/orders` | `order:view` | Orders |
| GET | `/v1/admin/students/:userId/attempts` | `results:view` | Attempts + scores |
| GET | `/v1/admin/students/:userId/audit` | `audit:view` | Admin changes to this student |
| POST | `/v1/admin/students/:userId/suspend` | `student:suspend` | `{ reason }` → suspends the account, revokes all sessions, audit |
| POST | `/v1/admin/students/:userId/reactivate` | `student:suspend` | `{ reason }` |
| POST | `/v1/admin/students/:userId/revoke-sessions` | `student:suspend` | Force logout |
| GET | `/v1/admin/staff` | `staff:view` | Admin + faculty users |
| POST | `/v1/admin/staff` | `staff:manage` | `CreateStaffRequest {name, email, roleKeys[]}` → creates the user, sends an invite/reset email |
| PATCH | `/v1/admin/staff/:userId` | `staff:manage` | Name, status |
| PUT | `/v1/admin/staff/:userId/roles` | `role:assign` | `{ roleKeys[] }`. Cannot remove your own `super_admin`; cannot grant `super_admin` unless you are one. |
| GET | `/v1/admin/roles` | `role:view` | Roles + permissions |
| POST | `/v1/admin/roles` | `role:manage` (super admin) | Custom role |
| PUT | `/v1/admin/roles/:roleId/permissions` | `role:manage` | `{ permissionKeys[] }` (system roles' core permissions are locked) |
| GET | `/v1/admin/permissions` | `role:view` | The permission catalogue |

## 6. Faculty

| Method | Path | Permission | Purpose |
|---|---|---|---|
| GET | `/v1/admin/faculty` | `staff:view` | Faculty list + assignment counts |
| GET | `/v1/admin/faculty/:userId/assignments` | `staff:view` | Assignments |
| POST | `/v1/admin/faculty/:userId/assignments` | `faculty:assign` | `{ scopeType, scopeId, responsibilities[] }` |
| DELETE | `/v1/admin/faculty/:userId/assignments/:assignmentId` | `faculty:assign` | Remove |
| GET | `/v1/admin/faculty/:userId/activity` | `audit:view` | Audit entries where actor = faculty |

Faculty use the same `/v1/admin/*` content endpoints. Their **scope filter** is applied on the server: list endpoints return only assigned resources, and writes outside scope return `403 FORBIDDEN_SCOPE`.

## 7. Examinations and exam profiles

| Method | Path | Permission | Request → Response |
|---|---|---|---|
| GET | `/v1/admin/examinations` | `exam:view` | → `Examination[]` |
| POST | `/v1/admin/examinations` | `exam:manage` | `CreateExaminationRequest {code, name, slug, description}` → `Examination` |
| PATCH | `/v1/admin/examinations/:id` | `exam:manage` | partial + `expectedUpdatedAt` |
| GET | `/v1/admin/examinations/:id/profiles` | `exam:view` | → `ExamProfile[]` |
| POST | `/v1/admin/exam-profiles` | `exam:manage` | `ExamProfileInput` (incl. `sections: ExamProfileSectionInput[]`, `policy`) |
| GET/PATCH | `/v1/admin/exam-profiles/:id` | view/manage | |
| POST | `/v1/admin/exam-profiles/:id/activate` / `archive` | `exam:manage` | Status change |
| PUT | `/v1/admin/examinations/:id/subjects` | `exam:manage` | `{ subjectIds[] }` |

Validation: marks values are decimals with ≤ 2 dp; `marksIncorrect ≤ 0`; slots within the duration and non-overlapping; `maxAttemptLimit ≤ questionCount`.

## 8. Subjects, chapters, topics (taxonomy)

| Method | Path | Permission |
|---|---|---|
| GET | `/v1/admin/subjects` · POST · PATCH `/:id` | `taxonomy:view` / `taxonomy:manage` |
| GET | `/v1/admin/subjects/:id/chapters` (+ `examinationId` filter) | `taxonomy:view` |
| POST | `/v1/admin/chapters` · PATCH `/:id` · POST `/:id/archive` | `taxonomy:manage` |
| PUT | `/v1/admin/examinations/:id/chapters` `{ chapterIds[] }` | `taxonomy:manage` |
| GET | `/v1/admin/chapters/:id/topics` · POST `/v1/admin/topics` · PATCH `/:id` | |
| POST | `/v1/admin/chapters/reorder` `{ subjectId, orderedIds[] }` | `taxonomy:manage` |
| GET | `/v1/taxonomy?examinationId=` | any authenticated (student filters) → subjects → chapters → topics tree |

## 9. Courses and course structure

| Method | Path | Permission | Notes |
|---|---|---|---|
| GET | `/v1/admin/courses` | `course:view` | Filters `examinationId`, `subjectId`, `status`, `q`, `free`; paging |
| POST | `/v1/admin/courses` | `course:manage` | `CourseInput` → `Course` |
| GET | `/v1/admin/courses/:id` | `course:view` | Includes the full tree (chapters → topics → lessons) |
| PATCH | `/v1/admin/courses/:id` | `course:manage` | Includes pricing (`pricePaise`, `compareAtPricePaise`, `validityDays`) → also needs `pricing:manage` if the price changes |
| POST | `/v1/admin/courses/:id/publish` · `/unpublish` · `/archive` | `course:publish` | Publish validates: ≥1 chapter, ≥1 published lesson, video lessons have refs, the paid course has no YouTube `entitled` lessons |
| POST | `/v1/admin/courses/:id/duplicate` | `course:manage` | Deep copy as draft |
| POST | `/v1/admin/courses/:id/chapters` · PATCH/DELETE `/v1/admin/course-chapters/:id` | `course:manage` | DELETE only when there are no lessons, otherwise archive |
| POST | `/v1/admin/course-chapters/:id/topics` · PATCH/DELETE `/v1/admin/course-topics/:id` | `course:manage` | |
| POST | `/v1/admin/courses/:id/reorder` | `course:manage` | `{ chapters: [{id, topics:[{id, lessons:[id]}], lessons:[id]}] }`, one transaction |

Student side:

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/v1/courses/:courseId` | student | Course tree with per-lesson `{locked, lockReason, progress}`. `404` if not visible. |
| POST | `/v1/courses/:courseId/enroll` | student | Free course only (`422 COURSE_NOT_FREE` otherwise). Idempotency-Key. → `Entitlement` |

## 10. Lessons and learning materials

| Method | Path | Permission / auth | Purpose |
|---|---|---|---|
| POST | `/v1/admin/course-chapters/:id/lessons` | `course:manage` | `LessonInput` (discriminated by `type`) |
| PATCH | `/v1/admin/lessons/:id` | `course:manage` | |
| POST | `/v1/admin/lessons/:id/materials` | `course:manage` | `{ uploadId | url, title, kind, downloadable }` |
| DELETE | `/v1/admin/lessons/:id/materials/:materialId` | `course:manage` | |
| GET | `/v1/lessons/:lessonId` | student + entitlement | → `LessonView` (`video: {provider, playback}`, `body`, `materials[]` without URLs, `prev`, `next`) |
| GET | `/v1/lessons/:lessonId/video-playback` | student + entitlement | → `{ provider: 'youtube', videoId } | { provider: 'paid_host', playbackUrl | token, expiresAt }` (signed, short-lived) |
| GET | `/v1/lessons/:lessonId/materials/:materialId/url` | student + entitlement | → `{ url, expiresAt }` (5 min) |
| PUT | `/v1/lessons/:lessonId/progress` | student + entitlement | `{ status, progressPercent, lastPositionSeconds }` → `LessonProgress`. Monotonic: completed stays completed. |

Errors: `403 NOT_ENTITLED` (with `details.purchaseOptions[]`: batches/courses that unlock it), `403 ACCESS_RESTRICTED`, `403 CONTENT_NOT_YET_AVAILABLE` (`details.availableFrom`).

## 11. Batches

| Method | Path | Permission | Notes |
|---|---|---|---|
| GET | `/v1/admin/batches` | `batch:view` | Filters `examinationId`, `kind`, `status`, `free`, `q` |
| POST | `/v1/admin/batches` | `batch:manage` | `BatchInput` |
| GET/PATCH | `/v1/admin/batches/:id` | view/manage (+`pricing:manage` for price) | |
| PUT | `/v1/admin/batches/:id/courses` | `batch:manage` | `{ items: [{courseId, position}] }` (replace set) |
| PUT | `/v1/admin/batches/:id/tests` | `batch:manage` | `{ items: [{testId, position, availableFrom?, availableUntil?}] }` |
| POST | `/v1/admin/batches/:id/publish` · `/unpublish` · `/archive` | `batch:publish` | Publish validates: courses are published, tests are published, the price is set, validity is consistent |
| GET | `/v1/admin/batches/:id/enrollments` | `student:view` | Entitlements for this batch, paging, export |
| POST | `/v1/batches/:batchId/enroll` | student | Free batch only. Checks enrollment window, seats, `enrollment_rule = open`. Idempotency-Key. → `Entitlement`. Errors `422 BATCH_NOT_FREE`, `422 ENROLLMENT_CLOSED`, `422 BATCH_FULL`, `409 ALREADY_ENROLLED` (returns the existing entitlement in `details`). |

## 12. Enrollments, entitlements, overrides, trials (admin)

| Method | Path | Permission | Request → Response |
|---|---|---|---|
| POST | `/v1/admin/entitlements` | `access:grant` | `GrantEntitlementRequest {userId, scopeType: 'batch'|'course'|'test', scopeId, endsAt?, note, reason}` + Idempotency-Key → `Entitlement` (`source = admin_grant`) |
| POST | `/v1/admin/entitlements/bulk` | `access:grant` | `{ userIds[] ≤ 500, scopeType, scopeId, endsAt?, reason }` → 202 `{ jobId }` or 200 summary for ≤ 50 |
| PATCH | `/v1/admin/entitlements/:id` | `access:grant` | `{ endsAt, note, reason }` (extend/shorten) |
| POST | `/v1/admin/entitlements/:id/revoke` | `access:revoke` | `{ reason }` |
| POST | `/v1/admin/access-overrides` | `access:restrict` (restrict) / `access:grant` (grant) | `{ userId, effect, scopeType, scopeId, reason, endsAt? }` |
| POST | `/v1/admin/access-overrides/:id/lift` | same | `{ reason }` |
| GET | `/v1/admin/access/check` | `access:view` | `?userId&resourceType&resourceId` → `AccessDecision` (**debug tool**: shows the exact rule that allowed or denied) |
| POST | `/v1/admin/trials/:userId/reset` | `access:grant` | `{ reason }` (super admin; audited) |

`AccessDecision = { allowed: boolean, reason: AccessReason, via?: { type, id }, details? }`, where `AccessReason ∈ {suspended, restricted, entitled_batch, entitled_course, entitled_test, override_grant, trial, free_test, preview, not_published, not_yet_available, expired, not_entitled}`.

## 13. Questions

| Method | Path | Permission | Notes |
|---|---|---|---|
| GET | `/v1/admin/questions` | `question:view` | Filters `subjectId`, `chapterId`, `topicId`, `type`, `difficulty`, `status`, `source`, `pyqYear`, `tag`, `ownerId`, `q` (stem text search), `usedInTestId`; paging |
| POST | `/v1/admin/questions` | `question:create` | `QuestionInput` (discriminated by `type`; includes `stem`, `options[]`, `answerKey`, `solution`, tags, difficulty, taxonomy, source) → `AdminQuestion` (status `draft`, version 1) |
| GET | `/v1/admin/questions/:id` | `question:view` | Draft + current published version + usage (tests) |
| PATCH | `/v1/admin/questions/:id` | `question:edit` | Edits the **draft version** (creates one from current if none). `expectedUpdatedAt`. |
| POST | `/v1/admin/questions/:id/submit-review` | `question:edit` | draft → in_review |
| POST | `/v1/admin/questions/:id/review` | `question:review` | `{ decision: 'approve'|'reject', comment }`. Approve → publish the draft version (immutable), `current_version_id` updated. The reviewer cannot be the author unless they have `question:self_publish` (admin). |
| POST | `/v1/admin/questions/:id/archive` | `question:publish` | |
| GET | `/v1/admin/questions/:id/versions` | `question:view` | Version history + diff-friendly payloads |
| POST | `/v1/admin/questions/preview` | `question:view` | Renders the sanitised stem (server sanitiser) for the editor preview |
| POST | `/v1/admin/questions/import` | `question:import` | `{ uploadId, format: 'csv'|'xlsx'|'json', dryRun: boolean }` → 202 `{ jobId }`. Dry run returns a validation report (row errors). Format: [developer-2 09](developer-2-admin-platform/09-FORMS-TABLES-AND-BULK-ACTIONS.md). |
| GET | `/v1/admin/questions/import/:jobId` | `question:import` | Status + report |
| GET | `/v1/admin/question-reports` · POST `/:id/resolve` | `question:review` | Student issue reports |

Student:

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/v1/questions/:questionId/report` | student | `{ reason, details, attemptId? }` → 201 |

## 14. Tests (builder)

| Method | Path | Permission | Notes |
|---|---|---|---|
| GET | `/v1/admin/tests` | `test:view` | Filters `examinationId`, `examProfileId`, `kind`, `status`, `batchId`, `q`, `availableFrom/To` |
| POST | `/v1/admin/tests` | `test:manage` | `TestInput` (optionally `fromExamProfileId` to copy section templates) |
| GET | `/v1/admin/tests/:id` | `test:view` | Config + sections + questions (with question summaries) + validation status |
| PATCH | `/v1/admin/tests/:id` | `test:manage` | Config only. **Changing a published test's config creates a draft change set; it applies at the next publish.** |
| POST | `/v1/admin/tests/:id/sections` · PATCH/DELETE `/v1/admin/test-sections/:id` | `test:manage` | |
| PUT | `/v1/admin/test-sections/:id/questions` | `test:manage` | `{ items: [{questionId, position, marksCorrectOverride?, marksIncorrectOverride?}] }` |
| PUT | `/v1/admin/test-sections/:id/rules` | `test:manage` | Random selection rules |
| POST | `/v1/admin/tests/:id/validate` | `test:view` | → `TestValidationReport { errors[], warnings[], totals }` |
| GET | `/v1/admin/tests/:id/preview` | `test:view` | Renders the paper **as a student sees it** (key-free) + a separate key overlay for the admin |
| POST | `/v1/admin/tests/:id/publish` | `test:publish` | Validates → creates a publication → `TestPublication`. Errors `422 TEST_INVALID` (with the report). |
| POST | `/v1/admin/tests/:id/unpublish` | `test:publish` | Hides from new starts. In-progress attempts continue. |
| POST | `/v1/admin/tests/:id/archive` | `test:publish` | |
| POST | `/v1/admin/tests/:id/duplicate` | `test:manage` | |
| POST | `/v1/admin/tests/:id/release-results` | `results:release` | For `manual` release |
| POST | `/v1/admin/tests/:id/release-solutions` | `results:release` | |

## 15. Student test discovery

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/v1/tests/:testId` | student | `StudentTestDetail`: title, kind, exam, duration, sections (title, question count, marking, attempt limit), instructions, availability window, `serverNow`, `access: AccessDecision`, `attempts: {used, max, inProgressAttemptId?, nextAllowedAt?}`, `canStart: boolean`, `cannotStartReason?`. **No question content.** |

`cannotStartReason ∈ {NOT_ENTITLED, ACCESS_RESTRICTED, NOT_YET_OPEN, WINDOW_CLOSED, ATTEMPT_LIMIT_REACHED, REATTEMPT_NOT_YET_ALLOWED, TRIAL_EXHAUSTED, TEST_UNPUBLISHED}`.

## 16. Test attempts

### 16.1 Start or resume

`POST /v1/tests/:testId/attempts`

| Aspect | Value |
|---|---|
| Auth | student session |
| Headers | `Idempotency-Key` (required) |
| Request | `StartAttemptRequest { acceptedInstructions: true, client: { tz, viewport, ua? } }` |
| Behaviour | If an `in_progress` attempt exists for (user, test): return it (**resume**, 200). Else check access (§12), the window, attempt limits and the reattempt policy; consume a trial if `access_source = trial`; compute the deadline; insert the attempt (201); enqueue the delayed auto-submit. |
| Deadline | `deadline = startedAt + durationSeconds`; with `late_start_policy = window_capped` and an `availability_ends_at`: `deadline = min(that, availability_ends_at)` |
| Response | `StartAttemptResponse { attemptId, attemptNo, status, startedAt, deadlineAt, serverNow, publicationId, paperUrl: '/v1/attempts/{id}/paper', syncToken, resumed: boolean }` |
| Errors | `403 NOT_ENTITLED`, `403 ACCESS_RESTRICTED`, `422 NOT_YET_OPEN`, `422 WINDOW_CLOSED`, `409 ATTEMPT_LIMIT_REACHED`, `422 REATTEMPT_NOT_YET_ALLOWED`, `403 TRIAL_EXHAUSTED`, `422 INSTRUCTIONS_NOT_ACCEPTED`, `404` |

### 16.2 Paper

`GET /v1/attempts/:attemptId/paper` (owner only; `in_progress` or, after release, `evaluated`)

Response `AttemptPaper`:

```ts
{
  attemptId, publicationId, title, timerMode, sectionSwitching,
  policies: { keepMarkOnSave, calculatorEnabled },
  sections: [{
    id, title, position, subjectId, instructions,
    marking: { correct: "4", incorrect: "-1", unattempted: "0", msqScheme?: "jee_advanced_partial" },
    maxAttemptLimit: 5 | null, navigationPolicy: "free",
    slot: { startOffsetSeconds, endOffsetSeconds } | null,
    items: [   // ordered (per-attempt shuffle applied)
      { kind: "question", testQuestionId, number: 1, type: "single_correct",
        stemHtml, images: [{ url, alt, width, height }],
        options: [{ id, html, imageUrl? }],          // per-attempt option order applied; NO isCorrect
        blanks?: [{ blankId }],                       // fill_blank
        numericalFormat?: { allowNegative: true, maxDecimals: 2 },
        marking?: { correct, incorrect }              // only when overridden
      },
      { kind: "passage", passageId, html, images, children: [ /* question items */ ] }
    ]
  }]
}
```

Headers: `Cache-Control: private, max-age=0, no-store` (the paper is per-attempt because of shuffling) and an `ETag` based on publication + order hash.

A contract test asserts that the serialised paper contains none of `answerKey`, `isCorrect`, `correctOptionId`, `solution`, `accepted`.

### 16.3 State (resume)

`GET /v1/attempts/:attemptId/state`

Response `AttemptState { attemptId, status, deadlineAt, serverNow, lastSeq, answers: [{ testQuestionId, paletteState, response, timeSpentSeconds, visitCount, seq /* = attempt_answers.client_seq */ }], currentPosition?: { sectionId, testQuestionId }, integrity: {...} }`

## 17. Answer saving

### 17.1 Sync (the only exam write path)

`POST /v1/attempts/:attemptId/sync`

| Aspect | Value |
|---|---|
| Auth | student session + owner of the attempt |
| Frequency | On every committing action (debounced 1.5 s), and a heartbeat every 10 s when idle. One request in flight at a time. |
| Request | `SyncRequest { batchId: uuid, fromSeq, toSeq, events: AttemptEvent[] (≤ 100), answers: AnswerUpsert[] (≤ 100), position?: { sectionId, testQuestionId }, clientNow }` |
| `AttemptEvent` | `{ clientEventId: uuid, seq: int, type, testQuestionId?, sectionId?, payload?, clientTs }` |
| `AnswerUpsert` | `{ testQuestionId, seq, paletteState, response: AnswerResponse | null, timeSpentSeconds, visitCount }` |
| Server rules | 1) Lock the attempt row. 2) If `status != in_progress` → `409 ATTEMPT_ALREADY_SUBMITTED` (with the status). 3) If `now > deadlineAt + grace` → `410 ATTEMPT_DEADLINE_PASSED` and trigger auto-submit. 4) Validate each answer against the paper (question exists, response shape matches the type, option ids belong to the question, the section attempt limit using `exam-core`, navigation policy). 5) Insert events `ON CONFLICT (attempt_id, client_event_id) DO NOTHING`. 6) Upsert answers **only if `seq > client_seq`** (stale writes ignored). 7) `last_seq = max(last_seq, toSeq)`, `last_sync_at = now()`. |
| Response | `SyncResponse { ackSeq, serverNow, deadlineAt, status, rejected: [{ seq, testQuestionId?, code }] }` |
| Partial rejection | Rule violations (e.g. `SECTION_ATTEMPT_LIMIT`) reject **that item only** and are listed in `rejected`. The rest of the batch is applied. |
| Errors | `401` (the client keeps the outbox and shows re-login), `404`, `409`, `410`, `429` |

### 17.2 Beacon (page hide/unload fallback)

`POST /v1/attempts/:attemptId/beacon` with `Content-Type: text/plain`. The body is a JSON string `{ syncToken, ...SyncRequest }`. Authentication: session cookie **and** `syncToken` (compared with the stored hash). Always returns `204` (beacons ignore responses). Same processing as sync.

## 18. Submission

`POST /v1/attempts/:attemptId/submit`

| Aspect | Value |
|---|---|
| Auth | owner |
| Headers | `Idempotency-Key` |
| Request | `SubmitRequest { finalSeq, clientSubmittedAt, confirm: true }` |
| Behaviour | Lock the attempt. If already `submitted|evaluating|evaluated` → 200 with the current status (**idempotent**, no duplicate result). If `last_seq < finalSeq` and the deadline has not passed → `409 SYNC_INCOMPLETE` with `details.lastSeq` (the client drains and retries). Else set `status = submitted`, `submitted_at = now()`, `submit_source = student`, and enqueue evaluation. |
| Response | `SubmitResponse { attemptId, status: 'submitted', submittedAt, resultRelease: { mode, availableAt? } }` |
| Errors | `409 SYNC_INCOMPLETE`, `404` |

`GET /v1/attempts/:attemptId/status` → `{ status, submittedAt, evaluatedAt?, resultAvailable: boolean, resultAvailableAt? }`. Poll every 2 s with backoff to 10 s, for at most 2 min, then show "Your result is being prepared".

## 19. Evaluation (admin operations)

Evaluation itself is internal (queue). Admin endpoints:

| Method | Path | Permission | Purpose |
|---|---|---|---|
| POST | `/v1/admin/test-questions/:id/mark-bonus` | `results:rescore` | `{ reason }` → full marks to all; queue rescore → 202 |
| POST | `/v1/admin/test-questions/:id/drop` | `results:rescore` | Removes the question from scoring and max marks |
| POST | `/v1/admin/tests/:id/rescore` | `results:rescore` | `{ reason, answerKeyChanges?: [{questionId, newVersionId}] }` → 202 `{ jobId }` |
| POST | `/v1/admin/attempts/:id/invalidate` | `results:rescore` | `{ reason }` (e.g. a technical failure). The attempt does not count toward limits if `restoreAttempt: true`. |
| POST | `/v1/admin/attempts/:id/force-submit` | `results:rescore` | Support tool |
| GET | `/v1/admin/tests/:id/attempts` | `results:view` | Live monitor: in-progress count, last-sync lag, submitted, evaluated, failed |

## 20. Results and analytics (student)

All are owner-only and respect the release rules. Before release: `403 RESULT_NOT_RELEASED` with `details.availableAt`.

| Method | Path | Response |
|---|---|---|
| GET | `/v1/attempts/:id/result` | `AttemptResult { score, maxScore, positive, negative, counts{correct, incorrect, partial, unattempted, notVisited}, accuracy, timeSpentSeconds, rank?, rankTotal?, percentile?, isProvisional, sections[], subjects[] }` |
| GET | `/v1/attempts/:id/analysis/chapters` | Chapter/topic breakdown with accuracy and marks |
| GET | `/v1/attempts/:id/analysis/difficulty` | Easy/Medium/Hard × outcome |
| GET | `/v1/attempts/:id/analysis/time` | Time per section/subject, time on correct/incorrect/unattempted, 15-minute buckets |
| GET | `/v1/attempts/:id/questions` | Per-question grid `{ number, testQuestionId, sectionId, outcome, marksAwarded, timeSpentSeconds, paletteState }` |
| GET | `/v1/attempts/:id/solutions` | Requires solution release. Cursor-paged by section. Each item: stem, options with `isCorrect`, the student's response, the answer key display, solution HTML/video, the marks breakdown |
| GET | `/v1/attempts/:id/compare` | Historical comparison with the student's previous attempts of the same kind/exam |
| GET | `/v1/tests/:testId/leaderboard` | `?cursor` → `{ entries: [{ rank, displayName, score, accuracy, timeSpentSeconds, isMe }], me?: {...}, total, computedAt }` (opt-outs shown as "Anonymous") |

## 21. Orders and payments

### 21.1 Create order

`POST /v1/orders`

| Aspect | Value |
|---|---|
| Auth | student (email verified, *[Rec]*) |
| Headers | `Idempotency-Key` |
| Request | `CreateOrderRequest { items: [{ itemType: 'batch'|'course', itemId }] (1–5), couponCode?: string }` |
| Behaviour | Load the items; reject unpublished/unsellable/free items; reject items the student already actively holds (`409 ALREADY_ENTITLED`). Price from the **DB only**. Validate and compute the coupon. If total = 0 (100 % coupon): fulfil immediately with no Cashfree call. Else create a Cashfree order (`order_id = our order id`, amount in rupees with 2 decimals, `customer_details` with id/email/phone, `order_meta.return_url = https://app.puzzlers.in/checkout/return?orderId={order_id}`, `notify_url = https://api.puzzlers.in/v1/webhooks/cashfree`). Store `cashfree_order_id` and `payment_session_id`. |
| Response | `CreateOrderResponse { orderId, orderNumber, status, totalPaise, discountPaise, paymentSessionId?, cashfreeMode: 'sandbox'|'production', expiresAt }` |
| Errors | `422 ITEM_NOT_PURCHASABLE`, `409 ALREADY_ENTITLED`, `422 COUPON_INVALID` (details.reason), `502 PAYMENT_PROVIDER_ERROR` |

### 21.2 Read order

`GET /v1/orders/:orderId` (owner) → `OrderDetail { status, items, totals, payments[], entitlements[] }`. When status is `created|pending` and the order is older than 30 s, the server **actively re-checks Cashfree** (rate limited) before responding. This is the path behind the post-checkout return page.

### 21.3 Validate a coupon (pre-check)

`POST /v1/coupons/validate` `{ code, items }` → `{ valid, discountPaise, totalPaise, reason? }`. Informational only; the order creation re-validates.

### 21.4 Cancel

`POST /v1/orders/:orderId/cancel` (owner; only `created|pending`) → `cancelled`.

### 21.5 Admin

| Method | Path | Permission |
|---|---|---|
| GET | `/v1/admin/orders` (filters `status`, `userId`, `itemType`, `itemId`, `couponId`, date range, `q` order number/email) | `order:view` |
| GET | `/v1/admin/orders/:id` (incl. payments, webhook events, refunds, audit) | `order:view` |
| POST | `/v1/admin/orders/:id/reconcile` (force re-check with Cashfree) | `order:manage` |
| POST | `/v1/admin/refunds` `{ orderId, amountPaise, reason, entitlementAction }` + Idempotency-Key | `payment:refund` |
| GET | `/v1/admin/refunds` | `order:view` |
| GET | `/v1/admin/payments` | `order:view` |

### 21.6 Webhook

`POST /v1/webhooks/cashfree`

1. Read the **raw body** (do not JSON-parse before verifying).
2. Verify the signature: Cashfree sends `x-webhook-signature` and `x-webhook-timestamp`; expected = `base64(HMAC_SHA256(timestamp + rawBody, CASHFREE_SECRET_KEY))`, compared in constant time. *(Verify the exact scheme against the Cashfree API version pinned in `CASHFREE_API_VERSION` during Phase 7.)*
3. Reject a timestamp older than 5 minutes (replay protection).
4. Insert into `payment_webhook_events` with `provider_event_key` unique. On conflict → 200 (already processed).
5. **Do not trust the payload's status alone.** Fetch the order/payments from the Cashfree API server-side, and fulfil only if Cashfree reports it paid and the amount and currency match.
6. Fulfil in one transaction (§13 of [08](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md#13-transaction-boundaries)). Respond 200 quickly. On an internal error respond 500, so that Cashfree retries.

Refund webhooks update `refunds.status`. Entitlements are revoked only when the refund succeeds and `entitlement_action = revoke`.

## 22. Coupons (admin)

| Method | Path | Permission |
|---|---|---|
| GET | `/v1/admin/coupons` (filters `status`, `q`) | `coupon:view` |
| POST | `/v1/admin/coupons` `CouponInput` | `coupon:manage` |
| GET/PATCH | `/v1/admin/coupons/:id` | view/manage. `code` and `discountType` are immutable after the first redemption. |
| POST | `/v1/admin/coupons/:id/pause` · `/resume` | `coupon:manage` |
| GET | `/v1/admin/coupons/:id/redemptions` | `coupon:view` |

## 23. Notifications

| Method | Path | Permission | Notes |
|---|---|---|---|
| GET | `/v1/admin/notifications` | `notification:view` | |
| POST | `/v1/admin/notifications` | `notification:send` | `NotificationInput { kind, title, body, linkPath?, audienceType, audienceId?, channels, scheduledAt? }` → draft or scheduled |
| POST | `/v1/admin/notifications/:id/send` | `notification:send` | → 202 (fan-out job) |
| POST | `/v1/admin/notifications/:id/cancel` | `notification:send` | Only if not yet sent |
| GET | `/v1/admin/notifications/:id/stats` | `notification:view` | Delivered count, read count |

System notifications (result published, payment confirmed, test scheduled/reminder) are created by services, not by the API caller. Student endpoints are in §4.

## 24. Uploads and files

| Method | Path | Permission | Purpose |
|---|---|---|---|
| POST | `/v1/admin/uploads` | any staff with a content permission | Presign (§1.8) |
| POST | `/v1/admin/uploads/:id/confirm` | uploader | Verify + confirm |
| GET | `/v1/admin/files/:uploadId/url` | content view | Admin preview URL |
| POST | `/v1/me/avatar` | student | Presign for the avatar (public bucket, 1 MB, image only) |

## 25. Reports and admin analytics

| Method | Path | Permission | Response |
|---|---|---|---|
| GET | `/v1/admin/dashboard` | `dashboard:view` | `AdminDashboard { students: {total, active30d, new7d}, enrollments7d, purchases7d, revenue: {today, d7, d30} (paise; only with `revenue:view`), attempts: {today, inProgressNow}, recentPayments[], alerts[], topTests[], weakTests[] }` |
| GET | `/v1/admin/analytics/revenue` | `revenue:view` | `?from&to&groupBy=day|week|month&itemType` |
| GET | `/v1/admin/analytics/enrollments` | `analytics:view` | |
| GET | `/v1/admin/analytics/tests/:testId` | `results:view` | Score distribution, averages, per-question difficulty index, completion rate |
| GET | `/v1/admin/analytics/courses/:courseId` | `analytics:view` | Progress funnel |
| POST | `/v1/admin/reports` | `report:export` | `{ type: 'students'|'orders'|'enrollments'|'test_results'|'question_bank', params }` → 202 `{ reportJobId }` |
| GET | `/v1/admin/reports/:id` | `report:export` | Status + `downloadUrl` (presigned, 10 min) when done |

## 26. Audit logs

| Method | Path | Permission |
|---|---|---|
| GET | `/v1/admin/audit-logs` (filters `actorUserId`, `entityType`, `entityId`, `action`, date range; offset paging; sort `createdAt:desc` only) | `audit:view` |
| GET | `/v1/admin/audit-logs/:id` | `audit:view` |

Audit logs are read-only through the API. There is no update or delete endpoint.

## 27. Practice, bookmarks, mistakes

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/v1/practice/sessions` | student + course entitlement covering the chapters (or free practice per policy) | `{ courseId?, chapterIds[], topicIds[], difficulty[], types[], source?, count (5–50), mode }` → `PracticeSession` with question list (key-free) |
| GET | `/v1/practice/sessions/:id` | owner | Session + answers so far |
| POST | `/v1/practice/sessions/:id/answers` | owner | `{ questionId, response, timeSpentSeconds }` → in `instant_feedback` mode, the result **and** the solution for that question |
| POST | `/v1/practice/sessions/:id/complete` | owner | → summary (+ all solutions in `end_feedback` mode) |
| GET | `/v1/me/practice/sessions` | student | History |
| GET/POST | `/v1/me/notebooks` · PATCH/DELETE `/v1/me/notebooks/:id` | student | |
| GET | `/v1/me/bookmarks` | student | `?targetType&notebookId&chapterId` cursor |
| POST | `/v1/me/bookmarks` | student | `{ targetType, targetId, notebookId?, note? }` (target must be accessible) |
| PATCH/DELETE | `/v1/me/bookmarks/:id` | student | |
| GET | `/v1/me/mistakes` | student | `?groupBy=chapter|test&chapterId&testId&status=open|mastered` cursor → items with question summary, the last wrong response, source (attempt/practice) |
| PUT | `/v1/me/mistakes/:questionId` | student | `{ status: 'open'|'mastered' }` |

## 28. Settings and platform

| Method | Path | Permission |
|---|---|---|
| GET | `/v1/admin/settings` | `settings:view` |
| PUT | `/v1/admin/settings/:key` | `settings:manage` (super admin for `maintenance_mode`, `trial.*`) |
| GET | `/v1/health` | public; `{ status, db: 'ok', version }` (DB check rate-limited) |

## 29. Error code catalogue

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Zod validation failed |
| `UNAUTHENTICATED` | 401 | No session |
| `SESSION_EXPIRED` | 401 | Session expired/revoked |
| `FORBIDDEN` | 403 | Missing permission |
| `FORBIDDEN_SCOPE` | 403 | Faculty outside assigned scope |
| `ACCOUNT_SUSPENDED` | 403 | Suspended account |
| `NOT_ENTITLED` | 403 | No access; `details.purchaseOptions` |
| `ACCESS_RESTRICTED` | 403 | Admin restriction |
| `CONTENT_NOT_YET_AVAILABLE` | 403 | Drip lock |
| `TRIAL_EXHAUSTED` | 403 | Trial used up |
| `RESULT_NOT_RELEASED` | 403 | Result hidden until release |
| `SOLUTIONS_NOT_RELEASED` | 403 | Solutions hidden |
| `NOT_FOUND` | 404 | |
| `ALREADY_ENROLLED` / `ALREADY_ENTITLED` | 409 | |
| `ATTEMPT_LIMIT_REACHED` | 409 | |
| `ATTEMPT_ALREADY_SUBMITTED` | 409 | |
| `SYNC_INCOMPLETE` | 409 | Submit before the outbox drained |
| `IDEMPOTENCY_KEY_REUSED` | 409 | |
| `VERSION_CONFLICT` | 409 | Optimistic concurrency |
| `ATTEMPT_DEADLINE_PASSED` | 410 | Write after deadline + grace |
| `NOT_YET_OPEN` / `WINDOW_CLOSED` | 422 | Test schedule |
| `REATTEMPT_NOT_YET_ALLOWED` | 422 | `details.nextAllowedAt` |
| `INSTRUCTIONS_NOT_ACCEPTED` | 422 | |
| `SECTION_ATTEMPT_LIMIT` | 422 | Per-item sync rejection |
| `NAVIGATION_NOT_ALLOWED` | 422 | Per-item sync rejection |
| `INVALID_RESPONSE` | 422 | Response shape/option mismatch |
| `TEST_INVALID` | 422 | Publish validation |
| `BATCH_NOT_FREE` / `COURSE_NOT_FREE` | 422 | |
| `ENROLLMENT_CLOSED` / `BATCH_FULL` | 422 | |
| `ITEM_NOT_PURCHASABLE` | 422 | |
| `COUPON_INVALID` | 422 | `details.reason ∈ {not_found, expired, paused, min_order, not_applicable, usage_limit, per_user_limit, first_purchase_only}` |
| `REFUND_EXCEEDS_PAID` | 422 | |
| `RATE_LIMITED` | 429 | |
| `PAYMENT_PROVIDER_ERROR` | 502 | Cashfree error |
| `MAINTENANCE_MODE` | 503 | |
| `INTERNAL_ERROR` | 500 | |

## 30. Endpoint consumers

| Group | Marketing | Student | Admin |
|---|---|---|---|
| §2 Auth | entry links only | ✔ | ✔ |
| §3 Public | ✔ | ✔ (logged-out catalogue, purchase pages) | preview |
| §4 Me | header login state (`/v1/me`) | ✔ | |
| §5–§14, §19, §22–§26, §28 admin | | | ✔ |
| §9–§11 student routes, §15–§18, §20, §21.1–21.4, §27 | | ✔ | |
