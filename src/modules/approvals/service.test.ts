import { describe, expect, it } from "vitest";
import type { AuditEvent, AuditWriter } from "../audit/repository";
import type { AuthorizationContext } from "../authorization/service";
import type { DeliverableRecord } from "../deliverables/repository";
import type { ApprovalRecord, ApprovalRepository } from "./repository";
import { createApprovalService } from "./service";

const context: AuthorizationContext = {
  actorId: "00000000-0000-0000-0000-000000000101",
  role: "ADMIN",
  workspaceId: "10000000-0000-0000-0000-000000000001",
};
const approval: ApprovalRecord = {
  decidedAt: null,
  decidedBy: null,
  decisionNote: "Revisar",
  deliverableId: "40000000-0000-0000-0000-000000000001",
  id: "70000000-0000-0000-0000-000000000001",
  requestedAt: new Date().toISOString(),
  requestedBy: context.actorId,
  status: "PENDING",
  workspaceId: context.workspaceId,
};
function harness(current: ApprovalRecord | null = approval) {
  const events: AuditEvent[] = [];
  const repository: ApprovalRepository = {
    async create() {
      return approval;
    },
    async decide(_w, id, actor, status, note) {
      return current?.id === id
        ? {
            ...current,
            decidedAt: new Date().toISOString(),
            decidedBy: actor,
            decisionNote: note,
            status,
          }
        : null;
    },
    async findById(_w, id) {
      return current?.id === id ? current : null;
    },
    async findPendingByDeliverable() {
      return current?.status === "PENDING" ? current : null;
    },
    async list() {
      return current ? [current] : [];
    },
    async reset(_w, id, _actor, note) {
      return current?.id === id
        ? { ...current, decidedAt: null, decidedBy: null, decisionNote: note, status: "PENDING" }
        : null;
    },
  };
  const audit: AuditWriter = {
    async record(_c, event) {
      events.push(event);
    },
  };
  return {
    events,
    service: createApprovalService(
      repository,
      {
        async findById() {
          return { id: approval.deliverableId } as DeliverableRecord;
        },
      },
      audit,
    ),
  };
}
describe("approval state machine", () => {
  it("decides a pending approval and records an audit event", async () => {
    const { events, service } = harness();
    await expect(
      service.decide(context, { id: approval.id, note: "Tudo certo", status: "APPROVED" }),
    ).resolves.toMatchObject({ status: "APPROVED" });
    expect(events[0]).toMatchObject({ action: "approval.decided" });
  });
  it("denies a MEMBER before any decision", async () => {
    const { service } = harness();
    await expect(
      service.decide(
        { ...context, role: "MEMBER" },
        { id: approval.id, note: "x", status: "APPROVED" },
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
  it("rejects a second active approval", async () => {
    const { service } = harness();
    await expect(
      service.request(context, { deliverableId: approval.deliverableId, note: "Nova" }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });
  it("requests a review and records the request", async () => {
    const { events, service } = harness(null);
    await expect(
      service.request(context, {
        deliverableId: approval.deliverableId,
        note: "Pronta para revisar",
      }),
    ).resolves.toMatchObject({ id: approval.id, status: "PENDING" });
    expect(events).toEqual([
      expect.objectContaining({ action: "approval.requested", entityType: "approval" }),
    ]);
  });
  it("records the previous decision and reopen reason in the audit event", async () => {
    const decided = { ...approval, decisionNote: "Aprovação inicial", status: "APPROVED" as const };
    const { events, service } = harness(decided);

    await expect(
      service.reset(context, { id: approval.id, note: "Mudança de escopo" }),
    ).resolves.toMatchObject({ status: "PENDING" });

    expect(events).toEqual([
      expect.objectContaining({
        action: "approval.reset",
        metadata: {
          previousDecisionNote: "Aprovação inicial",
          previousStatus: "APPROVED",
          reason: "Mudança de escopo",
        },
      }),
    ]);
  });
  it("returns a safe not-found result for an approval outside the workspace", async () => {
    const { service } = harness(null);
    await expect(
      service.decide(context, { id: approval.id, note: "x", status: "CHANGES_REQUESTED" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
