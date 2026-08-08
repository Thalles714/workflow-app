# Documentação do Workflow

Este diretório concentra decisões, evidências e instruções que não pertencem à interface do código. A organização separa a visão do produto da implementação e do histórico de release.

## Projeto

- [Briefing](./project/briefing.md): problema, público, domínio e requisitos originais.
- [Plano de execução](./project/execution-plan.md): fases, gates e prompts usados na construção.
- [Prompt mestre](./project/master-prompt.md): instruções que originaram o planejamento.
- [Escopo do MVP](./product/mvp-scope.md): Agora, Depois e Fora do portfólio.
- [Backlog](./product/implementation-backlog.md): entregas organizadas por fase.

## Arquitetura e desenvolvimento

- [ADR-001 — Stack](./architecture/adr-001-stack.md)
- [ADR-002 — Auth e multi-tenancy](./architecture/adr-002-auth-multitenancy.md)
- [Fundação](./development/foundation.md)
- [Banco e autenticação](./development/database-auth.md)
- [Domínio e contratos](./development/domain-api.md)
- [Regras da Central de Atenção](./development/attention-rules.md)

## Design e demonstração

- [Inventário dos protótipos](./design/prototype-inventory.md)
- [Revisão visual](./design/prototype-review.md)
- [Dados da demo](./demo/demo-data.md)
- [Roteiro da demo](./demo/demo-script.md)
- [Tour público](./demo/public-tour.md)

## Qualidade e release

- [Gate de qualidade](./quality/release-gate.md)
- [Revisão de acessibilidade](./quality/accessibility-review.md)
- [Reconciliação do Prompt 11](./quality/prompt-11-reconciliation.md)
- [Deploy e rollback](./deployment.md)
- [Case de portfólio](./portfolio/case-study.md)

## Pesquisa

- [Planos gratuitos](./research/free-tier-verification-2026-08-07.md)
- [Hospedagem para beta pública](./research/public-beta-hosting-2026-08-08.md)
- [Referências de gestão de trabalho](./research/work-management-references.md)

## Convenções

- Decisões caras de reverter pertencem a `architecture/`.
- Regras e contratos implementados pertencem a `development/`.
- Evidências de verificação pertencem a `quality/`.
- Fontes históricas e planejamento pertencem a `project/`.
- Novos documentos devem ser vinculados neste índice e no README apenas quando forem um ponto de entrada importante.
