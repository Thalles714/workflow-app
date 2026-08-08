# Tour público do Workflow

`/demo` é a porta de entrada pública do portfólio. Ele apresenta a Agência Aurora, um workspace inteiramente fictício e uma sequência de decisões operacionais — sem conta, e-mail, banco ou escrita.

## Percurso recomendado

1. **Central:** explique a fila de seis alertas e abra um deles pelo botão **Inspecionar**.
2. **Projeto:** abra **Lançamento Q3** para mostrar progresso, entrega em foco e a lista de tarefas.
3. **Entrega e tarefa:** siga a dependência da Landing page até **Revisar formulário**.
4. **Aprovação:** mostre que a solicitação preserva contexto e encaminha a próxima decisão.
5. **Arquitetura:** use os links de Código e Case study para aprofundar segurança, RLS, testes, CI e decisões de arquitetura.

O tour é propositalmente somente leitura. A versão autenticada do repositório demonstra Auth, RBAC, RLS, migrations, auditoria e testes; esses mecanismos não são expostos em uma conta pública compartilhada.

## Mapa de rotas

| Área               | Rota                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| Central de atenção | `/demo`                                                                           |
| Projeto            | `/demo/projects/lancamento-q3`                                                    |
| Entrega            | `/demo/projects/lancamento-q3/deliverables/landing-page`                          |
| Tarefa             | `/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario` |
| Aprovações         | `/demo/approvals`                                                                 |

As rotas de contexto são estáticas e não fazem chamadas ao Supabase. O teste E2E `tests/e2e/public-demo.spec.ts` verifica o percurso principal, Escape no drawer e ausência de overflow em 1440, 768 e 390 px.
