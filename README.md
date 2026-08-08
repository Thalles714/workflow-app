# Workflow

> Um SaaS de operações para pequenas agências: transforma tarefas, entregas e aprovações em uma fila clara de decisões.

**Workflow** é um projeto de portfólio full-stack criado para demonstrar como eu desenho e implemento um produto SaaS: modelagem de domínio, isolamento multi-tenant, autorização server-side, banco com RLS, experiência acessível, testes e uma estratégia de deploy com custo zero.

## Demonstração

- **Prévia pública e segura:** `/demo` (somente leitura, sem autenticação ou escrita).
- **Fluxo completo local:** login → cliente → projeto → entrega → tarefa → alerta → aprovação.
- **URL pública:** será adicionada após a publicação na Vercel.

Os dados da Agência Aurora são fictícios. A prévia pública não lê o Supabase, não cria sessão e não permite alterações.

## O que o produto resolve

Agências pequenas costumam perder contexto entre cliente, projeto, entrega e tarefa. O Workflow organiza essa hierarquia e destaca exceções explicáveis — atraso bloqueado, entrega próxima com pendências, projeto sem atualização e aprovação pendente — em vez de depender de gráficos genéricos.

```text
Workspace → Cliente → Projeto → Entrega → Tarefa
```

Principais capacidades:

- Painel de atenção com seis regras determinísticas e explicáveis.
- Clientes, projetos, entregas e tarefas com soft archive.
- Visões de projeto: resumo, Kanban e lista sobre a mesma fonte de dados.
- Meu Trabalho priorizado por prazo no timezone do workspace.
- Aprovações internas e trilha de auditoria.
- Papéis ADMIN e MEMBER, RLS e autorização aplicada no servidor.
- Demonstração pública em modo somente leitura para recrutadores.

## Arquitetura

```text
src/app/                 Rotas e composição Next.js App Router
src/components/          Primitives acessíveis, shell e UI por contexto
src/modules/             Módulos de domínio e suas interfaces
  auth/                  Sessão e guards Supabase SSR
  authorization/         Contexto do ator e políticas de papel
  clients|projects|.../  Repositórios, serviços e validação Zod
  attention/             Regras puras e projeção operacional
supabase/                Migrations SQL, RLS e seed idempotente
tests/                   Cenários E2E
docs/                    Produto, ADRs, qualidade, demo e deploy
```

O navegador nunca escolhe `workspaceId` ou papel. O servidor deriva o ator da sessão e da membership; as consultas são escopadas por tenant e o Postgres aplica RLS como defesa adicional.

## Stack

- Next.js App Router, React e TypeScript strict
- Supabase Auth, PostgreSQL, migrations SQL e RLS
- CSS variables e primitives próprias acessíveis
- Zod, Vitest e Playwright
- GitHub Actions e Vercel Hobby (planejado para o deploy)

## Executar localmente

Pré-requisitos: Node.js 24+, pnpm 11, Docker e Supabase CLI.

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm db:start
pnpm db:reset
pnpm dev
```

Abra `http://localhost:3000/demo` para a prévia pública ou `http://localhost:3000/login` para o fluxo autenticado local. As contas de seed usam magic link entregue no Mailpit local; nenhuma senha é versionada.

## Qualidade e segurança

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm demo:verify-seed
```

O gate local cobre autorização, RBAC, isolamento entre dois tenants, RLS, regras de atenção, fluxo de aprovação, headers de segurança e E2E. Veja [`docs/quality/release-gate.md`](./docs/quality/release-gate.md).

## Demonstração para recrutadores

O roteiro ensaiável dura cerca de 3–5 minutos e está em [`docs/demo/demo-script.md`](./docs/demo/demo-script.md). A estratégia de dados, papéis e reset está em [`docs/demo/demo-data.md`](./docs/demo/demo-data.md).

Para uma demonstração pública, use `/demo`: é intencionalmente estática e de leitura. Isso permite avaliar a hierarquia, a Central de Atenção e o detalhe de projeto sem distribuir uma conta compartilhada nem expor uma superfície de alteração.

## Deploy e custo

O objetivo é manter o projeto em **R$0** com GitHub Actions, Vercel Hobby e Supabase Free, respeitando a condição de uso pessoal/não comercial do Hobby. Limites, variáveis, migrations, smoke e rollback estão documentados em [`docs/deployment.md`](./docs/deployment.md).

Planos gratuitos podem mudar e o Supabase Free pode pausar por inatividade. Esta é uma demonstração de portfólio, não uma promessa de disponibilidade comercial.

## Evolução planejada

O núcleo foi deliberadamente mantido enxuto. Para uma versão oficial, as próximas etapas incluem convite real de usuários, ambiente de staging separado, rate limiting no edge, observabilidade, gestão segura de credenciais e uma camada de billing. A direção, os limites e as decisões de produto estão em [`docs/portfolio/case-study.md`](./docs/portfolio/case-study.md).

## Documentação

- [Escopo do MVP](./docs/product/mvp-scope.md)
- [Decisões arquiteturais](./docs/architecture)
- [Modelo de banco e autenticação](./docs/development/database-auth.md)
- [Regras da Central de Atenção](./docs/development/attention-rules.md)
- [Gate de qualidade](./docs/quality/release-gate.md)
- [Publicação](./docs/deployment.md)
- [Case de portfólio](./docs/portfolio/case-study.md)

## Licença

Ainda não definida. Antes de tornar o repositório público, escolha uma licença compatível com a forma como deseja permitir reutilização do código.
