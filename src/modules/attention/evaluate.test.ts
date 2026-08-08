import { describe, expect, it } from "vitest";
import { evaluateAttention, type AttentionSnapshot } from "./evaluate";

const clock = { now: new Date("2026-08-08T15:00:00Z") };

describe("attention rules", () => {
  it("raises one critical alert for an overdue blocked task and suppresses its lower duplicate", () => {
    const snapshot: AttentionSnapshot = {
      approvals: [],
      clients: [{ id: "c1", name: "Órbita" }],
      deliverables: [
        {
          id: "d1",
          projectId: "p1",
          name: "Landing page",
          status: "IN_PROGRESS",
          dueAt: "2026-08-10T12:00:00Z",
          completedAt: null,
          isImportant: true,
        },
      ],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Lançamento",
          status: "ACTIVE",
          lastActivityAt: "2026-08-08T10:00:00Z",
        },
      ],
      tasks: [
        {
          id: "t1",
          deliverableId: "d1",
          title: "Revisar formulário",
          status: "IN_PROGRESS",
          dueAt: "2026-08-07T12:00:00Z",
          isBlocked: true,
          blockReason: "Sem credencial",
          assigneeName: "Thalles",
        },
      ],
    };
    const result = evaluateAttention(snapshot, clock, "America/Sao_Paulo");
    expect(result.alerts).toHaveLength(1);
    expect(result.alerts[0]).toMatchObject({
      severity: "CRITICAL",
      targetId: "t1",
      targetType: "task",
      relatedTarget: { id: "d1", type: "deliverable" },
      title: "Landing page bloqueada por tarefa atrasada",
      explanation: expect.stringContaining("Revisar formulário"),
      href: "/app/clients/c1/projects/p1/deliverables/d1/tasks/t1",
      evidence: {
        dueDate: "2026-08-07",
        localToday: "2026-08-08",
        timezone: "America/Sao_Paulo",
      },
    });
    expect(result.alerts[0]?.reasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining("atrasada"),
        expect.stringContaining("Sem credencial"),
      ]),
    );
    const dueToday = evaluateAttention(
      { ...snapshot, tasks: [{ ...snapshot.tasks[0]!, dueAt: "2026-08-08T12:00:00Z" }] },
      clock,
      "America/Sao_Paulo",
    );
    expect(dueToday.alerts.map((alert) => alert.severity)).toEqual(["RISK"]);
    const done = { ...snapshot, tasks: [{ ...snapshot.tasks[0]!, status: "DONE" as const }] };
    expect(evaluateAttention(done, clock, "America/Sao_Paulo").alerts).toHaveLength(0);
    const unblocked = {
      ...snapshot,
      tasks: [{ ...snapshot.tasks[0]!, isBlocked: false, blockReason: null }],
    };
    expect(
      evaluateAttention(unblocked, clock, "America/Sao_Paulo").alerts.map(
        (alert) => alert.severity,
      ),
    ).toEqual(["RISK"]);
    const completed = {
      ...snapshot,
      deliverables: [
        {
          ...snapshot.deliverables[0]!,
          status: "COMPLETED" as const,
          completedAt: clock.now.toISOString(),
        },
      ],
    };
    expect(evaluateAttention(completed, clock, "America/Sao_Paulo").alerts).toHaveLength(0);
  });

  it("raises delivery risk at exactly the third local day only with pending tasks", () => {
    const snapshot: AttentionSnapshot = {
      approvals: [],
      clients: [{ id: "c1", name: "Órbita" }],
      deliverables: [
        {
          id: "d1",
          projectId: "p1",
          name: "Peças",
          status: "IN_PROGRESS",
          dueAt: "2026-08-11T15:00:00Z",
          completedAt: null,
          isImportant: false,
        },
      ],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Lançamento",
          status: "ACTIVE",
          lastActivityAt: "2026-08-08T10:00:00Z",
        },
      ],
      tasks: [
        {
          id: "t1",
          deliverableId: "d1",
          title: "Exportar",
          status: "TODO",
          dueAt: null,
          isBlocked: false,
          blockReason: null,
          assigneeName: "Ana",
        },
      ],
    };
    expect(evaluateAttention(snapshot, clock, "America/Sao_Paulo").alerts[0]).toMatchObject({
      severity: "RISK",
      targetId: "d1",
    });
    const healthy = { ...snapshot, tasks: [{ ...snapshot.tasks[0]!, status: "DONE" as const }] };
    expect(evaluateAttention(healthy, clock, "America/Sao_Paulo").alerts).toHaveLength(0);
    for (const delivery of [
      { ...snapshot.deliverables[0]!, dueAt: "2026-08-12T15:00:00Z" },
      {
        ...snapshot.deliverables[0]!,
        status: "COMPLETED" as const,
        completedAt: clock.now.toISOString(),
      },
    ]) {
      expect(
        evaluateAttention({ ...snapshot, deliverables: [delivery] }, clock, "America/Sao_Paulo")
          .alerts,
      ).toHaveLength(0);
    }
  });

  it("raises project risk on the seventh local day but not on the sixth", () => {
    const snapshot: AttentionSnapshot = {
      approvals: [],
      clients: [{ id: "c1", name: "Órbita" }],
      deliverables: [],
      tasks: [],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Atlas",
          status: "ACTIVE",
          lastActivityAt: "2026-08-01T15:00:00Z",
        },
      ],
    };
    expect(evaluateAttention(snapshot, clock, "America/Sao_Paulo").alerts[0]).toMatchObject({
      severity: "RISK",
      targetId: "p1",
      evidence: { daysWithoutActivity: 7 },
    });
    const recent = {
      ...snapshot,
      projects: [{ ...snapshot.projects[0]!, lastActivityAt: "2026-08-02T15:00:00Z" }],
    };
    expect(evaluateAttention(recent, clock, "America/Sao_Paulo").alerts).toHaveLength(0);
  });

  it("raises approval attention on the second local day only while pending", () => {
    const snapshot: AttentionSnapshot = {
      clients: [{ id: "c1", name: "Órbita" }],
      tasks: [],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Atlas",
          status: "ACTIVE",
          lastActivityAt: "2026-08-08T10:00:00Z",
        },
      ],
      deliverables: [
        {
          id: "d1",
          projectId: "p1",
          name: "Landing",
          status: "IN_REVIEW",
          dueAt: null,
          completedAt: null,
          isImportant: false,
        },
      ],
      approvals: [
        { id: "a1", deliverableId: "d1", status: "PENDING", requestedAt: "2026-08-06T15:00:00Z" },
      ],
    };
    expect(evaluateAttention(snapshot, clock, "America/Sao_Paulo").alerts[0]).toMatchObject({
      severity: "ATTENTION",
      targetId: "a1",
      evidence: { daysPending: 2 },
    });
    const recent = {
      ...snapshot,
      approvals: [{ ...snapshot.approvals[0]!, requestedAt: "2026-08-07T15:00:00Z" }],
    };
    const decided = {
      ...snapshot,
      approvals: [{ ...snapshot.approvals[0]!, status: "APPROVED" as const }],
    };
    expect(evaluateAttention(recent, clock, "America/Sao_Paulo").alerts).toHaveLength(0);
    expect(evaluateAttention(decided, clock, "America/Sao_Paulo").alerts).toHaveLength(0);
  });

  it("raises immediate attention for a blocked pending task only", () => {
    const snapshot: AttentionSnapshot = {
      approvals: [],
      clients: [{ id: "c1", name: "Órbita" }],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Atlas",
          status: "ACTIVE",
          lastActivityAt: "2026-08-08T10:00:00Z",
        },
      ],
      deliverables: [
        {
          id: "d1",
          projectId: "p1",
          name: "Guia",
          status: "IN_PROGRESS",
          dueAt: null,
          completedAt: null,
          isImportant: false,
        },
      ],
      tasks: [
        {
          id: "t1",
          deliverableId: "d1",
          title: "Validar acesso",
          status: "TODO",
          dueAt: null,
          isBlocked: true,
          blockReason: "Sem acesso",
          assigneeName: "Ana",
        },
      ],
    };
    expect(evaluateAttention(snapshot, clock, "America/Sao_Paulo").alerts[0]).toMatchObject({
      severity: "ATTENTION",
      targetId: "t1",
    });
    expect(
      evaluateAttention(
        { ...snapshot, tasks: [{ ...snapshot.tasks[0]!, isBlocked: false, blockReason: null }] },
        clock,
        "America/Sao_Paulo",
      ).alerts,
    ).toHaveLength(0);
    expect(
      evaluateAttention(
        { ...snapshot, tasks: [{ ...snapshot.tasks[0]!, status: "DONE" as const }] },
        clock,
        "America/Sao_Paulo",
      ).alerts,
    ).toHaveLength(0);
  });

  it("raises information only for an explicitly important healthy delivery on days four through seven", () => {
    const base: AttentionSnapshot = {
      approvals: [],
      clients: [{ id: "c1", name: "Órbita" }],
      tasks: [],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Atlas",
          status: "ACTIVE",
          lastActivityAt: "2026-08-08T10:00:00Z",
        },
      ],
      deliverables: [
        {
          id: "d1",
          projectId: "p1",
          name: "Guia",
          status: "IN_PROGRESS",
          dueAt: "2026-08-12T15:00:00Z",
          completedAt: null,
          isImportant: true,
        },
      ],
    };
    expect(evaluateAttention(base, clock, "America/Sao_Paulo").alerts[0]).toMatchObject({
      severity: "INFO",
      targetId: "d1",
      evidence: { daysUntilDue: 4 },
    });
    const atSeven = {
      ...base,
      deliverables: [{ ...base.deliverables[0]!, dueAt: "2026-08-15T15:00:00Z" }],
    };
    expect(evaluateAttention(atSeven, clock, "America/Sao_Paulo").alerts[0]).toMatchObject({
      severity: "INFO",
      evidence: { daysUntilDue: 7 },
    });
    for (const delivery of [
      { ...base.deliverables[0]!, dueAt: "2026-08-11T15:00:00Z" },
      { ...base.deliverables[0]!, dueAt: "2026-08-16T15:00:00Z" },
      { ...base.deliverables[0]!, isImportant: false },
      {
        ...base.deliverables[0]!,
        status: "COMPLETED" as const,
        completedAt: clock.now.toISOString(),
      },
    ]) {
      expect(
        evaluateAttention({ ...base, deliverables: [delivery] }, clock, "America/Sao_Paulo").alerts,
      ).toHaveLength(0);
    }
  });

  it("deduplicates approval and blocked task on one delivery while preserving both reasons", () => {
    const snapshot: AttentionSnapshot = {
      clients: [{ id: "c1", name: "Órbita" }],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Atlas",
          status: "ACTIVE",
          lastActivityAt: "2026-08-08T10:00:00Z",
        },
      ],
      deliverables: [
        {
          id: "d1",
          projectId: "p1",
          name: "Landing",
          status: "IN_REVIEW",
          dueAt: null,
          completedAt: null,
          isImportant: false,
        },
      ],
      approvals: [
        { id: "a1", deliverableId: "d1", status: "PENDING", requestedAt: "2026-08-06T15:00:00Z" },
      ],
      tasks: [
        {
          id: "t1",
          deliverableId: "d1",
          title: "Publicar",
          status: "TODO",
          dueAt: null,
          isBlocked: true,
          blockReason: "Sem acesso",
          assigneeName: "Ana",
        },
      ],
    };
    const alerts = evaluateAttention(snapshot, clock, "America/Sao_Paulo").alerts;
    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.reasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Aprovação"),
        expect.stringContaining("Sem acesso"),
      ]),
    );
  });

  it("counts operational metrics using the Monday-to-Sunday local week", () => {
    const snapshot: AttentionSnapshot = {
      clients: [{ id: "c1", name: "Órbita" }],
      projects: [
        {
          id: "p1",
          clientId: "c1",
          name: "Atlas",
          status: "ACTIVE",
          lastActivityAt: "2026-08-01T15:00:00Z",
        },
      ],
      deliverables: [
        {
          id: "d1",
          projectId: "p1",
          name: "Semana",
          status: "COMPLETED",
          dueAt: null,
          completedAt: "2026-08-03T15:00:00Z",
          isImportant: false,
        },
        {
          id: "d2",
          projectId: "p1",
          name: "Anterior",
          status: "COMPLETED",
          dueAt: null,
          completedAt: "2026-08-02T15:00:00Z",
          isImportant: false,
        },
      ],
      tasks: [
        {
          id: "t1",
          deliverableId: "d1",
          title: "Pendente",
          status: "TODO",
          dueAt: "2026-08-07T15:00:00Z",
          isBlocked: false,
          blockReason: null,
          assigneeName: "Ana",
        },
        {
          id: "t2",
          deliverableId: "d1",
          title: "Feita",
          status: "DONE",
          dueAt: "2026-08-06T15:00:00Z",
          isBlocked: false,
          blockReason: null,
          assigneeName: "Ana",
        },
      ],
      approvals: [
        { id: "a1", deliverableId: "d1", status: "PENDING", requestedAt: "2026-08-08T10:00:00Z" },
        { id: "a2", deliverableId: "d2", status: "APPROVED", requestedAt: "2026-08-01T10:00:00Z" },
      ],
    };
    expect(evaluateAttention(snapshot, clock, "America/Sao_Paulo").metrics).toEqual({
      deliveriesCompletedThisWeek: 1,
      overdueTasks: 1,
      pendingApprovals: 1,
      projectsAtRisk: 1,
    });
  });
});
