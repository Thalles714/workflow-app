import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApprovalStatus } from "../../types/database";
import { DomainError } from "../authorization/errors";

export type ApprovalRecord = Readonly<{
  decidedAt: string | null;
  decidedBy: string | null;
  decisionNote: string | null;
  deliverableId: string;
  id: string;
  requestedAt: string;
  requestedBy: string;
  status: ApprovalStatus;
  workspaceId: string;
}>;
export interface ApprovalRepository {
  create(
    workspaceId: string,
    deliverableId: string,
    requestedBy: string,
    note: string,
  ): Promise<ApprovalRecord>;
  findById(workspaceId: string, id: string): Promise<ApprovalRecord | null>;
  findPendingByDeliverable(
    workspaceId: string,
    deliverableId: string,
  ): Promise<ApprovalRecord | null>;
  list(workspaceId: string, limit: number, status?: ApprovalStatus): Promise<ApprovalRecord[]>;
  decide(
    workspaceId: string,
    id: string,
    actorId: string,
    status: Exclude<ApprovalStatus, "PENDING">,
    note: string,
  ): Promise<ApprovalRecord | null>;
  reset(
    workspaceId: string,
    id: string,
    actorId: string,
    note: string,
  ): Promise<ApprovalRecord | null>;
}
const selection =
  "id,workspace_id,deliverable_id,requested_by,decided_by,status,decision_note,requested_at,decided_at";
const map = (row: Record<string, unknown>): ApprovalRecord => ({
  decidedAt: row.decided_at ? String(row.decided_at) : null,
  decidedBy: row.decided_by ? String(row.decided_by) : null,
  decisionNote: row.decision_note ? String(row.decision_note) : null,
  deliverableId: String(row.deliverable_id),
  id: String(row.id),
  requestedAt: String(row.requested_at),
  requestedBy: String(row.requested_by),
  status: row.status as ApprovalStatus,
  workspaceId: String(row.workspace_id),
});
export function createSupabaseApprovalRepository(client: SupabaseClient): ApprovalRepository {
  return {
    async create(workspaceId, deliverableId, requestedBy, note) {
      const { data, error } = await client
        .from("approvals")
        .insert({
          workspace_id: workspaceId,
          deliverable_id: deliverableId,
          requested_by: requestedBy,
          decision_note: note,
        })
        .select(selection)
        .single();
      if (error || !data) throw new DomainError("CONFLICT");
      return map(data);
    },
    async findById(workspaceId, id) {
      const { data, error } = await client
        .from("approvals")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? map(data) : null;
    },
    async findPendingByDeliverable(workspaceId, deliverableId) {
      const { data, error } = await client
        .from("approvals")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .eq("deliverable_id", deliverableId)
        .eq("status", "PENDING")
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? map(data) : null;
    },
    async list(workspaceId, limit, status) {
      let query = client
        .from("approvals")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .order("requested_at", { ascending: false })
        .limit(limit);
      if (status) query = query.eq("status", status);
      const { data, error } = await query;
      if (error) throw new DomainError("CONFLICT");
      return (data ?? []).map(map);
    },
    async decide(workspaceId, id, actorId, status, note) {
      const { data, error } = await client
        .from("approvals")
        .update({
          decided_by: actorId,
          decided_at: new Date().toISOString(),
          decision_note: note,
          status,
        })
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .eq("status", "PENDING")
        .select(selection)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? map(data) : null;
    },
    async reset(workspaceId, id, _actorId, note) {
      const { data, error } = await client
        .from("approvals")
        .update({ decided_by: null, decided_at: null, decision_note: note, status: "PENDING" })
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .neq("status", "PENDING")
        .select(selection)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? map(data) : null;
    },
  };
}
