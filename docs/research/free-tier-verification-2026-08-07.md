# Verificação de planos gratuitos para o Workflow

**Objetivo.** Confirmar, em fontes oficiais e em **7 de agosto de 2026**, se a infraestrutura proposta para o Workflow — um SaaS de portfólio pessoal, demonstrável por recrutadores e sem pretensão de operação comercial — pode funcionar com orçamento de **US$ 0 / R$ 0**, sem depender de trial pago ou de cartão para a função essencial.

**Conclusão executiva.** A combinação **GitHub Free + GitHub Actions + Vercel Hobby + Supabase Free** é adequada para o MVP de portfólio. Ela fornece repositório, CI, deploy Next.js, PostgreSQL e autenticação sem custo recorrente dentro das cotas. O uso deve permanecer pessoal e não comercial para respeitar o Vercel Hobby. O maior risco prático é o Supabase pausar o projeto após uma semana de inatividade; o roteiro de demonstração deve prever reativação antes de entrevistas. Como contingência, **Cloudflare Pages/Workers + Supabase** preserva banco e autenticação e troca apenas a hospedagem; **Cloudflare Pages/Workers + Neon Free** é possível quando se aceita implementar ou integrar autenticação separadamente.

> Planos e cotas podem mudar. Revalidar esta página antes da publicação e a cada seis meses. Não cadastrar cartão, não ativar trial Pro e não habilitar uso pago/overage para cumprir o orçamento.

## Stack principal recomendada

| Serviço | Função no Workflow | Gratuidade e limites relevantes confirmados | Risco e mitigação |
| --- | --- | --- | --- |
| **Vercel Hobby** | Hospedar a aplicação Next.js e gerar subdomínio gratuito | O Hobby é gratuito e voltado a projetos pessoais. Inclui integração Git, CI/CD, HTTPS, preview deploys, **100 GB de transferência rápida**, até **1 milhão de Edge Requests**, **1 milhão de invocações de Functions**, **4 CPU-h**, **360 GB-h de memória provisionada**, **6.000 minutos de build**, 100 deploys/dia e 200 projetos. Functions têm duração configurável dentro dos limites do plano; os runtime logs ficam retidos por apenas 1 hora. Ao exceder cotas do Hobby, o recurso ou plano pode ser pausado, em vez de gerar cobrança automática. [Plano Hobby](https://vercel.com/docs/plans/hobby) · [Planos e comportamento ao exceder uso](https://vercel.com/docs/plans) · [Limites gerais](https://vercel.com/docs/limits) | **Uso pessoal e não comercial somente.** O projeto é explicitamente de portfólio, portanto compatível; não usar para uma agência real ou serviço vendido. Não ativar o trial Pro. Monitorar a página Usage, manter funções curtas e evitar analytics/otimização de imagens desnecessários. Uma conta Hobby não conecta projeto a repositório pertencente a organização GitHub; manter o repositório na conta pessoal ou usar a contingência Cloudflare. |
| **Supabase Free** | PostgreSQL, Auth e RLS no mesmo provedor | O plano custa **US$ 0/mês**, permite **2 projetos ativos**, PostgreSQL com **500 MB de tamanho de banco por projeto** (1 GB de disco, mas read-only a partir da cota de 500 MB), **5 GB de egress**, Auth com **50.000 MAU**, 1 GB de Storage, 500.000 Edge Function invocations, 2 milhões de mensagens Realtime e 200 conexões Realtime de pico. API requests são ilimitadas, mas continuam sujeitas aos demais recursos/cotas. [Preços e comparação](https://supabase.com/pricing) · [Billing e cotas](https://supabase.com/docs/guides/platform/billing-on-supabase) · [Comportamento do tamanho do banco](https://supabase.com/docs/guides/platform/database-size) | Projetos Free **pausam após 1 semana de inatividade**, não têm backups automáticos/PITR nem SLA, e logs de API/banco duram 1 dia. Reativar antes da demo, manter migrations e seed idempotente versionados, exportar backup manual antes de mudanças relevantes e não usar Storage/Realtime no MVP. O limite de 500 MB é amplo para dados fictícios textuais, mas deve ser monitorado. |
| **GitHub Free** | Repositório, histórico público de portfólio, issues e integração com deploy | GitHub Free inclui repositórios públicos e privados. Para o portfólio, um repositório público torna o histórico e o código acessíveis e também libera Actions em runners padrão sem cobrança de minutos. [GitHub Pricing](https://github.com/pricing) · [Uso incluído por plano](https://docs.github.com/en/billing/reference/product-usage-included) | Manter segredos fora do Git, habilitar proteção contra push de segredos e publicar somente dados fictícios. Se o repositório precisar permanecer privado, aplicar as cotas de Actions abaixo. |
| **GitHub Actions** | CI de lint, types, testes e build | Em repositórios públicos, runners padrão hospedados pelo GitHub são gratuitos. Em repositórios privados no GitHub Free, há **2.000 minutos/mês**, **500 MB de artifacts** compartilhados com Packages e **10 GB de cache por repositório**. Sem método de pagamento, o uso é bloqueado ao acabar a cota; não há cobrança. Runners maiores são sempre pagos e não devem ser usados. [Billing oficial do GitHub Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | Preferir `ubuntu-latest`, um workflow enxuto, cache pequeno e artifacts com retenção curta. Não cadastrar método de pagamento; assim, eventual excesso interrompe CI em vez de cobrar. Para repositório público, evitar ações de terceiros não fixadas e proteger secrets em PRs externos. |

## Adequação ao MVP

As cotas são muito superiores à carga esperada de um portfólio: poucos usuários demo, dados majoritariamente textuais, uma única aplicação e tráfego episódico. O MVP não deve adicionar upload de arquivos, Realtime, WebSockets, analytics externo, jobs longos ou IA generativa. Essas exclusões reduzem consumo, superfície de segurança e dependência de produtos pagos.

O subdomínio gratuito da Vercel satisfaz o requisito de não comprar domínio. Supabase reúne banco e autenticação, reduzindo integrações. O CI público do GitHub evita consumo da cota privada. Nenhuma função essencial depende de upgrade: ao atingir limites sem cartão, o serviço gratuito tende a pausar ou bloquear uso, o que preserva custo zero, embora possa causar indisponibilidade.

## Contingência gratuita A: Cloudflare Pages/Workers + Supabase

Esta é a primeira alternativa porque mantém PostgreSQL, Auth e RLS no Supabase e substitui somente a hospedagem. Cloudflare Pages Free permite **500 builds/mês**, um build simultâneo, timeout de build de 20 minutos, 100 projetos por conta, 20.000 arquivos por site, 25 MiB por arquivo e previews ilimitados. Pages Functions consomem a cota de Workers. [Limites oficiais do Pages](https://developers.cloudflare.com/pages/platform/limits/)

No Workers Free há **100.000 requests/dia**, com reset à meia-noite UTC; o plano Free é o padrão e Pages Functions compartilham suas cotas. [Limites do Workers](https://developers.cloudflare.com/workers/platform/limits/) · [Preços do Workers](https://developers.cloudflare.com/workers/platform/pricing/)

**Trade-off.** A migração de Next.js exige validar a compatibilidade do runtime e adaptar o deploy ao ecossistema Workers/OpenNext. Não escolher esta opção apenas por cotas maiores: Vercel é o caminho mais simples para Next.js. Usar Cloudflare quando o Vercel Hobby deixar de ser elegível, bloquear a integração Git desejada ou alterar materialmente suas condições gratuitas.

## Contingência gratuita B: Cloudflare Pages/Workers + Neon Free

Neon Free custa **US$ 0**, não tem prazo e declara explicitamente **não exigir cartão**. Em 07/08/2026, oferece 100 projetos, **100 CU-h mensais por projeto**, **0,5 GB de storage por projeto**, autoscaling/scale-to-zero, tamanho de compute de até 2 CU, branching/read replicas, restauração de 6 horas e Neon Auth com 60 mil MAU. [Pricing oficial do Neon](https://neon.com/pricing)

**Trade-off.** Embora o banco seja uma alternativa concreta ao PostgreSQL do Supabase, trocar Supabase por Neon também exige uma decisão de autenticação e a reimplementação das políticas equivalentes a RLS/integração Auth. Para este projeto, Neon é contingência de banco, não a primeira escolha. Só migrar com teste explícito de autorização multi-tenant e sem adicionar um serviço de autenticação pago. Se Neon Auth atender aos requisitos quando a migração ocorrer, revalidar seus limites e segurança naquela data; caso contrário, usar autenticação própria baseada em sessão com biblioteca open source e e-mail demo dispensável.

## Regras para preservar custo zero

- Criar apenas planos **Free/Hobby**; recusar trials Pro e add-ons.
- Não cadastrar cartão nem método de pagamento. No GitHub, a documentação confirma que, sem método válido, Actions é bloqueado ao consumir a cota em vez de gerar overage. [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- Usar repositório público pessoal para Actions gratuitos e compatibilidade com Vercel Hobby; nunca expor secrets.
- Configurar alertas de uso quando disponíveis e revisar dashboards antes de demonstrações.
- Reativar o Supabase e executar smoke test da URL com antecedência; não prometer disponibilidade contínua.
- Manter migrations, seed idempotente e instruções locais para que uma indisponibilidade de free tier não torne o portfólio irreproduzível.
- Revalidar termos, cotas e exigência de cartão antes do deploy. A ausência de uma afirmação oficial explícita sobre cartão em Vercel ou Supabase não deve ser convertida em garantia: se o cadastro exigir cartão, cancelar e usar a contingência que cumpra US$ 0 sem cartão.

## Decisão recomendada e gatilhos

1. **Agora:** GitHub público + Actions padrão + Vercel Hobby + Supabase Free.
2. **Antes de cada demo:** confirmar que Supabase está ativo, rodar migrations/seed se necessário e executar smoke test do fluxo dourado.
3. **Migrar hospedagem para Cloudflare** se o projeto deixar de cumprir o uso pessoal do Hobby, se Vercel exigir pagamento/cartão para a função essencial, ou se uma mudança de limite impedir a demo.
4. **Migrar banco para Neon** somente se Supabase Free deixar de atender banco/Auth sem pagamento ou se as pausas se tornarem inaceitáveis; tratar autenticação e autorização como parte obrigatória da migração.
5. **Nunca contornar limites criando contas.** Se a carga real exceder o free tier, reduzir o escopo/tráfego da demo ou manter apenas a execução local; o orçamento continua sendo uma restrição de produto.

## Escopo da verificação

Fontes consultadas são páginas oficiais de Vercel, Supabase, GitHub, Cloudflare e Neon, acessadas em 07/08/2026. Valores monetários e limites foram registrados apenas quando publicados pelos próprios provedores. Esta verificação não garante permanência futura do plano, disponibilidade ou aprovação de cadastro; documenta a adequação conhecida na data indicada.
