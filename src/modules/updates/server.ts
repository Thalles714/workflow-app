import "server-only";
import { createSupabaseAuditRepository } from "../audit/repository";
import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseTaskRepository } from "../tasks/repository";
import { createSupabaseTaskUpdateRepository } from "./repository";
import { createTaskUpdateService } from "./service";
export async function createServerTaskUpdateService() {
  const database = await createServerSupabaseClient();
  return createTaskUpdateService(
    createSupabaseTaskUpdateRepository(database),
    createSupabaseTaskRepository(database),
    createSupabaseAuditRepository(database),
  );
}
