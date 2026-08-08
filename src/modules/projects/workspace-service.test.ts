import { describe, expect, it, vi } from "vitest";

import type { AuthorizationContext } from "../authorization/service";
import {
  createProjectWorkspaceService,
  type ProjectWorkspaceRepository,
} from "./workspace-service";

const context: AuthorizationContext = {
  actorId: "actor-1",
  role: "ADMIN",
  workspaceId: "workspace-1",
};

describe("project workspace service", () => {
  it("loads one tenant-scoped source and exposes the same filtered records to every view", async () => {
    const load = vi.fn<ProjectWorkspaceRepository["load"]>().mockResolvedValue({
      deliverables: [
        { dueAt: null, id: "delivery-1", name: "Landing page", status: "IN_PROGRESS" },
      ],
      members: [{ id: "actor-1", name: "Ana" }],
      project: {
        clientId: "client-1",
        description: "Campanha",
        id: "project-1",
        name: "Lançamento Q3",
        status: "ACTIVE",
      },
      tasks: [
        {
          assigneeId: "actor-1",
          assigneeName: "Ana",
          blockReason: null,
          deliverableId: "delivery-1",
          deliverableName: "Landing page",
          description: "",
          dueAt: null,
          id: "task-1",
          isBlocked: false,
          priority: "HIGH",
          status: "TODO",
          title: "Criar formulário",
        },
      ],
      timezone: "America/Sao_Paulo",
    });

    const result = await createProjectWorkspaceService({ load }).getProjectWorkspace(
      context,
      "project-1",
      { priority: "HIGH" },
    );

    expect(load).toHaveBeenCalledExactlyOnceWith("workspace-1", "project-1");
    expect(result.tasks.map((task) => task.id)).toEqual(["task-1"]);
    expect(result.summary.total).toBe(result.tasks.length);
  });

  it("changes status through the audited task service contract", async () => {
    const update = vi.fn().mockResolvedValue({ id: "task-1", status: "DONE" });
    const service = createProjectWorkspaceService({ load: vi.fn() }, { update });

    await expect(service.changeProjectTaskStatus(context, "task-1", "DONE")).resolves.toMatchObject(
      { status: "DONE" },
    );
    expect(update).toHaveBeenCalledExactlyOnceWith(context, { id: "task-1", status: "DONE" });
  });
});
