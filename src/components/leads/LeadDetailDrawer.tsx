"use client";

import {
  Bookmark,
  Building2,
  Calendar,
  DollarSign,
  Globe,
  Link2,
  Mail,
  MapPin,
  Phone,
  Users,
  X,
} from "lucide-react";
import type { Lead } from "@/lib/leads/types";
import { Avatar, EmailStatusBadge, Tag } from "./ui";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSaved: (id: string) => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700">{value}</div>
      </div>
    </div>
  );
}

export function LeadDetailDrawer({ lead, onClose, isSaved, onToggleSaved }: Props) {
  if (!lead) return null;
  const c = lead.company;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl animate-slide-in">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <Avatar name={`${lead.firstName} ${lead.lastName}`} size={52} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lead.firstName} {lead.lastName}
              </h2>
              <p className="text-sm text-slate-500">{lead.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                  {lead.seniority}
                </span>
                <span className="text-[11px] text-slate-400">{lead.department}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 border-b border-slate-100 p-4">
          {lead.email ? (
            <a
              href={`mailto:${lead.email}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
          ) : (
            <span className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-sm font-semibold text-slate-400">
              <Mail className="h-4 w-4" /> No email
            </span>
          )}
          <a
            href={lead.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Link2 className="h-4 w-4" />
          </a>
          <button
            onClick={() => onToggleSaved(lead.id)}
            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
              isSaved
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-indigo-600" : ""}`} />
          </button>
        </div>

        <div className="p-5">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Contact</h3>
          <Row icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email || "Not available"} />
          <div className="flex items-center gap-3 pb-2 pl-7 text-xs">
            <EmailStatusBadge status={lead.emailStatus} />
          </div>
          <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={lead.phone || "Not available"} />
          <Row
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={[lead.city, lead.state, lead.country].filter(Boolean).join(", ")}
          />

          <h3 className="mb-1 mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Company</h3>
          <Row icon={<Building2 className="h-4 w-4" />} label="Name" value={c.name} />
          <Row
            icon={<Globe className="h-4 w-4" />}
            label="Website"
            value={
              <a
                href={`https://${c.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {c.domain}
              </a>
            }
          />
          <Row icon={<Building2 className="h-4 w-4" />} label="Industry" value={c.industry} />
          <Row icon={<Users className="h-4 w-4" />} label="Headcount" value={`${c.employees.toLocaleString()} (${c.size})`} />
          <Row icon={<DollarSign className="h-4 w-4" />} label="Revenue" value={c.revenue} />
          <Row icon={<Calendar className="h-4 w-4" />} label="Founded" value={c.foundedYear} />
          <Row
            icon={<MapPin className="h-4 w-4" />}
            label="HQ"
            value={[c.city, c.state, c.country].filter(Boolean).join(", ")}
          />

          <h3 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Tech stack</h3>
          <div className="flex flex-wrap gap-1.5">
            {c.techStack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
