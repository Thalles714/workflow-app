import "server-only";

import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseAuditRepository } from "../audit/repository";
import { createSupabaseClientRepository } from "./repository";
import { createClientService } from "./service";

export async function createServerClientService() {
  const database = await createServerSupabaseClient();
  return createClientService(
    createSupabaseClientRepository(database),
    createSupabaseAuditRepository(database),
  );
}
