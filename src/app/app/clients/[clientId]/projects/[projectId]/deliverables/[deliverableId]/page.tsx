/* eslint-disable react-hooks/error-boundaries -- try/catch converts only awaited tenant lookups to a non-enumerating 404. */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveForm, EntityForm } from "@/components/core/entity-form";
import { Breadcrumbs, CoreShell, PageHeading } from "@/components/core/core-shell";
import { Alert, Badge, Card, EmptyState } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { createServerClientService } from "@/modules/clients/server";
import {
  archiveDeliverableAction,
  createTaskAction,
  requestApprovalAction,
  updateDeliverableAction,
} from "@/modules/core/actions";
import { createServerDeliverableService } from "@/modules/deliverables/server";
import { createServerProjectService } from "@/modules/projects/server";
import { listWorkspaceMembers } from "@/modules/tasks/members";
import { createServerTaskService } from "@/modules/tasks/server";
import { createServerApprovalService } from "@/modules/approvals/server";

export default async function DeliverablePage({
  params,
}: {
  params: Promise<{ clientId: string; deliverableId: string; projectId: string }>;
}) {
  const { clientId, deliverableId, projectId } = await params;
  const context = await createAuthorizationContext();
  try {
    const [client, project, deliverable] = await Promise.all([
      (await createServerClientService()).get(context, { id: clientId }),
      (await createServerProjectService()).get(context, { id: projectId }),
      (await createServerDeliverableService()).get(context, { id: deliverableId }),
    ]);
    if (project.clientId !== client.id || deliverable.projectId !== project.id) notFound();
    const [tasks, members, approvals] = await Promise.all([
      (await createServerTaskService()).list(context, { deliverableId }),
      listWorkspaceMembers(context),
      (await createServerApprovalService()).list(context, { limit: 20 }),
    ]);
    const admin = context.role === "ADMIN";
    const memberOptions = [
      { label: "Sem responsável", value: "" },
      ...members.map((member) => ({ label: member.name, value: member.id })),
    ];
    return (
      <CoreShell>
        <div className="core-page">
          <Breadcrumbs
            items={[
              { label: client.name, href: `/app/clients/${client.id}` },
              { label: project.name, href: `/app/clients/${client.id}/projects/${project.id}` },
              { label: deliverable.name },
            ]}
          />
          <PageHeading
            eyebrow="Entrega"
            title={deliverable.name}
            description={deliverable.description || "Resultado esperado do projeto."}
            action={
              <Badge tone={deliverable.isImportant ? "warning" : "neutral"}>
                {deliverable.isImportant ? "Importante" : "Regular"}
              </Badge>
            }
          />
          {!admin && (
            <Alert title="Acesso de membro" tone="info">
              Você pode abrir tarefas; gestão da entrega exige ADMIN.
            </Alert>
          )}
          {admin && (
            <div className="detail-columns">
              <Card>
                <h2 className="core-section-title">Editar entrega</h2>
                <EntityForm
                  action={updateDeliverableAction}
                  fields={[
                    { defaultValue: deliverable.id, label: "", name: "id", type: "hidden" },
                    { defaultValue: deliverable.name, label: "Nome", name: "name", required: true },
                    {
                      defaultValue: deliverable.description,
                      label: "Descrição",
                      name: "description",
                      type: "textarea",
                    },
                    {
                      defaultValue: dateInput(deliverable.dueAt),
                      label: "Prazo",
                      name: "dueAt",
                      type: "datetime-local",
                    },
                    {
                      defaultValue: deliverable.status,
                      label: "Status",
                      name: "status",
                      type: "select",
                      options: statusOptions,
                    },
                    {
                      defaultValue: String(deliverable.isImportant),
                      label: "Entrega importante",
                      name: "isImportant",
                      type: "checkbox",
                    },
                  ]}
                  submitLabel="Salvar entrega"
                />
                <ArchiveForm action={archiveDeliverableAction} id={deliverable.id} />
              </Card>
              <Card>
                <h2 className="core-section-title">Nova tarefa</h2>
                <EntityForm
                  action={createTaskAction}
                  fields={[
                    {
                      defaultValue: deliverable.id,
                      label: "",
                      name: "deliverableId",
                      type: "hidden",
                    },
                    { label: "Título", name: "title", required: true },
                    { label: "Descrição", name: "description", type: "textarea" },
                    {
                      label: "Responsável",
                      name: "assigneeId",
                      type: "select",
                      options: memberOptions,
                    },
                    { label: "Prazo", name: "dueAt", type: "datetime-local" },
                    {
                      defaultValue: "MEDIUM",
                      label: "Prioridade",
                      name: "priority",
                      type: "select",
                      options: priorityOptions,
                    },
                    {
                      defaultValue: "TODO",
                      label: "Status",
                      name: "status",
                      type: "select",
                      options: taskStatusOptions,
                    },
                    {
                      defaultValue: "false",
                      label: "Tarefa bloqueada",
                      name: "isBlocked",
                      type: "checkbox",
                    },
                    { label: "Motivo do bloqueio", name: "blockReason" },
                  ]}
                  submitLabel="Criar tarefa"
                />
              </Card>
            </div>
          )}
          <Card>
            <h2 className="core-section-title">Aprovação interna</h2>
            {approvals.some(
              (approval) =>
                approval.deliverableId === deliverable.id && approval.status === "PENDING",
            ) ? (
              <p>Esta entrega já aguarda uma decisão interna.</p>
            ) : admin ? (
              <EntityForm
                action={requestApprovalAction}
                confirmMessage="Solicitar revisão interna desta entrega?"
                fields={[
                  {
                    defaultValue: deliverable.id,
                    label: "",
                    name: "deliverableId",
                    type: "hidden",
                  },
                  { label: "Nota para revisão", name: "note", required: true, type: "textarea" },
                ]}
                submitLabel="Solicitar aprovação"
              />
            ) : (
              <p>Somente ADMIN pode solicitar aprovação.</p>
            )}
          </Card>
          <section className="task-list">
            {tasks.length ? (
              tasks.map((task) => (
                <Link
                  className="task-row"
                  href={
                    `/app/clients/${client.id}/projects/${project.id}/deliverables/${deliverable.id}/tasks/${task.id}` as never
                  }
                  key={task.id}
                >
                  <div>
                    <Badge
                      tone={
                        task.isBlocked ? "critical" : task.status === "DONE" ? "success" : "info"
                      }
                    >
                      {task.isBlocked ? "Bloqueada" : task.status.replaceAll("_", " ")}
                    </Badge>
                    <h2>{task.title}</h2>
                    <p>{task.description || "Sem descrição."}</p>
                  </div>
                  <strong>{task.priority}</strong>
                </Link>
              ))
            ) : (
              <EmptyState
                title="Entrega sem tarefas"
                description="Crie tarefas executáveis sem transformar a entrega em tarefa."
              />
            )}
          </section>
        </div>
      </CoreShell>
    );
  } catch {
    notFound();
  }
}
const statusOptions = ["PLANNED", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"].map((value) => ({
  label: value.replaceAll("_", " "),
  value,
}));
const taskStatusOptions = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].map((value) => ({
  label: value.replaceAll("_", " "),
  value,
}));
const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"].map((value) => ({
  label: value,
  value,
}));
function dateInput(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
}
