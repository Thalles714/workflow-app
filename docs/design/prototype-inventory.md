# Inventário dos protótipos — Workflow

> Fase: PROMPT 01 — prototipação visual estática
>
> Pergunta respondida: “A primeira experiência comunica onde agir antes de apresentar o restante da operação?”

## Direção visual

**Conceito:** sala de controle editorial em white metal. A interface combina a hierarquia operacional do Workflow com superfícies platinum/alumínio e sinais cromáticos derivados de `design_system3.1.html` e `design_system11.html`: decisão antes de métrica, exceção antes de volume e contexto antes de ação.

**Trabalho único da tela principal:** dizer, em poucos segundos, quantas situações exigem decisão, qual vem primeiro e por quê.

**Assinatura:** campos cromáticos de contexto + Radar de Atenção. Cada área recebe uma tonalidade suave e reconhecível; a trilha vertical ordena exceções por severidade e liga cada sinal ao registro afetado. Cor orienta contexto, mas nunca substitui texto, ícone ou posição.

### Tokens usados

| Papel | Token/valor |
|---|---|
| Canvas | `#E6EAF0`, com campos cromáticos contextuais |
| Surface | `#F7F8FA` / glass branco translúcido |
| Ink | `#101114` |
| Primary | Cobalt `#0A6CFF` |
| Secondary | Iris `#8D7CFF` |
| Accent | Aqua `#5AD8C8` / Champagne `#D7B878` / Coral `#FF6B4A` |
| Success | `#0F704B` / `#E5F6EF` |
| Warning | `#875104` / `#FFF2D8` |
| Error | `#B52F3D` / `#FFEAED` |
| Display/UI | Plus Jakarta Sans |
| Body | Inter |
| Dados/labels | JetBrains Mono |
| Espaçamento | escala de 4 px, ritmo predominante de 8 px |
| Raios | 10, 16 e 28 px |
| Movimento | 160–300 ms, `cubic-bezier(.23,1,.32,1)`; removido em reduced motion |

As fontes são solicitadas do Google Fonts com fallbacks de sistema. O conteúdo e a navegação continuam utilizáveis se a rede não carregar as fontes.

## Hero aprovada para revisão

**Variante A — Decisão primeiro**, escolhida pelo usuário em 8 de agosto de 2026. As variantes exploratórias B e C foram removidas dos protótipos para que a revisão e a futura implementação tenham uma única fonte visual. Abra `prototypes/operation/index.html?state=normal`.

A composição mantém a primeira decisão em destaque, oferece contexto em três resumos e conduz diretamente ao Radar de Atenção. O gate humano restante avalia a execução do conjunto dos protótipos, não reabre a escolha da variante.

## Arquivos e telas

| # | Diretório | Papel da tela | Próxima ação principal |
|---|---|---|---|
| 1 | `prototypes/login/index.html` | Acesso e tese do produto | Abrir demonstração |
| 2 | `prototypes/operation/index.html` | Hero principal, painel e Central de Atenção | Resolver item crítico |
| 3 | `prototypes/my-work/index.html` | Trabalho pessoal priorizado | Abrir tarefa atrasada |
| 4 | `prototypes/clients/index.html` | Carteira enxuta de clientes | Abrir Órbita |
| 5 | `prototypes/client/index.html` | Contexto do cliente e projetos | Abrir Lançamento Q3 |
| 6 | `prototypes/project/index.html` | Visão geral, Kanban e Lista | Abrir Landing page/tarefa |
| 7 | `prototypes/deliverable/index.html` | Resultado, progresso, tarefas e aprovação | Abrir tarefa bloqueada |
| 8 | `prototypes/task/index.html` | Editar estado, bloqueio e atualização | Salvar/resolver bloqueio |
| 9 | `prototypes/approvals/index.html` | Decisões internas | Aprovar entrega |
| 10 | `prototypes/access-denied/index.html` | 403/404 seguro, sem enumeração | Voltar ao Painel |

Assets compartilhados:

- `prototypes/assets/styles.css`: tokens, primitives, layout, responsividade, estados e movimento.
- `prototypes/assets/prototype.js`: shell, navegação, estados, tabs, menu mobile, Escape e feedback transitório.

## Fluxo dourado navegável

```text
Login
  → Painel da Operação
  → Clientes
  → Órbita Tecnologia
  → Lançamento Q3
  → Landing page
  → Revisar formulário
  → Painel / Radar de Atenção
  → Aprovações
```

Meu Trabalho e Acesso não disponível também estão presentes na navegação e podem ser abertos em qualquer ponto.

## Inventário de componentes

### Navegação

- Skip link
- Marca e workspace switcher
- Sidebar desktop e topbar/menu mobile
- Links com estado atual e contagem
- Breadcrumbs
- Tabs com `role=tablist`, `role=tab` e `aria-selected`
- Barra de controle do protótipo, visualmente separada do produto

### Ações e entrada

- Botões primary, brand, secondary, ghost e icon button
- Input, search, select e textarea com label/helper
- Botão desabilitado de aprovação ainda indisponível
- Toast com `role=status`

### Dados e feedback

- Card, metric card, progress bar, badge e avatar
- Radar de Atenção e signal card por severidade
- Tabela responsiva com wrapper horizontal
- Kanban com quatro colunas fixas e overflow localizado
- Loading skeleton sem salto de layout
- Empty, error e denied states com ação de recuperação

### Composições

- Hero operacional na variante A aprovada
- Meu Trabalho em quatro grupos
- Lista de clientes e projetos
- Detalhe em conteúdo + contexto lateral
- Aprovação interna
- Resposta segura 403/404

## Matriz de estados

Todas as telas aceitam `?state=normal|loading|empty|error|denied` pela barra inferior.

| Tela | Normal | Loading | Empty | Error | Denied |
|---|:---:|:---:|:---:|:---:|:---:|
| Login | ✓ | ✓ | sessão encerrada | credencial/configuração | workspace indisponível |
| Painel | ✓ | ✓ | operação saudável | falha de leitura | somente ADMIN |
| Meu Trabalho | ✓ | ✓ | tudo em dia | falha de leitura | sessão expirada |
| Clientes | ✓ | ✓ | primeiro cliente | falha de leitura | sem gestão |
| Cliente | ✓ | ✓ | sem projetos | falha de leitura | 404/tenant |
| Projeto | ✓ | ✓ | sem tarefas | falha de leitura | 404/tenant |
| Entrega | ✓ | ✓ | sem tarefas | falha de leitura | 404/tenant |
| Tarefa | ✓ | ✓ | sem updates | validação/salvamento | 404/tenant |
| Aprovações | ✓ | ✓ | sem pendências | falha de leitura | papel insuficiente |
| Acesso não disponível | 403 seguro | ✓ | 404 | erro seguro | permissão insuficiente |

## Acessibilidade incorporada

- Idioma `pt-BR`, títulos únicos e `main` identificável.
- Skip link e foco global de alto contraste.
- Navegação por links reais; botões usam `type=button` quando aplicável.
- Labels persistentes; erros não dependem somente de cor.
- Severidade aparece por texto, cor e posição.
- Tabelas usam cabeçalhos; conteúdo largo fica em região com overflow próprio.
- Menu mobile anuncia `aria-expanded`, fecha com Escape e devolve foco ao botão.
- Tabs atualizam `aria-selected`; painéis não ativos usam `hidden`.
- Reduced motion desativa animações e transições; contraste aumentado reforça borders/texto.
- Controles do protótipo não interceptam setas dentro de inputs, textareas e selects.

## Breakpoints e comportamento

| Largura | Comportamento esperado |
|---|---|
| 1440 px | Sidebar fixa, hero ampla, grids de 3/4 colunas e detalhes com aside |
| 768 px | Sidebar ainda disponível até 760 px; grids reduzem, details passam a uma coluna |
| 390 px | Sidebar vira menu, conteúdo usa 12 px laterais, grids em uma coluna, Kanban/tabelas têm overflow localizado |

## Checklist visual para o PROMPT 02

- [x] Variante A escolhida pela clareza da primeira decisão; variantes B e C removidas.
- [ ] Confirmar que a hero explica valor sem parecer landing page pública.
- [ ] Percorrer o fluxo dourado sem usar a barra do navegador.
- [ ] Abrir os cinco estados de cada tela pela barra inferior.
- [ ] Verificar 1440 × 900, 768 × 1024 e 390 × 844.
- [ ] Navegar somente por teclado; observar skip link, tabs e menu mobile.
- [ ] Confirmar que nenhum controle fica atrás da barra de protótipo.
- [ ] Testar zoom 200% e `prefers-reduced-motion: reduce`.
- [ ] Observar overflow apenas dentro de Kanban/tabelas, nunca no body.
- [ ] Confirmar que toda ação mantém contexto Cliente → Projeto → Entrega → Tarefa.

## Instruções de abertura

Opção direta: abra qualquer `index.html` no navegador. Para evitar restrições locais de fontes/JavaScript, sirva a raiz do projeto:

```powershell
cd C:\Users\Administrator\Projects\workflow
python -m http.server 4173 --bind 127.0.0.1
```

Depois abra:

- `http://127.0.0.1:4173/prototypes/login/`
- `http://127.0.0.1:4173/prototypes/operation/?state=normal`

## Evidência da revisão visual

O navegador interno alcançou o servidor local e os protótipos foram inspecionados em 1440 × 900, 768 × 1024 e 390 × 844. As capturas estão em `prototypes/screenshots/`. O zoom nativo de 200% não pôde ser alterado pela automação do navegador; permanece como confirmação humana, complementada pelo teste de reflow sem overflow a 390 px.
