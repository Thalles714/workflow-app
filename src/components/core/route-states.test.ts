import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { RouteErrorState } from "./route-error-state";
import { RouteLoadingState } from "./route-loading-state";

describe("route states", () => {
  it("describes a recoverable error with one retry action", () => {
    const html = renderToStaticMarkup(
      createElement(RouteErrorState, {
        description: "Nenhum dado foi alterado.",
        eyebrow: "Aprovações indisponíveis",
        retry: vi.fn(),
        title: "Não foi possível carregar as aprovações",
      }),
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Não foi possível carregar as aprovações");
    expect(html).toContain("Nenhum dado foi alterado.");
    expect(html).toContain(">Tentar novamente</button>");
  });

  it("announces the loading context without exposing decorative skeletons", () => {
    const html = renderToStaticMarkup(createElement(RouteLoadingState, { label: "aprovações" }));

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('aria-label="Carregando aprovações"');
    expect(html).toContain('aria-hidden="true"');
  });
});
