import { demoTasks } from "@/components/demo/demo-data";
import { DemoLink } from "@/components/demo/demo-link";
import { DemoShell } from "@/components/demo/demo-shell";

type Props = { params: Promise<{ path: string[] }> };

export default async function DemoContextPage({ params }: Props) {
  const { path } = await params;
  const section = path.at(-1) ?? "central";
  const isApprovals = section === "approvals";
  const isTask = section === "revisar-formulario";
  const isDelivery = path.includes("deliverables");
  const heading = isApprovals
    ? "Aprovações"
    : isTask
      ? "Revisar formulário"
      : isDelivery
        ? "Landing page"
        : section === "clients"
          ? "Clientes"
          : section === "my-work"
            ? "Meu trabalho"
            : "Casa Nimbo";
  const description = isApprovals
    ? "Decisões aguardam uma resposta clara — e preservam o contexto de quem pediu."
    : isTask
      ? "Uma tarefa bloqueada não esconde o problema: ela mostra o motivo, a dependência e a próxima decisão."
      : isDelivery
        ? "Uma entrega mantém prazo, responsáveis e trabalho conectado no mesmo lugar."
        : section === "my-work"
          ? "Uma fila pessoal, ordenada pelo que pede ação agora."
          : "Relacionamentos, projetos e próximos passos da operação.";
  return (
    <DemoShell title={heading}>
      <section className="tour-context-head">
        <DemoLink className="tour-back" href="/demo">
          ← Voltar à Central
        </DemoLink>
        <span className="eyebrow">Contexto da demonstração</span>
        <h1>{heading}</h1>
        <p>{description}</p>
      </section>
      <section className="tour-context-grid">
        <article>
          <span className="eyebrow">Leitura operacional</span>
          <h2>
            {isApprovals
              ? "Uma aprovação pendente"
              : isTask
                ? "Bloqueio documentado"
                : isDelivery
                  ? "Entrega em risco controlado"
                  : "Visão conectada"}
          </h2>
          <p>
            Esta é uma camada navegável da mesma narrativa fictícia. Ela mostra como o Workflow
            mantém hierarquia, status e próximos passos legíveis sem criar uma conta compartilhada.
          </p>
          <dl>
            <div>
              <dt>Cliente</dt>
              <dd>Órbita Tecnologia</dd>
            </div>
            <div>
              <dt>Projeto</dt>
              <dd>Lançamento Q3</dd>
            </div>
            <div>
              <dt>Próximo passo</dt>
              <dd>{isApprovals ? "Decidir aprovação" : "Destravar formulário"}</dd>
            </div>
          </dl>
        </article>
        <aside>
          <span className="eyebrow">Ação guiada</span>
          <h2>{isApprovals ? "Aprovar kit de lançamento" : "Ver tarefa que originou o sinal"}</h2>
          <p>
            Na versão autenticada, esta área respeita papel, workspace e auditoria. Na demo, ela
            explica o comportamento sem gravar nada.
          </p>
          <DemoLink
            className="ui-button ui-button--primary"
            href={
              isApprovals
                ? "/demo/projects/lancamento-q3"
                : "/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario"
            }
          >
            {isApprovals ? "Voltar ao projeto →" : "Abrir tarefa →"}
          </DemoLink>
        </aside>
      </section>
      <section className="tour-context-list">
        <div className="tour-section-head">
          <div>
            <span className="eyebrow">Trabalho relacionado</span>
            <h2>Contexto preservado</h2>
          </div>
          <p>As telas da demo conduzem a partir da mesma estrutura.</p>
        </div>
        {demoTasks.slice(0, 3).map((task) => (
          <DemoLink className="tour-task" href={task.href} key={task.title}>
            <span
              className={`tour-task-priority tour-task-priority--${task.priority.toLowerCase()}`}
            />
            <div>
              <h3>{task.title}</h3>
              <p>{task.detail}</p>
            </div>
            <strong className={task.status === "Bloqueada" ? "is-blocked" : ""}>
              {task.status}
            </strong>
            <b aria-hidden="true">→</b>
          </DemoLink>
        ))}
      </section>
    </DemoShell>
  );
}
