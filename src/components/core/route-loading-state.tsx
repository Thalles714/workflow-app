import { Card, Skeleton } from "../ui";

export function RouteLoadingState({ label }: { label: string }) {
  return (
    <main aria-busy="true" aria-label={`Carregando ${label}`} className="core-page">
      <Skeleton className="ui-skeleton--short" />
      <Card>
        <Skeleton className="ui-skeleton--short" />
      </Card>
      <Card>
        <Skeleton />
      </Card>
    </main>
  );
}
