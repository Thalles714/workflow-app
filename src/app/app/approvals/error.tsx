"use client";

import { RouteErrorState } from "@/components/core/route-error-state";

export default function ApprovalsError({ retry }: { retry: () => void }) {
  return (
    <RouteErrorState
      description="Nenhuma decisão foi alterada. Tente carregar as aprovações novamente."
      eyebrow="Aprovações indisponíveis"
      retry={retry}
      title="Não foi possível carregar as aprovações"
    />
  );
}
