import Link from "next/link";

export default function AppNotFound() {
  return (
    <main className="core-page">
      <section className="operation-permission">
        <span className="eyebrow">Contexto protegido</span>
        <h1>404</h1>
        <p>Este item não existe neste workspace ou você não tem acesso a ele.</p>
        <Link className="ui-button ui-button--primary" href="/app">
          Voltar à operação
        </Link>
      </section>
    </main>
  );
}
