import { z } from "zod";

export const Id = z.string().uuid();
export const UserId = z.string().min(1);
export const IsoDate = z.string().datetime({ offset: true });
export const Paise = z.number().int().nonnegative();
export const Marks = z.string().regex(/^-?\d{1,4}(\.\d{1,2})?$/);
export const Slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(120);

export const Meta = z.object({
  requestId: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  total: z.number().optional(),
  nextCursor: z.string().nullable().optional(),
});

export const envelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    data,
    meta: Meta.optional(),
  });
