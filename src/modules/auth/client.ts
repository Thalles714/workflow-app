"use client";

import { createBrowserClient } from "@supabase/ssr";

import { readRuntimeSupabaseEnv } from "./env";

export function createBrowserSupabaseClient() {
  const { publishableKey, url } = readRuntimeSupabaseEnv();
  return createBrowserClient(url, publishableKey);
}
