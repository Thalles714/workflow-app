import type { AuditWriter } from "../audit/repository";
import { DomainError } from "../authorization/errors";
import type { AuthorizationContext } from "../authorization/service";
import { requireAdmin } from "../authorization/service";
import type { ClientRepository } from "../clients/repository";

import type { ProjectRepository } from "./repository";
import {
  createProjectSchema,
  listProjectsSchema,
  projectIdSchema,
  updateProjectSchema,
} from "./schemas";

export function createProjectService(
  repository: ProjectRepository,
  clients: Pick<ClientRepository, "findById">,
  audit: AuditWriter,
) {
  return {
    async archive(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const { id } = projectIdSchema.parse(input);
      const record = await repository.archive(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, {
        action: "project.archived",
        entityId: id,
        entityType: "project",
      });
      return record;
    },
    async create(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = createProjectSchema.parse(input);
      if (!(await clients.findById(context.workspaceId, parsed.clientId)))
        throw new DomainError("NOT_FOUND");
      const record = await repository.create(context.workspaceId, parsed);
      await audit.record(context, {
        action: "project.created",
        entityId: record.id,
        entityType: "project",
      });
      return record;
    },
    async get(context: AuthorizationContext, input: unknown) {
      const { id } = projectIdSchema.parse(input);
      const record = await repository.findById(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      return record;
    },
    async list(context: AuthorizationContext, input: unknown = {}) {
      const parsed = listProjectsSchema.parse(input);
      return repository.list(context.workspaceId, parsed.limit, parsed.clientId);
    },
    async update(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const { id, ...changes } = updateProjectSchema.parse(input);
      const record = await repository.update(context.workspaceId, id, changes);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, {
        action: "project.updated",
        entityId: id,
        entityType: "project",
      });
      return record;
    },
  };
}
