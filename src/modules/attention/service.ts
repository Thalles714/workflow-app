import type { AuthorizationContext } from "../authorization/service";
import { requireAdmin } from "../authorization/service";
import { evaluateAttention, type AttentionSnapshot } from "./evaluate";

export type AttentionSource = AttentionSnapshot & { timezone: string };
export interface AttentionRepository {
  load(workspaceId: string): Promise<AttentionSource>;
}

export function createAttentionService(
  repository: AttentionRepository,
  clock = { now: () => new Date() },
) {
  return {
    async getOperationAttention(context: AuthorizationContext) {
      requireAdmin(context);
      const { timezone, ...snapshot } = await repository.load(context.workspaceId);
      return evaluateAttention(snapshot, { now: clock.now() }, timezone);
    },
  };
}
