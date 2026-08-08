"use client";
import { Alert, Button } from "@/components/ui";
export default function OperationError({ reset }: { reset: () => void }) {
  return (
    <main className="app-content">
      <Alert title="Não foi possível calcular a operação" tone="error">
        Nenhuma regra foi alterada. Tente novamente.
      </Alert>
      <Button onClick={reset}>Tentar novamente</Button>
    </main>
  );
}
