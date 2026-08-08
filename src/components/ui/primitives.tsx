import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TableHTMLAttributes,
} from "react";

type ButtonVariant = "brand" | "ghost" | "primary" | "secondary";
export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`ui-button ui-button--${variant} ${className}`} {...props} />;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`ui-card ${className}`} {...props} />;
}

export function Avatar({ label, size = "md" }: { label: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span aria-label={label} className={`ui-avatar ui-avatar--${size}`} role="img">
      {initials(label)}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "critical" | "info" | "neutral" | "success" | "warning";
}) {
  return (
    <span className={`ui-badge ui-badge--${tone}`}>
      <span aria-hidden="true" className="ui-badge__dot" />
      {children}
    </span>
  );
}

export function Chip({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
  return (
    <span className="ui-chip">
      {children}
      {onRemove && (
        <button aria-label={`Remover ${String(children)}`} onClick={onRemove} type="button">
          ×
        </button>
      )}
    </span>
  );
}

export function Field({
  error,
  helper,
  label,
  children,
}: {
  children: ReactNode;
  error?: string;
  helper?: string;
  label: string;
}) {
  const message = error ?? helper;
  return (
    <label className="ui-field">
      <span>{label}</span>
      {children}
      {message && <small className={error ? "ui-field__error" : ""}>{message}</small>}
    </label>
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`ui-input ${className}`} {...props} />;
}

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`ui-input ui-select ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Table({ className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div
      className="ui-table-wrap"
      role="region"
      aria-label="Tabela com rolagem horizontal"
      tabIndex={0}
    >
      <table className={`ui-table ${className}`} {...props} />
    </div>
  );
}

export function Alert({
  children,
  title,
  tone = "info",
}: {
  children: ReactNode;
  title: string;
  tone?: "error" | "info" | "success" | "warning";
}) {
  return (
    <div className={`ui-alert ui-alert--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <span aria-hidden="true">{tone === "error" ? "!" : tone === "success" ? "✓" : "i"}</span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="ui-empty">
      <span aria-hidden="true">◇</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`ui-skeleton ${className}`} />;
}

function initials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
