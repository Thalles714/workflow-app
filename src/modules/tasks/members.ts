import "server-only";

import { createServerSupabaseClient } from "../auth/server";
import type { AuthorizationContext } from "../authorization/service";
import { DomainError } from "../authorization/errors";

export async function listWorkspaceMembers(context: AuthorizationContext) {
  const client = await createServerSupabaseClient();
  const { data, error } = await client
    .from("memberships")
    .select("user_id, profiles(display_name)")
    .eq("workspace_id", context.workspaceId)
    .is("archived_at", null)
    .limit(100);
  if (error) throw new DomainError("CONFLICT");
  return (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: String(row.user_id),
      name: String((profile as { display_name?: string } | null)?.display_name ?? "Membro"),
    };
  });
}
