import { z } from "zod";

import {
  idSchema,
  nameSchema,
  optionalDescriptionSchema,
  paginationSchema,
} from "../authorization/schemas";

const dateSchema = z.iso.datetime({ offset: true }).nullable();
export const deliverableIdSchema = z.object({ id: idSchema }).strict();
export const listDeliverablesSchema = paginationSchema
  .extend({ projectId: idSchema.optional() })
  .strict();
export const createDeliverableSchema = z
  .object({
    description: optionalDescriptionSchema,
    dueAt: dateSchema.optional(),
    isImportant: z.boolean().default(false),
    name: nameSchema.max(140),
    projectId: idSchema,
  })
  .strict();
export const updateDeliverableSchema = z
  .object({
    description: optionalDescriptionSchema,
    dueAt: dateSchema.optional(),
    id: idSchema,
    isImportant: z.boolean().optional(),
    name: nameSchema.max(140).optional(),
    status: z.enum(["PLANNED", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"]).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).some((key) => key !== "id"));
