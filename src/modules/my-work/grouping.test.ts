import { describe, expect, it } from "vitest";

import { groupMyWork, type MyWorkTask } from "./grouping";

const now = new Date("2026-08-08T03:30:00.000Z"); // 00:30 em São Paulo
const base: MyWorkTask = {
  assigneeId: "00000000-0000-0000-0000-000000000102",
  blockReason: null,
  clientId: "20000000-0000-0000-0000-000000000001",
  clientName: "Órbita",
  deliverableId: "40000000-0000-0000-0000-000000000001",
  deliverableName: "Landing page",
  dueAt: null,
  id: "50000000-0000-0000-0000-000000000001",
  isBlocked: false,
  priority: "MEDIUM",
  projectId: "30000000-0000-0000-0000-000000000001",
  projectName: "Lançamento",
  status: "TODO",
  title: "Tarefa",
};

describe("Meu Trabalho grouping", () => {
  it("uses workspace midnight and keeps every task in exactly one group", () => {
    const tasks: MyWorkTask[] = [
      { ...base, dueAt: "2026-08-08T02:59:59.999Z", id: id(1), title: "Antes da meia-noite" },
      { ...base, dueAt: "2026-08-08T03:00:00.000Z", id: id(2), title: "À meia-noite" },
      { ...base, dueAt: "2026-08-09T03:00:00.000Z", id: id(3), title: "Amanhã" },
      { ...base, dueAt: "2026-08-15T23:59:00.000Z", id: id(4), title: "Sétimo dia" },
      { ...base, dueAt: "2026-08-16T03:00:00.000Z", id: id(5), title: "Fora da janela" },
      {
        ...base,
        dueAt: "2026-08-07T12:00:00.000Z",
        id: id(6),
        status: "IN_REVIEW",
        title: "Revisão atrasada",
      },
    ];

    const grouped = groupMyWork(tasks, { now }, "America/Sao_Paulo");

    expect(grouped.overdue.map((task) => task.title)).toEqual(["Antes da meia-noite"]);
    expect(grouped.today.map((task) => task.title)).toEqual(["À meia-noite"]);
    expect(grouped.upcoming.map((task) => task.title)).toEqual(["Amanhã", "Sétimo dia"]);
    expect(grouped.awaitingApproval.map((task) => task.title)).toEqual(["Revisão atrasada"]);
    expect(
      Object.values(grouped)
        .flat()
        .map((task) => task.id),
    ).toHaveLength(5);
  });

  it("orders equal dates by priority and excludes completed or undated work", () => {
    const dueAt = "2026-08-08T15:00:00.000Z";
    const grouped = groupMyWork(
      [
        { ...base, dueAt, id: id(1), priority: "LOW", title: "Baixa" },
        { ...base, dueAt, id: id(2), priority: "URGENT", title: "Urgente" },
        { ...base, dueAt, id: id(3), status: "DONE", title: "Concluída" },
        { ...base, dueAt: null, id: id(4), title: "Sem prazo" },
      ],
      { now },
      "America/Sao_Paulo",
    );

    expect(grouped.today.map((task) => task.title)).toEqual(["Urgente", "Baixa"]);
    expect(Object.values(grouped).flat()).toHaveLength(2);
  });
});

function id(value: number) {
  return `50000000-0000-0000-0000-${String(value).padStart(12, "0")}`;
}
