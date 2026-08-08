import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DeliverableStatus,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "../../types/database";
import { DomainError } from "../authorization/errors";
import type { ProjectTask } from "./workspace";
import type { ProjectWorkspaceRepository } from "./workspace-service";

export function createSupabaseProjectWorkspaceRepository(
  client: SupabaseClient,
): ProjectWorkspaceRepository {
  return {
    async load(workspaceId, projectId) {
      const [projectResult, workspaceResult, deliveryResult, memberResult] = await Promise.all([
        client
          .from("projects")
          .select("id,client_id,name,description,status")
          .eq("workspace_id", workspaceId)
          .eq("id", projectId)
          .is("archived_at", null)
          .maybeSingle(),
        client.from("workspaces").select("timezone").eq("id", workspaceId).maybeSingle(),
        client
          .from("deliverables")
          .select("id,name,status,due_at")
          .eq("workspace_id", workspaceId)
          .eq("project_id", projectId)
          .is("archived_at", null)
          .order("due_at", { nullsFirst: false })
          .limit(100),
        client
          .from("memberships")
          .select("user_id,profiles(display_name)")
          .eq("workspace_id", workspaceId)
          .is("archived_at", null)
          .limit(100),
      ]);
      if (
        projectResult.error ||
        workspaceResult.error ||
        deliveryResult.error ||
        memberResult.error
      )
        throw new DomainError("CONFLICT");
      if (!projectResult.data || !workspaceResult.data) return null;
      const deliveryRows = deliveryResult.data ?? [];
      const deliveryIds = deliveryRows.map((row) => String(row.id));
      const taskResult = deliveryIds.length
        ? await client
            .from("tasks")
            .select(
              "id,deliverable_id,assignee_id,title,description,status,priority,due_at,is_blocked,block_reason",
            )
            .eq("workspace_id", workspaceId)
            .in("deliverable_id", deliveryIds)
            .is("archived_at", null)
            .order("due_at", { nullsFirst: false })
            .limit(100)
        : { data: [], error: null };
      if (taskResult.error) throw new DomainError("CONFLICT");
      const members = (memberResult.data ?? []).map((row) => ({
        id: String(row.user_id),
        name: profileName(row.profiles),
      }));
      const names = new Map(members.map((member) => [member.id, member.name]));
      return {
        deliverables: deliveryRows.map((row) => ({
          dueAt: row.due_at ? String(row.due_at) : null,
          id: String(row.id),
          name: String(row.name),
          status: row.status as DeliverableStatus,
        })),
        members,
        project: {
          clientId: String(projectResult.data.client_id),
          description: String(projectResult.data.description),
          id: String(projectResult.data.id),
          name: String(projectResult.data.name),
          status: projectResult.data.status as ProjectStatus,
        },
        tasks: (taskResult.data ?? []).map((row) =>
          mapTask(row as unknown as Record<string, unknown>, names, deliveryRows),
        ),
        timezone: String(workspaceResult.data.timezone),
      };
    },
  };
}

function mapTask(
  row: Record<string, unknown>,
  names: Map<string, string>,
  deliveries: ReadonlyArray<{ id: unknown; name: unknown }>,
): ProjectTask {
  const deliveryId = String(row.deliverable_id);
  const delivery = deliveries.find((item) => String(item.id) === deliveryId);
  if (!delivery) throw new DomainError("CONFLICT");
  const assigneeId = row.assignee_id ? String(row.assignee_id) : null;
  return {
    assigneeId,
    assigneeName: assigneeId ? (names.get(assigneeId) ?? "Membro") : "Sem responsável",
    blockReason: row.block_reason ? String(row.block_reason) : null,
    deliverableId: deliveryId,
    deliverableName: String(delivery.name),
    description: String(row.description),
    dueAt: row.due_at ? String(row.due_at) : null,
    id: String(row.id),
    isBlocked: Boolean(row.is_blocked),
    priority: row.priority as TaskPriority,
    status: row.status as TaskStatus,
    title: String(row.title),
  };
}
function profileName(value: unknown) {
  const profile = Array.isArray(value) ? value[0] : value;
  return String((profile as { display_name?: string } | null)?.display_name ?? "Membro");
}
