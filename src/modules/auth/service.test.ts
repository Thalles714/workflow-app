import { describe, expect, it } from "vitest";

import {
  AuthenticationError,
  authenticateWithEmailOtp,
  requireAuthenticatedUser,
  type AuthIdentityProvider,
} from "./service";

const user = {
  email: "admin@aurora.workflow.local",
  id: "00000000-0000-0000-0000-000000000101",
};

describe("requireAuthenticatedUser", () => {
  it("returns the server-verified user", async () => {
    const provider: AuthIdentityProvider = {
      getCurrentUser: async () => ({ error: null, user }),
      requestEmailOtp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    };

    await expect(requireAuthenticatedUser(provider)).resolves.toEqual(user);
  });

  it("denies a missing session without exposing provider details", async () => {
    const provider: AuthIdentityProvider = {
      getCurrentUser: async () => ({ error: "refresh token abc123", user: null }),
      requestEmailOtp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    };

    await expect(requireAuthenticatedUser(provider)).rejects.toThrowError(AuthenticationError);
    await expect(requireAuthenticatedUser(provider)).rejects.toThrowError(
      "Sua sessão não é válida. Entre novamente.",
    );

    try {
      await requireAuthenticatedUser(provider);
    } catch (error) {
      expect(String(error)).not.toContain("abc123");
    }
  });
});

describe("authenticateWithEmailOtp", () => {
  it("requests a passwordless login only for an existing seed account", async () => {
    const provider: AuthIdentityProvider = {
      getCurrentUser: async () => ({ error: null, user: null }),
      requestEmailOtp: async (email) => ({
        error: email === user.email ? null : "unexpected account",
      }),
      signOut: async () => ({ error: null }),
    };

    await expect(authenticateWithEmailOtp(user.email, provider)).resolves.toEqual({ ok: true });
  });

  it("rejects an invalid email before crossing the Auth boundary", async () => {
    const provider: AuthIdentityProvider = {
      getCurrentUser: async () => ({ error: null, user: null }),
      requestEmailOtp: async () => {
        throw new Error("Auth boundary should not run");
      },
      signOut: async () => ({ error: null }),
    };

    await expect(authenticateWithEmailOtp("not-an-email", provider)).resolves.toEqual({
      error: "Informe um e-mail válido.",
      ok: false,
    });
  });
});
