import { expect, test } from "@playwright/test";

test("opens the local health page with baseline security headers", async ({ page, request }) => {
  const response = await request.get("/health");
  expect(response.headers()).toMatchObject({
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  });
  await page.goto("/health");

  await expect(page.getByRole("heading", { name: "Saúde local" })).toBeVisible();
  await expect(page.getByText("workflow-app", { exact: true })).toBeVisible();
  await expect(page.getByText("ok", { exact: true })).toBeVisible();
});
