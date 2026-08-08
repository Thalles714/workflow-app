import { z } from "zod";

const publicSupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
});

const publicAppEnvSchema = z.object({ NEXT_PUBLIC_APP_URL: z.url() });

export type SupabasePublicEnv = Readonly<{
  publishableKey: string;
  url: string;
}>;

export class AuthConfigurationError extends Error {
  constructor() {
    super("Supabase não está configurado neste ambiente.");
    this.name = "AuthConfigurationError";
  }
}

export function readSupabaseEnv(
  environment: Readonly<Record<string, string | undefined>>,
): SupabasePublicEnv {
  const result = publicSupabaseEnvSchema.safeParse(environment);

  if (!result.success) {
    throw new AuthConfigurationError();
  }

  return {
    publishableKey: result.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    url: result.data.NEXT_PUBLIC_SUPABASE_URL,
  };
}

export function readRuntimeSupabaseEnv(): SupabasePublicEnv {
  return readSupabaseEnv({
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}

export function readAppUrl(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): string {
  const result = publicAppEnvSchema.safeParse(environment);
  if (!result.success) throw new AuthConfigurationError();
  return result.data.NEXT_PUBLIC_APP_URL;
}
