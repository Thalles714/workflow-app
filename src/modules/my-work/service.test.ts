import { describe, expect, it, vi } from "vitest";

import type { AuthorizationContext } from "../authorization/service";
import type { MyWorkTask } from "./grouping";
import { createMyWorkService, type MyWorkRepository } from "./service";

const context: AuthorizationContext = {
  actorId: "00000000-0000-0000-0000-000000000102",
  role: "MEMBER",
  workspaceId: "00000000-0000-0000-0000-000000000001",
};

describe("My Work service", () => {
  it("derives tenant and assignee exclusively from the authorization context", async () => {
    const findAssignedTasks = vi
      .fn<MyWorkRepository["findAssignedTasks"]>()
      .mockResolvedValue([task({ dueAt: "2026-08-08T12:00:00.000Z" })]);
    const repository: MyWorkRepository = {
      findAssignedTasks,
      findWorkspaceTimezone: vi.fn().mockResolvedValue("America/Sao_Paulo"),
    };

    const result = await createMyWorkService(repository, {
      now: () => new Date("2026-08-08T10:00:00.000Z"),
    }).listMyWork(context);

    expect(findAssignedTasks).toHaveBeenCalledExactlyOnceWith(context.workspaceId, context.actorId);
    expect(repository.findWorkspaceTimezone).toHaveBeenCalledExactlyOnceWith(context.workspaceId);
    expect(result.today).toHaveLength(1);
  });

  it("fails closed when the workspace timezone is unavailable", async () => {
    const repository: MyWorkRepository = {
      findAssignedTasks: vi.fn(),
      findWorkspaceTimezone: vi.fn().mockResolvedValue(null),
    };

    await expect(createMyWorkService(repository).listMyWork(context)).rejects.toThrow(
      "Workspace timezone unavailable",
    );
    expect(repository.findAssignedTasks).not.toHaveBeenCalled();
  });
});

function task(overrides: Partial<MyWorkTask> = {}): MyWorkTask {
  return {
    assigneeId: context.actorId,
    approvalStatus: null,
    blockReason: null,
    clientId: "20000000-0000-0000-0000-000000000001",
    clientName: "Órbita",
    deliverableId: "40000000-0000-0000-0000-000000000001",
    deliverableName: "Landing page",
    dueAt: null,
    id: "50000000-0000-0000-0000-000000000001",
    isBlocked: false,
    priority: "MEDIUM",
    projectId: "30000000-0000-0000-0000-000000000001",
    projectName: "Lançamento",
    status: "TODO",
    title: "Tarefa",
    ...overrides,
  };
}
