# Roteiro de demonstração — 3 a 5 minutos

## Preparação (30 segundos)

1. Execute `pnpm db:reset` e `pnpm demo:verify-seed`.
2. Inicie `pnpm dev` e abra `http://localhost:3000/login`.
3. Entre como ADMIN local pelo Mailpit. Não use uma conta ADMIN em demonstração pública.

## Roteiro (3 a 5 minutos)

1. **Painel (45 s):** mostre as seis situações explicadas e ordenadas. Abra o crítico para evidenciar prazo, motivo de bloqueio e link canônico.
2. **Hierarquia (45 s):** abra Clientes → Órbita Tecnologia → Lançamento Q3. Mostre que Entrega e Tarefa são entidades distintas.
3. **Projeto (45 s):** alterne entre Visão geral, Kanban e Lista. Mude `Adaptar peças sociais` por meio do controle de status; a mesma tarefa aparece atualizada nas duas visões.
4. **Execução (45 s):** abra Landing page → Revisar formulário. Mostre que o bloqueio exige motivo e que updates mantêm o contexto.
5. **Aprovação (30 s):** abra Aprovações, decida o `Kit de lançamento` e mostre o estado auditável.
6. **RBAC (30 s):** em nova sessão, entre como MEMBER demo. Mostre Meu Trabalho e o aviso de visão gerencial restrita no Painel.

## Encerramento e recuperação

O reset recupera todas as decisões e alterações realizadas no roteiro: execute novamente `pnpm db:reset`. Se uma etapa falhar, não improvise dados; execute o reset, `pnpm demo:verify-seed` e repita a etapa.

## Ensaio

Cronometre do login ADMIN até a verificação MEMBER. A meta é 3–5 minutos sem editar seed, usar console ou explicar configuração. O E2E dourado cobre login, hierarquia, atualização, alertas e aprovação; rode `pnpm test:e2e` antes de uma apresentação importante.

O E2E é evidência mecânica, não substituto do ensaio humano. Antes de avançar ao deploy, uma pessoa deve executar este roteiro, registrar o tempo e declarar explicitamente: `ensaio de demo aprovado`.
