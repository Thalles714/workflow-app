import type { AuditWriter } from "../audit/repository";
import { DomainError } from "../authorization/errors";
import type { AuthorizationContext } from "../authorization/service";
import { AuthorizationError, requireAdmin } from "../authorization/service";
import type { DeliverableRepository } from "../deliverables/repository";

import type { TaskRepository } from "./repository";
import { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema } from "./schemas";

export function createTaskService(
  repository: TaskRepository,
  deliverables: Pick<DeliverableRepository, "findById">,
  audit: AuditWriter,
) {
  return {
    async archive(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const { id } = taskIdSchema.parse(input);
      const record = await repository.archive(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, { action: "task.archived", entityId: id, entityType: "task" });
      return record;
    },
    async create(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = createTaskSchema.parse(input);
      if (!(await deliverables.findById(context.workspaceId, parsed.deliverableId)))
        throw new DomainError("NOT_FOUND");
      if (
        parsed.assigneeId &&
        !(await repository.findActiveMember(context.workspaceId, parsed.assigneeId))
      )
        throw new DomainError("NOT_FOUND");
      const record = await repository.create(context.workspaceId, {
        assigneeId: parsed.assigneeId ?? null,
        blockReason: parsed.blockReason,
        deliverableId: parsed.deliverableId,
        description: parsed.description ?? "",
        dueAt: parsed.dueAt ?? null,
        isBlocked: parsed.isBlocked,
        priority: parsed.priority,
        status: parsed.status,
        title: parsed.title,
      });
      await audit.record(context, {
        action: "task.created",
        entityId: record.id,
        entityType: "task",
      });
      return record;
    },
    async get(context: AuthorizationContext, input: unknown) {
      const { id } = taskIdSchema.parse(input);
      const record = await repository.findById(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      return record;
    },
    async list(context: AuthorizationContext, input: unknown = {}) {
      const { limit, ...filters } = listTasksSchema.parse(input);
      return repository.list(context.workspaceId, limit, filters);
    },
    async update(context: AuthorizationContext, input: unknown) {
      const { id, ...changes } = updateTaskSchema.parse(input);
      const current = await repository.findById(context.workspaceId, id);
      if (!current) throw new DomainError("NOT_FOUND");
      if (context.role !== "ADMIN") {
        if (current.assigneeId !== context.actorId) throw new AuthorizationError("FORBIDDEN");
        if (
          changes.assigneeId !== undefined ||
          changes.dueAt !== undefined ||
          changes.priority !== undefined ||
          changes.title !== undefined
        )
          throw new AuthorizationError("FORBIDDEN");
      }
      if (
        changes.assigneeId &&
        !(await repository.findActiveMember(context.workspaceId, changes.assigneeId))
      )
        throw new DomainError("NOT_FOUND");
      const record = await repository.update(context.workspaceId, id, changes);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, {
        action: "task.updated",
        entityId: id,
        entityType: "task",
        metadata: { status: record.status },
      });
      return record;
    },
  };
}
