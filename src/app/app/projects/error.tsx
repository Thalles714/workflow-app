"use client";

import { RouteErrorState } from "@/components/core/route-error-state";

export default function ProjectsError({ retry }: { retry: () => void }) {
  return (
    <RouteErrorState
      description="Seus dados foram preservados. Tente carregar a lista novamente."
      eyebrow="Projetos indisponíveis"
      retry={retry}
      title="Não foi possível carregar os projetos"
    />
  );
}
