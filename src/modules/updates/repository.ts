import type { SupabaseClient } from "@supabase/supabase-js";
import { DomainError } from "../authorization/errors";
export type TaskUpdateRecord = Readonly<{
  authorId: string;
  body: string;
  createdAt: string;
  id: string;
  taskId: string;
  workspaceId: string;
}>;
export interface TaskUpdateRepository {
  create(
    workspaceId: string,
    taskId: string,
    authorId: string,
    body: string,
  ): Promise<TaskUpdateRecord>;
  list(workspaceId: string, taskId: string, limit: number): Promise<TaskUpdateRecord[]>;
}
const selection = "id,workspace_id,task_id,author_id,body,created_at";
const map = (row: Record<string, unknown>): TaskUpdateRecord => ({
  authorId: String(row.author_id),
  body: String(row.body),
  createdAt: String(row.created_at),
  id: String(row.id),
  taskId: String(row.task_id),
  workspaceId: String(row.workspace_id),
});
export function createSupabaseTaskUpdateRepository(client: SupabaseClient): TaskUpdateRepository {
  return {
    async create(workspaceId, taskId, authorId, body) {
      const { data, error } = await client
        .from("task_updates")
        .insert({ workspace_id: workspaceId, task_id: taskId, author_id: authorId, body })
        .select(selection)
        .single();
      if (error || !data) throw new DomainError("CONFLICT");
      return map(data);
    },
    async list(workspaceId, taskId, limit) {
      const { data, error } = await client
        .from("task_updates")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .eq("task_id", taskId)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw new DomainError("CONFLICT");
      return (data ?? []).map(map);
    },
  };
}
