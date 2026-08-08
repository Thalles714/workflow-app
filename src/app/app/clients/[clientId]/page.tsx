import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveForm, EntityForm } from "@/components/core/entity-form";
import { Breadcrumbs, CoreShell, PageHeading } from "@/components/core/core-shell";
import { Alert, Card, EmptyState } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { createServerClientService } from "@/modules/clients/server";
import {
  archiveClientAction,
  createProjectAction,
  updateClientAction,
} from "@/modules/core/actions";
import { auroraWorkspaceId } from "@/modules/core/contracts";
import { createServerProjectService } from "@/modules/projects/server";

export default async function ClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const context = await createAuthorizationContext(auroraWorkspaceId);
  const clients = await createServerClientService();
  let client;
  try {
    client = await clients.get(context, { id: clientId });
  } catch {
    notFound();
  }
  const projects = await (await createServerProjectService()).list(context, { clientId });
  const admin = context.role === "ADMIN";
  return (
    <CoreShell>
      <div className="core-page">
        <Breadcrumbs
          items={[{ label: "Clientes", href: "/app/clients" }, { label: client.name }]}
        />
        <PageHeading
          eyebrow="Cliente"
          title={client.name}
          description="Projetos, entregas e decisões dentro do mesmo contexto."
        />
        {!admin && (
          <Alert title="Acesso de membro" tone="info">
            Você pode consultar o cliente, mas alterações estruturais exigem ADMIN.
          </Alert>
        )}
        {admin && (
          <div className="detail-columns">
            <Card>
              <h2 className="core-section-title">Editar cliente</h2>
              <EntityForm
                action={updateClientAction}
                fields={[
                  { defaultValue: client.id, label: "", name: "id", type: "hidden" },
                  { defaultValue: client.name, label: "Nome", name: "name", required: true },
                ]}
                submitLabel="Salvar cliente"
              />
              <ArchiveForm action={archiveClientAction} id={client.id} />
            </Card>
            <Card>
              <h2 className="core-section-title">Novo projeto</h2>
              <EntityForm
                action={createProjectAction}
                fields={[
                  { defaultValue: client.id, label: "", name: "clientId", type: "hidden" },
                  { label: "Nome", name: "name", required: true },
                  { label: "Descrição", name: "description", type: "textarea" },
                ]}
                submitLabel="Criar projeto"
              />
            </Card>
          </div>
        )}
        <section className="entity-grid" aria-label="Projetos">
          {projects.length ? (
            projects.map((project) => (
              <Link
                className="entity-card entity-card--blue"
                href={`/app/clients/${client.id}/projects/${project.id}` as never}
                key={project.id}
              >
                <span className="eyebrow">
                  {project.status === "ACTIVE" ? "Projeto ativo" : "Concluído"}
                </span>
                <h2>{project.name}</h2>
                <p>{project.description || "Sem descrição."}</p>
              </Link>
            ))
          ) : (
            <EmptyState
              title="Cliente sem projetos"
              description="Crie um projeto para organizar entregas e tarefas."
            />
          )}
        </section>
      </div>
    </CoreShell>
  );
}
