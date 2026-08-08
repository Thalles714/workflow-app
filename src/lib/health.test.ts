import { describe, expect, it } from "vitest";

import { getHealthStatus } from "./health";

describe("getHealthStatus", () => {
  it("reports a deterministic healthy local foundation", () => {
    expect(getHealthStatus()).toEqual({
      service: "workflow-app",
      status: "ok",
    });
  });
});
