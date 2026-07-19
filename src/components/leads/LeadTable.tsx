"use client";

import { ExternalLink, MapPin, Phone, Stethoscope, UserSearch } from "lucide-react";
import type { Provider } from "@/lib/leads/types";
import type { LeadSearch } from "@/hooks/useLeadSearch";
import { leadScore, linkedInSearchUrl, scoreTier } from "@/lib/leads/ai";
import { Avatar, ScoreBadge, SpecialtyBadge } from "./ui";

interface Props {
  search: LeadSearch;
  onOpen: (provider: Provider) => void;
}

export function LeadTable({ search, onOpen }: Props) {
  const { pageLeads, selected, toggleSelect, toggleSelectPage } = search;
  const allPageSelected = pageLeads.length > 0 && pageLeads.every((p) => selected.has(p.npi));

  if (pageLeads.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <Stethoscope className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">No providers match your filters</p>
        <button onClick={search.clearFilters} className="text-sm font-medium text-indigo-600 hover:underline">
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-10 px-4 py-2.5">
              <input
                type="checkbox"
                checked={allPageSelected}
                onChange={toggleSelectPage}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th className="px-3 py-2.5">Provider</th>
            <th className="px-3 py-2.5">Specialty</th>
            <th className="px-3 py-2.5">Location</th>
            <th className="px-3 py-2.5">AI score</th>
            <th className="px-3 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pageLeads.map((p) => {
            const isSel = selected.has(p.npi);
            return (
              <tr
                key={p.npi}
                onClick={() => onOpen(p)}
                className={`cursor-pointer transition-colors hover:bg-indigo-50/40 ${isSel ? "bg-indigo-50/60" : "bg-white"}`}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggleSelect(p.npi)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-800">{p.name}</div>
                      <div className="truncate text-xs text-slate-400">{p.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <SpecialtyBadge group={p.specialtyGroup} />
                  <div className="mt-1 truncate text-xs text-slate-500">{p.specialty}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">
                      {p.city}, {p.state}
                    </span>
                  </div>
                  <div className="truncate text-xs text-slate-400">{p.street}</div>
                </td>
                <td className="px-3 py-3">
                  <ScoreBadge score={leadScore(p)} tier={scoreTier(leadScore(p))} />
                </td>
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href={linkedInSearchUrl(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Find on LinkedIn"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0a66c2]"
                    >
                      <UserSearch className="h-4 w-4" />
                    </a>
                    <a
                      href={`tel:${p.phone}`}
                      title="Call"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://npiregistry.cms.hhs.gov/provider-view/${p.npi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View official NPPES record"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
