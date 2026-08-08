import Link from "next/link";

const checks = ["App Router", "TypeScript strict", "Tailwind CSS", "Testes configurados"];

export default function LocalFoundationPage() {
  return (
    <main className="mx-auto grid min-h-svh w-full max-w-6xl place-items-center px-5 py-12">
      <section className="relative w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-[0_30px_90px_rgba(36,44,57,0.14)] backdrop-blur-xl sm:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-40 h-96 w-96 rounded-full bg-[conic-gradient(from_210deg,var(--cobalt),var(--iris),var(--aqua),transparent)] opacity-35 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl">
          <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#005bd9] uppercase">
            Fundação local · PROMPT 03
          </p>
          <h1 className="mt-5 text-5xl leading-[0.96] font-semibold tracking-[-0.06em] sm:text-7xl">
            Workflow está pronto para evoluir.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#626873]">
            A base reproduzível da aplicação está ativa. Nenhuma regra de domínio ou integração
            cloud foi iniciada nesta fase.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Capacidades configuradas">
            {checks.map((check) => (
              <li
                key={check}
                className="rounded-2xl border border-white/80 bg-[#f7f8fa]/75 px-4 py-3 text-sm font-semibold shadow-[inset_0_1px_0_white]"
              >
                <span className="mr-2 text-[#0a6cff]" aria-hidden="true">
                  ●
                </span>
                {check}
              </li>
            ))}
          </ul>
          <Link
            href="/health"
            className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-[#101114] px-5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            Verificar saúde local
          </Link>
        </div>
      </section>
    </main>
  );
}
