import { expect, test } from "@playwright/test";

const mailpitApi = "http://127.0.0.1:54324/api/v1";

type MailpitMessage = { Created: string; ID: string; To: { Address: string }[] };

test("seed user signs in by magic link and signs out", async ({ page, request }) => {
  const email = "admin@aurora.workflow.local";
  const startedAt = Date.now();

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

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL("http://localhost:3000/login");
  await page.goto("/app");
  await expect(page).toHaveURL("http://localhost:3000/login");
});
