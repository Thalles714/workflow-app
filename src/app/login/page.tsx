import Link from "next/link";

import { LoginShell } from "@/components/layouts/app-shell";
import { Alert, Button, Field, Input } from "@/components/ui";
import { requestLogin } from "@/modules/auth/actions";

type LoginPageProps = { searchParams: Promise<{ status?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { status } = await searchParams;
  return (
    <LoginShell>
      <div id="login-form">
        <Link className="ui-button ui-button--secondary login-demo-link" href={"/demo" as never}>
          Explorar demonstração pública →
        </Link>
        <span className="eyebrow">Agência Aurora · acesso local</span>
        <h1>Entre na operação.</h1>
        <p>Receba um link de acesso no Mailpit local. Novos cadastros estão desativados.</p>
        {status === "sent" && (
          <Alert title="Link enviado" tone="success">
            Abra a caixa local do Mailpit para continuar.
          </Alert>
        )}
        {status === "error" && (
          <Alert title="Não foi possível iniciar o acesso" tone="error">
            Confira o e-mail e o ambiente local.
          </Alert>
        )}
        <form action={requestLogin} className="login-form">
          <Field label="E-mail" helper="Use uma das contas fictícias do seed.">
            <Input autoComplete="email" id="email" name="email" required type="email" />
          </Field>
          <Button type="submit" variant="primary">
            Enviar link de acesso →
          </Button>
        </form>
        <Link className="login-back" href="/">
          Voltar à página local
        </Link>
      </div>
    </LoginShell>
  );
}
