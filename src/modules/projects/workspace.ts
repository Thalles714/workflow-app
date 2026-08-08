import type { TaskPriority, TaskStatus } from "../../types/database";
import { z } from "zod";

export type ProjectTask = Readonly<{
  assigneeId: string | null;
  assigneeName: string;
  blockReason: string | null;
  deliverableId: string;
  deliverableName: string;
  description: string;
  dueAt: string | null;
  id: string;
  isBlocked: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
}>;

export type ProjectTaskFilters = Readonly<{
  assignee?: string | undefined;
  blocked?: "false" | "true" | undefined;
  due?: "next7" | "none" | "overdue" | "today" | undefined;
  priority?: TaskPriority | undefined;
  status?: TaskStatus | undefined;
}>;
export type ProjectView = "board" | "list" | "overview";

const searchSchema = z.object({
  assignee: z.string().min(1).optional(),
  blocked: z.enum(["false", "true"]).optional(),
  due: z.enum(["next7", "none", "overdue", "today"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  view: z.enum(["overview", "board", "list"]).default("overview"),
});

export function parseProjectWorkspaceSearch(input: Record<string, string | string[] | undefined>) {
  const values = Object.fromEntries(
    Object.entries(input)
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value] as const)
      .filter((entry) => entry[1] !== ""),
  );
  const parsed = searchSchema.safeParse(values);
  return parsed.success ? parsed.data : { view: "overview" as const };
}

export function filterProjectTasks(
  tasks: readonly ProjectTask[],
  filters: ProjectTaskFilters,
  clock: Readonly<{ now: Date; timezone: string }>,
): ProjectTask[] {
  const today = dateKey(clock.now, clock.timezone);
  const next7 = addDays(today, 7);
  return tasks.filter((task) => {
    if (filters.assignee && task.assigneeId !== filters.assignee) return false;
    if (filters.blocked && task.isBlocked !== (filters.blocked === "true")) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (!filters.due) return true;
    if (filters.due === "none") return task.dueAt === null;
    if (!task.dueAt) return false;
    const due = dateKey(new Date(task.dueAt), clock.timezone);
    if (filters.due === "overdue") return due < today;
    if (filters.due === "today") return due === today;
    return due > today && due <= next7;
  });
}

export function summarizeProjectTasks(tasks: readonly ProjectTask[]) {
  const byStatus: Record<TaskStatus, number> = { DONE: 0, IN_PROGRESS: 0, IN_REVIEW: 0, TODO: 0 };
  let blocked = 0;
  for (const task of tasks) {
    byStatus[task.status] += 1;
    if (task.isBlocked) blocked += 1;
  }
  return { blocked, byStatus, completed: byStatus.DONE, total: tasks.length };
}

function dateKey(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: timezone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
