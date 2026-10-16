/* eslint-disable react-hooks/error-boundaries -- awaited tenant lookups become a non-enumerating 404. */
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, CoreShell, PageHeading } from "@/components/core/core-shell";
import { EntityForm } from "@/components/core/entity-form";
import { StatusControl, TaskDrawerButton } from "@/components/projects/project-task-controls";
import { Badge, Card, EmptyState, Select } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { DomainError } from "@/modules/authorization/errors";
import { createServerClientService } from "@/modules/clients/server";
import { createDeliverableAction } from "@/modules/core/actions";
import {
  parseProjectWorkspaceSearch,
  type ProjectTask,
  type ProjectView,
} from "@/modules/projects/workspace";
import { createServerProjectWorkspaceService } from "@/modules/projects/workspace-server";
import type { ProjectWorkspaceResult } from "@/modules/projects/workspace-service";

const statusColumns = [
  ["TODO", "A fazer"],
  ["IN_PROGRESS", "Em andamento"],
  ["IN_REVIEW", "Em revisão"],
  ["DONE", "Concluída"],
] as const;

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string; projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { clientId, projectId } = await params;
  const search = parseProjectWorkspaceSearch(await searchParams);
  const { view, ...filters } = search;
  const context = await createAuthorizationContext();
  try {
    const [client, workspace] = await Promise.all([
      (await createServerClientService()).get(context, { id: clientId }),
      (await createServerProjectWorkspaceService()).getProjectWorkspace(
        context,
        projectId,
        filters,
      ),
    ]);
    if (workspace.project.clientId !== client.id) notFound();
    const basePath = `/app/clients/${client.id}/projects/${workspace.project.id}`;
    const query = filterQuery(search);
    return (
      <CoreShell>
        <div className="core-page project-workspace">
          <Breadcrumbs
            items={[
              { label: "Clientes", href: "/app/clients" },
              { label: client.name, href: `/app/clients/${client.id}` },
              { label: workspace.project.name },
            ]}
          />
          <PageHeading
            eyebrow={`Projeto · ${workspace.project.status === "ACTIVE" ? "Ativo" : "Concluído"}`}
            title={workspace.project.name}
            description={workspace.project.description || "Visão operacional do projeto."}
            action={
              <div className="project-heading-summary">
                <strong>{workspace.summary.total}</strong>
                <span>tarefas visíveis</span>
              </div>
            }
          />
          <ProjectTabs basePath={basePath} query={query} view={view} />
          <ProjectFilters basePath={basePath} members={workspace.members} search={search} />
          {workspace.tasks.length === 0 ? (
            <EmptyState
              title="Nenhuma tarefa nesta visão"
              description="Ajuste os filtros ou crie uma entrega para organizar o trabalho."
              action={
                <Link
                  className="ui-button ui-button--secondary"
                  href={`${basePath}?view=${view}` as never}
                >
                  Limpar filtros
                </Link>
              }
            />
          ) : view === "overview" ? (
            <Overview basePath={basePath} data={workspace} />
          ) : view === "board" ? (
            <Board basePath={basePath} tasks={workspace.tasks} />
          ) : (
            <TaskList basePath={basePath} tasks={workspace.tasks} />
          )}
          {context.role === "ADMIN" && view === "overview" && (
            <details className="project-admin">
              <summary>Adicionar entrega</summary>
              <Card>
                <EntityForm
                  action={createDeliverableAction}
                  fields={[
                    {
                      defaultValue: workspace.project.id,
                      label: "",
                      name: "projectId",
                      type: "hidden",
                    },
                    { label: "Nome", name: "name", required: true },
                    { label: "Descrição", name: "description", type: "textarea" },
                    { label: "Prazo", name: "dueAt", type: "datetime-local" },
                    {
                      defaultValue: "false",
                      label: "Entrega importante",
                      name: "isImportant",
                      type: "checkbox",
                    },
                  ]}
                  submitLabel="Criar entrega"
                />
              </Card>
            </details>
          )}
        </div>
      </CoreShell>
    );
  } catch (error) {
    if (error instanceof DomainError) notFound();
    throw error;
  }
}

function ProjectTabs({
  basePath,
  query,
  view,
}: {
  basePath: string;
  query: string;
  view: ProjectView;
}) {
  return (
    <nav aria-label="Visualização do projeto" className="project-tabs">
      {(["overview", "board", "list"] as const).map((item) => (
        <Link
          aria-current={view === item ? "page" : undefined}
          className="project-tab"
          href={`${basePath}?view=${item}${query}` as never}
          key={item}
        >
          {item === "overview" ? "Visão geral" : item === "board" ? "Kanban" : "Lista"}
        </Link>
      ))}
    </nav>
  );
}
function ProjectFilters({
  basePath,
  members,
  search,
}: {
  basePath: string;
  members: ReadonlyArray<{ id: string; name: string }>;
  search: ReturnType<typeof parseProjectWorkspaceSearch>;
}) {
  return (
    <form action={basePath} className="project-filters" method="get">
      <input name="view" type="hidden" value={search.view} />
      <Filter label="Responsável" name="assignee" value={search.assignee}>
        <option value="">Todos</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </Filter>
      <Filter label="Status" name="status" value={search.status}>
        <option value="">Todos</option>
        {statusColumns.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Filter>
      <Filter label="Prioridade" name="priority" value={search.priority}>
        <option value="">Todas</option>
        {["URGENT", "HIGH", "MEDIUM", "LOW"].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Filter>
      <Filter label="Prazo" name="due" value={search.due}>
        <option value="">Todos</option>
        <option value="overdue">Atrasadas</option>
        <option value="today">Hoje</option>
        <option value="next7">Próximos 7 dias</option>
        <option value="none">Sem prazo</option>
      </Filter>
      <Filter label="Bloqueio" name="blocked" value={search.blocked}>
        <option value="">Todos</option>
        <option value="true">Bloqueadas</option>
        <option value="false">Sem bloqueio</option>
      </Filter>
      <button className="ui-button ui-button--primary" type="submit">
        Aplicar filtros
      </button>
    </form>
  );
}
function Filter({
  children,
  label,
  name,
  value,
}: {
  children: React.ReactNode;
  label: string;
  name: string;
  value?: string | undefined;
}) {
  return (
    <label className="ui-field">
      <span>{label}</span>
      <Select defaultValue={value ?? ""} name={name}>
        {children}
      </Select>
    </label>
  );
}

function Overview({ basePath, data }: { basePath: string; data: ProjectWorkspaceResult }) {
  const progress = data.summary.total
    ? Math.round((data.summary.completed / data.summary.total) * 100)
    : 0;
  return (
    <div className="project-overview">
      <div className="project-metrics">
        <Metric
          label="Progresso"
          value={`${progress}%`}
          detail={`${data.summary.completed} concluídas`}
        />
        <Metric
          label="Tarefas"
          value={String(data.summary.total)}
          detail={`${data.summary.blocked} bloqueada(s)`}
        />
        <Metric
          label="Entregas"
          value={String(data.deliverables.length)}
          detail="Resultados do projeto"
        />
      </div>
      <Card>
        <div className="section-heading">
          <div>
            <span className="eyebrow">Fonte única</span>
            <h2>Entregas</h2>
            <p>Resumo calculado sobre as mesmas tarefas do quadro e da lista.</p>
          </div>
        </div>
        <div className="project-deliveries">
          {data.deliverables.map((delivery) => {
            const tasks = data.tasks.filter((task) => task.deliverableId === delivery.id);
            return (
              <Link
                className="project-delivery"
                href={`${basePath}/deliverables/${delivery.id}` as never}
                key={delivery.id}
              >
                <div>
                  <h3>{delivery.name}</h3>
                  <p>
                    {tasks.filter((task) => task.status === "DONE").length} de {tasks.length}{" "}
                    tarefas concluídas
                  </p>
                </div>
                <span>{formatDate(delivery.dueAt)}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
function Metric({ detail, label, value }: { detail: string; label: string; value: string }) {
  return (
    <Card className="project-metric">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </Card>
  );
}
function Board({ basePath, tasks }: { basePath: string; tasks: ProjectTask[] }) {
  return (
    <div className="project-board">
      {statusColumns.map(([status, label]) => {
        const items = tasks.filter((task) => task.status === status);
        return (
          <section className="project-column" key={status} aria-labelledby={`column-${status}`}>
            <header>
              <h2 id={`column-${status}`}>{label}</h2>
              <span>{items.length}</span>
            </header>
            <div>
              {items.length ? (
                items.map((task) => <TaskCard basePath={basePath} key={task.id} task={task} />)
              ) : (
                <p className="project-column-empty">Nenhuma tarefa</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
function TaskCard({ basePath, task }: { basePath: string; task: ProjectTask }) {
  const href = taskHref(basePath, task);
  return (
    <article className="project-board-card">
      <div className="project-card-badges">
        <Badge tone={task.isBlocked ? "critical" : "neutral"}>
          {task.isBlocked ? "Bloqueada" : labelPriority(task.priority)}
        </Badge>
      </div>
      <h3>
        <TaskDrawerButton href={href} task={task} />
      </h3>
      <p>
        {task.deliverableName} · {task.assigneeName}
      </p>
      <time dateTime={task.dueAt ?? undefined}>{formatDate(task.dueAt)}</time>
      <StatusControl task={task} />
    </article>
  );
}
function TaskList({ basePath, tasks }: { basePath: string; tasks: ProjectTask[] }) {
  return (
    <div className="project-list" role="region" aria-label="Lista de tarefas">
      <table>
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Entrega</th>
            <th>Responsável</th>
            <th>Prioridade</th>
            <th>Prazo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td data-label="Tarefa">
                <TaskDrawerButton href={taskHref(basePath, task)} task={task} />
                {task.isBlocked && <Badge tone="critical">Bloqueada</Badge>}
              </td>
              <td data-label="Entrega">{task.deliverableName}</td>
              <td data-label="Responsável">{task.assigneeName}</td>
              <td data-label="Prioridade">{labelPriority(task.priority)}</td>
              <td data-label="Prazo">{formatDate(task.dueAt)}</td>
              <td data-label="Status">
                <StatusControl task={task} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function taskHref(basePath: string, task: ProjectTask) {
  return `${basePath}/deliverables/${task.deliverableId}/tasks/${task.id}`;
}
function filterQuery(search: ReturnType<typeof parseProjectWorkspaceSearch>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(search))
    if (key !== "view" && value) query.set(key, value);
  const value = query.toString();
  return value ? `&${value}` : "";
}
function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value))
    : "Sem prazo";
}
function labelPriority(priority: ProjectTask["priority"]) {
  return ({ LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta", URGENT: "Urgente" } as const)[priority];
}
