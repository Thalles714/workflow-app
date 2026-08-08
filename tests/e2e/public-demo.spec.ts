import { expect, test } from "@playwright/test";

test("lets a visitor explore the public workflow tour without authentication", async ({ page }) => {
  await page.goto("/demo");
  await expect(
    page.getByRole("heading", { name: /Sua operação pede três decisões agora/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { exact: true, name: "Landing page bloqueada" }),
  ).toBeVisible();
  await expect(page.getByText("Projeto", { exact: true })).toBeVisible();
  await expect(page.getByText("Entrega", { exact: true })).toBeVisible();
  await expect(page.getByText("Tarefa", { exact: true })).toBeVisible();
  await expect(page.getByText("Dados inteiramente fictícios")).toBeVisible();
  await page
    .getByRole("button", { name: /Inspecionar/i })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: /Abrir visão do projeto/i }).click();
  await expect(page.getByRole("heading", { name: "Lançamento Q3" })).toBeVisible();
  await page.getByRole("link", { name: /Abrir Landing page/i }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Landing page" })).toBeVisible();
  await page.getByRole("link", { name: /Abrir tarefa/i }).click();
  await expect(page.locator("h1", { hasText: "Revisar formulário" })).toBeVisible();
});

test("keeps the public tour inside desktop, tablet and mobile viewports", async ({ page }) => {
  for (const viewport of [
    { height: 900, width: 1440 },
    { height: 1024, width: 768 },
    { height: 844, width: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/demo");
    const fitsViewport = await page
      .locator("body")
      .evaluate((body) => body.scrollWidth <= window.innerWidth);
    expect(fitsViewport).toBe(true);
  }

  const menuButton = page.getByRole("button", { name: "Abrir navegação da demo" });
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Navegação da demonstração" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();
});

test("shows the internal access experience without creating a real session", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("link", { exact: true, name: "Acesso interno" }).click();

  await expect(page).toHaveURL(/\/demo\/login$/);
  await expect(page.getByRole("heading", { name: "Entre na operação." })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toHaveValue("gestora@agenciaaurora.demo");

  await page.getByRole("button", { name: "Simular envio do link →" }).click();
  await expect(page.getByText("Link demonstrativo enviado")).toBeVisible();
  await expect(page.getByText("nenhum dado foi enviado", { exact: false })).toBeVisible();

  await page.getByRole("link", { name: "← Voltar à demonstração" }).click();
  await expect(page).toHaveURL(/\/demo$/);
});
