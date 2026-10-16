# Gate de qualidade — Workflow

**Última verificação:** 20 de agosto de 2026

**Escopo:** evidência proporcional ao portfólio público e fotografia de prontidão para a evolução comercial. Este documento não declara conformidade, certificação ou pentest externo.

## Resultado atual

**Gate do código: verde. Gate E2E autenticado: não executado nesta sessão. Prontidão comercial: ainda não aprovada.**

Lint, tipos, 70 testes automatizados, build de produção, integridade do seed e verificação do diff passaram em 20 de agosto de 2026. A suíte pública de navegador passou com quatro cenários na mesma data durante a Sessão 2 do roadmap.

A suíte autenticada não foi reexecutada nesta fotografia porque a aplicação, o Supabase e o Mailpit locais estavam desligados. O preflight confirmou essa condição antes de abrir o navegador. O resultado histórico de 8 de agosto permanece relevante, mas não deve ser apresentado como evidência atual.

Este gate valida a base de portfólio. Ele não elimina os bloqueios comerciais já identificados, principalmente seleção persistida entre múltiplos workspaces, ausência de onboarding e convites, observabilidade, backups, proteção contra abuso e infraestrutura autorizada para uso comercial.

## Verificações de 20 de agosto de 2026

| Verificação                | Resultado          | Evidência ou observação                                                                                                                                                                                     |
| -------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`                | Passou             | ESLint sem avisos.                                                                                                                                                                                          |
| `pnpm typecheck`           | Passou             | TypeScript sem erros.                                                                                                                                                                                       |
| `pnpm test`                | Passou             | 25 arquivos e 70 testes.                                                                                                                                                                                    |
| `pnpm build`               | Passou             | Build Next.js de produção e 15 rotas geradas.                                                                                                                                                               |
| `pnpm demo:verify-seed`    | Passou             | 4 clientes, 5 projetos, 7 entregas, 9 tarefas e 2 aprovações; hash do seed verificado.                                                                                                                      |
| `git diff --check`         | Passou             | Nenhum erro de whitespace nas alterações.                                                                                                                                                                   |
| `pnpm test:e2e:public`     | Passou na Sessão 2 | 4 cenários; encerramento total inferior a 10 segundos.                                                                                                                                                      |
| `pnpm test:e2e:smoke`      | Passou na Sessão 6 | 2 cenários: login/logout e derivação isolada do workspace Horizonte.                                                                                                                                        |
| `pnpm test:e2e`            | Não executado      | A suíte completa ainda não foi revalidada nesta sequência; o smoke autenticado passou a partir de banco limpo.                                                                                              |
| `pnpm db:reset`            | Não executado      | Docker/Supabase local não foram iniciados nesta sessão.                                                                                                                                                     |
| `pnpm format:check`        | Atenção local      | O único aviso pertence a `gitguard-report-Thalles714-workflow-app-yu2gb7j8.md`, artefato local não versionado e anterior ao roadmap. Os arquivos alterados nas sessões passaram na verificação direcionada. |
| `pnpm audit --prod --json` | Não revalidado     | O resultado de 8 de agosto indicava zero vulnerabilidades; precisa ser executado novamente antes de um release.                                                                                             |

## O que o CI executa atualmente

O workflow `.github/workflows/quality.yml` executa em `push` para `main` e em pull requests:

1. instalação com lockfile;
2. formatação;
3. lint;
4. TypeScript;
5. testes Vitest;
6. build de produção.

O CI **não executa atualmente** Playwright, Supabase local, Mailpit, reset de banco ou auditoria de dependências. Portanto, o badge do repositório comprova apenas o conjunto acima. Adicionar o percurso autenticado ao CI deve ser uma melhoria futura, com serviços isolados e tempo máximo explícito.

## Matriz de riscos e evidências

| Risco                                 | Mitigação atual                                                                 | Estado da evidência                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Acesso anônimo a dados                | Guards de sessão e RLS                                                          | Coberto por testes de serviço e banco.                                                  |
| Escalonamento `MEMBER` → `ADMIN`      | `AuthorizationContext`, RBAC nos serviços e Server Actions                      | Coberto por testes automatizados.                                                       |
| IDOR ou leitura entre tenants         | Consultas escopadas e políticas com Aurora/Horizonte                            | Coberto no domínio, banco e smoke test; runtime deriva o workspace da membership ativa. |
| Payload inválido ou estado impossível | Zod, constraints do PostgreSQL e invariantes de bloqueio                        | Coberto por testes automatizados.                                                       |
| Alertas incorretos                    | Regras puras com relógio e timezone injetados                                   | Coberto por testes de limite, precedência e integração.                                 |
| Aprovação sem auditoria               | Serviço transacional e `audit_logs` append-only                                 | Coberto por testes de serviço; E2E autenticado não foi revalidado nesta sessão.         |
| Headers inseguros                     | Headers configurados globalmente                                                | Coberto pelo teste público de `/health`.                                                |
| Segredos no cliente                   | Apenas chave publicável no navegador; `.env.local` ignorado                     | Revisão estática histórica; scanner dedicado não executado nesta sessão.                |
| Dependências vulneráveis              | Lockfile e auditoria manual                                                     | Auditoria precisa ser revalidada antes do release.                                      |
| Processos E2E pendurados              | Servidor sob controle explícito do desenvolvedor; preflight antes do Playwright | Corrigido e verificado nas Sessões 1 e 2.                                               |

## Como reproduzir o gate

Verificações sem infraestrutura externa:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm demo:verify-seed
git diff --check
```

Testes públicos de navegador:

```powershell
# Terminal 1
pnpm dev

# Terminal 2
pnpm test:e2e:public
```

Percurso autenticado completo:

```powershell
# Terminal 1
pnpm db:start
pnpm db:reset
pnpm dev

# Terminal 2
pnpm test:e2e
```

## Limitações conhecidas

- Não houve pentest externo, scanner SaaS pago ou revisão formal de conformidade.
- Rate limiting e CAPTCHA ainda não foram implementados.
- Não existe política operacional de backup, restauração e resposta a incidentes.
- O workspace padrão é derivado da primeira membership ativa; seleção e persistência para usuários com múltiplos workspaces ainda não existem.
- Não existem criação de workspace, convites, onboarding ou recuperação administrativa adequados para agências reais.
- A seção `[inbucket]` do Supabase CLI possui aviso histórico de depreciação e deverá ser atualizada separadamente.
- Hospedagem, e-mail e termos atuais são adequados à demonstração, não a uso comercial.

## Decisão

- **Demonstração pública de portfólio:** aprovada.
- **Base técnica para continuar o desenvolvimento:** aprovada.
- **Beta fechada com agências reais:** não aprovada ainda.
- **Lançamento comercial:** não aprovado.

O próximo gate deve exigir a suíte autenticada verde a partir de banco limpo e avançar os itens de multi-tenancy e onboarding do [roadmap de prontidão comercial](../product/saas-readiness-roadmap.md).
