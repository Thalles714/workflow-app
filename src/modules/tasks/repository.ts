import type { SupabaseClient } from "@supabase/supabase-js";

import { DomainError } from "../authorization/errors";
import type { TaskPriority, TaskStatus } from "../../types/database";

export type TaskRecord = Readonly<{
  assigneeId: string | null;
  blockReason: string | null;
  deliverableId: string;
  description: string;
  dueAt: string | null;
  id: string;
  isBlocked: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
  workspaceId: string;
}>;
export type TaskChanges = Readonly<{
  assigneeId?: string | null | undefined;
  block?: { blockReason: string | null; isBlocked: boolean } | undefined;
  description?: string | null | undefined;
  dueAt?: string | null | undefined;
  priority?: TaskPriority | undefined;
  status?: TaskStatus | undefined;
  title?: string | undefined;
}>;
export interface TaskRepository {
  archive(workspaceId: string, id: string): Promise<TaskRecord | null>;
  create(workspaceId: string, input: Omit<TaskRecord, "id" | "workspaceId">): Promise<TaskRecord>;
  findActiveMember(workspaceId: string, userId: string): Promise<boolean>;
  findById(workspaceId: string, id: string): Promise<TaskRecord | null>;
  list(
    workspaceId: string,
    limit: number,
    filters: { assigneeId?: string | undefined; deliverableId?: string | undefined },
  ): Promise<TaskRecord[]>;
  update(workspaceId: string, id: string, changes: TaskChanges): Promise<TaskRecord | null>;
}
const selection =
  "id,workspace_id,deliverable_id,assignee_id,title,description,status,priority,due_at,is_blocked,block_reason";
const mapTask = (row: Record<string, unknown>): TaskRecord => ({
  assigneeId: row.assignee_id ? String(row.assignee_id) : null,
  blockReason: row.block_reason ? String(row.block_reason) : null,
  deliverableId: String(row.deliverable_id),
  description: String(row.description),
  dueAt: row.due_at ? String(row.due_at) : null,
  id: String(row.id),
  isBlocked: Boolean(row.is_blocked),
  priority: row.priority as TaskPriority,
  status: row.status as TaskStatus,
  title: String(row.title),
  workspaceId: String(row.workspace_id),
});

export function createSupabaseTaskRepository(client: SupabaseClient): TaskRepository {
  return {
    async archive(workspaceId, id) {
      const { data, error } = await client
        .from("tasks")
        .update({ archived_at: new Date().toISOString() })
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select(selection)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapTask(data) : null;
    },
    async create(workspaceId, input) {
      const { data, error } = await client
        .from("tasks")
        .insert({
          assignee_id: input.assigneeId,
          block_reason: input.blockReason,
          deliverable_id: input.deliverableId,
          description: input.description,
          due_at: input.dueAt,
          is_blocked: input.isBlocked,
          priority: input.priority,
          status: input.status,
          title: input.title,
          workspace_id: workspaceId,
        })
        .select(selection)
        .single();
      if (error || !data) throw new DomainError("CONFLICT");
      return mapTask(data);
    },
    async findActiveMember(workspaceId, userId) {
      const { data, error } = await client
        .from("memberships")
        .select("user_id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", userId)
        .is("archived_at", null)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return Boolean(data);
    },
    async findById(workspaceId, id) {
      const { data, error } = await client
        .from("tasks")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapTask(data) : null;
    },
    async list(workspaceId, limit, filters) {
      let query = client
        .from("tasks")
        .select(selection)
        .eq("workspace_id", workspaceId)
        .is("archived_at", null)
        .order("due_at", { nullsFirst: false })
        .limit(limit);
      if (filters.assigneeId) query = query.eq("assignee_id", filters.assigneeId);
      if (filters.deliverableId) query = query.eq("deliverable_id", filters.deliverableId);
      const { data, error } = await query;
      if (error) throw new DomainError("CONFLICT");
      return (data ?? []).map(mapTask);
    },
    async update(workspaceId, id, changes) {
      const values: Record<string, unknown> = {};
      if (changes.assigneeId !== undefined) values.assignee_id = changes.assigneeId;
      if (changes.description !== undefined) values.description = changes.description ?? "";
      if (changes.dueAt !== undefined) values.due_at = changes.dueAt;
      if (changes.priority !== undefined) values.priority = changes.priority;
      if (changes.status !== undefined) values.status = changes.status;
      if (changes.title !== undefined) values.title = changes.title;
      if (changes.block !== undefined) {
        values.is_blocked = changes.block.isBlocked;
        values.block_reason = changes.block.blockReason;
      }
      const { data, error } = await client
        .from("tasks")
        .update(values)
        .eq("workspace_id", workspaceId)
        .eq("id", id)
        .is("archived_at", null)
        .select(selection)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data ? mapTask(data) : null;
    },
  };
}
