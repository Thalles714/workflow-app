# ADR-002 — Autenticação Supabase e autorização multi-tenant em duas camadas

> Status: aceito para o MVP de portfólio
>
> Data: 07 de agosto de 2026

Supabase Auth identifica o Usuário, mas nunca concede autorização operacional sozinho. Toda leitura e escrita resolve no servidor uma Membership válida e um papel para o Workspace; cada consulta combina o identificador do registro com o `workspaceId` autorizado. PostgreSQL RLS repete a fronteira de tenant como defesa adicional. Essa duplicação deliberada reduz o risco de IDOR e acesso cruzado, mesmo se uma rota ou política isolada estiver incorreta.

## Modelo de autorização

```text
cookie de sessão
  → usuário autenticado
  → membership ativa no workspace
  → papel ADMIN ou MEMBER
  → contexto autorizado server-only
  → serviço de domínio
  → consulta por workspaceId + recordId
  → RLS no PostgreSQL
```

- `workspaceId`, `userId`, papel e ownership recebidos do navegador nunca são fonte de autoridade.
- `AuthorizationContext` é criado apenas no servidor e contém actor, workspace e role resolvidos.
- ADMIN gerencia estrutura e decisões gerenciais; MEMBER executa e atualiza trabalho permitido. A matriz detalhada fica junto dos serviços e testes.
- Relações pai/filho devem pertencer ao mesmo tenant; criar Projeto sob Cliente de outro Workspace é inválido mesmo com IDs existentes.
- Respostas a IDs externos não enumeram registros; “não encontrado” e “sem acesso” usam mensagens seguras conforme o contexto.
- Toda entrada passa por schema e limites; erros públicos não contêm stack trace, SQL ou dados sensíveis.
- Ações relevantes e todas as mutações do agente opcional geram `audit_logs` append-only.
- Arquivamento é preferido; o agente nunca exclui.

## Opções consideradas

- **Escolhida:** autorização explícita na aplicação + RLS, ambas testadas.
- Somente RLS: rejeitada porque regras de negócio, papéis e auditoria ficariam excessivamente acoplados e um cliente privilegiado poderia contorná-la.
- Somente filtro na aplicação: rejeitada por tornar um único filtro esquecido suficiente para vazamento cross-tenant.
- Banco por workspace/schema por tenant: rejeitado como complexidade operacional incompatível com um portfólio pequeno.
- Workspace confiado da URL/cookie customizado: rejeitado; a seleção de UI não prova membership.

## Testes de aceitação negativos

| Caso | Resultado obrigatório |
|---|---|
| Usuário não autenticado | 401/redirect seguro; nenhuma consulta operacional |
| Usuário autenticado sem membership | acesso negado sem enumeração |
| MEMBER chama ação exclusiva de ADMIN | 403/erro de domínio seguro |
| `recordId` pertence a outro Workspace | nenhum dado retornado ou alterado |
| Pai e filho pertencem a tenants diferentes | mutação rejeitada |
| Payload inválido, grande ou enum desconhecido | validação rejeita antes do serviço persistir |
| Segredo obrigatório ausente | inicialização/ação falha de modo explícito e seguro |
| Agente confirma mutação sem prévia válida | nenhuma mutação e evento de segurança/auditoria apropriado |

## Consequências

- Testes de integração sempre usam pelo menos dois workspaces e usuários com papéis diferentes.
- RLS não substitui testes de serviço; testes de serviço não substituem RLS.
- Service-role key, se necessária apenas para seed administrativo, fica fora do navegador e do runtime comum.
- Mudança futura de provedor de Auth exige preservar Membership, contexto autorizado, políticas e matriz negativa.
