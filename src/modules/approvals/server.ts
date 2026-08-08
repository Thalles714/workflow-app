import "server-only";
import { createSupabaseAuditRepository } from "../audit/repository";
import { createServerSupabaseClient } from "../auth/server";
import { createSupabaseDeliverableRepository } from "../deliverables/repository";
import { createSupabaseApprovalRepository } from "./repository";
import { createApprovalService } from "./service";
export async function createServerApprovalService() {
  const database = await createServerSupabaseClient();
  return createApprovalService(
    createSupabaseApprovalRepository(database),
    createSupabaseDeliverableRepository(database),
    createSupabaseAuditRepository(database),
  );
}
