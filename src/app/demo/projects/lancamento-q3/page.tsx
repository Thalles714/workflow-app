import { demoTasks } from "@/components/demo/demo-data";
import { DemoLink } from "@/components/demo/demo-link";
import { DemoShell } from "@/components/demo/demo-shell";

export default function DemoProjectPage() {
  return (
    <DemoShell title="Projeto">
      <section className="tour-project-head">
        <div>
          <DemoLink className="tour-back" href="/demo">
            ← Central de atenção
          </DemoLink>
          <span className="eyebrow">Órbita Tecnologia · projeto ativo</span>
          <h1>Lançamento Q3</h1>
          <p>
            Uma fonte de dados, três leituras úteis. O time vê prioridade, bloqueios e o que falta
            para entregar.
          </p>
        </div>
        <div className="tour-progress">
          <span>Progresso do projeto</span>
          <strong>58%</strong>
          <i>
            <b />
          </i>
          <p>11 de 19 tarefas concluídas</p>
        </div>
      </section>
      <nav aria-label="Visualizações do projeto" className="tour-tabs">
        <span aria-current="page">Visão geral</span>
        <span>Kanban</span>
        <span>Lista</span>
      </nav>
      <section className="tour-project-grid">
        <div className="tour-deliverable">
          <div className="tour-section-head">
            <div>
              <span className="eyebrow">Entrega em foco</span>
              <h2>Landing page</h2>
            </div>
            <DemoLink href="/demo/projects/lancamento-q3/deliverables/landing-page">
              Ver entrega →
            </DemoLink>
          </div>
          <p>Publicação prevista para 11 de agosto. Uma dependência impede o avanço.</p>
          <div className="tour-deliverable-facts">
            <span>
              <b>04</b> tarefas abertas
            </span>
            <span>
              <b>01</b> bloqueio
            </span>
            <span>
              <b>03</b> dias restantes
            </span>
          </div>
        </div>
        <aside className="tour-decision-card">
          <span className="eyebrow">Decisão sugerida</span>
          <h2>Destravar formulário</h2>
          <p>Validar a linguagem jurídica libera a publicação e reduz dois riscos da semana.</p>
          <DemoLink href="/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario">
            Inspecionar tarefa →
          </DemoLink>
        </aside>
      </section>
      <section className="tour-task-board">
        <div className="tour-section-head">
          <div>
            <span className="eyebrow">Tarefas · mesma fonte</span>
            <h2>O trabalho por trás do sinal</h2>
          </div>
          <p>Use esta lista como uma leitura densa da mesma operação.</p>
        </div>
        {demoTasks.map((task) => (
          <DemoLink className="tour-task" href={task.href} key={task.title}>
            <span
              className={`tour-task-priority tour-task-priority--${task.priority.toLowerCase()}`}
            />
            <div>
              <h3>{task.title}</h3>
              <p>{task.detail}</p>
            </div>
            <span>{task.priority}</span>
            <strong className={task.status === "Bloqueada" ? "is-blocked" : ""}>
              {task.status}
            </strong>
            <b aria-hidden="true">→</b>
          </DemoLink>
        ))}
      </section>
      <section className="tour-project-cta">
        <div>
          <span className="eyebrow">Continue a visita</span>
          <h2>Agora veja a entrega em detalhe.</h2>
        </div>
        <DemoLink
          className="ui-button ui-button--primary"
          href="/demo/projects/lancamento-q3/deliverables/landing-page"
        >
          Abrir Landing page →
        </DemoLink>
      </section>
    </DemoShell>
  );
}
