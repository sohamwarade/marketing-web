import { z } from "zod";
import { Id, IsoDate, Paise, Slug } from "./common";

export const ExaminationCode = z.enum(["MHT_CET", "JEE_MAIN", "JEE_ADVANCED"]);
export type ExaminationCode = z.infer<typeof ExaminationCode>;

export const PublicExaminationRef = z.object({
  code: z.string(),
  name: z.string(),
  slug: z.string(),
});
export type PublicExaminationRef = z.infer<typeof PublicExaminationRef>;

export const PublicExamination = z.object({
  id: Id.optional(),
  code: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  shortDescription: z.string().optional(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  counts: z
    .object({
      courses: z.number().int().default(0),
      batches: z.number().int().default(0),
      testSeries: z.number().int().default(0),
    })
    .optional(),
});
export type PublicExamination = z.infer<typeof PublicExamination>;

export const PatternSummary = z.object({
  subjects: z.array(z.string()),
  questionTypes: z.array(z.string()),
  marking: z.array(z.string()),
  durationMinutes: z.number().int(),
  source: z.literal("exam_profile").default("exam_profile"),
  profileName: z.string(),
});
export type PatternSummary = z.infer<typeof PatternSummary>;

export const PublicBatchCard = z.object({
  id: z.string(),
  slug: Slug,
  title: z.string(),
  examination: PublicExaminationRef,
  kind: z.enum(["regular", "test_series"]),
  academicYear: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  validity: z.object({
    mode: z.enum(["fixed_date", "days_from_enrollment"]),
    days: z.number().int().optional(),
    endsAt: z.string().optional(),
  }),
  pricePaise: Paise,
  compareAtPricePaise: Paise.optional(),
  isFree: z.boolean(),
  tags: z.array(z.string()).default([]),
  thumbnailUrl: z.string().optional(),
  counts: z.object({
    courses: z.number().int().default(0),
    tests: z.number().int().default(0),
  }),
  enrollment: z.object({
    open: z.boolean(),
    closesAt: z.string().optional(),
    seatsLeft: z.number().int().optional(),
  }),
  description: z.string().optional(),
});
export type PublicBatchCard = z.infer<typeof PublicBatchCard>;

export const PublicCourseCard = z.object({
  id: z.string(),
  slug: Slug,
  title: z.string(),
  examination: PublicExaminationRef,
  subject: z.string(),
  pricePaise: Paise,
  compareAtPricePaise: Paise.optional(),
  isFree: z.boolean(),
  thumbnailUrl: z.string().optional(),
  counts: z.object({
    lessons: z.number().int().default(0),
    videos: z.number().int().default(0),
    pdfs: z.number().int().default(0),
    tests: z.number().int().default(0),
  }),
  description: z.string().optional(),
});
export type PublicCourseCard = z.infer<typeof PublicCourseCard>;

export const PublicTestSeriesCard = z.object({
  id: z.string(),
  slug: Slug,
  title: z.string(),
  examination: PublicExaminationRef,
  academicYear: z.string(),
  pricePaise: Paise,
  compareAtPricePaise: Paise.optional(),
  isFree: z.boolean(),
  counts: z.object({
    fullMocks: z.number().int().default(0),
    partSyllabus: z.number().int().default(0),
    chapter: z.number().int().default(0),
    pyq: z.number().int().default(0),
    total: z.number().int().default(0),
  }),
  nextScheduledTestDate: z.string().optional(),
  description: z.string().optional(),
});
export type PublicTestSeriesCard = z.infer<typeof PublicTestSeriesCard>;

export const PublicExaminationDetail = z.object({
  code: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  patternSummary: PatternSummary,
  featured: z.object({
    batches: z.array(PublicBatchCard).default([]),
    courses: z.array(PublicCourseCard).default([]),
    testSeries: z.array(PublicBatchCard).default([]),
  }),
  counts: z.object({
    courses: z.number().int().default(0),
    batches: z.number().int().default(0),
    testSeries: z.number().int().default(0),
  }),
});
export type PublicExaminationDetail = z.infer<typeof PublicExaminationDetail>;

export const PublicPlatformStatus = z.object({
  maintenanceMode: z.boolean(),
  features: z.object({
    trialMaxTests: z.number().int().default(3),
    contactEnabled: z.boolean().default(true),
  }),
  counts: z
    .object({
      publishedQuestions: z.number().int().optional(),
      publishedTests: z.number().int().optional(),
    })
    .optional(),
});
export type PublicPlatformStatus = z.infer<typeof PublicPlatformStatus>;

export const PublicFaq = z.object({
  id: z.string(),
  question: z.string(),
  answerHtml: z.string(),
  scope: z.string(),
  category: z.string().optional(),
  sortOrder: z.number().int().default(0),
});
export type PublicFaq = z.infer<typeof PublicFaq>;

export const PublicContactRequest = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  topic: z.enum(["admissions", "technical", "payments", "other"]),
  message: z.string().min(10).max(2000),
  turnstileToken: z.string().optional(),
});
export type PublicContactRequest = z.infer<typeof PublicContactRequest>;
