import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const seedPath = fileURLToPath(new URL("../supabase/seed.sql", import.meta.url));
const seed = await readFile(seedPath, "utf8");
const expectedCounts = {
  approvals: 2,
  clients: 4,
  deliverables: 7,
  projects: 5,
  tasks: 9,
};

for (const [table, expected] of Object.entries(expectedCounts)) {
  const start = seed.indexOf(`insert into public.${table} `);
  const end = seed.indexOf("on conflict", start);
  if (start === -1 || end === -1) throw new Error(`Bloco ${table} ausente no seed.`);
  const rows = [...seed.slice(start, end).matchAll(/^\s*\('([0-9a-f-]{36})',/gim)];
  if (rows.length !== expected)
    throw new Error(`${table}: esperava ${expected} IDs estáveis, recebeu ${rows.length}.`);
}

const requiredIds = [
  "40000000-0000-0000-0000-000000000001",
  "40000000-0000-0000-0000-000000000002",
  "40000000-0000-0000-0000-000000000003",
  "40000000-0000-0000-0000-000000000005",
  "40000000-0000-0000-0000-000000000006",
];
for (const id of requiredIds)
  if (!seed.includes(id)) throw new Error(`Gatilho demo ausente: ${id}.`);

const hash = createHash("sha256").update(seed).digest("hex");
console.log(`Seed verificado: ${JSON.stringify(expectedCounts)}; sha256=${hash}`);
