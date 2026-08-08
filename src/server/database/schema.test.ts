import { afterEach, describe, expect, it } from "vitest";

import {
  applySeed,
  assumeAnonymous,
  assumeAuthenticatedUser,
  createMigratedDatabase,
} from "./test-database";

const auroraMemberId = "00000000-0000-0000-0000-000000000102";
const horizonteAdminId = "00000000-0000-0000-0000-000000000103";

const databases: Awaited<ReturnType<typeof createMigratedDatabase>>[] = [];

afterEach(async () => {
  await Promise.all(databases.splice(0).map((database) => database.close()));
});

describe("versioned database", () => {
  it("migrates a clean database and applies the demo seed twice", async () => {
    const database = await createMigratedDatabase();
    databases.push(database);

    await applySeed(database);
    await applySeed(database);

    const result = await database.query<{
      alerts: number;
      clients: number;
      memberships: number;
      tasks: number;
      workspaces: number;
    }>(`
      select
        (select count(*)::int from public.workspaces) as workspaces,
        (select count(*)::int from public.memberships) as memberships,
        (select count(*)::int from public.clients) as clients,
        (select count(*)::int from public.tasks) as tasks,
        (select count(distinct rule_key)::int from public.attention_alerts) as alerts
    `);

    expect(result.rows[0]).toEqual({
      alerts: 6,
      clients: 2,
      memberships: 3,
      tasks: 7,
      workspaces: 2,
    });
  }, 15_000);

  it("rejects anonymous reads", async () => {
    const database = await seededDatabase();
    await assumeAnonymous(database);

    await expect(database.query("select * from public.workspaces")).rejects.toThrow();
  });

  it("only exposes rows from the authenticated user's workspace", async () => {
    const database = await seededDatabase();
    await assumeAuthenticatedUser(database, auroraMemberId);

    const workspaces = await database.query<{ name: string }>(
      "select name from public.workspaces order by name",
    );
    const clients = await database.query<{ name: string }>(
      "select name from public.clients order by name",
    );

    expect(workspaces.rows).toEqual([{ name: "Agência Aurora" }]);
    expect(clients.rows).toEqual([{ name: "Órbita Tecnologia" }]);
  });

  it("rejects a cross-tenant relationship even for an administrator", async () => {
    const database = await seededDatabase();
    await assumeAuthenticatedUser(database, horizonteAdminId);

    await expect(
      database.query(
        `insert into public.projects (workspace_id, client_id, name)
         values ($1, $2, $3)`,
        [
          "10000000-0000-0000-0000-000000000002",
          "20000000-0000-0000-0000-000000000001",
          "Projeto inválido",
        ],
      ),
    ).rejects.toThrow();
  });

  it("requires a non-empty reason for every blocked task", async () => {
    const database = await seededDatabase();

    await expect(
      database.query(
        `insert into public.tasks
          (workspace_id, deliverable_id, title, status, priority, is_blocked, block_reason)
         values ($1, $2, $3, 'TODO', 'MEDIUM', true, $4)`,
        [
          "10000000-0000-0000-0000-000000000001",
          "40000000-0000-0000-0000-000000000001",
          "Bloqueio inválido",
          "   ",
        ],
      ),
    ).rejects.toThrow();
  });
});

async function seededDatabase() {
  const database = await createMigratedDatabase();
  databases.push(database);
  await applySeed(database);
  return database;
}
