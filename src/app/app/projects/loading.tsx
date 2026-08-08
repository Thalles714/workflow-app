import { Card, Skeleton } from "@/components/ui";

export default function ProjectsLoading() {
  return (
    <div className="core-page" aria-busy="true" aria-label="Carregando projetos">
      <Skeleton className="ui-skeleton--short" />
      <Card>
        <Skeleton className="ui-skeleton--short" />
      </Card>
      <Card>
        <Skeleton />
      </Card>
    </div>
  );
}
