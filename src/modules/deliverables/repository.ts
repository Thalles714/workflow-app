import type { SupabaseClient } from "@supabase/supabase-js";

import { DomainError } from "../authorization/errors";
import type { DeliverableStatus } from "../../types/database";

export type DeliverableRecord = Readonly<{
  description: string;
  dueAt: string | null;
  id: string;
  isImportant: boolean;
  name: string;
  projectId: string;
  status: DeliverableStatus;
  workspaceId: string;
}>;
export type DeliverableChanges = Readonly<{
  description?: string | null | undefined;
  dueAt?: string | null | undefined;
  isImportant?: boolean | undefined;
  name?: string | undefined;
  status?: DeliverableStatus | undefined;
}>;
export interface DeliverableRepository {
  archive(workspaceId: string, id: string): Promise<DeliverableRecord | null>;
  create(
    workspaceId: string,
    input: {
      description?: string | null | undefined;
      dueAt?: string | null | undefined;
      isImportant: boolean;
      name: string;
      projectId: string;
    },
  ): Promise<DeliverableRecord>;
  findById(workspaceId: string, id: string): Promise<DeliverableRecord | null>;
  list(workspaceId: string, limit: number, projectId?: string): Promise<DeliverableRecord[]>;
  update(
    workspaceId: string,
    id: string,
    changes: DeliverableChanges,
  ): Promise<DeliverableRecord | null>;
}
const selection = "id,workspace_id,project_id,name,description,status,due_at,is_important";
const mapDeliverable = (row: Record<string, unknown>): DeliverableRecord => ({
  description: String(row.description),
  dueAt: row.due_at ? String(row.due_at) : null,
  id: String(row.id),
  isImportant: Boolean(row.is_important),
  name: String(row.name),
  projectId: String(row.project_id),
  status: row.status as DeliverableStatus,
  workspaceId: String(row.workspace_id),
});

export function createSupabaseDeliverableRepository(client: SupabaseClient): DeliverableRepository {
  return {
    async archive(workspaceId, id) {
      const { data, error } = await client
        .from("deliverables")
        .update({ archived_at: new Date().toISOString() })
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select(selection)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapDeliverable(data) : null;
    },
    async create(workspaceId, input) {
      const { data, error } = await client
        .from("deliverables")
        .insert({
          description: input.description ?? "",
          due_at: input.dueAt ?? null,
          is_important: input.isImportant,
          name: input.name,
          project_id: input.projectId,
          workspace_id: workspaceId,
        })
        .select(selection)
        .single();
      if (error || !data) throw new DomainError("CONFLICT");
      return mapDeliverable(data);
    },
    async findById(workspaceId, id) {
      const { data, error } = await client
        .from("deliverables")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapDeliverable(data) : null;
    },
    async list(workspaceId, limit, projectId) {
      let query = client
        .from("deliverables")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .is("archived_at", null)
        .order("due_at", { nullsFirst: false })
        .limit(limit);
      if (projectId) query = query.eq("project_id", projectId);
      const { data, error } = await query;
      if (error) throw new DomainError("CONFLICT");
      return (data ?? []).map(mapDeliverable);
    },
    async update(workspaceId, id, changes) {
      const values: Record<string, unknown> = {};
      if (changes.name !== undefined) values.name = changes.name;
      if (changes.description !== undefined) values.description = changes.description ?? "";
      if (changes.status !== undefined) values.status = changes.status;
      if (changes.dueAt !== undefined) values.due_at = changes.dueAt;
      if (changes.isImportant !== undefined) values.is_important = changes.isImportant;
      const { data, error } = await client
        .from("deliverables")
        .update(values)
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select(selection)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapDeliverable(data) : null;
    },
  };
}
