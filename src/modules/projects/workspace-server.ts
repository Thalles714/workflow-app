import "server-only";

import { createServerSupabaseClient } from "../auth/server";
import { createServerTaskService } from "../tasks/server";
import { createSupabaseProjectWorkspaceRepository } from "./workspace-repository";
import { createProjectWorkspaceService } from "./workspace-service";

export async function createServerProjectWorkspaceService() {
  const database = await createServerSupabaseClient();
  return createProjectWorkspaceService(
    createSupabaseProjectWorkspaceRepository(database),
    await createServerTaskService(),
  );
}
