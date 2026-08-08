# Workflow

> Operações para pequenas agências, com contexto suficiente para agir antes que uma entrega vire urgência.

[![Quality gate](https://github.com/Thalles714/workflow-app/actions/workflows/quality.yml/badge.svg)](https://github.com/Thalles714/workflow-app/actions/workflows/quality.yml)
[![Demo online](https://img.shields.io/badge/demo-online-111111)](https://workflow-app-lac.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-315ee7.svg)](./LICENSE)

[Explorar demonstração](https://workflow-app-lac.vercel.app) · [Ler o case técnico](./docs/portfolio/case-study.md) · [Consultar a documentação](./docs/README.md)

## Sobre o projeto

Workflow é um projeto de portfólio full-stack que demonstra o ciclo completo de criação de um SaaS: descoberta de produto, modelagem de domínio, interface acessível, autenticação, autorização multi-tenant, PostgreSQL com RLS, testes, CI e publicação.

A demonstração pública apresenta a Agência Aurora, um workspace inteiramente fictício e navegável. Ela é estática e somente leitura: não exige cadastro, não consulta o banco e não permite alterações. A implementação autenticada completa permanece disponível no repositório e pode ser executada localmente.

```text
Workspace → Cliente → Projeto → Entrega → Tarefa
```

## O que pode ser explorado

- Central de Atenção com seis regras determinísticas e explicáveis.
- Meu Trabalho agrupado por urgência e timezone do workspace.
- Clientes, projetos, entregas e tarefas em uma hierarquia consistente.
- Projeto com Visão geral, Kanban e Lista sobre a mesma fonte de dados.
- Bloqueios com motivo obrigatório, responsáveis, prioridades e prazos.
- Aprovações internas, atualizações e trilha de auditoria.
- Papéis `ADMIN` e `MEMBER`, autorização server-side e isolamento por tenant.
- Prévia pública do login por link mágico, sem criar uma sessão real.

## Decisões de arquitetura

O navegador nunca define o workspace ou o papel efetivo. O servidor deriva o ator da sessão e da membership, os módulos de domínio escopam consultas pelo tenant e o PostgreSQL aplica RLS como uma segunda camada de proteção.

```text
src/app/          Rotas e composição do Next.js App Router
src/components/   Primitives, layouts e experiências por contexto
src/modules/      Domínio, autorização, validação e persistência
src/server/       Infraestrutura server-only e testes de banco
supabase/         Migrations, políticas RLS, configuração e seed
tests/e2e/        Percursos críticos no navegador
docs/             Produto, arquitetura, desenvolvimento e release
```

Detalhes e trade-offs estão no [case técnico](./docs/portfolio/case-study.md) e nos [ADRs](./docs/architecture).

## Stack

- Next.js 16, React 19 e TypeScript strict
- Supabase Auth, PostgreSQL, migrations SQL e RLS
- Zod para contratos e validação
- CSS variables e primitives acessíveis próprias
- Vitest, PGlite e Playwright
- GitHub Actions e Vercel Hobby

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

Rotas principais:

- `http://localhost:3000/demo`: demonstração pública somente leitura.
- `http://localhost:3000/demo/login`: prévia segura da experiência de acesso.
- `http://localhost:3000/login`: autenticação local real via Mailpit.
- `http://localhost:3000/health`: verificação local da aplicação.

As contas do seed são fictícias e recebem magic links no Mailpit local. Nenhuma senha ou chave privilegiada é versionada.

## Qualidade

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm demo:verify-seed
```

O gate cobre regras de domínio, RBAC, dois tenants, RLS, IDOR, autenticação, aprovações, headers de segurança, responsividade e percursos E2E. Consulte o [relatório de qualidade](./docs/quality/release-gate.md).

## Publicação e custo

A demonstração está disponível em [workflow-app-lac.vercel.app](https://workflow-app-lac.vercel.app) usando GitHub, GitHub Actions e Vercel Hobby. O custo recorrente projetado para o portfólio é **R$0**, sujeito aos limites e termos atuais dos planos gratuitos.

O Vercel Hobby é adequado ao uso pessoal e não comercial deste portfólio. Uma futura beta com autenticação pública, contribuições ou planos pagos exigirá nova avaliação de hospedagem, e-mail transacional, proteção contra abuso, backups e observabilidade. Veja a [estratégia de deploy](./docs/deployment.md) e a [pesquisa sobre beta pública](./docs/research/public-beta-hosting-2026-08-08.md).

## Evolução planejada

O próximo estágio não é fingir escala: é validar uso com segurança. A evolução prevista inclui beta fechada por convite, ambiente de staging, rate limiting, CAPTCHA, observabilidade, política de backup, billing e termos adequados antes de atender empresas reais.

Este repositório representa um protótipo funcional de SaaS construído sem custos recorrentes. A base foi organizada para permitir evolução incremental sem reescrever o domínio central.

## Documentação

O [índice completo](./docs/README.md) organiza as fontes por finalidade. Pontos de entrada:

- [Briefing do produto](./docs/project/briefing.md)
- [Escopo do MVP](./docs/product/mvp-scope.md)
- [Decisões arquiteturais](./docs/architecture)
- [Banco e autenticação](./docs/development/database-auth.md)
- [Tour público](./docs/demo/public-tour.md)
- [Gate de qualidade](./docs/quality/release-gate.md)
- [Case de portfólio](./docs/portfolio/case-study.md)

## Licença

Distribuído sob a [licença MIT](./LICENSE). Copyright © Thalles Leal Tavares.
