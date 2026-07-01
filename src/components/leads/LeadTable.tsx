"use client";

import { Building2, Link2, Mail, MapPin, Phone } from "lucide-react";
import type { Lead } from "@/lib/leads/types";
import type { LeadSearch } from "@/hooks/useLeadSearch";
import { Avatar, EmailStatusBadge } from "./ui";

interface Props {
  search: LeadSearch;
  onOpen: (lead: Lead) => void;
}

export function LeadTable({ search, onOpen }: Props) {
  const { pageLeads, selected, toggleSelect, toggleSelectPage } = search;
  const allPageSelected = pageLeads.length > 0 && pageLeads.every((l) => selected.has(l.id));

  if (pageLeads.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <Building2 className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">No contacts match your filters</p>
        <button onClick={search.clearFilters} className="text-sm font-medium text-indigo-600 hover:underline">
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-sm">
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
            <th className="px-3 py-2.5">Name</th>
            <th className="px-3 py-2.5">Company</th>
            <th className="px-3 py-2.5">Email</th>
            <th className="px-3 py-2.5">Location</th>
            <th className="px-3 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pageLeads.map((l) => {
            const isSel = selected.has(l.id);
            return (
              <tr
                key={l.id}
                onClick={() => onOpen(l)}
                className={`cursor-pointer transition-colors hover:bg-indigo-50/40 ${isSel ? "bg-indigo-50/60" : "bg-white"}`}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggleSelect(l.id)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={`${l.firstName} ${l.lastName}`} />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-800">
                        {l.firstName} {l.lastName}
                      </div>
                      <div className="truncate text-xs text-slate-500">{l.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="truncate font-medium text-slate-700">{l.company.name}</div>
                  <div className="truncate text-xs text-slate-400">
                    {l.company.industry} · {l.company.size} emp
                  </div>
                </td>
                <td className="px-3 py-3">
                  <EmailStatusBadge status={l.emailStatus} />
                  {l.email && <div className="mt-1 truncate text-xs text-slate-500">{l.email}</div>}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{l.city || l.country}</span>
                  </div>
                  <div className="truncate text-xs text-slate-400">{l.country}</div>
                </td>
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    {l.email && (
                      <a
                        href={`mailto:${l.email}`}
                        title="Email"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {l.phone && (
                      <span title={l.phone} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                        <Phone className="h-4 w-4" />
                      </span>
                    )}
                    <a
                      href={l.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <Link2 className="h-4 w-4" />
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
