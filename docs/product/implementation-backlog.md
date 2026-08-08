# Backlog de implementação por fase — Workflow

> Status: congelado, aguardando aprovação humana do escopo
>
> Regra: executar uma fase por vez; nenhum item opcional bloqueia o primeiro deploy.

## Definição global de pronto

Uma fase só termina quando seus arquivos esperados existem, critérios observáveis foram verificados, mudanças alheias foram preservadas e todas as verificações aplicáveis passam. Falha de lint, tipos, teste relevante, build ou gate humano impede avanço. Nenhum agente faz push, force-push, reset destrutivo, PR, recurso cloud ou deploy sem autorização explícita.

## Caminho crítico

| Fase | Dependência | Incremento obrigatório | Evidência de saída | Gate para avançar |
|---|---|---|---|---|
| 00 — Escopo | fontes do repositório | escopo, ADRs e backlog | estes quatro documentos coerentes | usuário diz “escopo aprovado” |
| 01 — Protótipos | escopo aprovado | 10 HTMLs independentes e navegáveis | `prototypes/*/index.html`, inventário e checklist | enviar revisão, sem app real |
| 02 — Revisão visual | protótipos | correções visual/a11y/responsividade | relatório, screenshots e zero P0/P1 | usuário diz “protótipos aprovados” |
| 03 — Fundação | protótipos aprovados | app único Next.js/TS e padrões | lint/types/test/build verdes | checks verdes |
| 04 — Banco/Auth | fundação | schema, migrations, RLS, seed e login local | reset/seed duas vezes e testes Auth/RLS | banco limpo e login verdes |
| 05 — Autorização/domínio | banco/Auth | contexto autorizado e serviços seguros | matriz negativa com dois tenants | testes negativos verdes |
| 06 — Shell/UI | protótipos + domínio | tokens, primitives e navegação | comparação 1440/768/390 e teclado | revisão local aprovada |
| 07 — CRUD núcleo | serviços + UI | Cliente→Projeto→Entrega→Tarefa | fluxo hierárquico e permissões | checks verdes |
| 08 — Meu Trabalho | tarefas | agregação pessoal determinística | testes de datas/tenant e estados | checks verdes |
| 09 — Projeto | tarefas | overview/Kanban/Lista | prova de fonte única e filtros | checks verdes |
| 10 — Central | dados operacionais | seis regras e Painel | tabela de decisão + casos positivos/negativos | 100% regras cobertas |
| 11 — Aprovações | entregas/tarefas | aprovação interna, updates e auditoria | fluxo dourado do núcleo | checks verdes |
| 13 — Polimento | núcleo completo | todos estados, responsividade e a11y | matriz tela×estado×viewport | aprovação humana; zero P0/P1 |
| 14 — Qualidade | app polido | suíte completa e revisão segurança | release gate verde | sem falha/flakiness bloqueante |
| 15 — Demo | release gate | seed seguro e roteiro 3–5 min | reset/reexecução e E2E dourado | ensaio aprovado |
| 16 — Deploy | autorização externa | CI/CD e URL gratuita | CI, smoke público e rollback | URL verde |
| 17 — Portfólio | URL/app | README, ADRs, case, capturas e roteiro | reprodução por terceiro | revisão humana |
| 18 — Auditoria | tudo | decisão GO/NO-GO | checklist e evidências finais | GO encerra; NO-GO retorna |

## Fase opcional fora do caminho crítico

| Fase | Quando executar | Escopo máximo | Critério de cancelamento |
|---|---|---|---|
| 12 — Agente por regras | somente após fase 11 estável; preferencialmente após primeiro deploy | consultar atrasos/riscos; preparar criação/edição; preview expirável; confirmação e auditoria; nunca excluir | qualquer ameaça a prazo, segurança, clareza ou estabilidade do núcleo adia a fase |

## Épicos e histórias congeladas

### E0 — Prototipação antes do código

- [ ] Criar um diretório por cada uma das 10 telas e um `index.html` diretamente abrível.
- [ ] Derivar tokens, componentes e movimento apenas do design system oficial.
- [ ] Conectar o fluxo dourado e representar os estados aplicáveis.
- [ ] Validar 1440, 768 e 390 px, teclado, foco, semântica, contraste e reduced motion.
- [ ] Obter aprovação humana explícita antes de inicializar Next.js.

### E1 — Fundação reproduzível

- [ ] Inicializar Git somente na fase 03; preservar todas as fontes.
- [ ] Criar app Next.js App Router, TS strict, Tailwind, lint, format, Vitest e Playwright.
- [ ] Versionar `.gitignore`, `.env.example`, lockfile e instruções.
- [ ] Manter uma aplicação e módulos coesos; proibir monorepo e abstrações especulativas.

### E2 — Dados, Auth e tenancy

- [ ] Modelar `profiles`, `workspaces`, `memberships`, `clients`, `projects`, `deliverables`, `tasks`, `task_updates`, `approvals` e `audit_logs`.
- [ ] Criar enums, checks, FKs, índices e soft archive.
- [ ] Versionar migrations SQL e seed fictício idempotente.
- [ ] Implementar Supabase Auth, sessão SSR e logout.
- [ ] Aplicar/testar RLS e autorização server-side conforme ADR-002.
- [ ] Separar local, teste e produção; nunca versionar segredo.

### E3 — Núcleo operacional

- [ ] Listar, criar, editar e arquivar Clientes conforme papel.
- [ ] Navegar Cliente→Projeto→Entrega→Tarefa com breadcrumbs.
- [ ] Exigir responsável, prazo, prioridade e status conforme regra de cada entidade.
- [ ] Validar Bloqueio com motivo obrigatório.
- [ ] Registrar auditoria de ações relevantes.
- [ ] Implementar loading, vazio, erro, validação e sem permissão.

### E4 — Três experiências centrais

- [ ] Meu Trabalho agrupa por precedência documentada e timezone do Workspace.
- [ ] Projeto tem Visão geral, Kanban e Lista sobre a mesma fonte.
- [ ] Mudança de status funciona por controle acessível; DnD não é requisito.
- [ ] Painel mostra exceções e links, não gráficos decorativos.
- [ ] Central implementa exatamente as seis regras congeladas com relógio injetável.

### E5 — Aprovação e colaboração mínima

- [ ] Criar fluxo interno de solicitação, aprovação, rejeição e reabertura autorizada.
- [ ] Manter uma aprovação ativa por Entrega sem sobrescrever histórico silenciosamente.
- [ ] Adicionar Atualização de tarefa curta, limitada e imutável.
- [ ] Refletir decisões em Meu Trabalho e Central sem cópias próprias.

### E6 — Acessibilidade e estados

- [ ] Cobrir todas as células aplicáveis da matriz de telas/estados.
- [ ] Validar teclado, foco e retorno de foco de modal/drawer.
- [ ] Associar labels, ajuda, erro e live regions corretamente.
- [ ] Garantir que cor não seja único sinal e reduced motion seja eficaz.
- [ ] Validar 200% zoom e os três viewports sem perda funcional.

### E7 — Qualidade e segurança

- [ ] Unitários das seis regras e serviços críticos.
- [ ] Integração de Auth/RBAC/RLS/IDOR com dois workspaces.
- [ ] Testes de migration/seed em banco limpo.
- [ ] UI para formulários e estados essenciais.
- [ ] E2E do login ao alerta e aprovação.
- [ ] Format, lint, types, tests e build em CI.
- [ ] Auditoria de dependências e segredos sem correção automática destrutiva.

### E8 — Demo, deploy e portfólio

- [ ] Seed contém todos os alertas, casos saudáveis e papéis.
- [ ] Conta demo tem menor privilégio e estratégia de reset.
- [ ] Revalidar free tiers e registrar data antes de criar recursos.
- [ ] Publicar em subdomínio gratuito somente após autorização.
- [ ] Executar smoke da URL e documentar rollback.
- [ ] Entregar README, ADRs, case, screenshots, roteiro e limitações honestas.

## Matriz de permissões inicial para implementação

| Ação | ADMIN | MEMBER |
|---|---:|---:|
| Ver dados do próprio Workspace | sim | sim |
| Criar/editar/arquivar Cliente | sim | não |
| Criar/editar/arquivar Projeto | sim | não |
| Criar/editar/arquivar Entrega | sim | não |
| Criar Tarefa | sim | sim, dentro de projeto acessível |
| Editar Tarefa | sim | sim, se atribuída ou regra do Workspace permitir; MVP começa com atribuída |
| Alterar responsável de Tarefa | sim | não |
| Adicionar Atualização à Tarefa acessível | sim | sim |
| Solicitar decisão de Aprovação | sim | sim, se responsável pela Entrega |
| Aprovar/rejeitar/reabrir Entrega | sim | não |
| Ver Painel gerencial completo | sim | não; usa Meu Trabalho |
| Executar mutação confirmada do agente | conforme ação subjacente | conforme ação subjacente |

Qualquer ampliação desta matriz exige atualização do ADR-002, testes negativos e revisão de escopo.

## Matriz de testes negativos obrigatórios

- [ ] Não autenticado em leitura e escrita.
- [ ] Usuário sem Membership no Workspace.
- [ ] MEMBER chama ação ADMIN.
- [ ] `recordId` de outro Workspace em cada serviço crítico.
- [ ] Relação pai/filho cruza Workspace.
- [ ] Payload inválido, texto grande, enum desconhecido e data inválida.
- [ ] Bloqueio sem motivo.
- [ ] Aprovação em transição inválida.
- [ ] Segredo/configuração ausente.
- [ ] Erro interno não vaza stack ou dado sensível.
- [ ] Agente sem preview, sem confirmação, preview adulterado/expirado e tentativa de exclusão, caso a fase 12 exista.

## Fora do backlog do primeiro deploy

Não criar subtarefas para pagamentos, portal do cliente, CRM, financeiro, RH, contratos, timesheets, calendário, timeline/Gantt, dashboards configuráveis, relatórios avançados, integrações, storage, campos/workflows customizados, IA generativa, realtime, filas, microserviços ou automações autônomas. Se surgirem durante execução, registrar em “Depois” sem implementar.
