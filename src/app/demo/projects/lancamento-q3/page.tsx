import Link from "next/link";
const tasks = [
  ["Revisar formulário", "Bloqueada", "Crítica", "Aguardando validação jurídica"],
  ["Adaptar peças sociais", "Em revisão", "Alta", "Conteúdo enviado para aprovação"],
  ["Publicar landing page", "A fazer", "Alta", "Depende da revisão do formulário"],
  ["Configurar analytics", "Em andamento", "Média", "Eventos principais mapeados"],
] as const;
export default function DemoProjectPage() {
  return (
    <main className="demo-page">
      <a className="skip-link" href="#project-content">
        Pular para o conteúdo
      </a>
      <header className="demo-topbar">
        <Link className="workflow-brand" href={"/demo" as never}>
          <span className="brand-mark">W</span>
          <strong>Workflow</strong>
        </Link>
        <span className="demo-readonly">Demonstração somente leitura</span>
        <Link className="demo-login" href={"/demo" as never}>
          Central de atenção
        </Link>
      </header>
      <section className="demo-hero demo-hero--compact" id="project-content">
        <span className="eyebrow">Órbita Tecnologia · projeto ativo</span>
        <h1>Lançamento Q3</h1>
        <p>
          Uma fonte de dados, duas leituras: o time enxerga prioridade, bloqueios e o que falta para
          entregar.
        </p>
      </section>
      <section className="demo-task-list">
        {tasks.map(([title, status, priority, detail]) => (
          <article key={title}>
            <div>
              <span className="eyebrow">{priority} prioridade</span>
              <h2>{title}</h2>
              <p>{detail}</p>
            </div>
            <span className={`demo-status ${status === "Bloqueada" ? "demo-status--blocked" : ""}`}>
              {status}
            </span>
          </article>
        ))}
      </section>
      <p className="demo-disclaimer">
        Visualização pública sem escrita. <Link href="/login">Acesso interno</Link> permanece
        separado.
      </p>
    </main>
  );
}
