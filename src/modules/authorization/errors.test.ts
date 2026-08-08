import { describe, expect, it } from "vitest";

import { executeSafely } from "./errors";

describe("safe service contract", () => {
  it("does not expose stack traces or infrastructure errors", async () => {
    const result = await executeSafely(async () => {
      throw new Error("password=secret select * from private_table");
    });
    expect(result).toEqual({
      error: { code: "INTERNAL", message: "Não foi possível concluir a solicitação." },
      ok: false,
      status: 500,
    });
    expect(JSON.stringify(result)).not.toContain("secret");
  });
});
