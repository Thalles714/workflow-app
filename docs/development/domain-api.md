# Domínio e autorização server-only

## Fronteira pública

Server Actions e Route Handlers devem montar o contexto com createAuthorizationContext(workspaceSelector), criar o serviço com a fábrica createServer…Service() e chamar apenas seus métodos públicos. O seletor identifica a intenção da interface; a autoridade vem da sessão Supabase e da membership ativa consultada no servidor.

```text
sessão verificada
  → membership ativa (actor + workspace + role)
  → AuthorizationContext
  → schema Zod estrito
  → política de serviço
  → repositório filtrado por workspace_id
  → RLS
  → audit_logs nas mutações válidas
```

O adaptador HTTP/Action pode envolver a chamada em executeSafely. O resultado é { ok: true, data } ou { ok: false, status, error: { code, message } }; SQL, detalhes do provedor e stack trace nunca atravessam essa fronteira.

## Matriz de políticas

| Operação                                                          | ADMIN                | MEMBER               |
| ----------------------------------------------------------------- | -------------------- | -------------------- |
| Listar/consultar cliente, projeto, entrega ou tarefa do workspace | permitido            | permitido            |
| Criar, editar ou arquivar cliente/projeto/entrega                 | permitido e auditado | negado               |
| Criar ou arquivar tarefa                                          | permitido e auditado | negado               |
| Editar qualquer tarefa e campos gerenciais                        | permitido e auditado | negado               |
| Atualizar status, descrição ou bloqueio da própria tarefa         | permitido e auditado | permitido e auditado |
| Atualizar tarefa de outro responsável                             | permitido e auditado | negado               |

Arquivamento é lógico por archived_at; os serviços não expõem exclusão física. Listagens aceitam no máximo 100 registros por chamada. IDs, enums, textos, datas e objetos passam por schemas estritos, que também rejeitam campos desconhecidos.

## Serviços disponíveis

Cada domínio expõe list, get, create, update e archive por meio de createClientService, createProjectService, createDeliverableService e createTaskService. As fábricas server-only conectam esses contratos ao cliente Supabase SSR. Criações de filho verificam o pai com workspaceId autorizado antes da persistência; tarefas também verificam que o responsável possui membership ativa no mesmo tenant.

Toda consulta de registro combina workspace_id e id; listagens começam por workspace_id e têm limite. Os repositórios Supabase usam query builder parametrizado, sem interpolação SQL.

## Regras de Meu Trabalho

`listMyWork(context)` deriva `workspaceId` e responsável somente do `AuthorizationContext`, consulta no máximo 100 tarefas ativas e usa o timezone cadastrado no Workspace. O dia começa à meia-noite local; datas continuam armazenadas em UTC. A janela **Próximas** vai de amanhã até o sétimo dia local, inclusive.

A precedência é exclusiva: `IN_REVIEW` entra em **Aguardando aprovação**; depois, prazo anterior ao dia local entra em **Atrasadas**; prazo no dia local entra em **Hoje**; e prazo entre amanhã e o sétimo dia entra em **Próximas**. Tarefas concluídas, sem prazo ou além da janela não aparecem. Cada grupo ordena primeiro pelo prazo e, em empate, por `URGENT`, `HIGH`, `MEDIUM` e `LOW`.

## Matriz de ameaças verificada

| Ameaça                        | Barreira da aplicação                        | Evidência automatizada                   |
| ----------------------------- | -------------------------------------------- | ---------------------------------------- |
| Anônimo                       | contexto falha antes de consultar membership | teste unitário                           |
| Sessão sem membership         | FORBIDDEN sem revelar workspace              | teste unitário                           |
| MEMBER em ação administrativa | requireAdmin antes do repositório            | testes de serviço                        |
| IDOR de outro tenant          | lookup por contexto + workspaceId            | unidade e integração com dois workspaces |
| Pai de outro tenant           | verificação do pai e FK composta             | serviço + banco                          |
| Payload inválido/grande       | Zod estrito e limites                        | testes de serviço                        |
| Alteração de tarefa alheia    | ownership derivado do registro               | testes de serviço                        |
| Falha inesperada              | contrato seguro sem stack/SQL                | teste do contrato                        |
| Mutações válidas sem rastreio | auditoria na mesma fronteira de serviço      | unidade e integração PostgreSQL          |

## Risco residual

Auditoria e mutação são duas chamadas no cliente Supabase, portanto ainda não formam uma transação única. Se a auditoria falhar, o serviço retorna erro, mas a mutação anterior pode ter persistido sem evento. Uma RPC transacional deverá ser considerada antes de operações irreversíveis. Como esta fase oferece somente soft archive e não cria endpoints públicos, o risco é aceito e deve ser reavaliado na revisão de segurança.
