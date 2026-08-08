import type { SupabaseClient } from "@supabase/supabase-js";

import { DomainError } from "../authorization/errors";
import type { AuthorizationContext } from "../authorization/service";

export type AuditEvent = Readonly<{
  action: string;
  entityId: string;
  entityType: "client" | "deliverable" | "project" | "task";
  metadata?: Readonly<Record<string, boolean | number | string | null>>;
}>;

export interface AuditWriter {
  record(context: AuthorizationContext, event: AuditEvent): Promise<void>;
}

export function createSupabaseAuditRepository(client: SupabaseClient): AuditWriter {
  return {
    async record(context, event) {
      const { error } = await client.from("audit_logs").insert({
        action: event.action,
        actor_id: context.actorId,
        entity_id: event.entityId,
        entity_type: event.entityType,
        metadata: event.metadata ?? {},
        workspace_id: context.workspaceId,
      });
      if (error) throw new DomainError("CONFLICT");
    },
  };
}
