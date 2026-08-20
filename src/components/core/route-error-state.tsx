"use client";

import { Button } from "../ui";

export function RouteErrorState({
  description,
  eyebrow,
  retry,
  title,
}: {
  description: string;
  eyebrow: string;
  retry: () => void;
  title: string;
}) {
  return (
    <main className="core-page">
      <section className="operation-permission" role="alert">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Button onClick={retry} type="button">
          Tentar novamente
        </Button>
      </section>
    </main>
  );
}
