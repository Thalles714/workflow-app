import Link from "next/link";

import { DemoLoginForm } from "@/components/demo/demo-login-form";
import { LoginShell } from "@/components/layouts/app-shell";

export default function DemoLoginPage() {
  return (
    <LoginShell>
      <div id="login-form">
        <Link className="ui-button ui-button--secondary login-demo-link" href="/demo">
          ← Voltar à demonstração
        </Link>
        <span className="eyebrow">Agência Aurora · prévia pública</span>
        <h1>Entre na operação.</h1>
        <p>
          Conheça a experiência de acesso por link mágico. Esta simulação não cria conta nem envia
          e-mail.
        </p>
        <DemoLoginForm />
        <a
          className="login-back"
          href="https://github.com/Thalles714/workflow-app"
          rel="noreferrer"
          target="_blank"
        >
          Ver autenticação real no repositório ↗
        </a>
      </div>
    </LoginShell>
  );
}
