import { expect, test } from "@playwright/test";

const mailpitApi = "http://127.0.0.1:54324/api/v1";
type MailpitMessage = { Created: string; ID: string; To: { Address: string }[] };

test("member sees one tenant-safe task in each deterministic My Work group", async ({
  page,
  request,
}) => {
  const email = "member@aurora.workflow.local";
  const startedAt = Date.now();
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Enviar link de acesso" }).click();
  const messageId = await expect
    .poll(async () => {
      const response = await request.get(`${mailpitApi}/messages`);
      const body = (await response.json()) as { messages: MailpitMessage[] };
      return body.messages.find(
        (message) =>
          new Date(message.Created).getTime() >= startedAt &&
          message.To.some((recipient) => recipient.Address === email),
      )?.ID;
    })
    .toBeTruthy();
  void messageId;
  const listResponse = await request.get(`${mailpitApi}/messages`);
  const list = (await listResponse.json()) as { messages: MailpitMessage[] };
  const message = list.messages.find(
    (candidate) =>
      new Date(candidate.Created).getTime() >= startedAt &&
      candidate.To.some((recipient) => recipient.Address === email),
  );
  const messageResponse = await request.get(`${mailpitApi}/message/${message!.ID}`);
  const { Text: text } = (await messageResponse.json()) as { Text: string };
  const magicLink = text.match(/Sign in \( (https?:\/\/\S+) \)/)?.[1];
  await page.goto(magicLink!);
  await page.goto("/app/my-work");

  for (const heading of ["Atrasadas", "Hoje", "Próximas", "Aguardando aprovação"]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(page.getByText("Revisar formulário", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Adaptar peças sociais", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Validar mídia paga", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Consolidar guia", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Planejar vitrine", { exact: true })).toHaveCount(0);

  await page.setViewportSize({ height: 844, width: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ fullPage: true, path: "test-results/my-work-390.png" });
});

test("seed user signs in, operates the accessible shell and signs out", async ({
  page,
  request,
}) => {
  const email = "admin@aurora.workflow.local";
  const startedAt = Date.now();
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Enviar link de acesso" }).click();
  await expect(page.getByRole("status")).toContainText("Link enviado");

  await expect
    .poll(async () => {
      const response = await request.get(`${mailpitApi}/messages`);
      const body = (await response.json()) as { messages: MailpitMessage[] };
      return body.messages.find(
        (message) =>
          new Date(message.Created).getTime() >= startedAt &&
          message.To.some((recipient) => recipient.Address === email),
      )?.ID;
    })
    .toBeTruthy();

  const listResponse = await request.get(`${mailpitApi}/messages`);
  const list = (await listResponse.json()) as { messages: MailpitMessage[] };
  const message = list.messages.find(
    (candidate) =>
      new Date(candidate.Created).getTime() >= startedAt &&
      candidate.To.some((recipient) => recipient.Address === email),
  );
  expect(message).toBeTruthy();
  const messageResponse = await request.get(`${mailpitApi}/message/${message!.ID}`);
  const { Text: text } = (await messageResponse.json()) as { Text: string };
  const magicLink = text.match(/Sign in \( (https?:\/\/\S+) \)/)?.[1];
  expect(magicLink).toBeTruthy();

  await page.goto(magicLink!);
  await expect(page).toHaveURL("http://localhost:3000/app");
  await expect(page.getByText("Sessão verificada no servidor")).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  for (const viewport of [
    { height: 900, label: "1440", width: 1440 },
    { height: 1024, label: "768", width: 768 },
    { height: 844, label: "390", width: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(350);
    await expect(page.getByRole("heading", { name: /3 situa/ })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.screenshot({ fullPage: true, path: `test-results/shell-${viewport.label}.png` });
  }

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/app/clients");
  await page.getByRole("link", { name: /Órbita Tecnologia/ }).click();
  await page.getByRole("link", { name: /Lançamento Q3/ }).click();
  await page.getByRole("link", { name: /Landing page/ }).click();
  await page.getByRole("link", { name: /Revisar formulário/ }).click();
  await expect(page).toHaveURL(/\/tasks\/50000000-0000-0000-0000-000000000001$/);
  await expect(page.getByRole("heading", { level: 1, name: "Revisar formulário" })).toBeVisible();

  const blockReason = page.getByLabel("Motivo do bloqueio");
  await blockReason.fill("");
  expect(await blockReason.evaluate((field: HTMLInputElement) => field.validity.valueMissing)).toBe(
    true,
  );
  await blockReason.fill("Aguardando credencial fictícia do ambiente de homologação.");
  await page.getByRole("button", { name: "Salvar tarefa" }).click();
  await expect(page.getByRole("status")).toContainText("Alterações salvas");

  await page.goto("/app/clients/20000000-0000-0000-0000-000000000002");
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
  await page.goto("/app");

  await page.setViewportSize({ height: 844, width: 390 });
  const menu = page.getByRole("button", { name: "Abrir menu" });
  await menu.click();
  await expect(page.locator(".app-sidebar .workflow-brand")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();

  const modalTrigger = page.getByRole("button", { name: "Abrir modal" });
  await modalTrigger.click();
  await expect(page.getByRole("dialog", { name: "Concluir tarefa" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(modalTrigger).toBeFocused();

  await menu.click();
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL("http://localhost:3000/login");
  await page.goto("/app");
  await expect(page).toHaveURL("http://localhost:3000/login");
  expect(consoleErrors).toEqual([]);
});
