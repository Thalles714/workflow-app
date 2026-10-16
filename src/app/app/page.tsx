import Link from "next/link";
import { CoreShell } from "@/components/core/core-shell";
import { Alert, Card, EmptyState } from "@/components/ui";
import { createServerAttentionService } from "@/modules/attention/server";
import type { AttentionAlert } from "@/modules/attention/evaluate";
import { requirePageUser } from "@/modules/auth/guard";
import { createAuthorizationContext } from "@/modules/authorization/server";

export default async function OperationPage() {
  await requirePageUser();
  const context = await createAuthorizationContext();
  return (
    <CoreShell>
      <div className="app-content">
        <div className="desktop-topbar">
          <span>Painel da Operação</span>
          <span>Agência Aurora · agora</span>
        </div>
        {context.role !== "ADMIN" ? (
          <section className="operation-permission">
            <Alert title="Visão gerencial restrita" tone="warning">
              Use Meu Trabalho para acompanhar suas prioridades. O Painel da Operação exige ADMIN.
            </Alert>
            <Link className="ui-button ui-button--primary" href="/app/my-work">
              Abrir Meu Trabalho
            </Link>
          </section>
        ) : (
          <ManagerPanel context={context} />
        )}
      </div>
    </CoreShell>
  );
}

async function ManagerPanel({
  context,
}: {
  context: Awaited<ReturnType<typeof createAuthorizationContext>>;
}) {
  const result = await (await createServerAttentionService()).getOperationAttention(context);
  const first = result.alerts[0];
  return (
    <>
      <section aria-labelledby="operation-hero" className="operation-hero">
        <span className="hero-kicker">
          <i />
          Central de Atenção · regras determinísticas
        </span>
        <h1 id="operation-hero">
          Onde agir agora.
          <span>
            {result.alerts.length
              ? `${result.alerts.length} situações explicadas e ordenadas.`
              : "A operação está saudável."}
          </span>
        </h1>
        <p>
          {first
            ? first.explanation
            : "Nenhuma das seis regras encontrou uma exceção que exija decisão neste momento."}
        </p>
        {first && (
          <div className="hero-actions">
            <Link className="ui-button ui-button--primary" href={first.href as never}>
              Resolver item prioritário →
            </Link>
            <a className="ui-button ui-button--secondary" href="#attention">
              Ver toda a atenção
            </a>
          </div>
        )}
      </section>
      <div className="metric-grid">
        <Metric
          label="Entregas concluídas na semana"
          value={result.metrics.deliveriesCompletedThisWeek}
        />
        <Metric label="Tarefas atrasadas" value={result.metrics.overdueTasks} />
        <Metric label="Aprovações pendentes" value={result.metrics.pendingApprovals} />
        <Metric label="Projetos em risco" value={result.metrics.projectsAtRisk} />
      </div>
      <Card id="attention">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Prioridade e deduplicação</span>
            <h2>Central de Atenção</h2>
            <p>Cada cartão mostra a regra, a evidência e o caminho para resolver.</p>
          </div>
        </div>
        {result.alerts.length ? (
          <div className="attention-list">
            {result.alerts.map((alert) => (
              <AttentionCard alert={alert} key={`${alert.targetType}:${alert.targetId}`} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma atenção necessária"
            description="A operação não viola nenhuma regra determinística neste momento."
          />
        )}
      </Card>
    </>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card className="metric-card">
      <span className="eyebrow">{label}</span>
      <b>{value}</b>
      <p>Calculado no timezone do Workspace.</p>
    </Card>
  );
}
function AttentionCard({ alert }: { alert: AttentionAlert }) {
  return (
    <Link
      className={`attention-signal attention-signal--${tone(alert.severity)}`}
      href={alert.href as never}
    >
      <div>
        <span className="eyebrow">{label(alert.severity)}</span>
        <h3>{alert.title}</h3>
        <p>{alert.explanation}</p>
        <ul className="attention-reasons">
          {alert.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
      <strong>Abrir →</strong>
    </Link>
  );
}
function tone(value: AttentionAlert["severity"]) {
  return value === "CRITICAL" ? "critical" : value === "RISK" ? "risk" : "warning";
}
function label(value: AttentionAlert["severity"]) {
  return (
    { CRITICAL: "Crítico", RISK: "Risco", ATTENTION: "Atenção", INFO: "Informação" } as const
  )[value];
}
