import { describe, expect, it } from "vitest";

import { AuthorizationError, requireAdmin, resolveAuthorizationContext } from "./service";

const workspaceId = "10000000-0000-0000-0000-000000000001";
const actorId = "00000000-0000-0000-0000-000000000102";

describe("authorization context", () => {
  it("denies an anonymous request before membership lookup", async () => {
    let queried = false;

    await expect(
      resolveAuthorizationContext(null, workspaceId, {
        async findActiveMembership() {
          queried = true;
          return null;
        },
      }),
    ).rejects.toMatchObject({ code: "UNAUTHENTICATED", status: 401 });
    expect(queried).toBe(false);
  });

  it("derives role from active membership and denies MEMBER admin operations", async () => {
    const context = await resolveAuthorizationContext({ id: actorId }, workspaceId, {
      async findActiveMembership() {
        return { role: "MEMBER", userId: actorId, workspaceId };
      },
    });

    expect(() => requireAdmin(context)).toThrowError(AuthorizationError);
    expect(() => requireAdmin(context)).toThrow(expect.objectContaining({ code: "FORBIDDEN" }));
  });

  it("does not reveal whether a workspace exists when membership is absent", async () => {
    await expect(
      resolveAuthorizationContext({ id: actorId }, workspaceId, {
        async findActiveMembership() {
          return null;
        },
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN", status: 403 });
  });
});
