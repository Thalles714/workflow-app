import { z } from "zod";

import { idSchema, optionalDescriptionSchema, paginationSchema } from "../authorization/schemas";

const dueAtSchema = z.iso.datetime({ offset: true }).nullable();
const blockSchema = z
  .object({ blockReason: z.string().trim().min(1).max(500).nullable(), isBlocked: z.boolean() })
  .refine((value) => (value.isBlocked ? value.blockReason !== null : value.blockReason === null));

export const taskIdSchema = z.object({ id: idSchema }).strict();
export const listTasksSchema = paginationSchema
  .extend({ assigneeId: idSchema.optional(), deliverableId: idSchema.optional() })
  .strict();
export const createTaskSchema = z
  .object({
    assigneeId: idSchema.nullable().optional(),
    blockReason: z.string().trim().min(1).max(500).nullable().default(null),
    deliverableId: idSchema,
    description: optionalDescriptionSchema,
    dueAt: dueAtSchema.optional(),
    isBlocked: z.boolean().default(false),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
    title: z.string().trim().min(2).max(180),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.isBlocked !== (value.blockReason !== null))
      context.addIssue({ code: "custom", message: "Bloqueio requer motivo." });
  });
export const updateTaskSchema = z
  .object({
    assigneeId: idSchema.nullable().optional(),
    block: blockSchema.optional(),
    description: optionalDescriptionSchema,
    dueAt: dueAtSchema.optional(),
    id: idSchema,
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
    title: z.string().trim().min(2).max(180).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).some((key) => key !== "id"));
