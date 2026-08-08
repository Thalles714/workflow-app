# Dados de demonstração

O dataset é inteiramente fictício, idempotente e definido em `supabase/seed.sql`. Os IDs estáveis permitem repetir o roteiro e os testes sem improviso.

## Personagens e acesso

| Personagem      | Papel                    | Uso na demonstração                    | Limite                                                                |
| --------------- | ------------------------ | -------------------------------------- | --------------------------------------------------------------------- |
| Ana Martins     | ADMIN local              | Roteiro do gestor e Central de Atenção | Use apenas no ambiente local; não publicar como acesso compartilhado. |
| Thalles Martins | MEMBER demo              | Demonstra Meu Trabalho e RBAC          | Conta de menor privilégio; só pode atuar no próprio trabalho.         |
| Rafa Costa      | ADMIN de outro workspace | Fixture de isolamento                  | Nunca faz parte do roteiro nem aparece na Aurora.                     |

As contas usam magic link do Mailpit local; não há senha, dados pessoais reais ou service key no repositório. Para uma demonstração pública futura, publicar somente a conta MEMBER com reset frequente e manter a conta ADMIN fora do acesso compartilhado.

## Carteira Aurora

- Clientes: Órbita Tecnologia, Estúdio Maré e Casa Norte.
- Projetos: Lançamento Q3, Reposicionamento Atlas, Portal de parceiros e Marca em movimento.
- Item saudável: `Guia de campanha`, importante, dentro de cinco dias e sem regra superior.
- Fixture de isolamento: Estúdio Horizonte, Norte Comércio e Campanha de Inverno pertencem a outro workspace.

## Seis gatilhos visíveis no Painel

| Regra                | Registro seed                         | Resultado esperado                                    |
| -------------------- | ------------------------------------- | ----------------------------------------------------- |
| Crítico              | `Revisar formulário` / Landing page   | Tarefa atrasada e bloqueada impede a entrega.         |
| Risco de prazo       | Peças do lançamento                   | Entrega vence em até três dias com tarefas pendentes. |
| Risco de atividade   | Reposicionamento Atlas                | Projeto ativo sem atualização há mais de sete dias.   |
| Atenção de aprovação | Kit de lançamento                     | Aprovação pendente há três dias.                      |
| Atenção de bloqueio  | Validar analytics / Integração de CRM | Tarefa bloqueada, sem regra superior concorrente.     |
| Informação           | Guia de campanha                      | Entrega importante, saudável e próxima.               |

## Reset e validação

O reset é manual e deliberado nesta fase: `pnpm db:reset`. Ele recria o banco local, aplica migrations e executa o seed. Não há reset automático porque não existe ambiente público nesta etapa.

Depois do reset, execute `pnpm demo:verify-seed`. O comando confirma as contagens de entidades e os IDs que sustentam os gatilhos, além de registrar o hash SHA-256 do arquivo de seed. A execução repetida de `pnpm db:reset` deve preservar as mesmas contagens e relações.
