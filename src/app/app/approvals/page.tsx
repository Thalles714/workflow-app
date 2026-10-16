/* eslint-disable react-hooks/error-boundaries -- awaited tenant lookup is intentionally mapped to a safe not-found response. */
import { notFound } from "next/navigation";
import Link from "next/link";
import { EntityForm } from "@/components/core/entity-form";
import { CoreShell, PageHeading } from "@/components/core/core-shell";
import { Badge, Card, EmptyState } from "@/components/ui";
import { createAuthorizationContext } from "@/modules/authorization/server";
import { DomainError } from "@/modules/authorization/errors";
import { decideApprovalAction, resetApprovalAction } from "@/modules/core/actions";
import { createServerApprovalService } from "@/modules/approvals/server";

export default async function ApprovalsPage() {
  const context = await createAuthorizationContext();
  try {
    const approvals = await (await createServerApprovalService()).list(context, { limit: 50 });
    return (
      <CoreShell>
        <div className="core-page">
          <PageHeading
            eyebrow="Decisões"
            title="Aprovações"
            description="Revisões internas, auditáveis e sem portal externo."
          />
          {approvals.length ? (
            approvals.map((approval) => (
              <Card key={approval.id}>
                <h2>{approval.deliverableId}</h2>
                <Badge
                  tone={
                    approval.status === "APPROVED"
                      ? "success"
                      : approval.status === "PENDING"
                        ? "warning"
                        : "critical"
                  }
                >
                  {approval.status.replaceAll("_", " ")}
                </Badge>
                <p>{approval.decisionNote ?? "Sem nota."}</p>
                {context.role === "ADMIN" && approval.status === "PENDING" && (
                  <EntityForm
                    action={decideApprovalAction}
                    confirmMessage="Confirmar esta decisão de aprovação?"
                    fields={[
                      { defaultValue: approval.id, label: "", name: "id", type: "hidden" },
                      {
                        label: "Decisão",
                        name: "status",
                        type: "select",
                        options: [
                          { label: "Aprovar", value: "APPROVED" },
                          { label: "Solicitar alterações", value: "CHANGES_REQUESTED" },
                        ],
                      },
                      { label: "Nota da decisão", name: "note", required: true, type: "textarea" },
                    ]}
                    submitLabel="Registrar decisão"
                  />
                )}
                {context.role === "ADMIN" && approval.status !== "PENDING" && (
                  <EntityForm
                    action={resetApprovalAction}
                    confirmMessage="Reabrir esta aprovação?"
                    fields={[
                      { defaultValue: approval.id, label: "", name: "id", type: "hidden" },
                      {
                        label: "Motivo da reabertura",
                        name: "note",
                        required: true,
                        type: "textarea",
                      },
                    ]}
                    submitLabel="Reabrir aprovação"
                  />
                )}
              </Card>
            ))
          ) : (
            <EmptyState
              title="Sem aprovações"
              description="Solicite uma revisão a partir de uma entrega."
              action={
                <Link className="ui-button ui-button--secondary" href="/app/projects">
                  Encontrar uma entrega
                </Link>
              }
            />
          )}
        </div>
      </CoreShell>
    );
  } catch (error) {
    if (error instanceof DomainError && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}
