import { logout } from "@/modules/auth/actions";
import { requirePageUser } from "@/modules/auth/guard";

export default async function ProtectedLocalPage() {
  const user = await requirePageUser();
  return (
    <main className="mx-auto grid min-h-svh w-full max-w-3xl place-items-center px-5 py-12">
      <section className="w-full rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-[0_30px_90px_rgba(36,44,57,0.14)]">
        <p className="text-sm font-semibold text-[#005bd9]">Sessão verificada no servidor</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Área autenticada</h1>
        <p className="mt-4 text-[#626873]">Usuário local: {user.email ?? user.id}</p>
        <form action={logout} className="mt-7">
          <button
            className="min-h-11 rounded-xl bg-[#101114] px-5 text-sm font-semibold text-white"
            type="submit"
          >
            Sair
          </button>
        </form>
      </section>
    </main>
  );
}
