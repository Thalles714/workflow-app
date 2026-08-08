import Link from "next/link";

import { ComponentShowcase } from "@/components/demo/component-showcase";
import { AppShell } from "@/components/layouts/app-shell";
import { Badge, Button, Card } from "@/components/ui";
import { logout } from "@/modules/auth/actions";
import { requirePageUser } from "@/modules/auth/guard";

export default async function ProtectedLocalPage() {
  const user = await requirePageUser();
  return (
    <AppShell
      footer={
        <form action={logout}>
          <button className="sidebar-logout" type="submit">
            Sair
          </button>
        </form>
      }
    >
      <div className="app-content">
        <header className="desktop-topbar">
          <nav aria-label="Breadcrumb">
            <span aria-current="page">Painel da Operação</span>
          </nav>
          <div>
            <Badge tone="success">Sessão verificada no servidor</Badge>
          </div>
        </header>
        <section aria-labelledby="operation-hero" className="operation-hero">
          <span className="hero-kicker">
            <i />
            Central de Atenção · agora
          </span>
          <h1 id="operation-hero">
            Bom dia, Thalles.<span>3 situações pedem sua decisão agora.</span>
          </h1>
          <p>
            A operação está estável, mas a Landing page da Órbita bloqueia uma entrega importante.
            Comece pelo item crítico; o restante pode esperar.
          </p>
          <div className="hero-actions">
            <Button variant="primary">Resolver item crítico →</Button>
            <a className="ui-button ui-button--secondary" href="#radar">
              Ver toda a atenção
            </a>
          </div>
          <div className="hero-summary">
            <HeroStat label="crítico · agir agora" value="01" />
            <HeroStat label="em risco · próximos 3 dias" value="02" />
            <HeroStat label="entregas da semana no ritmo" value="84%" />
          </div>
        </section>
        <div className="metric-grid">
          <Metric label="Entregas da semana" value="7">
            5 no ritmo, 2 exigem acompanhamento.
          </Metric>
          <Metric label="Tarefas atrasadas" value="4">
            Uma delas bloqueia uma entrega crítica.
          </Metric>
          <Metric label="Aprovações" value="3">
            Órbita aguarda decisão há 48 horas.
          </Metric>
        </div>
        <Card id="radar">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Atualizado agora</span>
              <h2>Radar de atenção</h2>
              <p>Exceções ordenadas por impacto, com a regra que gerou cada sinal.</p>
            </div>
          </div>
          <div className="attention-list">
            <Signal
              description="Órbita · Lançamento Q3 · Revisar formulário está bloqueada há 2 dias."
              label="Landing page bloqueada por tarefa atrasada"
              meta="Agir agora"
              tone="critical"
            />
            <Signal
              description="2 de 7 tarefas continuam pendentes na entrega."
              label="Peças do lançamento vencem em 3 dias"
              meta="11 ago"
              tone="risk"
            />
            <Signal
              description="Relatório de performance · Cliente Vértice."
              label="Aprovação aguardando há 48 horas"
              meta="48h"
              tone="warning"
            />
          </div>
        </Card>
        <p className="signed-user">Usuário local: {user.email ?? user.id}</p>
        <ComponentShowcase />
        <Link className="back-local" href="/">
          Voltar à página local
        </Link>
      </div>
    </AppShell>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
function Metric({ children, label, value }: { children: string; label: string; value: string }) {
  return (
    <Card className="metric-card">
      <span className="eyebrow">{label}</span>
      <b>{value}</b>
      <p>{children}</p>
    </Card>
  );
}
function Signal({
  description,
  label,
  meta,
  tone,
}: {
  description: string;
  label: string;
  meta: string;
  tone: "critical" | "risk" | "warning";
}) {
  return (
    <article className={`attention-signal attention-signal--${tone}`}>
      <div>
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <strong>{meta}</strong>
    </article>
  );
}
