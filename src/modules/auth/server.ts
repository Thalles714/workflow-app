import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { readRuntimeSupabaseEnv } from "./env";
import type { AuthIdentityProvider } from "./service";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { publishableKey, url } = readRuntimeSupabaseEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, options, value }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; the proxy refreshes them.
        }
      },
    },
  });
}

export async function createServerAuthProvider(): Promise<AuthIdentityProvider> {
  const supabase = await createServerSupabaseClient();
  return {
    async getCurrentUser() {
      const { data, error } = await supabase.auth.getUser();
      return {
        error: error?.message ?? null,
        user: data.user ? { email: data.user.email ?? null, id: data.user.id } : null,
      };
    },
    async requestEmailOtp(email) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      return { error: error?.message ?? null };
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message ?? null };
    },
  };
}
