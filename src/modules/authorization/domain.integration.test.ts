import { afterEach, describe, expect, it } from "vitest";
import type { PGlite } from "@electric-sql/pglite";

import {
  applySeed,
  assumeAuthenticatedUser,
  createMigratedDatabase,
} from "../../server/database/test-database";
import type { AuditWriter } from "../audit/repository";
import type { ClientRecord, ClientRepository } from "../clients/repository";
import { createClientService } from "../clients/service";
import { resolveAuthorizationContext, type MembershipReader } from "./service";

const auroraAdminId = "00000000-0000-0000-0000-000000000101";
const horizonteAdminId = "00000000-0000-0000-0000-000000000103";
const auroraWorkspaceId = "10000000-0000-0000-0000-000000000001";
const horizonteWorkspaceId = "10000000-0000-0000-0000-000000000002";
const auroraClientId = "20000000-0000-0000-0000-000000000001";

const databases: PGlite[] = [];
afterEach(async () => Promise.all(databases.splice(0).map((database) => database.close())));

describe("tenant-safe domain integration", () => {
  it("isolates two workspaces and persists an audited mutation", async () => {
    const database = await createMigratedDatabase();
    databases.push(database);
    await applySeed(database);
    const memberships = membershipReader(database);
    const clients = clientRepository(database);
    const service = createClientService(clients, auditWriter(database));

    await assumeAuthenticatedUser(database, auroraAdminId);
    const aurora = await resolveAuthorizationContext(
      { id: auroraAdminId },
      auroraWorkspaceId,
      memberships,
    );
    expect((await service.get(aurora, { id: auroraClientId })).name).toBe("Órbita Tecnologia");
    const created = await service.create(aurora, { name: "Cliente Integração" });

    const audit = await database.query<{ actor_id: string; workspace_id: string }>(
      "select actor_id::text, workspace_id::text from public.audit_logs where workspace_id = $1 and entity_id = $2",
      [aurora.workspaceId, created.id],
    );
    expect(audit.rows).toEqual([{ actor_id: aurora.actorId, workspace_id: aurora.workspaceId }]);

    await assumeAuthenticatedUser(database, horizonteAdminId);
    const horizonte = await resolveAuthorizationContext(
      { id: horizonteAdminId },
      horizonteWorkspaceId,
      memberships,
    );
    await expect(service.get(horizonte, { id: auroraClientId })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    expect((await service.list(horizonte)).map((client) => client.name)).toEqual([
      "Norte Comércio",
    ]);
  }, 20_000);
});

function membershipReader(database: PGlite): MembershipReader {
  return {
    async findActiveMembership(userId, workspaceId) {
      const result = await database.query<{
        role: "ADMIN" | "MEMBER";
        user_id: string;
        workspace_id: string;
      }>(
        "select role::text, user_id::text, workspace_id::text from public.memberships where user_id = $1 and workspace_id = $2 and archived_at is null",
        [userId, workspaceId],
      );
      const row = result.rows[0];
      return row ? { role: row.role, userId: row.user_id, workspaceId: row.workspace_id } : null;
    },
  };
}

function clientRepository(database: PGlite): ClientRepository {
  const map = (row: { id: string; name: string; workspace_id: string }): ClientRecord => ({
    id: row.id,
    name: row.name,
    workspaceId: row.workspace_id,
  });
  return {
    async archive(workspaceId, id) {
      const result = await database.query<{ id: string; name: string; workspace_id: string }>(
        "update public.clients set archived_at = now() where workspace_id = $1 and id = $2 and archived_at is null returning id::text,name,workspace_id::text",
        [workspaceId, id],
      );
      return result.rows[0] ? map(result.rows[0]) : null;
    },
    async create(workspaceId, name) {
      const result = await database.query<{ id: string; name: string; workspace_id: string }>(
        "insert into public.clients (workspace_id,name) values ($1,$2) returning id::text,name,workspace_id::text",
        [workspaceId, name],
      );
      return map(result.rows[0]!);
    },
    async findById(workspaceId, id) {
      const result = await database.query<{ id: string; name: string; workspace_id: string }>(
        "select id::text,name,workspace_id::text from public.clients where workspace_id = $1 and id = $2 and archived_at is null",
        [workspaceId, id],
      );
      return result.rows[0] ? map(result.rows[0]) : null;
    },
    async list(workspaceId, limit) {
      const result = await database.query<{ id: string; name: string; workspace_id: string }>(
        "select id::text,name,workspace_id::text from public.clients where workspace_id = $1 and archived_at is null order by name limit $2",
        [workspaceId, limit],
      );
      return result.rows.map(map);
    },
    async update(workspaceId, id, name) {
      const result = await database.query<{ id: string; name: string; workspace_id: string }>(
        "update public.clients set name = $3 where workspace_id = $1 and id = $2 and archived_at is null returning id::text,name,workspace_id::text",
        [workspaceId, id, name],
      );
      return result.rows[0] ? map(result.rows[0]) : null;
    },
  };
}

function auditWriter(database: PGlite): AuditWriter {
  return {
    async record(context, event) {
      await database.query(
        "insert into public.audit_logs (workspace_id,actor_id,action,entity_type,entity_id,metadata) values ($1,$2,$3,$4,$5,$6::jsonb)",
        [
          context.workspaceId,
          context.actorId,
          event.action,
          event.entityType,
          event.entityId,
          JSON.stringify(event.metadata ?? {}),
        ],
      );
    },
  };
}
