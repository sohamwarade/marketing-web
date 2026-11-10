# Developer 3 — Public Marketing Website

**Application:** `apps/marketing`, deployed at `puzzlers.in` (apex; `www.puzzlers.in` 301-redirects to it). Domain confirmed.
**You own (final):** the complete public website that explains Puzzlers, showcases courses, batches and test series from live catalogue data, ranks well in search, and converts visitors into registered students. You also lead `@puzzlers/design-tokens` and `@puzzlers/ui` quality (Phase 1 and ongoing). You own **public catalogue integration**: you consume `/v1/public/*`, which Developer 2 builds. **You do not own the main backend** (see [01](01-DEVELOPER-RESPONSIBILITIES.md)).

## Read in this order

1. [../00-START-HERE.md](../00-START-HERE.md), [../01-PROJECT-MASTER-DOCUMENT.md](../01-PROJECT-MASTER-DOCUMENT.md), [../02-PRODUCT-OVERVIEW-AND-PRD.md](../02-PRODUCT-OVERVIEW-AND-PRD.md)
2. [../07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md](../07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md), [../shared/03-SHARED-DESIGN-TOKENS.md](../shared/03-SHARED-DESIGN-TOKENS.md), [../shared/04-SHARED-COMPONENTS.md](../shared/04-SHARED-COMPONENTS.md)
3. [../04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md](../04-TECHNOLOGY-STACK-AND-ENGINEERING-RULES.md)
4. [../09-API-CONTRACT-AND-ENDPOINTS.md](../09-API-CONTRACT-AND-ENDPOINTS.md) §1, §3
5. This package, files 01–11

## Package contents

| File | Content |
|---|---|
| [01-DEVELOPER-RESPONSIBILITIES.md](01-DEVELOPER-RESPONSIBILITIES.md) | Scope and boundaries |
| [02-MARKETING-PRODUCT-REQUIREMENTS.md](02-MARKETING-PRODUCT-REQUIREMENTS.md) | Requirements |
| [03-PAGE-BY-PAGE-SPECIFICATION.md](03-PAGE-BY-PAGE-SPECIFICATION.md) | All 19 pages + system routes |
| [04-HOMEPAGE-SECTION-SPECIFICATION.md](04-HOMEPAGE-SECTION-SPECIFICATION.md) | Homepage, section by section |
| [05-CONTENT-AND-COPYWRITING-GUIDELINES.md](05-CONTENT-AND-COPYWRITING-GUIDELINES.md) | Voice, claims policy, testimonials |
| [06-UI-UX-AND-BRAND-GUIDELINES.md](06-UI-UX-AND-BRAND-GUIDELINES.md) | Marketing-specific design |
| [07-FRONTEND-ARCHITECTURE.md](07-FRONTEND-ARCHITECTURE.md) | Structure, rendering, caching |
| [08-SEO-AND-PERFORMANCE.md](08-SEO-AND-PERFORMANCE.md) | Metadata, sitemap, schema.org, CWV |
| [09-API-INTEGRATION.md](09-API-INTEGRATION.md) | Public endpoints usage |
| [10-TESTING-AND-ACCEPTANCE.md](10-TESTING-AND-ACCEPTANCE.md) | Tests and done criteria |
| [11-DEVELOPER-IMPLEMENTATION-ROADMAP.md](11-DEVELOPER-IMPLEMENTATION-ROADMAP.md) | Tasks by phase |
| [CLAUDE.md](CLAUDE.md) | AI agent instructions for `apps/marketing` |

## Rules you must never break

1. **No fake testimonials, rankings, results, student counts or success claims.** A section without real, consented content is hidden.
2. No capacity claims ("10,000 students at once") without a passing load-test report.
3. Prices and catalogue data come from the API, never hard-coded.
4. Login and registration happen in the student app. The marketing site only links there with the right `exam` and `next` parameters.
5. Do not copy any competitor's copy, imagery, layout or branding (including Quizrr's).
