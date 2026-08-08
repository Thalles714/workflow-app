# PROMPT MESTRE — Planejamento do SaaS Workflow do zero ao deploy

## Seu papel

Atue como **arquiteto de software, product engineer e planejador de execução para agentes de IA**. Sua missão não é implementar o produto agora. Sua missão é produzir um **plano executável completo, em português, composto por prompts independentes, autocontidos, sequenciais e prontos para copiar e enviar a diferentes agentes**, cobrindo a construção do SaaS Workflow do zero ao deploy público.

O plano será executado por agentes distintos, possivelmente sem memória das etapas anteriores. Portanto, cada prompt precisa explicar seu contexto, arquivos de entrada, objetivo, limites, tarefas, entregáveis, validações e condição de passagem para a próxima fase.

## Contexto obrigatório do projeto

O repositório local está em:

`C:\Users\Administrator\Projects\workflow`

Antes de propor qualquer fase ou tecnologia, analise integralmente o conteúdo relevante do repositório. Considere os arquivos abaixo fontes de verdade, nesta ordem de precedência:

1. `workflow-briefing.md` — fonte principal para produto, domínio, escopo, segurança e definição de pronto.
2. `assets/design_system/design_system.html` — **base visual obrigatória** para todas as telas e componentes.
3. `assets/templates/` — referências secundárias de composição, navegação, dashboards, listas, sidebars e movimento. Elas podem inspirar estrutura, mas nunca substituir ou contradizer o design system oficial.
4. `docs/research/work-management-references.md` e quaisquer outros arquivos/pastas com referências a Asana, Jira, monday.com ou produtos semelhantes — referências funcionais e de arquitetura de informação, não de identidade visual.

Faça uma inspeção real dos arquivos; não planeje apenas com base neste prompt. Se houver divergência, siga o briefing para produto e o design system oficial para aparência. Preserve arquivos existentes e não copie cegamente templates completos.

## Síntese já identificada — use como orientação, mas confirme nos arquivos

O Workflow é um sistema operacional de entregas para pequenas agências de marketing e design (3 a 30 pessoas). Sua promessa é permitir que o gestor veja toda a operação e descubra o que exige atenção antes de virar problema.

O domínio central é:

`Workspace → Cliente → Projeto → Entrega → Tarefa`

Também existem Usuário, Membro, Aprovação, Alerta e, se couber no MVP final, Template de projeto. **Entrega é entidade própria**, não uma tarefa especial. Kanban e Lista são duas visualizações da mesma fonte de dados.

As três perguntas centrais da experiência são:

- **Meu Trabalho:** “O que preciso fazer agora?” — tarefas do usuário agrupadas em Atrasadas, Hoje, Próximas e Aguardando aprovação.
- **Painel da Operação/Central de Atenção:** “Onde preciso agir?” — exceções acionáveis, não gráficos decorativos.
- **Projeto:** “Como está este projeto?” — visão geral curta e abas Kanban/Lista com filtros enxutos.

Estados fixos de tarefa: A fazer, Em andamento, Em revisão e Concluída. Bloqueio é um sinal adicional com motivo explícito.

As regras iniciais da Central de Atenção são determinísticas e testáveis: tarefa atrasada que bloqueia entrega; entrega próxima com pendências; projeto sem atualização; aprovação pendente; tarefa bloqueada; entrega importante próxima. Não use IA opaca para calcular risco.

O agente de operação do MVP deve ser gratuito e baseado em comandos/regras conhecidas, sem depender de API generativa paga. Ele pode consultar, preparar criação e edição, mas nunca excluir. Toda mutação exige prévia, confirmação explícita, autorização no servidor e registro de auditoria. Caso essa funcionalidade ameace prazo, simplicidade ou qualidade do núcleo, coloque-a como fase opcional claramente separada, sem impedir o deploy do portfólio.

O design system oficial já define, entre outros elementos:

- direção visual clara, editorial e operacional, com “calma para operar”, “sinal antes de ruído”, atenção acionável e confiança visível;
- Plus Jakarta Sans para UI/display, Inter para texto e JetBrains Mono para dados/labels;
- canvas `#F7F7F5`, surface `#FFFFFF`, ink `#121211`, primary indigo `#5B5CE2`, secondary violet `#8B5CF6`, accent cyan `#17A2B8` e cores semânticas próprias;
- escala espacial baseada em 4 px, ritmo principal de 8 px, raios, sombras e tokens definidos no arquivo;
- componentes e padrões de botão, formulário, seleção, badges, chips, avatars, tooltip, dropdown, cards, breadcrumbs, paginação, skeletons, tabs, accordion, tabela, empty state, alertas, toast, modal, drawer, navbar e ação flutuante;
- foco visível, navegação por teclado, contraste reforçado e `prefers-reduced-motion`;
- movimento com propósito: microinterações curtas, layers/drawers moderados, reveals controlados e ausência de loops gratuitos.

As referências em `assets/templates/` incluem materiais de dashboard, lista, sidebar e animações, além de projetos Axion, Volta e outros. Use-as somente para aprender composição e interação. A linguagem visual final deve permanecer a do design system Workflow.

## Objetivo real e restrições inegociáveis

Este SaaS existe **exclusivamente como projeto de portfólio para demonstrar a recrutadores que uma pessoa criou um produto full-stack completo**. Não é um produto comercial em produção e não deve simular escala inexistente.

O resultado precisa ser:

- simples, convincente, funcional e fácil de demonstrar;
- rápido de construir por uma pessoa auxiliada por agentes;
- seguro no nível adequado a um app público de portfólio;
- executável localmente com instruções claras;
- publicado usando apenas planos realmente gratuitos;
- hospedado em URL/subdomínio gratuito da plataforma, sem compra de domínio;
- compreensível para recrutadores pelo app, código, histórico Git e documentação;
- enxuto: prefira uma aplicação única e módulos claros a microserviços, event bus, filas, Kubernetes, abstrações especulativas ou infraestrutura excessiva.

**Orçamento obrigatório: R$ 0 / US$ 0.** Não proponha cartão de crédito, trial que vira cobrança, serviço pago, domínio pago, API de IA paga ou dependência cuja função essencial desapareça rapidamente. Como planos gratuitos mudam, pesquise e confirme nas fontes oficiais atuais, na data da elaboração, os limites dos provedores recomendados. Informe data da verificação, links oficiais, limites relevantes e um plano alternativo também gratuito. Nunca trate free tier como garantia permanente.

## Primeiro resultado exigido: recorte explícito do MVP

Antes da lista de prompts, apresente:

1. Uma síntese do produto e do fluxo crítico.
2. Uma tabela **Agora / Depois / Fora do portfólio**, resolvendo ambiguidades do briefing em favor do menor MVP demonstrável.
3. A lista exata de telas do MVP e seus estados (normal, loading, vazio, erro e sem permissão quando aplicável).
4. O fluxo dourado de demonstração: login/demo → workspace → cliente → projeto → entrega → tarefa → atualização → alerta/risco → aprovação.
5. Decisões explícitas sobre convites, comentários, templates e agente por regras: obrigatório, opcional pós-deploy ou excluído, com justificativa de custo/valor.
6. Um orçamento de complexidade: o que foi removido para manter o projeto concluível.

Não inclua no MVP: pagamentos/assinaturas, CRM, financeiro, RH, contratos, timesheets, portal do cliente, calendário, Gantt/timeline, dashboards configuráveis, relatórios avançados, integrações externas, campos/workflows customizáveis, IA generativa incluída ou automações autônomas.

## Arquitetura e stack gratuitas

Escolha **uma stack principal concreta** e uma alternativa de contingência, mas não gere várias arquiteturas concorrentes. O briefing sugere Next.js, React, TypeScript, Tailwind, Zod, PostgreSQL e Prisma; avalie isso contra o objetivo de simplicidade e os limites gratuitos atuais.

Prefira, se a verificação atual confirmar compatibilidade:

- um único repositório e uma única aplicação Next.js/TypeScript, sem monorepo/Turborepo se não houver benefício concreto;
- componentes acessíveis e tokens do design system implementados como CSS variables/primitives reutilizáveis;
- PostgreSQL gerenciado e autenticação em um mesmo provedor gratuito quando isso reduzir integração e risco (por exemplo, Supabase), ou justifique outra escolha;
- hospedagem gratuita compatível com a stack (por exemplo, Vercel), usando o subdomínio gratuito;
- GitHub e GitHub Actions dentro do free tier;
- e-mail real apenas se indispensável; para portfólio, considere login demo e fluxo simplificado, sem sacrificar autenticação/autorização reais.

Decida e documente:

- frontend, backend/API, ORM ou cliente de banco, autenticação, validação, testes e deploy;
- diagrama simples da arquitetura;
- modelo relacional mínimo, enums, chaves, índices e relações;
- estratégia de migrações e seed idempotente;
- separação entre ambiente local, testes e produção;
- variáveis de ambiente e exemplos sem segredos;
- isolamento multi-tenant por `workspaceId` e regras de autorização sempre no servidor;
- limites e trade-offs do free tier;
- por que cada dependência existe e qual complexidade ela evita.

Não adicione Redis, filas, websockets, realtime, microserviços, storage de arquivos, analytics externo ou observabilidade SaaS se logs da plataforma e uma implementação simples forem suficientes.

## Etapa visual obrigatória antes da aplicação real

A primeira fase prática, depois da descoberta e definição do escopo, deve ser a **prototipação visual estática**. Ela é um gate: a implementação real não começa até a aparência ser validada.

Exija que o agente dessa fase:

- crie uma pasta clara de protótipos, sem modificar o design system original;
- crie **um diretório por tela e um `index.html` independente para cada tela** do MVP, abrível diretamente no navegador;
- use HTML semântico, CSS e JavaScript mínimo, sem framework/build obrigatório;
- derive tokens, tipografia, cores, espaçamento, raios, sombras, componentes, estados e movimento de `assets/design_system/design_system.html`;
- use `assets/templates/` apenas como referência de composição;
- represente dados realistas de uma agência e inclua, por tela, estados críticos relevantes;
- cubra desktop e mobile (validar pelo menos 1440 px, 768 px e 390 px);
- garanta foco visível, ordem de tabulação, labels, semântica, contraste e redução de movimento;
- conecte navegação suficiente entre protótipos para simular o fluxo dourado;
- produza um inventário de componentes e um checklist visual;
- tire capturas de tela ou forneça instruções exatas para revisão visual;
- pare ao final e peça aprovação humana explícita antes do prompt seguinte.

O prompt da fase seguinte deve começar exigindo a confirmação de que os protótipos foram aprovados. Se não houver aprovação, o agente deve parar sem implementar a aplicação real.

## Formato obrigatório do plano de execução

Organize a resposta em fases numeradas, em ordem exata. Uma sequência sugerida, que você deve ajustar sem perder os gates, é:

0. Auditoria do repositório e congelamento do escopo.
1. Protótipos HTML independentes por tela.
2. Revisão visual, acessibilidade básica e aprovação humana.
3. Fundação do repositório, padrões de código e Git.
4. Banco, migrações, seed e autenticação.
5. Autorização multi-tenant e camada de domínio/API.
6. Shell da aplicação e componentes do design system.
7. CRUD do núcleo: clientes, projetos, entregas e tarefas.
8. Meu Trabalho.
9. Projeto: visão geral, Kanban e Lista.
10. Painel da Operação e Central de Atenção.
11. Aprovações e colaboração mínima escolhida.
12. Agente gratuito baseado em regras, somente se permanecer no MVP/portfólio.
13. Responsividade, acessibilidade, estados e polimento.
14. Testes, segurança e revisão de qualidade.
15. Seed/demo final e experiência para recrutador.
16. CI/CD e deploy gratuito.
17. README, documentação de portfólio, capturas e roteiro de demo.
18. Auditoria final e handoff.

Você pode unir fases pequenas, mas não pode misturar tudo em poucos prompts gigantes. Cada prompt deve ter uma responsabilidade principal, gerar um incremento verificável e caber em uma sessão razoável de um agente.

## Estrutura obrigatória de cada prompt independente

Para **cada fase**, entregue um bloco copiável com o título `PROMPT NN — nome da fase`, contendo obrigatoriamente:

1. **Papel do agente** — especialidade adequada à fase.
2. **Contexto autocontido** — produto, objetivo do portfólio, pasta do projeto e fontes que precisam ser lidas.
3. **Pré-condições/dependências** — arquivos, decisões e evidências que devem existir; como verificar.
4. **Objetivo único da fase** — resultado concreto.
5. **Escopo incluído** — tarefas exatas e ordem interna.
6. **Fora de escopo** — prevenção explícita de expansão e refactors não relacionados.
7. **Arquivos esperados** — criar/alterar; proibir alteração desnecessária de outros arquivos.
8. **Regras técnicas e visuais** — stack, design system, segurança, responsividade e acessibilidade pertinentes.
9. **Procedimento de trabalho** — primeiro inspecionar, preservar mudanças existentes, implementar, validar e revisar o diff.
10. **Comandos/verificações** — ações executáveis para lint, types, testes, build ou inspeção visual conforme a fase.
11. **Critérios de aceitação objetivos** — checklist observável, sem frases vagas como “deixe bonito”.
12. **Definição de pronto** — nenhuma fase pode declarar sucesso com teste/build quebrado.
13. **Formato do relatório final do agente** — resumo, arquivos modificados, validações, riscos/dívidas e instrução de handoff.
14. **Condição de passagem** — diga literalmente quando o usuário deve enviar qual prompt seguinte. Se houver falha ou decisão humana pendente, instrua a não avançar.
15. **Commit sugerido** — pequeno, coerente, em Conventional Commits; o agente não deve fazer push nem reescrever histórico sem autorização.

Cada prompt deve ser realmente autocontido, mas pode exigir a leitura dos artefatos deixados pelas fases anteriores. Nunca presuma memória compartilhada entre agentes. Não use placeholders vagos como “implemente o resto”, “configure adequadamente” ou “teste tudo”.

## Segurança mínima obrigatória

Distribua e valide estas regras nas fases relevantes:

- autenticação não é autorização;
- toda leitura e escrita deve verificar sessão, papel e associação ao workspace no servidor;
- toda consulta multi-tenant deve ser limitada por `workspaceId`; prevenir IDOR;
- não confiar em `workspaceId`, `userId`, papel ou ownership enviados pelo cliente;
- validar entradas no servidor com schema; limitar tamanhos e valores;
- usar consultas parametrizadas/ORM e evitar renderização insegura de HTML;
- manter chaves e URLs sensíveis em variáveis de ambiente; fornecer apenas `.env.example` seguro;
- nunca commitar segredo, token, senha real, service-role key ou credencial de demo privilegiada;
- aplicar menor privilégio no banco; se usar Supabase, incluir e testar RLS, sem depender apenas dela;
- proteger ações destrutivas e preferir arquivamento/soft delete se exclusão entrar no CRUD; o agente operacional nunca exclui;
- impedir enumeração/acesso cruzado por IDs;
- tratamento seguro de erros sem vazar stack trace ou dados sensíveis;
- dependências mínimas e auditoria de vulnerabilidades sem aceitar correção automática destrutiva;
- rate limiting somente se puder ser implementado sem serviço pago e fizer sentido no risco do endpoint;
- dados seed fictícios, sem dados pessoais reais;
- auditoria para ações relevantes e para todas as mutações do agente;
- política/termos simples apenas se necessários para a demo pública, sem alegar conformidade jurídica não verificada.

Inclua uma matriz curta de ameaças do MVP e testes negativos: usuário não autenticado, membro sem papel, ID de outro workspace, payload inválido, mutação sem confirmação do agente e segredo ausente.

## Qualidade, testes e validações proporcionais

Evite tanto ausência de testes quanto uma suíte empresarial excessiva. Exija no mínimo:

- lint, formatação e TypeScript estrito;
- testes unitários das regras determinísticas da Central de Atenção;
- testes unitários dos serviços de domínio críticos;
- testes de integração da autenticação/autorização e isolamento entre workspaces;
- teste do seed/migrações em banco limpo;
- testes de UI para formulários e estados essenciais quando agregarem valor;
- um fluxo E2E crítico do login/demo ao alerta/aprovação;
- smoke test da URL publicada;
- build de produção sem erro;
- revisão manual em desktop e mobile;
- checklist básico WCAG: teclado, foco, labels, landmarks, contraste, mensagens de erro e reduced motion.

Se um tipo de teste exigir infraestrutura paga ou frágil, proponha uma alternativa local/gratuita e documente a limitação.

## Dados de demonstração e experiência do recrutador

Planeje um seed idempotente e convincente contendo uma agência fictícia, membros com papéis, vários clientes, projetos, entregas e tarefas que acionem deliberadamente todos os níveis relevantes da Central de Atenção: atraso crítico, prazo próximo, bloqueio, aprovação pendente, projeto sem atualização e item saudável/concluído.

Defina uma forma simples e segura de acesso à demo. Não exponha conta administrativa reutilizável com senha fraca se isso permitir vandalismo. Considere reset periódico/manual do seed, conta demo limitada, ou instruções claras para execução local. O plano deve explicar o trade-off escolhido.

## Git, CI/CD e documentação

O plano deve exigir:

- Git desde o início, branch principal protegida quando disponível e commits pequenos/semânticos;
- `.gitignore`, `.env.example`, migrations e lockfile versionados;
- nenhum push, force-push, reset destrutivo ou criação de PR sem autorização do usuário;
- GitHub Actions apenas se couber no plano gratuito: lint, types, testes e build;
- deploy automático por integração com a branch principal somente depois dos gates de qualidade;
- estratégia de rollback simples e documentada;
- README final com visão, problema, personas, features, stack, arquitetura, modelo de dados, segurança, instalação, env vars, migrações, seed, testes, deploy, screenshots, limitações e próximos passos;
- ao menos um ADR curto para a escolha de stack e um para autenticação/multi-tenancy;
- documentação explícita dos limites do free tier;
- um case study curto para portfólio: contexto, decisões, trade-offs, desafios, resultados e aprendizados;
- roteiro de demo de 3–5 minutos para recrutadores, com falas e cliques em ordem;
- checklist de materiais: URL pública, repositório, screenshots/GIF opcional, credenciais/instruções demo e comandos locais.

## Regras de comportamento para todos os agentes executores

Insira estas regras nos prompts em que forem pertinentes:

- ler `AGENTS.md` e instruções do repositório antes de agir, se existirem;
- inspecionar o estado atual e o diff antes de editar;
- preservar alterações do usuário e de agentes anteriores;
- não refatorar áreas não relacionadas;
- não apagar nem sobrescrever o design system e templates de referência;
- usar o design system como fonte de verdade visual;
- implementar o menor incremento que satisfaz os critérios;
- não adicionar biblioteca sem justificar necessidade, custo e impacto;
- não usar serviço pago nem exigir cartão;
- não declarar sucesso sem executar as validações possíveis;
- quando bloqueado por credencial, conta externa ou decisão humana, concluir tudo que for localmente possível e entregar instruções precisas, sem inventar resultados;
- pedir aprovação antes de qualquer ação externa relevante (criar projeto cloud, configurar deploy, mudar DNS, fazer push ou publicar dados);
- não iniciar a fase seguinte por conta própria: entregar o handoff e indicar ao usuário o próximo prompt.

## Entrega final que você deve produzir agora

Sua resposta deve ser um documento operacional em português, nesta ordem:

1. **Resumo das evidências encontradas no repositório** — produto, design system, templates e referências funcionais.
2. **MVP congelado** — Agora/Depois/Fora, telas e fluxo dourado.
3. **Stack escolhida e custos** — tabela com serviço, função, free tier verificado, limites, risco e alternativa gratuita; inclua data e links oficiais.
4. **Arquitetura e modelo de dados mínimos** — diagramas simples e decisões.
5. **Mapa de fases e dependências** — número, entrada, saída, gate e próximo prompt.
6. **Prompts completos e copiáveis**, numerados em ordem exata, usando a estrutura obrigatória acima.
7. **Matriz de cobertura** — mostre em quais prompts são tratados requisitos de produto, visual, segurança, testes, dados demo, acessibilidade, responsividade, Git, CI/CD, deploy e documentação.
8. **Checklist mestre de conclusão** — produto publicado, seguro, testado, documentado e demonstrável.
9. **Roteiro para o usuário** — diga exatamente: “envie o PROMPT 00”, o que conferir na resposta e sob qual condição enviar o próximo; repita a lógica para todos os gates humanos importantes.

Não implemente o SaaS, não crie todos os arquivos do produto e não execute deploy nesta tarefa. Entregue o plano e os prompts que tornarão essa execução previsível.

## Critério de excelência do seu próprio trabalho

Seu plano está pronto somente se:

- um agente sem contexto anterior consegue executar cada prompt;
- a ordem impede construir backend/UI antes de validar o escopo e o visual;
- existe um `index.html` independente por tela antes da aplicação real;
- cada fase possui saída verificável e condição explícita de passagem;
- o app cabe realisticamente em um projeto individual de portfólio;
- nenhuma função essencial depende de pagamento;
- os riscos de multi-tenancy e autorização estão cobertos por implementação e testes;
- o design system Workflow prevalece sobre os templates;
- o fluxo dourado pode ser demonstrado com seed data;
- o recrutador consegue abrir a URL, entender o produto, explorar o repositório e reproduzir o projeto localmente;
- não há overengineering, promessa de escala fictícia ou complexidade sem valor de portfólio.

