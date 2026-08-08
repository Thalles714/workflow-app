import "server-only";

import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseMyWorkRepository } from "./repository";
import { createMyWorkService } from "./service";

export async function createServerMyWorkService() {
  const database = await createServerSupabaseClient();
  return createMyWorkService(createSupabaseMyWorkRepository(database));
}
