# 13 — Deployment and Environment Setup

## 1. Accounts and resources (one-time, done by the owner or a delegated developer)

| Service | Resources |
|---|---|
| GitHub | Org/repo `puzzlers`; branch protection on `main`; environments `staging`, `production` (production needs reviewers) |
| Cloudflare | Zone for `puzzlers.in` (confirmed). Workers paid plan. R2 buckets `puzzlers-private-{stg,prod}`, `puzzlers-public-{stg,prod}`, `opennext-cache-{app}-{stg,prod}`. Queues `q-eval`, `q-jobs`, `q-notify`, `q-dlq` (per env). Hyperdrive config per env (**caching disabled**, see L-05). Rate-limit namespaces. Turnstile site. API token for CI (scoped: Workers Scripts edit, R2, Queues, Hyperdrive). |
| Neon | Project `puzzlers`. Branches: `main` (production), `staging`, `dev-<name>` per developer. Roles `app_rw`, `migrator`, `readonly`. |
| Cashfree | Sandbox account (dev/staging); production account after KYC. Webhook endpoint per environment. |
| Sentry | Org + 4 projects; auth token for CI |
| Cloudflare Email Routing | Enable on the `puzzlers.in` zone (MX + SPF records created by Cloudflare). Routes such as `support@puzzlers.in` and `admissions@puzzlers.in` → verified staff inboxes. **Inbound and forwarding only.** |
| Transactional email (D-06) | Investigate Cloudflare Email Sending. Whichever sender is chosen needs SPF/DKIM/DMARC alignment on `puzzlers.in` (or a subdomain such as `mail.puzzlers.in`) |
| Video host (D-03) | Account, signing keys |

## 2. Hostnames per environment

| App | Local | Staging | Production |
|---|---|---|---|
| Marketing | `http://localhost:3002` | `https://staging.puzzlers.in` | `https://puzzlers.in` (+ `www.puzzlers.in` → apex 301) |
| Student | `http://localhost:3000` | `https://app.staging.puzzlers.in` | `https://app.puzzlers.in` |
| Admin | `http://localhost:3001` | `https://admin.staging.puzzlers.in` | `https://admin.puzzlers.in` |
| API | `http://localhost:8787` | `https://api.staging.puzzlers.in` | `https://api.puzzlers.in` |
| Public assets | R2 dev URL | `https://assets.staging.puzzlers.in` | `https://assets.puzzlers.in` |

Cookie domain: unset locally, `.staging.puzzlers.in` on staging, `.puzzlers.in` on production. A staging cookie on `.staging.puzzlers.in` is **not** sent to production hosts. A production cookie on `.puzzlers.in` **is** sent to staging hosts, which is harmless because staging uses a different auth secret and rejects it. Better still, use a separate registrable domain for staging if one is available *[Rec]*.

### 2.1 DNS records (production)

| Host | Type | Target |
|---|---|---|
| `puzzlers.in` | Workers custom domain | `puzzlers-marketing` |
| `www.puzzlers.in` | Redirect rule (301) | → `https://puzzlers.in` |
| `app.puzzlers.in` | Workers custom domain | `puzzlers-student` |
| `admin.puzzlers.in` | Workers custom domain | `puzzlers-admin` |
| `api.puzzlers.in` | Workers custom domain | `puzzlers-api` |
| `assets.puzzlers.in` | R2 custom domain | `puzzlers-public-prod` |
| MX / SPF | Managed by Cloudflare Email Routing | inbound mail |

## 3. API Worker configuration (`apps/api/wrangler.jsonc`)

```jsonc
{
  "name": "puzzlers-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-10-01",
  "compatibility_flags": ["nodejs_compat"],
  "observability": { "enabled": true },
  "vars": { "ENVIRONMENT": "local", "EXAM_SUBMIT_GRACE_SECONDS": "15" },
  "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "<local-or-env-id>", "localConnectionString": "postgres://..." }],
  "r2_buckets": [
    { "binding": "R2_PRIVATE", "bucket_name": "puzzlers-private-dev" },
    { "binding": "R2_PUBLIC", "bucket_name": "puzzlers-public-dev" }
  ],
  "queues": {
    "producers": [
      { "binding": "Q_EVAL", "queue": "q-eval-dev" },
      { "binding": "Q_JOBS", "queue": "q-jobs-dev" },
      { "binding": "Q_NOTIFY", "queue": "q-notify-dev" }
    ],
    "consumers": [
      { "queue": "q-eval-dev", "max_batch_size": 10, "max_concurrency": 10, "max_retries": 5, "dead_letter_queue": "q-dlq-dev" },
      { "queue": "q-jobs-dev", "max_batch_size": 5, "max_retries": 5, "dead_letter_queue": "q-dlq-dev" },
      { "queue": "q-notify-dev", "max_batch_size": 20, "max_retries": 5, "dead_letter_queue": "q-dlq-dev" }
    ]
  },
  "triggers": { "crons": ["* * * * *", "*/5 * * * *", "30 20 * * *", "30 21 * * *"] },
  "env": {
    "staging": { "vars": { "ENVIRONMENT": "staging" }, "routes": [{ "pattern": "api.staging.puzzlers.in", "custom_domain": true }] },
    "production": { "vars": { "ENVIRONMENT": "production" }, "routes": [{ "pattern": "api.puzzlers.in", "custom_domain": true }] }
  }
}
```

`nodejs_compat` is a Workers compatibility flag that provides Node-style APIs inside the Workers runtime (needed by postgres.js and parts of Better Auth). It does not make the API a Node.js server.

Cron times are UTC: `30 20 * * *` = 02:00 IST, `30 21 * * *` = 03:00 IST. Each `env` block repeats the bindings with its own resource names (wrangler does not inherit bindings into environments). The `compatibility_date` is set when the repo is created and updated deliberately.

## 4. Next.js apps on Workers (OpenNext)

Per app (`apps/student`, `apps/admin`, `apps/marketing`):

- `open-next.config.ts` using `@opennextjs/cloudflare` with the R2 incremental cache.
- `wrangler.jsonc` with `main: ".open-next/worker.js"`, `assets` pointing at `.open-next/assets`, the R2 cache bucket binding and an optional service binding `API` → `puzzlers-api`.
- Build: `opennextjs-cloudflare build`. Deploy: `opennextjs-cloudflare deploy` (or `wrangler deploy`).
- Preview locally in the Workers runtime: `opennextjs-cloudflare preview` (always test this before declaring a feature done; `next dev` alone does not prove Workers compatibility).

The exact config keys follow the adapter version chosen in the PoC (P-1) and are recorded in `apps/*/README.md`.

## 5. CI/CD (GitHub Actions)

| Workflow | Trigger | Steps |
|---|---|---|
| `ci.yml` | PR, push | install (pnpm cache) → lint → typecheck → unit tests → build (affected) → contract tests → `exam-core` coverage gate → no-source-map check |
| `e2e.yml` | PR label `e2e`, nightly | deploy preview or use staging → Playwright suites |
| `migrate.yml` | called by deploy | `drizzle-kit migrate` with `DATABASE_URL_DIRECT` (env secret) |
| `deploy-staging.yml` | push to `main` | migrate staging → deploy API → deploy apps → smoke tests (`/v1/health`, login, start/sync/submit on the seed test) |
| `deploy-prod.yml` | manual dispatch or tag `v*` | approval gate → migrate prod → deploy API → deploy apps → smoke → Sentry release finalize |

Deploy order rule: **migrations first (backward-compatible), then the API, then the apps.** The apps must tolerate the previous API version for a few minutes during rollout.

Rollback: `wrangler rollback` (per Worker) to the previous version. Migrations are expand-only, so a rollback never needs a down-migration.

Deploy freeze: no production deploy from 24 h before a scheduled mock until its window closes (calendar in the admin dashboard, D-08).

## 6. Local development setup

1. Install Node.js (version in `.nvmrc`) and pnpm (`corepack enable`). Node.js is needed only for tooling (pnpm, Turborepo, wrangler, drizzle-kit, Next.js builds, tests). The API itself runs locally in the Workers runtime via `wrangler dev`, not as a Node.js server.
2. `pnpm install`
3. Create your Neon branch `dev-<name>` from `staging` (Neon console or CLI) and copy the **direct** connection string.
4. `apps/api/.dev.vars` from `.dev.vars.example`. Set `localConnectionString` (or `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`) to your Neon branch, `BETTER_AUTH_SECRET` to random, `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002`, the Cashfree sandbox keys (shared team sandbox), and `MAIL_PROVIDER=console`.
5. `apps/*/.env.local` from `.env.example`, with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8787`.
6. `pnpm db:migrate && pnpm db:seed` (system + taxonomy + demo).
7. `pnpm dev` (or `dev:student` etc.). Log in with a seeded user (`student1@demo.local` / password printed by the seed).
8. Queues and cron locally: `wrangler dev` simulates queues. Trigger the cron with `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` (wrangler `--test-scheduled`).
9. Cashfree webhooks locally: use a tunnel (e.g. `cloudflared tunnel`) to expose `localhost:8787/v1/webhooks/cashfree` and register it in the sandbox dashboard. Alternatively, replay saved sandbox payloads with `scripts/replay-webhook.ts`.

## 7. Environment parity rules

- Staging uses the same Workers plan features, the same Hyperdrive settings and a Neon compute size **equal to production** during load tests.
- Feature flags (`system_settings.features.*`) gate incomplete features in production rather than long-lived branches.
- Seed data never runs against production except `seed:system` and `seed:taxonomy`.

## 8. Operational dashboards

- Cloudflare: Workers analytics (requests, errors, CPU time), Queues backlog, Hyperdrive metrics.
- Neon: CPU, connections, storage, slow queries.
- Sentry: errors and performance per project.
- Admin app: "Live exams" page (in-progress attempts, last-sync lag distribution, submissions, evaluation backlog) via `GET /v1/admin/tests/:id/attempts`.
