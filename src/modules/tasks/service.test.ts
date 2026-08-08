import { describe, expect, it } from "vitest";

import type { AuditEvent, AuditWriter } from "../audit/repository";
import type { AuthorizationContext } from "../authorization/service";
import type { DeliverableRecord } from "../deliverables/repository";
import type { TaskRecord, TaskRepository } from "./repository";
import { createTaskService } from "./service";

const workspaceId = "10000000-0000-0000-0000-000000000001";
const member: AuthorizationContext = {
  actorId: "00000000-0000-0000-0000-000000000102",
  role: "MEMBER",
  workspaceId,
};
const task: TaskRecord = {
  assigneeId: member.actorId,
  blockReason: null,
  deliverableId: "40000000-0000-0000-0000-000000000001",
  description: "",
  dueAt: null,
  id: "50000000-0000-0000-0000-000000000001",
  isBlocked: false,
  priority: "MEDIUM",
  status: "TODO",
  title: "Preparar revisão",
  workspaceId,
};
const deliverable = { id: task.deliverableId, workspaceId } as DeliverableRecord;

function harness(current: TaskRecord = task) {
  const events: AuditEvent[] = [];
  const repository: TaskRepository = {
    async archive() {
      return current;
    },
    async create(targetWorkspace, input) {
      return { ...input, id: task.id, workspaceId: targetWorkspace };
    },
    async findActiveMember(targetWorkspace, userId) {
      return targetWorkspace === workspaceId && userId === member.actorId;
    },
    async findById(targetWorkspace, id) {
      return targetWorkspace === current.workspaceId && id === current.id ? current : null;
    },
    async list(targetWorkspace) {
      return targetWorkspace === current.workspaceId ? [current] : [];
    },
    async update(targetWorkspace, id, changes) {
      if (targetWorkspace !== current.workspaceId || id !== current.id) return null;
      return {
        ...current,
        description: changes.description ?? current.description,
        status: changes.status ?? current.status,
      };
    },
  };
  const audit: AuditWriter = {
    async record(_context, event) {
      events.push(event);
    },
  };
  const service = createTaskService(
    repository,
    {
      async findById(targetWorkspace, id) {
        return targetWorkspace === workspaceId && id === deliverable.id ? deliverable : null;
      },
    },
    audit,
  );
  return { events, service };
}

describe("task service", () => {
  it("allows an assignee MEMBER to update execution state and audits it", async () => {
    const { events, service } = harness();
    const updated = await service.update(member, { id: task.id, status: "IN_PROGRESS" });
    expect(updated.status).toBe("IN_PROGRESS");
    expect(events[0]).toMatchObject({ action: "task.updated", entityId: task.id });
  });

  it("denies a MEMBER changing management-owned fields", async () => {
    const { events, service } = harness();
    await expect(service.update(member, { id: task.id, priority: "URGENT" })).rejects.toMatchObject(
      { code: "FORBIDDEN" },
    );
    expect(events).toHaveLength(0);
  });

  it("denies a MEMBER updating a task assigned to someone else", async () => {
    const { service } = harness({ ...task, assigneeId: "00000000-0000-0000-0000-000000000101" });
    await expect(service.update(member, { id: task.id, status: "DONE" })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("rejects inconsistent block data", async () => {
    const { service } = harness();
    await expect(
      service.update(member, { block: { blockReason: null, isBlocked: true }, id: task.id }),
    ).rejects.toMatchObject({ name: "ZodError" });
  });
});
