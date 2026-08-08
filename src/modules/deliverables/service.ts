import type { AuditWriter } from "../audit/repository";
import { DomainError } from "../authorization/errors";
import type { AuthorizationContext } from "../authorization/service";
import { requireAdmin } from "../authorization/service";
import type { ProjectRepository } from "../projects/repository";

import type { DeliverableRepository } from "./repository";
import {
  createDeliverableSchema,
  deliverableIdSchema,
  listDeliverablesSchema,
  updateDeliverableSchema,
} from "./schemas";

export function createDeliverableService(
  repository: DeliverableRepository,
  projects: Pick<ProjectRepository, "findById">,
  audit: AuditWriter,
) {
  return {
    async archive(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const { id } = deliverableIdSchema.parse(input);
      const record = await repository.archive(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, {
        action: "deliverable.archived",
        entityId: id,
        entityType: "deliverable",
      });
      return record;
    },
    async create(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = createDeliverableSchema.parse(input);
      if (!(await projects.findById(context.workspaceId, parsed.projectId)))
        throw new DomainError("NOT_FOUND");
      const record = await repository.create(context.workspaceId, parsed);
      await audit.record(context, {
        action: "deliverable.created",
        entityId: record.id,
        entityType: "deliverable",
      });
      return record;
    },
    async get(context: AuthorizationContext, input: unknown) {
      const { id } = deliverableIdSchema.parse(input);
      const record = await repository.findById(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      return record;
    },
    async list(context: AuthorizationContext, input: unknown = {}) {
      const parsed = listDeliverablesSchema.parse(input);
      return repository.list(context.workspaceId, parsed.limit, parsed.projectId);
    },
    async update(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const { id, ...changes } = updateDeliverableSchema.parse(input);
      const record = await repository.update(context.workspaceId, id, changes);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, {
        action: "deliverable.updated",
        entityId: id,
        entityType: "deliverable",
      });
      return record;
    },
  };
}
