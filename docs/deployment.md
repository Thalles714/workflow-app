# Publicação gratuita do Workflow

**Revalidado em 8 de agosto de 2026.** Esta instrução é para o portfólio pessoal Workflow, não para uma agência em operação comercial. O caminho previsto é **GitHub Actions + Vercel Hobby + Supabase Free**, com custo projetado de **R$ 0** enquanto as cotas e as regras dos provedores forem respeitadas.

## Publicação atual

- **URL:** [workflow-app-lac.vercel.app](https://workflow-app-lac.vercel.app)
- **Experiência pública:** `/demo`, estática, fictícia e somente leitura.
- **Login demonstrativo:** `/demo/login`, sem envio de e-mail ou criação de sessão.
- **Banco público:** não utilizado pela demonstração atual.
- **Entrega:** pushes verdes em `main` acionam o deploy integrado da Vercel.

As instruções de Supabase abaixo descrevem a futura publicação do fluxo autenticado. Elas não são necessárias para manter a demonstração pública atual no ar.

## Estado e fronteiras

- O pipeline versionado em [`.github/workflows/quality.yml`](../.github/workflows/quality.yml) executa formatação, lint, tipos, testes e build em `pull_request` e em `main`.
- Ele usa apenas valores de compilação fictícios e não possui segredos nem permissões para publicar.
- Uma publicação ou alteração na nuvem requer autorização explícita do responsável pela conta. Não use trial Pro, complemento pago, cartão ou domínio pago.
- O deploy de produção deve ser feito somente a partir de um commit cujo workflow **Quality** esteja verde. O repositório deve permanecer pessoal/público para manter a elegibilidade prevista do Vercel Hobby e Actions gratuitas.

## Limites e alternativas

| Serviço             | Situação gratuita conferida                       | Limite operacional relevante                                                                 | Ação ao atingir limite                                                    |
| ------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Vercel Hobby        | US$ 0 para projetos pessoais e não comerciais     | 100 GB de transferência, 6.000 min. de build/mês; recursos podem pausar ao exceder cota      | Não habilitar cobrança. Pausar a demo ou usar a alternativa Cloudflare.   |
| Supabase Free       | US$ 0; até dois projetos ativos                   | 500 MB de banco, 50 mil MAU, 5 GB de egress/cached e pausa após sete dias de baixa atividade | Reativar no painel antes da demo; manter migrations/seed e backup manual. |
| GitHub Free/Actions | gratuito em repositório público com runner padrão | repositório privado tem 2.000 min./mês e 500 MB de artifacts                                 | Não usar runner maior; sem cartão, a execução bloqueia ao exceder a cota. |

Fontes oficiais consultadas nesta data: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [planos Vercel](https://vercel.com/docs/plans), [preços Supabase](https://supabase.com/pricing), [pausa de projeto Supabase](https://supabase.com/docs/guides/platform/free-project-pausing) e [cobrança do GitHub Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions). Como o Hobby restringe uso a projetos pessoais/não comerciais, Cloudflare Pages/Workers + Supabase é a alternativa gratuita caso essa condição deixe de ser verdadeira; detalhes constam em [`docs/research/free-tier-verification-2026-08-07.md`](./research/free-tier-verification-2026-08-07.md).

## Ambientes e variáveis

Desenvolvimento, teste/staging e produção são isolados. Nunca copie um URL ou chave de produção para preview.

| Ambiente | Projeto Supabase                              | Uso na Vercel | Variáveis necessárias         |
| -------- | --------------------------------------------- | ------------- | ----------------------------- |
| Local    | Supabase CLI/Docker                           | `pnpm dev`    | `.env.local` (não versionado) |
| Preview  | segundo projeto Supabase Free, se configurado | Preview       | suas próprias três variáveis  |
| Produção | projeto Supabase Free principal               | Production    | suas próprias três variáveis  |

Cadastre em cada ambiente de hospedagem apenas estes nomes:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

As duas variáveis Supabase com prefixo `NEXT_PUBLIC_` são deliberadamente públicas e podem chegar ao navegador; a proteção dos dados continua em Auth, RLS e autorização server-side. **Nunca** cadastre `SUPABASE_SERVICE_ROLE_KEY` na Vercel, no GitHub Actions ou no navegador. Enquanto não houver um projeto Supabase separado para Preview, não configure essas três variáveis em Preview: a aplicação falhará de forma segura, em vez de tocar a produção.

## Checklist de publicação (ação externa autorizada)

1. Confirme que `main` contém o commit verde de Quality e que o diretório de trabalho não tem alterações não revisadas.
2. Crie (ou selecione) o projeto **Supabase Free de produção**, sem cartão e sem plano/trial pago. Anote apenas o _project ref_ fora do Git; nunca cole tokens em arquivos.
3. Aplique migrations versionadas ao projeto correto, a partir da máquina autorizada:

   ```powershell
   supabase link --project-ref <project-ref-de-producao>
   supabase db push
   ```

   Confirme o projeto no CLI antes de aceitar o push. O seed de recrutador é para demonstração e deve ser aplicado ao ambiente de demo apenas conforme a política definida; não substitua dados de outro ambiente com `db reset` remoto.

4. Crie/importe o repositório pessoal na Vercel em **Hobby**, recusando trial Pro. Configure as três variáveis de Production. Não habilite Preview com Supabase de produção.
5. Faça o primeiro deploy pela integração Git da Vercel ou pelo painel. A URL gratuita da plataforma é o domínio público; não compre nem configure domínio próprio.
6. Copie essa URL para `NEXT_PUBLIC_APP_URL` na Production da Vercel e em **Supabase Auth → URL Configuration**:

   - `Site URL`: `<url-publica>`
   - `Redirect URLs`: `<url-publica>/auth/callback`

   Faça um novo deploy após qualquer alteração de variável. O callback de magic link depende dessa coincidência exata.

7. Rode o smoke abaixo em janela anônima e em largura móvel. Consulte os logs da Vercel e Supabase somente para erros necessários, sem copiar tokens ou links mágicos em tickets/commits.

## Smoke de produção

1. Abra `<url-publica>/login` e confirme carregamento sem erro de configuração.
2. Solicite login da conta demo menos privilegiada e conclua o link mágico.
3. Verifique **Meu Trabalho**, abra **Lançamento Q3**, altere uma tarefa permitida e confirme retorno seguro à tela.
4. Verifique que um membro não recebe controles administrativos e que logout retorna a `/login`.
5. Em viewport de 390 px, abra a navegação e repita a abertura do projeto.
6. Confirme nos headers `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy`; confirme que logs não contêm service role, token ou link mágico.

## Migrações, rollback e operação

Migrations são somente incrementais e versionadas em `supabase/migrations`. Não há rollback destrutivo em produção: para corrigir o esquema, escreva uma **nova migration forward**, valide em Preview/local e então aplique com `supabase db push` ao projeto de produção autorizado.

Para reverter a aplicação, selecione na Vercel um deployment anteriormente verde e use **Promote to Production** (ou faça redeploy do commit correspondente). Se esse código depender de uma migration já aplicada, preserve a compatibilidade ou publique primeiro uma migration forward corretiva. Registre no relatório o commit, URL, horário e motivo; não reescreva Git.

Antes de cada demonstração, confira no painel do Supabase se o projeto está ativo — o Free pode pausar após inatividade —, faça o smoke de login e observe a página Usage da Vercel. A retenção de logs do Hobby é curta; para um incidente, capture apenas evidências sem dados de autenticação.
