export type HealthStatus = Readonly<{
  service: "workflow-app";
  status: "ok";
}>;

export function getHealthStatus(): HealthStatus {
  return {
    service: "workflow-app",
    status: "ok",
  };
}
