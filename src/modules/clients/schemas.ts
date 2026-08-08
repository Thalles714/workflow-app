import { z } from "zod";

import { idSchema, nameSchema, paginationSchema } from "../authorization/schemas";

export const createClientSchema = z.object({ name: nameSchema }).strict();
export const updateClientSchema = z.object({ id: idSchema, name: nameSchema }).strict();
export const clientIdSchema = z.object({ id: idSchema }).strict();
export const listClientsSchema = paginationSchema;

export type CreateClientInput = z.input<typeof createClientSchema>;
export type UpdateClientInput = z.input<typeof updateClientSchema>;
