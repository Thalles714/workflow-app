# Release gate — Workflow

**Data:** 2026-08-08
**Escopo:** evidência de qualidade e segurança proporcional a um projeto público de portfólio. Este documento não declara conformidade, certificação ou pentest externo.

## Resultado

**Gate aprovado localmente:** todas as verificações exigidas concluíram em verde, incluindo a suíte E2E completa a partir de banco limpo. A suíte roda com um trabalhador para isolar os recursos locais compartilhados (PGlite, Supabase e Mailpit); nenhum caso foi desabilitado ou reexecutado para ocultar instabilidade.

## Matriz de riscos e evidências

| Risco                                                          | Mitigação e evidência                                                                                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Acesso anônimo a dados                                         | Guards de sessão, políticas RLS e testes negativos de autorização.                                                                               |
| Escalonamento `MEMBER` → `ADMIN`                               | `AuthorizationContext` e testes RBAC dos serviços e Server Actions.                                                                              |
| IDOR ou leitura cross-tenant                                   | `workspaceId` derivado da associação, consultas escopadas por tenant e testes com Agência Aurora/Horizonte.                                      |
| Payload inválido ou estado impossível                          | Schemas Zod, constraints do Postgres e testes de domínio; bloqueio exige motivo.                                                                 |
| Alertas incorretos                                             | Funções puras de atenção com relógio/timezone injetados e casos positivos/negativos.                                                             |
| Decisão de aprovação sem registro                              | Fluxo E2E com login por magic link, confirmação, atualização e verificação do estado.                                                            |
| Clickjacking, MIME sniffing e exposição excessiva do navegador | Headers de baseline verificados em `tests/e2e/health.spec.ts`.                                                                                   |
| Segredo no cliente ou no repositório                           | Cliente usa chave publicável; busca estática não encontrou credenciais. A única ocorrência de `password=secret` é um literal sintético de teste. |
| Dependência vulnerável                                         | `pnpm audit --prod --json`: 0 vulnerabilidades (alta/crítica: 0).                                                                                |

## Execução local

| Verificação                | Resultado                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm db:reset`            | Passou; migrations e seed aplicados em banco local limpo.                          |
| `pnpm format:check`        | Passou.                                                                            |
| `pnpm lint`                | Passou sem avisos.                                                                 |
| `pnpm typecheck`           | Passou.                                                                            |
| `pnpm test`                | Passou: 22 arquivos, 54 testes.                                                    |
| `pnpm test:e2e`            | Passou: 4 cenários, incluindo login, hierarquia, atualização, alertas e aprovação. |
| `pnpm build`               | Passou.                                                                            |
| `pnpm audit --prod --json` | Passou: 0 vulnerabilidades.                                                        |
| `git diff --check`         | Passou.                                                                            |

## Segurança revisada

Os headers `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy` são enviados em todas as rotas; `X-Powered-By` está desativado. A sessão é gerenciada no servidor por Supabase SSR e a autorização da aplicação é uma defesa adicional às RLS. Não há service-role key no navegador, e erros de domínio são mapeados para mensagens seguras, sem stack trace para o usuário.

## Limitações conhecidas

- Não houve pentest externo nem scanner SaaS pago.
- O rate limit não foi adicionado: o ambiente local não possui proxy/armazenamento compartilhado que permita uma implementação confiável. Deve ser tratado no proxy de produção antes de exposição pública.
- O Supabase CLI informa que a seção `[inbucket]` está depreciada; é aviso de ambiente local, sem impacto funcional neste gate.

## Handoff

O gate está verde. O próximo passo permitido pelo fluxo é o PROMPT 15.
