# Workflow

Sistema operacional de entregas para pequenas agências. Esta etapa contém somente a fundação
reproduzível da aplicação; domínio, autenticação e banco serão introduzidos nas fases seguintes.

## Requisitos

- Node.js 24 ou superior
- pnpm 11.16.0 via Corepack

## Execução local

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Abra `http://localhost:3000` ou a verificação local em `http://localhost:3000/health`.

## Verificações

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
```

O smoke E2E está em `tests/e2e/health.spec.ts`. Depois de instalar o navegador do Playwright com
`pnpm exec playwright install chromium`, execute `pnpm test:e2e`.

## Fronteiras

- Server Components são o padrão.
- Interatividade cliente exige justificativa local e `"use client"` explícito.
- Componentes não acessam banco diretamente.
- `src/features` recebe módulos funcionais; `src/server` recebe autorização, domínio e dados.
- Não há UI kit, state manager, monorepo ou integração cloud nesta fase.

Leia [CONTRIBUTING.md](./CONTRIBUTING.md) antes de alterar a fundação.
