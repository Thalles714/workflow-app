/* eslint-disable react-hooks/error-boundaries -- try/catch converts only awaited tenant lookups to a non-enumerating 404. */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveForm, EntityForm } from "@/components/core/entity-form";
import { Breadcrumbs, CoreShell, PageHeading } from "@/components/core/core-shell";
import { Alert, Card, EmptyState } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { createServerClientService } from "@/modules/clients/server";
import {
  archiveProjectAction,
  createDeliverableAction,
  updateProjectAction,
} from "@/modules/core/actions";
import { auroraWorkspaceId } from "@/modules/core/contracts";
import { createServerDeliverableService } from "@/modules/deliverables/server";
import { createServerProjectService } from "@/modules/projects/server";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ clientId: string; projectId: string }>;
}) {
  const { clientId, projectId } = await params;
  const context = await createAuthorizationContext(auroraWorkspaceId);
  try {
    const [client, project] = await Promise.all([
      (await createServerClientService()).get(context, { id: clientId }),
      (await createServerProjectService()).get(context, { id: projectId }),
    ]);
    if (project.clientId !== client.id) notFound();
    const deliverables = await (
      await createServerDeliverableService()
    ).list(context, { projectId });
    const admin = context.role === "ADMIN";
    return (
      <CoreShell>
        <div className="core-page">
          <Breadcrumbs
            items={[
              { label: "Clientes", href: "/app/clients" },
              { label: client.name, href: `/app/clients/${client.id}` },
              { label: project.name },
            ]}
          />
          <PageHeading
            eyebrow="Projeto"
            title={project.name}
            description={project.description || "Visão operacional do projeto."}
          />
          {!admin && (
            <Alert title="Acesso de membro" tone="info">
              Alterações de projeto e entrega exigem ADMIN.
            </Alert>
          )}
          {admin && (
            <div className="detail-columns">
              <Card>
                <h2 className="core-section-title">Editar projeto</h2>
                <EntityForm
                  action={updateProjectAction}
                  fields={[
                    { defaultValue: project.id, label: "", name: "id", type: "hidden" },
                    { defaultValue: project.name, label: "Nome", name: "name", required: true },
                    {
                      defaultValue: project.description,
                      label: "Descrição",
                      name: "description",
                      type: "textarea",
                    },
                    {
                      defaultValue: project.status,
                      label: "Status",
                      name: "status",
                      type: "select",
                      options: [
                        { label: "Ativo", value: "ACTIVE" },
                        { label: "Concluído", value: "COMPLETED" },
                      ],
                    },
                  ]}
                  submitLabel="Salvar projeto"
                />
                <ArchiveForm action={archiveProjectAction} id={project.id} />
              </Card>
              <Card>
                <h2 className="core-section-title">Nova entrega</h2>
                <EntityForm
                  action={createDeliverableAction}
                  fields={[
                    { defaultValue: project.id, label: "", name: "projectId", type: "hidden" },
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
            </div>
          )}
          <section className="entity-grid">
            {deliverables.length ? (
              deliverables.map((item) => (
                <Link
                  className="entity-card entity-card--aqua"
                  href={
                    `/app/clients/${client.id}/projects/${project.id}/deliverables/${item.id}` as never
                  }
                  key={item.id}
                >
                  <span className="eyebrow">{item.status.replaceAll("_", " ")}</span>
                  <h2>{item.name}</h2>
                  <p>
                    {item.dueAt
                      ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                          new Date(item.dueAt),
                        )
                      : "Sem prazo"}
                  </p>
                </Link>
              ))
            ) : (
              <EmptyState
                title="Projeto sem entregas"
                description="Entrega é um resultado próprio, separado das tarefas."
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
