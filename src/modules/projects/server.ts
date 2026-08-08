import "server-only";

import { createSupabaseAuditRepository } from "../audit/repository";
import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseClientRepository } from "../clients/repository";
import { createSupabaseProjectRepository } from "./repository";
import { createProjectService } from "./service";

export async function createServerProjectService() {
  const database = await createServerSupabaseClient();
  return createProjectService(
    createSupabaseProjectRepository(database),
    createSupabaseClientRepository(database),
    createSupabaseAuditRepository(database),
  );
}
