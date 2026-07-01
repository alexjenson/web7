"use client";

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[hash(name) % AVATAR_COLORS.length];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

const GROUP_COLORS: Record<string, string> = {
  Dental: "bg-sky-50 text-sky-700",
  Dermatology: "bg-rose-50 text-rose-700",
  "Family Medicine": "bg-emerald-50 text-emerald-700",
  Chiropractic: "bg-amber-50 text-amber-700",
  "Physical Therapy": "bg-teal-50 text-teal-700",
  Optometry: "bg-violet-50 text-violet-700",
  "Psychiatry & Neurology": "bg-indigo-50 text-indigo-700",
  Pediatrics: "bg-pink-50 text-pink-700",
  "Internal Medicine": "bg-cyan-50 text-cyan-700",
};

export function SpecialtyBadge({ group }: { group: string }) {
  const color = GROUP_COLORS[group] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {group}
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
