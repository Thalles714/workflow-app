import { redirect } from "next/navigation";
import type { Route } from "next";

import { createServerAuthProvider } from "./server";
import { requireAuthenticatedUser } from "./service";

export async function requirePageUser() {
  try {
    return await requireAuthenticatedUser(await createServerAuthProvider());
  } catch {
    redirect("/login" as Route);
  }
}
