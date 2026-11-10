# AGENTS.md — Puzzlers Monorepo Rules for AI Coding Agents

Copy this file to the **monorepo root** (`puzzlers/AGENTS.md`). Each app also has a `CLAUDE.md` with app-specific rules:
- `apps/student/CLAUDE.md`
- `apps/admin/CLAUDE.md`
- `apps/marketing/CLAUDE.md`

Read `docs/00-START-HERE.md` first.

## 1. What this repo is

Puzzlers: an MHT-CET + JEE learning and online-examination platform. It has three Next.js apps (marketing at `puzzlers.in`, student at `app.puzzlers.in`, admin at `admin.puzzlers.in`) and **one shared Hono API** in `apps/api` (`api.puzzlers.in`). **Hono is the backend framework; Cloudflare Workers is the backend runtime and host.** Data lives in Neon PostgreSQL via Drizzle and Hyperdrive. The architecture is a modular monolith.

## 2. Fixed technology stack — NEVER replace or bypass

| Layer | Fixed |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui (via `@puzzlers/ui`) |
| Backend framework | **Hono** + TypeScript, one application in `apps/api` |
| Backend runtime/hosting | **Cloudflare Workers** (`fetch` + `queue` + `scheduled` handlers). No Node.js server. |
| Frontend hosting | Cloudflare Workers via OpenNext |
| Platform services | R2 (files), Hyperdrive (DB connectivity), Queues (background jobs), Cron Triggers, DNS/WAF/Turnstile |
| Database | **Neon PostgreSQL** + **Drizzle ORM** (migrations via drizzle-kit) |
| Auth | **Better Auth** (inside the API) |
| Payments | **Cashfree** (confirmed) |
| Validation | **Zod** (shared schemas in `@puzzlers/schemas`) |
| Monitoring | Sentry |
| Email | Cloudflare Email Routing = inbound/forwarding only. Transactional sending is open (D-06); use the `mailer` interface. |

An AI agent must **never independently**:
- replace Hono, or add Node.js + Express, NestJS, Fastify, a traditional Node.js server (VPS/container) or Next.js API routes as a backend;
- create a second backend application or service, or put backend code anywhere other than `apps/api`;
- create a separate or duplicate database (all schema and migrations live in `packages/database`);
- replace Drizzle or Neon, or add another database or ORM;
- introduce another frontend framework (Astro, Remix, Vite SPA, Vue…) or styling system;
- change the shared API contract (`packages/schemas`, `docs/09`) without an approved contract PR;
- create database tables outside `packages/database`, or duplicate an existing entity;
- move business logic (access, pricing, scoring, deadlines, eligibility, payment state) into frontend code;
- implement security-critical logic only in the browser;
- add microservices, Kubernetes, Redis or other infrastructure not in the stack.

If a task seems to require one of these, **stop and explain why** in the PR or response, and reference `docs/17-OPEN-DECISIONS-AND-ASSUMPTIONS.md`.

## 3. Ownership boundaries

| Path | Owner | Agents working for others may… |
|---|---|---|
| `apps/student`, `packages/exam-core` | Developer 1 | not edit |
| `apps/api` examination modules: `exam`, `evaluation`, `results`, `practice`, student test discovery, `/v1/me/{tests,attempts,performance,dashboard}`, admin-side exam operation endpoints | Developer 1 (Dev 2 reviews) | not edit |
| `apps/admin` | Developer 2 | not edit |
| `apps/api` **foundation** (app skeleton, middleware, auth, CI/CD) and administrative modules: `iam`, `catalog`, `learning`, `batches`, `question-bank`, `tests`, `access`, `commerce` (Cashfree), `notifications`, `mailer`, `uploads`, `reports`, `audit`, `settings`, `public` | Developer 2 (Dev 1 reviews student-facing endpoints) | not edit |
| `packages/{schemas,database,auth,api-client}` | Developer 2 as **Contract & Schema Steward** | propose changes via contract/migration PR |
| `apps/marketing`, `packages/design-tokens`, `packages/ui` (lead; except `packages/ui/src/exam-preview`, maintained by Developer 1) | Developer 3 (**no backend ownership**; consumes `/v1/public/*`) | propose changes via PR |

The backend is **not** owned exclusively by Developer 2: examination modules belong to Developer 1. Cross-module calls go through the owning module's service functions, never directly to another module's tables.

## 4. Shared packages: use them, don't duplicate them

- API calls → `@puzzlers/api-client` only.
- Types and validation → `@puzzlers/schemas` (`z.infer`). Never hand-write API types.
- UI → `@puzzlers/ui` + `@puzzlers/design-tokens`. No raw hex colours.
- Exam rules (palette transitions, attempt limits, scoring, numeric normalisation, timer math) → `@puzzlers/exam-core`.
- Auth in browsers → `@puzzlers/auth/client`.

## 5. Coding standards

- TypeScript strict. No `any` without a justified comment.
- API modules: `routes.ts` (HTTP) → `service.ts` (logic, transactions) → `repo.ts` (Drizzle) → `policies.ts` (authz).
- Every API input is validated by Zod. Every response uses the standard envelope. Error codes come from the catalogue in `docs/09 §29`.
- Sensitive mutations write an audit log in the same transaction.
- Money in integer paise; marks as decimal strings / integer hundredths; times as UTC ISO.
- User-authored HTML is sanitised on the server and rendered via `SafeHtml`/`MathText`.
- No secrets in code, `NEXT_PUBLIC_*` variables, logs or URLs.

## 6. Checks before finishing any task

```
pnpm lint
pnpm typecheck
pnpm test --filter=...[origin/main]
pnpm build --filter=<affected app>
```

Node.js is used only for this tooling (pnpm, Turborepo, wrangler, drizzle-kit, Next.js builds, tests). The API runs locally with `wrangler dev` in the Workers runtime.

For apps, also verify in the Workers runtime: `pnpm --filter <app> preview`. Exam, payment and access changes also need the integration tests for that module (`docs/14 §3`).

## 7. Database migrations

1. Edit `packages/database/src/schema/*.ts` only.
2. `pnpm db:generate`, then read the generated SQL.
3. Apply to your Neon dev branch with `pnpm db:migrate`.
4. Use expand/contract only. Never edit a merged migration. Never run `drizzle-kit push` on shared environments.
5. Label the PR `db-migration`. Developer 2 (steward) must approve. Developer 1 approves Developer 2's own migrations.

## 8. Changing shared contracts

Open a PR labelled `contract` that includes: the consumer need, the Zod schema change, the `docs/09` update, the OpenAPI snapshot, and a mock/fixture update. It needs approval from the steward (Developer 2) and every consuming app owner (`docs/15 §4`). Additive changes need 24-hour notice; breaking changes need versioning.

## 9. Documenting decisions

- A technical decision with alternatives → `docs/adr/NNNN-title.md` (context, options, decision, consequences).
- A product or owner decision → a row in `docs/17-OPEN-DECISIONS-AND-ASSUMPTIONS.md` (never decide it silently in code).
- Update the affected docs in the same PR as the behaviour change.

## 10. When requirements are unclear

Choose the most conservative behaviour: it never loses student answers, never grants extra access or time, and never reveals answer keys. Implement that, and write a "Question for owner" note in the PR.
