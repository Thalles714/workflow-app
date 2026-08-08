"use client";

import { useState, type FormEvent } from "react";

import { Alert, Button, Field, Input } from "@/components/ui";

export function DemoLoginForm() {
  const [simulated, setSimulated] = useState(false);

  function simulateLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSimulated(true);
  }

  return (
    <>
      {simulated ? (
        <Alert title="Link demonstrativo enviado" tone="success">
          Em uma conta real, o acesso chegaria por e-mail. Nesta demonstração nenhum dado foi
          enviado.
        </Alert>
      ) : null}
      <form className="login-form" onSubmit={simulateLogin}>
        <Field label="E-mail" helper="Use qualquer endereço fictício para testar a interação.">
          <Input
            autoComplete="email"
            defaultValue="gestora@agenciaaurora.demo"
            id="demo-email"
            name="email"
            required
            type="email"
          />
        </Field>
        <Button type="submit" variant="primary">
          Simular envio do link →
        </Button>
      </form>
    </>
  );
}
