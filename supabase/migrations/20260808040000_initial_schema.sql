set timezone = 'UTC';

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.membership_role as enum ('ADMIN', 'MEMBER');
create type public.project_status as enum ('ACTIVE', 'COMPLETED');
create type public.deliverable_status as enum ('PLANNED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED');
create type public.task_status as enum ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');
create type public.task_priority as enum ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
create type public.approval_status as enum ('PENDING', 'APPROVED', 'CHANGES_REQUESTED');
create type public.alert_severity as enum ('CRITICAL', 'RISK', 'ATTENTION', 'INFO');

create table public.profiles (
  id uuid primary key references auth.users (id),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  timezone text not null default 'America/Sao_Paulo' check (char_length(btrim(timezone)) > 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, slug)
);

create table public.memberships (
  workspace_id uuid not null references public.workspaces (id),
  user_id uuid not null references public.profiles (id),
  role public.membership_role not null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  unique (workspace_id, name)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  client_id uuid not null,
  name text not null check (char_length(btrim(name)) between 2 and 140),
  description text not null default '',
  status public.project_status not null default 'ACTIVE',
  last_activity_at timestamptz not null default now(),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  unique (workspace_id, client_id, name),
  foreign key (workspace_id, client_id) references public.clients (workspace_id, id)
);

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  project_id uuid not null,
  name text not null check (char_length(btrim(name)) between 2 and 140),
  description text not null default '',
  status public.deliverable_status not null default 'PLANNED',
  due_at timestamptz,
  is_important boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  unique (workspace_id, project_id, name),
  foreign key (workspace_id, project_id) references public.projects (workspace_id, id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  deliverable_id uuid not null,
  assignee_id uuid,
  title text not null check (char_length(btrim(title)) between 2 and 180),
  description text not null default '',
  status public.task_status not null default 'TODO',
  priority public.task_priority not null default 'MEDIUM',
  due_at timestamptz,
  is_blocked boolean not null default false,
  block_reason text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, deliverable_id) references public.deliverables (workspace_id, id),
  foreign key (workspace_id, assignee_id) references public.memberships (workspace_id, user_id),
  check (
    (is_blocked = false and block_reason is null)
    or
    (is_blocked = true and nullif(btrim(block_reason), '') is not null)
  )
);

create table public.task_updates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  task_id uuid not null,
  author_id uuid not null,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, task_id) references public.tasks (workspace_id, id),
  foreign key (workspace_id, author_id) references public.memberships (workspace_id, user_id)
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  deliverable_id uuid not null,
  requested_by uuid not null,
  decided_by uuid,
  status public.approval_status not null default 'PENDING',
  decision_note text,
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, deliverable_id) references public.deliverables (workspace_id, id),
  foreign key (workspace_id, requested_by) references public.memberships (workspace_id, user_id),
  foreign key (workspace_id, decided_by) references public.memberships (workspace_id, user_id),
  check (
    (status = 'PENDING' and decided_by is null and decided_at is null)
    or
    (status <> 'PENDING' and decided_by is not null and decided_at is not null)
  )
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id),
  actor_id uuid not null,
  action text not null check (char_length(btrim(action)) between 2 and 100),
  entity_type text not null check (char_length(btrim(entity_type)) between 2 and 60),
  entity_id uuid not null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  foreign key (workspace_id, actor_id) references public.memberships (workspace_id, user_id)
);

create index memberships_user_active_idx on public.memberships (user_id, workspace_id) where archived_at is null;
create index clients_workspace_active_idx on public.clients (workspace_id, name) where archived_at is null;
create index projects_workspace_client_active_idx on public.projects (workspace_id, client_id) where archived_at is null;
create index projects_attention_idx on public.projects (workspace_id, last_activity_at) where archived_at is null and status = 'ACTIVE';
create index deliverables_workspace_project_active_idx on public.deliverables (workspace_id, project_id) where archived_at is null;
create index deliverables_attention_idx on public.deliverables (workspace_id, due_at) where archived_at is null and status <> 'COMPLETED';
create index tasks_workspace_deliverable_active_idx on public.tasks (workspace_id, deliverable_id) where archived_at is null;
create index tasks_assignee_status_idx on public.tasks (workspace_id, assignee_id, status) where archived_at is null;
create index tasks_attention_idx on public.tasks (workspace_id, due_at, is_blocked) where archived_at is null and status <> 'DONE';
create index task_updates_task_created_idx on public.task_updates (workspace_id, task_id, created_at desc);
create index approvals_attention_idx on public.approvals (workspace_id, requested_at) where status = 'PENDING';
create index audit_logs_workspace_created_idx on public.audit_logs (workspace_id, created_at desc);

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function private.prevent_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% is append-only', tg_table_name using errcode = '55000';
end;
$$;

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger workspaces_set_updated_at before update on public.workspaces for each row execute function private.set_updated_at();
create trigger memberships_set_updated_at before update on public.memberships for each row execute function private.set_updated_at();
create trigger clients_set_updated_at before update on public.clients for each row execute function private.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger deliverables_set_updated_at before update on public.deliverables for each row execute function private.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function private.set_updated_at();
create trigger approvals_set_updated_at before update on public.approvals for each row execute function private.set_updated_at();
create trigger task_updates_append_only before update or delete on public.task_updates for each row execute function private.prevent_mutation();
create trigger audit_logs_append_only before update or delete on public.audit_logs for each row execute function private.prevent_mutation();
create trigger auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

create function private.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships membership
    where membership.workspace_id = target_workspace_id
      and membership.user_id = (select auth.uid())
      and membership.archived_at is null
  );
$$;

create function private.is_workspace_admin(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships membership
    where membership.workspace_id = target_workspace_id
      and membership.user_id = (select auth.uid())
      and membership.role = 'ADMIN'
      and membership.archived_at is null
  );
$$;

create function private.shares_workspace(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user_id = (select auth.uid()) or exists (
    select 1
    from public.memberships viewer
    join public.memberships target on target.workspace_id = viewer.workspace_id
    where viewer.user_id = (select auth.uid())
      and target.user_id = target_user_id
      and viewer.archived_at is null
      and target.archived_at is null
  );
$$;

revoke all on function private.is_workspace_member(uuid) from public;
revoke all on function private.is_workspace_admin(uuid) from public;
revoke all on function private.shares_workspace(uuid) from public;
grant execute on function private.is_workspace_member(uuid) to authenticated;
grant execute on function private.is_workspace_admin(uuid) to authenticated;
grant execute on function private.shares_workspace(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.memberships enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.deliverables enable row level security;
alter table public.tasks enable row level security;
alter table public.task_updates enable row level security;
alter table public.approvals enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select_shared_workspace on public.profiles for select to authenticated using (private.shares_workspace(id));
create policy profiles_update_self on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy workspaces_select_member on public.workspaces for select to authenticated using (private.is_workspace_member(id));
create policy workspaces_update_admin on public.workspaces for update to authenticated using (private.is_workspace_admin(id)) with check (private.is_workspace_admin(id));

create policy memberships_select_member on public.memberships for select to authenticated using (private.is_workspace_member(workspace_id));
create policy memberships_insert_admin on public.memberships for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy memberships_update_admin on public.memberships for update to authenticated using (private.is_workspace_admin(workspace_id)) with check (private.is_workspace_admin(workspace_id));

create policy clients_select_member on public.clients for select to authenticated using (private.is_workspace_member(workspace_id));
create policy clients_insert_admin on public.clients for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy clients_update_admin on public.clients for update to authenticated using (private.is_workspace_admin(workspace_id)) with check (private.is_workspace_admin(workspace_id));

create policy projects_select_member on public.projects for select to authenticated using (private.is_workspace_member(workspace_id));
create policy projects_insert_admin on public.projects for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy projects_update_admin on public.projects for update to authenticated using (private.is_workspace_admin(workspace_id)) with check (private.is_workspace_admin(workspace_id));

create policy deliverables_select_member on public.deliverables for select to authenticated using (private.is_workspace_member(workspace_id));
create policy deliverables_insert_admin on public.deliverables for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy deliverables_update_admin on public.deliverables for update to authenticated using (private.is_workspace_admin(workspace_id)) with check (private.is_workspace_admin(workspace_id));

create policy tasks_select_member on public.tasks for select to authenticated using (private.is_workspace_member(workspace_id));
create policy tasks_insert_admin on public.tasks for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy tasks_update_admin_or_assignee on public.tasks for update to authenticated
using (private.is_workspace_admin(workspace_id) or (private.is_workspace_member(workspace_id) and assignee_id = (select auth.uid())))
with check (private.is_workspace_admin(workspace_id) or (private.is_workspace_member(workspace_id) and assignee_id = (select auth.uid())));

create policy task_updates_select_member on public.task_updates for select to authenticated using (private.is_workspace_member(workspace_id));
create policy task_updates_insert_author on public.task_updates for insert to authenticated with check (private.is_workspace_member(workspace_id) and author_id = (select auth.uid()));

create policy approvals_select_member on public.approvals for select to authenticated using (private.is_workspace_member(workspace_id));
create policy approvals_insert_admin on public.approvals for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy approvals_update_admin on public.approvals for update to authenticated using (private.is_workspace_admin(workspace_id)) with check (private.is_workspace_admin(workspace_id));

create policy audit_logs_select_admin on public.audit_logs for select to authenticated using (private.is_workspace_admin(workspace_id));
create policy audit_logs_insert_actor on public.audit_logs for insert to authenticated with check (private.is_workspace_member(workspace_id) and actor_id = (select auth.uid()));

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.workspaces, public.memberships, public.clients, public.projects, public.deliverables, public.tasks, public.task_updates, public.approvals, public.audit_logs to authenticated;
grant update on public.profiles, public.workspaces, public.memberships, public.clients, public.projects, public.deliverables, public.tasks, public.approvals to authenticated;
grant insert on public.memberships, public.clients, public.projects, public.deliverables, public.tasks, public.task_updates, public.approvals, public.audit_logs to authenticated;

create view public.attention_alerts
with (security_invoker = true)
as
select
  task.workspace_id,
  'critical_blocked_overdue_task'::text as rule_key,
  'CRITICAL'::public.alert_severity as severity,
  'TASK'::text as source_type,
  task.id as source_id,
  task.title,
  jsonb_build_object('due_at', task.due_at, 'block_reason', task.block_reason, 'deliverable_id', task.deliverable_id) as evidence,
  task.due_at as occurred_at
from public.tasks task
join public.deliverables deliverable on deliverable.workspace_id = task.workspace_id and deliverable.id = task.deliverable_id
where task.archived_at is null
  and deliverable.archived_at is null
  and deliverable.status <> 'COMPLETED'
  and task.status <> 'DONE'
  and task.is_blocked
  and task.due_at < now()
union all
select
  deliverable.workspace_id,
  'deliverable_due_with_pending_tasks',
  'RISK'::public.alert_severity,
  'DELIVERABLE',
  deliverable.id,
  deliverable.name,
  jsonb_build_object('due_at', deliverable.due_at, 'pending_tasks', count(task.id)),
  deliverable.due_at
from public.deliverables deliverable
join public.tasks task on task.workspace_id = deliverable.workspace_id and task.deliverable_id = deliverable.id
where deliverable.archived_at is null
  and deliverable.status <> 'COMPLETED'
  and deliverable.due_at between now() and now() + interval '3 days'
  and task.archived_at is null
  and task.status <> 'DONE'
group by deliverable.workspace_id, deliverable.id, deliverable.name, deliverable.due_at
union all
select
  project.workspace_id,
  'project_without_recent_activity',
  'RISK'::public.alert_severity,
  'PROJECT',
  project.id,
  project.name,
  jsonb_build_object('last_activity_at', project.last_activity_at),
  project.last_activity_at
from public.projects project
where project.archived_at is null
  and project.status = 'ACTIVE'
  and project.last_activity_at <= now() - interval '7 days'
union all
select
  approval.workspace_id,
  'approval_pending_two_days',
  'ATTENTION'::public.alert_severity,
  'APPROVAL',
  approval.id,
  deliverable.name,
  jsonb_build_object('requested_at', approval.requested_at, 'deliverable_id', approval.deliverable_id),
  approval.requested_at
from public.approvals approval
join public.deliverables deliverable on deliverable.workspace_id = approval.workspace_id and deliverable.id = approval.deliverable_id
where approval.status = 'PENDING'
  and approval.requested_at <= now() - interval '2 days'
union all
select
  task.workspace_id,
  'blocked_task',
  'ATTENTION'::public.alert_severity,
  'TASK',
  task.id,
  task.title,
  jsonb_build_object('block_reason', task.block_reason, 'due_at', task.due_at),
  task.updated_at
from public.tasks task
where task.archived_at is null
  and task.status <> 'DONE'
  and task.is_blocked
  and (task.due_at is null or task.due_at >= now())
union all
select
  deliverable.workspace_id,
  'important_deliverable_healthy',
  'INFO'::public.alert_severity,
  'DELIVERABLE',
  deliverable.id,
  deliverable.name,
  jsonb_build_object('due_at', deliverable.due_at),
  deliverable.due_at
from public.deliverables deliverable
where deliverable.archived_at is null
  and deliverable.status <> 'COMPLETED'
  and deliverable.is_important
  and deliverable.due_at > now() + interval '3 days'
  and deliverable.due_at <= now() + interval '7 days'
  and not exists (
    select 1 from public.tasks task
    where task.workspace_id = deliverable.workspace_id
      and task.deliverable_id = deliverable.id
      and task.archived_at is null
      and task.status <> 'DONE'
      and task.is_blocked
  );

grant select on public.attention_alerts to authenticated;

comment on view public.attention_alerts is 'Deterministic, read-only projection of operational attention rules.';
