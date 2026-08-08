import { expect, test } from "@playwright/test";

test("opens the local health page", async ({ page }) => {
  await page.goto("/health");

  await expect(page.getByRole("heading", { name: "Saúde local" })).toBeVisible();
  await expect(page.getByText("workflow-app", { exact: true })).toBeVisible();
  await expect(page.getByText("ok", { exact: true })).toBeVisible();
});
