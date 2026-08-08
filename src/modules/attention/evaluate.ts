import type {
  ApprovalStatus,
  DeliverableStatus,
  ProjectStatus,
  TaskStatus,
} from "../../types/database";

export type AttentionSnapshot = Readonly<{
  approvals: ReadonlyArray<{
    deliverableId: string;
    id: string;
    requestedAt: string;
    status: ApprovalStatus;
  }>;
  clients: ReadonlyArray<{ id: string; name: string }>;
  deliverables: ReadonlyArray<{
    completedAt: string | null;
    dueAt: string | null;
    id: string;
    isImportant: boolean;
    name: string;
    projectId: string;
    status: DeliverableStatus;
  }>;
  projects: ReadonlyArray<{
    clientId: string;
    id: string;
    lastActivityAt: string;
    name: string;
    status: ProjectStatus;
  }>;
  tasks: ReadonlyArray<{
    assigneeName: string;
    blockReason: string | null;
    deliverableId: string;
    dueAt: string | null;
    id: string;
    isBlocked: boolean;
    status: TaskStatus;
    title: string;
  }>;
}>;

export type AttentionAlert = Readonly<{
  evidence: Record<string, number | string>;
  explanation: string;
  href: string;
  reasons: string[];
  relatedTarget?: { id: string; type: "deliverable" };
  severity: "ATTENTION" | "CRITICAL" | "INFO" | "RISK";
  targetId: string;
  targetType: "approval" | "deliverable" | "project" | "task";
  title: string;
}>;

export function evaluateAttention(
  snapshot: AttentionSnapshot,
  clock: Readonly<{ now: Date }>,
  timezone: string,
): {
  alerts: AttentionAlert[];
  metrics: {
    deliveriesCompletedThisWeek: number;
    overdueTasks: number;
    pendingApprovals: number;
    projectsAtRisk: number;
  };
} {
  const localToday = localDate(clock.now, timezone);
  const projects = new Map(snapshot.projects.map((project) => [project.id, project]));
  const alerts: AttentionAlert[] = [];

  for (const task of snapshot.tasks) {
    if (!task.isBlocked || task.status === "DONE" || !task.dueAt) continue;
    const delivery = snapshot.deliverables.find((item) => item.id === task.deliverableId);
    if (!delivery || delivery.status === "COMPLETED") continue;
    const dueDate = localDate(new Date(task.dueAt), timezone);
    if (dueDate >= localToday) continue;
    const project = projects.get(delivery.projectId);
    if (!project) continue;
    const reason = task.blockReason ?? "Bloqueio sem motivo disponível";
    alerts.push({
      evidence: { dueDate, localToday, timezone },
      explanation: `${task.title} está atrasada e bloqueia ${delivery.name}.`,
      href: `/app/clients/${project.clientId}/projects/${project.id}/deliverables/${delivery.id}/tasks/${task.id}`,
      reasons: [`Tarefa atrasada desde ${dueDate}.`, `Bloqueio: ${reason}.`],
      relatedTarget: { id: delivery.id, type: "deliverable" },
      severity: "CRITICAL",
      targetId: task.id,
      targetType: "task",
      title: `${delivery.name} bloqueada por tarefa atrasada`,
    });
  }
  for (const delivery of snapshot.deliverables) {
    if (delivery.status === "COMPLETED" || !delivery.dueAt) continue;
    if (alerts.some((alert) => alert.relatedTarget?.id === delivery.id)) continue;
    const pending = snapshot.tasks.filter(
      (task) => task.deliverableId === delivery.id && task.status !== "DONE",
    );
    const dueDate = localDate(new Date(delivery.dueAt), timezone);
    const days = calendarDifference(localToday, dueDate);
    if (days < 0 || days > 3 || pending.length === 0) continue;
    const project = projects.get(delivery.projectId);
    if (!project) continue;
    alerts.push({
      evidence: { daysUntilDue: days, dueDate, localToday, pendingTasks: pending.length, timezone },
      explanation: `${delivery.name} vence em ${days} dia(s) e possui ${pending.length} tarefa(s) pendente(s).`,
      href: `/app/clients/${project.clientId}/projects/${project.id}/deliverables/${delivery.id}`,
      reasons: [`Prazo dentro de 0–3 dias.`, `${pending.length} tarefa(s) pendente(s).`],
      severity: "RISK",
      targetId: delivery.id,
      targetType: "deliverable",
      title: `${delivery.name} vence com pendências`,
    });
  }
  for (const project of snapshot.projects) {
    if (project.status !== "ACTIVE") continue;
    const last = localDate(new Date(project.lastActivityAt), timezone);
    const days = calendarDifference(last, localToday);
    if (days < 7) continue;
    alerts.push({
      evidence: { daysWithoutActivity: days, lastActivityDate: last, localToday, timezone },
      explanation: `${project.name} está sem atualização há ${days} dias.`,
      href: `/app/clients/${project.clientId}/projects/${project.id}`,
      reasons: ["Projeto ativo sem atualização há 7 dias ou mais."],
      severity: "RISK",
      targetId: project.id,
      targetType: "project",
      title: `${project.name} está sem atualização`,
    });
  }
  for (const approval of snapshot.approvals) {
    if (approval.status !== "PENDING") continue;
    const requested = localDate(new Date(approval.requestedAt), timezone);
    const days = calendarDifference(requested, localToday);
    if (days < 2) continue;
    const delivery = snapshot.deliverables.find((item) => item.id === approval.deliverableId);
    const project = delivery && projects.get(delivery.projectId);
    if (!delivery || delivery.status === "COMPLETED" || !project) continue;
    const existing = alerts.find(
      (alert) => alert.relatedTarget?.id === delivery.id || alert.targetId === delivery.id,
    );
    const reason = `Aprovação pendente há ${days} dias.`;
    if (existing) {
      existing.reasons.push(reason);
      continue;
    }
    alerts.push({
      evidence: { daysPending: days, localToday, requestedDate: requested, timezone },
      explanation: `${delivery.name} aguarda aprovação há ${days} dias.`,
      href: `/app/clients/${project.clientId}/projects/${project.id}/deliverables/${delivery.id}`,
      reasons: [reason],
      relatedTarget: { id: delivery.id, type: "deliverable" },
      severity: "ATTENTION",
      targetId: approval.id,
      targetType: "approval",
      title: `${delivery.name} aguarda aprovação`,
    });
  }
  for (const task of snapshot.tasks) {
    if (
      !task.isBlocked ||
      task.status === "DONE" ||
      alerts.some((alert) => alert.targetId === task.id)
    )
      continue;
    const delivery = snapshot.deliverables.find((item) => item.id === task.deliverableId);
    const project = delivery && projects.get(delivery.projectId);
    if (!delivery || delivery.status === "COMPLETED" || !project) continue;
    const existing = alerts.find(
      (alert) => alert.targetId === delivery.id || alert.relatedTarget?.id === delivery.id,
    );
    if (existing && existing.severity !== "CRITICAL") {
      existing.reasons.push(`Bloqueio: ${task.blockReason}.`);
      continue;
    }
    alerts.push({
      evidence: { localToday, timezone },
      explanation: `${task.title} está bloqueada: ${task.blockReason}.`,
      href: `/app/clients/${project.clientId}/projects/${project.id}/deliverables/${delivery.id}/tasks/${task.id}`,
      reasons: [`Bloqueio: ${task.blockReason}.`],
      relatedTarget: { id: delivery.id, type: "deliverable" },
      severity: "ATTENTION",
      targetId: task.id,
      targetType: "task",
      title: `${task.title} está bloqueada`,
    });
  }
  for (const delivery of snapshot.deliverables) {
    if (
      !delivery.isImportant ||
      delivery.status === "COMPLETED" ||
      !delivery.dueAt ||
      alerts.some(
        (alert) => alert.targetId === delivery.id || alert.relatedTarget?.id === delivery.id,
      )
    )
      continue;
    const due = localDate(new Date(delivery.dueAt), timezone);
    const days = calendarDifference(localToday, due);
    if (days < 4 || days > 7) continue;
    const project = projects.get(delivery.projectId);
    if (!project) continue;
    alerts.push({
      evidence: { daysUntilDue: days, dueDate: due, localToday, timezone },
      explanation: `${delivery.name} é importante e vence em ${days} dias, sem regra superior.`,
      href: `/app/clients/${project.clientId}/projects/${project.id}/deliverables/${delivery.id}`,
      reasons: ["Entrega importante próxima e saudável."],
      severity: "INFO",
      targetId: delivery.id,
      targetType: "deliverable",
      title: `${delivery.name} está próxima e saudável`,
    });
  }
  const rank = { CRITICAL: 0, RISK: 1, ATTENTION: 2, INFO: 3 } as const;
  alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);
  const weekStart = startOfWeek(localToday);
  const weekEnd = addDays(weekStart, 6);
  return {
    alerts,
    metrics: {
      deliveriesCompletedThisWeek: snapshot.deliverables.filter(
        (item) =>
          item.completedAt &&
          between(localDate(new Date(item.completedAt), timezone), weekStart, weekEnd),
      ).length,
      overdueTasks: snapshot.tasks.filter(
        (task) =>
          task.status !== "DONE" &&
          task.dueAt &&
          localDate(new Date(task.dueAt), timezone) < localToday,
      ).length,
      pendingApprovals: snapshot.approvals.filter((item) => item.status === "PENDING").length,
      projectsAtRisk: alerts.filter(
        (item) => item.targetType === "project" && item.severity === "RISK",
      ).length,
    },
  };
}

function localDate(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: timezone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function calendarDifference(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}
function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
function startOfWeek(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return addDays(value, -((date.getUTCDay() + 6) % 7));
}
function between(value: string, start: string, end: string) {
  return value >= start && value <= end;
}
