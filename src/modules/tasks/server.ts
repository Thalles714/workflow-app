import "server-only";

import { createSupabaseAuditRepository } from "../audit/repository";
import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseDeliverableRepository } from "../deliverables/repository";
import { createSupabaseTaskRepository } from "./repository";
import { createTaskService } from "./service";

export async function createServerTaskService() {
  const database = await createServerSupabaseClient();
  return createTaskService(
    createSupabaseTaskRepository(database),
    createSupabaseDeliverableRepository(database),
    createSupabaseAuditRepository(database),
  );
}
