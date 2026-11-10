# Shared 08 — Integration Checklist

Used at each weekly integration checkpoint and at each phase gate ([../16](../16-IMPLEMENTATION-ROADMAP.md)). Copy the relevant section into the checkpoint issue and tick it off on **staging**.

## A. Every checkpoint

- [ ] `main` green in CI; staging deployed from the latest `main`
- [ ] Contract changes since the last checkpoint listed, with consumers confirmed
- [ ] New migrations applied on staging without errors
- [ ] No new Sentry error types left untriaged
- [ ] Mocks for upcoming endpoints exist
- [ ] Open decisions affecting next week flagged to the owner ([../17](../17-OPEN-DECISIONS-AND-ASSUMPTIONS.md))

## B. Cross-app integration points

| # | Integration | Check |
|---|---|---|
| I-1 | Shared session | Log in on student → admin (staff user) and marketing header reflect it; logout clears all |
| I-2 | Design tokens | All three apps use the same token version (package version / commit) |
| I-3 | Marketing → student registration | `register?exam=&next=` preserves intent through onboarding |
| I-4 | Marketing catalogue ↔ admin publishing | Publish/unpublish in admin reflects on marketing within the ISR window (≤ 5 min) or via on-demand revalidation |
| I-5 | Admin course structure ↔ student course tree | Reorder/publish/lock in admin shows correctly to the student |
| I-6 | Admin grant/restrict ↔ student access | Takes effect on the student's next request (≤ 60 s) |
| I-7 | Test publish ↔ student test list | State `upcoming/available` follows the schedule using server time |
| I-8 | Admin question preview ↔ student rendering | Same renderer component, same KaTeX output |
| I-9 | Exam submit ↔ admin live monitor | Counts update; force-submit works |
| I-10 | Result release (admin) ↔ student result page | Release modes behave as configured |
| I-11 | Purchase (student) ↔ orders (admin) | Same order number, status and amounts on both |
| I-12 | Notifications (admin) ↔ student inbox | Audience targeting is correct |
| I-13 | Rescore (admin) ↔ student result + notification | Updated score and rank |
| I-14 | Suspend (admin) ↔ student session | Logged out; exam force-submitted |

## C. Phase gates

| Gate | Must pass |
|---|---|
| IC-1 (Phase 1) | PoC P-1 … P-10; I-1 in basic form; I-2 |
| IC-2 (Phase 2) | I-1 full; RBAC nav; route-guard test |
| IC-3 (Phase 3) | I-3, I-4, I-5, I-6 |
| IC-4 (Phase 4) | I-7, I-8; the no-keys contract test |
| IC-5 (Phase 5) | I-9; EX-01…20; 20-person internal mock |
| IC-6 (Phase 6) | I-10, I-13 |
| IC-7 (Phase 7) | I-11; commerce idempotency; I-12 |
| IC-8 (Phase 8) | Permission-matrix suite; audit completeness; I-14 |
| IC-9 (Phase 9) | Launch checklist ([../12 §18](../12-SECURITY-AND-PRODUCTION-READINESS.md#18-production-launch-checklist)) |
