import type { PGlite } from "@electric-sql/pglite";
import { afterEach, describe, expect, it } from "vitest";

import {
  applySeed,
  assumeAuthenticatedUser,
  createMigratedDatabase,
} from "../../server/database/test-database";
import type {
  DeliverableStatus,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "../../types/database";
import type { AuthorizationContext } from "../authorization/service";
import type { ProjectTaskStatusWriter, ProjectWorkspaceRepository } from "./workspace-service";
import { createProjectWorkspaceService } from "./workspace-service";

const actorId = "00000000-0000-0000-0000-000000000101";
const workspaceId = "10000000-0000-0000-0000-000000000001";
const projectId = "30000000-0000-0000-0000-000000000001";
const taskId = "50000000-0000-0000-0000-000000000003";
const databases: PGlite[] = [];
afterEach(async () => Promise.all(databases.splice(0).map((database) => database.close())));

describe("project workspace database integration", () => {
  it("isolates the project source and reflects one audited status change in every view", async () => {
    const database = await createMigratedDatabase();
    databases.push(database);
    await applySeed(database);
    await assumeAuthenticatedUser(database, actorId);
    const context: AuthorizationContext = { actorId, role: "ADMIN", workspaceId };
    const service = createProjectWorkspaceService(repository(database), writer(database));

    const initial = await service.getProjectWorkspace(context, projectId, {});
    expect(initial.tasks.map((task) => task.id)).toContain(taskId);
    expect(initial.tasks.map((task) => task.id)).not.toContain(
      "50000000-0000-0000-0000-000000000007",
    );
    expect(initial.summary.total).toBe(initial.tasks.length);

    await service.changeProjectTaskStatus(context, taskId, "IN_REVIEW");
    const refreshed = await service.getProjectWorkspace(context, projectId, {
      status: "IN_REVIEW",
    });
    expect(refreshed.tasks.map((task) => task.id)).toContain(taskId);
    const audit = await database.query<{ action: string }>(
      "select action from public.audit_logs where workspace_id = $1 and entity_id = $2 order by created_at desc limit 1",
      [workspaceId, taskId],
    );
    expect(audit.rows).toEqual([{ action: "task.updated" }]);
  }, 20_000);
});

function repository(database: PGlite): ProjectWorkspaceRepository {
  return {
    async load(selectedWorkspaceId, selectedProjectId) {
      const project = await database.query<{
        client_id: string;
        description: string;
        id: string;
        name: string;
        status: ProjectStatus;
        timezone: string;
      }>(
        "select p.id::text,p.client_id::text,p.name,p.description,p.status::text,w.timezone from public.projects p join public.workspaces w on w.id=p.workspace_id where p.workspace_id=$1 and p.id=$2 and p.archived_at is null",
        [selectedWorkspaceId, selectedProjectId],
      );
      if (!project.rows[0]) return null;
      const deliveries = await database.query<{
        due_at: string | null;
        id: string;
        name: string;
        status: DeliverableStatus;
      }>(
        "select id::text,name,status::text,due_at::text from public.deliverables where workspace_id=$1 and project_id=$2 and archived_at is null",
        [selectedWorkspaceId, selectedProjectId],
      );
      const tasks = await database.query<Row>(
        "select t.id::text,t.assignee_id::text,t.title,t.description,t.status::text,t.priority::text,t.due_at::text,t.is_blocked,t.block_reason,d.id::text deliverable_id,d.name deliverable_name,coalesce(p.display_name,'Sem responsável') assignee_name from public.tasks t join public.deliverables d on d.id=t.deliverable_id and d.workspace_id=t.workspace_id left join public.profiles p on p.id=t.assignee_id where t.workspace_id=$1 and d.project_id=$2 and t.archived_at is null order by t.due_at nulls last",
        [selectedWorkspaceId, selectedProjectId],
      );
      const members = await database.query<{ id: string; name: string }>(
        "select m.user_id::text id,p.display_name name from public.memberships m join public.profiles p on p.id=m.user_id where m.workspace_id=$1 and m.archived_at is null",
        [selectedWorkspaceId],
      );
      const source = project.rows[0];
      return {
        deliverables: deliveries.rows.map((item) => ({
          dueAt: item.due_at,
          id: item.id,
          name: item.name,
          status: item.status,
        })),
        members: members.rows,
        project: {
          clientId: source.client_id,
          description: source.description,
          id: source.id,
          name: source.name,
          status: source.status,
        },
        tasks: tasks.rows.map((row) => ({
          assigneeId: row.assignee_id,
          assigneeName: row.assignee_name,
          blockReason: row.block_reason,
          deliverableId: row.deliverable_id,
          deliverableName: row.deliverable_name,
          description: row.description,
          dueAt: row.due_at,
          id: row.id,
          isBlocked: row.is_blocked,
          priority: row.priority,
          status: row.status,
          title: row.title,
        })),
        timezone: source.timezone,
      };
    },
  };
}
function writer(database: PGlite): ProjectTaskStatusWriter {
  return {
    async update(context, input) {
      const result = await database.query<Row>(
        "update public.tasks set status=$3 where workspace_id=$1 and id=$2 returning id::text,status::text",
        [context.workspaceId, input.id, input.status],
      );
      await database.query(
        "insert into public.audit_logs (workspace_id,actor_id,action,entity_type,entity_id,metadata) values ($1,$2,'task.updated','task',$3,$4::jsonb)",
        [context.workspaceId, context.actorId, input.id, JSON.stringify({ status: input.status })],
      );
      return result.rows[0];
    },
  };
}
type Row = {
  assignee_id: string | null;
  assignee_name: string;
  block_reason: string | null;
  deliverable_id: string;
  deliverable_name: string;
  description: string;
  due_at: string | null;
  id: string;
  is_blocked: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
};
