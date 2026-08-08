# Plano operacional — Workflow do zero ao deploy

> Elaborado em 07 de agosto de 2026 a partir de inspeção real do repositório. Este documento planeja a execução; não implementa o SaaS.

## 1. Evidências encontradas no repositório

- `workflow-briefing.md` define o produto: sistema operacional de entregas para agências de 3–30 pessoas, com o domínio `Workspace → Cliente → Projeto → Entrega → Tarefa`, aprovações internas e gestão por exceção. Entrega é entidade própria; Kanban e Lista são views da mesma fonte.
- `assets/design_system/design_system.html` é a fonte visual obrigatória. Define a direção “calma para operar / sinal antes de ruído”, Plus Jakarta Sans, Inter e JetBrains Mono; canvas `#F7F7F5`, surface `#FFFFFF`, ink `#121211`, indigo `#5B5CE2`, violeta `#8B5CF6`, cyan `#17A2B8`; escala de 4 px, ritmo de 8 px; raios de 4 a 26 px; estados semânticos; foco visível; componentes completos; movimento `micro` 160–180 ms, `control` 180–250 ms, `layer` 280–380 ms e suporte a `prefers-reduced-motion`.
- `assets/templates/` contém sete referências: `sidebar` para navegação responsiva; `dashboard-list` e `cool-dashboard` para hierarquia/densidade; `animations-gemini2` para vocabulário de movimento; Axion e Volta para composição; `ai-marketing-56` para fluxo. São inspiração secundária, nunca identidade visual nem código a copiar integralmente.
- `docs/research/work-management-references.md` confirma padrões funcionais de Asana, Jira e monday.com: trabalho pessoal consolidado, múltiplas views sobre o mesmo dado, boards como leitura do fluxo, atenção acionável e automação auditável.
- Não existe `AGENTS.md`, `package.json` ou aplicação. A pasta tampouco está inicializada como repositório Git. Os artefatos existentes devem ser preservados.

## 2. MVP congelado

### Síntese e fluxo crítico

O Workflow demonstra que uma única pessoa construiu um produto full-stack seguro e coerente. Um membro entra numa demonstração isolada, vê o que precisa fazer, navega pelo contexto cliente/projeto/entrega, atualiza uma tarefa e o gestor enxerga uma exceção explicável na Central de Atenção até registrar a aprovação interna.

### Agora / Depois / Fora do portfólio

| Agora — primeiro deploy | Depois — opcional pós-deploy | Fora do portfólio |
|---|---|---|
| Login real com conta demo limitada; um workspace seed; RBAC admin/membro; clientes, projetos, entregas e tarefas; bloqueio; atualização curta; Meu Trabalho; projeto com visão geral/Kanban/Lista; Central de Atenção determinística; aprovação interna; auditoria; estados, responsividade, acessibilidade; testes, CI, deploy e documentação | Agente por regras com consulta e criação/edição mediante prévia e confirmação; convites reais por e-mail; comentários; templates próprios; reset automatizado do seed; GIF de demo | Pagamentos, CRM, financeiro, RH, contratos, timesheets, portal de cliente, calendário, Gantt, dashboards configuráveis, relatórios avançados, integrações, upload/storage, campos/workflows customizáveis, realtime, IA generativa e automações autônomas |

**Decisões:** convites ficam pós-deploy porque e-mail e abuso adicionam risco sem melhorar o fluxo demonstrável; membros vêm do seed. Comentários ficam pós-deploy; uma `TaskUpdate` curta prova histórico com menos superfície. Templates ficam pós-deploy. O agente por regras é opcional e nunca bloqueia o deploy: tem bom valor de portfólio, mas o núcleo completo vale mais.

**Orçamento de complexidade:** removidos monorepo/Turborepo, Auth.js separado, e-mail, drag-and-drop obrigatório, realtime, storage, analytics externo, observabilidade SaaS, filas, Redis, Docker obrigatório em produção, personalização e exclusão física. O Kanban usa mudança de status acessível; drag-and-drop só entra se não prejudicar teclado/testes.

### Telas exatas e estados

| # | Tela/rota conceitual | Estados exigidos |
|---|---|---|
| 1 | Login/demo | normal, enviando, erro de credencial/configuração |
| 2 | Painel da Operação | normal, loading, vazio, erro, sem permissão de gestor |
| 3 | Meu Trabalho | normal, loading, vazio, erro |
| 4 | Clientes | normal/lista, loading, vazio, erro |
| 5 | Cliente + projetos | normal, loading, vazio, erro, não encontrado/sem permissão |
| 6 | Projeto | visão geral, Kanban, Lista; loading, vazio, erro, sem permissão; filtros sem resultado |
| 7 | Entrega | normal, loading, vazio de tarefas, erro, sem permissão; aprovação pendente/aprovada/rejeitada |
| 8 | Tarefa em drawer/rota recuperável | leitura, criação, edição, validação, salvando, erro, sem permissão; bloqueada/desbloqueada |
| 9 | Aprovações | normal, loading, vazio, erro, sem permissão; confirmar decisão |
| 10 | Acesso negado / não encontrado | mensagem segura e caminho de retorno |

Estados podem ser variantes dentro do `index.html` de cada tela, mas cada uma das dez telas terá seu próprio diretório e `index.html` no protótipo.

### Fluxo dourado de 3–5 minutos

`Login demo → workspace Agência Aurora → Cliente Órbita → Projeto Lançamento Q3 → Entrega Landing page → Tarefa Revisar formulário → marcar bloqueio/atualizar prazo → abrir Painel e explicar alerta crítico → resolver tarefa → Aprovações → aprovar entrega → confirmar redução/remoção do alerta.`

## 3. Stack escolhida e custo zero

Verificação oficial datada de 07/08/2026; detalhes e links primários ficam em `docs/research/free-tier-verification-2026-08-07.md`. Free tiers mudam: revalidar no PROMPT 16 antes de criar recursos.

| Camada | Escolha e função | Limite gratuito relevante | Risco | Alternativa gratuita |
|---|---|---|---|---|
| App | Next.js App Router + React + TypeScript estrito; Server Components/Actions e Route Handlers | Open source/local | versão e compatibilidade | React/Vite + API Cloudflare, apenas contingência |
| UI | Tailwind CSS + CSS variables + primitives acessíveis próprias; Lucide | Open source | abstração excessiva | CSS Modules |
| Validação/form | Zod + React Hook Form quando necessário | Open source | duplicar schemas | formulário nativo + Zod |
| Dados/Auth | Supabase Free: PostgreSQL, Auth e RLS no mesmo provedor | US$0; 2 projetos ativos, banco de 500 MB/projeto, 5 GB egress e 50 mil MAU; [preços](https://supabase.com/pricing) e [billing](https://supabase.com/docs/guides/platform/billing-on-supabase) | pausa após 1 semana inativo, sem backup automático/SLA; read-only ao exceder 500 MB | [Neon Free](https://neon.com/pricing): 0,5 GB e 100 CU-h/mês por projeto; Auth exige reavaliação |
| Acesso SQL | `@supabase/ssr` + SQL migrations; sem Prisma no MVP | Open source; reduz pool/conexões e mantém RLS nativa | SQL mais explícito | Prisma + Neon/Supabase se a fase 00 provar necessidade |
| Testes | Vitest + Testing Library + Playwright | Open source | E2E mais lento | Node test runner para unidade |
| Hospedagem | Vercel Hobby, subdomínio gratuito | Uso pessoal/não comercial; 100 GB de transferência, 1 milhão de Function invocations e 6.000 build-min/mês; [Hobby](https://vercel.com/docs/plans/hobby) | cotas, logs de 1 hora e política não comercial | [Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits/) + [Workers](https://developers.cloudflare.com/workers/platform/limits/): 500 builds/mês e 100 mil requests/dia |
| Código/CI | GitHub Free + GitHub Actions | runners padrão gratuitos em repositório público; privado Free: 2.000 min/mês e 500 MB artifacts; [billing oficial](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | minutos/armazenamento; repo deve ser pessoal para integração Hobby | CI local documentado |

Dependências existem apenas para: framework full-stack, contratos de entrada, formulários acessíveis, cliente/Auth/RLS, ícones e testes. Não entram state manager global, query cache, DnD, ORM, UI kit, analytics ou logger SaaS sem evidência.

## 4. Arquitetura e modelo de dados mínimos

```text
Navegador
   │ HTTPS + cookie de sessão
   ▼
Next.js (UI + Server Actions/Route Handlers)
   │ valida Zod → obtém sessão → resolve membership → força workspaceId
   ▼
Supabase PostgreSQL/Auth
   ├── RLS como defesa adicional
   ├── migrations SQL versionadas
   └── seed fictício idempotente
```

Aplicação única organizada por módulos (`auth`, `workspaces`, `clients`, `projects`, `deliverables`, `tasks`, `attention`, `approvals`, `audit`). Componentes não acessam banco diretamente; serviços server-only recebem um contexto autorizado, nunca `workspaceId/userId/role` confiado do navegador.

### Modelo relacional mínimo

| Tabela | Campos essenciais e relações | Índices/regras |
|---|---|---|
| `profiles` | `id` = auth user, `display_name` | sem dado pessoal seed real |
| `workspaces` | `id`, `name`, timestamps | nome não é identidade de segurança |
| `memberships` | `workspace_id`, `user_id`, `role` ADMIN/MEMBER | unique composto; índices pelos dois lados |
| `clients` | `id`, `workspace_id`, `name`, `status`, timestamps | `(workspace_id,name)`, soft archive |
| `projects` | `id`, `workspace_id`, `client_id`, `name`, `owner_id`, `due_date`, `last_activity_at`, `status` | FKs do mesmo tenant verificadas; índices tenant/cliente/prazo |
| `deliverables` | `id`, `workspace_id`, `project_id`, `title`, `owner_id`, `due_date`, `importance`, `status` | tenant/projeto/prazo/status |
| `tasks` | `id`, `workspace_id`, `deliverable_id`, `title`, `assignee_id`, `due_date`, `priority`, `status`, `is_blocked`, `block_reason` | tenant/assignee/prazo/status; motivo obrigatório se bloqueada |
| `task_updates` | `id`, `workspace_id`, `task_id`, `author_id`, `body`, `created_at` | tamanho limitado; tenant/task/data |
| `approvals` | `id`, `workspace_id`, `deliverable_id`, `status`, `decided_by`, `decided_at`, `note` | uma aprovação ativa por entrega |
| `audit_logs` | `id`, `workspace_id`, `actor_id`, `action`, `entity_type/id`, `metadata`, `created_at` | append-only para ações relevantes |

Enums: `member_role`, `record_status`, `task_status` (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), `priority`, `importance`, `approval_status`. Alertas são projeções calculadas, não tabela: regra, severidade, explicação e link derivam dos dados. Datas em UTC no banco; datas civis interpretadas pelo timezone do workspace (`America/Sao_Paulo` no seed).

Migrações SQL incrementais e reversão documentada; seed usa chaves estáveis/upsert. Local usa Supabase CLI se disponível, testes usam banco local limpo, produção usa projeto Supabase separado. `.env.example` contém apenas nomes: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (somente scripts server-side, nunca runtime cliente), `APP_URL`, `DEMO_*` apenas se seguro.

### Matriz curta de ameaças

| Ameaça/teste negativo | Controle |
|---|---|
| não autenticado | middleware/guard + serviço rejeita |
| membro sem papel suficiente | RBAC server-side; UI não é controle |
| ID de outro workspace/IDOR | consulta sempre combina `id` + workspace autorizado; RLS |
| payload inválido/grande | Zod, limites e mensagens seguras |
| mutação do agente sem confirmação | token/estado de prévia server-side, expiração e auditoria |
| segredo ausente/exposto | falha segura na inicialização, `.env.example`, secret scan |
| erro interno | resposta genérica + log sem dados sensíveis |

## 5. Mapa de fases e dependências

| Prompt | Entrada | Saída verificável | Gate |
|---|---|---|---|
| 00 | fontes atuais | escopo/ADRs/backlog congelados | usuário confirma escopo |
| 01 | escopo aprovado | 10 protótipos HTML navegáveis | não implementar app |
| 02 | protótipos | relatório visual/a11y + correções | aprovação humana explícita |
| 03 | protótipos aprovados | Next.js e padrões base | checks verdes |
| 04 | fundação | migrations, RLS, seed, Auth | banco limpo + login |
| 05 | Auth/dados | autorização e serviços de domínio | testes negativos verdes |
| 06 | tokens aprovados | shell e primitives | revisão 1440/768/390 |
| 07 | domínio | CRUD núcleo | fluxo hierárquico funcional |
| 08 | tarefas | Meu Trabalho | agrupamentos testados |
| 09 | tarefas/projeto | overview/Kanban/Lista | mesma fonte comprovada |
| 10 | regras | Painel/Central | matriz de regras testada |
| 11 | entregas | aprovações/updates/auditoria | autorização testada |
| 12 | núcleo publicado ou estável | agente por regras | opcional; pode pular |
| 13 | todas as telas | responsividade/a11y/estados | auditoria manual aprovada |
| 14 | produto integrado | suíte e revisão de segurança | gate de release verde |
| 15 | suíte verde | seed/demo/recrutador | ensaio 3–5 min |
| 16 | conta cloud + aprovação | CI/CD e URL pública | ação externa autorizada |
| 17 | URL e produto | README/ADRs/case/demo | documentação reproduzível |
| 18 | tudo | auditoria final/handoff | checklist mestre concluído |

## 6. Prompts completos e copiáveis

### PROMPT 00 — Auditoria e congelamento do escopo

1. **Papel:** arquiteto de produto e software para um SaaS de portfólio.
2. **Contexto:** trabalhe em `C:\Users\Administrator\Projects\workflow`. Workflow atende agências pequenas e usa `Workspace→Cliente→Projeto→Entrega→Tarefa`. Leia integralmente `workflow-briefing.md`, `workflow-execution-plan.md`, o design system oficial, a pesquisa funcional, a pesquisa de free tiers e `AGENTS.md` se existir. Briefing vence em produto; design system vence em visual. Orçamento zero.
3. **Pré-condições:** confirme arquivos, estado Git/diff e ausência/presença de app; não presuma memória.
4. **Objetivo:** congelar um backlog implementável e registrar as decisões antes de código.
5. **Incluído:** validar Agora/Depois/Fora, telas/estados, fluxo dourado, stack, diagrama, modelo, ameaças; criar `docs/product/mvp-scope.md`, `docs/architecture/adr-001-stack.md`, `adr-002-auth-multitenancy.md` e backlog por fase.
6. **Fora:** código do app, protótipos, dependências, cloud/deploy.
7. **Arquivos:** somente os quatro documentos acima; preserve fontes e referências.
8. **Regras:** app único Next.js/TS; Supabase Auth/Postgres/RLS; server authorization; nada pago; alertas determinísticos; agente opcional.
9. **Procedimento:** inspecione → compare divergências → registre decisões/trade-offs → revise diff.
10. **Verificações:** links internos, tabelas completas, `git diff --check` se Git existir; procure placeholders/TODOs vagos.
11. **Aceitação:** escopo exato, dez telas, critérios observáveis, dependências e riscos; nenhum item proibido em Agora.
12. **Pronto:** documentos coerentes e sem contradição; informe se Git ainda não existe.
13. **Relatório:** resumo, arquivos, validações, decisões, riscos e pergunta explícita de aprovação do escopo.
14. **Passagem:** só após “escopo aprovado”, envie o PROMPT 01; se houver dúvida material, não avance.
15. **Commit sugerido:** `docs: freeze workflow mvp scope`; não faça push/rewrite sem autorização.

### PROMPT 01 — Protótipos HTML independentes

1. **Papel:** product designer e frontend prototyper acessível.
2. **Contexto:** no mesmo caminho, leia briefing, escopo aprovado, ADRs, design system inteiro e templates apenas como composição. Produto/fluxo e orçamento são os do PROMPT 00; preserve fontes.
3. **Pré-condições:** evidência textual de escopo aprovado e `docs/product/mvp-scope.md`; pare se faltar.
4. **Objetivo:** validar a aparência e o fluxo antes da aplicação real.
5. **Incluído:** criar `prototypes/{login,operation,my-work,clients,client,project,deliverable,task,approvals,access-denied}/index.html`, assets compartilhados locais, navegação do fluxo dourado, seletor/área demonstrável de estados, inventário e checklist; dados realistas Agência Aurora.
6. **Fora:** React/Next.js, banco, auth real, build, cópia integral de template.
7. **Arquivos:** apenas `prototypes/**` e `docs/design/prototype-inventory.md`; nunca altere design system/templates.
8. **Regras:** derive tokens/fontes/cores/raios/movimento; HTML semântico, CSS e JS mínimo; 1440/768/390; foco, labels, landmarks, contraste, teclado, Escape/focus return, reduced motion; cada tela abre diretamente.
9. **Procedimento:** inventarie tokens → defina shell → faça telas → conecte links → valide todos os estados → revise diff.
10. **Verificações:** servidor estático opcional; abrir cada `index.html`; testar teclado, console, links e três larguras; registrar screenshots/instruções.
11. **Aceitação:** dez diretórios/HTMLs independentes, fluxo completo clicável, sem overflow a 390 px, estados críticos e componentes inventariados.
12. **Pronto:** nenhum link/console quebrado; não inicie app.
13. **Relatório:** telas, arquivos, matriz de estados, validações, divergências e instruções de revisão humana.
14. **Passagem:** envie PROMPT 02 para revisão; não envie 03.
15. **Commit:** `feat(prototype): add independent workflow screens`; sem push/rewrite.

### PROMPT 02 — Revisão visual e aprovação humana

1. **Papel:** revisor sênior de UI e acessibilidade.
2. **Contexto:** leia as mesmas fontes do PROMPT 01 e todos os protótipos; o design system é normativo.
3. **Pré-condições:** dez HTMLs e inventário presentes.
4. **Objetivo:** encontrar/corrigir falhas de consistência, responsividade e acessibilidade e obter aprovação humana.
5. **Incluído:** revisão em 1440/768/390, fluxo dourado, todos os estados, teclado, foco, contraste, reduced motion, hierarquia/densidade; correções apenas nos protótipos; relatório `docs/design/prototype-review.md`.
6. **Fora:** app real, alteração de escopo, redesign do design system.
7. **Arquivos:** `prototypes/**` e relatório; preserve todo o resto.
8. **Regras:** cor nunca é único sinal; modais/drawers gerenciam foco; movimento tem causa e pode ser reduzido.
9. **Procedimento:** inspecione/diff → capture evidência → liste por severidade → corrija P0/P1 → reteste.
10. **Verificações:** links, console, zoom 200%, teclado sem rato e screenshots das três larguras.
11. **Aceitação:** zero P0/P1, P2 documentado, fluxo sem becos e fidelidade ao design system.
12. **Pronto:** peça uma decisão humana “protótipos aprovados” ou mudanças específicas.
13. **Relatório:** achados/correções/evidências/dívida e pedido de aprovação.
14. **Passagem:** somente com frase explícita “protótipos aprovados” envie PROMPT 03; caso contrário repita 02.
15. **Commit:** `fix(prototype): address visual and accessibility review`.

### PROMPT 03 — Fundação da aplicação e Git

1. **Papel:** engenheiro de plataforma Next.js.
2. **Contexto:** mesmo produto/caminho/fontes; leia escopo, ADRs, protótipos aprovados e instruções locais. App único, custo zero.
3. **Pré-condições:** aprovação explícita dos protótipos; se ausente, pare sem criar app.
4. **Objetivo:** criar fundação mínima reproduzível, ainda sem domínio funcional.
5. **Incluído:** inicializar Git se ausente e autorizado pelo pedido; Next.js App Router/TS strict/Tailwind; estrutura modular; ESLint/Prettier; Vitest; Playwright config; scripts; `.gitignore`, `.env.example`, `CONTRIBUTING.md`; página health/local.
6. **Fora:** banco cloud, CRUD, telas finais, deploy.
7. **Arquivos:** configs, `src/**` mínimo, testes smoke e docs; não mover/apagar fontes/protótipos.
8. **Regras:** pnpm e lockfile; Server Components por padrão; dependência só com justificativa; sem monorepo/UI kit/state manager.
9. **Procedimento:** inspecione versões disponíveis → scaffolding não destrutivo → configure → teste → revise diff/status.
10. **Verificações:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `git diff --check`.
11. **Aceitação:** clone limpo instalável, scripts documentados, TS strict, nenhum segredo e todos checks verdes.
12. **Pronto:** não alegue sucesso com build quebrado.
13. **Relatório:** versões, dependências justificadas, arquivos/checks/riscos e handoff.
14. **Passagem:** com checks verdes, envie PROMPT 04.
15. **Commit:** `chore: initialize workflow application foundation`.

### PROMPT 04 — Banco, migrações, seed e autenticação

1. **Papel:** engenheiro PostgreSQL/Supabase e autenticação.
2. **Contexto:** leia fontes, ADR-002 e fundação. Supabase Auth/Postgres/RLS; ambiente local/teste/produção separado; tenant por workspace.
3. **Pré-condições:** PROMPT 03 verde; Supabase CLI local ou alternativa gratuita documentada. Credencial cloud não é necessária nesta fase.
4. **Objetivo:** criar esquema versionado, seed idempotente e login funcional local.
5. **Incluído:** migrations com tabelas/enums/FKs/checks/índices/RLS; profiles/memberships; cliente SSR; login/logout; guards; seed fictício que dispara todos alertas; scripts reset/seed; env validation.
6. **Fora:** UI final, CRUD completo, convite/e-mail, service-role no cliente.
7. **Arquivos:** `supabase/**`, `src/modules/auth/**`, tipos/configs, testes e documentação de banco.
8. **Regras:** RLS + autorização da app; `workspaceId` nunca confiado; check de bloqueio/motivo; dados UTC; soft archive; seed sem PII.
9. **Procedimento:** modele → migre banco limpo → aplique RLS → seed duas vezes → login → testes negativos → diff.
10. **Verificações:** reset/migrations/seed duas vezes; lint/types/tests/build; busca por segredos.
11. **Aceitação:** esquema completo, seed idempotente, sessão segura, RLS nega anônimo/cross-tenant, env ausente falha com segurança.
12. **Pronto:** banco limpo reproduzível e nenhum segredo versionado.
13. **Relatório:** diagrama final, migrations, contas seed sem expor senha real, checks e riscos.
14. **Passagem:** envie PROMPT 05 somente após testes de Auth/RLS verdes.
15. **Commit:** `feat(data): add schema seed and authentication`.

### PROMPT 05 — Autorização multi-tenant e domínio/API

1. **Papel:** engenheiro backend orientado a segurança.
2. **Contexto:** leia fontes/ADRs/schema. Autenticação não é autorização; serviços server-only protegem toda leitura/escrita.
3. **Pré-condições:** banco/Auth/seed funcionando.
4. **Objetivo:** entregar uma camada de domínio segura e testável para o núcleo.
5. **Incluído:** `AuthorizationContext`; políticas ADMIN/MEMBER; repositórios/serviços de clients/projects/deliverables/tasks; schemas Zod e erros seguros; auditoria; contratos para Server Actions/handlers.
6. **Fora:** páginas, agente, integrações, abstrações genéricas.
7. **Arquivos:** `src/modules/{authorization,clients,projects,deliverables,tasks,audit}/**`, testes e docs API.
8. **Regras:** derive actor/workspace da sessão/membership; consultas por `id+workspaceId`; ownership/FKs do tenant; SQL parametrizado; limites; sem stack trace.
9. **Procedimento:** escreva testes negativos → serviços mínimos → integração DB → revisão de cada query.
10. **Verificações:** unidade, integração com dois workspaces, lint/types/build e busca por consultas sem tenant.
11. **Aceitação:** anônimo, papel insuficiente, IDOR e payload inválido são negados; ações válidas auditadas.
12. **Pronto:** matriz de ameaça coberta sem depender só de RLS.
13. **Relatório:** políticas, endpoints/serviços, testes, riscos e handoff.
14. **Passagem:** checks verdes → PROMPT 06.
15. **Commit:** `feat(domain): enforce tenant-safe core services`.

### PROMPT 06 — Shell e componentes do design system

1. **Papel:** frontend engineer especialista em design systems acessíveis.
2. **Contexto:** leia design system inteiro, protótipos aprovados, inventário e fundação. A aplicação deve reproduzir decisões aprovadas, não reinterpretá-las.
3. **Pré-condições:** aprovação visual e serviços/Auth básicos verdes.
4. **Objetivo:** implementar tokens, primitives e shell responsivo reutilizável.
5. **Incluído:** CSS variables/fontes; layouts autenticado/login; sidebar/nav mobile; button/field/select/badge/chip/avatar/card/tabs/table/empty/alert/toast/modal/drawer/skeleton; focus management; Story/demo interna se barata.
6. **Fora:** páginas de negócio completas, nova biblioteca UI, animação decorativa.
7. **Arquivos:** `src/components/**`, estilos/layouts e testes focados.
8. **Regras:** semântica nativa; 44 px em alvos mobile quando adequado; reduced motion; cores/textos/ícones redundantes; Server Components por padrão.
9. **Procedimento:** mapear protótipo→primitive → implementar estados → testar teclado → comparar em três larguras → diff.
10. **Verificações:** lint/types/unit/build; navegação teclado; 1440/768/390; sem console/overflow.
11. **Aceitação:** primitives cobrem inventário, shell recupera foco/Escape e visual é reconhecível como Workflow.
12. **Pronto:** zero regressão P0/P1 conhecida.
13. **Relatório:** componentes/tokens, comparativo, checks e dívidas.
14. **Passagem:** aprovado localmente → PROMPT 07.
15. **Commit:** `feat(ui): implement workflow design system shell`.

### PROMPT 07 — CRUD do núcleo

1. **Papel:** product engineer full-stack.
2. **Contexto:** use domínio/serviços seguros e UI aprovada. Hierarquia fixa; Entrega não é tarefa.
3. **Pré-condições:** PROMPT 05/06 verdes.
4. **Objetivo:** tornar clientes, projetos, entregas e tarefas navegáveis e editáveis ponta a ponta.
5. **Incluído:** listas/detalhes; criar/editar/arquivar conforme papel; task drawer/rota; responsável, prazo, prioridade, status, bloqueio+motivo; breadcrumbs; loading/empty/error/permission; invalidação simples.
6. **Fora:** Meu Trabalho, Central, aprovações, drag-and-drop obrigatório, delete físico.
7. **Arquivos:** rotas e módulos do núcleo, testes; alterações mínimas em primitives.
8. **Regras:** Server Actions validadas; progressive enhancement; autorização em serviço; feedback seguro; data estruturada obrigatória.
9. **Procedimento:** vertical slice cliente→tarefa → estados → testes → revisão cross-tenant.
10. **Verificações:** lint/types/unit/integration/build; smoke manual do CRUD e IDOR.
11. **Aceitação:** fluxo hierárquico completo; bloqueio sem motivo impossível; MEMBER não executa ação de ADMIN.
12. **Pronto:** checks verdes e sem perda de dados em erro esperado.
13. **Relatório:** fluxo, arquivos, matriz de permissão, checks/dívidas.
14. **Passagem:** fluxo núcleo aprovado → PROMPT 08.
15. **Commit:** `feat(core): add client project delivery task workflow`.

### PROMPT 08 — Meu Trabalho

1. **Papel:** frontend/backend engineer orientado a produtividade pessoal.
2. **Contexto:** tela responde “o que preciso fazer agora?” sem duplicar tarefas. Leia protótipo e regra de grupos.
3. **Pré-condições:** tarefas atribuíveis e seed presentes.
4. **Objetivo:** agregar tarefas da pessoa autenticada em Atrasadas, Hoje, Próximas e Aguardando aprovação.
5. **Incluído:** query tenant+assignee; definição documentada de hoje/timezone e próxima janela; cards/linhas com contexto; filtros enxutos; estados; links para tarefa/entrega.
6. **Fora:** preferências salvas, calendário, views customizadas.
7. **Arquivos:** rota Meu Trabalho, serviço/query e testes.
8. **Regras:** grupo determinístico, sem duplicação ambígua; ordem por urgência; acessível/mobile.
9. **Procedimento:** testes de fronteira de data → query → UI → estados → diff.
10. **Verificações:** unidade de agrupamento/timezone, integração tenant, lint/types/build, revisão 390 px.
11. **Aceitação:** seed aparece nos grupos esperados; tarefa de outro usuário/workspace não aparece; vazio orienta ação.
12. **Pronto:** testes de meia-noite/prazo verdes.
13. **Relatório:** regras, evidências, checks e riscos.
14. **Passagem:** PROMPT 09.
15. **Commit:** `feat(my-work): add prioritized personal task view`.

### PROMPT 09 — Projeto: visão geral, Kanban e Lista

1. **Papel:** product engineer de gestão de projetos.
2. **Contexto:** três views, uma fonte. Status fixos; bloqueio adicional. Leia protótipo aprovado.
3. **Pré-condições:** núcleo/Meu Trabalho verdes.
4. **Objetivo:** responder “como está este projeto?” sem duplicação de dados.
5. **Incluído:** overview curto; tabs acessíveis; Kanban quatro colunas; mudança de status por menu/controle teclado; Lista densa; filtros responsável/status/prioridade/prazo/bloqueio; drawer de tarefa; estados.
6. **Fora:** workflow customizado, WIP, persistência de filtros, DnD obrigatório.
7. **Arquivos:** rota projeto, componentes/query/testes.
8. **Regras:** URL/filtros previsíveis; mesma query/fonte; status alterado reflete em ambas; mobile sem quadro horizontal inutilizável.
9. **Procedimento:** centralize query → overview/lista → kanban → interação acessível → testes.
10. **Verificações:** unit/UI/integration, lint/types/build; 1440/768/390; teclado.
11. **Aceitação:** contagens iguais, filtros coerentes, sem duplicar task record, mudança auditada.
12. **Pronto:** views consistentes e checks verdes.
13. **Relatório:** prova da fonte única, arquivos/checks/dívidas.
14. **Passagem:** PROMPT 10.
15. **Commit:** `feat(project): add overview board and list views`.

### PROMPT 10 — Painel e Central de Atenção

1. **Papel:** engenheiro de regras de domínio e UX operacional.
2. **Contexto:** Painel responde “onde preciso agir?” com exceções explicáveis, não gráficos. Leia briefing/seed/protótipo.
3. **Pré-condições:** datas/status/bloqueios/last activity confiáveis.
4. **Objetivo:** implementar as seis regras determinísticas e o painel acionável.
5. **Incluído:** funções puras para crítico (tarefa atrasada bloqueia entrega), risco (entrega ≤3 dias com pendências; projeto ≥7 dias sem atualização), atenção (aprovação pendente por limite documentado; tarefa bloqueada), informação (entrega importante próxima); prioridade/deduplicação; cards com explicação/link; contagens semanais; estados e permissão gestor.
6. **Fora:** ML/IA, score opaco, gráficos/configuração, alertas persistidos.
7. **Arquivos:** `attention/**`, painel e testes/tabela de decisão.
8. **Regras:** relógio injetável, timezone explícito, bordas testadas, somente dados autorizados.
9. **Procedimento:** tabela de decisão → testes red/green → projeção/query → UI → seed coverage.
10. **Verificações:** testes unitários por regra/borda, integração tenant, lint/types/build e inspeção seed.
11. **Aceitação:** cada alerta diz por quê e leva ao item; todos níveis aparecem no seed; concluído saudável não alerta indevidamente.
12. **Pronto:** 100% das regras/limites cobertos por casos positivos e negativos.
13. **Relatório:** tabela de regras, evidências, checks e ambiguidades resolvidas.
14. **Passagem:** PROMPT 11.
15. **Commit:** `feat(attention): add explainable operation alerts`.

### PROMPT 11 — Aprovações e colaboração mínima

1. **Papel:** full-stack engineer de workflows auditáveis.
2. **Contexto:** aprovação é interna; sem portal/convites/comentários. `TaskUpdate` curta é a colaboração mínima.
3. **Pré-condições:** entregas/tarefas/painel funcionando.
4. **Objetivo:** fechar o fluxo dourado com atualização e decisão de aprovação seguras.
5. **Incluído:** solicitar/aprovar/rejeitar/resetar conforme política; nota curta; lista Aprovações; task updates append-only; auditoria; confirmar ações; reflexo em Meu Trabalho/Central; estados.
6. **Fora:** e-mail, cliente externo, threads/mentions/anexos, delete/edição de histórico.
7. **Arquivos:** módulos/rotas approvals e updates, integração com telas, testes.
8. **Regras:** papel e membership server-side; transição válida; uma aprovação ativa; limites de texto; HTML não confiável nunca renderizado.
9. **Procedimento:** máquina de estados/testes → serviços → UI → integração de alertas → diff.
10. **Verificações:** unidade/transições, integração/IDOR, UI, lint/types/build e fluxo manual.
11. **Aceitação:** decisão auditada; membro não autorizado negado; aprovação altera projeções corretamente.
12. **Pronto:** fluxo dourado núcleo completo e verde.
13. **Relatório:** transições/permissões, checks e dívida pós-deploy.
14. **Passagem:** escolha humana: PROMPT 12 se agente ainda couber; senão pule para 13.
15. **Commit:** `feat(approvals): complete internal review workflow`.

### PROMPT 12 — Agente gratuito por regras (opcional)

1. **Papel:** engenheiro de comandos seguros, sem LLM.
2. **Contexto:** fase opcional; nenhuma API paga. Agente consulta e prepara criação/edição, nunca exclui; mutação exige prévia, confirmação, autorização e auditoria.
3. **Pré-condições:** núcleo estável; decisão explícita de executar esta fase. Se prazo/qualidade ameaçados, documente adiamento e pare.
4. **Objetivo:** provar um assistente determinístico seguro com poucas intenções.
5. **Incluído:** intenções “mostrar atrasos/projetos em risco”, “criar tarefa”, “editar status/prazo”; parser restrito; desambiguação; preview imutável/expirável; confirmação server-side; drawer/chat simples; testes de abuso.
6. **Fora:** texto livre irrestrito, LLM/BYOK, exclusão, execução autônoma, automações.
7. **Arquivos:** `src/modules/agent/**`, UI, testes e doc de gramática.
8. **Regras:** allowlist; revalidar sessão/papel/tenant na confirmação; preview não concede autoridade; auditoria de toda mutação; sem segredo.
9. **Procedimento:** gramática/ameaças → testes → consultas → preview → confirmação → UI.
10. **Verificações:** parser unitário, integração cross-tenant/sem confirmação/preview adulterado/expirado, lint/types/build.
11. **Aceitação:** comandos conhecidos previsíveis; ambiguidade não muta; agente não contém caminho de delete.
12. **Pronto:** segurança negativa verde; caso contrário desative e documente.
13. **Relatório:** comandos, limites, checks, decisão manter/remover.
14. **Passagem:** PROMPT 13, mesmo se esta fase for pulada.
15. **Commit:** `feat(agent): add confirmed rule-based commands`.

### PROMPT 13 — Responsividade, acessibilidade, estados e polimento

1. **Papel:** especialista em QA visual e acessibilidade web.
2. **Contexto:** compare aplicação com protótipos/design system; todas as dez telas e estados importam.
3. **Pré-condições:** fluxo núcleo completo; agente opcional resolvido.
4. **Objetivo:** remover inconsistências e tornar o app demonstrável em desktop/mobile/teclado.
5. **Incluído:** 1440/768/390, zoom 200%, teclado/foco/labels/landmarks/contraste/erros/live regions/reduced motion; loading/empty/error/permission/not-found; touch targets; performance visual; correções P0/P1.
6. **Fora:** features, redesign, animação ornamental.
7. **Arquivos:** UI/estilos/testes e `docs/quality/accessibility-review.md`.
8. **Regras:** preserve linguagem visual; conteúdo não some só por breakpoint; tabela/kanban têm alternativa utilizável.
9. **Procedimento:** matriz tela×estado×viewport → auditoria → correções → reteste → diff.
10. **Verificações:** lint/types/UI/build, Playwright smoke, teclado manual e screenshots.
11. **Aceitação:** zero P0/P1, sem overflow crítico, foco não oculto, erros associados, reduced motion eficaz.
12. **Pronto:** P2 restante explicitamente aceito/documentado.
13. **Relatório:** matriz, antes/depois, checks e riscos.
14. **Passagem:** aprovação visual humana → PROMPT 14.
15. **Commit:** `fix(ui): complete responsive accessibility polish`.

### PROMPT 14 — Testes, segurança e gate de qualidade

1. **Papel:** QA/security engineer pragmático.
2. **Contexto:** projeto público de portfólio, sem alegação de conformidade. Leia ameaças, ADRs e código; não implemente features.
3. **Pré-condições:** app funcional e revisão visual concluída.
4. **Objetivo:** obter evidência proporcional de release e corrigir falhas reais.
5. **Incluído:** unit domain/attention; integration Auth/RBAC/tenant; banco limpo; UI formulários/estados; E2E login→hierarquia→update→alerta→aprovação; secret/dependency audit não destrutiva; headers/cookies/erros; relatório.
6. **Fora:** pentest externo, serviço pago, `audit fix --force`, refactor amplo.
7. **Arquivos:** testes/fixtures/configs e `docs/quality/release-gate.md`; correções mínimas.
8. **Regras:** dois tenants reais em testes; service key jamais no browser; logs sem dados sensíveis; rate limit só se risco/implementação local justificarem.
9. **Procedimento:** inventário → matriz de ameaças → testes → corrigir por severidade → suíte completa em estado limpo.
10. **Verificações:** format check, lint, typecheck, unit, integration, E2E, build, migration/seed clean, dependency/secret scan.
11. **Aceitação:** todos verdes; negativos exigidos cobertos; nenhuma vulnerabilidade alta conhecida explorável no escopo.
12. **Pronto:** falha flakey é falha; documente limitação, não masque.
13. **Relatório:** comandos/resultados, cobertura por risco, correções e bloqueadores.
14. **Passagem:** gate verde → PROMPT 15; falha → permaneça em 14.
15. **Commit:** `test: complete workflow release quality gate`.

### PROMPT 15 — Seed e experiência do recrutador

1. **Papel:** product engineer de demonstrações.
2. **Contexto:** recrutador deve entender o valor em minutos sem configurar agência real. Dados são fictícios e resetáveis.
3. **Pré-condições:** gate 14 verde.
4. **Objetivo:** tornar a demo convincente, segura e repetível.
5. **Incluído:** Agência Aurora, papéis, vários clientes/projetos/entregas/tarefas; todos alertas e item saudável; acesso demo limitado; estratégia manual/automática de reset; roteiro ensaiável; empty state separado; validação idempotente.
6. **Fora:** PII, admin compartilhado fraco, dados de produção, analytics externo.
7. **Arquivos:** seed/fixtures/scripts, `docs/demo/demo-data.md`, `demo-script.md`.
8. **Regras:** IDs estáveis; senha só via secret/env; conta demo com menor privilégio e superfície de vandalismo limitada; reset documentado.
9. **Procedimento:** limpar → migrar → seed duas vezes → executar fluxo → reset → reexecutar.
10. **Verificações:** suíte/build, seed hash/contagens, E2E dourado e cronômetro 3–5 min.
11. **Aceitação:** seis gatilhos visíveis; fluxo não depende de improviso; reset recupera estado; nenhuma credencial sensível no Git.
12. **Pronto:** demo local reproduzível por terceiro.
13. **Relatório:** personagens/dados, acesso/reset, tempo e riscos.
14. **Passagem:** com ensaio aprovado, peça autorização externa e então PROMPT 16.
15. **Commit:** `feat(demo): add safe recruiter-ready dataset`.

### PROMPT 16 — CI/CD e deploy gratuito

1. **Papel:** engenheiro de release/cloud econômico.
2. **Contexto:** orçamento zero, URL gratuita, Vercel Hobby + Supabase Free principal; revalidar fontes oficiais no dia. Ações externas exigem autorização.
3. **Pré-condições:** gate 14 e demo 15 verdes; usuário autorizou criar/configurar recursos e push/deploy específicos; contas disponíveis. Sem autorização, faça somente arquivos locais e instruções.
4. **Objetivo:** publicar com pipeline seguro e rollback simples.
5. **Incluído:** GitHub Actions lint/types/tests/build; env de produção; migrations controladas; integração Vercel; domínio plataforma; smoke; logs; rollback por redeploy de commit+migration forward; limites/alternativa documentados.
6. **Fora:** domínio pago, cartão, paid add-on, DNS, escala fictícia, segredo em CI log.
7. **Arquivos:** `.github/workflows/**`, configs e `docs/deployment.md`; mudanças externas somente aprovadas.
8. **Regras:** least privilege; ambientes separados; preview não usa produção se evitável; branch deploy só após checks; revalidar free tier e registrar data/links.
9. **Procedimento:** revalidar preços → preparar local → usuário autoriza → configurar secrets → migrar → deploy → smoke → testar rollback documental.
10. **Verificações:** CI completa, build prod, URL/login/fluxo smoke/mobile, headers, logs sem segredo.
11. **Aceitação:** URL pública gratuita funcional; CI bloqueia falhas; custo projetado R$0; alternativa registrada.
12. **Pronto:** não invente resultado externo; se conta/limite bloquear, entregue passos exatos e mantenha como bloqueador.
13. **Relatório:** URL, run/commit, recursos/cotas, env names, smoke, rollback e riscos.
14. **Passagem:** URL e smoke verdes → PROMPT 17.
15. **Commit:** `ci: add free-tier deployment pipeline`; push só autorizado.

### PROMPT 17 — Documentação e case de portfólio

1. **Papel:** technical writer e engenheiro de developer experience.
2. **Contexto:** documente o produto real, não promessas. Leia código, ADRs, URL, testes e pesquisa de custo.
3. **Pré-condições:** deploy/smoke ou bloqueador externo precisamente documentado.
4. **Objetivo:** permitir que recrutador use, avalie e reproduza o projeto.
5. **Incluído:** README com visão/personas/features/stack/arquitetura/modelo/segurança/setup/env/migrations/seed/testes/deploy/screenshots/limites/próximos passos; ADRs atualizados; case study; roteiro com falas/cliques; materiais/URL/demo; screenshots otimizadas e alt text.
6. **Fora:** alegações de usuários/escala/conformidade inexistentes, marketing enganoso, feature nova.
7. **Arquivos:** `README.md`, `docs/**`, screenshots; preserve histórico/fontes.
8. **Regras:** comandos copiáveis, segredos fictícios, limites gratuitos com data/links, arquitetura simples e trade-offs honestos.
9. **Procedimento:** verificar do zero → escrever → executar cada comando → revisar links/imagens → diff.
10. **Verificações:** link check manual, setup em ambiente limpo quando possível, suíte/build e roteiro 3–5 min.
11. **Aceitação:** terceiro consegue rodar; URL/demo claras; evidências cobrem produto/full-stack/segurança/qualidade/DevOps.
12. **Pronto:** documentação corresponde ao commit/deploy atual.
13. **Relatório:** docs, comandos verificados, materiais faltantes e handoff final.
14. **Passagem:** revisão humana de README/case → PROMPT 18.
15. **Commit:** `docs: complete workflow portfolio handoff`.

### PROMPT 18 — Auditoria final e handoff

1. **Papel:** release manager independente.
2. **Contexto:** audite contra briefing, escopo congelado, design system, ADRs e este plano; não presuma que relatórios anteriores são verdadeiros.
3. **Pré-condições:** app, testes, demo, deploy e docs completos ou bloqueadores explícitos.
4. **Objetivo:** decidir objetivamente “pronto para portfólio” ou “não pronto”.
5. **Incluído:** checklist mestre; fluxo dourado local/público; tela×estado×viewport; matriz ameaça/teste; clean clone/setup; CI/deploy/free tier; docs/links; diff/status; inventário de dívida.
6. **Fora:** nova feature, refactor cosmético, expansão de escopo.
7. **Arquivos:** `docs/release/final-audit.md`; somente correções pequenas e claramente necessárias.
8. **Regras:** evidência por item; severidade P0–P3; P0/P1 bloqueiam; não esconder falha.
9. **Procedimento:** auditar de fontes → executar checks → reproduzir demo → verificar público → registrar decisão e próximos passos.
10. **Verificações:** instalação limpa, migration/seed, format/lint/types/unit/integration/E2E/build, smoke URL, teclado e 1440/768/390.
11. **Aceitação:** Agora completo; Fora ausente; design fiel; segurança negativa verde; custo zero documentado; recrutador consegue reproduzir.
12. **Pronto:** decisão `GO` somente sem P0/P1 e com URL/docs válidas.
13. **Relatório:** decisão, evidências, arquivos/commits/URL, riscos, dívida priorizada e instrução de manutenção.
14. **Passagem:** `GO` encerra; `NO-GO` retorna ao prompt responsável pelo bloqueio, depois repete 18.
15. **Commit:** `docs: record final portfolio release audit`; sem push/rewrite não autorizado.

## 7. Matriz de cobertura

| Área | Prompts principais |
|---|---|
| Produto/escopo/domínio | 00, 07–11, 15, 18 |
| Visual/design system | 01, 02, 06, 13, 18 |
| Segurança/multi-tenancy | 00, 04, 05, 07, 10–12, 14, 16, 18 |
| Testes/qualidade | 03–15, 18 |
| Dados demo | 04, 10, 15, 18 |
| Acessibilidade | 01, 02, 06–13, 18 |
| Responsividade | 01, 02, 06–13, 17, 18 |
| Git | 00, 03 e commit de todos os prompts; 16–18 |
| CI/CD/deploy/custo | 00, 03, 14–16, 18 |
| Documentação/portfólio | 00, 15–18 |
| Agente por regras | 00, 05, 12, 14, 18 (opcional) |

## 8. Checklist mestre de conclusão

- [ ] Escopo Agora/Depois/Fora aprovado e ADRs coerentes.
- [ ] Dez protótipos HTML independentes aprovados antes do app.
- [ ] Aplicação única instala e compila do zero com lockfile.
- [ ] Auth real, RBAC server-side, `workspaceId` em toda consulta e RLS testada.
- [ ] Cliente→Projeto→Entrega→Tarefa e aprovação funcionam; Entrega é entidade própria.
- [ ] Meu Trabalho e Projeto respondem às perguntas centrais; Kanban/Lista compartilham dados.
- [ ] Seis regras de atenção são explicáveis e têm testes positivos/negativos.
- [ ] Loading/vazio/erro/sem permissão/not-found são seguros e úteis.
- [ ] Teclado, foco, labels, landmarks, contraste, mensagens e reduced motion revisados.
- [ ] 1440, 768 e 390 px sem regressão crítica.
- [ ] Migrações e seed idempotente passam em banco limpo.
- [ ] Unitários, integração multi-tenant, UI, E2E, lint, types e build estão verdes.
- [ ] Nenhum segredo/PII/serviço pago; custo e limites revalidados.
- [ ] Demo limitada/resetável e fluxo de 3–5 minutos ensaiado.
- [ ] CI protege release; URL gratuita passa smoke; rollback documentado.
- [ ] README, ADRs, case, screenshots, roteiro e limitações correspondem ao deploy.
- [ ] Auditoria final resulta em `GO`, sem P0/P1.

## 9. Roteiro para o usuário

1. **Envie o PROMPT 00.** Confira se ele leu fontes reais, preservou arquivos e congelou o menor MVP. Só diga “escopo aprovado” se Agora/Depois/Fora, telas, stack e ameaças estiverem corretos.
2. **Envie o PROMPT 01.** Abra todos os dez `index.html`, percorra o fluxo e observe 1440/768/390. Não permita que o agente crie Next.js ainda.
3. **Envie o PROMPT 02.** Confira o relatório, as correções e navegue por teclado. Só então diga literalmente **“protótipos aprovados”**.
4. **Envie os PROMPTS 03 a 11, um por vez.** Em cada resposta, confira arquivos alterados, comandos realmente executados, testes verdes, riscos e o commit sugerido. Se qualquer gate falhar, repita o mesmo prompt com a correção; não avance.
5. **No gate do PROMPT 12**, decida pelo prazo. Execute o agente por regras apenas se o núcleo estiver estável; pular esta fase não impede o portfólio.
6. **Envie o PROMPT 13** e faça a aprovação humana visual/acessível. Problemas P0/P1 bloqueiam o PROMPT 14.
7. **Envie os PROMPTS 14 e 15.** Exija a suíte completa verde e ensaie o roteiro em 3–5 minutos. Não aceite credencial fraca versionada.
8. **Antes do PROMPT 16**, dê autorização explícita e limitada para contas cloud, secrets, push e deploy que você realmente quer permitir. Confira novamente R$0, cotas e URL gratuita.
9. **Envie o PROMPT 17**, confira cada comando do README, URL, screenshots e ausência de alegações fictícias.
10. **Envie o PROMPT 18.** Publique no portfólio apenas com decisão `GO`. Em `NO-GO`, volte ao prompt indicado, corrija e repita a auditoria.
