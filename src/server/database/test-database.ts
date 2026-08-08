import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { PGlite } from "@electric-sql/pglite";

const authBootstrap = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;

  create schema auth;

  create table auth.users (
    instance_id uuid,
    id uuid primary key,
    aud text,
    role text,
    email text unique,
    encrypted_password text,
    email_confirmed_at timestamptz,
    recovery_sent_at timestamptz,
    last_sign_in_at timestamptz,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    created_at timestamptz,
    updated_at timestamptz,
    confirmation_token text,
    email_change text,
    email_change_token_new text,
    recovery_token text,
    is_sso_user boolean not null default false,
    is_anonymous boolean not null default false
  );

  create table auth.identities (
    id uuid primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    provider_id text not null,
    identity_data jsonb not null,
    provider text not null,
    last_sign_in_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    unique (provider_id, provider)
  );

  create function auth.uid()
  returns uuid
  language sql
  stable
  as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
  $$;
`;

async function readSql(relativePath: string): Promise<string> {
  return readFile(join(process.cwd(), relativePath), "utf8");
}

export async function createMigratedDatabase(): Promise<PGlite> {
  const database = await PGlite.create();
  await database.exec(authBootstrap);
  await database.exec(await readSql("supabase/migrations/20260808040000_initial_schema.sql"));
  return database;
}

export async function applySeed(database: PGlite): Promise<void> {
  await database.exec(await readSql("supabase/seed.sql"));
}

export async function assumeAuthenticatedUser(database: PGlite, userId: string): Promise<void> {
  await database.query("select set_config('request.jwt.claim.sub', $1, false)", [userId]);
  await database.exec("set role authenticated");
}

export async function assumeAnonymous(database: PGlite): Promise<void> {
  await database.exec("set role anon");
}
