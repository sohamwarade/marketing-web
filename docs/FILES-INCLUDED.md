# Files Included — Developer 3 — Marketing Website

This folder contains **38 files**. All documentation files are unmodified copies of the finalized Puzzlers documentation v1.3, at their original relative paths so internal links resolve. `START-HERE.md` and this manifest were written for this handoff.

## Start

| File | Why you need it |
|---|---|
| [START-HERE.md](START-HERE.md) | Your role-specific starting guide: responsibilities, boundaries, reading order, first tasks |
| [FILES-INCLUDED.md](FILES-INCLUDED.md) | This manifest |

## Platform documents (root)

| File | Why you need it |
|---|---|
| [00-START-HERE.md](00-START-HERE.md) | Master index of the documentation package; other documents link to it |
| [01-PROJECT-MASTER-DOCUMENT.md](01-PROJECT-MASTER-DOCUMENT.md) | What Puzzlers is, the four deployables, confirmed stack, team division, locked decisions, glossary |
| [02-PRODUCT-OVERVIEW-AND-PRD.md](02-PRODUCT-OVERVIEW-AND-PRD.md) | Product overview: what the platform offers, so marketing copy describes only real features |
| [04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md](04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md) | Fixed stack, approved libraries, engineering rules, mandatory Phase 1 proof of concept |
| [05-SYSTEM-ARCHITECTURE.md](05-SYSTEM-ARCHITECTURE.md) | Where the marketing Worker sits; it calls the one shared Hono API (no backend of your own) |
| [06-MONOREPO-AND-FOLDER-STRUCTURE.md](06-MONOREPO-AND-FOLDER-STRUCTURE.md) | Monorepo layout, import rules, env vars and commands for apps/marketing |
| [07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md](07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md) | Brand palette, typography, buttons, contrast rules, per-app tuning |
| [09-API-CONTRACT-AND-ENDPOINTS.md](09-API-CONTRACT-AND-ENDPOINTS.md) | API conventions (§1) and the public catalogue endpoints (§3) you consume; other sections are context only |
| [12-SECURITY-AND-PRODUCTION-READINESS.md](12-SECURITY-AND-PRODUCTION-READINESS.md) | Security headers/CSP for the apps, no-public-source-maps rule, launch checklist |
| [13-DEPLOYMENT-AND-ENVIRONMENT-SETUP.md](13-DEPLOYMENT-AND-ENVIRONMENT-SETUP.md) | Cloudflare/Neon setup, DNS for puzzlers.in, wrangler, CI/CD, local development |
| [14-TESTING-AND-QUALITY-ASSURANCE.md](14-TESTING-AND-QUALITY-ASSURANCE.md) | Definition of Done, accessibility and catalogue load test LT-C1 |
| [15-TEAM-COORDINATION-AND-INTEGRATION.md](15-TEAM-COORDINATION-AND-INTEGRATION.md) | Final team division (you have no backend ownership), contract-change and review rules |
| [16-IMPLEMENTATION-ROADMAP.md](16-IMPLEMENTATION-ROADMAP.md) | When Dev 2's public catalogue endpoints arrive (Phase 3) and your parallel tasks |
| [17-OPEN-DECISIONS-AND-ASSUMPTIONS.md](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md) | Decided and open owner decisions, source conflicts, assumptions |
| [18-ACCEPTANCE-CRITERIA.md](18-ACCEPTANCE-CRITERIA.md) | Acceptance criteria incl. marketing Core Web Vitals (NF-3) |
| [AGENTS.md](AGENTS.md) | Rules for AI coding agents; copy to the monorepo root |

## Shared references (shared/)

| File | Why you need it |
|---|---|
| [shared/01-SHARED-API-CONTRACT.md](shared/01-SHARED-API-CONTRACT.md) | How to use @puzzlers/api-client and how to request contract changes |
| [shared/03-SHARED-DESIGN-TOKENS.md](shared/03-SHARED-DESIGN-TOKENS.md) | CSS variables, Tailwind theme and TS tokens (exact values) |
| [shared/04-SHARED-COMPONENTS.md](shared/04-SHARED-COMPONENTS.md) | @puzzlers/ui component inventory and rules |
| [shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md](shared/05-SHARED-TYPES-AND-ZOD-SCHEMAS.md) | Zod schemas/types for public catalogue responses; use z.infer types, never hand-write them |
| [shared/06-AUTHENTICATION-INTEGRATION.md](shared/06-AUTHENTICATION-INTEGRATION.md) | Header login state, login/register links to app.puzzlers.in, next-parameter rules |
| [shared/07-GIT-AND-BRANCHING-WORKFLOW.md](shared/07-GIT-AND-BRANCHING-WORKFLOW.md) | Branches, commits, PRs, CODEOWNERS template |
| [shared/08-INTEGRATION-CHECKLIST.md](shared/08-INTEGRATION-CHECKLIST.md) | Cross-app integration checks and phase gates |

## developer-3-marketing-website/

| File | Why you need it |
|---|---|
| [developer-3-marketing-website/00-READ-ME-FIRST.md](developer-3-marketing-website/00-READ-ME-FIRST.md) | Your own developer package (00-READ-ME-FIRST.md) |
| [developer-3-marketing-website/01-DEVELOPER-RESPONSIBILITIES.md](developer-3-marketing-website/01-DEVELOPER-RESPONSIBILITIES.md) | Your own developer package (01-DEVELOPER-RESPONSIBILITIES.md) |
| [developer-3-marketing-website/02-MARKETING-PRODUCT-REQUIREMENTS.md](developer-3-marketing-website/02-MARKETING-PRODUCT-REQUIREMENTS.md) | Your own developer package (02-MARKETING-PRODUCT-REQUIREMENTS.md) |
| [developer-3-marketing-website/03-PAGE-BY-PAGE-SPECIFICATION.md](developer-3-marketing-website/03-PAGE-BY-PAGE-SPECIFICATION.md) | Your own developer package (03-PAGE-BY-PAGE-SPECIFICATION.md) |
| [developer-3-marketing-website/04-HOMEPAGE-SECTION-SPECIFICATION.md](developer-3-marketing-website/04-HOMEPAGE-SECTION-SPECIFICATION.md) | Your own developer package (04-HOMEPAGE-SECTION-SPECIFICATION.md) |
| [developer-3-marketing-website/05-CONTENT-AND-COPYWRITING-GUIDELINES.md](developer-3-marketing-website/05-CONTENT-AND-COPYWRITING-GUIDELINES.md) | Your own developer package (05-CONTENT-AND-COPYWRITING-GUIDELINES.md) |
| [developer-3-marketing-website/06-UI-UX-AND-BRAND-GUIDELINES.md](developer-3-marketing-website/06-UI-UX-AND-BRAND-GUIDELINES.md) | Your own developer package (06-UI-UX-AND-BRAND-GUIDELINES.md) |
| [developer-3-marketing-website/07-FRONTEND-ARCHITECTURE.md](developer-3-marketing-website/07-FRONTEND-ARCHITECTURE.md) | Your own developer package (07-FRONTEND-ARCHITECTURE.md) |
| [developer-3-marketing-website/08-SEO-AND-PERFORMANCE.md](developer-3-marketing-website/08-SEO-AND-PERFORMANCE.md) | Your own developer package (08-SEO-AND-PERFORMANCE.md) |
| [developer-3-marketing-website/09-API-INTEGRATION.md](developer-3-marketing-website/09-API-INTEGRATION.md) | Your own developer package (09-API-INTEGRATION.md) |
| [developer-3-marketing-website/10-TESTING-AND-ACCEPTANCE.md](developer-3-marketing-website/10-TESTING-AND-ACCEPTANCE.md) | Your own developer package (10-TESTING-AND-ACCEPTANCE.md) |
| [developer-3-marketing-website/11-DEVELOPER-IMPLEMENTATION-ROADMAP.md](developer-3-marketing-website/11-DEVELOPER-IMPLEMENTATION-ROADMAP.md) | Your own developer package (11-DEVELOPER-IMPLEMENTATION-ROADMAP.md) |
| [developer-3-marketing-website/CLAUDE.md](developer-3-marketing-website/CLAUDE.md) | Your own developer package (CLAUDE.md) |

## Documents intentionally not included

Some included documents mention the files below. They are **not** in this folder on purpose; those links will not open here. Ask the named developer if you need something from them.

| Referenced document | Referenced from | Why it is not included |
|---|---|---|
| `03-QUIZRR-RESEARCH-AND-FINDINGS.md` | `00-START-HERE.md`, `17-OPEN-DECISIONS-AND-ASSUMPTIONS.md` | Competitor research for exam behaviour; marketing must not reuse competitor content |
| `08-DATABASE-SCHEMA-AND-ER-DIAGRAM.md` | `00-START-HERE.md`, `01-PROJECT-MASTER-DOCUMENT.md`, `09-API-CONTRACT-AND-ENDPOINTS.md` … | Database internals; marketing has no database access |
| `10-AUTHENTICATION-AND-AUTHORIZATION.md` | `00-START-HERE.md`, `01-PROJECT-MASTER-DOCUMENT.md`, `02-PRODUCT-OVERVIEW-AND-PRD.md` … | Server-side auth/RBAC internals; the parts marketing needs are in shared/06 |
| `11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md` | `00-START-HERE.md`, `01-PROJECT-MASTER-DOCUMENT.md`, `02-PRODUCT-OVERVIEW-AND-PRD.md` … | Exam engine internals (Developer 1) |
| `developer-1-student-platform/00-READ-ME-FIRST.md` | `00-START-HERE.md`, `01-PROJECT-MASTER-DOCUMENT.md` | Developer 1's internal package; ask Developer 1 |
| `developer-1-student-platform/04-USER-FLOWS.md` | `02-PRODUCT-OVERVIEW-AND-PRD.md` | Developer 1's internal package; ask Developer 1 |
| `developer-1-student-platform/06-FRONTEND-ARCHITECTURE.md` | `06-MONOREPO-AND-FOLDER-STRUCTURE.md` | Developer 1's internal package; ask Developer 1 |
| `developer-1-student-platform/11-TESTING-AND-ACCEPTANCE.md` | `18-ACCEPTANCE-CRITERIA.md` | Developer 1's internal package; ask Developer 1 |
| `developer-2-admin-platform/00-READ-ME-FIRST.md` | `00-START-HERE.md`, `01-PROJECT-MASTER-DOCUMENT.md` | Developer 2's internal package; ask Developer 2 |
| `developer-2-admin-platform/02-ADMIN-PRODUCT-REQUIREMENTS.md` | `02-PRODUCT-OVERVIEW-AND-PRD.md` | Developer 2's internal package; ask Developer 2 |
| `developer-2-admin-platform/04-ADMIN-USER-FLOWS.md` | `02-PRODUCT-OVERVIEW-AND-PRD.md` | Developer 2's internal package; ask Developer 2 |
| `developer-2-admin-platform/06-ROLE-AND-PERMISSION-MATRIX.md` | `02-PRODUCT-OVERVIEW-AND-PRD.md`, `14-TESTING-AND-QUALITY-ASSURANCE.md` | Developer 2's internal package; ask Developer 2 |
| `developer-2-admin-platform/07-FRONTEND-ARCHITECTURE.md` | `06-MONOREPO-AND-FOLDER-STRUCTURE.md` | Developer 2's internal package; ask Developer 2 |
| `developer-2-admin-platform/09-FORMS-TABLES-AND-BULK-ACTIONS.md` | `09-API-CONTRACT-AND-ENDPOINTS.md` | Developer 2's internal package; ask Developer 2 |
| `developer-2-admin-platform/10-TESTING-AND-ACCEPTANCE.md` | `18-ACCEPTANCE-CRITERIA.md` | Developer 2's internal package; ask Developer 2 |
| `shared/02-SHARED-DATABASE-RULES.md` | `00-START-HERE.md`, `04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md` | Database rules; marketing has no database access |
