import { expect, test, type APIRequestContext } from "@playwright/test";

const mailpitApi = "http://127.0.0.1:54324/api/v1";
const adminEmail = "admin@aurora.workflow.local";

type MailpitMessage = {
  Created: string;
  ID: string;
  To: Array<{ Address: string }>;
};

async function readMagicLink(request: APIRequestContext, startedAt: number) {
  let magicLink: string | null = null;
  await expect
    .poll(
      async () => {
        const messages = (await (await request.get(`${mailpitApi}/messages`)).json()) as {
          messages: MailpitMessage[];
        };
        const message = messages.messages.find(
          (candidate) =>
            candidate.To.some((recipient) => recipient.Address === adminEmail) &&
            new Date(candidate.Created).getTime() >= startedAt,
        );
        if (!message) return null;

        const body = (await (await request.get(`${mailpitApi}/message/${message.ID}`)).json()) as {
          Text: string;
        };
        magicLink = body.Text.match(/Sign in \( (https?:\/\/\S+) \)/)?.[1] ?? null;
        return magicLink;
      },
      { timeout: 20_000 },
    )
    .not.toBeNull();
  return magicLink!;
}

test("administra uma aprovação autenticada com confirmação e estado auditável", async ({
  page,
  request,
}) => {
  const startedAt = Date.now();
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(adminEmail);
  await page.getByRole("button", { name: "Enviar link de acesso" }).click();
  await expect(page.getByRole("status")).toContainText("Link enviado");

  await page.goto(await readMagicLink(request, startedAt));
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/approvals");
  await expect(page.getByRole("heading", { name: "Aprovações" })).toBeVisible();

  await page.getByLabel("Nota da decisão").fill("Aprovado durante o gate de qualidade.");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Registrar decisão" }).click();

  await expect(page.getByText("APPROVED", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Aprovado durante o gate de qualidade.", { exact: true }),
  ).toBeVisible();
});
