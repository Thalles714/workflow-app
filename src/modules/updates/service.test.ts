import { describe, expect, it } from "vitest";

import type { AuditEvent, AuditWriter } from "../audit/repository";
import type { AuthorizationContext } from "../authorization/service";
import type { TaskRecord, TaskRepository } from "../tasks/repository";
import type { TaskUpdateRecord, TaskUpdateRepository } from "./repository";
import { createTaskUpdateService } from "./service";

const context: AuthorizationContext = {
  actorId: "00000000-0000-0000-0000-000000000101",
  role: "ADMIN",
  workspaceId: "10000000-0000-0000-0000-000000000001",
};
const taskId = "50000000-0000-0000-0000-000000000001";

function harness(found = true) {
  const events: AuditEvent[] = [];
  const updates: TaskUpdateRecord[] = [];
  const repository: TaskUpdateRepository = {
    async create(workspaceId, selectedTaskId, authorId, body) {
      const record: TaskUpdateRecord = {
        authorId,
        body,
        createdAt: new Date().toISOString(),
        id: "60000000-0000-0000-0000-000000000001",
        taskId: selectedTaskId,
        workspaceId,
      };
      updates.push(record);
      return record;
    },
    async list() {
      return updates;
    },
  };
  const tasks: Pick<TaskRepository, "findById"> = {
    async findById() {
      return found ? ({ id: taskId } as TaskRecord) : null;
    },
  };
  const audit: AuditWriter = {
    async record(_context, event) {
      events.push(event);
    },
  };
  return { events, service: createTaskUpdateService(repository, tasks, audit), updates };
}

describe("task update service", () => {
  it("creates an append-only update and audits its author and task", async () => {
    const { events, service, updates } = harness();

    await expect(
      service.create(context, { body: "Aguardando material final.", taskId }),
    ).resolves.toMatchObject({
      authorId: context.actorId,
      taskId,
    });

    expect(updates).toHaveLength(1);
    expect(events).toEqual([
      expect.objectContaining({ action: "task_update.created", metadata: { taskId } }),
    ]);
  });

  it("does not create an update for a task outside the authorized workspace", async () => {
    const { service } = harness(false);
    await expect(service.create(context, { body: "Tentativa", taskId })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
