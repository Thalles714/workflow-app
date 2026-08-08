import { Skeleton } from "@/components/ui";
export default function LoadingMyWork() {
  return (
    <main className="core-page" aria-busy="true" aria-label="Carregando Meu Trabalho">
      <div className="skeleton-card">
        <Skeleton />
        <Skeleton className="ui-skeleton--short" />
        <Skeleton />
        <Skeleton />
      </div>
    </main>
  );
}
