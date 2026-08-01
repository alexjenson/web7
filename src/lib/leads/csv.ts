import type { Provider } from "./types";

const COLUMNS: [string, (p: Provider) => string][] = [
  ["First Name", (p) => p.firstName],
  ["Last Name", (p) => p.lastName],
  ["Full Name", (p) => p.name],
  ["Specialty", (p) => p.specialty],
  ["Specialty Group", (p) => p.specialtyGroup],
  ["Phone", (p) => p.phone],
  ["Street", (p) => p.street],
  ["City", (p) => p.city],
  ["State", (p) => p.state],
  ["ZIP", (p) => p.zip],
  ["NPI", (p) => p.npi],
  ["NPPES Profile", (p) => `https://npiregistry.cms.hhs.gov/provider-view/${p.npi}`],
];

function escape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function providersToCsv(providers: Provider[]): string {
  const header = COLUMNS.map((c) => c[0]).join(",");
  const rows = providers.map((p) => COLUMNS.map(([, fn]) => escape(fn(p))).join(","));
  return [header, ...rows].join("\n");
}

/** Trigger a client-side download of arbitrary text as a file. */
export function downloadText(
  content: string,
  filename: string,
  mime = "text/csv;charset=utf-8;",
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCsv(providers: Provider[], filename = "providers.csv"): void {
  downloadText(providersToCsv(providers), filename);
}
