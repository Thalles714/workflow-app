# Escopo congelado do MVP — Workflow

> Status: aprovado tecnicamente, aguardando aprovação humana do escopo
>
> Data: 07 de agosto de 2026
>
> Fonte de produto: [`../project/briefing.md`](../project/briefing.md)
>
> Fonte visual: `../../assets/design_system/design_system.html`

## 1. Decisão de produto

Workflow é um sistema operacional de entregas para pequenas agências de marketing e design, com 3 a 30 pessoas. A demonstração deve provar que um gestor consegue ver a operação e agir sobre exceções antes que virem problemas, enquanto cada membro encontra o trabalho que precisa executar agora.

O primeiro deploy é um projeto pessoal de portfólio, não um serviço comercial. O sucesso desta versão é um fluxo full-stack convincente, seguro, reproduzível e demonstrável em 3–5 minutos, não amplitude funcional nem escala fictícia.

### Perguntas que o produto deve responder

1. **Meu Trabalho:** o que preciso fazer agora?
2. **Painel da Operação / Central de Atenção:** onde preciso agir?
3. **Projeto:** como está este projeto?

## 2. Linguagem de domínio congelada

| Termo canônico | Definição | Evitar |
|---|---|---|
| Workspace | Espaço isolado de uma agência, seus membros e dados. É a fronteira de tenant. | Agência como nome técnico, conta |
| Usuário | Pessoa autenticada, independente dos workspaces aos quais pertence. | Membro como sinônimo |
| Membro | Vínculo de um Usuário com um Workspace e seu papel naquele espaço. | Usuário como vínculo |
| Cliente | Organização atendida pela agência. | Conta, lead, contato |
| Projeto | Trabalho contratado ou campanha de um Cliente que reúne Entregas. | Board, campanha como entidade paralela |
| Entrega | Resultado relevante para o Cliente, composto por Tarefas e sujeito a prazo e aprovação interna. | Tarefa especial, épico |
| Tarefa | Unidade executável de trabalho pertencente a uma Entrega. | Entrega |
| Atualização de tarefa | Registro textual curto e imutável de contexto ou progresso em uma Tarefa. | Comentário/thread no MVP |
| Aprovação | Decisão interna sobre uma Entrega. | Aprovação do cliente/portal externo |
| Alerta | Projeção determinística e explicável de uma condição operacional que exige atenção. | Score de IA, risco persistido |
| Bloqueio | Sinal adicional de uma Tarefa, com motivo obrigatório; não é status. | Coluna/status “Bloqueada” |
| Arquivamento | Remoção reversível de um registro das visões ativas. | Exclusão física |

### Relações e invariantes

```text
Workspace
├── Membership ── User
└── Client
    └── Project
        └── Deliverable
            ├── Task
            │   └── TaskUpdate
            └── Approval
```

- Entrega é entidade própria; Tarefa nunca substitui Entrega.
- Kanban e Lista são duas visualizações das mesmas Tarefas.
- Toda entidade operacional pertence a exatamente um Workspace.
- Um Membro tem papel `ADMIN` ou `MEMBER` por Workspace.
- Status de Tarefa é exatamente `A fazer`, `Em andamento`, `Em revisão` ou `Concluída`.
- Uma Tarefa bloqueada tem motivo não vazio; Bloqueio não altera seu status.
- Aprovação é interna e pertence a uma Entrega.
- Alerta é calculado sob demanda a partir da fonte de dados; não é editável nem persistido no MVP.

### Cenários-limite resolvidos

| Cenário | Decisão |
|---|---|
| Usuário pertence a dois workspaces | Cada requisição resolve uma membership válida; dados nunca se misturam. O workspace ativo não concede acesso por si só. |
| ID válido de outro workspace enviado pela URL/formulário | Retornar resposta segura de não encontrado/sem acesso; nunca revelar existência. |
| Projeto e Cliente têm workspaces diferentes | A operação é rejeitada no servidor e protegida também por FK/política de banco quando possível. |
| Tarefa marcada bloqueada sem motivo | Validação rejeita a mutação. |
| Entrega concluída ainda tem tarefa pendente | Transição é rejeitada até a pendência ser resolvida ou regra explícita futura existir. |
| Aprovação já decidida recebe nova decisão | Requer transição explícita de reabertura por ADMIN; não sobrescreve silenciosamente o histórico. |
| Uma tarefa cabe em dois grupos de Meu Trabalho | Há precedência determinística; cada tarefa aparece uma vez. Aprovação pendente é contexto da entrega, não cópia da tarefa. |
| Projeto sem atividade exatamente há 7 dias | Entra em risco em `>= 7 dias`, usando relógio injetável e timezone do workspace. |
| Entrega vence exatamente em 3 dias | Entra em risco se tiver tarefa pendente. |

## 3. Agora / Depois / Fora

| Agora — obrigatório para o primeiro deploy | Depois — opcional após o deploy | Fora do portfólio |
|---|---|---|
| Login real por Supabase Auth com acesso demo limitado | Agente por regras e intenções conhecidas | Pagamentos e assinaturas |
| Workspace seed e papéis ADMIN/MEMBER | Convites reais e e-mail transacional | CRM, financeiro, RH, contratos, timesheets |
| Clientes, Projetos, Entregas e Tarefas | Comentários completos, threads e menções | Portal do cliente |
| Responsável, prazo, prioridade, status e bloqueio | Templates de projeto próprios | Calendário, Gantt/timeline |
| Atualização textual curta e imutável da Tarefa | Reset agendado do seed | Dashboards configuráveis e relatórios avançados |
| Meu Trabalho com grupos determinísticos | Drag-and-drop acessível no Kanban | Integrações externas e storage de arquivos |
| Projeto: visão geral, Kanban e Lista | GIF/vídeo adicional de demonstração | Campos e workflows customizáveis |
| Painel da Operação e seis regras explicáveis | Políticas/termos se um piloto real começar | IA generativa e automações autônomas |
| Aprovações internas | BYOK de IA, somente após novo threat model | Realtime, filas, Redis, microserviços |
| Auditoria de ações relevantes |  | Analytics/observabilidade SaaS pagos |
| Estados, responsividade e acessibilidade |  | Exclusão física no CRUD demonstrável |
| Testes, CI, seed, documentação e deploy gratuito |  |  |

### Decisões de redução de escopo

- **Convites:** Depois. Membros seed demonstram RBAC sem custo, e-mail, abuso ou conta externa adicional.
- **Comentários:** Depois. `TaskUpdate` imutável prova colaboração e histórico com menos superfície de produto e segurança.
- **Templates:** Depois. O seed já demonstra repetibilidade; CRUD de templates não fortalece o fluxo dourado.
- **Agente por regras:** Depois/opcional. Só entra se o núcleo já estiver publicado e estável; nunca bloqueia o portfólio.
- **Drag-and-drop:** não obrigatório. Mudança de status por controle acessível é suficiente; DnD só entra depois sem remover teclado.
- **Monorepo/Turborepo:** removido. Há uma aplicação e nenhum pacote independente que justifique coordenação adicional.
- **Prisma:** removido da escolha principal. Migrações SQL e cliente Supabase preservam RLS, reduzem pooling e eliminam uma camada no MVP.
- **Docker Compose:** não é requisito de produto. Supabase CLI pode fornecer o ambiente local; uma alternativa documentada deve existir se o runtime local não suportá-lo.

## 4. Fluxo dourado

1. Recrutador abre a URL gratuita e entra pelo acesso demo.
2. A sessão resolve o Workspace fictício **Agência Aurora** e uma membership válida.
3. Em Clientes, abre **Órbita** e o Projeto **Lançamento Q3**.
4. Na Entrega **Landing page**, abre a Tarefa **Revisar formulário**.
5. Adiciona uma atualização curta e marca a Tarefa como bloqueada com motivo explícito.
6. Volta ao Painel da Operação e encontra um alerta crítico com regra e link para o item.
7. Resolve o impedimento, conclui a Tarefa e observa a atualização das views.
8. Abre Aprovações e aprova internamente a Entrega.
9. Confirma que Meu Trabalho e a Central de Atenção refletem a decisão sem duplicar dados.

O roteiro completo deve durar de 3 a 5 minutos e continuar demonstrável após reset idempotente do seed.

## 5. Telas e estados obrigatórios

| # | Tela | Normal | Loading | Vazio | Erro | Sem permissão / ausente |
|---|---|---|---|---|---|---|
| 1 | Login/demo | formulário e acesso demo | envio desabilitado com feedback | n/a | credencial/configuração segura | sessão inválida retorna ao login |
| 2 | Painel da Operação | métricas enxutas e alertas acionáveis | skeleton estável | operação saudável e próxima ação | retry sem stack trace | MEMBER sem acesso à visão gerencial |
| 3 | Meu Trabalho | quatro grupos priorizados | skeleton | nenhuma tarefa atribuída | retry | sessão inválida |
| 4 | Clientes | lista e criar | skeleton | criar primeiro cliente | retry | ação ADMIN oculta e servidor nega |
| 5 | Cliente | resumo e projetos | skeleton | nenhum projeto | retry | não encontrado/sem acesso indistinguíveis |
| 6 | Projeto | Visão geral/Kanban/Lista e filtros | skeleton por view | sem tarefas e filtros sem resultado | retry | não encontrado/sem acesso |
| 7 | Entrega | resumo, tarefas e aprovação | skeleton | sem tarefas | retry | não encontrado/sem acesso |
| 8 | Tarefa | leitura/criação/edição, bloqueio e updates | salvando/skeleton | updates vazios | validação/conflito/erro | não encontrado/sem acesso |
| 9 | Aprovações | pendentes e decididas | skeleton | nenhuma pendência | retry | papel insuficiente |
| 10 | Acesso negado / não encontrado | mensagem segura e retorno | n/a | n/a | n/a | variante 403/404 sem enumeração |

Cada tela terá um diretório e `index.html` independente no protótipo antes da aplicação. Na aplicação real, drawers podem complementar rotas, mas uma URL recuperável deve existir para Tarefa.

## 6. Central de Atenção congelada

| Severidade | Regra | Limite | Evidência exibida |
|---|---|---|---|
| Crítico | Tarefa atrasada e bloqueada impede Entrega não concluída | `due_date < hoje` | tarefa, atraso, motivo, entrega e ação |
| Risco | Entrega vence em até 3 dias e tem Tarefa pendente | `0–3 dias`, inclusivo | prazo e quantidade pendente |
| Risco | Projeto sem atualização | `>= 7 dias` | última atividade e responsável |
| Atenção | Aprovação pendente envelhecida | `>= 2 dias` | tempo de espera e entrega |
| Atenção | Tarefa bloqueada | imediatamente | motivo, responsável e prazo |
| Informação | Entrega importante próxima, ainda saudável | `4–7 dias`, sem regra superior | prazo e estado saudável |

Regras são funções puras com relógio injetável, limites testados e precedência `Crítico > Risco > Atenção > Informação`. Um mesmo fato não gera cartões redundantes; o alerta mais severo preserva as razões relevantes.

## 7. Critérios de aceitação observáveis

### Produto

- O fluxo dourado completo funciona com seed fictício.
- Entrega e Tarefa aparecem como entidades e URLs/contextos distintos.
- Kanban e Lista refletem imediatamente a mesma alteração de status.
- Meu Trabalho não exibe tarefa de outro usuário nem duplica a mesma tarefa.
- Cada alerta explica a regra e navega ao registro afetado.
- Aprovação interna altera projeções pertinentes e gera auditoria.

### Segurança

- Toda leitura/escrita exige sessão, membership, papel e `workspaceId` resolvidos no servidor.
- IDs de outro workspace, payload inválido e papel insuficiente são negados por testes de integração.
- RLS é defesa adicional testada, não a única autorização.
- Nenhum segredo, senha real, service-role key ou PII entra no Git ou navegador.
- Arquivamento é reversível; nenhuma interface do MVP oferece exclusão física.

### Qualidade e experiência

- Formatação, lint, TypeScript estrito, testes e build de produção passam.
- Migrações e seed passam duas vezes em banco limpo.
- Unitários cobrem regras de atenção e serviços críticos; integração cobre Auth/RBAC/tenancy; E2E cobre o fluxo dourado.
- Todas as telas têm os estados aplicáveis da tabela.
- Teclado, foco, labels, landmarks, contraste, mensagens de erro e reduced motion são revisados.
- 1440, 768 e 390 px não têm overflow ou perda funcional crítica.

### Portfólio e custo

- Aplicação roda localmente por instruções reproduzíveis e está disponível em subdomínio gratuito.
- README, ADRs, modelo, segurança, limitações e roteiro correspondem ao código publicado.
- Nenhuma função essencial exige cartão, trial, API paga ou domínio comprado.
- Free tiers são revalidados antes do deploy; indisponibilidade do Supabase por inatividade faz parte do runbook.

## 8. Dependências e gates

```text
Escopo aprovado
  → protótipos HTML
  → revisão visual + aprovação humana
  → fundação
  → banco/Auth
  → autorização/domínio
  → shell/UI
  → núcleo
  → Meu Trabalho/Projeto/Central/Aprovações
  → polimento
  → gate de qualidade
  → demo
  → autorização externa
  → CI/deploy
  → documentação
  → auditoria GO/NO-GO
```

- Nenhuma aplicação é criada antes de “protótipos aprovados”.
- Nenhum deploy/recurso cloud/push é executado sem autorização explícita.
- Nenhuma fase avança com lint, tipos, testes relevantes ou build quebrados.
- O agente opcional nunca está no caminho crítico.

## 9. Riscos aceitos e mitigação

| Risco | Decisão/mitigação |
|---|---|
| Supabase Free pausa após uma semana inativo | Runbook de reativação e smoke antes de entrevistas; seed/migrations locais reproduzíveis. |
| Sem backup automático no Supabase Free | Seed fictício idempotente e export manual antes de mudança relevante; nenhum dado real. |
| Vercel Hobby é pessoal/não comercial | Projeto permanece portfólio pessoal; Cloudflare é contingência se o uso mudar. |
| Conta demo pública sofrer vandalismo | Menor privilégio, arquivamento reversível, reset e nenhum admin reutilizável fraco. |
| Escopo ainda parecer amplo | Agente/convites/comentários/templates permanecem fora do primeiro deploy; cada fase tem gate. |
| SQL/RLS aumenta responsabilidade manual | Migrações versionadas, testes com dois tenants e ADR explícito. |
| DnD prejudicar teclado/prazo | Controle acessível de status é a solução obrigatória; DnD é posterior. |

## 10. Itens explicitamente não decididos nesta fase

- Credenciais e nomes exatos das contas demo serão definidos na fase de seed sem serem versionados.
- URLs e IDs de projetos cloud só existirão após autorização na fase de deploy.
- A inclusão do agente por regras será decidida depois do núcleo estável.
- Nenhum requisito pós-deploy pode bloquear a definição de pronto acima.
