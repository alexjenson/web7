"use client";

import {
  Bookmark,
  BadgeCheck,
  ExternalLink,
  MapPin,
  Phone,
  Stethoscope,
  X,
} from "lucide-react";
import type { Provider } from "@/lib/leads/types";
import { Avatar, SpecialtyBadge } from "./ui";

interface Props {
  provider: Provider | null;
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

export function LeadDetailDrawer({ provider, onClose, isSaved, onToggleSaved }: Props) {
  if (!provider) return null;
  const p = provider;
  const nppes = `https://npiregistry.cms.hhs.gov/provider-view/${p.npi}`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl animate-slide-in">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <Avatar name={p.name} size={52} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{p.name}</h2>
              <p className="text-sm text-slate-500">{p.specialty}</p>
              <div className="mt-1.5">
                <SpecialtyBadge group={p.specialtyGroup} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 border-b border-slate-100 p-4">
          <a
            href={`tel:${p.phone}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={nppes}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => onToggleSaved(p.npi)}
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
          <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={p.phone} />
          <Row
            icon={<MapPin className="h-4 w-4" />}
            label="Practice address"
            value={
              <span>
                {p.street}
                <br />
                {p.city}, {p.state} {p.zip}
              </span>
            }
          />

          <h3 className="mb-1 mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Provider</h3>
          <Row icon={<Stethoscope className="h-4 w-4" />} label="Specialty" value={p.specialty} />
          <Row
            icon={<BadgeCheck className="h-4 w-4" />}
            label="NPI number"
            value={
              <a href={nppes} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {p.npi}
              </a>
            }
          />

          <a
            href={nppes}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" /> Verify on official NPPES registry
          </a>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
            Public-record data from the CMS National Provider Identifier registry.
          </p>
        </div>
      </aside>
    </>
  );
}
