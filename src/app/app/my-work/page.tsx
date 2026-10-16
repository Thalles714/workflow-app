import Link from "next/link";

import { Breadcrumbs, CoreShell, PageHeading } from "@/components/core/core-shell";
import { Badge, EmptyState } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import type { MyWorkGroups, MyWorkTask } from "@/modules/my-work/grouping";
import { createServerMyWorkService } from "@/modules/my-work/server";

type View = "all" | "blocked" | "priority";
const groups: ReadonlyArray<{
  description: string;
  key: keyof MyWorkGroups;
  title: string;
  tone: string;
}> = [
  {
    key: "overdue",
    title: "Atrasadas",
    description: "Prazo encerrado; comece por aqui.",
    tone: "coral",
  },
  {
    key: "today",
    title: "Hoje",
    description: "Compromissos do dia no fuso da agência.",
    tone: "blue",
  },
  {
    key: "upcoming",
    title: "Próximas",
    description: "De amanhã até os próximos sete dias.",
    tone: "aqua",
  },
  {
    key: "awaitingApproval",
    title: "Aguardando aprovação",
    description: "Entrega com decisão interna pendente, sem duplicar tarefas.",
    tone: "iris",
  },
];

export default async function MyWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const context = await createAuthorizationContext();
  const work = await (await createServerMyWorkService()).listMyWork(context);
  const view = parseView((await searchParams).view);
  const visible = filterGroups(work, view);
  const total = Object.values(visible).flat().length;
  return (
    <CoreShell>
      <div className="core-page my-work-page">
        <Breadcrumbs items={[{ label: "Painel", href: "/app" }, { label: "Meu Trabalho" }]} />
        <PageHeading
          eyebrow="Prioridades pessoais"
          title="Meu Trabalho"
          description="O que pede sua atenção agora, reunido sem criar cópias das tarefas."
          action={
            <span className="my-work-total">
              <strong>{total}</strong> nesta visão
            </span>
          }
        />
        <nav aria-label="Filtrar Meu Trabalho" className="my-work-filters">
          <Filter href="/app/my-work" active={view === "all"}>
            Tudo
          </Filter>
          <Filter href="/app/my-work?view=blocked" active={view === "blocked"}>
            Bloqueadas
          </Filter>
          <Filter href="/app/my-work?view=priority" active={view === "priority"}>
            Alta prioridade
          </Filter>
        </nav>
        {total === 0 ? (
          <EmptyState
            title={view === "all" ? "Sua fila está limpa" : "Nada corresponde a este filtro"}
            description={
              view === "all"
                ? "Quando uma tarefa for atribuída a você, ela aparecerá aqui no grupo certo."
                : "Volte para todas as tarefas ou acompanhe a hierarquia dos clientes."
            }
            action={
              <Link
                className="ui-button ui-button--secondary"
                href={(view === "all" ? "/app/clients" : "/app/my-work") as never}
              >
                {view === "all" ? "Ver clientes" : "Limpar filtro"}
              </Link>
            }
          />
        ) : (
          <div className="my-work-grid">
            {groups.map((group) => (
              <section
                className={`my-work-group my-work-group--${group.tone}`}
                key={group.key}
                aria-labelledby={`group-${group.key}`}
              >
                <header>
                  <div>
                    <span className="eyebrow">{group.description}</span>
                    <h2 id={`group-${group.key}`}>{group.title}</h2>
                  </div>
                  <span
                    className="my-work-count"
                    aria-label={`${visible[group.key].length} tarefas`}
                  >
                    {String(visible[group.key].length).padStart(2, "0")}
                  </span>
                </header>
                <div className="my-work-list">
                  {visible[group.key].length ? (
                    visible[group.key].map((task) => <WorkItem key={task.id} task={task} />)
                  ) : (
                    <p className="my-work-group-empty">Nenhuma tarefa neste grupo.</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </CoreShell>
  );
}

function WorkItem({ task }: { task: MyWorkTask }) {
  const deliveryHref = `/app/clients/${task.clientId}/projects/${task.projectId}/deliverables/${task.deliverableId}`;
  const taskHref = `${deliveryHref}/tasks/${task.id}`;
  return (
    <article className="my-work-item">
      <div className="my-work-item__badges">
        <Badge tone={priorityTone(task.priority)}>{priorityLabel(task.priority)}</Badge>
        {task.isBlocked && <Badge tone="critical">Bloqueada</Badge>}
        {task.approvalStatus === "PENDING" && <Badge tone="warning">Aguardando aprovação</Badge>}
      </div>
      <h3>
        <Link href={taskHref as never}>{task.title}</Link>
      </h3>
      <p>
        {task.clientName} · {task.projectName}
      </p>
      <div className="my-work-item__footer">
        <Link href={deliveryHref as never}>{task.deliverableName}</Link>
        <time dateTime={task.dueAt ?? undefined}>{formatDueDate(task.dueAt)}</time>
      </div>
      {task.isBlocked && task.blockReason && (
        <p className="my-work-block">
          <strong>Motivo:</strong> {task.blockReason}
        </p>
      )}
    </article>
  );
}
function Filter({ active, children, href }: { active: boolean; children: string; href: string }) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className="my-work-filter"
      href={href as never}
    >
      {children}
    </Link>
  );
}
function parseView(value: string | undefined): View {
  return value === "blocked" || value === "priority" ? value : "all";
}
function filterGroups(work: MyWorkGroups, view: View): MyWorkGroups {
  const include = (task: MyWorkTask) =>
    view === "all" ||
    (view === "blocked" ? task.isBlocked : task.priority === "URGENT" || task.priority === "HIGH");
  return {
    awaitingApproval: work.awaitingApproval.filter(include),
    overdue: work.overdue.filter(include),
    today: work.today.filter(include),
    upcoming: work.upcoming.filter(include),
  };
}
function priorityLabel(priority: MyWorkTask["priority"]) {
  return ({ URGENT: "Urgente", HIGH: "Alta", MEDIUM: "Média", LOW: "Baixa" } as const)[priority];
}
function priorityTone(
  priority: MyWorkTask["priority"],
): "critical" | "info" | "neutral" | "warning" {
  if (priority === "URGENT") return "critical";
  if (priority === "HIGH") return "warning";
  if (priority === "MEDIUM") return "info";
  return "neutral";
}
function formatDueDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        timeZone: "America/Sao_Paulo",
      }).format(new Date(value))
    : "Sem prazo";
}
