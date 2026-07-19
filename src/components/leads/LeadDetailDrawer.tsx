"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  BadgeCheck,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  RefreshCw,
  Sparkles,
  Stethoscope,
  UserSearch,
  X,
} from "lucide-react";
import type { Provider } from "@/lib/leads/types";
import {
  generateOutreach,
  googleLinkedInUrl,
  leadScore,
  linkedInSearchUrl,
  scoreTier,
} from "@/lib/leads/ai";
import { Avatar, ScoreBadge, SpecialtyBadge } from "./ui";

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function LeadDetailDrawer({ provider, onClose, isSaved, onToggleSaved }: Props) {
  const [offer, setOffer] = useState("");
  const [variant, setVariant] = useState(0);

  const score = provider ? leadScore(provider) : 0;
  const tier = scoreTier(score);
  const outreach = useMemo(
    () => (provider ? generateOutreach(provider, offer, variant) : null),
    [provider, offer, variant],
  );

  if (!provider || !outreach) return null;
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
              <div className="mt-1.5 flex items-center gap-2">
                <SpecialtyBadge group={p.specialtyGroup} />
                <ScoreBadge score={score} tier={tier} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary actions */}
        <div className="flex gap-2 border-b border-slate-100 p-4">
          <a
            href={linkedInSearchUrl(p)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0a66c2] py-2 text-sm font-semibold text-white hover:bg-[#08508f]"
          >
            <UserSearch className="h-4 w-4" /> Find on LinkedIn
          </a>
          <a
            href={`tel:${p.phone}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Phone className="h-4 w-4" />
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

        {/* AI outreach assistant */}
        <div className="border-b border-slate-100 bg-gradient-to-b from-indigo-50/60 to-white p-5">
          <h3 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Sparkles className="h-4 w-4 text-indigo-600" /> AI outreach assistant
          </h3>
          <p className="mb-3 text-xs text-slate-500">
            Personalized from this lead&apos;s real data. Add what you offer for a sharper draft.
          </p>

          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="What do you offer? e.g. patient booking software"
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />

          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  LinkedIn connection note
                </span>
                <CopyButton text={outreach.connectionNote} />
              </div>
              <p className="text-sm text-slate-700">{outreach.connectionNote}</p>
              <p className="mt-1 text-[11px] text-slate-400">{outreach.connectionNote.length}/300 characters</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Opening message
                </span>
                <CopyButton text={outreach.openingMessage} />
              </div>
              <p className="text-sm text-slate-700">{outreach.openingMessage}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Talking points</span>
              <ul className="mt-1.5 space-y-1">
                {outreach.talkingPoints.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="mt-0.5 text-indigo-400">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setVariant((v) => v + 1)}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
          </button>
        </div>

        {/* Contact + provider details */}
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
          <Row
            icon={<UserSearch className="h-4 w-4" />}
            label="Profile lookup"
            value={
              <span className="flex flex-wrap gap-x-3">
                <a href={linkedInSearchUrl(p)} target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] hover:underline">
                  LinkedIn search
                </a>
                <a href={googleLinkedInUrl(p)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Google profile lookup
                </a>
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
            Public-record data from the CMS National Provider Identifier registry. LinkedIn lookups open a
            search — profiles are matched by name, specialty, and city.
          </p>
        </div>
      </aside>
    </>
  );
}
