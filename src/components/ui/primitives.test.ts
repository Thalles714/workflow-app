import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Alert, Field, Input, Table } from "./primitives";

describe("UI primitives semantics", () => {
  it("keeps a visible label associated with its native field", () => {
    const html = renderToStaticMarkup(
      createElement(
        Field,
        { label: "Nome" } as Parameters<typeof Field>[0],
        createElement(Input, { name: "name" }),
      ),
    );
    expect(html).toContain("<label");
    expect(html).toContain('name="name"');
    expect(html).toContain(">Nome<");
  });

  it("uses an alert role for errors and a status role for success", () => {
    const error = renderToStaticMarkup(
      createElement(
        Alert,
        { title: "Falha", tone: "error" } as Parameters<typeof Alert>[0],
        "Tente novamente.",
      ),
    );
    const success = renderToStaticMarkup(
      createElement(
        Alert,
        { title: "Salvo", tone: "success" } as Parameters<typeof Alert>[0],
        "Alterações salvas.",
      ),
    );
    expect(error).toContain('role="alert"');
    expect(success).toContain('role="status"');
  });

  it("contains wide tables in a named keyboard-scrollable region", () => {
    const html = renderToStaticMarkup(createElement(Table, null, createElement("tbody", null)));
    expect(html).toContain('role="region"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("<table");
  });
});
