# Roadmap de prontidão comercial — Workflow

**Objetivo:** evoluir o Workflow de demonstração de portfólio para um SaaS seguro e utilizável por pequenas agências, em sessões diárias de aproximadamente uma hora.

**Público inicial:** agências de marketing e design com 3 a 30 pessoas.

**Promessa central:** identificar riscos, organizar entregas e tornar responsabilidades óbvias antes que o trabalho vire urgência.

## Como usar este roadmap

- Cada sessão deve terminar com uma mudança pequena, verificável e documentada.
- Cada sessão segue o [fluxo profissional de desenvolvimento](../development/professional-workflow.md), exercitando práticas reais de produto, engenharia, revisão, qualidade e operação.
- Confiabilidade, ativação e segurança têm prioridade sobre amplitude de features.
- Uma feature nova só entra se reforçar a promessa central e justificar seu custo permanente.
- Atualize o status e registre evidências ao concluir cada sessão.

Status: `Pendente`, `Em andamento`, `Concluída` ou `Bloqueada`.

## Fase 1 — Confiabilidade do ciclo de desenvolvimento

| Sessão | Entrega | Critério de conclusão | Status |
| --- | --- | --- | --- |
| 1 | Preflight dos testes E2E | `pnpm test:e2e` identifica Supabase/Mailpit ausentes em segundos e informa como preparar o ambiente | Concluída |
| 2 | Encerramento previsível do E2E | A suíte encerra sem processos pendurados após sucesso ou falha | Concluída |
| 3 | Gate de qualidade atualizado | Números, comandos e limitações documentados correspondem ao estado atual | Concluída |
| 4 | Smoke test autenticado | Login, carregamento do shell e logout possuem um percurso curto e determinístico | Concluída |
| 5 | Estados de falha | Páginas reais apresentam loading, vazio, erro e retry coerentes | Concluída |

## Fase 2 — Multi-tenancy real

| Sessão | Entrega | Critério de conclusão | Status |
| --- | --- | --- | --- |
| 6 | Resolver workspace ativo | Nenhuma página autenticada depende do UUID fixo da Agência Aurora | Concluída |
| 7 | Persistir contexto | O workspace ativo sobrevive à navegação e é validado contra memberships | Pendente |
| 8 | Seletor de workspace | Usuário com duas memberships troca de workspace sem mistura de dados | Pendente |
| 9 | Criar workspace | Um usuário elegível cria e acessa um workspace próprio | Pendente |
| 10 | Regressão multi-tenant | E2E cobre troca, acesso negado e tentativa de IDOR entre dois workspaces | Pendente |

## Fase 3 — Onboarding e ativação

| Sessão | Entrega | Critério de conclusão | Status |
| --- | --- | --- | --- |
| 11 | Jornada de primeiro acesso | O usuário declara objetivo, tamanho e tipo de operação da agência | Pendente |
| 12 | Primeiro cliente | Empty state conduz diretamente à criação do primeiro cliente | Pendente |
| 13 | Primeiro projeto | Um template mínimo leva de cliente a projeto e primeira entrega | Pendente |
| 14 | Convite de membro | ADMIN convida, acompanha e revoga convites com segurança | Pendente |
| 15 | Primeira percepção de valor | Onboarding conduz a uma tarefa atribuída e à Central de Atenção em menos de cinco minutos | Pendente |

## Fase 4 — Operação diária essencial

| Sessão | Entrega | Critério de conclusão | Status |
| --- | --- | --- | --- |
| 16 | Busca global | Busca encontra cliente, projeto, entrega e tarefa dentro do tenant | Pendente |
| 17 | Notificações internas | Atribuição, bloqueio e aprovação geram notificações acionáveis | Pendente |
| 18 | Auditoria visível | Tarefas e entregas exibem histórico relevante sem expor metadados técnicos | Pendente |
| 19 | Templates de projeto | Agência reutiliza uma estrutura de projeto sem duplicação manual | Pendente |
| 20 | Métricas de ativação | TTV, ativação e uso do fluxo central podem ser medidos sem dados sensíveis | Pendente |

## Próximas fases

Após as primeiras 20 sessões, priorizar com base em uso real:

1. Anexos e arquivos.
2. Comentários, menções e notificações por e-mail.
3. Calendário e recorrência.
4. Importação e exportação.
5. Configurações, privacidade e portabilidade.
6. Observabilidade, backups, rate limiting e resposta a incidentes.
7. Planos, limites de uso e billing.

## Fora de prioridade até a ativação estar validada

- IA genérica ou chatbot sem caso operacional específico.
- CRM, financeiro ou publicação em redes sociais completos.
- Aplicativo mobile nativo.
- White-label avançado.
- Grande catálogo de integrações.
- Billing antes de uma agência conseguir chegar ao primeiro valor sozinha.

## Definições de pronto

### Beta fechada

- Workspace real e convites funcionais.
- Fluxo de onboarding completo.
- Testes críticos verdes e reproduzíveis.
- Logs de erro, backups e proteção básica contra abuso.
- Termos e política de privacidade adequados ao teste.

### Agências reais

- Isolamento multi-tenant validado em aplicação e banco.
- Recuperação e administração de acesso.
- Monitoramento, alertas, backups testados e plano de incidentes.
- Hospedagem e e-mail autorizados para uso comercial.
- Exportação de dados e canal de suporte.

### Lançamento comercial

- Billing, limites e estados de cobrança consistentes.
- Métricas de ativação, retenção e uso por workspace.
- Processo de suporte, manutenção e comunicação de incidentes.
- Validação com agências piloto e correção dos principais pontos de abandono.

## Diário de execução

### Sessão 1 — Preflight dos testes E2E

- **Data:** 20 de agosto de 2026.
- **Resultado:** o comando E2E agora verifica Supabase e Mailpit antes de abrir o navegador.
- **Falha esperada:** quando a infraestrutura está ausente, encerra em segundos, lista os serviços indisponíveis e mostra como preparar o ambiente.
- **Cobertura:** três testes automatizados validam URLs padrão, dependência indisponível e interrupção anterior ao Playwright.
- **Atalho público:** `pnpm test:e2e:public` continua permitindo validar demo e health sem banco local.

### Sessão 2 — Encerramento previsível do E2E

- **Data:** 20 de agosto de 2026.
- **Causa encontrada:** no Windows, o Playwright concluía os testes, mas bloqueava ao encerrar a árvore do `next dev` iniciada por `webServer`.
- **Resultado:** o servidor de desenvolvimento fica explicitamente sob controle do desenvolvedor em um terminal separado; o Playwright controla apenas navegador e testes.
- **Proteção:** o preflight agora verifica também `/health` e explica que `pnpm dev` precisa estar ativo.
- **Evidência:** a suíte pública completa encerrou com quatro testes verdes em menos de dez segundos, sem manter um processo próprio do servidor.

### Sessão 3 — Gate de qualidade atualizado

- **Data:** 20 de agosto de 2026.
- **Resultado:** o gate agora separa código, E2E autenticado, portfólio e prontidão comercial, sem reaproveitar evidências históricas como se fossem atuais.
- **Evidência atual:** lint, tipos, 24 arquivos/66 testes, build, seed e diff passaram; quatro E2E públicos passaram na Sessão 2.
- **Transparência:** suíte autenticada, reset do banco e auditoria de dependências foram marcados como não revalidados nesta sessão.
- **CI documentado:** o badge cobre formatação, lint, tipos, Vitest e build; Playwright e Supabase ainda não fazem parte do workflow remoto.

### Sessão 4 — Smoke test autenticado

- **Data de início:** 20 de agosto de 2026.
- **Implementado:** percurso isolado de solicitação do magic link, entrada como ADMIN, confirmação do shell, logout e negação de acesso posterior a `/app`.
- **Comando:** `pnpm test:e2e:smoke` executa o preflight e somente `tests/e2e/auth-smoke.spec.ts`.
- **Resultado:** passou a partir de banco limpo, cobrindo login, shell, logout e redirecionamento de uma rota protegida.
- **Evidência:** 1 cenário passou em 4,4 segundos; 6,9 segundos incluindo o preflight.
- **Melhoria adicional:** o preflight permite até 10 segundos para o primeiro `/health`, evitando falso negativo durante a compilação inicial do Next.js, enquanto Supabase e Mailpit mantêm timeout curto.

### Sessão 5 — Estados de loading, vazio, erro e acesso ausente

- **Data:** 20 de agosto de 2026.
- **Correção crítica:** os limites `error.tsx` agora usam `retry()`, contrato estável do Next.js 16.3, no lugar do `reset()` incompatível.
- **Consistência:** um estado de erro reutilizável preserva linguagem, hierarquia, semântica de alerta e uma única ação de recuperação.
- **Loading:** Aprovações recebeu fallback instantâneo; Clientes e Projetos passaram a usar o mesmo esqueleto nomeado e acessível.
- **Vazio:** Aprovações orienta o usuário diretamente a encontrar uma entrega, em vez de terminar numa tela sem saída.
- **Acesso ausente:** o 404 autenticado não revela se o item existe em outro workspace e oferece retorno à operação.
- **Evidência:** 25 arquivos/68 testes, TypeScript, lint e build passaram.

### Sessão 6 — Resolver workspace ativo

- **Data:** 20 de agosto de 2026.
- **Interface:** páginas, shell e Server Actions usam `createAuthorizationContext()` sem receber ou conhecer um `workspaceId`.
- **Implementação:** o servidor autentica o usuário, encontra sua primeira membership ativa em ordem determinística e deriva ator, papel e workspace.
- **Segurança:** usuário autenticado sem membership ativa recebe `FORBIDDEN`; o resolvedor explícito continua validando membership para a seleção persistida futura.
- **Remoção:** o UUID da Agência Aurora deixou de existir no runtime de produção e permanece apenas como dado nomeado em testes de isolamento.
- **Evidência de navegador:** o administrador do Estúdio Horizonte acessou apenas “Norte Comércio” e não recebeu dados da Agência Aurora.
- **Validação:** 25 arquivos/70 testes, TypeScript, lint, build e 2 smoke tests autenticados passaram.

### Encerramento do dia — Marco das Sessões 1 a 6

- **Data:** 20 de agosto de 2026.
- **Marco:** as seis primeiras sessões foram consolidadas em uma branch própria, validadas e enviadas ao GitHub sem alterar diretamente a `main`.
- **Processo adotado:** a partir deste marco, o projeto seguirá o fluxo profissional documentado, produzindo evidências de planejamento, implementação, revisão, qualidade e entrega.
- **Limite respeitado:** a sessão diária foi encerrada após aproximadamente uma hora; a Sessão 7 fica reservada para o próximo dia de trabalho.
- **Próximo passo:** persistir o contexto do workspace ativo e validá-lo contra as memberships do usuário.
