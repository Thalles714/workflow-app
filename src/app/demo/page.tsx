import Link from "next/link";

const alerts = [
  [
    "Crítico",
    "Landing page bloqueada por tarefa atrasada",
    "A entrega não pode avançar enquanto Revisar formulário estiver bloqueada.",
    "critical",
  ],
  [
    "Risco",
    "Peças do lançamento vence com pendências",
    "Três tarefas abertas e prazo dentro da janela de três dias.",
    "risk",
  ],
  [
    "Atenção",
    "Kit de lançamento aguarda aprovação",
    "A solicitação está pendente há mais de dois dias.",
    "warning",
  ],
] as const;

export default function PublicDemoPage() {
  return (
    <main className="demo-page">
      <a className="skip-link" href="#demo-content">
        Pular para o conteúdo
      </a>
      <header className="demo-topbar">
        <Link className="workflow-brand" href={"/demo" as never}>
          <span className="brand-mark">W</span>
          <strong>Workflow</strong>
        </Link>
        <span className="demo-readonly">Demonstração somente leitura</span>
        <Link className="demo-login" href="/login">
          Acesso interno
        </Link>
      </header>
      <section className="demo-hero" id="demo-content">
        <span className="eyebrow">Agência Aurora · dados fictícios</span>
        <h1>Onde agir agora.</h1>
        <p>Uma prévia navegável da operação: exceções claras, contexto e próximas decisões.</p>
        <div className="demo-stats">
          <span>
            <b>6</b> situações explicadas
          </span>
          <span>
            <b>5</b> projetos ativos
          </span>
          <span>
            <b>2</b> aprovações
          </span>
        </div>
      </section>
      <section className="demo-layout">
        <div className="demo-main">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Central de atenção</span>
              <h2>Prioridades da operação</h2>
              <p>Cada sinal mostra o porquê e o próximo contexto.</p>
            </div>
          </div>
          <div className="attention-list">
            {alerts.map(([level, title, explanation, tone]) => (
              <Link
                className={`attention-signal attention-signal--${tone}`}
                href={"/demo/projects/lancamento-q3" as never}
                key={title}
              >
                <div>
                  <span className="eyebrow">{level}</span>
                  <h3>{title}</h3>
                  <p>{explanation}</p>
                </div>
                <strong>Abrir →</strong>
              </Link>
            ))}
          </div>
        </div>
        <aside className="demo-project-card">
          <span className="eyebrow">Projeto em foco</span>
          <h2>Lançamento Q3</h2>
          <p>Órbita Tecnologia · 5 tarefas em acompanhamento.</p>
          <dl>
            <div>
              <dt>Em andamento</dt>
              <dd>2 tarefas</dd>
            </div>
            <div>
              <dt>Prazo</dt>
              <dd>Em 3 dias</dd>
            </div>
          </dl>
          <Link
            className="ui-button ui-button--primary"
            href={"/demo/projects/lancamento-q3" as never}
          >
            Ver projeto →
          </Link>
        </aside>
      </section>
      <p className="demo-disclaimer">
        Dados inteiramente fictícios. Esta área não autentica, não grava e não acessa dados do
        Supabase.
      </p>
    </main>
  );
}
