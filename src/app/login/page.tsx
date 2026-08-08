import Link from "next/link";

import { requestLogin } from "@/modules/auth/actions";

type LoginPageProps = { searchParams: Promise<{ status?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { status } = await searchParams;
  return (
    <main className="mx-auto grid min-h-svh w-full max-w-lg place-items-center px-5 py-12">
      <section className="w-full rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-[0_30px_90px_rgba(36,44,57,0.14)] backdrop-blur-xl sm:p-10">
        <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#005bd9] uppercase">
          Agência Aurora · acesso local
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Entrar no Workflow</h1>
        <p className="mt-3 text-sm leading-6 text-[#626873]">
          Receba um link de acesso no Mailpit local. Novos cadastros estão desativados.
        </p>
        {status === "sent" && (
          <p role="status" className="mt-5 rounded-xl bg-[#dff6ee] p-3 text-sm text-[#145a48]">
            Link enviado. Abra a caixa local do Mailpit.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="mt-5 rounded-xl bg-[#fff0ed] p-3 text-sm text-[#8a2f24]">
            Não foi possível iniciar o acesso. Confira o e-mail e o ambiente local.
          </p>
        )}
        <form action={requestLogin} className="mt-7 grid gap-3">
          <label htmlFor="email" className="text-sm font-semibold">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-12 rounded-xl border border-[#cbd2dc] bg-white px-4"
          />
          <button
            className="mt-2 min-h-12 rounded-xl bg-[#101114] px-5 text-sm font-semibold text-white"
            type="submit"
          >
            Enviar link de acesso
          </button>
        </form>
        <Link className="mt-6 inline-block text-sm font-semibold text-[#005bd9]" href="/">
          Voltar à página local
        </Link>
      </section>
    </main>
  );
}
