# 18 — Acceptance Criteria (Platform Level)

The PRD §31 MVP criteria made testable. Each developer package also has app-level criteria:

- [developer-1 11](developer-1-student-platform/11-TESTING-AND-ACCEPTANCE.md)
- [developer-2 10](developer-2-admin-platform/10-TESTING-AND-ACCEPTANCE.md)
- [developer-3 10](developer-3-marketing-website/10-TESTING-AND-ACCEPTANCE.md)

The MVP is accepted when **all** of AC-1 … AC-19 pass on staging (and AC-19 on production).

| ID | PRD criterion | Verification (how it is proven) | Tests |
|---|---|---|---|
| AC-1 | Admin can create MHT-CET/JEE examination configurations | Create JEE Main and MHT-CET profiles with sections, marking, types and duration through the admin UI. Build a test from each profile. The test inherits the sections. | J-07, admin E2E A-02 |
| AC-2 | Admin can create a course and full chapter/lesson structure | Course with ≥ 3 chapters, topics, and video/PDF/note lessons, reordered and published. Visible in the student app. | admin A-04 |
| AC-3 | Admin can create a free or paid batch | One ₹0 batch and one paid batch published, with validity | admin A-05 |
| AC-4 | Admin can attach multiple courses to a batch | Batch with 3 courses; a student enrolled in the batch sees all 3. Removing one removes access. | access tests, J-08 |
| AC-5 | Student can enroll in a free batch | Enroll → appears in My Batches → courses accessible. A duplicate enroll is idempotent. | J-02 |
| AC-6 | Student can purchase a paid batch | Cashfree sandbox success → entitlement created only after server verification | J-03 (batch variant) |
| AC-7 | Student can purchase an individual course | Same, course item | J-03 |
| AC-8 | Admin can grant complimentary access | Grant course to a student → visible in My Courses with "Complimentary". Audit entry. | J-08 |
| AC-9 | Admin can restrict access according to policy | Restrict a test for one student who owns the batch → the start is blocked (403 `ACCESS_RESTRICTED`); other students unaffected | J-08, access tests |
| AC-10 | Student can consume lessons and materials | Video plays (YouTube preview and the paid host when D-03 is done), PDF opens via a short-lived URL, completion updates progress | J-02 |
| AC-11 | Admin can create questions and tests | All 5 question types (incl. passage) authored, reviewed, published; test built manually and by rules; preview shows no keys | J-07 |
| AC-12 | Student can attempt a CBT test | Full attempt across all types, palette states, section rules and attempt limits | J-04 |
| AC-13 | Answers survive refresh and network interruption | Refresh, 60 s offline, tab close/reopen and second-tab scenarios → zero lost answers for writes made before the deadline | J-05, LT-6 |
| AC-14 | Server evaluates the final test and stores the result | Golden attempts match hand-computed scores; double-submit produces one result; auto-submit at the deadline with the tab closed | EX-12, EX-15, J-06 |
| AC-15 | Student receives performance analytics | Result, section/subject/chapter/difficulty/time analysis, question grid, solutions per release rules, weak areas, history | J-04 |
| AC-16 | Cashfree payment is verified server-side | Forged webhook rejected; a return-URL visit alone never grants access; replayed webhook → single fulfilment | commerce suite, IC-7 |
| AC-17 | Admin can view students, purchases, attempts and results | Student detail shows all four for a seeded student; filters and search work | admin A-08 |
| AC-18 | Sensitive actions are logged | Each action in the [12 §10](12-SECURITY-AND-PRODUCTION-READINESS.md#10-audit-logging) list creates an audit row with actor, before/after and reason | audit tests |
| AC-19 | Production deployment and load tests done before public scale claims | Production deployed via CI; LT-1…LT-7 reports archived; launch checklist signed | Phase 9 |

## Non-functional acceptance

| ID | Requirement | Target |
|---|---|---|
| NF-1 | Exam sync latency at 2,000 concurrent | p95 < 500 ms, p99 < 1.5 s (LT-3) |
| NF-2 | Evaluation time | 95 % of attempts evaluated < 60 s after submit at normal load; < 10 min after a 2,000-submit spike |
| NF-3 | Marketing Core Web Vitals (mobile, field or lab) | LCP < 2.5 s, INP < 200 ms, CLS < 0.1 |
| NF-4 | Student dashboard load | p95 API < 400 ms; first meaningful content < 2.5 s on 4G |
| NF-5 | Accessibility | WCAG 2.2 AA on audited pages; exam fully keyboard-operable |
| NF-6 | Availability (post-launch) | 99.5 % monthly for API/student *(target, not SLA)* |
| NF-7 | Security | Zero high/critical open findings at launch |
