"use client";

import { RouteErrorState } from "@/components/core/route-error-state";

export default function ClientsError({ retry }: { retry: () => void }) {
  return (
    <RouteErrorState
      description="Nenhum cadastro foi alterado. Tente carregar os clientes novamente."
      eyebrow="Clientes indisponíveis"
      retry={retry}
      title="Não foi possível carregar os clientes"
    />
  );
}
