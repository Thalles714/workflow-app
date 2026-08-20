import { pathToFileURL } from "node:url";

const DEFAULT_SUPABASE_URL = "http://127.0.0.1:54321";
const DEFAULT_MAILPIT_URL = "http://127.0.0.1:54324";
const DEFAULT_REQUEST_TIMEOUT_MS = 2_000;

type E2eService = { name: string; timeoutMs?: number; url: string };
type ServiceResult = E2eService & { ok: boolean; reason?: string };
type FetchLike = typeof fetch;

export function requiredE2eServices(env: Record<string, string | undefined> = process.env) {
  return [
    {
      name: "Aplicação local",
      timeoutMs: 10_000,
      url: `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/health`,
    },
    {
      name: "Supabase local",
      url: `${env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL}/auth/v1/health`,
    },
    {
      name: "Mailpit local",
      url: `${env.MAILPIT_API_URL ?? DEFAULT_MAILPIT_URL}/api/v1/messages`,
    },
  ];
}

export function requiredPublicE2eServices(env: Record<string, string | undefined> = process.env) {
  return requiredE2eServices(env).slice(0, 1);
}

export async function checkService(
  service: E2eService,
  fetchImpl: FetchLike = fetch,
): Promise<ServiceResult> {
  try {
    const response = await fetchImpl(service.url, {
      signal: AbortSignal.timeout(service.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS),
    });

    return response.ok
      ? { ...service, ok: true }
      : { ...service, ok: false, reason: `respondeu com HTTP ${response.status}` };
  } catch (error) {
    return {
      ...service,
      ok: false,
      reason: error instanceof Error ? error.message : "não respondeu",
    };
  }
}

export async function runE2ePreflight({
  env = process.env,
  fetchImpl = fetch,
  publicOnly = false,
}: {
  env?: Record<string, string | undefined>;
  fetchImpl?: FetchLike;
  publicOnly?: boolean;
} = {}) {
  const services = publicOnly ? requiredPublicE2eServices(env) : requiredE2eServices(env);
  const results = await Promise.all(services.map((service) => checkService(service, fetchImpl)));
  const unavailable = results.filter((result) => !result.ok);

  if (unavailable.length === 0) {
    console.log(
      publicOnly
        ? "Infraestrutura E2E pública pronta: a aplicação está disponível."
        : "Infraestrutura E2E pronta: aplicação, Supabase e Mailpit estão disponíveis.",
    );
    return 0;
  }

  console.error(
    publicOnly
      ? "Não foi possível iniciar os testes E2E públicos."
      : "Não foi possível iniciar os testes E2E autenticados.",
  );
  for (const service of unavailable) {
    console.error(`- ${service.name}: ${service.url} (${service.reason})`);
  }
  console.error("\nPrepare o ambiente e tente novamente:");
  console.error("  # Terminal 1");
  console.error("  pnpm dev");
  if (!publicOnly) {
    console.error("  pnpm db:start");
    console.error("  pnpm db:reset");
  }
  console.error("  # Terminal 2");
  console.error(publicOnly ? "  pnpm test:e2e:public" : "  pnpm test:e2e");
  return 1;
}

const executedDirectly = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (executedDirectly) {
  process.exitCode = await runE2ePreflight({ publicOnly: process.argv.includes("--public") });
}
