import { describe, expect, it } from "vitest";

import {
  filterProjectTasks,
  parseProjectWorkspaceSearch,
  summarizeProjectTasks,
  type ProjectTask,
} from "./workspace";

const tasks: ProjectTask[] = [
  task({
    id: "1",
    assigneeId: "member-a",
    priority: "URGENT",
    status: "IN_PROGRESS",
    isBlocked: true,
    dueAt: "2026-08-07T12:00:00Z",
  }),
  task({
    id: "2",
    assigneeId: "member-b",
    priority: "HIGH",
    status: "TODO",
    dueAt: "2026-08-08T12:00:00Z",
  }),
  task({
    id: "3",
    assigneeId: "member-a",
    priority: "MEDIUM",
    status: "IN_REVIEW",
    dueAt: "2026-08-12T12:00:00Z",
  }),
  task({ id: "4", assigneeId: null, priority: "LOW", status: "DONE", dueAt: null }),
];

describe("project workspace source", () => {
  it("keeps valid URL state while treating empty filter controls as absent", () => {
    expect(
      parseProjectWorkspaceSearch({
        assignee: "",
        blocked: "",
        due: "",
        priority: "",
        status: "IN_REVIEW",
        view: "list",
      }),
    ).toEqual({ status: "IN_REVIEW", view: "list" });
  });

  it("applies combinable filters once and derives every view count from the same records", () => {
    const filtered = filterProjectTasks(
      tasks,
      {
        assignee: "member-a",
        blocked: "true",
        due: "overdue",
        priority: "URGENT",
        status: "IN_PROGRESS",
      },
      { now: new Date("2026-08-08T15:00:00Z"), timezone: "America/Sao_Paulo" },
    );

    expect(filtered.map((item) => item.id)).toEqual(["1"]);
    expect(summarizeProjectTasks(filtered)).toEqual({
      blocked: 1,
      byStatus: { DONE: 0, IN_PROGRESS: 1, IN_REVIEW: 0, TODO: 0 },
      completed: 0,
      total: 1,
    });
  });
});

function task(overrides: Partial<ProjectTask>): ProjectTask {
  return {
    assigneeId: null,
    assigneeName: "Sem responsável",
    blockReason: null,
    deliverableId: "deliverable-1",
    deliverableName: "Landing page",
    description: "Descrição",
    dueAt: null,
    id: "task-1",
    isBlocked: false,
    priority: "MEDIUM",
    status: "TODO",
    title: "Tarefa",
    ...overrides,
  };
}
