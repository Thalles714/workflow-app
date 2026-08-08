"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "./primitives";

type TabItem = { content: ReactNode; id: string; label: string };
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function choose(index: number, focus = false) {
    const item = items[index];
    if (!item) return;
    setActive(item.id);
    if (focus) refs.current[index]?.focus();
  }
  return (
    <div className="ui-tabs-block">
      <div aria-label={label} className="ui-tabs" role="tablist">
        {items.map((item, index) => (
          <button
            aria-controls={`${item.id}-panel`}
            aria-selected={active === item.id}
            id={`${item.id}-tab`}
            key={item.id}
            onClick={() => choose(index)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? items.length - 1
                    : event.key === "ArrowRight"
                      ? (index + 1) % items.length
                      : (index - 1 + items.length) % items.length;
              choose(next, true);
            }}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="tab"
            tabIndex={active === item.id ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          aria-labelledby={`${item.id}-tab`}
          hidden={active !== item.id}
          id={`${item.id}-panel`}
          key={item.id}
          role="tabpanel"
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export function Modal({
  children,
  description,
  open,
  onClose,
  title,
}: {
  children: ReactNode;
  description?: string | undefined;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  return (
    <FocusLayer description={description} kind="modal" onClose={onClose} open={open} title={title}>
      {children}
    </FocusLayer>
  );
}

export function Drawer({
  children,
  description,
  open,
  onClose,
  title,
}: {
  children: ReactNode;
  description?: string | undefined;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  return (
    <FocusLayer description={description} kind="drawer" onClose={onClose} open={open} title={title}>
      {children}
    </FocusLayer>
  );
}

function FocusLayer({
  children,
  description,
  kind,
  onClose,
  open,
  title,
}: {
  children: ReactNode;
  description?: string | undefined;
  kind: "drawer" | "modal";
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const node = panel.current;
    node
      ?.querySelector<HTMLElement>(
        "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])",
      )
      ?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const focusable = [
        ...node.querySelectorAll<HTMLElement>(
          "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])",
        ),
      ].filter((item) => !item.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      returnFocus.current?.focus();
    };
  }, [onClose, open]);
  if (!open) return null;
  return (
    <div
      className={`ui-layer ui-layer--${kind}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className="ui-layer__panel"
        ref={panel}
        role="dialog"
      >
        <div className="ui-layer__head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button aria-label="Fechar" className="ui-icon-button" onClick={onClose} type="button">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ToastDemo() {
  const [message, setMessage] = useState("");
  return (
    <>
      <Button
        onClick={() => {
          setMessage("Alterações salvas.");
          window.setTimeout(() => setMessage(""), 2200);
        }}
        variant="secondary"
      >
        Testar toast
      </Button>
      <div aria-atomic="true" aria-live="polite" className="ui-toast-region">
        {message && (
          <div className="ui-toast">
            <span aria-hidden="true">✓</span>
            {message}
          </div>
        )}
      </div>
    </>
  );
}
