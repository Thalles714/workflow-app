import { z } from "zod";

import { AuthorizationError } from "./service";

export type DomainErrorCode = "CONFLICT" | "NOT_FOUND" | "VALIDATION";

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly status: 400 | 404 | 409;

  constructor(code: DomainErrorCode) {
    const messages = {
      CONFLICT: "Não foi possível concluir a alteração.",
      NOT_FOUND: "Registro não encontrado.",
      VALIDATION: "Revise os dados informados.",
    } as const;
    super(messages[code]);
    this.name = "DomainError";
    this.code = code;
    this.status = code === "VALIDATION" ? 400 : code === "NOT_FOUND" ? 404 : 409;
  }
}

export type SafeFailure = Readonly<{
  error: { code: string; message: string };
  ok: false;
  status: number;
}>;
export type SafeSuccess<T> = Readonly<{ data: T; ok: true }>;
export type SafeResult<T> = SafeSuccess<T> | SafeFailure;

export function toSafeFailure(error: unknown): SafeFailure {
  if (error instanceof AuthorizationError || error instanceof DomainError) {
    return { error: { code: error.code, message: error.message }, ok: false, status: error.status };
  }
  if (error instanceof z.ZodError) {
    return {
      error: { code: "VALIDATION", message: "Revise os dados informados." },
      ok: false,
      status: 400,
    };
  }
  return {
    error: { code: "INTERNAL", message: "Não foi possível concluir a solicitação." },
    ok: false,
    status: 500,
  };
}

export async function executeSafely<T>(operation: () => Promise<T>): Promise<SafeResult<T>> {
  try {
    return { data: await operation(), ok: true };
  } catch (error) {
    return toSafeFailure(error);
  }
}
