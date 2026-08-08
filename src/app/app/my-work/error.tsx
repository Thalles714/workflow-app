"use client";
import { Alert, Button } from "@/components/ui";
export default function MyWorkError({ reset }: { reset: () => void }) {
  return (
    <main className="core-page">
      <Alert title="Não foi possível carregar seu trabalho" tone="error">
        Sua fila não foi alterada. Tente novamente.
      </Alert>
      <Button onClick={reset}>Tentar novamente</Button>
    </main>
  );
}
