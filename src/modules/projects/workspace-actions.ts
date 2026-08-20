"use server";

import { revalidatePath } from "next/cache";

import { toSafeFailure } from "../authorization/errors";
import { createAuthorizationContext } from "../authorization/server";
import type { CoreActionState } from "../core/contracts";
import { createServerProjectWorkspaceService } from "./workspace-server";

export async function changeProjectTaskStatusAction(
  _state: CoreActionState,
  data: FormData,
): Promise<CoreActionState> {
  const id = String(data.get("id") ?? "");
  const status = String(data.get("status") ?? "");
  try {
    const context = await createAuthorizationContext();
    await (
      await createServerProjectWorkspaceService()
    ).changeProjectTaskStatus(context, id, status);
    revalidatePath("/app/clients", "layout");
    return { message: "Status atualizado.", ok: true, values: {} };
  } catch (error) {
    const failure = toSafeFailure(error);
    return { message: failure.error.message, ok: false, values: { id, status } };
  }
}
