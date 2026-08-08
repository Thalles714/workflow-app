# ADR-001 — Aplicação única Next.js com Supabase

> Status: aceito para o MVP de portfólio
>
> Data: 07 de agosto de 2026

O Workflow será uma única aplicação Next.js App Router com React e TypeScript estrito, publicada inicialmente na Vercel Hobby, usando Supabase Free para PostgreSQL e autenticação. Migrações SQL versionadas e o cliente Supabase serão a escolha principal, sem monorepo, Turborepo ou Prisma no MVP. Essa forma reduz configuração, deploys, pooling e camadas de autorização, preserva RLS nativa e mantém o projeto compreensível para um recrutador.

## Opções consideradas

- **Escolhida:** Next.js + Supabase Auth/Postgres/RLS + SQL migrations + Vercel.
- Next.js + Prisma + Supabase/Neon: boa tipagem, mas acrescenta schema/migration/pooling e pode obscurecer RLS sem benefício suficiente para este único app.
- Monorepo/Turborepo: rejeitado porque não há segundo app ou pacote com ciclo independente.
- React/Vite + API separada: rejeitado por duplicar deploy, contratos e autenticação.
- Cloudflare Pages/Workers: contingência gratuita se a Vercel Hobby deixar de atender; não é principal devido à adaptação de runtime do Next.js.
- Neon: contingência de PostgreSQL; exige redecidir autenticação e políticas equivalentes.

## Consequências

- UI, backend, validação e serviços de domínio vivem no mesmo repositório e deploy, separados por módulos e fronteiras `server-only`.
- Server Components são padrão; Client Components existem somente onde há interação necessária.
- Server Actions e Route Handlers chamam serviços de domínio; componentes nunca consultam banco diretamente.
- A aplicação não depende de Redis, filas, WebSockets, realtime, storage, analytics externo ou observabilidade SaaS.
- Tailwind CSS implementa composição; tokens e primitives próprias derivam do design system oficial. Nenhum UI kit substitui a identidade Workflow.
- Zod valida entradas no servidor; React Hook Form só entra em formulários que justifiquem seu custo.
- Vitest, Testing Library e Playwright formam a suíte proporcional.
- `pnpm` e lockfile serão versionados; nenhuma dependência entra sem necessidade, custo e impacto documentados.

## Custo e operação

- Stack principal: GitHub público/Actions + Vercel Hobby + Supabase Free, orçamento esperado de US$0/R$0.
- Vercel Hobby só é válida enquanto o projeto for pessoal e não comercial.
- Supabase Free pode pausar após sete dias de inatividade e não oferece backups automáticos; migrations, seed idempotente e runbook mitigam o risco.
- Os limites oficiais devem ser revalidados antes do deploy e sem cadastrar cartão ou ativar trial pago.
