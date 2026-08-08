# Revisão de responsividade e acessibilidade

> PROMPT 13 · 8 de agosto de 2026

## Matriz de cobertura

| Superfície         | 1440 | 768 | 390 | Estados cobertos                       |
| ------------------ | :--: | :-: | :-: | -------------------------------------- |
| Login              |  ✓   |  ✓  |  ✓  | erro e sessão inválida                 |
| Painel             |  ✓   |  ✓  |  ✓  | loading, vazio, erro e acesso restrito |
| Meu Trabalho       |  ✓   |  ✓  |  ✓  | loading, vazio e erro                  |
| Clientes e Cliente |  ✓   |  ✓  |  ✓  | vazio, erro e ausente                  |
| Projeto e Entrega  |  ✓   |  ✓  |  ✓  | vazio, erro e ausente                  |
| Tarefa             |  ✓   |  ✓  |  ✓  | sem updates, validação e ausente       |
| Aprovações         |  ✓   |  ✓  |  ✓  | vazio e papel insuficiente             |

## Critérios retestados

- `main`, navegação nomeada, skip link e headings preservam landmarks.
- Campos de formulário mantêm labels persistentes e retorno com `role=status` ou `role=alert`.
- Navegação móvel fecha com Escape e restaura foco; controles mantêm área de toque utilizável.
- Kanban e tabelas usam overflow localizado; conteúdo não é removido por breakpoint.
- `prefers-reduced-motion` reduz transições e shimmer; cor nunca é o único indicador de estado.
- Erros e ausência de acesso são seguros e não enumeram dados de outro tenant.

## Evidência automatizada

Lint, TypeScript, build e a suíte de testes passam. O smoke E2E cobre login, navegação autenticada, breakpoints 1440/768/390, ausência de overflow horizontal e interação de menu por teclado.

## P2 / gate humano

- Confirmar zoom nativo de 200% em navegador real após login; a checagem de reflow a 390 px não substitui esse teste.
- Percorrer a tela de Aprovações autenticada com leitor de tela antes do deploy. Não há P0/P1 identificado nesta revisão.
