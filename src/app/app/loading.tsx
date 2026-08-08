import { Skeleton } from "@/components/ui";
export default function LoadingOperation() {
  return (
    <main className="app-content" aria-busy="true" aria-label="Carregando Painel da Operação">
      <div className="skeleton-card">
        <Skeleton />
        <Skeleton className="ui-skeleton--short" />
        <Skeleton />
        <Skeleton />
      </div>
    </main>
  );
}
