import type { SupabaseClient } from "@supabase/supabase-js";

import { DomainError } from "../authorization/errors";
import type { ProjectStatus } from "../../types/database";

export type ProjectRecord = Readonly<{
  clientId: string;
  description: string;
  id: string;
  name: string;
  status: ProjectStatus;
  workspaceId: string;
}>;
export type ProjectChanges = Readonly<{
  description?: string | null | undefined;
  name?: string | undefined;
  status?: ProjectStatus | undefined;
}>;
export interface ProjectRepository {
  archive(workspaceId: string, id: string): Promise<ProjectRecord | null>;
  create(
    workspaceId: string,
    input: { clientId: string; description?: string | null | undefined; name: string },
  ): Promise<ProjectRecord>;
  findById(workspaceId: string, id: string): Promise<ProjectRecord | null>;
  list(workspaceId: string, limit: number, clientId?: string): Promise<ProjectRecord[]>;
  update(workspaceId: string, id: string, changes: ProjectChanges): Promise<ProjectRecord | null>;
}
const mapProject = (row: Record<string, unknown>): ProjectRecord => ({
  clientId: String(row.client_id),
  description: String(row.description),
  id: String(row.id),
  name: String(row.name),
  status: row.status as ProjectStatus,
  workspaceId: String(row.workspace_id),
});

export function createSupabaseProjectRepository(client: SupabaseClient): ProjectRepository {
  return {
    async archive(workspaceId, id) {
      const { data, error } = await client
        .from("projects")
        .update({ archived_at: new Date().toISOString() })
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select("id,workspace_id,client_id,name,description,status")
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapProject(data) : null;
    },
    async create(workspaceId, input) {
      const { data, error } = await client
        .from("projects")
        .insert({
          client_id: input.clientId,
          description: input.description ?? "",
          name: input.name,
          workspace_id: workspaceId,
        })
        .select("id,workspace_id,client_id,name,description,status")
        .single();
      if (error || !data) throw new DomainError("CONFLICT");
      return mapProject(data);
    },
    async findById(workspaceId, id) {
      const { data, error } = await client
        .from("projects")
        .select("id,workspace_id,client_id,name,description,status")
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapProject(data) : null;
    },
    async list(workspaceId, limit, clientId) {
      let query = client
        .from("projects")
        .select("id,workspace_id,client_id,name,description,status")
        .eq("workspace_id", workspaceId)
        .is("archived_at", null)
        .order("name")
        .limit(limit);
      if (clientId) query = query.eq("client_id", clientId);
      const { data, error } = await query;
      if (error) throw new DomainError("CONFLICT");
      return (data ?? []).map(mapProject);
    },
    async update(workspaceId, id, changes) {
      const values: Record<string, unknown> = { last_activity_at: new Date().toISOString() };
      if (changes.name !== undefined) values.name = changes.name;
      if (changes.description !== undefined) values.description = changes.description ?? "";
      if (changes.status !== undefined) values.status = changes.status;
      const { data, error } = await client
        .from("projects")
        .update(values)
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select("id,workspace_id,client_id,name,description,status")
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapProject(data) : null;
    },
  };
}
