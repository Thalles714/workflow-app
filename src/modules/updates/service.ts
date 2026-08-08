import { z } from "zod";
import type { AuditWriter } from "../audit/repository";
import { DomainError } from "../authorization/errors";
import { idSchema, paginationSchema } from "../authorization/schemas";
import type { AuthorizationContext } from "../authorization/service";
import type { TaskRepository } from "../tasks/repository";
import type { TaskUpdateRepository } from "./repository";
const createSchema = z
  .object({ body: z.string().trim().min(1).max(500), taskId: idSchema })
  .strict();
const listSchema = paginationSchema.extend({ taskId: idSchema }).strict();
export function createTaskUpdateService(
  repository: TaskUpdateRepository,
  tasks: Pick<TaskRepository, "findById">,
  audit: AuditWriter,
) {
  return {
    async create(context: AuthorizationContext, input: unknown) {
      const parsed = createSchema.parse(input);
      if (!(await tasks.findById(context.workspaceId, parsed.taskId)))
        throw new DomainError("NOT_FOUND");
      const record = await repository.create(
        context.workspaceId,
        parsed.taskId,
        context.actorId,
        parsed.body,
      );
      await audit.record(context, {
        action: "task_update.created",
        entityId: record.id,
        entityType: "task_update",
        metadata: { taskId: record.taskId },
      });
      return record;
    },
    async list(context: AuthorizationContext, input: unknown) {
      const parsed = listSchema.parse(input);
      if (!(await tasks.findById(context.workspaceId, parsed.taskId)))
        throw new DomainError("NOT_FOUND");
      return repository.list(context.workspaceId, parsed.taskId, parsed.limit);
    },
  };
}
