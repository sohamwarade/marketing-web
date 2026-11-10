# 17 — Open Decisions, Conflicts and Assumptions

This is the register of source conflicts, owner decisions (decided and open) and assumptions. Rows with status **Open** are not final and must not be silently resolved in code. When the owner decides, update the row (status, date, decision) and the affected documents in the same PR.

## 1. Conflicts between source documents

| ID | Conflict | Sources | Impact | Recommended resolution | Status |
|---|---|---|---|---|---|
| C-01 | **Payment gateway:** the stack document said **Razorpay**; the PRD (§21, §26) and the brief said **Cashfree** | stack doc §5 vs PRD + brief | High | **Cashfree** | **Resolved 2026-11-06:** owner confirmed Cashfree. The stack document is obsolete on this point. |
| C-02 | **AI IDE:** the stack doc lists **Cursor**; the brief lists **Antigravity** | stack doc §7 vs brief | Low | Both are allowed. `AGENTS.md` + `CLAUDE.md` work with either. | Owner to confirm |
| C-03 | **Domain spelling and names:** the earlier brief mixed `puzzlers.in` and `puzlers.in`; the PRD used `example.com` placeholders and `learn.` for the student app | PRD §5 vs brief | High (cookies, SEO) | One registrable domain | **Resolved 2026-11-06:** `puzzlers.in`, `app.puzzlers.in`, `admin.puzzlers.in` (D-01). `learn.` and `puzlers` are obsolete. |
| C-04 | **Marketing website** is not in the PRD's application list (PRD §5 lists student, admin, API) but is a full workstream in the brief | PRD §5 vs brief | Medium: scope, staffing | Include it (brief). Amend the PRD. | Owner to confirm |
| C-05 | **Phase plan:** the PRD has 8 phases; the brief has 9 | PRD §32 vs brief | Low | Use the brief's 9 phases (a refinement that splits foundation from auth). Mapping in [16](16-IMPLEMENTATION-ROADMAP.md). | Adopted |
| C-06 | **Research stack recommendations** (NestJS/Fastify/Go, Redis, BullMQ, Terraform, S3, JWT, Vite/Astro, separate exam host) conflict with the fixed stack | reports 08, 12 vs stack doc | Medium if followed by mistake | The fixed stack wins. Mapping in [03 §6](03-QUIZRR-RESEARCH-AND-FINDINGS.md#6-research-stack-recommendations--fixed-stack-equivalents). | Adopted |
| C-07 | **Time-over behaviour:** Quizrr waits for an Exit click; the PRD requires auto-submit | report 10 vs PRD §15 | High | PRD: server auto-submit (PD-03) | Adopted |
| C-08 | **Branding:** the PRD lists final branding as open; the brief supplies a palette extracted from the Aaditya COEP website | PRD §34 vs brief | Medium | Adopt the palette as working brand. Confirm ownership/rights and the final logo/fonts. | **D-16** |
| C-09 | **Suspend/resume:** Quizrr supports student-initiated suspension; the PRD is silent | report 10 vs PRD | Medium (fairness, timer rules) | No pause for timed tests in MVP (PD-10) | **D-10** |
| C-10 | **Enrollments vs Entitlements** both listed as PRD entities | PRD §25 | Medium (duplicate entities) | One `entitlements` table (PD-05) | Adopted (reversible) |
| C-11 | **Products** entity in PRD §25 | PRD §25 | Low | No products table; batches and courses carry prices; `order_items` snapshot | Adopted (reversible) |
| C-12 | **Two hierarchies** (PRD §6 vs §7) | PRD | Low | Two views of one model ([02 §4](02-PRODUCT-OVERVIEW-AND-PRD.md#4-hierarchies-prd-6-7)) | Adopted |
| C-13 | **Research team/estimate assumptions** (2 full-stack + 1 frontend + content; ~27 weeks) vs the actual 3-developer team | report 12 vs brief | Low | Ignore the research estimates; use dependency milestones | Adopted |
| C-14 | **Monitoring:** research suggests OpenTelemetry; the stack has Sentry | report 12 vs stack | Low | Sentry + Cloudflare Workers Logs | Adopted |
| C-15 | **Red usage:** the brand rule reserves red for errors/warnings/destructive actions; NTA convention uses red for "not answered" | brief §5 vs research R-12 | Low | "Not answered" is treated as a warning state; shapes duplicate the meaning | Adopted (D-16 confirms) |

## 2. Owner decisions (decided and open)

| ID | Decision | Blocks | Recommendation | Status |
|---|---|---|---|---|
| D-01 | Root domain and hostnames | Auth, DNS, SEO | — | **Decided 2026-11-06:** marketing `puzzlers.in`, student `app.puzzlers.in`, admin `admin.puzzlers.in`. Derived: API `api.puzzlers.in`, public files `assets.puzzlers.in`, `www.puzzlers.in` → apex 301. |
| D-02 | Team division and backend ownership | Phase 2 onward | — | **Decided (final) 2026-11-06:** Dev 1 owns the complete student test application + all examination-related backend modules; Dev 2 owns the complete admin application + the Hono backend foundation + administrative modules (auth, RBAC, DB foundation/migrations, courses, batches, question bank, test builder, entitlements, Cashfree, email, admin ops) and coordinates contracts/integration; Dev 3 owns the complete public website and consumes public APIs (no backend). One backend (`apps/api`), one database. See [15 §1](15-TEAM-COORDINATION-AND-INTEGRATION.md#1-team-division-and-backend-ownership-final-d-02-decided). |
| D-02b | Backup steward and exam-day on-call | Phase 2 | Dev 1 as backup steward and exam on-call primary; Dev 2 for platform/payments incidents | Open |
| D-03 | Paid video hosting provider for restricted lectures | Paid video lessons | Choose a provider with signed/tokenised playback, DRM optional, India CDN performance and per-minute pricing. Candidates to evaluate: Cloudflare Stream (same vendor; needs approval as an addition), Bunny Stream, Mux, VdoCipher. | Open |
| D-04 | Free trial: number of tests (1 or 2), eligibility (verified email/phone?), which tests | Trial logic config | Default 2, require a verified email before a trial start | Open |
| D-05 | Coupon policy and refund policy (window, partial refunds, entitlement on refund) | Phase 7 | Refund within 7 days if < 20 % consumed *(placeholder)* | Open |
| D-06 | Transactional email sender (verification, password reset, OTP, receipts, notifications) | Production auth email, notifications | **Inbound decided:** Cloudflare Email Routing for incoming mail and forwarding. **Sending open:** investigate Cloudflare Email Sending separately (availability, sending limits, deliverability to Gmail/Outlook, Workers API, pricing). Email Routing must **not** be assumed to send OTPs or password-reset mail: its Worker sending only reaches verified destination addresses. A provider-neutral `mailer` interface keeps the choice reversible. | Open (inbound part decided) |
| D-07 | Exact MHT-CET / JEE Main / JEE Advanced exam configurations (sections, marks, question types, durations) | Real tests | Admin enters them from official notices; owner verifies | Open |
| D-08 | Final load-test targets, exam-day operations checklist, deploy freeze policy | Phase 9 | LT-3 as the gate; 24 h freeze | Open |
| D-09 | Login methods: email+password only, Google sign-in, phone OTP | Auth UI | MVP: email+password; add Google later; phone OTP needs an SMS provider | Open |
| D-10 | Pause/suspend policy for timed tests | Exam engine | No pause (PD-10); practice is untimed | Open (default applied) |
| D-11 | Palette policy defaults: `keep_mark_on_save` (default false), `count_answered_marked` (default true) | Exam engine | NTA convention defaults | Open (default applied) |
| D-12 | Percentile prediction data source (if "estimated percentile" means prediction vs real exam) | Analytics | MVP: percentile among Puzzlers test takers only, labelled clearly. Prediction only from licensed/public data later. | Open |
| D-13 | Leaderboard privacy default (opt-in vs opt-out; names vs initials) | Leaderboard | Show first name + last initial; opt-out available; minors' privacy considered | Open |
| D-14 | Staff session isolation and 2FA | Admin security | Shared session for MVP; 2FA mandatory for staff before launch | Open |
| D-15 | Student support/helpdesk process | Launch | Email + in-app contact form for MVP | Open |
| D-16 | Brand assets: logo, wordmark, fonts, palette rights, functional colours | Design | Inter + Plus Jakarta Sans; functional green/purple as in [07](07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md) | Open |
| D-17 | GST and invoicing for purchases | Phase 7 | Generate invoices (PDF to R2) with GSTIN if registered; accountant to confirm | Open |
| D-18 | Data retention, DPDP compliance (incl. minors' parental consent), deletion process | Launch | Legal review; retention table in [08 §14](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md#14-data-retention-rec-d-18) | Open |
| D-19 | Integrity signals: which deterrents are used, any penalties | Exam | Log only, no penalties | Open (default applied) |
| D-20 | Bulk question import format (CSV/XLSX/DOCX) | Phase 4 | CSV/XLSX template + JSON; DOCX later | Open |
| D-21 | Testimonials and results content: sources, consent forms | Marketing | Hide the sections until real consented content exists | Open |
| D-22 | Staging domain (subdomain vs separate domain) and environment budget | Phase 1 | Separate registrable domain for staging if affordable | Open |
| D-23 | PWA/installability for the student app | Post-MVP | Defer | Open |

## 3. Assumptions made in this documentation

| ID | Assumption | If wrong |
|---|---|---|
| A-01 | All users are in India; IST display; INR only | Add currency/timezone handling |
| A-02 | Students use the web on mobile and desktop; no native app in MVP | — |
| A-03 | Content is original or licensed; no third-party question banks without a licence | Legal risk |
| A-04 | Cloudflare Workers paid plan is acceptable (bundle size, CPU limits, Queues) | Re-plan the PoC |
| A-05 | Neon paid plan with enough compute for 2,000 concurrent exam writers | Load tests decide the size |
| A-06 | A single scheduled mock with 2,000 simultaneous takers is the peak scenario | Re-model if several exams overlap |
| A-07 | English-only UI in MVP | i18n later (copy kept in message files *[Rec]*) |
| A-08 | Faculty never handle payments or student PII beyond assigned scopes | Adjust the permission matrix |
| A-09 | Ranks use first attempts only | Product decision |
| A-10 | Cashfree's REST API can be called from Workers with `fetch` | PoC in Phase 7 |
| A-11 | OpenNext supports the Next.js version chosen in Phase 1 | Pin the versions the PoC proves |

## 4. Decision log

| Date | ID | Decision | By |
|---|---|---|---|
| 2026-11-06 | — | Documentation baseline created; all items above open unless marked Adopted | Documentation |
| 2026-11-06 | Backend stack | **Confirmed:** Hono (framework) on Cloudflare Workers (runtime/hosting), Neon + Drizzle via Hyperdrive, R2, Queues, Better Auth, Zod, Cashfree, Sentry. Not chosen: Node.js + Express, NestJS, a Node.js server on a VPS, Next.js API routes as main backend, multiple backend services. One API app in `apps/api`. | Owner |
| 2026-11-06 | C-01 | Cashfree confirmed | Owner |
| 2026-11-06 | D-01 / C-03 | Domains `puzzlers.in`, `app.puzzlers.in`, `admin.puzzlers.in` | Owner |
| 2026-11-06 | D-02 | Final three-developer division: Dev 1 complete student application + examination backend modules; Dev 2 complete admin application + backend foundation + administrative modules (incl. public catalogue endpoints) + contract/integration coordination; Dev 3 complete marketing website, no backend ownership | Owner |
| 2026-11-06 | D-06 (partial) | Cloudflare Email Routing for inbound; Cloudflare Email Sending to be investigated for transactional mail | Owner |
