# Central de Atenção — tabela de decisão

Todos os limites usam datas civis no timezone do Workspace. A semana operacional vai de segunda 00:00 a domingo 23:59:59. Alertas são calculados sob demanda, nunca persistidos.

| Ordem          | Regra                                                           | Positivo                              | Negativo                                                  | Evidência e destino                                 |
| -------------- | --------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| 1 · Crítico    | tarefa pendente, bloqueada e vencida em entrega pendente        | prazo `< hoje`                        | hoje/futuro, concluída, desbloqueada ou entrega concluída | prazo, hoje local, timezone, motivo; link da tarefa |
| 2 · Risco      | entrega pendente com tarefa pendente                            | diferença `0..3`                      | sem pendência ou fora da janela                           | prazo e quantidade pendente; link da entrega        |
| 2 · Risco      | projeto ativo sem atualização                                   | diferença `>= 7`                      | 6 dias ou projeto concluído                               | última atividade e dias; link do projeto            |
| 3 · Atenção    | aprovação pendente envelhecida                                  | diferença `>= 2`                      | 1 dia ou já decidida                                      | solicitação e dias; link da entrega                 |
| 3 · Atenção    | tarefa pendente bloqueada                                       | imediatamente                         | desbloqueada ou concluída                                 | motivo, responsável e prazo; link da tarefa         |
| 4 · Informação | entrega pendente explicitamente importante e sem regra superior | diferença `4..7` e `isImportant=true` | 3, 8, concluída, não importante ou regra superior         | prazo e saúde; link da entrega                      |

## Precedência e deduplicação

`CRITICAL > RISK > ATTENTION > INFO`. O mesmo fato não cria dois cartões. O crítico suprime o bloqueio simples da mesma tarefa e risco/informação da mesma entrega. Aprovação e bloqueio da mesma entrega podem ser consolidados preservando ambas as razões; bloqueios de tarefas distintas continuam visíveis quando não são o fato crítico.

## Métricas

- **Entregas concluídas na semana:** Entregas `COMPLETED` cujo instante de conclusão cai na semana operacional. Como o schema atual não possui `completed_at`, a projeção usa `updated_at` apenas para Entregas concluídas; adicionar `completed_at` é dívida explícita antes de histórico analítico.
- **Tarefas atrasadas:** pendentes com data civil anterior a hoje.
- **Aprovações pendentes:** estado `PENDING`, independentemente da idade.
- **Projetos em risco:** projetos que acionam a regra de inatividade.

O relógio é injetável nos testes. A projeção recebe apenas o `workspaceId` derivado do `AuthorizationContext`; somente `ADMIN` pode consultar o painel gerencial.
