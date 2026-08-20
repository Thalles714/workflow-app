import Link from "next/link";
import { CoreShell, Breadcrumbs, PageHeading } from "@/components/core/core-shell";
import { EntityForm } from "@/components/core/entity-form";
import { Card, EmptyState } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { createClientAction } from "@/modules/core/actions";
import { createServerClientService } from "@/modules/clients/server";

export default async function ClientsPage() {
  const context = await createAuthorizationContext();
  const clients = await (await createServerClientService()).list(context);
  return (
    <CoreShell>
      <div className="core-page">
        <Breadcrumbs items={[{ label: "Painel", href: "/app" }, { label: "Clientes" }]} />
        <PageHeading
          eyebrow="Carteira"
          title="Clientes"
          description="Contexto comercial enxuto para chegar ao trabalho que precisa acontecer."
        />
        {context.role === "ADMIN" && (
          <Card>
            <h2 className="core-section-title">Adicionar cliente</h2>
            <EntityForm
              action={createClientAction}
              fields={[{ label: "Nome do cliente", name: "name", required: true }]}
              submitLabel="Criar cliente"
            />
          </Card>
        )}
        <section className="entity-grid" aria-label="Clientes">
          {clients.length ? (
            clients.map((client) => (
              <Link
                className="entity-card"
                href={`/app/clients/${client.id}` as never}
                key={client.id}
              >
                <span className="eyebrow">Cliente ativo</span>
                <h2>{client.name}</h2>
                <p>Abrir projetos e entregas →</p>
              </Link>
            ))
          ) : (
            <EmptyState
              title="Nenhum cliente ainda"
              description="Crie o primeiro cliente para iniciar a hierarquia operacional."
            />
          )}
        </section>
      </div>
    </CoreShell>
  );
}
