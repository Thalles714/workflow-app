import { z } from "zod";

import type { MembershipRole } from "../../types/database";

const uuidSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

export type AuthorizationContext = Readonly<{
  actorId: string;
  role: MembershipRole;
  workspaceId: string;
}>;

export type ActiveMembership = Readonly<{
  role: MembershipRole;
  userId: string;
  workspaceId: string;
}>;

export interface MembershipReader {
  findActiveMembership(userId: string, workspaceId: string): Promise<ActiveMembership | null>;
}

export interface DefaultMembershipReader {
  findFirstActiveMembership(userId: string): Promise<ActiveMembership | null>;
}

export type AuthorizationErrorCode = "FORBIDDEN" | "UNAUTHENTICATED";

export class AuthorizationError extends Error {
  readonly code: AuthorizationErrorCode;
  readonly status: 401 | 403;

  constructor(code: AuthorizationErrorCode) {
    super(code === "UNAUTHENTICATED" ? "Entre novamente para continuar." : "Ação não permitida.");
    this.name = "AuthorizationError";
    this.code = code;
    this.status = code === "UNAUTHENTICATED" ? 401 : 403;
  }
}

export async function resolveAuthorizationContext(
  actor: Readonly<{ id: string }> | null,
  selectedWorkspaceId: string,
  memberships: MembershipReader,
): Promise<AuthorizationContext> {
  if (!actor) throw new AuthorizationError("UNAUTHENTICATED");

  const parsedWorkspaceId = uuidSchema.safeParse(selectedWorkspaceId);
  if (!parsedWorkspaceId.success) throw new AuthorizationError("FORBIDDEN");

  const membership = await memberships.findActiveMembership(actor.id, parsedWorkspaceId.data);
  if (
    !membership ||
    membership.userId !== actor.id ||
    membership.workspaceId !== parsedWorkspaceId.data
  ) {
    throw new AuthorizationError("FORBIDDEN");
  }

  return {
    actorId: membership.userId,
    role: membership.role,
    workspaceId: membership.workspaceId,
  };
}

export async function resolveDefaultAuthorizationContext(
  actor: Readonly<{ id: string }> | null,
  memberships: DefaultMembershipReader,
): Promise<AuthorizationContext> {
  if (!actor) throw new AuthorizationError("UNAUTHENTICATED");

  const membership = await memberships.findFirstActiveMembership(actor.id);
  if (!membership || membership.userId !== actor.id) {
    throw new AuthorizationError("FORBIDDEN");
  }

  return {
    actorId: membership.userId,
    role: membership.role,
    workspaceId: membership.workspaceId,
  };
}

export function requireAdmin(context: AuthorizationContext): void {
  if (context.role !== "ADMIN") throw new AuthorizationError("FORBIDDEN");
}
