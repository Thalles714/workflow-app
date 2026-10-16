import "server-only";

import { requireAuthenticatedUser } from "@/modules/auth/service";
import { createServerAuthProvider, createServerSupabaseClient } from "@/modules/auth/server";

import { createSupabaseMembershipRepository } from "./repository";
import { resolveDefaultAuthorizationContext } from "./service";

export async function createAuthorizationContext() {
  const actor = await requireAuthenticatedUser(await createServerAuthProvider());
  const client = await createServerSupabaseClient();
  return resolveDefaultAuthorizationContext(actor, createSupabaseMembershipRepository(client));
}
