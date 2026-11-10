# Shared 05 — Shared Types and Zod Schemas

Package: `@puzzlers/schemas`. These are the canonical definitions behind the names used in [../09](../09-API-CONTRACT-AND-ENDPOINTS.md). The snippets show the required shape. The package is the source of truth once it exists, and this document must be kept in sync with it.

## 1. Package layout

```
packages/schemas/src/
  enums.ts          # const arrays shared with Drizzle pgEnums
  common.ts         # Id, IsoDate, Paise, Marks, Pagination, Envelope, ApiErrorBody
  errors.ts         # ERROR_CODES + details schemas per code
  permissions.ts    # PERMISSIONS const + role defaults
  auth.ts me.ts
  catalog.ts        # examinations, profiles, taxonomy
  learning.ts       # courses, lessons, progress
  batches.ts access.ts
  questions.ts      # QuestionInput, AnswerKey, AdminQuestion
  tests.ts          # TestInput, TestConfigSnapshot, StudentTestDetail
  attempts.ts       # Start/Paper/State/Sync/Submit/Result
  practice.ts commerce.ts notifications.ts uploads.ts reports.ts audit.ts settings.ts
  public.ts         # public catalogue
  fixtures/         # schema-valid sample data for mocks and tests
  index.ts
```

## 2. Common primitives

```ts
import { z } from "zod";

export const Id = z.string().uuid();
export const UserId = z.string().min(1);
export const IsoDate = z.string().datetime({ offset: true });
export const Paise = z.number().int().nonnegative();
export const Marks = z.string().regex(/^-?\d{1,4}(\.\d{1,2})?$/);     // decimal string
export const Slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(120);

export const PageQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});
export const CursorQuery = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const Meta = z.object({
  requestId: z.string(),
  page: z.number().optional(), pageSize: z.number().optional(), total: z.number().optional(),
  nextCursor: z.string().nullable().optional(),
});
export const envelope = <T extends z.ZodTypeAny>(data: T) => z.object({ data, meta: Meta });

export const ApiErrorBody = z.object({
  error: z.object({
    code: z.enum(ERROR_CODES),
    message: z.string(),
    details: z.unknown().optional(),
    requestId: z.string(),
  }),
});
```

## 3. Enums (`enums.ts`)

```ts
export const QUESTION_TYPE = ["single_correct","multiple_correct","numerical","fill_blank","passage"] as const;
export const PALETTE_STATE = ["not_visited","not_answered","answered","marked_for_review","answered_marked_for_review"] as const;
export const ATTEMPT_STATUS = ["in_progress","submitted","evaluating","evaluated","evaluation_failed","invalidated"] as const;
export const TEST_KIND = ["chapter","topic","part_syllabus","full_mock","pyq","practice"] as const;
export const TIMER_MODE = ["global","section_slots"] as const;
export const SECTION_NAV = ["free","no_return","sequential"] as const;
export const MSQ_SCHEME = ["all_or_nothing","jee_advanced_partial"] as const;
export const RESULT_RELEASE = ["immediate","after_window","scheduled","manual"] as const;
export const SOLUTIONS_RELEASE = ["with_result","after_window","scheduled","manual","never"] as const;
export const REATTEMPT_POLICY = ["none","after_result_release","after_cooldown","anytime"] as const;
export const CONTENT_STATUS = ["draft","published","archived"] as const;
export const QUESTION_STATUS = ["draft","in_review","published","archived"] as const;
export const ENTITLEMENT_SCOPE = ["batch","course","test"] as const;
export const ENTITLEMENT_SOURCE = ["purchase","free_enrollment","admin_grant"] as const;
export const OVERRIDE_SCOPE = ["batch","course","course_chapter","lesson","test"] as const;
export const ORDER_STATUS = ["created","pending","paid","failed","cancelled","expired","refunded","partially_refunded"] as const;
export const OUTCOME = ["correct","incorrect","partial","unattempted","not_visited","bonus","dropped"] as const;
export const ATTEMPT_EVENT_TYPE = ["section_opened","question_opened","question_left","answer_saved","answer_cleared",
  "review_marked","review_unmarked","visibility_hidden","visibility_visible","fullscreen_exited",
  "went_offline","came_online","submit_requested"] as const;
export const LESSON_TYPE = ["video","pdf","note","test","practice","resource"] as const;
export const BATCH_KIND = ["regular","test_series"] as const;
```

## 4. Questions

```ts
export const OptionInput = z.object({ id: Id.optional(), html: z.string().min(1).max(20_000), imageUploadId: Id.optional() });

export const AnswerKey = z.discriminatedUnion("type", [
  z.object({ type: z.literal("single_correct"), correctOptionIndex: z.number().int().min(0) }),
  z.object({ type: z.literal("multiple_correct"), correctOptionIndexes: z.array(z.number().int().min(0)).min(1) }),
  z.object({ type: z.literal("numerical"), key: z.union([
      z.object({ kind: z.literal("exact"), value: z.string(), decimals: z.number().int().min(0).max(6).optional() }),
      z.object({ kind: z.literal("range"), min: z.string(), max: z.string() }) ]) }),
  z.object({ type: z.literal("fill_blank"), blanks: z.array(z.object({
      blankId: z.string().min(1), accepted: z.array(z.string().min(1)).min(1),
      match: z.enum(["exact","case_insensitive","numeric"]), tolerance: z.string().optional() })).min(1) }),
  z.object({ type: z.literal("passage") }),
]);
// Input uses option *indexes* (options do not have ids yet); the server converts them to option ids.

export const QuestionInput = z.object({
  type: z.enum(QUESTION_TYPE),
  subjectId: Id, chapterId: Id, topicId: Id.nullable().optional(),
  difficulty: z.number().int().min(1).max(3),
  source: z.enum(["original","pyq","adapted"]),
  pyq: z.object({ examinationId: Id, year: z.number().int(), session: z.string().optional() }).optional(),
  passageId: Id.optional(),
  stemHtml: z.string().min(1).max(50_000),
  stemImageUploadIds: z.array(Id).max(10).default([]),
  options: z.array(OptionInput).max(10).default([]),
  answerKey: AnswerKey,
  solutionHtml: z.string().max(50_000).optional(),
  solutionVideoRef: z.string().optional(),
  idealTimeSeconds: z.number().int().min(5).max(3600).optional(),
  tagIds: z.array(Id).default([]),
}).superRefine((q, ctx) => {
  if (q.type !== q.answerKey.type) ctx.addIssue({ code: "custom", path: ["answerKey"], message: "Key type must match question type" });
  if ((q.type === "single_correct" || q.type === "multiple_correct") && q.options.length < 2)
    ctx.addIssue({ code: "custom", path: ["options"], message: "At least 2 options" });
  if (q.source === "pyq" && !q.pyq) ctx.addIssue({ code: "custom", path: ["pyq"], message: "PYQ details required" });
});
```

## 5. Attempts (exam contract)

```ts
export const AnswerResponse = z.union([
  z.object({ optionId: Id }),                                   // single_correct
  z.object({ optionIds: z.array(Id).min(1).max(10) }),          // multiple_correct
  z.object({ value: z.string().regex(/^-?\d{0,8}(\.\d{0,6})?$/).min(1) }), // numerical
  z.object({ blanks: z.record(z.string(), z.string().max(200)) }),          // fill_blank
]);

export const StartAttemptRequest = z.object({
  acceptedInstructions: z.literal(true),
  client: z.object({ tz: z.string().max(64), viewport: z.string().max(32), ua: z.string().max(400).optional() }),
});
export const StartAttemptResponse = z.object({
  attemptId: Id, attemptNo: z.number().int(), status: z.enum(ATTEMPT_STATUS),
  startedAt: IsoDate, deadlineAt: IsoDate, serverNow: IsoDate,
  publicationId: Id, paperUrl: z.string(), syncToken: z.string(), resumed: z.boolean(),
});

export const AttemptEvent = z.object({
  clientEventId: Id, seq: z.number().int().positive(), type: z.enum(ATTEMPT_EVENT_TYPE),
  testQuestionId: Id.optional(), sectionId: Id.optional(),
  payload: z.record(z.string(), z.unknown()).optional(), clientTs: IsoDate,
});
export const AnswerUpsert = z.object({
  testQuestionId: Id, seq: z.number().int().positive(), paletteState: z.enum(PALETTE_STATE),
  response: AnswerResponse.nullable(), timeSpentSeconds: z.number().int().min(0).max(86_400),
  visitCount: z.number().int().min(0).max(10_000),
});
export const SyncRequest = z.object({
  batchId: Id, fromSeq: z.number().int().min(0), toSeq: z.number().int().min(0),
  events: z.array(AttemptEvent).max(100), answers: z.array(AnswerUpsert).max(100),
  position: z.object({ sectionId: Id, testQuestionId: Id }).optional(),
  clientNow: IsoDate,
});
export const SyncResponse = z.object({
  ackSeq: z.number().int(), serverNow: IsoDate, deadlineAt: IsoDate, status: z.enum(ATTEMPT_STATUS),
  rejected: z.array(z.object({ seq: z.number().int(), testQuestionId: Id.optional(),
    code: z.enum(["SECTION_ATTEMPT_LIMIT","NAVIGATION_NOT_ALLOWED","INVALID_RESPONSE","UNKNOWN_QUESTION"]) })),
  nextSyncInSeconds: z.number().int().min(5).max(60).optional(),
});
export const SubmitRequest = z.object({ finalSeq: z.number().int().min(0), clientSubmittedAt: IsoDate, confirm: z.literal(true) });
export const SubmitResponse = z.object({
  attemptId: Id, status: z.enum(ATTEMPT_STATUS), submittedAt: IsoDate,
  resultRelease: z.object({ mode: z.enum(RESULT_RELEASE), availableAt: IsoDate.nullable() }),
});
```

`AttemptPaper` and `AttemptState` follow the shapes in [../09 §16](../09-API-CONTRACT-AND-ENDPOINTS.md#16-test-attempts). Their option schema is `z.object({ id: Id, html: z.string(), imageUrl: z.string().url().optional() }).strict()`. **`.strict()` makes any accidental `isCorrect` fail output parsing.**

## 6. Commerce

```ts
export const CreateOrderRequest = z.object({
  items: z.array(z.object({ itemType: z.enum(["batch","course"]), itemId: Id })).min(1).max(5),
  couponCode: z.string().trim().toUpperCase().max(40).optional(),
});
export const CreateOrderResponse = z.object({
  orderId: Id, orderNumber: z.string(), status: z.enum(ORDER_STATUS),
  totalPaise: Paise, discountPaise: Paise,
  paymentSessionId: z.string().optional(), cashfreeMode: z.enum(["sandbox","production"]),
  expiresAt: IsoDate,
});
```

## 7. Access

```ts
export const AccessReason = z.enum(["suspended","restricted","entitled_batch","entitled_course","entitled_test",
  "override_grant","trial","free_test","preview","not_published","not_yet_available","expired","not_entitled"]);
export const AccessDecision = z.object({
  allowed: z.boolean(), reason: AccessReason,
  via: z.object({ type: z.string(), id: z.string() }).optional(),
  details: z.object({
    availableFrom: IsoDate.optional(),
    purchaseOptions: z.array(z.object({ itemType: z.enum(["batch","course"]), itemId: Id, title: z.string(), pricePaise: Paise, slug: Slug })).optional(),
  }).optional(),
});
export const GrantEntitlementRequest = z.object({
  userId: UserId, scopeType: z.enum(ENTITLEMENT_SCOPE), scopeId: Id,
  endsAt: IsoDate.optional(), note: z.string().max(500).optional(), reason: z.string().min(3).max(500),
});
```

## 8. Rules for schema authors

1. Every request schema is `.strict()` for admin writes and `.strip()` for public/student inputs.
2. Every response schema that contains question content must be explicitly built (never derived from DB rows with `.omit`), so that new DB columns cannot leak by accident.
3. Export both the schema and `type X = z.infer<typeof X>`.
4. Use `z.coerce` only for query strings.
5. Add a fixture for every response schema in `fixtures/`.
