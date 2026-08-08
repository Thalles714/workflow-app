"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";

import { createServerAuthProvider } from "./server";
import { authenticateWithEmailOtp } from "./service";

export async function requestLogin(formData: FormData): Promise<never> {
  try {
    const result = await authenticateWithEmailOtp(
      String(formData.get("email") ?? ""),
      await createServerAuthProvider(),
    );
    if (!result.ok) redirect("/login?status=error" as Route);
  } catch {
    redirect("/login?status=error" as Route);
  }
  redirect("/login?status=sent" as Route);
}

export async function logout(): Promise<never> {
  const provider = await createServerAuthProvider();
  await provider.signOut();
  redirect("/login" as Route);
}
