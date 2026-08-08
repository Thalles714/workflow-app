import { describe, expect, it } from "vitest";

import { AuthConfigurationError, readSupabaseEnv } from "./env";

describe("readSupabaseEnv", () => {
  it("accepts a complete public Supabase configuration", () => {
    expect(
      readSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_local_test",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      }),
    ).toEqual({
      publishableKey: "sb_publishable_local_test",
      url: "http://127.0.0.1:54321",
    });
  });

  it("fails safely when configuration is missing", () => {
    expect(() => readSupabaseEnv({})).toThrowError(AuthConfigurationError);
    expect(() => readSupabaseEnv({})).toThrowError("Supabase não está configurado neste ambiente.");
  });

  it("does not echo an invalid value in the public error", () => {
    const invalidUrl = "definitely-not-a-secret-but-invalid";

    expect(() =>
      readSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_local_test",
        NEXT_PUBLIC_SUPABASE_URL: invalidUrl,
      }),
    ).toThrowError(AuthConfigurationError);

    try {
      readSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_local_test",
        NEXT_PUBLIC_SUPABASE_URL: invalidUrl,
      });
    } catch (error) {
      expect(String(error)).not.toContain(invalidUrl);
    }
  });
});
