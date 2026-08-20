# Fluxo profissional de desenvolvimento

## Objetivo

O Workflow será desenvolvido com práticas usadas por equipes profissionais de produto e engenharia. Mesmo quando uma única pessoa executar todas as funções, o trabalho deverá deixar evidências claras de planejamento, decisão, implementação, revisão, validação e entrega.

Além de aumentar a segurança e a qualidade do SaaS, esse histórico deverá demonstrar capacidade de trabalhar em equipe, comunicar decisões técnicas e conduzir uma mudança por todo o ciclo de desenvolvimento.

## Princípios

- Trabalhar em mudanças pequenas, compreensíveis e reversíveis.
- Relacionar cada mudança a um problema, objetivo ou item do roadmap.
- Separar desenvolvimento da branch principal.
- Revisar o impacto antes de integrar uma mudança.
- Automatizar verificações repetitivas e registrar evidências relevantes.
- Documentar decisões importantes e seus motivos, não cada detalhe trivial.
- Tratar segurança, isolamento de dados, acessibilidade e operação como parte do produto.
- Preservar um histórico Git que outra pessoa consiga entender e continuar.

## Fluxo de cada sessão

1. **Selecionar:** escolher um item pequeno do roadmap e definir seu critério de conclusão.
2. **Investigar:** entender o comportamento atual, riscos, dependências e arquivos afetados.
3. **Planejar:** registrar a abordagem quando a mudança não for trivial.
4. **Implementar:** desenvolver em uma branch própria, mantendo o escopo controlado.
5. **Validar:** executar testes, tipagem, lint, build e verificações específicas proporcionais ao risco.
6. **Revisar:** conferir o diff como se outra pessoa fosse aprová-lo, observando segurança, regressões, clareza e aderência ao objetivo.
7. **Registrar:** criar um commit coerente e atualizar roadmap, documentação ou decisão arquitetural quando necessário.
8. **Compartilhar:** enviar a branch ao GitHub e usar Pull Request nos marcos que serão integrados à branch principal.
9. **Encerrar:** anotar resultado, evidências, limitações e próximo passo para permitir uma retomada rápida.

## Papéis exercitados

Em projetos maiores, essas responsabilidades costumam ser divididas. Neste projeto, elas serão exercitadas explicitamente, ainda que pela mesma pessoa:

- **Produto:** prioriza o problema e define valor e critério de aceite.
- **Design:** cuida de jornada, clareza, consistência visual e acessibilidade.
- **Engenharia:** projeta e implementa a solução com qualidade e segurança.
- **Revisão:** questiona riscos, legibilidade, escopo e possíveis regressões.
- **Qualidade:** valida critérios de aceite e comportamentos críticos.
- **Operação:** considera deploy, observabilidade, rollback, suporte e incidentes.

## Git e GitHub

- A branch `main` representa uma versão estável e integrável.
- Mudanças são feitas em branches com nomes descritivos, usando o prefixo `codex/` durante as sessões assistidas.
- Um commit deve representar uma unidade coerente de trabalho e explicar a intenção da mudança.
- Não é necessário criar um commit para cada ajuste mínimo; deve-se registrar cada entrega verificável.
- Branches são enviadas ao GitHub para preservar o trabalho e permitir revisão.
- Pull Requests serão usados para revisar e integrar marcos, com resumo, testes executados, riscos e imagens quando houver mudança visual.
- Artefatos locais, segredos, relatórios temporários e arquivos sem relação com a entrega não entram no commit.

## Evidências de experiência

O repositório deverá permitir que outra pessoa encontre:

- roadmap e critérios de conclusão;
- histórico de branches e commits coerentes;
- Pull Requests com contexto e validações;
- testes automatizados e gates de qualidade;
- decisões arquiteturais e análise de trade-offs;
- registros de segurança e isolamento multi-tenant;
- documentação de deploy, rollback e operação;
- evolução visual e funcional ligada a problemas reais de usuário.

Essas evidências valem mais do que simular cargos ou cerimônias. O objetivo é demonstrar domínio do fluxo, responsabilidade sobre a entrega e capacidade de colaborar em um projeto que outras pessoas poderiam assumir.

## Ritmo diário

Cada sessão terá aproximadamente uma hora. O limite de tempo ajuda a manter o escopo pequeno e sustentável. Quando a hora terminar, o trabalho deve ficar em um estado seguro: concluído e validado, ou claramente documentado para continuação, sem ampliar a sessão apenas para cumprir uma estimativa.
