import { z } from "zod";
import { idSchema, paginationSchema } from "../authorization/schemas";

const note = z.string().trim().min(1).max(500);
export const approvalIdSchema = z.object({ id: idSchema }).strict();
export const approvalRequestSchema = z.object({ deliverableId: idSchema, note }).strict();
export const approvalDecisionSchema = z
  .object({ id: idSchema, note, status: z.enum(["APPROVED", "CHANGES_REQUESTED"]) })
  .strict();
export const approvalResetSchema = z.object({ id: idSchema, note }).strict();
export const approvalListSchema = paginationSchema
  .extend({ status: z.enum(["PENDING", "APPROVED", "CHANGES_REQUESTED"]).optional() })
  .strict();
