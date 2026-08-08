"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DemoIcon } from "./demo-icon";
import { DemoLink } from "./demo-link";

const links = [
  { count: "6", href: "/demo", icon: "central", label: "Central" },
  { count: "4", href: "/demo/my-work", icon: "my-work", label: "Meu trabalho" },
  { count: "4", href: "/demo/clients", icon: "clients", label: "Clientes" },
  { count: "5", href: "/demo/projects/lancamento-q3", icon: "project", label: "Projetos" },
  { count: "2", href: "/demo/approvals", icon: "approvals", label: "Aprovações" },
] as const;

export function DemoShell({ children, title }: { children: ReactNode; title: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    sidebarRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

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
          aria-controls="tour-sidebar"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fechar navegação da demo" : "Abrir navegação da demo"}
          className="tour-menu"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {menuOpen ? "Fechar" : "Menu"}
        </button>
      </header>
      <aside
        aria-hidden={!menuOpen ? undefined : false}
        className={`tour-sidebar ${menuOpen ? "tour-sidebar--open" : ""}`}
        id="tour-sidebar"
        ref={sidebarRef}
      >
        <DemoLink className="tour-sidebar-brand" href="/demo" onClick={closeMenu}>
          <span className="brand-mark">W</span>
          <strong>Workflow</strong>
        </DemoLink>
        <div className="tour-workspace-switcher">
          <span aria-hidden="true">AA</span>
          <div>
            <strong>Agência Aurora</strong>
            <small>workspace de demonstração</small>
          </div>
          <DemoIcon name="chevron" />
        </div>
        <span className="tour-nav-label">Operação</span>
        <nav aria-label="Navegação da demonstração">
          {links.map(({ count, href, icon, label }) => {
            const active = href === "/demo" ? pathname === href : pathname.startsWith(href);
            return (
              <DemoLink
                aria-current={active ? "page" : undefined}
                href={href}
                key={href}
                onClick={closeMenu}
              >
                <DemoIcon name={icon} />
                <span>{label}</span>
                <small className={count === "6" || count === "2" ? "is-emphasis" : undefined}>
                  {count}
                </small>
              </DemoLink>
            );
          })}
        </nav>
        <div className="tour-sidebar-foot">
          <span>Demo pública</span>
          <p>Explore livremente. Nenhuma ação altera os dados.</p>
        </div>
        <div className="tour-profile">
          <span aria-hidden="true">AM</span>
          <div>
            <strong>Ana Martins</strong>
            <small>Gestora da operação</small>
          </div>
        </div>
      </aside>
      {menuOpen ? (
        <button
          aria-label="Fechar navegação"
          className="tour-sidebar-backdrop"
          onClick={closeMenu}
        />
      ) : null}
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
