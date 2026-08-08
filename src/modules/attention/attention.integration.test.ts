import type { PGlite } from "@electric-sql/pglite";
import { afterEach, describe, expect, it } from "vitest";
import {
  applySeed,
  assumeAuthenticatedUser,
  createMigratedDatabase,
} from "../../server/database/test-database";
import type { AttentionRepository, AttentionSource } from "./service";
import { createAttentionService } from "./service";

const workspaceId = "10000000-0000-0000-0000-000000000001";
const actorId = "00000000-0000-0000-0000-000000000101";
const databases: PGlite[] = [];
afterEach(async () => Promise.all(databases.splice(0).map((database) => database.close())));

describe("operation attention database integration", () => {
  it("covers all severities from the seed without leaking the second workspace", async () => {
    const database = await createMigratedDatabase();
    databases.push(database);
    await applySeed(database);
    await assumeAuthenticatedUser(database, actorId);
    const result = await createAttentionService(repository(database)).getOperationAttention({
      actorId,
      role: "ADMIN",
      workspaceId,
    });
    expect(new Set(result.alerts.map((alert) => alert.severity))).toEqual(
      new Set(["CRITICAL", "RISK", "ATTENTION", "INFO"]),
    );
    expect(result.alerts.map((alert) => alert.severity)).toEqual([
      "CRITICAL",
      "RISK",
      "RISK",
      "ATTENTION",
      "ATTENTION",
      "INFO",
    ]);
    expect(result.alerts.map((alert) => alert.title)).toEqual([
      "Landing page bloqueada por tarefa atrasada",
      "Peças do lançamento vence com pendências",
      "Reposicionamento Atlas está sem atualização",
      "Kit de lançamento aguarda aprovação",
      "Validar analytics está bloqueada",
      "Guia de campanha está próxima e saudável",
    ]);
    expect(result.alerts.some((alert) => alert.title.includes("Planejar vitrine"))).toBe(false);
    expect(result.metrics).toMatchObject({
      overdueTasks: 1,
      pendingApprovals: 1,
      projectsAtRisk: 1,
    });
  }, 20_000);
});

function repository(database: PGlite): AttentionRepository {
  return {
    async load(selectedWorkspaceId) {
      const result = await database.query<{ source: AttentionSource }>(
        `select json_build_object(
    'timezone', w.timezone,
    'clients', coalesce((select json_agg(json_build_object('id',c.id::text,'name',c.name)) from public.clients c where c.workspace_id=w.id and c.archived_at is null),'[]'::json),
    'projects', coalesce((select json_agg(json_build_object('id',p.id::text,'clientId',p.client_id::text,'name',p.name,'status',p.status::text,'lastActivityAt',p.last_activity_at::text)) from public.projects p where p.workspace_id=w.id and p.archived_at is null),'[]'::json),
    'deliverables', coalesce((select json_agg(json_build_object('id',d.id::text,'projectId',d.project_id::text,'name',d.name,'status',d.status::text,'dueAt',d.due_at::text,'completedAt',case when d.status='COMPLETED' then d.updated_at::text else null end,'isImportant',d.is_important)) from public.deliverables d where d.workspace_id=w.id and d.archived_at is null),'[]'::json),
    'tasks', coalesce((select json_agg(json_build_object('id',t.id::text,'deliverableId',t.deliverable_id::text,'title',t.title,'status',t.status::text,'dueAt',t.due_at::text,'isBlocked',t.is_blocked,'blockReason',t.block_reason,'assigneeName',coalesce(pr.display_name,'Sem responsável'))) from public.tasks t left join public.profiles pr on pr.id=t.assignee_id where t.workspace_id=w.id and t.archived_at is null),'[]'::json),
    'approvals', coalesce((select json_agg(json_build_object('id',a.id::text,'deliverableId',a.deliverable_id::text,'status',a.status::text,'requestedAt',a.requested_at::text)) from public.approvals a where a.workspace_id=w.id),'[]'::json)
  ) source from public.workspaces w where w.id=$1`,
        [selectedWorkspaceId],
      );
      return result.rows[0]!.source;
    },
  };
}
