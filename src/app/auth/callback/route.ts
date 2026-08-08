import { NextResponse, type NextRequest } from "next/server";

import { readAppUrl } from "@/modules/auth/env";
import { createServerSupabaseClient } from "@/modules/auth/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/app", readAppUrl()));
  }
  return NextResponse.redirect(new URL("/login?status=error", readAppUrl()));
}
