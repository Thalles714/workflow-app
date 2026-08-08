# Workflow — case de portfólio

## Problema

Pequenas agências precisam acompanhar várias entregas sem transformar a operação em uma coleção de planilhas e conversas desconectadas. O problema central não é a ausência de uma lista de tarefas; é a falta de contexto e de prioridade quando algo ameaça uma entrega.

## Decisão de produto

O Workflow usa uma hierarquia fixa — Workspace → Cliente → Projeto → Entrega → Tarefa — e uma Central de Atenção baseada em regras determinísticas. Cada alerta explica o motivo, apresenta evidência temporal e aponta para o item correto. Isso mantém a demonstração objetiva e evita um score opaco.

## Decisão técnica

O núcleo é composto por módulos profundos: cada módulo de domínio concentra schema, repositório, serviço e testes atrás de uma interface pequena. A seam de autorização fica antes de qualquer leitura ou escrita; `workspaceId`, ator e papel são derivados no servidor, e RLS oferece uma segunda camada no banco.

## Qualidade demonstrada

- Migrations SQL incrementais, constraints e seed idempotente.
- Dois tenants reais nos testes negativos para cobrir IDOR e acesso cross-tenant.
- Regras de atenção puras com relógio/timezone injetáveis.
- E2E de login, hierarquia, atualização, alerta e aprovação.
- Shell responsivo, landmarks, foco, teclado e reduced motion.

## Demonstração pública

`/demo` é uma visualização estática e somente leitura dos dados fictícios da Agência Aurora. É uma escolha deliberada: recrutadores podem avaliar o produto imediatamente sem receber uma credencial compartilhada, enquanto o núcleo autenticado permanece protegido por Auth, autorização e RLS.

## Próxima versão oficial

Antes de atender empresas reais, a evolução necessária inclui:

1. Convites e identidade verificável por e-mail.
2. Ambiente de staging isolado, rate limiting no edge e observabilidade operacional.
3. Política de privacidade, retenção, backup e suporte.
4. Billing, limites de plano e governança de workspaces.
5. Monitoramento de uso/custos e plano de disponibilidade fora dos free tiers.

O projeto não afirma que esses recursos já existem. A intenção é mostrar uma base organizada, segura e evolutiva para chegar a eles.
