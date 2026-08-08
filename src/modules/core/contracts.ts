export const auroraWorkspaceId = "10000000-0000-0000-0000-000000000001";
export type CoreActionState = { message: string; ok: boolean; values: Record<string, string> };
export const initialCoreActionState: CoreActionState = { message: "", ok: false, values: {} };
