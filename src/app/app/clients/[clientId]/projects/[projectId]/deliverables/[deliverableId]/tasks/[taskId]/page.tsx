/* eslint-disable react-hooks/error-boundaries -- try/catch converts only awaited tenant lookups to a non-enumerating 404. */
import { notFound } from "next/navigation";
import { ArchiveForm, EntityForm, type FormField } from "@/components/core/entity-form";
import { Breadcrumbs, CoreShell, PageHeading } from "@/components/core/core-shell";
import { Alert, Badge, Card } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { createServerClientService } from "@/modules/clients/server";
import {
  archiveTaskAction,
  createTaskUpdateAction,
  updateTaskAction,
} from "@/modules/core/actions";
import { createServerDeliverableService } from "@/modules/deliverables/server";
import { createServerProjectService } from "@/modules/projects/server";
import { listWorkspaceMembers } from "@/modules/tasks/members";
import { createServerTaskService } from "@/modules/tasks/server";
import { createServerTaskUpdateService } from "@/modules/updates/server";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ clientId: string; deliverableId: string; projectId: string; taskId: string }>;
}) {
  const { clientId, deliverableId, projectId, taskId } = await params;
  const context = await createAuthorizationContext();
  try {
    const [client, project, deliverable, task, members, updates] = await Promise.all([
      (await createServerClientService()).get(context, { id: clientId }),
      (await createServerProjectService()).get(context, { id: projectId }),
      (await createServerDeliverableService()).get(context, { id: deliverableId }),
      (await createServerTaskService()).get(context, { id: taskId }),
      listWorkspaceMembers(context),
      (await createServerTaskUpdateService()).list(context, { taskId, limit: 20 }),
    ]);
    if (
      project.clientId !== client.id ||
      deliverable.projectId !== project.id ||
      task.deliverableId !== deliverable.id
    )
      notFound();
    const admin = context.role === "ADMIN";
    const ownTask = task.assigneeId === context.actorId;
    const fields: FormField[] = [
      { defaultValue: task.id, label: "", name: "id", type: "hidden" },
      ...(admin
        ? ([
            { defaultValue: task.title, label: "Título", name: "title", required: true },
            {
              defaultValue: task.assigneeId ?? "",
              label: "Responsável",
              name: "assigneeId",
              type: "select",
              options: [
                { label: "Sem responsável", value: "" },
                ...members.map((member) => ({ label: member.name, value: member.id })),
              ],
            },
            {
              defaultValue: dateInput(task.dueAt),
              label: "Prazo",
              name: "dueAt",
              type: "datetime-local",
            },
            {
              defaultValue: task.priority,
              label: "Prioridade",
              name: "priority",
              type: "select",
              options: options(["LOW", "MEDIUM", "HIGH", "URGENT"]),
            },
          ] satisfies FormField[])
        : []),
      { defaultValue: task.description, label: "Descrição", name: "description", type: "textarea" },
      {
        defaultValue: task.status,
        label: "Status",
        name: "status",
        type: "select",
        options: options(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
      },
      {
        defaultValue: String(task.isBlocked),
        label: "Tarefa bloqueada",
        name: "isBlocked",
        type: "checkbox",
      },
      { defaultValue: task.blockReason ?? "", label: "Motivo do bloqueio", name: "blockReason" },
    ];
    return (
      <CoreShell>
        <div className="core-page">
          <Breadcrumbs
            items={[
              { label: client.name, href: `/app/clients/${client.id}` },
              { label: project.name, href: `/app/clients/${client.id}/projects/${project.id}` },
              {
                label: deliverable.name,
                href: `/app/clients/${client.id}/projects/${project.id}/deliverables/${deliverable.id}`,
              },
              { label: task.title },
            ]}
          />
          <PageHeading
            eyebrow="Tarefa"
            title={task.title}
            description="Execução, responsabilidade e bloqueio com motivo explícito."
            action={
              <Badge
                tone={task.isBlocked ? "critical" : task.status === "DONE" ? "success" : "info"}
              >
                {task.isBlocked ? "Bloqueada" : task.status.replaceAll("_", " ")}
              </Badge>
            }
          />
          {!admin && !ownTask && (
            <Alert title="Somente leitura" tone="warning">
              Esta tarefa pertence a outro responsável. MEMBER não pode alterá-la.
            </Alert>
          )}
          <Card>
            <dl className="task-facts">
              <div>
                <dt>Prioridade</dt>
                <dd>{task.priority}</dd>
              </div>
              <div>
                <dt>Prazo</dt>
                <dd>
                  {task.dueAt
                    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                        new Date(task.dueAt),
                      )
                    : "Sem prazo"}
                </dd>
              </div>
              <div>
                <dt>Responsável</dt>
                <dd>
                  {members.find((member) => member.id === task.assigneeId)?.name ?? "Não atribuído"}
                </dd>
              </div>
            </dl>
          </Card>
          {(admin || ownTask) && (
            <Card>
              <h2 className="core-section-title">
                {admin ? "Editar tarefa" : "Atualizar meu trabalho"}
              </h2>
              <EntityForm action={updateTaskAction} fields={fields} submitLabel="Salvar tarefa" />
              {admin && <ArchiveForm action={archiveTaskAction} id={task.id} />}
            </Card>
          )}
          <Card>
            <h2 className="core-section-title">Atualizações</h2>
            <EntityForm
              action={createTaskUpdateAction}
              fields={[
                { defaultValue: task.id, label: "", name: "taskId", type: "hidden" },
                { label: "Atualização curta", name: "body", required: true, type: "textarea" },
              ]}
              submitLabel="Registrar atualização"
            />
            {updates.length ? (
              <ul>
                {updates.map((update) => (
                  <li key={update.id}>{update.body}</li>
                ))}
              </ul>
            ) : (
              <p>Sem atualizações registradas.</p>
            )}
          </Card>
        </div>
      </CoreShell>
    );
  } catch {
    notFound();
  }
}
function options(values: string[]) {
  return values.map((value) => ({ label: value.replaceAll("_", " "), value }));
}
function dateInput(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
}
