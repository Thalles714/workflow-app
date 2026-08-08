import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ApprovalStatus,
  DeliverableStatus,
  ProjectStatus,
  TaskStatus,
} from "../../types/database";
import { DomainError } from "../authorization/errors";
import type { AttentionRepository } from "./service";

export function createSupabaseAttentionRepository(client: SupabaseClient): AttentionRepository {
  return {
    async load(workspaceId) {
      const [workspace, clients, projects, deliveries, tasks, approvals, members] =
        await Promise.all([
          client.from("workspaces").select("timezone").eq("id", workspaceId).maybeSingle(),
          client
            .from("clients")
            .select("id,name")
            .eq("workspace_id", workspaceId)
            .is("archived_at", null)
            .limit(100),
          client
            .from("projects")
            .select("id,client_id,name,status,last_activity_at")
            .eq("workspace_id", workspaceId)
            .is("archived_at", null)
            .limit(100),
          client
            .from("deliverables")
            .select("id,project_id,name,status,due_at,is_important,updated_at")
            .eq("workspace_id", workspaceId)
            .is("archived_at", null)
            .limit(100),
          client
            .from("tasks")
            .select("id,deliverable_id,title,status,due_at,is_blocked,block_reason,assignee_id")
            .eq("workspace_id", workspaceId)
            .is("archived_at", null)
            .limit(100),
          client
            .from("approvals")
            .select("id,deliverable_id,status,requested_at")
            .eq("workspace_id", workspaceId)
            .limit(100),
          client
            .from("memberships")
            .select("user_id,profiles(display_name)")
            .eq("workspace_id", workspaceId)
            .is("archived_at", null)
            .limit(100),
        ]);
      if (
        !workspace.data ||
        [workspace, clients, projects, deliveries, tasks, approvals, members].some(
          (result) => result.error,
        )
      )
        throw new DomainError("CONFLICT");
      const names = new Map(
        (members.data ?? []).map((row) => [String(row.user_id), profileName(row.profiles)]),
      );
      return {
        timezone: String(workspace.data.timezone),
        clients: (clients.data ?? []).map((row) => ({
          id: String(row.id),
          name: String(row.name),
        })),
        projects: (projects.data ?? []).map((row) => ({
          clientId: String(row.client_id),
          id: String(row.id),
          lastActivityAt: String(row.last_activity_at),
          name: String(row.name),
          status: row.status as ProjectStatus,
        })),
        deliverables: (deliveries.data ?? []).map((row) => ({
          completedAt: row.status === "COMPLETED" ? String(row.updated_at) : null,
          dueAt: row.due_at ? String(row.due_at) : null,
          id: String(row.id),
          isImportant: Boolean(row.is_important),
          name: String(row.name),
          projectId: String(row.project_id),
          status: row.status as DeliverableStatus,
        })),
        tasks: (tasks.data ?? []).map((row) => ({
          assigneeName: row.assignee_id
            ? (names.get(String(row.assignee_id)) ?? "Membro")
            : "Sem responsável",
          blockReason: row.block_reason ? String(row.block_reason) : null,
          deliverableId: String(row.deliverable_id),
          dueAt: row.due_at ? String(row.due_at) : null,
          id: String(row.id),
          isBlocked: Boolean(row.is_blocked),
          status: row.status as TaskStatus,
          title: String(row.title),
        })),
        approvals: (approvals.data ?? []).map((row) => ({
          deliverableId: String(row.deliverable_id),
          id: String(row.id),
          requestedAt: String(row.requested_at),
          status: row.status as ApprovalStatus,
        })),
      };
    },
  };
}
function profileName(value: unknown) {
  const profile = Array.isArray(value) ? value[0] : value;
  return String((profile as { display_name?: string } | null)?.display_name ?? "Membro");
}
