import type { AuditWriter } from "../audit/repository";
import { DomainError } from "../authorization/errors";
import type { AuthorizationContext } from "../authorization/service";
import { requireAdmin } from "../authorization/service";
import type { DeliverableRepository } from "../deliverables/repository";
import type { ApprovalRepository } from "./repository";
import {
  approvalDecisionSchema,
  approvalIdSchema,
  approvalListSchema,
  approvalRequestSchema,
  approvalResetSchema,
} from "./schemas";
export function createApprovalService(
  repository: ApprovalRepository,
  deliverables: Pick<DeliverableRepository, "findById">,
  audit: AuditWriter,
) {
  return {
    async list(context: AuthorizationContext, input: unknown = {}) {
      const parsed = approvalListSchema.parse(input);
      return repository.list(context.workspaceId, parsed.limit, parsed.status);
    },
    async request(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = approvalRequestSchema.parse(input);
      const deliverable = await deliverables.findById(context.workspaceId, parsed.deliverableId);
      if (!deliverable) throw new DomainError("NOT_FOUND");
      if (
        deliverable.status === "COMPLETED" ||
        (await repository.findPendingByDeliverable(context.workspaceId, parsed.deliverableId))
      )
        throw new DomainError("CONFLICT");
      const record = await repository.create(
        context.workspaceId,
        parsed.deliverableId,
        context.actorId,
        parsed.note,
      );
      await audit.record(context, {
        action: "approval.requested",
        entityId: record.id,
        entityType: "approval",
        metadata: { deliverableId: record.deliverableId },
      });
      return record;
    },
    async decide(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = approvalDecisionSchema.parse(input);
      if (!(await repository.findById(context.workspaceId, parsed.id)))
        throw new DomainError("NOT_FOUND");
      const record = await repository.decide(
        context.workspaceId,
        parsed.id,
        context.actorId,
        parsed.status,
        parsed.note,
      );
      if (!record) throw new DomainError("CONFLICT");
      await audit.record(context, {
        action: "approval.decided",
        entityId: record.id,
        entityType: "approval",
        metadata: { status: record.status },
      });
      return record;
    },
    async reset(context: AuthorizationContext, input: unknown) {
      requireAdmin(context);
      const parsed = approvalResetSchema.parse(input);
      const previous = await repository.findById(context.workspaceId, parsed.id);
      if (!previous) throw new DomainError("NOT_FOUND");
      const record = await repository.reset(
        context.workspaceId,
        parsed.id,
        context.actorId,
        parsed.note,
      );
      if (!record) throw new DomainError("CONFLICT");
      await audit.record(context, {
        action: "approval.reset",
        entityId: record.id,
        entityType: "approval",
        metadata: {
          previousDecisionNote: previous.decisionNote,
          previousStatus: previous.status,
          reason: parsed.note,
        },
      });
      return record;
    },
    async get(context: AuthorizationContext, input: unknown) {
      const { id } = approvalIdSchema.parse(input);
      const record = await repository.findById(context.workspaceId, id);
      if (!record) throw new DomainError("NOT_FOUND");
      return record;
    },
  };
}
