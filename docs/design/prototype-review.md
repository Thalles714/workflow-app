# Revisão visual e de acessibilidade dos protótipos

> PROMPT 02 · 8 de agosto de 2026  
> Direção aprovada para revisão: **variante A — Decisão primeiro**  
> Parecer técnico: **aprovado com zero P0/P1 aberto; aprovação humana pendente**

## Ajuste cromático solicitado após a primeira revisão

Após o feedback de excesso de branco, as dez telas receberam a linguagem **Workflow Alloy**, baseada nas referências normativas `assets/design_system/design_system3.1.html` e `assets/design_system/design_system11.html`.

- O canvas branco foi substituído por platinum/alumínio com campos de luz suaves.
- A hero preserva a variante A e ganhou um campo azul–íris–aqua, sem alterar conteúdo ou fluxo.
- Cada contexto recebeu uma tonalidade funcional: aqua para clientes/entregas, azul–íris para projetos, coral/champagne para tarefas e decisões.
- Cards, tabelas, colunas Kanban, inputs e estados agora usam superfícies translúcidas e alternância cromática controlada.
- Contrastes medidos: ink/canvas 15,64:1; texto auxiliar/canvas 4,64:1; branco/cobalt 4,56:1; cores semânticas sobre seus fundos entre 5,31:1 e 5,90:1.
- As dez telas foram novamente testadas em três larguras — 30 combinações — sem overflow global ou estado duplicado.

## Resultado

As dez telas foram revisadas como um único fluxo em 1440 × 900, 768 × 1024 e 390 × 844. Os defeitos P1 encontrados foram corrigidos e retestados. Não há P0 ou P1 aberto. A variante A foi consolidada como a única hero do Painel; B e C foram removidas para não criarem uma fonte visual paralela.

O fluxo dourado continua navegável: Login → Painel → Clientes → Cliente → Projeto → Entrega → Tarefa → Painel → Aprovações. Meu Trabalho e Acesso não disponível também abrem diretamente e retornam a um ponto seguro.

## Achados e correções

| Severidade | Achado | Correção | Reteste |
|---|---|---|---|
| P1 | Headline da hero sobrepunha conteúdo em 1440 px | Limite de largura, escala fluida e `line-height` ajustados | Passou nos três viewports |
| P1 | Texto auxiliar e navegação tinham densidade pequena demais | Tipos funcionais elevados sem alterar os tokens ou a hierarquia | Legível em 1440/768/390 |
| P1 | Abas não respondiam a setas e não ligavam aba/painel | Adicionados roving tabindex, `aria-controls`, `aria-labelledby`, Arrow Left/Right, Home e End | Seleção, foco e painel sincronizados |
| P1 | Menu móvel abria sem levar foco ao conteúdo | Abertura foca o primeiro link; Escape fecha e devolve foco ao botão | Passou por teclado a 390 px |
| P1 | Entrada de página chegava a 500 ms e hover era aplicado indiscriminadamente | Entrada ornamental removida; hover limitado a 160–300 ms e dispositivos com hover fino | Reduced motion preservado; sem movimento frequente |
| P1 | Alguns botões e breadcrumbs dependiam de marcação incompleta | Botões sem tipo recebem `type=button`; breadcrumbs recebem nome acessível | Sem alteração da navegação ou submissão |

## Evidência por largura

| Largura | Resultado observado |
|---|---|
| 1440 × 900 | Sidebar fixa, hero sem colisão, grades e Radar de Atenção preservados; sem overflow do body |
| 768 × 1024 | Sidebar compacta, hero e detalhes refluem; sem overflow do body |
| 390 × 844 | Menu móvel funcional, conteúdo em coluna única; overflow restrito a componentes largos |

Capturas reproduzíveis:

- `prototypes/screenshots/operation-1440.png`
- `prototypes/screenshots/operation-768.png`
- `prototypes/screenshots/operation-390.png`

## Estados e fluxo

Cada uma das dez telas contém exatamente os cinco estados demonstráveis: `normal`, `loading`, `empty`, `error` e `denied`. O seletor mantém um único painel ativo e registra o estado na URL. Os estados de erro e acesso negado combinam texto, ícone e ação — cor não é o único sinal.

O percurso automatizado confirmou em todas as telas: título, `main`, skip link nas telas autenticadas, um único estado ativo, ausência de overflow global e zero erro no console. Links relativos foram resolvidos no disco sem destino ausente.

## Teclado, foco e movimento

- Skip link, links, ações e campos usam ordem natural de foco.
- Abas aceitam clique, setas, Home e End; apenas a aba ativa entra no percurso principal.
- Menu móvel anuncia `aria-expanded`, move foco ao abrir e o devolve ao fechar com Escape.
- Feedback transitório usa `role=status`.
- `prefers-reduced-motion: reduce` reduz animações e transições a duração praticamente nula e interrompe o shimmer.
- Hover é condicionado a `(hover: hover) and (pointer: fine)`; propriedades animadas limitam-se a transformação/estado visual.

### Parecer de movimento

| Elemento | Antes | Depois | Motivo |
|---|---|---|---|
| Entrada de conteúdo | Fade/slide escalonado de até 500 ms | Sem animação automática | Conteúdo operacional deve estar disponível imediatamente |
| Botão principal | Elevação em qualquer dispositivo | Elevação de 1 px apenas com hover fino | Evita movimento fantasma em touch |
| Sinal do Radar | Deslocamento em qualquer dispositivo | Deslocamento de 4 px apenas com hover fino | Mantém relação clara entre gesto e resposta |
| Loading skeleton | Shimmer contínuo | Shimmer somente em loading e desativado em reduced motion | Comunica atividade sem movimento obrigatório |

**Veredito de movimento: aprovado.**

## Validações executadas

- JavaScript validado com `node --check`.
- Dez HTMLs inspecionados; cinco estados presentes em cada um.
- Links locais verificados sem destino quebrado.
- Fluxo dourado percorrido no navegador; console sem erros.
- Body sem overflow horizontal em 1440, 768 e 390 px.
- Tabs e menu móvel retestados somente por teclado.
- Busca por marcadores vagos de implementação sem ocorrências; os `placeholder` encontrados são instruções reais de campos.
- O diretório ainda não é um repositório Git local; por isso `git diff --check` e o commit sugerido não são aplicáveis. O repositório remoto informado não foi alterado.

## Dívida P2 e revisão humana

| Item | Impacto | Decisão |
|---|---|---|
| Zoom nativo de 200% não foi acionável pela automação do navegador | Reflow a 390 px passou, mas não substitui totalmente o zoom do navegador | Confirmar manualmente antes da aprovação |
| Fontes são solicitadas ao Google Fonts | Com rede bloqueada, fallbacks preservam leitura, mas há pequena variação métrica | Aceito no protótipo; app real deve decidir política de fonte local |
| Barra de estados flutua sobre a demonstração | Pode cobrir uma faixa pequena enquanto fixa; não pertence ao produto real | Aceito como ferramenta exclusiva do protótipo |

## Instrução de revisão humana

1. Inicie um servidor estático na raiz com `python -m http.server 4173 --bind 127.0.0.1`.
2. Abra `http://127.0.0.1:4173/prototypes/login/` e percorra o fluxo dourado sem mouse.
3. No Painel, alterne os cinco estados pela barra inferior.
4. Aplique zoom de 200% no navegador e confirme que nenhum texto ou ação essencial fica oculto.
5. Compare a execução com as três capturas acima.

Se o resultado estiver de acordo, responda exatamente **“protótipos aprovados”**. Caso contrário, informe a tela, largura/zoom, estado e mudança desejada. O PROMPT 03 não deve começar antes dessa frase explícita.
