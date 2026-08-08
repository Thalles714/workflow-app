# Referências estruturais: Asana, Jira e monday.com

**Objetivo.** Registrar padrões de estrutura de produto — não referências visuais — que podem orientar o Workflow, um sistema operacional interno para agências de marketing e design. A pesquisa usa somente documentação e páginas oficiais dos produtos.

**Decisão de aplicação.** O Workflow não deve copiar a amplitude dessas plataformas. Ele adota padrões comprovados para responder, com poucos caminhos, a três perguntas: **o que preciso fazer?**, **onde preciso agir?** e **como está este projeto?**.

## Síntese recomendada para o Workflow

| Necessidade do Workflow | Padrão de referência | Aplicação no MVP |
| --- | --- | --- |
| Execução individual | Asana agrega tarefas atribuídas em todos os projetos em *My tasks*. | **Meu Trabalho**: tarefas da pessoa divididas em Atrasadas, Hoje, Próximas e Aguardando aprovação. |
| Gestão transversal | Portfólios e dashboards do Asana; dashboards do Jira; dashboards multi-boards do monday. | **Painel da Operação** por agência, priorizando exceções (atraso, bloqueio, aprovação pendente e risco) em vez de gráficos configuráveis. |
| Organização de um projeto | Asana alterna list/board; Jira trata o board como representação do fluxo; monday oferece views sobre o mesmo board. | **Projeto** tem uma fonte de dados e abas **Visão geral / Kanban / Lista**. Kanban e Lista não são módulos distintos. |
| Fluxo e gargalos | Jira usa estados explícitos e torna o trabalho em andamento visível. | Estados fixos: A fazer, Em andamento, Em revisão e Concluída; bloqueio como sinal explícito. Sem configuração de WIP no MVP. |
| Operação repetível | Templates e automações das três plataformas. | Poucos modelos iniciais de projeto; modelos próprios e automações avançadas ficam fora do MVP. |
| IA segura | Automação do Jira registra ator, condições e ações; Asana e monday incorporam IA ao fluxo de trabalho. | Agente contextual: **prompt → prévia → confirmação → criação/edição → registro de auditoria**. Respeita permissões e nunca exclui dados. |

## Asana

### Estruturas observadas

- **Trabalho pessoal consolidado.** *My Tasks* reúne tarefas atribuídas à pessoa em todos os projetos e pode ser organizado por data, prioridade ou status. Este é o modelo mais próximo para a tela **Meu Trabalho** do Workflow. [Guia rápido do Asana](https://help.asana.com/s/article/quick-start-guide-to-asana) · [Produtividade com My Tasks](https://help.asana.com/s/article/maximize-productivity-with-my-tasks?language=en_US)
- **Um projeto, múltiplas representações.** Um projeto pode ter diversas views; a Lista favorece leitura de detalhes e prazos, enquanto o Board mostra cartões em colunas e torna a mudança de estágio direta. [Criar e organizar projetos](https://help.asana.com/s/article/create-projects-in-asana?language=en-US) · [Project views](https://asana.com/features/project-management/project-views)
- **Visão de conjunto acima de projetos.** Portfólios permitem acompanhar saúde, dono, datas e progresso entre projetos; dashboards agregam métricas atualizadas. [Monitorar iniciativas com portfolios e dashboards](https://help.asana.com/s/article/monitor-initiatives-and-manage-resources-with-portfolios) · [Portfolio progress and reporting](https://help.asana.com/s/article/portfolio-progress-and-reporting)
- **Automação como camada sobre o dado único.** Regras podem atribuir, ajustar prazos e notificar, mantendo as mudanças visíveis nos contextos onde a tarefa aparece. [Project management no Asana](https://asana.com/uses/project-management)

### Transferência deliberada

Adotar a consolidação individual, as views do mesmo dado e a leitura transversal de saúde. Não implementar, no MVP, calendário, carga de trabalho, portfólio configurável, painéis universais ou campos personalizados.

## Jira / Atlassian

### Estruturas observadas

- **Board como view do fluxo, não como o próprio domínio.** Um *space* reúne itens para um objetivo, e o board acompanha o fluxo da criação à conclusão. O Kanban usa colunas para explicitar estados e tornar gargalos observáveis. [Boards overview](https://www.atlassian.com/software/jira/guides/boards/overview) · [Kanban boards](https://www.atlassian.com/software/jira/features/kanban-boards)
- **Dashboard com escopo e permissões.** O dashboard pode consolidar espaços e itens pessoais, e seu conteúdo depende do que a pessoa pode visualizar. [What is a Jira dashboard?](https://support.atlassian.com/jira-software-cloud/docs/what-is-a-jira-dashboard/)
- **Automação auditável.** A estrutura Trigger + Condition + Action, com ator/permissões e log de auditoria, torna automações rastreáveis. [Automation overview](https://www.atlassian.com/software/jira/guides/automation/overview)
- **Insights próximos da execução.** Relatórios podem ajudar a interpretar trabalho no contexto de board e backlog, em vez de existir apenas em um dashboard isolado. [Jira reports](https://www.atlassian.com/software/jira/features/reports)

### Transferência deliberada

Adotar estados claros, bloqueio explícito, permissões por agência e trilha de auditoria do agente. Mostrar alertas também dentro do Projeto e da Entrega, não apenas no Painel. Não implementar JQL, múltiplos boards transversais, limites de WIP configuráveis, workflow livre ou construtor de automações.

## monday.com

### Estruturas observadas

- **Workspace único para operação diária.** O produto organiza o trabalho em uma estrutura capaz de acompanhar atividades do dia a dia e processos repetíveis. Views permitem observar o mesmo board para execução, planejamento ou revisão. [Get started with monday work management](https://support.monday.com/hc/en-us/articles/115005305649-Get-started-with-monday-work-management)
- **Views e dashboards como leitura, não duplicação.** A documentação de views orienta consolidar dados de múltiplos boards em dashboards; também descreve dashboard criado por prompt de IA. [Board views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- **Templates e automação para escala.** O posicionamento oficial inclui workspace centralizado, templates e automações para trabalho repetitivo. [monday work management](https://monday.com/work)
- **Visibilidade multi-projeto para decisão.** O produto descreve relatórios em nível de portfólio e dashboards para visão consolidada. [PMO mobile](https://monday.com/work-management/pmo-mobile)

### Transferência deliberada

Adotar a ideia de dados operacionais centralizados e IA contextual, mas manter a superfície do MVP estreita: templates pré-configurados, três telas principais e nenhum construtor de views, integrações ou dashboards personalizados.

## Limites que preservam o foco do MVP

- Não reproduzir um ERP, ClickUp ou monday completo.
- Não incluir calendário, timeline/Gantt, timesheet, relatórios avançados, dashboards customizáveis, portal do cliente ou construtor de automações.
- Não usar IA para inferências opacas no cálculo de risco. A Central de Atenção parte de regras auditáveis: atraso, vencimento próximo, projeto sem atualização, bloqueio e aprovação pendente.
- Não permitir exclusão pelo agente; criações e edições exigem prévia e confirmação, salvo automações explicitamente autorizadas em plano futuro.

## Fontes oficiais consultadas

- Asana Help Center e páginas oficiais: [My Tasks](https://help.asana.com/s/article/maximize-productivity-with-my-tasks?language=en_US), [Projects](https://help.asana.com/s/article/create-projects-in-asana?language=en-US), [Portfolios](https://help.asana.com/s/article/monitor-initiatives-and-manage-resources-with-portfolios), [Reporting](https://help.asana.com/s/article/reporting-with-dashboards?language=en-US).
- Atlassian / Jira oficiais: [Boards](https://www.atlassian.com/software/jira/guides/boards/overview), [Kanban](https://www.atlassian.com/software/jira/features/kanban-boards), [Dashboards](https://support.atlassian.com/jira-software-cloud/docs/what-is-a-jira-dashboard/), [Automation](https://www.atlassian.com/software/jira/guides/automation/overview).
- monday.com oficiais: [Work Management](https://support.monday.com/hc/en-us/articles/115005305649-Get-started-with-monday-work-management), [Board views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views), [monday work](https://monday.com/work).
