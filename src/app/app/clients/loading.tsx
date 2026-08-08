import { Skeleton } from "@/components/ui";
export default function LoadingClients() {
  return (
    <main className="core-page">
      <div className="skeleton-card">
        <Skeleton />
        <Skeleton className="ui-skeleton--short" />
        <Skeleton />
      </div>
    </main>
  );
}
