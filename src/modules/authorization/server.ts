import "server-only";

import { requireAuthenticatedUser } from "@/modules/auth/service";
import { createServerAuthProvider, createServerSupabaseClient } from "@/modules/auth/server";

import { createSupabaseMembershipRepository } from "./repository";
import { resolveAuthorizationContext } from "./service";

export async function createAuthorizationContext(selectedWorkspaceId: string) {
  const actor = await requireAuthenticatedUser(await createServerAuthProvider());
  const client = await createServerSupabaseClient();
  return resolveAuthorizationContext(
    actor,
    selectedWorkspaceId,
    createSupabaseMembershipRepository(client),
  );
}
