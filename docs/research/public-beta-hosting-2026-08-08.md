# Hospedagem gratuita para beta pública — verificação em 08/08/2026

## Decisão resumida

Para **portfólio e demonstração pública somente leitura**, o arranjo atual — repositório público no GitHub, GitHub Actions e Vercel Hobby — continua viável a custo recorrente de R$0. A rota pública estática `/demo` é, portanto, a opção correta para recrutadores.

Uma **beta aberta com cadastro/login por e-mail para qualquer pessoa** não é viável de modo confiável usando somente o SMTP integrado do Supabase. Ele não é destinado a produção e só entrega para endereços previamente autorizados; um SMTP transacional externo passa a ser necessário. Além disso, planos que aceitem contribuição ou receita tornam o uso incompatível com Vercel Hobby, que é pessoal e não comercial.

## Limites e implicações

| Área | Fonte oficial e limite relevante | Implicação prática |
| --- | --- | --- |
| Supabase Free | Até 2 projetos ativos, 500 MB de banco, 5 GB de egress, 1 GB de Storage e 50.000 MAU. Projetos Free podem pausar após 7 dias de baixa atividade. [Pricing](https://supabase.com/pricing) · [Pausa/recuperação](https://supabase.com/docs/guides/platform/free-project-pausing) | É suficiente para dados textuais e uma beta pequena, mas exige monitoramento e reativação antes de demonstrações. Não há disponibilidade garantida. |
| E-mail do Supabase | O SMTP integrado é apenas de teste e entrega a endereços autorizados da organização; para produção, configurar SMTP próprio. [SMTP](https://supabase.com/docs/guides/auth/auth-smtp) | Este é o bloqueio atual para login por magic link de e-mails arbitrários. Não prometer cadastro público por e-mail sem um provedor de envio. |
| Limites Auth | Magic link/OTP padrão: 30 envios por hora; 60 s entre solicitações pelo mesmo usuário. Com SMTP integrado, endpoints de e-mail como signup/recovery/user têm 2/h globalmente. [Rate limits](https://supabase.com/docs/guides/auth/rate-limits) | Mesmo após adicionar SMTP, implementar mensagens neutras, rate limiting de aplicação e observabilidade. Não criar uma conta demo compartilhada com escrita. |
| Antiabuso | Supabase suporta CAPTCHA para login, cadastro e reset; Cloudflare Turnstile é suportado. [CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha) | Ativar Turnstile antes de abrir autenticação pública. A validação do token é parte do fluxo seguro. |
| Cloudflare Turnstile | Plano Free: até 20 widgets, 10 hostnames por widget e desafios/verificações ilimitados; pode ser usado sem usar Cloudflare como CDN. Tokens são de uso único e expiram em 5 min. [Planos](https://developers.cloudflare.com/turnstile/plans/) · [Integração](https://developers.cloudflare.com/turnstile/get-started/) | É a proteção gratuita recomendada para a futura tela de signup/login, mas não resolve a entrega de e-mail. |
| Vercel Hobby | É destinado a uso pessoal e não comercial. Inclui 100 GB de Fast Data Transfer, 1 milhão de Edge Requests e invocações de Functions e 6.000 min de build; no limite, recursos Hobby podem pausar. [Hobby](https://vercel.com/docs/plans/hobby) · [Fair use](https://vercel.com/docs/limits/fair-use-guidelines) | Compatível com portfólio e demo gratuita. **Não usar** para beta que aceite contribuições, planos pagos ou atenda empresas reais; nesse ponto, migrar para plano comercial/hospedagem comercial. |
| GitHub Actions | Runners padrão hospedados pelo GitHub são gratuitos em repositórios públicos. [Billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | O CI atual pode continuar no repositório público. Evitar runners maiores e artefatos sem necessidade. |
| Cloudflare como alternativa | Workers Free/D1 incluem 5 milhões de leituras/dia, 100 mil escritas/dia e 5 GB de armazenamento; exceder a cota diária causa erro até o reset. [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) | Não é uma migração imediata: exigiria substituir PostgreSQL/Supabase Auth/RLS e ainda não resolve e-mail transacional. |

## Caminho de evolução recomendado

1. **Agora — portfólio:** manter Vercel Hobby + `/demo` estático, público e somente leitura. É o único fluxo que um recrutador pode abrir imediatamente sem depender de e-mail, banco ou conta compartilhada.
2. **Próxima etapa — beta fechada:** criar lista de espera e liberar apenas contas convidadas. Preferir OAuth (Google/GitHub) ou e-mails explicitamente autorizados durante a validação. Antes disso, incluir Turnstile, limites de requisição e logs sem dados sensíveis.
3. **Beta aberta:** contratar/configurar SMTP transacional e usar hospedagem permitida para uso comercial. Continuar usando Supabase somente após revalidar cotas, pausa e limites de Auth.
4. **Planos de contribuição/pagos:** tratar como lançamento comercial: sair do Vercel Hobby, definir termos/privacidade/suporte, observabilidade, backups, monitoramento de uso e política de incidentes. Não apresentar isso como custo zero.

## Guardrails

- Não expor `service_role`, senha de teste nem credenciais em browser, CI ou documentação.
- Não usar o projeto Supabase de demonstração para Preview deployments sem separação explícita de ambiente.
- Não contornar cotas criando contas; se a carga exceder o gratuito, reduzir o escopo ou migrar conscientemente.
- Revalidar estas páginas oficiais antes de abrir cadastro público ou alterar monetização.

## Conclusão

O produto pode ser demonstrado publicamente agora sem custo via `/demo`. O que limita uma experiência SaaS real aberta é principalmente **envio de e-mail de produção e proteção contra abuso**, não o banco ou a interface. A monetização/contribuições introduz uma segunda limitação: **Vercel Hobby deixa de ser elegível**.
