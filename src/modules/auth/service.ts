import { z } from "zod";

const emailSchema = z.email();

export type AuthenticatedUser = Readonly<{
  email: string | null;
  id: string;
}>;

type ProviderResult = Readonly<{ error: string | null }>;
type CurrentUserResult = Readonly<{
  error: string | null;
  user: AuthenticatedUser | null;
}>;

export interface AuthIdentityProvider {
  getCurrentUser(): Promise<CurrentUserResult>;
  requestEmailOtp(email: string): Promise<ProviderResult>;
  signOut(): Promise<ProviderResult>;
}

export class AuthenticationError extends Error {
  constructor() {
    super("Sua sessão não é válida. Entre novamente.");
    this.name = "AuthenticationError";
  }
}

export async function requireAuthenticatedUser(
  provider: AuthIdentityProvider,
): Promise<AuthenticatedUser> {
  const result = await provider.getCurrentUser();

  if (result.error || !result.user) {
    throw new AuthenticationError();
  }

  return result.user;
}

export type LoginRequestResult = Readonly<{ ok: true }> | Readonly<{ error: string; ok: false }>;

export async function authenticateWithEmailOtp(
  email: string,
  provider: AuthIdentityProvider,
): Promise<LoginRequestResult> {
  const parsedEmail = emailSchema.safeParse(email.trim().toLowerCase());

  if (!parsedEmail.success) {
    return { error: "Informe um e-mail válido.", ok: false };
  }

  const result = await provider.requestEmailOtp(parsedEmail.data);

  if (result.error) {
    return {
      error: "Não foi possível enviar o acesso. Tente novamente.",
      ok: false,
    };
  }

  return { ok: true };
}
