"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { DemoLink } from "./demo-link";

const links = [
  ["Central", "/demo", "01"],
  ["Meu trabalho", "/demo/my-work", "02"],
  ["Clientes", "/demo/clients", "03"],
  ["Projetos", "/demo/projects/lancamento-q3", "04"],
  ["Aprovações", "/demo/approvals", "05"],
] as const;

export function DemoShell({ children, title }: { children: ReactNode; title: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="tour-page">
      <a className="skip-link" href="#tour-content">
        Pular para o conteúdo
      </a>
      <header className="tour-mobilebar">
        <DemoLink className="workflow-brand" href="/demo">
          <span className="brand-mark">W</span>
          <strong>Workflow</strong>
        </DemoLink>
        <button
          aria-expanded={menuOpen}
          aria-label="Abrir navegação da demo"
          className="tour-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
        >
          Menu
        </button>
      </header>
      <aside className={`tour-sidebar ${menuOpen ? "tour-sidebar--open" : ""}`}>
        <div className="tour-brand-row">
          <DemoLink className="workflow-brand" href="/demo">
            <span className="brand-mark">W</span>
            <strong>Workflow</strong>
          </DemoLink>
          <span>TOUR</span>
        </div>
        <p className="tour-sidebar-copy">Explore uma agência em movimento — sem criar conta.</p>
        <nav aria-label="Navegação da demonstração">
          {links.map(([label, href, number]) => {
            const active = href === "/demo" ? pathname === href : pathname.startsWith(href);
            return (
              <DemoLink
                aria-current={active ? "page" : undefined}
                href={href}
                key={href}
                onClick={() => setMenuOpen(false)}
              >
                <small>{number}</small>
                {label}
                <b aria-hidden="true">→</b>
              </DemoLink>
            );
          })}
        </nav>
        <div className="tour-sidebar-foot">
          <span>Somente leitura</span>
          <p>
            Dados fictícios
            <br />
            Agência Aurora
          </p>
        </div>
      </aside>
      <section className="tour-workspace">
        <header className="tour-topbar">
          <div>
            <span className="eyebrow">Demonstração guiada</span>
            <strong>{title}</strong>
          </div>
          <div className="tour-topbar-actions">
            <a href="https://github.com/Thalles714/workflow-app" rel="noreferrer" target="_blank">
              Ver código ↗
            </a>
            <a href="/login">Acesso interno</a>
          </div>
        </header>
        <div id="tour-content">{children}</div>
      </section>
    </main>
  );
}
