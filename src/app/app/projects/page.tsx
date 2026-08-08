import Link from "next/link";

import { Breadcrumbs, CoreShell, PageHeading } from "@/components/core/core-shell";
import { EmptyState } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { createServerClientService } from "@/modules/clients/server";
import { auroraWorkspaceId } from "@/modules/core/contracts";
import { createServerProjectService } from "@/modules/projects/server";

export default async function ProjectsPage() {
  const context = await createAuthorizationContext(auroraWorkspaceId);
  const [projects, clients] = await Promise.all([
    (await createServerProjectService()).list(context),
    (await createServerClientService()).list(context),
  ]);
  const clientNames = new Map(clients.map((client) => [client.id, client.name]));
  const active = projects.filter((project) => project.status === "ACTIVE").length;
  const completed = projects.length - active;

  return (
    <CoreShell>
      <div className="core-page projects-index">
        <Breadcrumbs items={[{ label: "Painel", href: "/app" }, { label: "Projetos" }]} />
        <PageHeading
          eyebrow="Portfólio"
          title="Projetos"
          description="Acompanhe o trabalho de todos os clientes e entre direto no projeto que precisa de atenção."
          action={
            <div className="projects-index__summary" aria-label="Resumo dos projetos">
              <span>
                <strong>{active}</strong> ativos
              </span>
              <i aria-hidden="true" />
              <span>
                <strong>{completed}</strong> concluídos
              </span>
            </div>
          }
        />
        {projects.length ? (
          <section className="projects-index__list" aria-label="Todos os projetos">
            {projects.map((project) => {
              const clientName = clientNames.get(project.clientId) ?? "Cliente";
              return (
                <Link
                  className="project-index-card"
                  href={`/app/clients/${project.clientId}/projects/${project.id}` as never}
                  key={project.id}
                >
                  <div className="project-index-card__identity">
                    <span className="project-index-card__mark" aria-hidden="true">
                      {project.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <span className="eyebrow">{clientName}</span>
                      <h2>{project.name}</h2>
                      <p>{project.description || "Projeto sem descrição."}</p>
                    </div>
                  </div>
                  <div className="project-index-card__meta">
                    <span className="project-status" data-status={project.status.toLowerCase()}>
                      <i aria-hidden="true" />
                      {project.status === "ACTIVE" ? "Ativo" : "Concluído"}
                    </span>
                    <span className="project-index-card__open" aria-hidden="true">
                      Abrir projeto <b>↗</b>
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>
        ) : (
          <EmptyState
            title="Nenhum projeto ainda"
            description="Abra um cliente para criar o primeiro projeto do workspace."
            action={
              <Link className="ui-button ui-button--primary" href="/app/clients">
                Ver clientes
              </Link>
            }
          />
        )}
      </div>
    </CoreShell>
  );
}
