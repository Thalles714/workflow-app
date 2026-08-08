# Fundação da aplicação

> Fase: PROMPT 03
> Escopo: infraestrutura local mínima, sem domínio funcional

## Decisões aplicadas

- Aplicação única Next.js App Router com React e TypeScript estrito.
- Server Components por padrão; não existe Client Component nesta fundação.
- Tailwind CSS 4 via PostCSS, sem UI kit ou plugin de componentes.
- Vitest cobre lógica pura; Playwright possui um smoke navegável em `/health`.
- ESLint usa as regras oficiais do Next.js; Prettier padroniza arquivos mantidos pela aplicação.
- `src/features` e `src/server` documentam as fronteiras que receberão domínio e infraestrutura.

## Dependências e justificativas

| Grupo     | Dependências                               | Motivo                                                |
| --------- | ------------------------------------------ | ----------------------------------------------------- |
| Runtime   | `next`, `react`, `react-dom`               | App Router e renderização React em um único app       |
| Estilo    | `tailwindcss`, `@tailwindcss/postcss`      | Composição visual própria derivada dos protótipos     |
| Tipos     | `typescript`, `@types/*`                   | Contratos estritos e suporte ao runtime               |
| Qualidade | `eslint`, `eslint-config-next`, `prettier` | Regras oficiais e formatação reproduzível             |
| Testes    | `vitest`, `@playwright/test`               | Smoke unitário rápido e configuração E2E do navegador |

Nenhum pacote de banco, autenticação, validação, UI, formulário, estado ou observabilidade foi
adicionado; essas decisões pertencem às próximas fases.

## Rotas locais

- `/`: informa que a fundação está ativa.
- `/health`: expõe uma verificação visual e determinística, sem consultar serviços externos.

## Handoff

O PROMPT 04 poderá introduzir banco e autenticação seguindo os ADRs existentes. A página local não
é uma tela final do produto e poderá ser substituída somente quando o shell aprovado for criado.
