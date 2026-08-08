import "server-only";
import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseAttentionRepository } from "./repository";
import { createAttentionService } from "./service";
export async function createServerAttentionService() {
  return createAttentionService(
    createSupabaseAttentionRepository(await createServerSupabaseClient()),
  );
}
