"use client";

import { useActionState, useState } from "react";
import { Button, Input, Select } from "../ui";
import { initialCoreActionState, type CoreActionState } from "../../modules/core/contracts";

export type FormField = {
  defaultValue?: string | undefined;
  label: string;
  name: string;
  options?: { label: string; value: string }[] | undefined;
  required?: boolean | undefined;
  type?: "checkbox" | "datetime-local" | "hidden" | "select" | "text" | "textarea" | undefined;
};
type Action = (state: CoreActionState, data: FormData) => Promise<CoreActionState>;

export function EntityForm({
  action,
  fields,
  submitLabel,
  confirmMessage,
}: {
  action: Action;
  fields: FormField[];
  submitLabel: string;
  confirmMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialCoreActionState);
  const blockedField = fields.find((field) => field.name === "isBlocked");
  const [blocked, setBlocked] = useState(
    blockedField?.defaultValue === "true" || state.values.isBlocked === "on",
  );
  return (
    <form
      action={formAction}
      className="entity-form"
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {fields.map((field) => {
        const value = state.values[field.name] ?? field.defaultValue ?? "";
        if (field.type === "hidden")
          return <input key={field.name} name={field.name} type="hidden" value={value} />;
        if (field.type === "checkbox")
          return (
            <label className="check-field" key={field.name}>
              <input
                defaultChecked={value === "true" || value === "on"}
                name={field.name}
                onChange={
                  field.name === "isBlocked"
                    ? (event) => setBlocked(event.target.checked)
                    : undefined
                }
                type="checkbox"
              />
              {field.label}
            </label>
          );
        return (
          <label className="ui-field" key={field.name}>
            <span>{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                className="ui-input core-textarea"
                defaultValue={value}
                name={field.name}
                required={field.required || (field.name === "blockReason" && blocked)}
              />
            ) : field.type === "select" ? (
              <Select defaultValue={value} name={field.name} required={field.required}>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                defaultValue={value}
                name={field.name}
                required={field.required || (field.name === "blockReason" && blocked)}
                type={field.type ?? "text"}
              />
            )}
          </label>
        );
      })}
      <div className="form-footer">
        <Button disabled={pending} type="submit" variant="brand">
          {pending ? "Salvando…" : submitLabel}
        </Button>
        {state.message && (
          <p
            className={state.ok ? "form-success" : "form-error"}
            role={state.ok ? "status" : "alert"}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function ArchiveForm({
  action,
  id,
  label = "Arquivar",
}: {
  action: Action;
  id: string;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialCoreActionState);
  return (
    <form action={formAction} className="archive-form">
      <input name="id" type="hidden" value={id} />
      <Button disabled={pending} type="submit" variant="ghost">
        {pending ? "Arquivando…" : label}
      </Button>
      {state.message && (
        <span
          className={state.ok ? "form-success" : "form-error"}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}
