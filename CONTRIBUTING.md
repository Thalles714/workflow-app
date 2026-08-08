# Contribuindo com o Workflow

## Preparação

1. Use Node.js 24 ou superior e pnpm 11.16.0.
2. Execute `pnpm install --frozen-lockfile`.
3. Copie `.env.example` para `.env.local`; nunca versione segredos.
4. Inicie com `pnpm dev` e confirme `/health`.

## Organização

- `src/app`: rotas, layouts e composição por Server Components.
- `src/components`: primitives, layouts e UI específica por contexto.
- `src/modules`: módulos de domínio, autorização, validação e persistência.
- `src/features` e `src/lib`: código compartilhado pequeno e sem regras de domínio duplicadas.
- `src/server`: infraestrutura server-only e testes de banco.
- `supabase`: migrations, políticas RLS, configuração e seed.
- `tests/e2e`: fluxos de navegador.
- `docs`: produto, arquitetura, desenvolvimento, qualidade e release; consulte o índice em `docs/README.md`.
- `prototypes` e `assets`: fontes visuais aprovadas; não mover ou reescrever sem novo gate.

## Qualidade obrigatória

Antes de propor uma mudança, execute:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
git diff --check
```

Dependências novas precisam registrar necessidade, custo, impacto no cliente e alternativa mais
simples considerada. Não faça push, deploy, rebase ou reescrita de histórico sem autorização.
