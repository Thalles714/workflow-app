import { describe, expect, it, vi } from "vitest";

import {
  checkService,
  requiredE2eServices,
  requiredPublicE2eServices,
  runE2ePreflight,
} from "../../scripts/check-e2e-services.mjs";

describe("E2E service preflight", () => {
  it("uses the local Supabase and Mailpit defaults", () => {
    expect(requiredE2eServices({})).toEqual([
      {
        name: "Aplicação local",
        timeoutMs: 10_000,
        url: "http://localhost:3000/health",
      },
      { name: "Supabase local", url: "http://127.0.0.1:54321/auth/v1/health" },
      { name: "Mailpit local", url: "http://127.0.0.1:54324/api/v1/messages" },
    ]);
  });

  it("requires only the application for public browser tests", () => {
    expect(requiredPublicE2eServices({})).toEqual([
      {
        name: "Aplicação local",
        timeoutMs: 10_000,
        url: "http://localhost:3000/health",
      },
    ]);
  });

  it("reports an unavailable dependency without throwing", async () => {
    const result = await checkService(
      { name: "Mailpit local", url: "http://127.0.0.1:54324/api/v1/messages" },
      vi.fn().mockRejectedValue(new Error("connection refused")),
    );

    expect(result).toMatchObject({ ok: false, reason: "connection refused" });
  });

  it("fails before Playwright when a required service is unavailable", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockRejectedValueOnce(new Error("connection refused"));
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(runE2ePreflight({ env: {}, fetchImpl })).resolves.toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("testes E2E autenticados"));

    error.mockRestore();
  });

  it("fails public tests when the application is unavailable", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("connection refused"));
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(runE2ePreflight({ env: {}, fetchImpl, publicOnly: true })).resolves.toBe(1);
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    error.mockRestore();
  });
});
