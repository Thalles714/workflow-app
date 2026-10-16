import Link from "next/link";
import type { ReactNode } from "react";

import { AppShell } from "../layouts/app-shell";
import { logout } from "../../modules/auth/actions";
import { requirePageUser } from "../../modules/auth/guard";
import { createAuthorizationContext } from "../../modules/authorization/server";

export async function CoreShell({ children }: { children: ReactNode }) {
  const user = await requirePageUser();
  const context = await createAuthorizationContext();
  return (
    <AppShell
      footer={
        <form action={logout}>
          <button className="sidebar-logout" type="submit">
            Sair
          </button>
        </form>
      }
      roleLabel={context.role === "ADMIN" ? "Administrador" : "Membro"}
      userLabel={user.email ?? "Conta demo"}
    >
      {children}
    </AppShell>
  );
}
export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="core-breadcrumbs">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 && <i aria-hidden="true">/</i>}
          {item.href ? (
            <Link href={item.href as never}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  action?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="core-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
