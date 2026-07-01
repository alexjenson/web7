"use client";

import type { EmailStatus } from "@/lib/leads/types";

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
];

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

const EMAIL_META: Record<EmailStatus, { label: string; dot: string; text: string; bg: string }> = {
  verified: { label: "Verified", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  probable: { label: "Probable", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  unavailable: { label: "No email", dot: "bg-slate-400", text: "text-slate-500", bg: "bg-slate-100" },
};

export function EmailStatusBadge({ status }: { status: EmailStatus }) {
  const m = EMAIL_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      {children}
    </span>
  );
}
