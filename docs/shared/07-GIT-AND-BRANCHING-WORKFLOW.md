# Shared 07 — Git and Branching Workflow

## 1. Model

Trunk-based development on `main`. Short-lived branches (≤ 3 days ideally). `main` is always deployable to staging.

## 2. Branch names

`<type>/<area>-<short-description>`, where type ∈ `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `contract`, `db`.

Examples: `feat/student-exam-palette`, `contract/attempt-sync-nextSync`, `db/add-question-reports`, `fix/admin-batch-price-validation`.

## 3. Commits

Conventional Commits: `feat(student): add question palette legend counts`. Scopes: `student`, `admin`, `marketing`, `api`, `db`, `schemas`, `ui`, `tokens`, `exam-core`, `auth`, `ci`, `docs`. Small commits so AI-generated changes can be reviewed or reverted (PRD §27).

## 4. Pull requests

- Template sections: What / Why / Contract changes (yes/no + link) / Migration (yes/no) / Screenshots / Tests / AI assistance used (which parts, what was verified by hand).
- Labels: app (`app:student` …), `contract`, `db-migration`, `security`, `exam-engine`, `payments`, `phase-N`.
- CI must be green. Required reviews per [../15 §6](../15-TEAM-COORDINATION-AND-INTEGRATION.md#6-code-review-rules).
- Squash-merge. The PR title becomes the commit message.

## 5. CODEOWNERS (template; fill in GitHub handles)

```
/apps/student/                 @dev1
/apps/admin/                   @dev2
/apps/marketing/               @dev3
/apps/api/                     @dev2
/apps/api/src/modules/exam/    @dev1 @dev2
/apps/api/src/modules/evaluation/ @dev1 @dev2
/apps/api/src/modules/results/    @dev1 @dev2
/apps/api/src/modules/practice/   @dev1 @dev2
/apps/api/src/modules/public/     @dev2
/apps/api/src/modules/commerce/   @dev2 @dev1
/apps/api/src/modules/access/     @dev2 @dev1
/packages/schemas/             @dev2
/packages/database/            @dev2
/packages/auth/                @dev2
/packages/exam-core/           @dev1 @dev2
/packages/api-client/          @dev2
/packages/ui/                  @dev3 @dev1 @dev2
/packages/ui/src/exam-preview/ @dev1 @dev3
/packages/design-tokens/       @dev3 @dev1 @dev2
/docs/                         @dev2
```

Developer 2 is the steward, so `@dev2` appears on every shared package. In CODEOWNERS the last matching line wins, so the module lines stay **after** the general `/apps/api/` line. Replace `@devN` with real GitHub handles.

## 6. Branch protection on `main`

Require PRs, the required status checks (`ci`), CODEOWNERS review, linear history, and no force-push. Admins are not exempt.

## 7. Releases

- Staging deploys on every merge to `main`.
- Production: tag `vYYYY.MM.DD-N` from `main` → `deploy-prod.yml` with approval.
- Release notes are generated from Conventional Commits.
- A hotfix is a branch from `main` → PR → tag. There is no long-lived release branch.

## 8. Feature flags

Incomplete features merge behind `system_settings.features.<flag>` (server) and are exposed via `GET /v1/public/platform-status`. This avoids long-lived branches.
