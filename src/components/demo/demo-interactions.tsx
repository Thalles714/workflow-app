"use client";

import { useState } from "react";
import { Drawer } from "../ui";
import { demoAlerts, type DemoAlert } from "./demo-data";
import { DemoLink } from "./demo-link";

export function AttentionDeck() {
  const [level, setLevel] = useState<DemoAlert["level"] | "Todos">("Todos");
  const [selected, setSelected] = useState<DemoAlert | null>(null);
  const visible =
    level === "Todos" ? demoAlerts : demoAlerts.filter((alert) => alert.level === level);
  return (
    <>
      <div aria-label="Filtrar alertas" className="tour-filter">
        <span>Filtrar</span>
        {["Todos", "Crítico", "Risco", "Atenção", "Informação"].map((item) => (
          <button
            aria-pressed={level === item}
            key={item}
            onClick={() => setLevel(item as typeof level)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="tour-alerts">
        {visible.map((alert, index) => (
          <article
            className={`tour-alert tour-alert--${alert.level.toLowerCase().replace("ç", "c").replace("ã", "a")}`}
            key={alert.title}
          >
            <span className="tour-alert-index">0{index + 1}</span>
            <div>
              <span className="eyebrow">{alert.level}</span>
              <h3>{alert.title}</h3>
              <p>{alert.reason}</p>
            </div>
            <button onClick={() => setSelected(alert)} type="button">
              Inspecionar <span aria-hidden="true">↗</span>
            </button>
          </article>
        ))}
      </div>
      <Drawer
        description={selected?.reason}
        onClose={() => setSelected(null)}
        open={Boolean(selected)}
        title={selected?.title ?? "Alerta"}
      >
        <div className="tour-drawer">
          <span className="demo-readonly">Leitura guiada</span>
          <p>
            O Workflow não pontua a operação com uma caixa-preta: ele explica o sinal, preserva o
            contexto e conduz ao próximo item.
          </p>
          <DemoLink
            className="ui-button ui-button--primary"
            href={selected?.href ?? "/demo"}
            onClick={() => setSelected(null)}
          >
            Abrir contexto →
          </DemoLink>
        </div>
      </Drawer>
    </>
  );
}
