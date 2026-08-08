# Contribuindo com o Workflow

## Preparação

1. Use Node.js 24 ou superior e pnpm 11.16.0.
2. Execute `pnpm install --frozen-lockfile`.
3. Copie `.env.example` para `.env.local`; nunca versione segredos.
4. Inicie com `pnpm dev` e confirme `/health`.

## Organização

- `src/app`: rotas, layouts e composição por Server Components.
- `src/features`: módulos funcionais autocontidos.
- `src/lib`: utilidades puras e compartilhadas.
- `src/server`: código server-only, autorização, domínio e persistência.
- `tests/e2e`: fluxos de navegador.
- `prototypes` e `assets`: fontes aprovadas; não mover, apagar ou reescrever sem novo gate.

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
