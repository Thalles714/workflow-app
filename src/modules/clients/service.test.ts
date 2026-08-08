import { describe, expect, it } from "vitest";

import type { AuditEvent, AuditWriter } from "../audit/repository";
import type { AuthorizationContext } from "../authorization/service";

import type { ClientRecord, ClientRepository } from "./repository";
import { createClientService } from "./service";

const admin: AuthorizationContext = {
  actorId: "00000000-0000-0000-0000-000000000101",
  role: "ADMIN",
  workspaceId: "10000000-0000-0000-0000-000000000001",
};
const member: AuthorizationContext = {
  ...admin,
  actorId: "00000000-0000-0000-0000-000000000102",
  role: "MEMBER",
};
const existing: ClientRecord = {
  id: "20000000-0000-0000-0000-000000000001",
  name: "Órbita Tecnologia",
  workspaceId: admin.workspaceId,
};

function harness() {
  const events: AuditEvent[] = [];
  const repository: ClientRepository = {
    async archive(workspaceId, id) {
      return workspaceId === existing.workspaceId && id === existing.id ? existing : null;
    },
    async create(workspaceId, name) {
      return { id: "20000000-0000-0000-0000-000000000009", name, workspaceId };
    },
    async findById(workspaceId, id) {
      return workspaceId === existing.workspaceId && id === existing.id ? existing : null;
    },
    async list(workspaceId) {
      return workspaceId === existing.workspaceId ? [existing] : [];
    },
    async update(workspaceId, id, name) {
      return workspaceId === existing.workspaceId && id === existing.id
        ? { ...existing, name }
        : null;
    },
  };
  const audit: AuditWriter = {
    async record(_context, event) {
      events.push(event);
    },
  };
  return { events, service: createClientService(repository, audit) };
}

describe("client service", () => {
  it("denies MEMBER mutations before writing", async () => {
    const { events, service } = harness();
    await expect(service.create(member, { name: "Novo cliente" })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(events).toHaveLength(0);
  });

  it("hides a cross-tenant record as not found", async () => {
    const { service } = harness();
    await expect(
      service.get(
        { ...admin, workspaceId: "10000000-0000-0000-0000-000000000002" },
        { id: existing.id },
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects oversized and unknown payload fields before writing", async () => {
    const { events, service } = harness();
    await expect(
      service.create(admin, { name: "x".repeat(121), workspaceId: "forged" }),
    ).rejects.toMatchObject({ name: "ZodError" });
    expect(events).toHaveLength(0);
  });

  it("audits a valid mutation with the derived actor and workspace", async () => {
    const { events, service } = harness();
    const created = await service.create(admin, { name: "Cliente Solar" });
    expect(created.workspaceId).toBe(admin.workspaceId);
    expect(events).toEqual([
      { action: "client.created", entityId: created.id, entityType: "client" },
    ]);
  });
});
