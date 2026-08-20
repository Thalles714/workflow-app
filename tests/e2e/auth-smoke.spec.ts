import { expect, test, type APIRequestContext } from "@playwright/test";

const adminEmail = "admin@aurora.workflow.local";
const mailpitApi = "http://127.0.0.1:54324/api/v1";

type MailpitMessage = { Created: string; ID: string; To: { Address: string }[] };

test("admin signs in, sees the authenticated shell and signs out", async ({ page, request }) => {
  const startedAt = Date.now();

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(adminEmail);
  await page.getByRole("button", { name: "Enviar link de acesso" }).click();
  await expect(page.getByRole("status")).toContainText("Link enviado");

  await page.goto(await readMagicLink(request, startedAt, adminEmail));
  await expect(page).toHaveURL("http://localhost:3000/app");
  await expect(page.getByRole("heading", { name: /Onde agir agora/ })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Navegação principal" })).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL("http://localhost:3000/login");

  await page.goto("/app");
  await expect(page).toHaveURL("http://localhost:3000/login");
});

test("admin enters the workspace derived from their active membership", async ({
  page,
  request,
}) => {
  const horizonteEmail = "admin@horizonte.workflow.local";
  const startedAt = Date.now();

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(horizonteEmail);
  await page.getByRole("button", { name: "Enviar link de acesso" }).click();
  await expect(page.getByRole("status")).toContainText("Link enviado");

  await page.goto(await readMagicLink(request, startedAt, horizonteEmail));
  await page.goto("/app/clients");
  await expect(page.getByText("Norte Comércio", { exact: true })).toBeVisible();
  await expect(page.getByText("Órbita Tecnologia", { exact: true })).toHaveCount(0);
});

async function readMagicLink(request: APIRequestContext, startedAt: number, email: string) {
  const messageId = await expect
    .poll(async () => {
      const response = await request.get(`${mailpitApi}/messages`);
      if (!response.ok()) return undefined;

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
  expect(message).toBeTruthy();

  const messageResponse = await request.get(`${mailpitApi}/message/${message!.ID}`);
  const { Text: text } = (await messageResponse.json()) as { Text: string };
  const magicLink = text.match(/Sign in \( (https?:\/\/\S+) \)/)?.[1];
  expect(magicLink).toBeTruthy();
  return magicLink!;
}
