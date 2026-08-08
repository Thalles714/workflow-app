set timezone = 'UTC';

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000101', 'authenticated', 'authenticated', 'admin@aurora.workflow.local', null, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Ana Martins"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000102', 'authenticated', 'authenticated', 'member@aurora.workflow.local', null, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Thalles Martins"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000103', 'authenticated', 'authenticated', 'admin@horizonte.workflow.local', null, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Rafa Costa"}', now(), now(), '', '', '', '')
on conflict (id) do update set
  email = excluded.email,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'admin@aurora.workflow.local', '{"sub":"00000000-0000-0000-0000-000000000101","email":"admin@aurora.workflow.local","email_verified":true}', 'email', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', 'member@aurora.workflow.local', '{"sub":"00000000-0000-0000-0000-000000000102","email":"member@aurora.workflow.local","email_verified":true}', 'email', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000103', 'admin@horizonte.workflow.local', '{"sub":"00000000-0000-0000-0000-000000000103","email":"admin@horizonte.workflow.local","email_verified":true}', 'email', now(), now(), now())
on conflict (provider_id, provider) do update set
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.workspaces (id, name, slug, timezone)
values
  ('10000000-0000-0000-0000-000000000001', 'Agência Aurora', 'agencia-aurora', 'America/Sao_Paulo'),
  ('10000000-0000-0000-0000-000000000002', 'Estúdio Horizonte', 'estudio-horizonte', 'America/Sao_Paulo')
on conflict (id) do update set name = excluded.name, slug = excluded.slug, timezone = excluded.timezone, archived_at = null;

insert into public.memberships (workspace_id, user_id, role)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'ADMIN'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'MEMBER'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000103', 'ADMIN')
on conflict (workspace_id, user_id) do update set role = excluded.role, archived_at = null;

insert into public.clients (id, workspace_id, name)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Órbita Tecnologia'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Norte Comércio')
on conflict (id) do update set workspace_id = excluded.workspace_id, name = excluded.name, archived_at = null;

insert into public.projects (id, workspace_id, client_id, name, description, status, last_activity_at)
values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Lançamento Q3', 'Campanha de lançamento do novo produto.', 'ACTIVE', now() - interval '2 hours'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Reposicionamento Atlas', 'Projeto sem atualização recente.', 'ACTIVE', now() - interval '8 days'),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Campanha de Inverno', 'Projeto de outro tenant.', 'ACTIVE', now())
on conflict (id) do update set name = excluded.name, description = excluded.description, status = excluded.status, last_activity_at = excluded.last_activity_at, archived_at = null;

insert into public.deliverables (id, workspace_id, project_id, name, description, status, due_at, is_important)
values
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Landing page', 'Página de conversão.', 'IN_PROGRESS', now() + interval '10 days', true),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Peças do lançamento', 'Pacote social e mídia.', 'IN_PROGRESS', now() + interval '3 days', true),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Guia de campanha', 'Entrega importante e saudável.', 'IN_PROGRESS', now() + interval '5 days', true),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 'Vitrine sazonal', 'Entrega isolada no segundo tenant.', 'PLANNED', now() + interval '14 days', false)
on conflict (id) do update set name = excluded.name, description = excluded.description, status = excluded.status, due_at = excluded.due_at, is_important = excluded.is_important, archived_at = null;

insert into public.tasks (id, workspace_id, deliverable_id, assignee_id, title, description, status, priority, due_at, is_blocked, block_reason)
values
  ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Revisar formulário', 'Validar integração e mensagens.', 'IN_PROGRESS', 'URGENT', now() - interval '2 days', true, 'Aguardando credencial fictícia do ambiente de homologação.'),
  ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Revisar copy principal', 'Revisão editorial.', 'DONE', 'MEDIUM', now() - interval '1 day', false, null),
  ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102', 'Adaptar peças sociais', 'Formatos de mídia.', 'TODO', 'HIGH', now() + interval '2 days', false, null),
  ('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102', 'Validar mídia paga', 'Checklist de campanha.', 'IN_REVIEW', 'MEDIUM', now() + interval '3 days', false, null),
  ('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000102', 'Consolidar guia', 'Preparar entrega saudável.', 'IN_PROGRESS', 'MEDIUM', now() + interval '4 days', false, null),
  ('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Validar analytics', 'Bloqueio futuro independente.', 'TODO', 'HIGH', now() + interval '8 days', true, 'Aguardando acesso fictício à ferramenta de métricas.'),
  ('50000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000103', 'Planejar vitrine', 'Tarefa do segundo tenant.', 'TODO', 'LOW', now() + interval '12 days', false, null)
on conflict (id) do update set title = excluded.title, description = excluded.description, status = excluded.status, priority = excluded.priority, due_at = excluded.due_at, is_blocked = excluded.is_blocked, block_reason = excluded.block_reason, archived_at = null;

insert into public.task_updates (id, workspace_id, task_id, author_id, body, created_at)
values
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Copy e estados de erro revisados.', now() - interval '1 day'),
  ('60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000103', 'Planejamento iniciado.', now())
on conflict (id) do nothing;

insert into public.approvals (id, workspace_id, deliverable_id, requested_by, decided_by, status, decision_note, requested_at, decided_at)
values
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', null, 'PENDING', null, now() - interval '3 days', null),
  ('70000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000103', 'APPROVED', 'Aprovada para demonstração.', now() - interval '2 days', now() - interval '1 day')
on conflict (id) do update set status = excluded.status, decision_note = excluded.decision_note, requested_at = excluded.requested_at, decided_at = excluded.decided_at, decided_by = excluded.decided_by;

insert into public.audit_logs (id, workspace_id, actor_id, action, entity_type, entity_id, metadata, created_at)
values
  ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'approval.requested', 'deliverable', '40000000-0000-0000-0000-000000000001', '{"source":"seed"}', now() - interval '3 days'),
  ('80000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000103', 'approval.decided', 'deliverable', '40000000-0000-0000-0000-000000000004', '{"source":"seed"}', now() - interval '1 day')
on conflict (id) do nothing;
