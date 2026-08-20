"use client";

import { RouteErrorState } from "@/components/core/route-error-state";

export default function MyWorkError({ retry }: { retry: () => void }) {
  return (
    <RouteErrorState
      description="Sua fila não foi alterada. Tente buscar suas prioridades novamente."
      eyebrow="Prioridades indisponíveis"
      retry={retry}
      title="Não foi possível carregar seu trabalho"
    />
  );
}
