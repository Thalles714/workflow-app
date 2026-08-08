"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar } from "../ui";
import { Waves } from "../ui/wave-background";

const navigation: ReadonlyArray<{
  count?: string | undefined;
  href: string;
  icon: string;
  label: string;
}> = [
  { count: "4", href: "/app", icon: "⌁", label: "Painel" },
  { href: "/app/my-work", icon: "✓", label: "Meu Trabalho" },
  { href: "/app/clients", icon: "◇", label: "Clientes" },
  { href: "/app/projects", icon: "▱", label: "Projetos" },
  { count: "3", href: "/app/approvals", icon: "◉", label: "Aprovações" },
];

export function AppShell({
  children,
  footer,
  roleLabel,
  userLabel,
}: {
  children: ReactNode;
  footer: ReactNode;
  roleLabel: string;
  userLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    function close(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    }
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <div className="workflow-app">
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <header className="mobile-bar">
        <Link aria-label="Workflow, início" className="workflow-brand" href="/app">
          <BrandMark />
          <strong>Workflow</strong>
        </Link>
        <button
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="ui-icon-button"
          onClick={() => setOpen((value) => !value)}
          ref={menuButton}
          type="button"
        >
          {open ? "×" : "☰"}
        </button>
      </header>
      <aside
        aria-hidden={mobile && !open ? true : undefined}
        aria-label="Navegação principal"
        className="app-sidebar"
        data-open={open}
        inert={mobile && !open ? true : undefined}
      >
        <Link aria-label="Workflow, início" className="workflow-brand" href="/app" ref={firstLink}>
          <BrandMark />
          <strong>Workflow</strong>
        </Link>
        <button className="workspace-switch" type="button">
          <span className="workspace-logo">AA</span>
          <span>
            <b>Agência Aurora</b>
            <small>workspace de demonstração</small>
          </span>
          <span aria-hidden="true">⌄</span>
        </button>
        <nav aria-label="Produto" className="nav-group">
          <span className="nav-label">Operação</span>
          {navigation.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              className="nav-link"
              href={item.href as Route}
              key={item.label}
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true" className="nav-icon">
                {item.icon}
              </span>
              {item.label}
              {item.count && <span className="nav-count">{item.count}</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Avatar label={userLabel} size="sm" />
          <span>
            <b>{userLabel}</b>
            <small>{roleLabel}</small>
          </span>
          {footer}
        </div>
      </aside>
      <main className="app-main" id="main">
        {children}
      </main>
    </div>
  );
}

export function LoginShell({ children }: { children: ReactNode }) {
  return (
    <main className="login-shell" id="main">
      <a className="skip-link" href="#login-form">
        Pular para o formulário
      </a>
      <section className="login-shell__form">
        <div className="login-panel">
          <Link className="workflow-brand" href="/">
            <BrandMark />
            <strong>Workflow</strong>
          </Link>
          {children}
        </div>
      </section>
      <section aria-labelledby="login-thesis" className="login-shell__visual">
        <Waves />
        <div className="login-hero-shade" />
        <div className="login-thesis">
          <div className="login-thesis__copy">
            <span className="login-live-pill">
              <i /> Operação em tempo real
            </span>
            <h2 id="login-thesis">
              Veja o trabalho
              <br />
              antes da urgência.
            </h2>
            <p>
              Atrasos, bloqueios e aprovações viram uma fila clara de decisões para a sua agência.
            </p>
          </div>
          <div aria-label="Prévia da Central de Atenção" className="login-product-preview">
            <header>
              <span>
                <i />
                <i />
                <i />
              </span>
              <b>Agência Aurora</b>
              <small>Hoje, 8 ago</small>
            </header>
            <div className="login-product-preview__heading">
              <div>
                <span>Central de atenção</span>
                <strong>Onde agir agora</strong>
              </div>
              <em>4 situações</em>
            </div>
            <div className="mini-radar">
              <MiniSignal label="Landing page bloqueada" meta="crítico" tone="critical" />
              <MiniSignal label="Aprovação aguardando há 2 dias" meta="atenção" tone="warning" />
              <MiniSignal label="Peças de campanha vencem em 3 dias" meta="risco" tone="info" />
            </div>
            <footer>
              <span>
                <b>1</b> tarefa atrasada
              </span>
              <span>
                <b>2</b> entregas na semana
              </span>
              <span>
                <b>1</b> aprovação pendente
              </span>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandMark() {
  return (
    <span aria-hidden="true" className="brand-mark">
      W
    </span>
  );
}
function MiniSignal({ label, meta, tone }: { label: string; meta: string; tone: string }) {
  return (
    <div className={`mini-signal mini-signal--${tone}`}>
      <i />
      {label}
      <span>{meta}</span>
    </div>
  );
}
