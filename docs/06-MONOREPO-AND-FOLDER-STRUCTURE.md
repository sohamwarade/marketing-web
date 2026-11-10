# 06 — Monorepo and Folder Structure

pnpm workspaces + Turborepo. Both are build tooling only (they run on Node.js on developer machines and in CI) and change nothing in the fixed stack.

**Placement rules (confirmed):**
- **All backend code lives in `apps/api`**: one Hono application running on Cloudflare Workers. There is no other backend folder, service or server.
- **All database schema and migrations live in `packages/database`.** There is one Neon database per environment (with per-developer Neon *branches* of it for development).
- No developer may create an independent backend, a second API app, or a duplicate database.

## 1. Tree

```
puzzlers/
├── apps/
│   ├── marketing/            # Next.js – public site (Developer 3)
│   ├── student/              # Next.js – student platform + exam engine (Developer 1)
│   ├── admin/                # Next.js – admin & faculty platform (Developer 2)
│   └── api/                  # Hono on Cloudflare Workers – the ONLY backend (modules owned per 15 §1)
│       ├── src/
│       │   ├── index.ts              # exports { fetch, queue, scheduled }
│       │   ├── app.ts                # Hono app, middleware, route mounting
│       │   ├── middleware/           # requestId, cors, rateLimit, db, session, guards, errors
│       │   ├── modules/<module>/     # routes.ts, service.ts, repo.ts, policies.ts, *.test.ts
│       │   ├── jobs/                 # queue consumers + cron handlers
│       │   ├── lib/                  # r2, cashfree client, mailer, video provider adapter
│       │   └── openapi.ts            # OpenAPI document assembly
│       └── wrangler.jsonc
├── packages/
│   ├── ui/                   # shadcn/ui components + shared composites (all apps)
│   ├── design-tokens/        # CSS variables, Tailwind theme, token TS constants
│   ├── schemas/              # Zod schemas = the API contract (request/response/enums)
│   ├── api-client/           # typed fetch client built on schemas
│   ├── database/             # Drizzle schema, migrations, seed, db client factory
│   ├── auth/                 # Better Auth server config factory + client helpers
│   ├── exam-core/            # pure TS: palette state machine, guards, timer math, scoring rules
│   └── config/               # tsconfig bases, eslint config, prettier, tailwind preset
├── docs/                     # this documentation set (copied from puzzlers-documentation/)
├── scripts/                  # seed runners, load tests (k6), env checks, OpenAPI export
├── .github/
│   ├── workflows/            # ci.yml, deploy-staging.yml, deploy-prod.yml, migrate.yml
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

`exam-core` is added to the brief's proposed structure (PD-08). It holds logic that **must be identical** on client and server (palette transitions, attempt-limit guard, slot math, scoring rules), so it is not duplicated.

## 2. Package purposes and dependencies

| Package | Purpose | May depend on | Must NOT depend on |
|---|---|---|---|
| `@puzzlers/config` | Shared tsconfig/eslint/prettier/tailwind preset | nothing | anything |
| `@puzzlers/design-tokens` | Colours, type, spacing, radii as CSS + TS | config | ui, apps |
| `@puzzlers/schemas` | Zod schemas, enums, error codes, inferred types | zod | database, api, React |
| `@puzzlers/exam-core` | Pure functions, no I/O, no React | schemas | database, api-client, React |
| `@puzzlers/database` | Drizzle tables, relations, migrations, `createDb(url)` | drizzle-orm, postgres, schemas (enums only) | apps, api-client, React |
| `@puzzlers/auth` | `createAuth(env, db)` server factory; `authClient` for browsers | better-auth, database | apps |
| `@puzzlers/api-client` | `createApiClient({ baseUrl, fetch })` with typed methods | schemas | database, auth server code |
| `@puzzlers/ui` | shadcn components, composites (DataTable, PageHeader, MathText, EmptyState…) | design-tokens, React, Radix | api-client, schemas business logic |
| `apps/api` | HTTP + modules + jobs | database, auth, schemas, exam-core | ui, api-client |
| `apps/student` | Student UI | ui, api-client, schemas, exam-core, auth (client), design-tokens | database, auth server |
| `apps/admin` | Admin UI | ui, api-client, schemas, auth (client), design-tokens, exam-core (preview only) | database, auth server |
| `apps/marketing` | Public UI | ui, api-client, schemas, design-tokens | database, auth server, exam-core |

## 3. Import rules (enforced)

1. Apps never import `@puzzlers/database` or Better Auth **server** code. That is enforced with ESLint `no-restricted-imports` in `@puzzlers/config/eslint`.
2. Apps never import from another app (`apps/*` → `apps/*` forbidden).
3. Packages expose only their `exports` entry points. No deep imports (`@puzzlers/ui/src/...`).
4. `exam-core` and `schemas` must stay runtime-agnostic (no `window`, no Node APIs).
5. Circular package dependencies fail CI (`turbo` graph check / `madge` *[Rec]*).

## 4. Root configuration

`pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", ".open-next/**", "dist/**"] },
    "typecheck": { "dependsOn": ["^build"] },
    "lint": {},
    "test": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

Root `package.json` scripts:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:api": "turbo run dev --filter=@puzzlers/api",
    "dev:student": "turbo run dev --filter=@puzzlers/student --filter=@puzzlers/api",
    "dev:admin": "turbo run dev --filter=@puzzlers/admin --filter=@puzzlers/api",
    "dev:marketing": "turbo run dev --filter=@puzzlers/marketing --filter=@puzzlers/api",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "e2e": "turbo run e2e",
    "db:generate": "pnpm --filter @puzzlers/database drizzle-kit generate",
    "db:migrate": "pnpm --filter @puzzlers/database migrate",
    "db:seed": "pnpm --filter @puzzlers/database seed",
    "db:studio": "pnpm --filter @puzzlers/database drizzle-kit studio",
    "openapi:export": "pnpm --filter @puzzlers/api openapi:export"
  }
}
```

## 5. Environment variables

Secrets are set with `wrangler secret put` per environment, never committed. `.dev.vars` (API) and `.env.local` (apps) are git-ignored. `.dev.vars.example` / `.env.example` are committed with placeholder values.

### API (`apps/api`)

| Name | Kind | Example / note |
|---|---|---|
| `ENVIRONMENT` | var | `local` / `staging` / `production` |
| `ROOT_DOMAIN` | var | `puzzlers.in` (production), `staging.puzzlers.in` (staging) |
| `ALLOWED_ORIGINS` | var | Production: `https://puzzlers.in,https://www.puzzlers.in,https://app.puzzlers.in,https://admin.puzzlers.in` |
| `COOKIE_DOMAIN` | var | `.puzzlers.in` (parent domain) |
| `BETTER_AUTH_SECRET` | secret | ≥ 32 random bytes |
| `BETTER_AUTH_URL` | var | `https://api.puzzlers.in` |
| `HYPERDRIVE` | binding | Hyperdrive → Neon |
| `DATABASE_URL_DIRECT` | CI secret only | Direct Neon URL for migrations (never in the Worker) |
| `R2_PRIVATE`, `R2_PUBLIC` | bindings | R2 buckets |
| `R2_S3_ACCESS_KEY_ID`, `R2_S3_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID` | secrets | For presigned URLs |
| `PUBLIC_ASSETS_BASE_URL` | var | `https://assets.puzzlers.in` |
| `Q_EVAL`, `Q_JOBS`, `Q_NOTIFY` | bindings | Queue producers |
| `RL_ANON`, `RL_USER`, `RL_AUTH` | bindings | Workers rate-limit bindings |
| `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY` | secrets | PG credentials |
| `CASHFREE_ENV` | var | `sandbox` / `production` |
| `CASHFREE_API_VERSION` | var | Pinned API version header value (verify current) |
| `MAIL_PROVIDER`, `MAIL_FROM` (+ provider credentials or a `send_email` binding) | var/secret/binding | `console` until **D-06** (transactional sending) is decided. Cloudflare Email Routing (inbound) needs no API variables. |
| `VIDEO_PROVIDER`, `VIDEO_API_KEY`, `VIDEO_SIGNING_KEY` | var/secret | D-03 |
| `TURNSTILE_SECRET_KEY` | secret | Registration/login abuse protection *[Rec]* |
| `SENTRY_DSN`, `SENTRY_RELEASE` | var | |
| `EXAM_SUBMIT_GRACE_SECONDS` | var | Default `15` |

### Next.js apps (`apps/student`, `apps/admin`, `apps/marketing`)

| Name | Kind | Note |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | public | `https://api.puzzlers.in` |
| `NEXT_PUBLIC_APP_URL` | public | Own origin |
| `NEXT_PUBLIC_MARKETING_URL`, `NEXT_PUBLIC_STUDENT_URL`, `NEXT_PUBLIC_ADMIN_URL` | public | Cross-links |
| `NEXT_PUBLIC_SENTRY_DSN` | public | |
| `NEXT_PUBLIC_CASHFREE_MODE` | public | `sandbox`/`production` (student only) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | student (auth pages) |
| `SENTRY_AUTH_TOKEN` | CI secret | Source-map upload; never in a runtime env |
| `REVALIDATE_SECRET` | secret | marketing: on-demand ISR revalidation |

Only `NEXT_PUBLIC_*` values may appear in browser code, and none of them may be secrets.

## 6. Commands

| Task | Command |
|---|---|
| Install | `pnpm install` (Node LTS pinned in `.nvmrc`; pnpm pinned via `packageManager`) |
| Run everything | `pnpm dev` |
| Run the API | `pnpm dev:api` (wrangler dev on `:8787`) |
| Run one app + API | `pnpm dev:student` / `dev:admin` / `dev:marketing` |
| Lint / typecheck / test | `pnpm lint`, `pnpm typecheck`, `pnpm test` |
| E2E | `pnpm e2e` (Playwright, against local or staging) |
| Build all | `pnpm build` |
| Build one | `pnpm turbo run build --filter=@puzzlers/student` |
| Generate a migration | `pnpm db:generate` (after editing `packages/database/src/schema/*`) |
| Apply migrations locally | `pnpm db:migrate` (uses `DATABASE_URL_DIRECT` from your env) |
| Seed | `pnpm db:seed` |
| Deploy (CI only) | `wrangler deploy` (API); `opennextjs-cloudflare build && opennextjs-cloudflare deploy` (apps) |
| Export OpenAPI | `pnpm openapi:export` → `scripts/out/openapi.json` (Postman import) |

## 7. Database migration workflow

1. Open a branch and edit the schema files in `packages/database/src/schema/`.
2. `pnpm db:generate` creates `packages/database/migrations/NNNN_<name>.sql`. Review the SQL by hand.
3. Apply it to your personal Neon dev branch with `pnpm db:migrate`.
4. Open a PR labelled `db-migration`. **CODEOWNERS** requires the schema steward's (Developer 2) approval ([15 §5](15-TEAM-COORDINATION-AND-INTEGRATION.md#5-database-migration-ownership)).
5. On merge to `main`, CI runs `migrate.yml` against **staging** first, then the API deploys.
6. A production migration runs in the prod deploy workflow **before** the API deploy, with a manual approval gate.
7. Migrations must be **backward-compatible with the previous API version** (expand → migrate → contract). A column is dropped only in a later release, after no code reads it.
8. Never edit a merged migration file. Fix forward with a new migration.

## 8. App-internal structure (summary)

Each app's internal layout is specified in its own package:

- Student: [developer-1-student-platform/06-FRONTEND-ARCHITECTURE.md](developer-1-student-platform/06-FRONTEND-ARCHITECTURE.md)
- Admin: [developer-2-admin-platform/07-FRONTEND-ARCHITECTURE.md](developer-2-admin-platform/07-FRONTEND-ARCHITECTURE.md)
- Marketing: [developer-3-marketing-website/07-FRONTEND-ARCHITECTURE.md](developer-3-marketing-website/07-FRONTEND-ARCHITECTURE.md)
