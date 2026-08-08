import type { SupabaseClient } from "@supabase/supabase-js";

import { DomainError } from "../authorization/errors";

export type ClientRecord = Readonly<{ id: string; name: string; workspaceId: string }>;
export interface ClientRepository {
  archive(workspaceId: string, id: string): Promise<ClientRecord | null>;
  create(workspaceId: string, name: string): Promise<ClientRecord>;
  findById(workspaceId: string, id: string): Promise<ClientRecord | null>;
  list(workspaceId: string, limit: number): Promise<ClientRecord[]>;
  update(workspaceId: string, id: string, name: string): Promise<ClientRecord | null>;
}

const mapClient = (row: Record<string, unknown>): ClientRecord => ({
  id: String(row.id),
  name: String(row.name),
  workspaceId: String(row.workspace_id),
});

export function createSupabaseClientRepository(client: SupabaseClient): ClientRepository {
  return {
    async archive(workspaceId, id) {
      const { data, error } = await client
        .from("clients")
        .update({ archived_at: new Date().toISOString() })
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select("id,name,workspace_id")
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapClient(data) : null;
    },
    async create(workspaceId, name) {
      const { data, error } = await client
        .from("clients")
        .insert({ name, workspace_id: workspaceId })
        .select("id,name,workspace_id")
        .single();
      if (error || !data) throw new DomainError("CONFLICT");
      return mapClient(data);
    },
    async findById(workspaceId, id) {
      const { data, error } = await client
        .from("clients")
        .select("id,name,workspace_id")
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapClient(data) : null;
    },
    async list(workspaceId, limit) {
      const { data, error } = await client
        .from("clients")
        .select("id,name,workspace_id")
        .eq("workspace_id", workspaceId)
        .is("archived_at", null)
        .order("name")
        .limit(limit);
      if (error) throw new DomainError("CONFLICT");
      return (data ?? []).map(mapClient);
    },
    async update(workspaceId, id, name) {
      const { data, error } = await client
        .from("clients")
        .update({ name })
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select("id,name,workspace_id")
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapClient(data) : null;
    },
  };
}
