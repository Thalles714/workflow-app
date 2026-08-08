create unique index approvals_one_pending_per_deliverable_idx on public.approvals (workspace_id, deliverable_id) where status = 'PENDING';
