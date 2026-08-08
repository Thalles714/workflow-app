import type { AuditWriter } from "../audit/repository";
import { DomainError } from "../authorization/errors";
import type { AuthorizationContext } from "../authorization/service";
import { requireAdmin } from "../authorization/service";

import type { ClientRepository } from "./repository";
import {
  clientIdSchema,
  createClientSchema,
  listClientsSchema,
  updateClientSchema,
} from "./schemas";

export function createClientService(repository: ClientRepository, audit: AuditWriter) {
  return {
    async archive(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const { id } = clientIdSchema.parse(input);
      const record = await repository.archive(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, {
        action: "client.archived",
        entityId: id,
        entityType: "client",
      });
      return record;
    },
    async create(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = createClientSchema.parse(input);
      const record = await repository.create(context.workspaceId, parsed.name);
      await audit.record(context, {
        action: "client.created",
        entityId: record.id,
        entityType: "client",
      });
      return record;
    },
    async get(context: AuthorizationContext, input: unknown) {
      const { id } = clientIdSchema.parse(input);
      const record = await repository.findById(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      return record;
    },
    async list(context: AuthorizationContext, input: unknown = {}) {
      const { limit } = listClientsSchema.parse(input);
      return repository.list(context.workspaceId, limit);
    },
    async update(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = updateClientSchema.parse(input);
      const record = await repository.update(context.workspaceId, parsed.id, parsed.name);
      if (!record) throw new DomainError("NOT_FOUND");
      await audit.record(context, {
        action: "client.updated",
        entityId: record.id,
        entityType: "client",
      });
      return record;
    },
  };
}
