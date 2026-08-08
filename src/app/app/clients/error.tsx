"use client";
import { Alert, Button } from "@/components/ui";
export default function ClientsError({ reset }: { reset: () => void }) {
  return (
    <main className="core-page">
      <Alert title="Não foi possível carregar os clientes" tone="error">
        Os dados não foram alterados.
      </Alert>
      <Button onClick={reset}>Tentar novamente</Button>
    </main>
  );
}
