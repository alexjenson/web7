"use client";

import { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { FACETS } from "@/lib/leads/data";
import type { Filters } from "@/lib/leads/types";
import type { LeadSearch } from "@/hooks/useLeadSearch";

type FacetKey = Exclude<keyof Filters, "keyword">;

interface GroupDef {
  key: FacetKey;
  label: string;
  values: string[];
  searchable?: boolean;
}

const GROUPS: GroupDef[] = [
  { key: "seniorities", label: "Seniority", values: FACETS.seniorities },
  { key: "departments", label: "Department", values: FACETS.departments },
  { key: "industries", label: "Industry", values: FACETS.industries, searchable: true },
  { key: "sizes", label: "Company size (employees)", values: FACETS.sizes },
  { key: "locations", label: "Location", values: FACETS.locations, searchable: true },
  { key: "techStack", label: "Tech stack", values: FACETS.techStack, searchable: true },
  { key: "emailStatuses", label: "Email status", values: FACETS.emailStatuses },
];

function FacetGroup({ def, search }: { def: GroupDef; search: LeadSearch }) {
  const [open, setOpen] = useState(def.key === "seniorities" || def.key === "departments");
  const [q, setQ] = useState("");
  const selectedValues = search.filters[def.key] as string[];
  const values = def.searchable && q ? def.values.filter((v) => v.toLowerCase().includes(q.toLowerCase())) : def.values;

  return (
    <div className="border-b border-slate-100 py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-700"
      >
        <span className="flex items-center gap-2">
          {def.label}
          {selectedValues.length > 0 && (
            <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {selectedValues.length}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-2.5 space-y-1">
          {def.searchable && (
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${def.label.toLowerCase()}…`}
                className="w-full rounded-md border border-slate-200 py-1.5 pl-7 pr-2 text-xs outline-none focus:border-indigo-400"
              />
            </div>
          )}
          <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
            {values.map((v) => {
              const checked = selectedValues.includes(v);
              return (
                <label
                  key={v}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => search.toggleFacet(def.key, v)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="truncate capitalize">{v}</span>
                </label>
              );
            })}
            {values.length === 0 && <p className="px-1.5 py-1 text-xs text-slate-400">No matches</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({ search }: { search: LeadSearch }) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
          Filters
        </h2>
        {search.activeFilters > 0 && (
          <button
            onClick={search.clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600"
          >
            <X className="h-3 w-3" /> Clear ({search.activeFilters})
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {GROUPS.map((g) => (
          <FacetGroup key={g.key} def={g} search={search} />
        ))}
        <div className="py-4 text-center text-[11px] text-slate-400">
          Demo dataset · {search.total} sample contacts
        </div>
      </div>
    </aside>
  );
}
