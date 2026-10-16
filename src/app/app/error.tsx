"use client";

import { RouteErrorState } from "@/components/core/route-error-state";

export default function OperationError({ retry }: { retry: () => void }) {
  return (
    <RouteErrorState
      description="Nenhuma regra ou dado foi alterado. Tente carregar a operação novamente."
      eyebrow="Operação indisponível"
      retry={retry}
      title="Não foi possível calcular a operação"
    />
  );
}
