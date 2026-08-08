"use client";

export default function ProjectsError({ reset }: { reset: () => void }) {
  return (
    <main className="core-page">
      <section className="operation-permission" role="alert">
        <span className="eyebrow">Projetos indisponíveis</span>
        <h1>Não foi possível carregar os projetos</h1>
        <p>Seus dados foram preservados. Tente carregar a página novamente.</p>
        <button className="ui-button ui-button--primary" onClick={reset} type="button">
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
