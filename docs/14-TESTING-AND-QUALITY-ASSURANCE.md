# 14 — Testing and Quality Assurance

## 1. Test pyramid

| Level | Tool | Scope | Owner |
|---|---|---|---|
| Unit | Vitest | `exam-core`, `schemas`, API services (with a DB), UI utilities | Each code owner |
| Integration (API) | Vitest + a real Postgres (Neon branch per CI run, or a local Postgres in CI) + Hono `app.request()` | Every endpoint: happy path, auth, permission, validation, error codes | Module owners (Dev 2 foundation + administrative modules incl. public; Dev 1 examination modules) |
| Contract | Vitest | Response schemas parse; no answer keys; route-guard coverage; OpenAPI snapshot diff | Dev 2 (steward) |
| Component | Vitest + Testing Library | Exam components, forms, tables | App developers |
| E2E | Playwright | Critical journeys across apps on staging | Each developer for their app; shared journeys jointly |
| Load | k6 | Exam traffic, catalogue traffic | Backend owner + Developer 1 |
| Security | Automated tests + manual review + optional external pentest | IDOR, authz, payments, uploads, headers | All, coordinated |
| Accessibility | axe (Playwright) + manual keyboard/screen-reader passes | All apps; the exam deeply | App developers |

## 2. Coverage gates

| Package/app | Gate |
|---|---|
| `packages/exam-core` | 100 % lines and branches (CI fails below) |
| `apps/api/modules/{exam, evaluation, access, commerce}` | ≥ 90 % lines |
| Other API modules | ≥ 75 % |
| Apps | No numeric gate. Required E2E journeys must exist and pass. |

## 3. Mandatory test suites

### 3.1 exam-core

- Palette reducer: the full transition table from [11 §13](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md#13-question-palette-state-transitions) for both `keepMarkOnSave` values. Property test: random action sequences never produce an invalid state; `answered*` ⇔ `hasAnswer`.
- Attempt limit: at the limit, committing a new answer is refused, mark without an answer is allowed, and changing an existing answer is allowed.
- Scoring golden files: ≥ 60 hand-computed cases covering SCQ, MSQ all-or-nothing, MSQ partial (every row of the table), numerical exact/range/decimals/negative, FTB modes, bonus, dropped, `count_answered_marked` on/off, and over-limit sections.
- Numeric normalisation edge cases: `"-0"`, `".5"`, `"5."`, `"1e3"` (rejected), `"  2.50 "`, very long input.
- Timer/slot math: boundaries at exactly start/end, skew positive/negative.

### 3.2 API exam module (integration)

| ID | Test |
|---|---|
| EX-01 | Start creates an attempt with the correct deadline (with and without the window cap) |
| EX-02 | A second start returns the same in-progress attempt (resume) |
| EX-03 | Two parallel starts → exactly one attempt (race test with `Promise.all`) |
| EX-04 | Attempt limit and every reattempt policy |
| EX-05 | Trial consumption: parallel starts of two different trial tests with 1 trial remaining → one succeeds |
| EX-06 | Paper has no key fields (deep scan) for all question types |
| EX-07 | Sync idempotency: the same batch twice → the same state; events not duplicated |
| EX-08 | Out-of-order batches: a lower seq does not overwrite a higher one |
| EX-09 | Section limit rejection per item; the rest of the batch applied |
| EX-10 | Sync after deadline + grace → 410; auto-submit triggered |
| EX-11 | Sync by another user → 404 |
| EX-12 | Submit idempotency: 3 parallel submits → one submitted state, one evaluation |
| EX-13 | Submit with `finalSeq > lastSeq` → `409 SYNC_INCOMPLETE` |
| EX-14 | Cron sweep submits expired attempts; the queue auto-submit fires early → re-enqueues |
| EX-15 | Evaluation correctness against golden attempts; re-evaluation is idempotent |
| EX-16 | Result/solution release rules (each mode) |
| EX-17 | Rescore after bonus/drop updates scores and ranks |
| EX-18 | Republishing during in-progress attempts: old attempts keep their publication |
| EX-19 | Beacon with a wrong `syncToken` → ignored |
| EX-20 | Navigation policy violations rejected |

### 3.3 Access / entitlements

A decision-table test for `canAccess` covering: suspended, unpublished, restriction on the resource/ancestor (beats grant and entitlement), grant override, direct course, batch-derived course, batch test with a window, expired entitlement (`ends_at` past while the status is still active), preview lesson, free test, trial remaining/exhausted, drip `available_from`.

### 3.4 Commerce

Order pricing (coupon types, limits, min order, per-user limit, first-purchase-only, 100 % coupon), webhook signature (valid, invalid, stale timestamp, replay), fulfilment idempotency (webhook + return poll + reconcile all at once), amount mismatch → not fulfilled + alert, refund sum limits, entitlement revoke on refund success.

### 3.5 Security tests

- IDOR: for each `/:id` student route, user B requesting user A's resource → 404.
- Permission matrix: for each admin route, each role → expected 200/403 (generated from the matrix in [developer-2 06](developer-2-admin-platform/06-ROLE-AND-PERMISSION-MATRIX.md)).
- Faculty scope: out-of-scope reads are filtered and writes return 403.
- Upload: wrong MIME, oversized, SVG, mismatched magic bytes → rejected.
- XSS: stored payloads in stem/option/solution/notes are sanitised; CSP blocks inline script.
- CSRF: a cross-origin POST without the allowed Origin → 403.
- Rate limits return 429 with `Retry-After`.

## 4. E2E journeys (Playwright, staging)

| ID | Journey | Apps |
|---|---|---|
| J-01 | Visitor → marketing exam page → "Start free" → register → onboarding → dashboard | marketing, student |
| J-02 | Free batch enroll → course lesson video + PDF → mark complete → progress updated | student |
| J-03 | Paid course purchase in Cashfree sandbox → return → access granted | student |
| J-04 | Full test attempt: instructions → answer all types → mark/clear → section switch → refresh mid-test → resume → submit → result → solutions | student |
| J-05 | Offline during the test (Playwright `context.setOffline(true)`) for 60 s → answers continue → back online → synced → submit | student |
| J-06 | Let the timer expire with the tab closed → server auto-submits → result available | student + API |
| J-07 | Admin creates a question of each type → review → publish → builds a test with sections + random rule → preview → publish → assigns to a batch | admin |
| J-08 | Admin grants a complimentary course → student sees it; admin restricts a test → student blocked | admin, student |
| J-09 | Admin suspends a student → the student's session ends | admin, student |
| J-10 | Faculty login sees only assigned courses/questions | admin |
| J-11 | Admin refund → entitlement revoked (when chosen) | admin, student |
| J-12 | Marketing SEO: sitemap, robots, canonical, OG tags, JSON-LD validation | marketing |

## 5. Manual QA checklists

- Exam on devices: Chrome/Edge/Firefox/Safari latest; Android Chrome on a low-end device (2 GB RAM); iOS Safari; 360 px width; keyboard-only; screen reader (NVDA + Chrome, VoiceOver + Safari) for palette and question navigation.
- Math rendering: fractions, matrices, chemical formulas (`\ce{}` via the KaTeX mhchem extension *[Rec]*), long equations on mobile (horizontal scroll inside the equation, not the page).
- Network throttling: "Slow 3G" profile for a whole test.

## 6. Load and performance testing

Scenarios LT-1 … LT-8 are defined in [11 §29.3](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md#29-performance-under-concurrent-test-traffic). Additional:

| ID | Scenario | Pass |
|---|---|---|
| LT-C1 | Marketing catalogue: 200 rps on `/v1/public/*` for 10 min | p95 < 200 ms (cached) |
| LT-C2 | Student dashboard: 500 rps `GET /v1/me/dashboard` | p95 < 400 ms |
| LT-C3 | Admin question list with filters on 50k questions | p95 < 500 ms |

Procedure:

1. Staging with a production-equal Neon compute.
2. `seed:load` (5,000 users, tokens obtained by scripted login, stored in a k6 data file).
3. Run k6 from at least two regions near India *[Rec: k6 cloud or VMs]*.
4. Record: p50/p95/p99 per endpoint, error codes, DB CPU/connections, Hyperdrive metrics, queue backlog, evaluation completion time.
5. Run the "zero lost answers" verification script.
6. Write the report to `docs/load-tests/YYYY-MM-DD-LT-x.md`.

**No capacity claim (2,000 / 5,000 / 10,000) may appear in marketing or sales material without a passing report.**

## 7. Definition of Done (every feature)

- [ ] Matches the contract ([09](09-API-CONTRACT-AND-ENDPOINTS.md)) and schemas; no ad-hoc fields
- [ ] Lint, typecheck, unit and integration tests pass in CI
- [ ] Loading, empty, error, forbidden and offline (where relevant) states implemented
- [ ] Accessible (keyboard, labels, contrast)
- [ ] Responsive at 360 / 768 / 1280 px
- [ ] Works in `opennextjs-cloudflare preview` (apps) / `wrangler dev` (API)
- [ ] Sentry captures errors with context; no PII
- [ ] Audit log written for sensitive actions
- [ ] Docs updated if behaviour or contract changed
- [ ] Reviewed by a second developer (exam, payment and access code: mandatory)
