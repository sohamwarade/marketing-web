# 00 — Start Here: Puzzlers Documentation Index

**Puzzlers** is an MHT-CET + JEE learning management and online examination platform. This folder is the complete technical documentation package for building it with **three developers** working in parallel on **one architecture, one fixed stack, one backend contract, one database design and one brand**.

- **Version 1.3**, 2026-11-06: final three-developer division (each developer owns one complete application; backend shared by module between Dev 1 and Dev 2), plus the confirmed backend stack, domains, Cashfree and email approach (decision log in [17 §4](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md#4-decision-log))
- Built from: `Platform PRD.docx` (primary product source), `project_tech_stack_medium.docx` (authoritative stack), the Quizrr research reports 01–13 + investigation log (behaviour research only), and the documentation brief.
- Nothing in this package is code. It is the plan the code must follow.

## 1. Everyone must read (in order)

| # | Document | Why |
|---|---|---|
| 1 | [01-PROJECT-MASTER-DOCUMENT.md](01-PROJECT-MASTER-DOCUMENT.md) | What Puzzlers is; apps; locked decisions; glossary |
| 2 | [17-OPEN-DECISIONS-AND-ASSUMPTIONS.md](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md) | What is **not** decided yet (domain, backend ownership, …) and the source conflicts |
| 3 | [04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md](04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md) | Fixed stack, rules, mandatory PoC |
| 4 | [05-SYSTEM-ARCHITECTURE.md](05-SYSTEM-ARCHITECTURE.md) | How the pieces connect |
| 5 | [06-MONOREPO-AND-FOLDER-STRUCTURE.md](06-MONOREPO-AND-FOLDER-STRUCTURE.md) | Repo layout, packages, env vars, commands, migrations |
| 6 | [15-TEAM-COORDINATION-AND-INTEGRATION.md](15-TEAM-COORDINATION-AND-INTEGRATION.md) | Ownership (Dev 1 exam backend, Dev 2 admin backend + steward, Dev 3 public catalogue), review and integration rules |
| 7 | [16-IMPLEMENTATION-ROADMAP.md](16-IMPLEMENTATION-ROADMAP.md) | Nine phases with dependencies and checkpoints |
| 8 | [AGENTS.md](AGENTS.md) | Rules for AI coding agents (copy to the repo root) |

## 2. Shared reference documents

| Document | Content |
|---|---|
| [02-PRODUCT-OVERVIEW-AND-PRD.md](02-PRODUCT-OVERVIEW-AND-PRD.md) | Consolidated product requirements |
| [03-QUIZRR-RESEARCH-AND-FINDINGS.md](03-QUIZRR-RESEARCH-AND-FINDINGS.md) | Research → requirements mapping (Verified / Inferred / Unknown / Puzzlers decision) |
| [07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md](07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md) | Brand palette and usage rules |
| [08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md](08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md) | All tables, ER diagram, transactions, retention, seeds |
| [09-API-CONTRACT-AND-ENDPOINTS.md](09-API-CONTRACT-AND-ENDPOINTS.md) | The single API contract (conventions + every endpoint group) |
| [10-AUTHENTICATION-AND-AUTHORIZATION.md](10-AUTHENTICATION-AND-AUTHORIZATION.md) | Better Auth, cross-subdomain sessions, RBAC, entitlement resolution |
| [11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md) | **The critical subsystem**: timer, autosave, recovery, submission, scoring, load model |
| [12-SECURITY-AND-PRODUCTION-READINESS.md](12-SECURITY-AND-PRODUCTION-READINESS.md) | Security controls + launch checklist |
| [13-DEPLOYMENT-AND-ENVIRONMENT-SETUP.md](13-DEPLOYMENT-AND-ENVIRONMENT-SETUP.md) | Cloudflare/Neon setup, wrangler, CI/CD, local dev |
| [14-TESTING-AND-QUALITY-ASSURANCE.md](14-TESTING-AND-QUALITY-ASSURANCE.md) | Test strategy, mandatory suites, load tests, Definition of Done |
| [18-ACCEPTANCE-CRITERIA.md](18-ACCEPTANCE-CRITERIA.md) | Platform-level MVP acceptance (AC-1…AC-19) |
| [shared/01-SHARED-API-CONTRACT.md](shared/01-SHARED-API-CONTRACT.md) | How to use and change the contract |
| [shared/02-SHARED-DATABASE-RULES.md](shared/02-SHARED-DATABASE-RULES.md) | DB conventions and rules |
| [shared/03-SHARED-DESIGN-TOKENS.md](shared/03-SHARED-DESIGN-TOKENS.md) | CSS variables, Tailwind theme, TS tokens |
| [shared/04-SHARED-COMPONENTS.md](shared/04-SHARED-COMPONENTS.md) | `@puzzlers/ui` inventory |
| [shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md](shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md) | Canonical Zod schemas |
| [shared/06-AUTHENTICATION-INTEGRATION.md](shared/06-AUTHENTICATION-INTEGRATION.md) | Auth in the apps (middleware, guards, links) |
| [shared/07-GIT-AND-BRANCHING-WORKFLOW.md](shared/07-GIT-AND-BRANCHING-WORKFLOW.md) | Branches, commits, PRs, CODEOWNERS |
| [shared/08-INTEGRATION-CHECKLIST.md](shared/08-INTEGRATION-CHECKLIST.md) | Cross-app integration checks and phase gates |

## 3. Developer 1 — Complete student application + examination backend modules (`app.puzzlers.in`)

Start: [developer-1-student-platform/00-READ-ME-FIRST.md](developer-1-student-platform/00-READ-ME-FIRST.md)

Must read from the shared set: **11** (exam engine), 09 (§2–4, §9–10, §15–21, §27), 10, 08 (attempt tables), 15, 07, 03, 14 §3.

## 4. Developer 2 — Complete admin application + backend foundation + administrative modules (`admin.puzzlers.in`)

Start: [developer-2-admin-platform/00-READ-ME-FIRST.md](developer-2-admin-platform/00-READ-ME-FIRST.md)

Must read from the shared set: 05, 06, 08 (database), 09 (all; you coordinate the contract), 10, 11 (§1, §13–21 and the server sections you review), 12, 13, 15, 07.

## 5. Developer 3 — Complete public marketing website (`puzzlers.in`, no backend ownership)

Start: [developer-3-marketing-website/00-READ-ME-FIRST.md](developer-3-marketing-website/00-READ-ME-FIRST.md)

Must read from the shared set: 07, shared/03, shared/04, 09 (§1, §3), 04.

## 6. Decisions

**Confirmed by the owner (2026-11-06):** backend = Hono on Cloudflare Workers (single API in `apps/api`); Neon + Drizzle via Hyperdrive; R2; Queues; Better Auth; Zod; **Cashfree**; Sentry. Domains `puzzlers.in` / `app.puzzlers.in` / `admin.puzzlers.in`. Team (final): **Dev 1** owns the complete student test application (`app.puzzlers.in`) and all examination-related backend modules; **Dev 2** owns the complete admin application (`admin.puzzlers.in`), the backend foundation and administrative modules (auth, RBAC, DB foundation, courses, batches, question bank, test builder, entitlements, Cashfree, email), and coordinates contracts and integration; **Dev 3** owns the complete public website (`puzzlers.in`) and consumes the public catalogue APIs, with no backend ownership. Inbound email via Cloudflare Email Routing.

**Still needing project-owner approval** (most important ones; full register in [17](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md)):

| ID | Decision | Blocks |
|---|---|---|
| D-02b | Backup steward and exam-day on-call rota (recommended: Dev 1) | Phase 2 |
| D-03 | Paid video hosting provider | Paid lectures |
| D-04 | Free-trial count and eligibility | Trial logic |
| D-05 | Coupon and refund policy | Phase 7 |
| D-06 | Transactional email sender: Cloudflare Email Routing is decided for **inbound** only; Cloudflare Email Sending to be investigated | Production verification/reset email, notifications |
| D-07 | Exact exam configurations | Real tests |
| D-09 | Login methods | Auth UI |
| D-14 | Staff 2FA / session isolation | Launch |
| D-16 | Logo, fonts, functional status colours | Final UI |
| D-18 | Privacy, DPDP, minors' consent, retention | Launch |

## 7. Package map

```
puzzlers-documentation/
├── 00-START-HERE.md  ← you are here
├── 01 … 18 (shared platform documents)
├── AGENTS.md
├── developer-1-student-platform/   (00–12 + CLAUDE.md)
├── developer-2-admin-platform/     (00–11 + CLAUDE.md)
├── developer-3-marketing-website/  (00–11 + CLAUDE.md)
├── shared/                         (01–08)
└── VALIDATION-REPORT.md            (results of the final consistency checks)
```

## 8. Conventions used in these documents

- Production hostnames are confirmed: `puzzlers.in` (marketing), `app.puzzlers.in` (student), `admin.puzzlers.in` (admin), and the derived `api.puzzlers.in` / `assets.puzzlers.in`. Staging hostnames under `staging.puzzlers.in` are a recommendation (D-22).
- *[Rec]* = a recommendation made by this documentation (reversible).
- **PD-xx** = a Puzzlers design decision taken here ([01 §6](01-PROJECT-MASTER-DOCUMENT.md#6-puzzlers-design-decisions-taken-in-this-document-set)).
- **D-xx** = an owner decision (decided or open; status in 17). **C-xx** = a conflict between source documents. **A-xx** = an assumption.
- Research labels: Verified (runtime) / Verified (static) / Inferred / Unknown / Puzzlers decision.
