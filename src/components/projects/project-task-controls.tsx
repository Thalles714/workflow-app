"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Badge, Button, Drawer, Select } from "@/components/ui";
import { initialCoreActionState } from "@/modules/core/contracts";
import { changeProjectTaskStatusAction } from "@/modules/projects/workspace-actions";
import type { ProjectTask } from "@/modules/projects/workspace";

const statuses = [
  ["TODO", "A fazer"],
  ["IN_PROGRESS", "Em andamento"],
  ["IN_REVIEW", "Em revisão"],
  ["DONE", "Concluída"],
] as const;

export function StatusControl({ task }: { task: ProjectTask }) {
  const [state, action, pending] = useActionState(
    changeProjectTaskStatusAction,
    initialCoreActionState,
  );
  return (
    <form action={action} className="project-status-control">
      <input name="id" type="hidden" value={task.id} />
      <label>
        <span className="sr-only">Status de {task.title}</span>
        <Select
          aria-label={`Status de ${task.title}`}
          defaultValue={task.status}
          disabled={pending}
          name="status"
        >
          {statuses.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </label>
      <Button disabled={pending} type="submit" variant="secondary">
        {pending ? "Salvando…" : "Aplicar"}
      </Button>
      {state.message && (
        <span
          className={state.ok ? "form-success" : "form-error"}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}

export function TaskDrawerButton({ href, task }: { href: string; task: ProjectTask }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="project-task-title" onClick={() => setOpen(true)} type="button">
        {task.title}
      </button>
      <Drawer
        description={`${task.deliverableName} · ${task.assigneeName}`}
        onClose={() => setOpen(false)}
        open={open}
        title={task.title}
      >
        <div className="project-task-drawer">
          <div className="project-drawer-badges">
            <Badge tone={task.isBlocked ? "critical" : "info"}>
              {task.isBlocked ? "Bloqueada" : labelStatus(task.status)}
            </Badge>
            <Badge>{labelPriority(task.priority)}</Badge>
          </div>
          <p>{task.description || "Sem descrição."}</p>
          <dl>
            <div>
              <dt>Entrega</dt>
              <dd>{task.deliverableName}</dd>
            </div>
            <div>
              <dt>Responsável</dt>
              <dd>{task.assigneeName}</dd>
            </div>
            <div>
              <dt>Prazo</dt>
              <dd>{formatDate(task.dueAt)}</dd>
            </div>
          </dl>
          {task.isBlocked && (
            <p className="project-drawer-block">
              <strong>Motivo do bloqueio:</strong> {task.blockReason}
            </p>
          )}
          <StatusControl task={task} />
          <Link className="ui-button ui-button--primary" href={href as never}>
            Abrir tarefa completa
          </Link>
        </div>
      </Drawer>
    </>
  );
}

export function labelStatus(status: ProjectTask["status"]) {
  return Object.fromEntries(statuses)[status];
}
export function labelPriority(priority: ProjectTask["priority"]) {
  return ({ LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta", URGENT: "Urgente" } as const)[priority];
}
export function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value))
    : "Sem prazo";
}
