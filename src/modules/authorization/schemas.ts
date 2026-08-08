import { z } from "zod";

export const idSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
export const nameSchema = z.string().trim().min(1).max(120);
export const optionalDescriptionSchema = z.string().trim().max(2000).nullable().optional();
export const paginationSchema = z
  .object({ limit: z.number().int().min(1).max(100).default(50) })
  .strict();
