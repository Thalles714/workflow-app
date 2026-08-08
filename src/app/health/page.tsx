import Link from "next/link";

import { getHealthStatus } from "@/lib/health";

export const metadata = {
  title: "Saúde local",
};

export default function HealthPage() {
  const health = getHealthStatus();

  return (
    <main className="mx-auto grid min-h-svh w-full max-w-3xl place-items-center px-5 py-12">
      <section className="w-full rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-[0_30px_90px_rgba(36,44,57,0.14)] backdrop-blur-xl sm:p-12">
        <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#0f704b] uppercase">
          ● Serviço disponível
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Saúde local</h1>
        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#e5f6ef] p-4">
            <dt className="text-xs font-semibold text-[#626873] uppercase">Estado</dt>
            <dd className="mt-2 text-lg font-semibold text-[#0f704b]">{health.status}</dd>
          </div>
          <div className="rounded-2xl bg-[#e8f1ff] p-4">
            <dt className="text-xs font-semibold text-[#626873] uppercase">Aplicação</dt>
            <dd className="mt-2 text-lg font-semibold text-[#005bd9]">{health.service}</dd>
          </div>
        </dl>
        <Link
          className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4"
          href="/"
        >
          Voltar à fundação
        </Link>
      </section>
    </main>
  );
}
