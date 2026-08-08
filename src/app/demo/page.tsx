import { demoProjects } from "@/components/demo/demo-data";
import { AttentionDeck } from "@/components/demo/demo-interactions";
import { DemoIcon } from "@/components/demo/demo-icon";
import { DemoLink } from "@/components/demo/demo-link";
import { DemoShell } from "@/components/demo/demo-shell";

export default function PublicDemoPage() {
  return (
    <DemoShell title="Central de atenção">
      <section aria-labelledby="tour-hero-title" className="tour-hero tour-decision-hero">
        <div className="tour-hero-copy">
          <span className="eyebrow">Agência Aurora · operação em curso</span>
          <h1 id="tour-hero-title">
            Sua operação pede
            <br />
            três decisões agora.
          </h1>
          <p className="tour-hero-lead">
            O Workflow identifica bloqueios, prazos e aprovações antes que eles comprometam uma
            entrega.
          </p>
          <div className="tour-hero-actions">
            <DemoLink
              className="tour-button tour-button--primary"
              href="/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario"
            >
              <DemoIcon name="warning" />
              Começar pelo crítico
            </DemoLink>
            <a className="tour-button" href="#attention">
              <DemoIcon name="filter" />
              Ver toda a atenção
            </a>
          </div>
          <div aria-label="Características desta demonstração" className="tour-proof-line">
            <span>6 sinais explicáveis</span>
            <span>Dados fictícios</span>
            <span>Somente leitura</span>
          </div>
        </div>
        <div className="tour-decision-wrap">
          <span className="tour-decision-priority">Prioridade 01</span>
          <article className="tour-decision-card">
            <div className="tour-decision-head">
              <span className="tour-critical-label">
                <i aria-hidden="true" />
                Crítico · agir agora
              </span>
              <time dateTime="2026-08-07">venceu ontem</time>
            </div>
            <h2>Landing page bloqueada</h2>
            <p>
              A entrega não avança enquanto a validação jurídica do formulário estiver pendente.
            </p>
            <div aria-label="Cadeia do bloqueio" className="tour-dependency">
              <div>
                <span className="tour-dependency-icon">
                  <DemoIcon name="project" />
                </span>
                <small>Projeto</small>
                <strong>Lançamento Q3</strong>
              </div>
              <div>
                <span className="tour-dependency-icon">
                  <DemoIcon name="deliverable" />
                </span>
                <small>Entrega</small>
                <strong>Landing page</strong>
              </div>
              <div>
                <span className="tour-dependency-icon is-critical">
                  <DemoIcon name="warning" />
                </span>
                <small>Tarefa</small>
                <strong>Revisar formulário</strong>
              </div>
            </div>
            <div className="tour-decision-action">
              <p>
                <strong>Próxima decisão</strong>
                Validar texto jurídico com o cliente.
              </p>
              <DemoLink
                className="tour-button tour-button--primary"
                href="/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario"
              >
                Abrir tarefa
                <DemoIcon name="chevron" />
              </DemoLink>
            </div>
          </article>
        </div>
      </section>
      <section aria-label="Resumo da operação" className="tour-metrics">
        <div>
          <span>Situações críticas</span>
          <strong>01</strong>
          <small className="is-critical">1 bloqueia uma entrega</small>
        </div>
        <div>
          <span>Entregas da semana</span>
          <strong>08</strong>
          <small>3 concluídas hoje</small>
        </div>
        <div>
          <span>Aprovações abertas</span>
          <strong>02</strong>
          <small>1 aguarda há mais de 48h</small>
        </div>
        <div>
          <span>Projetos no ritmo</span>
          <strong>72%</strong>
          <small>4 de 5 acompanhados</small>
        </div>
      </section>
      <section className="tour-split" id="attention">
        <div className="tour-section">
          <div className="tour-section-head">
            <div>
              <span className="eyebrow">01 · Central de atenção</span>
              <h2>Depois do crítico.</h2>
            </div>
            <p>Clique em um sinal para entender a regra e seguir o contexto.</p>
          </div>
          <AttentionDeck />
        </div>
        <aside className="tour-project-rail">
          <span className="eyebrow">Projetos em perspectiva</span>
          <div className="tour-project-list">
            {demoProjects.map((project) => (
              <DemoLink href={project.href} key={project.name}>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.client}</p>
                </div>
                <span>{project.progress}%</span>
                <i>
                  <b style={{ width: `${project.progress}%` }} />
                </i>
                <small>{project.status}</small>
              </DemoLink>
            ))}
          </div>
          <DemoLink className="tour-text-link" href="/demo/projects/lancamento-q3">
            Abrir visão do projeto <span>→</span>
          </DemoLink>
        </aside>
      </section>
      <section className="tour-next">
        <div>
          <span className="eyebrow">A próxima camada</span>
          <h2>
            Do sinal à decisão,
            <br />
            sem perder a linha.
          </h2>
        </div>
        <div>
          <p>
            Explore a sequência que uma pessoa da equipe realmente segue: projeto, entrega, tarefa e
            aprovação.
          </p>
          <div className="tour-path">
            <DemoLink href="/demo/projects/lancamento-q3">
              Projeto <b>→</b>
            </DemoLink>
            <DemoLink href="/demo/projects/lancamento-q3/deliverables/landing-page">
              Entrega <b>→</b>
            </DemoLink>
            <DemoLink href="/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario">
              Tarefa <b>→</b>
            </DemoLink>
            <DemoLink href="/demo/approvals">
              Aprovação <b>→</b>
            </DemoLink>
          </div>
        </div>
      </section>
      <footer className="tour-footer">
        <p>
          Dados inteiramente fictícios. Esta visita não autentica, não grava e não acessa o
          Supabase.
        </p>
        <div className="tour-footer-links">
          <a href="https://github.com/Thalles714/workflow-app" rel="noreferrer" target="_blank">
            Código e setup ↗
          </a>
          <a
            href="https://github.com/Thalles714/workflow-app/blob/main/docs/portfolio/case-study.md"
            rel="noreferrer"
            target="_blank"
          >
            Case study ↗
          </a>
        </div>
      </footer>
    </DemoShell>
  );
}
