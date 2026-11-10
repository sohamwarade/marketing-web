# 15 — Team Coordination and Integration

## 1. Team division and backend ownership (FINAL, D-02 decided)

The original three-developer division is **final**. Each developer owns one complete application. The backend is shared, and its ownership is split by module between Developer 2 (foundation + administrative) and Developer 1 (examination). Developer 3 does not own backend code.

### 1.1 Non-negotiable rules

1. There is exactly **one backend**: the Hono + TypeScript application in `apps/api`, running on Cloudflare Workers.
2. There is exactly **one database**: Neon PostgreSQL with Drizzle ORM. All schema and migrations live in `packages/database`.
3. No separate backend, no duplicate database, no independent business logic in any frontend.
4. Developer 1 and Developer 2 coordinate through the shared API contract (doc 09), the Zod schemas (`packages/schemas`) and the database migration rules (§5).
5. The backend is **not** owned exclusively by Developer 2. The examination modules belong to Developer 1.

### 1.2 Roles

| Developer | Application (owns completely) | Backend ownership in `apps/api` | Coordination |
|---|---|---|---|
| **Developer 1** | **Student test application**, `apps/student` at `app.puzzlers.in`: the entire student-facing app (dashboard, learning screens, practice, exam UI, results) | **Examination-related modules:** attempts, paper delivery, answer saving/autosave, recovery, timer authority, submission, auto-submit, evaluation, results and test analytics, practice, student test discovery | Owns `packages/exam-core` |
| **Developer 2** | **Admin application**, `apps/admin` at `admin.puzzlers.in` | **Backend foundation + administrative modules:** Hono app skeleton/middleware, authentication (Better Auth), RBAC, database foundation, courses, batches, question bank, test builder, entitlements, Cashfree payments, email integration, notifications, uploads, reports, audit, settings, public catalogue endpoints | **Contract & Schema Steward:** coordinates shared API contracts, migrations and integration |
| **Developer 3** | **Public marketing website**, `apps/marketing` at `puzzlers.in`: homepage, landing pages, courses/batches showcase, test series, SEO, branding, responsive design | **None.** Consumes the public catalogue APIs (built by Dev 2) | Leads `packages/design-tokens` and `packages/ui` |

Throughout this documentation, **"the steward" means Developer 2.**

### 1.3 Module ownership

| API module / endpoints | Owner | Reviewer |
|---|---|---|
| **Foundation:** `app.ts`, middleware (requestId, CORS, rate limits, db, session, guards, errors), OpenAPI, Sentry wiring, `wrangler.jsonc` | Dev 2 | Dev 1 |
| `auth` (Better Auth config in `packages/auth`), `/auth/*`, `/v1/me` + profile/onboarding | Dev 2 | Dev 1 |
| `iam` (roles, permissions, faculty scopes, staff) | Dev 2 | — |
| `packages/database` (schema foundation, migration pipeline), `packages/schemas`, `packages/api-client` | Dev 2 (steward) | Each consuming developer |
| `catalog` (examinations, exam profiles, taxonomy) | Dev 2 | — |
| `learning`: course/lesson admin writes **and** student course/lesson reads, progress, playback and file URLs | Dev 2 | Dev 1 (student-facing endpoints) |
| `batches` (CRUD, assignment, free enrollment endpoints) | Dev 2 | Dev 1 (enroll endpoints) |
| `question-bank` | Dev 2 | — |
| `tests` (builder, validation, publication, key-free paper snapshot) | Dev 2 | **Dev 1** (publication/paper format feeds the exam engine) |
| `access` (entitlements, overrides, trials, `canAccess`) | Dev 2 | Dev 1 |
| `commerce` (orders, Cashfree, webhooks, reconciliation, refunds), coupons | Dev 2 | Dev 1 (checkout endpoints) |
| `mailer` / email integration (Cloudflare Email Routing inbound; transactional sender per D-06), `notifications` (incl. the student inbox endpoints) | Dev 2 | — |
| `uploads`, `reports`, `audit`, `settings`, admin dashboard/analytics | Dev 2 | — |
| `public` (`/v1/public/*`, contact, sitemap data) | Dev 2 | Dev 3 (consumer review of response shapes) |
| `/v1/me/batches`, `/v1/me/courses`, `/v1/me/orders`, `/v1/me/notifications`, `/v1/me/trial` | Dev 2 | Dev 1 |
| CI/CD, Cloudflare and Neon environments (part of the backend foundation) | Dev 2 | Dev 1 |
| **`exam`**: start/resume, paper, state, sync, beacon, submit, status; auto-submit queue consumer + cron sweep | **Dev 1** | Dev 2 |
| **`evaluation`**: evaluation consumer, rescoring, rank/percentile jobs | **Dev 1** | Dev 2 |
| **`results`**: result/analysis endpoints, solutions (release rules), leaderboard, performance snapshots | **Dev 1** | Dev 2 |
| **`practice`**: practice sessions, bookmarks, notebooks, mistakes | **Dev 1** | Dev 2 |
| Student test discovery: `GET /v1/tests/:testId`, `/v1/me/tests`, `/v1/me/attempts`, `/v1/me/performance` | **Dev 1** | Dev 2 |
| `/v1/me/dashboard` aggregate: composes other modules' **service functions**, never their tables | **Dev 1** | Dev 2 |
| `packages/exam-core` | **Dev 1** | Dev 2 |
| Admin-side exam operations (`/v1/admin/tests/:id/attempts`, force-submit, invalidate, bonus/drop/rescore endpoints) | **Dev 1** (exam/evaluation modules) | Dev 2 (builds the admin screens) |

Interface rule between Dev 1 and Dev 2 modules: Dev 1's modules call `access.canAccess`, `tests.getPublication`, `learning` and `batches` **service functions** owned by Dev 2, and never query those modules' tables directly. Any new service function or table needed across the boundary goes through a contract or migration PR.

### 1.4 Remaining owner confirmations

- [ ] Backup steward (recommended: Developer 1)
- [ ] Exam-day on-call rota (recommended: Dev 1 primary for exam incidents, Dev 2 for platform/payments)
- [ ] GitHub handles in CODEOWNERS ([shared/07](shared/07-GIT-AND-BRANCHING-WORKFLOW.md))

### 1.5 Working rule before backend endpoints exist

All three frontends develop against **mock handlers** generated from `@puzzlers/schemas` (MSW *[Rec]*), so nobody is blocked by the backend. Developer 2 builds the Phase 1 API proof of concept (the backend foundation). Developer 1 runs the auth/session checks P-4 and P-10 from the student app.

## 2. Responsibility matrix (RACI)

R = responsible, A = accountable, C = consulted, I = informed. Developer 2 is also the steward.

| Area | Dev 1 | Dev 2 (steward) | Dev 3 | Owner |
|---|---|---|---|---|
| Student app (`apps/student`), all screens | R/A | C | I | I |
| Exam engine client | R/A | C | | I |
| Examination backend modules (`exam`, `evaluation`, `results`, `practice`) | R/A | C (review) | | I |
| `@puzzlers/exam-core` | R/A | C | | |
| Admin app (`apps/admin`) | I | R/A | I | I |
| Backend foundation (skeleton, middleware, CI/CD, environments) | C | R/A | I | I |
| Authentication + RBAC | C | R/A | I | I |
| Administrative modules (courses, batches, question bank, test builder, entitlements, notifications, reports, audit, settings) | C | R/A | | I |
| Cashfree payments | C | R/A | | C |
| Email integration | | R/A | | C |
| Public catalogue endpoints | | R/A | C (consumer) | |
| Marketing website (`apps/marketing`) | I | I | R/A | C (content) |
| `@puzzlers/ui`, `design-tokens` | C | C | R/A | C |
| `@puzzlers/schemas` (contract) | C | R/A | C | I |
| `@puzzlers/database` (schema, migrations) | C | R/A | I | I |
| `@puzzlers/auth`, `@puzzlers/api-client` | C | R/A | C | |
| Integration reviews / checkpoints | C | R/A | C | I |
| Exam profiles' real data (D-07) | | C | | R/A |
| Marketing content, testimonials | | | C | R/A |

## 3. Shared backend task list

| # | Task | Phase | Owner |
|---|---|---|---|
| B-01 | Hono app skeleton on Workers, middleware, error envelope, OpenAPI, Sentry | 1 | Dev 2 |
| B-02 | Drizzle package, Hyperdrive client, migration pipeline | 1–2 | Dev 2 |
| B-03 | Better Auth integration, cross-subdomain cookies (`.puzzlers.in`), `/v1/me` | 2 | Dev 2 (Dev 1 verifies P-4) |
| B-04 | RBAC: roles, permissions, guards, faculty scopes | 2 | Dev 2 |
| B-05 | Taxonomy + exam profiles CRUD | 3 | Dev 2 |
| B-06 | Courses, chapters, topics, lessons, materials (admin) | 3–4 | Dev 2 |
| B-07 | Student course/lesson reads, progress, video playback, file URLs | 4 | Dev 2 |
| B-08 | Batches CRUD + free enrollment endpoints | 3 | Dev 2 |
| B-09 | `access.canAccess`, entitlements, overrides, trials | 3 | Dev 2 |
| B-10 | Uploads (presign/confirm), R2 | 3 | Dev 2 |
| B-11 | Question bank + versions + review + import | 4 | Dev 2 |
| B-12 | Test builder + validation + publication + paper snapshot | 4 | Dev 2 (Dev 1 reviews the paper format) |
| B-13 | Attempts: start, paper, state, sync, beacon, submit | 5 | **Dev 1** |
| B-14 | Auto-submit (queue + cron) | 5 | **Dev 1** |
| B-15 | Evaluation consumer + exam-core scoring | 5 | **Dev 1** |
| B-16 | Results, analytics, ranks, leaderboard; admin rescore/bonus/drop endpoints | 6 | **Dev 1** |
| B-17 | Practice, bookmarks, notebooks, mistakes | 4–6 | **Dev 1** |
| B-18 | Public catalogue endpoints, contact, sitemap data | 3 | Dev 2 (Dev 3 consumes) |
| B-19 | Orders, Cashfree, webhooks, reconciliation, refunds | 7 | Dev 2 |
| B-20 | Coupons | 7 | Dev 2 |
| B-21 | Notifications (in-app fan-out, student inbox; email once D-06 picks a sender) | 7 | Dev 2 |
| B-22 | Admin dashboard + analytics + reports | 8 | Dev 2 |
| B-23 | Audit logs (writer used by both backend owners; reader by Dev 2) | 2 / 8 | Dev 2 |
| B-24 | Rate limiting, security headers, CSP | 2 / 9 | Dev 2 |
| B-25 | Load-test scripts and runs | 9 | Dev 1 (exam traffic) + Dev 2 (platform) |
| B-26 | `mailer` interface + console transport; Cloudflare Email Routing setup; transactional sender after D-06 | 2 / 7 | Dev 2 |
| B-27 | Student test discovery endpoints + `/v1/me/dashboard` aggregate | 5–6 | **Dev 1** |

## 4. API contract ownership rules

1. `09-API-CONTRACT-AND-ENDPOINTS.md` and `packages/schemas` change **together, in one PR**, labelled `contract`.
2. A contract PR must:
   - describe the consumer need (which page or flow);
   - include the Zod schema change, the doc change and the OpenAPI snapshot update;
   - be approved by the **steward (Developer 2)** and by every developer whose app consumes the changed endpoint.
3. Additive changes (a new optional field, a new endpoint) can merge with steward approval plus a 24-hour notice in the team channel. Breaking changes need all three developers and a migration plan (old field kept for one release).
4. Implementations may not return fields that are not in the schema (output parsing catches this in dev/staging).
5. Frontends may not depend on undocumented behaviour (e.g. ordering of list results that the contract does not specify).

## 5. Database migration ownership

1. Only the `packages/database` package defines tables. CODEOWNERS: the steward is a required reviewer.
2. One migration per PR. File names are generated by drizzle-kit and never renamed after merge.
3. Before merging, the author rebases on `main` and regenerates if another migration landed (avoid two migrations with the same sequence number).
4. Expand/contract only. No destructive change in the same release as the code change that stops using a column.
5. Data backfills run as idempotent scripts in `scripts/backfills/` with a dry-run mode, reviewed like migrations.
6. Production migrations run only from CI with approval.

## 6. Code review rules

| Change type | Reviewers required |
|---|---|
| Any PR | 1 other developer |
| `packages/schemas`, `database`, `auth`, `api-client` | Dev 2 (steward) + 1 consumer; Dev 1 when Dev 2 is the author |
| `packages/exam-core` | Dev 1 + Dev 2 |
| Exam engine (client or server), evaluation | Dev 1 + Dev 2 |
| Payments / entitlements / RBAC | Dev 2 + Dev 1 |
| `@puzzlers/ui`, `design-tokens` | Owner of the package + 1 consumer app developer |
| AI-generated PRs | Same rules. The PR description states which parts were AI-generated and what was manually verified. |

Review checklist: contract conformance; no business logic in the frontend; no secrets; tests added; audit logs for sensitive actions; accessibility of UI changes; migration safety.

## 7. Integration process

- **Trunk-based** with short-lived feature branches ([shared/07](shared/07-GIT-AND-BRANCHING-WORKFLOW.md)).
- **Weekly integration checkpoint** (30–45 min): demo on staging, contract changes for next week, blockers, and updates to [shared/08-INTEGRATION-CHECKLIST.md](shared/08-INTEGRATION-CHECKLIST.md).
- **Phase gates** ([16](16-IMPLEMENTATION-ROADMAP.md)): a phase is complete only when its integration checkpoint passes on staging.
- **Mock-first:** each new endpoint gets its schema and a mock handler first (day 1). The frontend integrates against the mock, then switches to the real endpoint.
- **Shared staging data:** seeded demo data is reset only by the steward, with notice.

## 8. Conflict resolution

1. Technical disagreement → the author writes a short ADR (`docs/adr/NNNN-title.md`: context, options, decision, consequences) in the PR.
2. The steward decides within 2 working days for contract/schema/security matters.
3. Product or scope disagreement → the project owner decides, and the result is recorded in [17](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md).
4. Anything that would change the fixed stack → owner only, recorded as a decision. AI agents must stop and escalate rather than work around it.
5. Ownership disputes (two developers editing the same module) → the module owner in §1.3 wins. The other developer opens a PR against that owner's module for review.

## 9. Communication

| Channel | Use |
|---|---|
| GitHub issues (labels per app/module/phase) | All work items |
| GitHub PRs | Code + contract + migration discussion |
| Team chat `#puzzlers-dev` | Daily coordination; 24-hour notices for contract changes |
| `#puzzlers-incidents` | Production issues |
| `docs/adr/` | Decisions |
| `17-OPEN-DECISIONS-AND-ASSUMPTIONS.md` | Owner decisions |
