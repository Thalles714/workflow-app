import { demoProjects } from "@/components/demo/demo-data";
import { AttentionDeck } from "@/components/demo/demo-interactions";
import { DemoLink } from "@/components/demo/demo-link";
import { DemoShell } from "@/components/demo/demo-shell";

export default function PublicDemoPage() {
  return (
    <DemoShell title="Central de atenção">
      <section className="tour-hero">
        <div>
          <span className="eyebrow">Agência Aurora · operação em curso</span>
          <h1>
            Veja antes.
            <br />
            <em>Resolva</em> antes.
          </h1>
          <p>
            Uma visita guiada por decisões, entregas e pessoas — feita para mostrar como uma agência
            encontra o próximo movimento.
          </p>
        </div>
        <div className="tour-hero-note">
          <span>Agora</span>
          <strong>6 sinais pedem contexto.</strong>
          <p>Não é um gráfico. É uma fila explicável de trabalho.</p>
          <i aria-hidden="true" />
        </div>
      </section>
      <section aria-label="Resumo da operação" className="tour-metrics">
        <div>
          <span>Projetos ativos</span>
          <strong>05</strong>
          <small>+1 desde segunda</small>
        </div>
        <div>
          <span>Entregas da semana</span>
          <strong>08</strong>
          <small>3 concluídas</small>
        </div>
        <div>
          <span>Aprovações abertas</span>
          <strong>02</strong>
          <small>1 há mais de 48h</small>
        </div>
        <div>
          <span>Ritmo do time</span>
          <strong>72%</strong>
          <small>em linha com o plano</small>
        </div>
      </section>
      <section className="tour-split">
        <div className="tour-section">
          <div className="tour-section-head">
            <div>
              <span className="eyebrow">01 · Central de atenção</span>
              <h2>O que merece decisão</h2>
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
