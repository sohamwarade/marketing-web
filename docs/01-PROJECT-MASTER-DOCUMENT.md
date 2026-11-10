# 01 — Project Master Document

| Field | Value |
|---|---|
| Project | **Puzzlers** — MHT-CET + JEE Learning Management and Online Examination Platform |
| Document set version | 1.3 (final three-developer division, backend stack, domains confirmed) |
| Date | 2026-11-06 |
| Status | Ready for owner review. Items marked **DECISION REQUIRED** are not final. |
| Primary sources | `Platform PRD.docx` (v1.0, 02 Nov 2026), `project_tech_stack_medium.docx`, Quizrr research reports 01–13 + investigation log |

This is the single top-level description of what Puzzlers is, how it is built and how the work is split. Every other document refines one part of it. If a lower document contradicts this one, this one wins until the conflict is recorded in [17-OPEN-DECISIONS-AND-ASSUMPTIONS.md](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md) and resolved by the project owner.

---

## 1. What Puzzlers is

Puzzlers is a course-based competitive-exam preparation platform for **MHT-CET, JEE Main and JEE Advanced**. It combines:

1. **Learning (LMS)** — batches, courses, chapters, topics, video lessons, PDFs, notes, progress tracking.
2. **Practice** — topic/chapter question practice with solutions, bookmarks and mistake review.
3. **Examination (CBT)** — chapter tests, part-syllabus tests, full mocks, PYQs and scheduled tests in an NTA-style computer-based test interface with a server-authoritative timer, autosave, recovery and server-side evaluation.
4. **Analytics** — per-attempt result analysis, subject/chapter/difficulty/time analysis, weak areas, historical comparison, leaderboards.
5. **Operations** — a separate admin platform that lets the business team run content, tests, batches, pricing, students, faculty, payments and access without developers.
6. **Acquisition** — a public, SEO-friendly marketing website.

Examinations are **configured data, not code**. Adding a new examination (for example BITSAT later) must need admin configuration only, not a code change, as long as it uses supported question types and marking schemes.

## 2. Applications

| # | Application | Hostname (confirmed) | Owner | Purpose |
|---|---|---|---|---|
| 1 | Marketing website | `puzzlers.in` (apex; `www.puzzlers.in` 301-redirects to it) | Developer 3 | Public site, catalogue, SEO, conversion to registration |
| 2 | Student platform | `app.puzzlers.in` | Developer 1 | Learning, practice, **exam engine**, results, purchases, profile |
| 3 | Admin & faculty platform | `admin.puzzlers.in` | Developer 2 | All operational management |
| 4 | Backend API (Hono on Cloudflare Workers, `apps/api`) | `api.puzzlers.in` (derived; see below) | Shared, by module: **Dev 2** backend foundation + administrative modules (and contract coordination); **Dev 1** examination-related modules. Dev 3 consumes public APIs only. See [15](15-TEAM-COORDINATION-AND-INTEGRATION.md) | All business logic, auth, payments, exam authority |

**Domains are confirmed (D-01 decided):** marketing `puzzlers.in`, student `app.puzzlers.in`, admin `admin.puzzlers.in`. The API host `api.puzzlers.in` (and `assets.puzzlers.in` for public files) follows from this decision: the API must live under the same registrable domain, `puzzlers.in`, for the cross-subdomain session design in [10](10-AUTHENTICATION-AND-AUTHORIZATION.md) to work. The earlier spelling conflict (`puzlers` vs `puzzlers`, C-03) is resolved in favour of `puzzlers`.

## 3. Fixed technology stack (non-negotiable)

| Layer | Technology |
|---|---|
| Frontend (all three apps) | Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Backend framework | **Hono + TypeScript**: one shared API application in `apps/api` |
| Backend runtime and hosting | **Cloudflare Workers** (Hono runs as a Worker; there is no Node.js server, VPS or container) |
| Not chosen | Node.js + Express, NestJS, a traditional Node.js server on a VPS, Next.js API routes as the main backend, multiple independent backend services |
| Frontend hosting | Cloudflare Workers (each Next.js app deployed as its own Worker) |
| Storage | Cloudflare R2 |
| DB connectivity | Cloudflare Hyperdrive |
| Background jobs | Cloudflare Queues (plus Workers Cron Triggers, a built-in Workers feature, for sweeps) |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | Better Auth |
| Payments | **Cashfree** (confirmed; C-01 resolved) |
| Validation | Zod (shared schemas) |
| Monitoring | Sentry |
| Email | Cloudflare Email Routing for **incoming** mail and forwarding. Transactional sending (verification, password reset, OTP) is **not** covered by Email Routing; Cloudflare Email Sending is being investigated separately (D-06) |
| Video | YouTube for permitted free/public video; a paid video host for restricted content (provider **D-03**) |
| Tooling | GitHub, Antigravity / Cursor (see **C-02**), Claude Code, Stitch, Postman |

Full rules: [04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md](04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md).

## 4. Architecture in one paragraph

A **modular monolith**. Hono is the backend framework and Cloudflare Workers is its runtime and host. One Hono API Worker (with `fetch`, `queue` and `scheduled` handlers) owns all business logic and talks to one Neon PostgreSQL database through Hyperdrive using Drizzle. Three independent Next.js Workers (marketing, student, admin) render UI and call the API over HTTPS using a shared typed API client and shared Zod schemas. Better Auth runs inside the API and issues a session cookie scoped to the parent domain. Files live in R2 and are served through short-lived, entitlement-checked URLs. Non-critical work (evaluation, analytics, notifications, reports, auto-submit) runs on Cloudflare Queues. See [05-SYSTEM-ARCHITECTURE.md](05-SYSTEM-ARCHITECTURE.md).

## 5. Locked product decisions (from PRD §33)

| Decision | Value |
|---|---|
| Product type | Course-based LMS + online examination/test platform |
| Exam scope | Multi-exam: MHT-CET, JEE Main, JEE Advanced |
| Access model | **both_override**: batch purchase + individual course purchase + admin override (grant/restrict) |
| Admin platform | Separate operational portal |
| Student platform | Separate learning/test experience |
| Initial concurrency target | ~2,000 simultaneous test takers (must be load-tested) |
| Future target | Up to 10,000 after validation. **Not claimed until tested.** |
| Infrastructure | Modular monolith first |

## 6. Puzzlers design decisions taken in this document set

These are recommendations this documentation makes to fill gaps. Each is explained in the referenced document, and the owner can reverse any of them.

| ID | Decision | Where |
|---|---|---|
| PD-01 | The exam engine runs **inside the student app** at `app.puzzlers.in/exam/...` (same origin), not on a separate host. No tokens in URLs. | [11](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md) |
| PD-02 | One write path during an exam: `POST /v1/attempts/:id/sync` carries answer snapshots, events and the heartbeat in one idempotent batch. | [11](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md) |
| PD-03 | The deadline is stored on the server (`deadline_at`). The browser only displays it. Expired attempts are auto-submitted by a delayed queue message **and** a per-minute cron sweep. | [11](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md) |
| PD-04 | A published test becomes an immutable **test publication** with pinned question versions and a key-free paper snapshot in R2. | [08](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md) |
| PD-05 | "Enrollment" and "entitlement" are one entity (`entitlements`). There is no duplicate enrollment table. | [08](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md) |
| PD-06 | A "test series" is a batch with `kind = 'test_series'`. There is no separate test-series entity. | [08](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md) |
| PD-07 | A passage is a non-scored question of type `passage`. Linked questions reference it, so it reuses question versioning. | [08](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md) |
| PD-08 | A shared pure-TypeScript package `@puzzlers/exam-core` holds the palette state machine and scoring rules, used by both the API and the student app. Scoring authority stays on the server. | [06](06-MONOREPO-AND-FOLDER-STRUCTURE.md) |
| PD-09 | "Save & Next on a marked question" and "count answered-and-marked for evaluation" are explicit per-test policy flags. | [11](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md) |
| PD-10 | No timer pause/suspend for timed tests in the MVP. | [17](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md) D-10 |
| PD-11 | Random question selection is resolved **once at publish time**, so every student gets the same paper (fair ranks). Per-attempt shuffling only reorders it. | [11](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md) |

## 7. Team

| Developer | Workstream | Package |
|---|---|---|
| Developer 1 | **Complete student test application** (`app.puzzlers.in`): its frontend + all examination-related backend modules (attempts, answer saving, autosave, recovery, submission, evaluation, results, test analytics) | [developer-1-student-platform/](developer-1-student-platform/00-READ-ME-FIRST.md) |
| Developer 2 | **Complete admin application** (`admin.puzzlers.in`) + the shared Hono backend **foundation** + administrative modules (auth, RBAC, DB foundation/migrations, courses, batches, question bank, test builder, entitlements, Cashfree, email, admin ops); coordinates API contracts and integration | [developer-2-admin-platform/](developer-2-admin-platform/00-READ-ME-FIRST.md) |
| Developer 3 | **Complete public marketing website** (`puzzlers.in`): pages, SEO, branding, responsive design, public catalogue integration. **No backend ownership.** | [developer-3-marketing-website/](developer-3-marketing-website/00-READ-ME-FIRST.md) |
| **Backend** (`apps/api`, `packages/database`) | One Hono API, one Neon database | Shared by module (final, D-02): **Dev 2** foundation + administrative modules + contract/migration coordination; **Dev 1** examination modules. Dev 3 has no backend ownership. See [15](15-TEAM-COORDINATION-AND-INTEGRATION.md). |

## 8. Glossary

| Term | Meaning |
|---|---|
| Examination | A target exam: MHT-CET, JEE Main, JEE Advanced. |
| Exam profile | A configurable rule set for an examination (subjects, sections, duration, marking, question types, instructions). An examination can have several, for example one per year. |
| Batch | A sellable bundle (free or paid) of courses and/or tests with validity dates. `kind = regular` or `test_series`. |
| Course | Reusable learning content (chapters → topics → lessons). Can belong to many batches or be bought alone. |
| Lesson | Smallest learning unit: video, PDF, note, test link, practice set or resource bundle. |
| Test | An authored exam (sections + questions + rules). It becomes attemptable once **published**. |
| Test publication | Immutable snapshot of a test at publish time (pinned question versions + key-free paper). |
| Attempt | One student's sitting of one test publication. |
| Entitlement | A record that grants a student access to a batch, course or test (purchase, free enrollment, admin grant). |
| Access override | An admin grant or restriction on a specific resource for a specific student. |
| Trial | Account-level allowance to attempt N designated trial-eligible tests for free. |
| Palette state | One of five per-question states: not visited, not answered, answered, marked for review, answered and marked. |
| `puzzlers.in` | Confirmed production root domain. |

## 9. Document map

Start with [00-START-HERE.md](00-START-HERE.md).
