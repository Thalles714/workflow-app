import type { ApprovalStatus, TaskPriority, TaskStatus } from "../../types/database";

export type MyWorkTask = Readonly<{
  assigneeId: string;
  approvalStatus: ApprovalStatus | null;
  blockReason: string | null;
  clientId: string;
  clientName: string;
  deliverableId: string;
  deliverableName: string;
  dueAt: string | null;
  id: string;
  isBlocked: boolean;
  priority: TaskPriority;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  title: string;
}>;

export type MyWorkGroups = Readonly<{
  awaitingApproval: MyWorkTask[];
  overdue: MyWorkTask[];
  today: MyWorkTask[];
  upcoming: MyWorkTask[];
}>;

export type Clock = Readonly<{ now: Date }>;

const priorityOrder: Record<TaskPriority, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export function groupMyWork(
  tasks: readonly MyWorkTask[],
  clock: Clock,
  timezone: string,
): MyWorkGroups {
  const today = localDateKey(clock.now, timezone);
  const upcomingLimit = addCalendarDays(today, 7);
  const groups: MyWorkGroups = {
    awaitingApproval: [],
    overdue: [],
    today: [],
    upcoming: [],
  };

  for (const task of tasks) {
    if (task.status === "DONE" || task.dueAt === null) continue;

    if (task.approvalStatus === "PENDING") {
      groups.awaitingApproval.push(task);
      continue;
    }

    const dueDate = localDateKey(new Date(task.dueAt), timezone);
    if (dueDate < today) groups.overdue.push(task);
    else if (dueDate === today) groups.today.push(task);
    else if (dueDate <= upcomingLimit) groups.upcoming.push(task);
  }

  for (const group of Object.values(groups)) group.sort(compareUrgency);
  return groups;
}

function localDateKey(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: timezone,
    year: "numeric",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function addCalendarDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function compareUrgency(left: MyWorkTask, right: MyWorkTask): number {
  const dueDate = (left.dueAt ?? "").localeCompare(right.dueAt ?? "");
  if (dueDate !== 0) return dueDate;
  const priority = priorityOrder[left.priority] - priorityOrder[right.priority];
  if (priority !== 0) return priority;
  return left.title.localeCompare(right.title, "pt-BR");
}
