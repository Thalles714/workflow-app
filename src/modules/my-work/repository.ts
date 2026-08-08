import type { SupabaseClient } from "@supabase/supabase-js";

import type { ApprovalStatus, TaskPriority, TaskStatus } from "../../types/database";
import { DomainError } from "../authorization/errors";
import type { MyWorkTask } from "./grouping";
import type { MyWorkRepository } from "./service";

const taskSelection = `
  id, assignee_id, title, status, priority, due_at, is_blocked, block_reason,
  deliverable:deliverables!inner(
    id, name, approvals(status),
    project:projects!inner(
      id, name,
      client:clients!inner(id, name)
    )
  )
`;

export function createSupabaseMyWorkRepository(client: SupabaseClient): MyWorkRepository {
  return {
    async findAssignedTasks(workspaceId, actorId) {
      const { data, error } = await client
        .from("tasks")
        .select(taskSelection)
        .eq("workspace_id", workspaceId)
        .eq("assignee_id", actorId)
        .neq("status", "DONE")
        .is("archived_at", null)
        .order("due_at", { nullsFirst: false })
        .limit(100);
      if (error) throw new DomainError("CONFLICT");
      return (data ?? []).map((row) => mapTask(row as unknown as Record<string, unknown>));
    },
    async findWorkspaceTimezone(workspaceId) {
      const { data, error } = await client
        .from("workspaces")
        .select("timezone")
        .eq("id", workspaceId)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      return data?.timezone ? String(data.timezone) : null;
    },
  };
}

function mapTask(row: Record<string, unknown>): MyWorkTask {
  const deliverable = relation(row.deliverable);
  const approvals = relations(deliverable.approvals);
  const project = relation(deliverable.project);
  const client = relation(project.client);
  return {
    assigneeId: String(row.assignee_id),
    approvalStatus: pendingApprovalStatus(approvals),
    blockReason: row.block_reason ? String(row.block_reason) : null,
    clientId: String(client.id),
    clientName: String(client.name),
    deliverableId: String(deliverable.id),
    deliverableName: String(deliverable.name),
    dueAt: row.due_at ? String(row.due_at) : null,
    id: String(row.id),
    isBlocked: Boolean(row.is_blocked),
    priority: row.priority as TaskPriority,
    projectId: String(project.id),
    projectName: String(project.name),
    status: row.status as TaskStatus,
    title: String(row.title),
  };
}

function relations(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (candidate): candidate is Record<string, unknown> =>
      Boolean(candidate) && typeof candidate === "object",
  );
}

function pendingApprovalStatus(
  approvals: readonly Record<string, unknown>[],
): ApprovalStatus | null {
  return approvals.some((approval) => approval.status === "PENDING") ? "PENDING" : null;
}

function relation(value: unknown): Record<string, unknown> {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || typeof candidate !== "object") throw new DomainError("CONFLICT");
  return candidate as Record<string, unknown>;
}
