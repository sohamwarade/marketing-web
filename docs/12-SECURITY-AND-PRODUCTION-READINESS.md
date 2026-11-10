# 12 — Security and Production Readiness

## 1. Threat model summary

| Asset | Main threats | Primary controls |
|---|---|---|
| Answer keys and unreleased solutions | Leakage via API payloads, admin accounts, R2 | Key-free papers, contract tests, private bucket, staff 2FA |
| Exam integrity | Time extension, IDOR, forged submissions, parallel attempts | Server deadline, ownership checks, idempotency, unique indexes |
| Paid content | Link sharing, direct R2 access, YouTube unlisted links | Entitlement checks, short-lived signed URLs, paid video host with signed playback |
| Payments | Forged webhooks, client-side "success", amount tampering, double fulfilment | HMAC verification, server-side order fetch, DB prices, idempotent fulfilment |
| Accounts | Credential stuffing, enumeration, session theft | Rate limits, Turnstile, generic messages, HttpOnly Secure cookies, revocation |
| Admin powers | Privilege escalation, insider misuse | RBAC + scopes, audit logs, least privilege, 2FA |
| Personal data | Leaderboard exposure, exports, logs | Opt-out, export permissions, PII-free logs |

## 2. Authentication security

- Passwords: Better Auth's default hashing (scrypt). Minimum 8 characters, checked against a short common-password list *[Rec]*.
- Login/registration rate limits ([09 §1.7](09-API-CONTRACT-AND-ENDPOINTS.md#17-rate-limiting)) and Cloudflare Turnstile on register/forgot-password *[Rec]*.
- Generic errors ("Invalid email or password"). Reset requests always return success.
- Cookies: `HttpOnly; Secure; SameSite=Lax; Domain=.puzzlers.in`.
- Sessions: 30 days for students (sliding), 12 h for staff (absolute) *[Rec]*. Revocation is visible within ≤ 60 s (cookie cache).
- Staff 2FA (TOTP) before production (D-14).

## 3. Authorization

- Every route declares its guard. A CI test enumerates all Hono routes and fails if a `/v1/admin/*` route lacks `requirePermission`, or a `/v1/me|attempts|lessons|...` route lacks `requireAuth` *[Rec]*.
- Ownership: resources accessed by id (attempts, orders, bookmarks, notebooks, practice sessions) are loaded with `WHERE user_id = :sessionUser`. A mismatch returns 404.
- Faculty scope filters run in queries, not after fetching.
- Entitlements through `access.canAccess` only ([10 §6](10-AUTHENTICATION-AND-AUTHORIZATION.md#6-entitlement-resolution-both_override)).

## 4. Input validation and output encoding

- Zod on every input (params, query, body, headers that matter). Unknown keys are stripped (`.strip()`) for public endpoints and rejected (`.strict()`) for admin writes *[Rec]*.
- Rich text (question stems, options, solutions, lesson notes, descriptions) is sanitised **on write** with `sanitize-html` and an allowlist (p, br, strong, em, sup, sub, ul, ol, li, table elements, img with `src` restricted to our asset hosts, span with class for math). No inline event handlers, no `style` *[Rec: allow a small class allowlist instead]*, no iframes except an embed component for whitelisted video hosts.
- Client rendering uses a second sanitising pass. No `dangerouslySetInnerHTML` without the shared `SafeHtml` component.
- CSV exports are protected against formula injection (prefix cells beginning with `= + - @` with `'`).

## 5. Payments

| Control | Implementation |
|---|---|
| Price authority | Order totals computed from DB prices and coupon rules only |
| Server-to-server creation | Cashfree order created by the API with secret credentials |
| Webhook authenticity | HMAC-SHA256 signature over timestamp + raw body, constant-time compare, 5-minute timestamp window |
| Double-check | After the webhook, fetch the order/payment status from the Cashfree API before fulfilling |
| Idempotency | `payment_webhook_events.provider_event_key` unique; order row lock; fulfilment checks `fulfilled_at` |
| Amount/currency match | The Cashfree-reported amount and currency must equal `orders.total_paise` / INR |
| Return URL is not proof | The `/checkout/return` page only polls `GET /v1/orders/:id`. It never marks anything paid. |
| Reconciliation | Cron every 5 min for `pending` orders older than 10 min; daily report of mismatches |
| Refunds | Permission `payment:refund`, reason required, sum check, audit; super-admin approval above a threshold *[Rec, D-05]* |
| Secrets | `CASHFREE_SECRET_KEY` as a Worker secret; never logged; separate sandbox/production keys |

## 6. Rate limiting and abuse

Workers rate-limit bindings per route class, plus Cloudflare WAF rules:

- Block or challenge abusive IPs on `/auth/*`.
- Bot Fight Mode / Turnstile for forms.
- Per-attempt sync limit.
- Payload size limits: 256 KB default, 1 MB admin, uploads via presigned URLs only.

## 7. Files

- Private bucket for all paid materials. Objects are named by random UUID keys (`materials/{uuid}.pdf`), never by guessable names.
- Upload: presigned PUT with content-length and content-type conditions, confirm step with magic-byte validation, size limits.
- Download: entitlement check → presigned GET (5 min) with `Content-Disposition`. PDFs open in the browser viewer, and download is disabled unless `downloadable` (deterrent only; the content can still be captured).
- Images in published questions: copied to the public bucket at publish (so no pre-release leakage), under random keys.
- SVG uploads rejected.
- Report exports: private, 7-day lifecycle rule, 10-minute download URLs.

## 8. Protection of answer keys

1. `question_versions.answer_key`, `question_options.is_correct` and solutions are selected only by repo functions in the `question-bank` and `evaluation` modules, plus solution endpoints after release.
2. Student-facing serialisers are explicit Zod output schemas (`AttemptPaper`, `PracticeQuestion`) that **do not contain** key fields. Responses are parsed through the output schema before sending (`schema.parse` in dev/staging; also `strip` in production).
3. A contract test generates papers for every question type and asserts that no forbidden keys exist anywhere in the JSON (deep scan).
4. The R2 paper snapshot is generated from the same output schema.
5. Practice `instant_feedback` reveals the key only for the question just answered.
6. Faculty with `question:view` can see keys. Their access is scoped and audited (exports of the question bank need `report:export` + audit).

## 9. Server-side examination timing and idempotency

See [11 §4–5, §23–24](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md#4-server-authoritative-timer).

## 10. Audit logging

Mandatory audit actions (write in the same transaction):

`auth.staff_login`, `user.suspend`, `user.reactivate`, `user.sessions_revoked`, `role.assign`, `role.permissions_change`, `faculty.assign`, `entitlement.grant|revoke|update`, `override.create|lift`, `trial.reset`, `course.publish|unpublish|price_change`, `batch.publish|unpublish|price_change`, `question.publish|archive|key_change`, `test.publish|unpublish|release_results|release_solutions`, `results.rescore|bonus|drop|invalidate|force_submit`, `order.reconcile`, `refund.create`, `coupon.create|update|pause`, `notification.send`, `settings.update`, `report.export`.

Each row: actor, roles, action, entity, before/after (with sensitive fields redacted), reason (required for access, results and refund actions), IP, UA, request id.

## 11. Secrets and environment

- Worker secrets via `wrangler secret put` and GitHub Actions environment secrets (staging/production environments with required reviewers for production).
- No secrets in `wrangler.jsonc` `vars`, `.env.example` or `NEXT_PUBLIC_*`.
- Rotate `BETTER_AUTH_SECRET` (this invalidates sessions; plan it), Cashfree keys and R2 keys yearly or on any staff departure.
- Least privilege: Neon roles. `app_rw` for the API (no DDL, no UPDATE/DELETE on `audit_logs`), `migrator` for CI only, `readonly` for analytics.

## 12. CORS, CSRF, headers

- CORS: exact-origin allowlist, credentials on, `Vary: Origin`. No wildcard.
- CSRF: see [10 §8](10-AUTHENTICATION-AND-AUTHORIZATION.md#8-csrf).
- Security headers (API and apps):
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (enable `preload` after confirming all subdomains are HTTPS)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY` (apps; marketing may allow none as well)
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - **CSP** per app: `default-src 'self'`; `script-src 'self' 'nonce-…'` + Cashfree SDK origin (student) + Turnstile; `connect-src 'self' https://api.puzzlers.in https://*.sentry.io` + Cashfree; `img-src 'self' https://assets.puzzlers.in data:`; `frame-src` for YouTube/the paid video host/Cashfree; `object-src 'none'`. Start in Report-Only on staging.
- Source maps: uploaded to Sentry during the build, **deleted from the deployed assets** (no public `.map` files). A CI check fails the build if `.map` files exist in deploy output.

## 13. Session revocation

[10 §7](10-AUTHENTICATION-AND-AUTHORIZATION.md#7-session-revocation-and-account-states).

## 14. Backup and recovery

| Item | Approach |
|---|---|
| Postgres | Neon point-in-time restore (retention per plan; ≥ 7 days for production *[Rec]*). A nightly logical dump (`pg_dump`) from CI to a private R2 bucket with 30-day retention *[Rec]* |
| Restore drill | Before launch, and quarterly: restore into a Neon branch, run smoke tests, record the time taken |
| R2 | Object versioning is not available in all configurations; mitigate with immutable random keys and no in-place overwrites. A weekly inventory export *[Rec]* |
| Config | Everything in git (wrangler configs, migrations, seeds) |
| RPO / RTO targets *[Rec]* | RPO ≤ 15 min (PITR), RTO ≤ 2 h for the API/DB |
| During an exam incident | The outbox on student devices keeps answers. After the API recovers, clients resend. The admin can extend deadlines per test (`POST /v1/admin/tests/:id/extend` *[Phase 9 addition; contract PR required]*) |

## 15. Error monitoring

- Sentry projects: `api`, `student`, `admin`, `marketing`. Environments: staging, production. Release = git SHA.
- PII scrubbing: no emails, phone numbers or names in events. User id only. Request bodies are not attached for `/auth/*`, `/v1/orders`, `/v1/webhooks/*` or `/v1/attempts/*/sync`.
- Alerts: API 5xx rate > 1 % for 5 min; `sync` p95 > 1 s; evaluation DLQ > 0; webhook verification failures > 5/h; auto-submit sweep backlog > 50; Cashfree reconcile mismatches > 0.
- Cloudflare Workers Logs (structured JSON logs with requestId) for request tracing. Retention per plan.

## 16. Incident response

| Severity | Example | Response |
|---|---|---|
| SEV-1 | API down during a scheduled test; answers not saving; payments fulfilled incorrectly | Page the on-call developer + owner. Post a status banner via `maintenance_mode` or a notification. Decide on a deadline extension or re-test. Incident doc within 24 h. |
| SEV-2 | Evaluation delayed > 30 min; video playback failing | Fix within business hours. Notify affected students. |
| SEV-3 | Cosmetic, admin-only bugs | Normal backlog |

Exam-day runbook (D-08): staff on call, a dashboard of in-progress attempts and sync lag, rollback plan (previous Worker version via `wrangler rollback`), deploy freeze 24 h before and during scheduled mocks, and a communication template.

## 17. Privacy and compliance *[Rec, D-18]*

- India's DPDP Act 2023: a privacy notice, consent at registration, purpose limitation, a deletion/grievance process and data retention ([08 §14](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md#14-data-retention-rec-d-18)). Minors: many students are under 18, so verifiable parental consent requirements apply under DPDP. **Legal review required before launch.**
- Leaderboard opt-out (D-13).
- No third-party trackers in the exam UI. Marketing analytics only with a consent banner if required by the final legal review.

---

## 18. Production launch checklist

### Product and content
- [ ] DNS for `puzzlers.in`, `app.`, `admin.`, `api.`, `assets.` on Cloudflare; TLS for all; `www` → apex redirect
- [ ] Exam profiles for MHT-CET / JEE Main / JEE Advanced configured and verified against official notices (D-07)
- [ ] At least one free batch, one paid batch, one paid course and trial tests published
- [ ] Legal pages (privacy, terms, refund) approved
- [ ] Real testimonials only, with consent on file (or the section hidden)

### Security
- [ ] Staff 2FA enabled; all staff accounts reviewed; super admins ≤ 2
- [ ] Contract test "no answer keys in student payloads" green
- [ ] Route-guard coverage test green
- [ ] IDOR test suite green ([14](14-TESTING-AND-QUALITY-ASSURANCE.md))
- [ ] CSP enforced (not report-only) on all apps
- [ ] No public source maps (CI check)
- [ ] Secrets rotated from staging values; production Cashfree keys installed
- [ ] Rate limits and WAF rules active

### Payments
- [ ] Cashfree production account approved; webhook URL registered; signature verification tested with real sandbox events
- [ ] End-to-end purchase, failure, pending, refund tested in sandbox
- [ ] Reconciliation cron verified
- [ ] Invoice/GST decision implemented (D-17)

### Exam engine
- [ ] LT-1 … LT-7 passed at 2,000 concurrent ([11 §29](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md#29-performance-under-concurrent-test-traffic)); report archived
- [ ] Auto-submit (queue + cron) verified in production with a test account
- [ ] Rescore and bonus flows tested
- [ ] Mock-exam rehearsal with ≥ 50 real users

### Operations
- [ ] Sentry alerts configured and tested; on-call rota
- [ ] Backup restore drill completed; RPO/RTO recorded
- [ ] Exam-day runbook written (D-08)
- [ ] Support/helpdesk channel live (D-15)
- [ ] Cloudflare Email Routing live for inbound support addresses
- [ ] Transactional sender chosen (D-06) and live with SPF/DKIM/DMARC; verification and password-reset emails tested to Gmail and Outlook
- [ ] Analytics dashboard for admins verified with real data
