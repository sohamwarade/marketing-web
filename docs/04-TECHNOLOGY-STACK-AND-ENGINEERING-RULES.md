# 04 — Technology Stack and Engineering Rules

## 1. Fixed stack (authoritative)

Source: `project_tech_stack_medium.docx` and PRD §26. **Nobody, human or AI agent, may substitute a component without a written owner decision recorded in [17](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md).**

| Layer | Fixed choice | Notes |
|---|---|---|
| Frontend framework | **Next.js** (App Router) | All three apps: marketing, student, admin |
| Language | **TypeScript** (strict) | Everywhere |
| Styling | **Tailwind CSS** | Tokens from `@puzzlers/design-tokens` |
| Components | **shadcn/ui** | Generated into `@puzzlers/ui`, not per app |
| Backend framework | **Hono** (TypeScript) | **Confirmed.** One shared API application in `apps/api`. Next.js route handlers are allowed only for UI concerns (see §3.4). |
| Backend runtime and hosting | **Cloudflare Workers** | **Confirmed.** Hono runs as a Worker (`fetch` + `queue` + `scheduled` handlers). No Node.js server, VPS or container. |
| Frontend hosting | **Cloudflare Workers** | Next.js via the OpenNext Cloudflare adapter (**PoC required**, §5) |
| Files | **Cloudflare R2** | PDFs, images, notes, paper snapshots, report exports |
| DB pooling | **Cloudflare Hyperdrive** | Worker → Neon |
| Background | **Cloudflare Queues** | Plus Cron Triggers (a Workers feature) for sweeps |
| DNS / security | **Cloudflare** | DNS, WAF, rate-limiting rules, Turnstile (*[Rec]*, a Cloudflare security service) |
| Database | **Neon PostgreSQL** | |
| ORM | **Drizzle ORM** + drizzle-kit migrations | |
| Auth | **Better Auth** | Runs inside the Hono API |
| Payments | **Cashfree** | **Confirmed** (C-01 resolved; the stack doc's Razorpay mention is obsolete) |
| Validation | **Zod** | Shared schemas in `@puzzlers/schemas` |
| Monitoring | **Sentry** | API + three apps |
| Inbound email | **Cloudflare Email Routing** | Receiving and forwarding mail for `@puzzlers.in` addresses only. It does **not** send transactional email. |
| Transactional email | **Open (D-06)** | Cloudflare Email Sending under investigation; do not assume Email Routing can send OTPs or password resets |
| Video | YouTube (free/public) + paid host (restricted) | Provider is D-03 |
| Tools | GitHub, Antigravity / Cursor, Claude Code, Stitch, Postman | C-02 |

## 2. Approved supporting libraries *[Rec]*

These are libraries used *within* the fixed stack, not alternative frameworks. Adding a library not on this list needs a short PR note and the approval of the contract steward (Developer 2) ([15](15-TEAM-COORDINATION-AND-INTEGRATION.md)).

| Purpose | Library | Used in |
|---|---|---|
| Next.js on Workers | `@opennextjs/cloudflare` | marketing, student, admin |
| Worker tooling | `wrangler` | all deployables |
| Postgres driver | `postgres` (postgres.js) via Hyperdrive connection string | api, database |
| Migrations | `drizzle-kit` | database |
| OpenAPI from Zod | `@hono/zod-openapi` (+ `@hono/zod-validator` where OpenAPI is not needed) | api |
| Sentry | `@sentry/cloudflare` (API), `@sentry/nextjs` (apps; compatibility verified in PoC) | all |
| IDs | `uuidv7` | api, exam-core |
| Server state (client) | `@tanstack/react-query` | student, admin |
| Exam client state | `zustand` | student (exam module) |
| IndexedDB | `idb` | student (exam outbox) |
| Forms | `react-hook-form` + `@hookform/resolvers/zod` | student, admin |
| Tables | `@tanstack/react-table` (shadcn data-table pattern) | admin |
| Charts | `recharts` (shadcn charts) | student, admin |
| Math rendering | `katex` | student, admin, marketing |
| Rich text / question editor | `@tiptap/react` with a math extension | admin |
| HTML sanitising | `sanitize-html` (server, on write) | api |
| Dates | `date-fns` + `date-fns-tz` (IST display) | all |
| Unit tests | `vitest` | all |
| E2E tests | `@playwright/test` | student, admin, marketing |
| Load tests | `k6` (tool, not shipped) | scripts |
| Lint/format | ESLint (typescript-eslint) + Prettier | all |

## 3. Engineering rules

### 3.1 Architecture

1. **Modular monolith.** One API Worker, one database. Modules live in `apps/api/src/modules/<module>`. No microservices, no Kubernetes, no second backend.
   - All backend code lives in `apps/api`. All schema and migrations live in `packages/database`.
   - No developer may create an independent backend, a separate API service or a duplicate database (including a per-app Neon database or local SQLite substitutes in shared environments).
   - Not chosen, and never to be introduced: Node.js + Express, NestJS, Fastify, a traditional Node.js server on a VPS, Next.js API routes as the main backend.
2. **All business logic lives in the API.** Frontends render and call the API. Access, pricing, scoring, deadlines, eligibility and payment state are never decided in a browser.
3. **No duplicate business logic.** Shared rules live in packages (`exam-core`, `schemas`). Apps import them; they never copy them.
4. **One API contract.** Endpoints, request and response shapes are defined in `@puzzlers/schemas` and documented in [09](09-API-CONTRACT-AND-ENDPOINTS.md) **before** implementation.
5. **One schema.** Tables are defined once in `@puzzlers/database`. No app defines tables.

### 3.2 TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: false` (Drizzle compatibility).
- No `any` without an `// eslint-disable-next-line` and a reason.
- API inputs and outputs are typed with `z.infer<>` from shared schemas, never re-declared by hand.

### 3.3 Backend (Hono)

- Route modules: `apps/api/src/modules/<module>/{routes.ts, service.ts, repo.ts, policies.ts}`.
  - `routes.ts`: HTTP only (validation, auth middleware, calling the service, mapping the response).
  - `service.ts`: business logic and transactions.
  - `repo.ts`: Drizzle queries.
  - `policies.ts`: permission and entitlement checks.
- Every handler validates input with Zod and returns the standard envelope ([09 §1](09-API-CONTRACT-AND-ENDPOINTS.md#1-conventions)).
- Every mutation that changes money, access, content state, roles or exam state writes an audit log row in the same transaction.
- Database access only through the per-request Drizzle client from middleware (`c.get('db')`).
- No global mutable state in Workers (isolates are reused across requests).

### 3.4 Frontend (Next.js)

- App Router. Server Components for data-bound pages where SEO or first paint matters (marketing, catalogue). Client Components for interactive surfaces (exam, admin forms).
- Next.js **route handlers / server actions must not implement business logic**. They are allowed only for UI concerns: OG image generation, `sitemap.xml`, `robots.txt`, revalidation webhooks, or proxying the session cookie for SSR fetches.
- Data fetching goes through `@puzzlers/api-client`. No raw `fetch` to the API in components.
- UI components come from `@puzzlers/ui`. App-local components are allowed only when they are app-specific.

### 3.5 Database

- Every change is a drizzle-kit migration committed with the code. No `drizzle-kit push` against shared environments.
- Naming conventions are in [shared/02](shared/02-SHARED-DATABASE-RULES.md).
- Money is integer paise. Times are `timestamptz` in UTC. IDs are UUIDv7 (domain tables) or text (Better Auth tables).

### 3.6 Security

- Secrets only in Worker secrets / CI secrets. Never in the repo, never in `NEXT_PUBLIC_*`.
- Answer keys never leave the API except in post-release solution endpoints.
- See [12](12-SECURITY-AND-PRODUCTION-READINESS.md).

### 3.7 Quality gates (every PR)

`pnpm turbo run lint typecheck test build --filter=...[origin/main]` must pass. Exam engine, payments and entitlement code also need human review by a second developer ([15](15-TEAM-COORDINATION-AND-INTEGRATION.md)).

## 4. Known stack limitations and in-stack solutions

| # | Limitation | Impact | In-stack solution |
|---|---|---|---|
| L-01 | Next.js on Workers depends on the OpenNext adapter. Not every Next.js feature is supported identically (ISR cache, image optimisation, middleware runtime). | Deployment risk | PoC first (§5). Use the R2 incremental cache for ISR. Use Cloudflare Images or `unoptimized` images if `next/image` optimisation is not supported. |
| L-02 | Worker bundle size limits (compressed script size per plan) | Large Next.js apps may exceed them | Check the size in the PoC. Use a paid Workers plan. Keep heavy libraries (Tiptap, Recharts) behind dynamic imports. |
| L-03 | Worker CPU time limits per request | Heavy evaluation or reports in a request could fail | Evaluation and reports run in Queue consumers. Configure CPU limits on a paid plan. Keep request handlers light. |
| L-04 | No Redis in the stack | Leaderboards, timers, caches | Postgres + periodic precomputation; `deadline_at` columns; Cloudflare Cache API for public catalogue reads. |
| L-05 | Hyperdrive caches read queries by default | Stale reads of attempt state or entitlements right after writes | **Disable Hyperdrive query caching** for the API's Hyperdrive config (or use a second, no-cache config for transactional paths). Verify in the PoC. |
| L-06 | Queues `delaySeconds` has a platform maximum (currently documented as 12 hours; verify) | Auto-submit for tests longer than the max delay, or scheduled far ahead | A per-minute Cron sweep is the guaranteed path. Delayed messages are an optimisation. |
| L-07 | Cross-subdomain cookies need one registrable domain | Session sharing would fail across different domains | **Resolved by D-01:** all hosts are under `puzzlers.in` (`app.`, `admin.`, `api.`, `assets.`), cookie domain `.puzzlers.in`. |
| L-08 | `sendBeacon` cannot send custom headers or preflighted content types | Beacon saves cross-origin (app → api) | A beacon endpoint that accepts `text/plain` JSON and authenticates with the session cookie plus a per-attempt `syncToken` in the body. |
| L-09 | Cashfree has no Workers-specific SDK guarantee | Cashfree's server SDK targets Node.js and may not run on Workers | Call the Cashfree REST API directly with `fetch` (documented in the API module). Verify with Cashfree sandbox in Phase 7. |
| L-10 | Transactional email is not in the stack; Cloudflare Email Routing only handles inbound mail and forwarding to verified addresses | Better Auth verification/reset and OTPs cannot be sent to students via Email Routing | Investigate **Cloudflare Email Sending** (D-06). Implement a provider-neutral `mailer` interface. Use the console transport in local/staging until decided. Production auth email is blocked until D-06 closes. |

## 5. Mandatory proof of concept (Phase 1 gate)

The stack document requires a PoC before production deployment decisions are final. The PoC passes when **all** of these are demonstrated on a Cloudflare account:

| # | Check | Pass criterion |
|---|---|---|
| P-1 | Next.js (App Router) app deployed to Workers through OpenNext | SSR page + static page + ISR page (R2 cache) + client component render in production mode |
| P-2 | Hono API Worker deployed | `GET /v1/health` returns 200 with a DB round trip |
| P-3 | Hyperdrive → Neon via postgres.js + Drizzle | Transaction with `SELECT … FOR UPDATE` works; query caching confirmed disabled |
| P-4 | Better Auth on Hono with a parent-domain cookie | Log in on `app.<staging-root>`; the session is visible from `admin.<staging-root>` SSR and from the browser to `api.<staging-root>` with `credentials: 'include'` |
| P-5 | R2 upload with a presigned URL + download with a short-lived URL | Works from the admin app |
| P-6 | Queue producer + consumer + `delaySeconds` | Delayed message consumed within ±5 s |
| P-7 | Cron Trigger | Scheduled handler runs each minute |
| P-8 | Sentry | Errors from the API and one Next.js app appear with private source maps |
| P-9 | Bundle size | All three apps within the plan's Worker size limit |
| P-10 | Server-to-server call from a Next.js Worker to the API | Via a service binding or public URL, forwarding the cookie for SSR |

If any check fails, the failure and an in-stack workaround are documented in [17](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md) **before** feature work depends on it.
