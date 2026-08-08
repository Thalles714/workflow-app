import { z } from "zod";

import {
  idSchema,
  nameSchema,
  optionalDescriptionSchema,
  paginationSchema,
} from "../authorization/schemas";

const projectNameSchema = nameSchema.max(140);
export const projectIdSchema = z.object({ id: idSchema }).strict();
export const listProjectsSchema = paginationSchema
  .extend({ clientId: idSchema.optional() })
  .strict();
export const createProjectSchema = z
  .object({
    clientId: idSchema,
    description: optionalDescriptionSchema,
    name: projectNameSchema,
  })
  .strict();
export const updateProjectSchema = z
  .object({
    description: optionalDescriptionSchema,
    id: idSchema,
    name: projectNameSchema.optional(),
    status: z.enum(["ACTIVE", "COMPLETED"]).optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.name !== undefined || value.description !== undefined || value.status !== undefined,
  );
