# Shared 01 — API Contract Rules and Client Usage

The endpoint catalogue lives in [../09-API-CONTRACT-AND-ENDPOINTS.md](../09-API-CONTRACT-AND-ENDPOINTS.md). This document is the **working agreement** for how all three developers use and change that contract.

## 1. One contract, three consumers

```
packages/schemas      ← Zod: the contract in code (request, response, enums, error codes)
packages/api-client   ← typed functions that call the API and parse responses with those schemas
apps/api              ← implements routes using the same schemas (input validation + output parsing)
apps/{student,admin,marketing} ← call api-client only
```

If a shape is not in `@puzzlers/schemas`, it does not exist.

## 2. Using the API client

```ts
// apps/student/src/lib/api.ts
import { createApiClient } from "@puzzlers/api-client";

export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  credentials: "include",
});

// usage (client component, via TanStack Query)
const { data } = useQuery({ queryKey: ["me", "dashboard"], queryFn: () => api.me.dashboard() });
```

Server Components / route handlers:

```ts
import { cookies } from "next/headers";
import { createServerApiClient } from "@puzzlers/api-client/server";

const api = createServerApiClient({
  baseUrl: process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL!,
  cookieHeader: (await cookies()).toString(),
});
const course = await api.courses.get(courseId);
```

Behaviour of the client (implemented once in `api-client`):

| Concern | Behaviour |
|---|---|
| Envelope | Returns `data` (and `meta` for lists). Throws `ApiError` for an error envelope. |
| `ApiError` | `{ status, code, message, details, requestId }`. `code` is typed from the error catalogue. |
| Parsing | Responses are parsed with the response schema in development and staging. In production: `safeParse` + a Sentry warning on mismatch (it does not throw) *[Rec]*. |
| Idempotency | Functions for idempotent endpoints accept/generate an `idempotencyKey` (`crypto.randomUUID()`), which the caller should keep for retries of the same user intent. |
| Timeouts | Default 15 s (AbortController). Exam sync: 10 s. |
| Retries | None by default (callers decide). TanStack Query retries GETs ×2 on network errors and 5xx only. |
| 401 | Throws `ApiError(UNAUTHENTICATED)`. Apps handle it centrally (redirect to login, except inside the exam: re-login modal). |
| Request id | Sends `X-Request-Id` (UUIDv7) and shows it in error toasts ("Reference: …") for support. |

## 3. Query-key conventions (TanStack Query)

`[domain, ...identifiers, params?]`, e.g. `["courses", courseId]`, `["me", "tests", { kind, state }]`, `["admin", "questions", filters]`. Mutations invalidate by prefix (`queryClient.invalidateQueries({ queryKey: ["admin","questions"] })`). Keys are defined in each app's `queryKeys.ts`, never inline strings.

## 4. Changing the contract

1. Open an issue "Contract: <change>" describing the consumer need.
2. One PR containing: the schema change in `packages/schemas`, the doc change in `09-API-CONTRACT-AND-ENDPOINTS.md`, the OpenAPI snapshot update, a mock handler update, and (optionally) the implementation.
3. Label `contract`. Required approvals: the steward (Developer 2) + each consuming app's developer ([15 §4](../15-TEAM-COORDINATION-AND-INTEGRATION.md#4-api-contract-ownership-rules)).
4. Additive → 24-hour notice. Breaking → versioned or a deprecation period of one release.

## 5. Mocks

- `packages/api-client/mocks/` holds MSW handlers generated per endpoint, which return schema-valid fixtures (`@puzzlers/schemas/fixtures`) *[Rec]*.
- Apps enable mocks with `NEXT_PUBLIC_API_MOCKS=1` for UI development before the endpoint exists.
- A fixture must pass `schema.parse`. CI checks every fixture.

## 6. Naming rules

| Item | Rule | Example |
|---|---|---|
| Schema names | PascalCase + role suffix | `StartAttemptRequest`, `StartAttemptResponse`, `AdminQuestionRow` |
| Enum values | snake_case strings | `answered_marked_for_review` |
| JSON fields | camelCase | `deadlineAt` |
| Money | `*Paise` integers | `totalPaise` |
| Times | `*At` ISO strings; durations `*Seconds` | `startedAt`, `durationSeconds` |
| Booleans | `is*`, `has*`, `can*` | `isFree`, `canStart` |
| Marks | decimal **strings** | `"marks": "-1"`, to avoid float errors |
| Client functions | `api.<group>.<verb>` | `api.attempts.sync()`, `api.admin.questions.list()` |
