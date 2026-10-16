import type { SupabaseClient } from "@supabase/supabase-js";

import type { MembershipRole } from "../../types/database";

import { DomainError } from "./errors";
import type { DefaultMembershipReader, MembershipReader } from "./service";

export function createSupabaseMembershipRepository(
  client: SupabaseClient,
): DefaultMembershipReader & MembershipReader {
  return {
    async findFirstActiveMembership(userId) {
      const { data, error } = await client
        .from("memberships")
        .select("user_id, workspace_id, role")
        .eq("user_id", userId)
        .is("archived_at", null)
        .order("workspace_id", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      if (!data) return null;
      return {
        role: data.role as MembershipRole,
        userId: String(data.user_id),
        workspaceId: String(data.workspace_id),
      };
    },
    async findActiveMembership(userId, workspaceId) {
      const { data, error } = await client
        .from("memberships")
        .select("user_id, workspace_id, role")
        .eq("user_id", userId)
        .eq("workspace_id", workspaceId)
        .is("archived_at", null)
        .maybeSingle();
      if (error) throw new DomainError("CONFLICT");
      if (!data) return null;
      return {
        role: data.role as MembershipRole,
        userId: String(data.user_id),
        workspaceId: String(data.workspace_id),
      };
    },
  };
}
