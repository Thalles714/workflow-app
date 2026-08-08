import "server-only";

import { createSupabaseAuditRepository } from "../audit/repository";
import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseProjectRepository } from "../projects/repository";
import { createSupabaseDeliverableRepository } from "./repository";
import { createDeliverableService } from "./service";

export async function createServerDeliverableService() {
  const database = await createServerSupabaseClient();
  return createDeliverableService(
    createSupabaseDeliverableRepository(database),
    createSupabaseProjectRepository(database),
    createSupabaseAuditRepository(database),
  );
}
