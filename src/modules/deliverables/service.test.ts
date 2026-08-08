import { describe, expect, it } from "vitest";

import type { AuditWriter } from "../audit/repository";
import type { AuthorizationContext } from "../authorization/service";
import type { ProjectRepository } from "../projects/repository";
import type { DeliverableRepository } from "./repository";
import { createDeliverableService } from "./service";

const context: AuthorizationContext = {
  actorId: "00000000-0000-0000-0000-000000000101",
  role: "ADMIN",
  workspaceId: "10000000-0000-0000-0000-000000000001",
};

describe("deliverable service", () => {
  it("rejects a parent project outside the authorized workspace before create", async () => {
    let created = false;
    const deliverables = {
      async create() {
        created = true;
        throw new Error("must not run");
      },
    } as unknown as DeliverableRepository;
    const projects = {
      async findById() {
        return null;
      },
    } as Pick<ProjectRepository, "findById">;
    const audit = { async record() {} } satisfies AuditWriter;
    const service = createDeliverableService(deliverables, projects, audit);

    await expect(
      service.create(context, {
        name: "Entrega cruzada",
        projectId: "30000000-0000-0000-0000-000000000003",
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(created).toBe(false);
  });
});
