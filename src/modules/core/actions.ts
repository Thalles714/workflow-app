"use server";

import { revalidatePath } from "next/cache";

import { createAuthorizationContext } from "../authorization/server";
import { toSafeFailure } from "../authorization/errors";
import { createServerClientService } from "../clients/server";
import { createServerProjectService } from "../projects/server";
import { createServerDeliverableService } from "../deliverables/server";
import { createServerTaskService } from "../tasks/server";
import { createServerApprovalService } from "../approvals/server";
import { createServerTaskUpdateService } from "../updates/server";
import { auroraWorkspaceId, type CoreActionState } from "./contracts";

function values(formData: FormData) {
  return Object.fromEntries([...formData.entries()].map(([key, value]) => [key, String(value)]));
}
async function run(
  formData: FormData,
  operation: (context: Awaited<ReturnType<typeof createAuthorizationContext>>) => Promise<unknown>,
): Promise<CoreActionState> {
  const submitted = values(formData);
  try {
    const context = await createAuthorizationContext(auroraWorkspaceId);
    await operation(context);
    revalidatePath("/app/clients", "layout");
    return { message: "Alterações salvas.", ok: true, values: {} };
  } catch (error) {
    const failure = toSafeFailure(error);
    return { message: failure.error.message, ok: false, values: submitted };
  }
}
const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const optional = (data: FormData, key: string) => text(data, key) || undefined;
const nullable = (data: FormData, key: string) => text(data, key) || null;
const isoDate = (data: FormData, key: string) => {
  const value = optional(data, key);
  return value ? new Date(value).toISOString() : null;
};

export async function createClientAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerClientService()).create(context, { name: text(data, "name") }),
  );
}
export async function updateClientAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerClientService()).update(context, {
      id: text(data, "id"),
      name: text(data, "name"),
    }),
  );
}
export async function archiveClientAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerClientService()).archive(context, { id: text(data, "id") }),
  );
}
export async function createProjectAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerProjectService()).create(context, {
      clientId: text(data, "clientId"),
      description: nullable(data, "description"),
      name: text(data, "name"),
    }),
  );
}
export async function updateProjectAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerProjectService()).update(context, {
      description: nullable(data, "description"),
      id: text(data, "id"),
      name: text(data, "name"),
      status: text(data, "status"),
    }),
  );
}
export async function archiveProjectAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerProjectService()).archive(context, { id: text(data, "id") }),
  );
}
export async function createDeliverableAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerDeliverableService()).create(context, {
      description: nullable(data, "description"),
      dueAt: isoDate(data, "dueAt"),
      isImportant: data.get("isImportant") === "on",
      name: text(data, "name"),
      projectId: text(data, "projectId"),
    }),
  );
}
export async function updateDeliverableAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerDeliverableService()).update(context, {
      description: nullable(data, "description"),
      dueAt: isoDate(data, "dueAt"),
      id: text(data, "id"),
      isImportant: data.get("isImportant") === "on",
      name: text(data, "name"),
      status: text(data, "status"),
    }),
  );
}
export async function archiveDeliverableAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerDeliverableService()).archive(context, { id: text(data, "id") }),
  );
}
export async function createTaskAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) => {
    const blocked = data.get("isBlocked") === "on";
    return (await createServerTaskService()).create(context, {
      assigneeId: nullable(data, "assigneeId"),
      blockReason: blocked ? nullable(data, "blockReason") : null,
      deliverableId: text(data, "deliverableId"),
      description: nullable(data, "description"),
      dueAt: isoDate(data, "dueAt"),
      isBlocked: blocked,
      priority: text(data, "priority"),
      status: text(data, "status"),
      title: text(data, "title"),
    });
  });
}
export async function updateTaskAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) => {
    const blocked = data.get("isBlocked") === "on";
    const managed = context.role === "ADMIN";
    return (await createServerTaskService()).update(context, {
      ...(managed
        ? {
            assigneeId: nullable(data, "assigneeId"),
            dueAt: isoDate(data, "dueAt"),
            priority: text(data, "priority"),
            title: text(data, "title"),
          }
        : {}),
      block: { blockReason: blocked ? nullable(data, "blockReason") : null, isBlocked: blocked },
      description: nullable(data, "description"),
      id: text(data, "id"),
      status: text(data, "status"),
    });
  });
}
export async function archiveTaskAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerTaskService()).archive(context, { id: text(data, "id") }),
  );
}
export async function createTaskUpdateAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerTaskUpdateService()).create(context, {
      body: text(data, "body"),
      taskId: text(data, "taskId"),
    }),
  );
}
export async function requestApprovalAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerApprovalService()).request(context, {
      deliverableId: text(data, "deliverableId"),
      note: text(data, "note"),
    }),
  );
}
export async function decideApprovalAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerApprovalService()).decide(context, {
      id: text(data, "id"),
      note: text(data, "note"),
      status: text(data, "status"),
    }),
  );
}
export async function resetApprovalAction(_state: CoreActionState, data: FormData) {
  return run(data, async (context) =>
    (await createServerApprovalService()).reset(context, {
      id: text(data, "id"),
      note: text(data, "note"),
    }),
  );
}
