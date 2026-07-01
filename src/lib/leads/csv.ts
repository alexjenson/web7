import type { Lead } from "./types";

const COLUMNS: [string, (l: Lead) => string][] = [
  ["First Name", (l) => l.firstName],
  ["Last Name", (l) => l.lastName],
  ["Title", (l) => l.title],
  ["Seniority", (l) => l.seniority],
  ["Department", (l) => l.department],
  ["Email", (l) => l.email],
  ["Email Status", (l) => l.emailStatus],
  ["Phone", (l) => l.phone ?? ""],
  ["LinkedIn", (l) => l.linkedin],
  ["Company", (l) => l.company.name],
  ["Company Domain", (l) => l.company.domain],
  ["Industry", (l) => l.company.industry],
  ["Employees", (l) => String(l.company.employees)],
  ["Revenue", (l) => l.company.revenue],
  ["Tech Stack", (l) => l.company.techStack.join("; ")],
  ["City", (l) => l.city],
  ["State", (l) => l.state],
  ["Country", (l) => l.country],
];

function escape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function leadsToCsv(leads: Lead[]): string {
  const header = COLUMNS.map((c) => c[0]).join(",");
  const rows = leads.map((l) => COLUMNS.map(([, fn]) => escape(fn(l))).join(","));
  return [header, ...rows].join("\n");
}

export function downloadCsv(leads: Lead[], filename = "leads.csv"): void {
  const blob = new Blob([leadsToCsv(leads)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
