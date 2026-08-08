import { describe, expect, it, vi } from "vitest";
import { createAttentionService, type AttentionRepository } from "./service";

const empty = {
  approvals: [],
  clients: [],
  deliverables: [],
  projects: [],
  tasks: [],
  timezone: "America/Sao_Paulo",
};

describe("operation attention authorization", () => {
  it("denies MEMBER before reading and derives the tenant from ADMIN context", async () => {
    const load = vi.fn<AttentionRepository["load"]>().mockResolvedValue(empty);
    const service = createAttentionService({ load });
    await expect(
      service.getOperationAttention({ actorId: "u1", role: "MEMBER", workspaceId: "w1" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(load).not.toHaveBeenCalled();
    await service.getOperationAttention({ actorId: "u2", role: "ADMIN", workspaceId: "w2" });
    expect(load).toHaveBeenCalledExactlyOnceWith("w2");
  });
});
