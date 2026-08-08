# Workflow — Briefing de Produto e Portfólio

> Versão 1.0 · 07 de agosto de 2026
>
> Documento-base para orientar produto, arquitetura, requisitos e desenvolvimento.

## Como usar este documento

Este briefing é a fonte de verdade para o **que** será construído, **para quem**, quais decisões de domínio serão tomadas e quais evidências técnicas o projeto deve oferecer no portfólio. Ele não define a aparência final da aplicação.

O design system, as referências visuais, a identidade, microinterações e animações serão criados em um documento e uma etapa próprios. Quando existirem, deverão respeitar os fluxos, entidades, estados e critérios de acessibilidade definidos aqui, sem ampliar o escopo funcional do MVP por conta própria.

## 1. Visão do produto

**Workflow** é um sistema operacional de entregas para pequenas agências de marketing e design. Ele concentra, em um só lugar, clientes, projetos, entregas, tarefas, responsáveis, prazos e aprovações.

Sua promessa inicial é:

> **Veja tudo que está acontecendo na sua agência e descubra o que precisa da sua atenção antes que vire um problema.**

O produto não começa como ERP, CRM ou ferramenta genérica de tarefas. Ele começa resolvendo a perda de controle da operação diária.

## 2. Público inicial

- **Segmento:** agências de marketing e design.
- **Porte:** equipes de 3 a 30 colaboradores.
- **Persona principal:** dono da agência, diretor de operações ou gestor de projetos.
- **Usuários secundários:** designers, social media, redatores, analistas e demais executores das entregas.
- **Evolução pretendida:** o domínio será generalizável para outras empresas prestadoras de serviço, evitando conceitos exclusivos de marketing no núcleo da aplicação.

## 3. Problema e hipótese

### Cenário atual

Agências trabalham simultaneamente para diversos clientes e distribuem informações entre WhatsApp, planilhas, Drive e ferramentas de tarefas. O gestor precisa perguntar a outras pessoas ou abrir várias ferramentas para saber o andamento da operação.

### Problema prioritário

O gestor não possui uma visão única, confiável e atualizada sobre o que está sendo feito, para qual cliente, por quem, para quando e o que está em risco.

### Hipótese de valor

Se o Workflow centralizar a operação e apontar automaticamente atrasos, bloqueios, aprovações pendentes e entregas em risco, pequenas agências reduzirão a necessidade de acompanhar projetos por mensagens, planilhas e reuniões. Isso tornará o produto parte da rotina diária e criará base para futura validação comercial.

## 4. Fluxo central e modelo de domínio

```text
Agência (workspace)
  └── Cliente
        └── Projeto / Campanha
              └── Entrega
                    └── Tarefa
                          ├── Responsável
                          ├── Prazo
                          ├── Prioridade
                          ├── Status
                          └── Bloqueio (quando existir)
```

### Entidades essenciais

| Entidade            | Responsabilidade                                                            |
| ------------------- | --------------------------------------------------------------------------- |
| Workspace           | Espaço isolado de cada agência; contém equipe, dados e configurações.       |
| Usuário             | Pessoa autenticada que pertence a um ou mais workspaces.                    |
| Membro              | Vínculo do usuário com o workspace e seu papel (administrador ou membro).   |
| Cliente             | Empresa atendida pela agência.                                              |
| Projeto             | Trabalho contratado ou campanha que reúne entregas.                         |
| Entrega             | Resultado relevante para o cliente; possui prazo, responsável e aprovação.  |
| Tarefa              | Unidade executável de trabalho de uma entrega.                              |
| Aprovação           | Registro interno do estado de revisão de uma entrega.                       |
| Alerta              | Item calculado pela Central de Atenção.                                     |
| Template de projeto | Modelo reutilizável de projeto com estrutura inicial de entregas e tarefas. |

**Decisão de domínio:** entrega é uma entidade própria, não uma tarefa especial. Ela permite que o sistema relacione várias tarefas ao resultado que será entregue, meça seu risco e acompanhe sua aprovação.

## 5. Experiência do MVP

### Meu Trabalho — execução individual

Será a tela padrão do membro da equipe. Responde: **“O que preciso fazer agora?”**

Mostra tarefas atribuídas ao usuário em grupos:

- Atrasadas
- Hoje
- Próximas
- Aguardando aprovação

Cada item exibe cliente, projeto, entrega, tarefa, prazo, prioridade e status.

### Painel da Operação — gestão por exceção

É a tela principal do gestor e o diferencial do produto. Responde: **“Onde preciso agir?”**

Mostra, de forma objetiva:

- entregas da semana;
- tarefas atrasadas;
- itens aguardando aprovação;
- projetos em risco;
- uma lista priorizada de situações que exigem atenção.

Não será um dashboard de gráficos decorativos. Seu foco é decisão e ação.

### Projeto — acompanhamento do trabalho

Responde: **“Como está este projeto?”**

O mesmo conjunto de tarefas é apresentado em duas visualizações, sem duplicar o dado:

- **Kanban:** planejamento visual por status;
- **Lista:** consulta e filtros por responsável, status, prioridade e prazo.

### Status de tarefa

- A fazer
- Em andamento
- Em revisão
- Concluída

O sinal **Bloqueada** é adicional ao status e deve explicar impedimentos reais.

### Aprovações

As aprovações serão registradas internamente pela agência. Clientes externos não acessarão o sistema no MVP.

## 6. Central de Atenção

A Central de Atenção transforma os dados operacionais em prioridades. Regras iniciais, transparentes e determinísticas:

| Nível      | Regra                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------- |
| Crítico    | Tarefa atrasada que bloqueia uma entrega.                                                     |
| Risco      | Entrega vence em até 3 dias e possui tarefas pendentes; ou projeto sem atualização há 7 dias. |
| Atenção    | Entrega aguardando aprovação por vários dias; ou tarefa marcada como bloqueada.               |
| Informação | Entrega importante próxima, ainda sem risco.                                                  |

As regras devem ser configuradas como código testável. IA poderá explicá-las e sugerir ações no futuro, mas não substituirá sua lógica inicial.

## 7. Referências de estrutura de produto

Asana, Jira e monday.com são referências funcionais para o Workflow. Elas ajudam a decidir como as informações são agrupadas, encontradas e acionadas. **Não são referência de identidade visual:** cores, tipografia, ilustrações, animações, estilos de cards e demais escolhas estéticas pertencerão ao futuro design system.

### Asana — trabalho pessoal e contexto de projeto

O Workflow adota a ideia de uma visão individual que reúne tarefas atribuídas à pessoa em todos os projetos. A documentação do Asana descreve “My Tasks” como uma lista centralizada de tarefas atribuídas, que pode ser organizada por data, prioridade ou status; o produto também separa o contexto do projeto em uma visão geral. [Asana: quick-start](https://help.asana.com/s/article/quick-start-guide-to-asana) · [Asana: My Tasks](https://help.asana.com/s/article/my-tasks?language=en_US)

**Aplicação no Workflow**

- “Meu Trabalho” agrega tarefas do membro de todos os projetos, sem duplicar tarefas ou exigir que ele navegue projeto a projeto.
- A primeira organização é fixa e fácil de entender: Atrasadas, Hoje, Próximas e Aguardando aprovação. Filtros por prioridade, cliente e projeto podem complementar a tela, sem permitir configurações complexas no MVP.
- Abrir uma tarefa deve preservar o contexto: cliente, projeto, entrega, responsável, prazo, status, bloqueio e histórico de atualizações.
- Todo projeto deve ter uma visão geral curta com objetivo, responsável, prazo, progresso, riscos e últimas atualizações antes de suas visualizações de tarefas.

### Jira — atenção acionável e foco no trabalho

O Jira mostra que quadros ficam mais úteis quando combinam filtros rápidos, campos essenciais nos cards e acesso a detalhes sem perder a lista; seus insights também destacam itens bloqueados, sinalizados e parados como itens que merecem atenção. [Jira: personalização de board](https://support.atlassian.com/jira-software-cloud/docs/customize-your-view-of-the-board-and-backlog/) · [Jira: itens para atenção](https://support.atlassian.com/jira-software-cloud/docs/understand-insights-on-the-board-in-a-team-managed-project/)

**Aplicação no Workflow**

- Kanban e Lista são representações do mesmo conjunto de tarefas do projeto. Trocar de visualização não muda os dados nem cria outro fluxo.
- Cards do Kanban exibem apenas o necessário para decidir: título, prazo, responsável, prioridade e indicador de bloqueio. Detalhes ficam no painel lateral ou página da tarefa.
- Filtros rápidos no projeto: responsável, status, prioridade, prazo e bloqueada. A preferência pessoal de filtro pode ser salva posteriormente; no MVP, os filtros são simples e previsíveis.
- A Central de Atenção deve apontar diretamente para os itens afetados e explicar a regra que gerou o alerta. Um alerta não é um gráfico: é um caminho curto para resolver o problema.
- O Workspace não deve herdar a complexidade configurável do Jira. Não haverá workflows livres, campos personalizados ou dashboards montáveis no MVP.

### monday.com — dados estruturados e visão consolidada

O monday.com organiza o trabalho em estruturas com itens, responsáveis, status, prazos e prioridade; sua visão “My Work” consolida atribuições de vários boards e o dashboard agrega dados de fontes conectadas. [monday: Work Management](https://support.monday.com/hc/en-us/articles/115005305649-Get-started-with-monday-work-management) · [monday: My Work](https://support.monday.com/hc/en-us/articles/360019300579-My-Work) · [monday: Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards)

**Aplicação no Workflow**

- Cada tarefa nasce com campos estruturados mínimos: responsável, prazo, prioridade e status. Esses campos alimentam todas as telas e regras de risco; textos livres não substituem dados operacionais.
- A agregação é calculada a partir da fonte de verdade (clientes, projetos, entregas e tarefas). “Meu Trabalho” e “Painel da Operação” não terão cópias próprias de tarefas.
- O Painel da Operação consolida projetos e entregas, mas usa um conjunto fixo de indicadores e listas de exceção. Widgets configuráveis, dashboards personalizados e dezenas de tipos de visualização ficam fora do MVP.
- Comentários e atualizações devem permanecer ligados à tarefa ou entrega correspondente, preservando o histórico no contexto da decisão.

### Síntese adotada pelo Workflow

| Necessidade do Workflow                          | Referência estrutural                                             | Decisão no MVP                                                                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| “O que preciso fazer agora?”                     | Asana My Tasks + monday My Work                                   | Tela Meu Trabalho consolidada por usuário e prazo.                                                                |
| “Como está este projeto?”                        | Asana Project Overview + Jira Board                               | Visão geral do projeto, seguida de Kanban e Lista sobre a mesma fonte de dados.                                   |
| “Onde preciso agir?”                             | Jira Work items for attention + dashboards consolidados do monday | Painel por exceção, com alertas explicáveis e links diretos para resolver cada problema.                          |
| “Quais dados tornam o acompanhamento confiável?” | Campos de board do monday + cards configuráveis do Jira           | Campos obrigatórios e enxutos: responsável, prazo, prioridade, status e bloqueio.                                 |
| “Como a IA participa?”                           | Assistentes contextualizados nos três produtos                    | Agente limitado a consultar, preparar criação/edição e solicitar confirmação; sem exclusão ou automação autônoma. |

### Limites de inspiração

O Workflow deve aprender com a arquitetura de informação dessas plataformas, não imitá-las. No lançamento, uma agência não precisará configurar boards, widgets, workflows, campos ou dezenas de views para ter valor. O produto entrega um caminho opinativo: cliente → projeto → entrega → tarefa → atenção necessária.

## 8. Agente de operação

O agente é uma interface complementar em linguagem natural para consultar e organizar a operação.

### Regras de segurança e escopo

- Pode **consultar**, **criar** e **editar** clientes, projetos, entregas e tarefas conforme as permissões do usuário.
- Nunca pode excluir dados.
- Toda criação ou edição é apresentada como prévia e requer confirmação explícita do usuário.
- Automações futuras somente executam ações que o administrador autorizar de forma específica.
- Toda ação confirmada do agente gera registro de auditoria.

### Estratégia sem custo no MVP

O plano gratuito inclui um agente de comandos baseado em regras e intenções conhecidas, por exemplo: “crie uma tarefa para Maria amanhã”, “mostre os atrasos” e “liste projetos em risco”. Ele funciona sem consumo de API generativa.

Usuários podem futuramente conectar sua própria chave de provedor de IA (começando pela OpenAI e mantendo a arquitetura preparada para Gemini e Claude). A chave deve ser criptografada, nunca exibida novamente, nunca enviada ao navegador e nunca usada sem autorização do dono do workspace.

## 9. Limites explícitos do MVP

Ficam fora da primeira versão:

- portal para clientes;
- financeiro, CRM, RH, contratos e timesheets;
- calendário, Gantt/timeline e construtor de dashboards;
- relatórios avançados;
- integrações com WhatsApp, Drive e outras plataformas;
- IA generativa incluída e automações autônomas;
- planos, pagamentos e assinatura.

O objetivo inicial é publicar, usar e validar a hipótese com uma aplicação completa, não vender assinaturas prematuramente.

## 10. Critérios de sucesso da validação

O MVP será considerado promissor quando agências piloto conseguirem:

1. cadastrar clientes, projetos, entregas e tarefas sem depender de planilhas;
2. orientar o trabalho diário pela tela Meu Trabalho;
3. identificar problemas sem pedir atualizações manualmente à equipe;
4. usar o Painel da Operação em reuniões ou rituais de acompanhamento;
5. voltar ao produto com frequência semanal e relatar redução de mensagens de cobrança interna.

Métricas iniciais: workspaces ativos por semana, tarefas atualizadas, projetos com atualização recente, alertas resolvidos e uso de cada tela principal. Ainda não haverá métrica de receita como objetivo do MVP.

## 11. Requisitos técnicos para um projeto de portfólio completo

O projeto deve demonstrar competências valorizadas em vagas atuais de desenvolvimento, sem adicionar complexidade que não gera aprendizado ou valor. A meta é que um recrutador consiga executar, inspecionar e entender decisões relevantes de produto e engenharia pelo repositório, pela aplicação publicada e pela documentação.

### Arquitetura proposta

- **Monorepo TypeScript** com pnpm workspaces ou Turborepo.
- **Aplicação web:** Next.js (App Router), React, TypeScript, Tailwind CSS e componentes acessíveis.
- **Design:** os componentes devem aceitar o design system futuro por meio de tokens e primitives reutilizáveis; a definição estética detalhada não faz parte deste briefing.
- **API:** rotas do Next.js organizadas por módulos de domínio; contratos tipados e validação com Zod.
- **Banco de dados:** PostgreSQL com Prisma ORM.
- **Autenticação:** Auth.js ou solução equivalente, com login por e-mail e convite de membros.
- **Autorização:** RBAC simples (administrador e membro), sempre associado ao workspace.
- **Dados:** modelagem relacional, migrações versionadas, seeds e isolamento multi-tenant por `workspaceId`.
- **Estado e formulários:** React Hook Form, Zod e cache de dados no cliente quando necessário.
- **Agente gratuito:** interpretador de intenções e camada de comandos/ferramentas, separada da interface de chat.
- **Observabilidade:** logs estruturados, rastreamento de erros e auditoria das ações do agente.

### Qualidade e engenharia

- ESLint, Prettier, TypeScript em modo estrito e convenções documentadas.
- Testes unitários para regras de risco e serviços de domínio.
- Testes de integração para API, autenticação e isolamento entre workspaces.
- Testes de interface e pelo menos um fluxo ponta a ponta crítico: convite/login → cliente → projeto → entrega → tarefa → alerta no painel.
- CI no GitHub Actions para lint, tipos e testes em cada pull request.
- Docker Compose para desenvolvimento local com banco de dados.
- README com arquitetura, decisões, instalação, variáveis de ambiente, capturas de tela e trade-offs.
- Issues e pequenos marcos de desenvolvimento para evidenciar planejamento e evolução do produto.

### Evidências esperadas no portfólio

| Competência que vagas avaliam    | Evidência no Workflow                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Produto e UX                     | Fluxos claramente documentados, telas orientadas a perguntas do usuário e estados vazios/erro/carregamento. |
| Front-end moderno                | React/Next.js, TypeScript estrito, componentes acessíveis, responsividade e formulários validados.          |
| Back-end                         | API modular, regras de domínio, validação, tratamento de erros e contratos tipados.                         |
| Banco e dados                    | PostgreSQL, Prisma, migrações, seeds, índices necessários e modelagem multi-tenant.                         |
| Segurança                        | autenticação, autorização no servidor, isolamento por workspace, gestão de segredos e auditoria.            |
| Qualidade                        | testes unitários, integração e E2E; lint, formatação, tipos e CI automatizados.                             |
| DevOps                           | Docker local, variáveis de ambiente documentadas, deploy público e pipeline de integração contínua.         |
| Arquitetura                      | decisões registradas (ADRs), módulos coesos e fronteiras claras entre UI, aplicação e domínio.              |
| IA aplicada com responsabilidade | agente limitado por permissões, prévia antes de alterar dados, confirmação e trilha de auditoria.           |

### Requisitos de experiência não visuais

- Cada tela deve ter estados de carregamento, vazio, erro e ausência de permissão.
- A navegação por teclado, foco visível, semântica e contraste devem ser verificados quando o design system for criado.
- A interface deve permanecer utilizável em desktop e dispositivos móveis, ainda que a direção visual seja definida depois.
- Funcionalidades importantes precisam de dados de demonstração para que um recrutador possa avaliar o produto sem configurar uma agência real.

### Segurança e privacidade

- autorização verificada no servidor em toda leitura e escrita;
- nenhuma consulta sem filtro de workspace;
- validação de entrada e proteção contra acesso indevido por identificador;
- segredos apenas em variáveis de ambiente;
- chaves de IA fornecidas pelo usuário criptografadas em repouso;
- trilha de auditoria para alterações relevantes e ações do agente;
- política de privacidade e termos simples antes de qualquer piloto público.

## 12. Publicação sem custo no início

O projeto será desenvolvido para funcionar localmente e ser publicado com camadas gratuitas, sujeitas aos limites dos respectivos provedores:

- repositório e automações: GitHub;
- hospedagem da aplicação: plataforma com camada gratuita compatível com Next.js;
- banco PostgreSQL: camada gratuita de provedor gerenciado;
- autenticação e e-mail: fluxo simples, com provedor gratuito quando a etapa exigir;
- domínio: URL gratuita da plataforma no piloto; domínio próprio apenas após validação.

As escolhas concretas de provedor devem ser feitas na implementação, considerando limites atuais, privacidade e compatibilidade. A arquitetura deve manter adaptadores para reduzir acoplamento a qualquer serviço gratuito. O objetivo é ter uma demonstração pública confiável para portfólio; níveis gratuitos podem mudar e não devem ser tratados como garantia de serviço comercial.

## 13. Roadmap orientado a validação

### Marco 0 — Fundação

Monorepo, padrões, banco, migrações, autenticação, workspace, papéis, CI e ambiente local com Docker.

### Marco 1 — Núcleo operacional

Clientes, projetos, entregas, tarefas, atribuição, prazos, prioridades, status, bloqueios e auditoria básica.

### Marco 2 — Experiências principais

Meu Trabalho, Projeto em Kanban/Lista, Painel da Operação e Central de Atenção com regras testadas.

### Marco 3 — Colaboração mínima

Convites, permissões, comentários internos em tarefas/entregas e aprovações internas.

### Marco 4 — Agente gratuito e publicação

Comandos por regras, prévia/confirmação, logs de ação, dados de demonstração, documentação e deploy gratuito.

### Pós-validação

Modelos próprios, calendário, documentos, horas, integrações, IA por chave própria, automações autorizadas, financeirização e eventualmente planos pagos — sempre guiados por uso real.

## 14. Decisões que ficam para depois

- nome visual, identidade e domínio definitivo;
- política de retenção de dados e backup em escala;
- preços e limites comerciais;
- provedor definitivo de e-mail, banco e deploy;
- provedores e modelos de IA integrados;
- portal de cliente e integrações externas;
- ampliação de papéis e permissões.

## 15. Definição de pronto do MVP

Uma agência de teste consegue criar seu workspace, convidar a equipe, registrar cliente/projeto/entrega/tarefas, atribuir trabalho, atualizar o andamento, registrar aprovação, visualizar o que precisa fazer e identificar os riscos operacionais — em uma aplicação publicada, responsiva, segura, testada e documentada.

Além disso, um recrutador deve conseguir clonar o repositório, iniciar o ambiente com instruções claras, explorar dados de demonstração, executar a suíte de testes e localizar as decisões de arquitetura. Um design system posterior dará identidade visual ao produto sem alterar essa definição de pronto.
