export type CoreActionState = { message: string; ok: boolean; values: Record<string, string> };
export const initialCoreActionState: CoreActionState = { message: "", ok: false, values: {} };
