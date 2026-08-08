import { DomainError } from "../authorization/errors";
import type { AuthorizationContext } from "../authorization/service";
import {
  filterProjectTasks,
  summarizeProjectTasks,
  type ProjectTask,
  type ProjectTaskFilters,
} from "./workspace";
import type { DeliverableStatus, ProjectStatus } from "../../types/database";
import { z } from "zod";

export type ProjectWorkspaceSource = Readonly<{
  deliverables: ReadonlyArray<{
    dueAt: string | null;
    id: string;
    name: string;
    status: DeliverableStatus;
  }>;
  members: ReadonlyArray<{ id: string; name: string }>;
  project: {
    clientId: string;
    description: string;
    id: string;
    name: string;
    status: ProjectStatus;
  };
  tasks: ProjectTask[];
  timezone: string;
}>;
export interface ProjectWorkspaceRepository {
  load(workspaceId: string, projectId: string): Promise<ProjectWorkspaceSource | null>;
}
export type ProjectWorkspaceResult = Omit<ProjectWorkspaceSource, "tasks"> & {
  summary: ReturnType<typeof summarizeProjectTasks>;
  tasks: ProjectTask[];
};
export interface ProjectTaskStatusWriter {
  update(context: AuthorizationContext, input: { id: string; status: string }): Promise<unknown>;
}

export function createProjectWorkspaceService(
  repository: ProjectWorkspaceRepository,
  statusWriter?: ProjectTaskStatusWriter,
  clock = { now: () => new Date() },
) {
  return {
    async changeProjectTaskStatus(context: AuthorizationContext, taskId: string, status: string) {
      if (!statusWriter) throw new DomainError("CONFLICT");
      const parsed = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).parse(status);
      return statusWriter.update(context, { id: taskId, status: parsed });
    },
    async getProjectWorkspace(
      context: AuthorizationContext,
      projectId: string,
      filters: ProjectTaskFilters,
    ): Promise<ProjectWorkspaceResult> {
      const source = await repository.load(context.workspaceId, projectId);
      if (!source) throw new DomainError("NOT_FOUND");
      const tasks = filterProjectTasks(source.tasks, filters, {
        now: clock.now(),
        timezone: source.timezone,
      });
      return { ...source, summary: summarizeProjectTasks(tasks), tasks };
    },
  };
}
