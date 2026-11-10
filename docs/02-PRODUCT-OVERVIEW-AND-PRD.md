# 02 — Product Overview and PRD (Consolidated)

This document restates the Puzzlers PRD (v1.0, 02 Nov 2026) in an implementation-oriented form and adds the scope the brief introduced (the marketing site and the detailed developer modules). **The PRD is the primary product source.** Anything here that is not in the PRD is labelled *[Brief]* (from the documentation brief) or *[Rec]* (a recommendation from this documentation).

## 1. Goals (PRD §2)

1. A complete learning + practice + mock-test experience in one student platform.
2. The business team runs routine content and access changes without developers.
3. Both batch-based and individual-course purchases.
4. Free batches/courses and limited free trial tests.
5. A structured CBT test experience with detailed performance analysis (Quizrr-style behaviour, independently built).
6. MHT-CET and JEE from one architecture.
7. ~2,000 simultaneous test takers initially; a path to 10,000 after load testing.
8. Startup-budget infrastructure that does not block future scale.

## 2. Non-goals for the initial release (PRD §3)

- A marketplace for third-party educators.
- Live classroom / video conferencing.
- A native mobile app (the web platform must be responsive; a PWA is optional later *[Rec]*).
- Microservices or Kubernetes.
- Guaranteeing 10,000 concurrent test takers before load testing.

## 3. Users and roles (PRD §4)

| Role | Responsibilities | App |
|---|---|---|
| Visitor | Browses the catalogue, registers | Marketing |
| Student | Enroll/purchase, learn, practice, attempt tests, review results, manage profile | Student |
| Faculty | Create/review **assigned** course content and questions; view permitted student/test data | Admin |
| Admin | Manage courses, batches, questions, tests, students, payments and access | Admin |
| Super Admin | Everything, plus roles/permissions, settings, audit and sensitive operations | Admin |

Detailed permission matrix: [developer-2-admin-platform/06-ROLE-AND-PERMISSION-MATRIX.md](developer-2-admin-platform/06-ROLE-AND-PERMISSION-MATRIX.md).

## 4. Hierarchies (PRD §6, §7)

The PRD defines two hierarchies. They are two views of one data model, not a conflict:

```
Syllabus view (PRD §6):  Examination → Exam Profile → Subject → Section/Chapter → Topic → Content
Business view (PRD §7):  Examination → Batch → Course → Subject → Chapter → Topic → Lesson → Practice/Test
```

- **Syllabus** entities (`subjects`, `chapters`, `topics`) are a shared taxonomy used to tag questions, course chapters and tests.
- **Business** entities (`batches`, `courses`, `course_chapters`, `lessons`) organise what students buy and consume. Course chapters *reference* syllabus chapters for tagging and analytics.
- A course is reusable: the same course can belong to many batches without copying content (`batch_courses` join).

## 5. Module requirements

Each module below lists the PRD requirement and the owning application. The detailed behaviour is in the developer packages.

### 5.1 Student platform (PRD §8) — Developer 1

| Module | Requirements |
|---|---|
| Auth & profile | Register, login, logout, forgot password, sessions, exam preference, account info, security/session controls |
| Dashboard | Active batches and courses, continue learning, upcoming/recent tests, recent results, performance summary, announcements |
| My Batches | Free and paid enrollments, validity, included courses, batch tests |
| My Courses | Progress, subject/chapter navigation, locked/unlocked content, lesson completion |
| Learning | Video player, PDF/notes viewer, resources, previous/next, completion tracking |
| Practice | Topic/chapter practice, difficulty filters, solutions, bookmarks, mistake review |
| Tests | Chapter, part-syllabus, full mock, PYQ, scheduled tests, attempt history |
| CBT engine | See §6 |
| Performance | Marks, accuracy, subject/chapter analysis, time analysis, correct/incorrect/unattempted, weak areas, historical comparison, estimated percentile/rank where supported |
| Other *[Brief]* | Leaderboard, My Mistakes, notebooks, bookmarks, notifications, purchase history, settings |

### 5.2 Admin platform (PRD §9–§22) — Developer 2

Dashboard; examination management; batch management; course management; content management; question bank; test builder; student management; faculty management; access management; orders & payments; coupons; analytics & reports; notifications; settings; roles & permissions; audit logs. Details: [developer-2-admin-platform/02-ADMIN-PRODUCT-REQUIREMENTS.md](developer-2-admin-platform/02-ADMIN-PRODUCT-REQUIREMENTS.md).

### 5.3 Marketing website *[Brief]* — Developer 3

19 public pages including exam landing pages, catalogue (courses, batches, test series), pricing, features, FAQs, legal pages, and login/registration entry points. The PRD does not list this application (conflict **C-04**). Details: [developer-3-marketing-website/02-MARKETING-PRODUCT-REQUIREMENTS.md](developer-3-marketing-website/02-MARKETING-PRODUCT-REQUIREMENTS.md).

## 6. CBT / online test engine (PRD §15)

The PRD requires: a server-authoritative timer, a question palette, next/previous navigation, save response, clear response, mark for review, section navigation where configured, automatic answer saving, network recovery, auto-submit on timeout, final confirmation and server-side submission. Answers must be saved reliably to PostgreSQL, and submission must be idempotent.

The brief adds the question types (single correct, multiple correct, numerical, fill in the blanks, passage-linked), the 5 palette states, and configuration of duration, sections, marks, negative marking, attempt limits, reattempt policy, schedule, section timing, navigation rules and result release.

Full specification: [11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md](11-EXAMINATION-ENGINE-TECHNICAL-SPECIFICATION.md).

## 7. Access model — both_override (PRD §11)

| Source | Example | Result |
|---|---|---|
| Free batch | ₹0 batch | Student enrolls without payment |
| Paid batch | ₹2,999 batch | Configured batch/course access after verified payment |
| Free course | ₹0 course | Student enrolls directly |
| Paid course | ₹999 course | Access after verified payment |
| Admin grant | Complimentary course | That student gets access without purchase |
| Admin restriction | Lock Test 12 | That access is blocked for that student |

The backend decides access. Frontend lock icons are UI only. The resolution algorithm is in [10-AUTHENTICATION-AND-AUTHORIZATION.md §6](10-AUTHENTICATION-AND-AUTHORIZATION.md#6-entitlement-resolution-both_override).

## 8. Free trial (PRD §12)

- New eligible students may attempt the first 1–2 designated tests for free. The exact number is **D-04**; the setting `trial.max_tests` defaults to `2`.
- Trial usage is tracked per account, not per batch.
- Trial eligibility is independent of paid ownership.
- Admin marks which tests are trial-eligible (`tests.is_trial_eligible`).
- Trial consumption happens **on the server** when an attempt is created, inside the same transaction, so the frontend cannot bypass it.

## 9. Payments (PRD §21)

Cashfree checkout, server-side verification, webhook processing, order records, successful/failed/pending states, refunds, coupons/discounts, and automatic entitlement activation after verified payment. Flow: [09-API-CONTRACT-AND-ENDPOINTS.md §21](09-API-CONTRACT-AND-ENDPOINTS.md#21-orders-and-payments) and [12-SECURITY-AND-PRODUCTION-READINESS.md §5](12-SECURITY-AND-PRODUCTION-READINESS.md#5-payments).

## 10. Notifications (PRD §22)

New batch announcement, test scheduled, test reminder, result published, course/content announcement, payment confirmation, admin broadcast. MVP channel: **in-app** notifications. Incoming mail to `@puzzlers.in` addresses uses **Cloudflare Email Routing** (receive and forward only). Outgoing transactional email (verification, password reset, OTP, receipts) needs a sender. **Cloudflare Email Sending is being investigated (D-06).** Email Routing must not be assumed to send OTPs or reset emails. SMS/WhatsApp stay optional (D-06).

## 11. Content and video (PRD §23)

- Free/public videos may use YouTube where permitted.
- Paid/restricted lectures must use a paid video host with signed playback (**D-03**). Unlisted YouTube links are **not** access control.
- PDFs and files are stored in R2 and served only through entitlement-checked, short-lived URLs.
- Course progress is tracked separately from payment status.

## 12. Performance targets (PRD §28)

- Load test at 500, 1,000 and 2,000 concurrent test takers before launch. Test higher before claiming 5K or 10K.
- Controlled, batched answer saving.
- Indexed queries.
- Heavy analytics kept off the live exam write path.
- Queues for non-critical work.
- Monitor API latency, DB performance and answer-save reliability.

## 13. Main flows (PRD §29, §30)

**Student:** register/login → select examination → browse batches/courses → enroll free or purchase → backend verifies entitlement → study → practice → start eligible test → answers autosaved → submit → server evaluates → view analytics and mistakes → continue learning on weak areas.

**Admin:** create exam profile → create course and structure → upload/link lessons and materials → build the question bank → create tests → create a free or paid batch → assign courses/tests → publish → students enroll/purchase → monitor enrollments, tests and revenue → grant/restrict access → review analytics.

Diagrams: [developer-1-student-platform/04-USER-FLOWS.md](developer-1-student-platform/04-USER-FLOWS.md), [developer-2-admin-platform/04-ADMIN-USER-FLOWS.md](developer-2-admin-platform/04-ADMIN-USER-FLOWS.md).

## 14. MVP acceptance criteria (PRD §31)

Restated with test IDs in [18-ACCEPTANCE-CRITERIA.md](18-ACCEPTANCE-CRITERIA.md).

## 15. PRD open items (PRD §34)

Branding/domain/design system, exact exam configurations, paid video provider, trial policy, coupon/refund policy, support process, notification provider, final load-test targets and exam-day checklist. All are tracked in [17-OPEN-DECISIONS-AND-ASSUMPTIONS.md](17-OPEN-DECISIONS-AND-ASSUMPTIONS.md).
