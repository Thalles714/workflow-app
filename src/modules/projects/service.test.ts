import { describe, expect, it } from "vitest";

import type { AuditWriter } from "../audit/repository";
import type { AuthorizationContext } from "../authorization/service";
import type { ClientRepository } from "../clients/repository";
import type { ProjectRepository } from "./repository";
import { createProjectService } from "./service";

const context: AuthorizationContext = {
  actorId: "00000000-0000-0000-0000-000000000101",
  role: "ADMIN",
  workspaceId: "10000000-0000-0000-0000-000000000001",
};

describe("project service", () => {
  it("rejects a parent client outside the authorized workspace before create", async () => {
    let created = false;
    const projects = {
      async create() {
        created = true;
        throw new Error("must not run");
      },
    } as unknown as ProjectRepository;
    const clients = {
      async findById() {
        return null;
      },
    } as Pick<ClientRepository, "findById">;
    const audit = { async record() {} } satisfies AuditWriter;
    const service = createProjectService(projects, clients, audit);

    await expect(
      service.create(context, {
        clientId: "20000000-0000-0000-0000-000000000002",
        name: "Projeto cruzado",
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(created).toBe(false);
  });
});
