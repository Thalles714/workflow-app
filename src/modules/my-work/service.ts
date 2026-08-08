import type { AuthorizationContext } from "../authorization/service";
import { groupMyWork, type MyWorkGroups, type MyWorkTask } from "./grouping";

export interface MyWorkRepository {
  findAssignedTasks(workspaceId: string, actorId: string): Promise<MyWorkTask[]>;
  findWorkspaceTimezone(workspaceId: string): Promise<string | null>;
}

export type MyWorkClock = Readonly<{ now: () => Date }>;

export function createMyWorkService(
  repository: MyWorkRepository,
  clock: MyWorkClock = { now: () => new Date() },
) {
  return {
    async listMyWork(context: AuthorizationContext): Promise<MyWorkGroups> {
      const timezone = await repository.findWorkspaceTimezone(context.workspaceId);
      if (!timezone) throw new Error("Workspace timezone unavailable");

      const tasks = await repository.findAssignedTasks(context.workspaceId, context.actorId);
      return groupMyWork(tasks, { now: clock.now() }, timezone);
    },
  };
}
