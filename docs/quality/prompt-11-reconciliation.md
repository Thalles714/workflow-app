# Reconciliação do PROMPT 11 — Aprovações e colaboração mínima

**Data:** 8 de agosto de 2026
**Escopo auditado:** commit `6037ee9` e a implementação atual de Aprovações, Atualizações de tarefa, Meu Trabalho, Central de Atenção, RLS e E2E.

## Decisão

O fluxo do PROMPT 11 foi reconciliado sem reimplementar o domínio. As lacunas encontradas na revisão foram corrigidas por mudanças mínimas e testes adicionais.

## Fluxo e políticas confirmados

| Capacidade                                         | Evidência                                                                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Solicitar, aprovar, solicitar alterações e reabrir | `src/modules/approvals/service.ts` aplica máquina de estados e `requireAdmin`.                                                              |
| Uma aprovação pendente por entrega                 | Índice parcial `approvals_one_pending_per_deliverable_idx` na migration `20260808050000_approval_invariants.sql`.                           |
| Notas curtas e input seguro                        | Schemas Zod exigem texto aparado entre 1 e 500 caracteres; React renderiza texto, não HTML confiado.                                        |
| Task updates append-only                           | Serviço cria/lista somente; trigger do banco e permissões recusam mutation/deleção.                                                         |
| Auditoria                                          | Solicitação, decisão, reabertura e atualização registram ator e workspace. A reabertura agora inclui status/nota anteriores e motivo.       |
| Isolamento e papéis                                | Serviços recebem `AuthorizationContext`; queries combinam `workspace_id`; RLS recusa MEMBER na alteração de aprovações.                     |
| Projeções                                          | Central remove alerta ao decidir a aprovação; Meu Trabalho usa aprovação pendente da entrega para o grupo exclusivo “Aguardando aprovação”. |

## Cobertura adicionada

- Solicitação válida, decisão, segunda pendência, reabertura e IDOR seguro em `approvals/service.test.ts`.
- Criação auditada e negação de update fora do workspace em `updates/service.test.ts`.
- Reflexo de aprovação pendente/decidida na regra determinística de Meu Trabalho.
- Banco limpo confirma que MEMBER não altera aprovações e não altera updates históricos.

## Dívida aceita

- A lista de Aprovações mantém foco operacional; o histórico detalhado permanece no `audit_logs`, não em uma timeline pública da tela.
- Mutação e escrita de auditoria continuam chamadas separadas. Antes de operações irreversíveis, migrar para uma RPC transacional.

## Verificações

| Verificação         | Resultado                                        |
| ------------------- | ------------------------------------------------ |
| `pnpm format:check` | aprovado                                         |
| `pnpm lint`         | aprovado                                         |
| `pnpm typecheck`    | aprovado                                         |
| `pnpm test`         | 61 testes aprovados                              |
| `pnpm db:reset`     | migrations e seed aplicados em banco local limpo |
| `pnpm test:e2e`     | 4 fluxos Chromium aprovados                      |
| `pnpm build`        | aprovado                                         |
| `git diff --check`  | aprovado                                         |

O primeiro E2E após testes repetidos recusou um magic link local já afetado pelo estado acumulado do provedor. O reset documentado foi executado e a repetição sem retries passou integralmente; a evidência de aceite acima é a execução sobre o banco limpo.
