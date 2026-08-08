import type { PGlite } from "@electric-sql/pglite";
import { afterEach, describe, expect, it } from "vitest";

import {
  applySeed,
  assumeAuthenticatedUser,
  createMigratedDatabase,
} from "../../server/database/test-database";
import type { TaskPriority, TaskStatus } from "../../types/database";
import type { AuthorizationContext } from "../authorization/service";
import type { MyWorkRepository } from "./service";
import { createMyWorkService } from "./service";

const actorId = "00000000-0000-0000-0000-000000000102";
const workspaceId = "10000000-0000-0000-0000-000000000001";
const databases: PGlite[] = [];
afterEach(async () => Promise.all(databases.splice(0).map((database) => database.close())));

describe("My Work tenant integration", () => {
  it("returns only the authenticated member's current workspace tasks in deterministic groups", async () => {
    const database = await createMigratedDatabase();
    databases.push(database);
    await applySeed(database);
    await assumeAuthenticatedUser(database, actorId);
    const context: AuthorizationContext = { actorId, role: "MEMBER", workspaceId };

    const grouped = await createMyWorkService(repository(database), {
      now: () => new Date(),
    }).listMyWork(context);
    const ids = Object.values(grouped)
      .flat()
      .map((task) => task.id);

    expect(grouped.overdue.map((task) => task.id)).toContain(taskId(1));
    expect(grouped.upcoming.map((task) => task.id)).toEqual(
      expect.arrayContaining([taskId(3), taskId(5)]),
    );
    expect(grouped.awaitingApproval.map((task) => task.id)).toEqual([taskId(4)]);
    expect(ids).not.toContain(taskId(2));
    expect(ids).not.toContain(taskId(6));
    expect(ids).not.toContain(taskId(7));
    expect(new Set(ids).size).toBe(ids.length);
  }, 20_000);
});

function repository(database: PGlite): MyWorkRepository {
  return {
    async findWorkspaceTimezone(selectedWorkspaceId) {
      const result = await database.query<{ timezone: string }>(
        "select timezone from public.workspaces where id = $1",
        [selectedWorkspaceId],
      );
      return result.rows[0]?.timezone ?? null;
    },
    async findAssignedTasks(selectedWorkspaceId, selectedActorId) {
      const result = await database.query<Row>(
        `
        select t.id::text, t.assignee_id::text, t.title, t.status::text, t.priority::text,
          t.due_at::text, t.is_blocked, t.block_reason, d.id::text deliverable_id,
          d.name deliverable_name, p.id::text project_id, p.name project_name,
          c.id::text client_id, c.name client_name
        from public.tasks t
        join public.deliverables d on d.id = t.deliverable_id and d.workspace_id = t.workspace_id
        join public.projects p on p.id = d.project_id and p.workspace_id = t.workspace_id
        join public.clients c on c.id = p.client_id and c.workspace_id = t.workspace_id
        where t.workspace_id = $1 and t.assignee_id = $2 and t.archived_at is null and t.status <> 'DONE'
        order by t.due_at nulls last limit 100
      `,
        [selectedWorkspaceId, selectedActorId],
      );
      return result.rows.map((row) => ({
        assigneeId: row.assignee_id,
        blockReason: row.block_reason,
        clientId: row.client_id,
        clientName: row.client_name,
        deliverableId: row.deliverable_id,
        deliverableName: row.deliverable_name,
        dueAt: row.due_at,
        id: row.id,
        isBlocked: row.is_blocked,
        priority: row.priority,
        projectId: row.project_id,
        projectName: row.project_name,
        status: row.status,
        title: row.title,
      }));
    },
  };
}

type Row = {
  assignee_id: string;
  block_reason: string | null;
  client_id: string;
  client_name: string;
  deliverable_id: string;
  deliverable_name: string;
  due_at: string | null;
  id: string;
  is_blocked: boolean;
  priority: TaskPriority;
  project_id: string;
  project_name: string;
  status: TaskStatus;
  title: string;
};
function taskId(value: number) {
  return `50000000-0000-0000-0000-${String(value).padStart(12, "0")}`;
}
