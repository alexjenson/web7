"use client";

import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import { useLeadSearch } from "@/hooks/useLeadSearch";
import { downloadCsv } from "@/lib/leads/csv";
import { DATA_SOURCE } from "@/lib/leads/data";
import type { Provider } from "@/lib/leads/types";
import { FilterSidebar } from "./FilterSidebar";
import { LeadTable } from "./LeadTable";
import { LeadDetailDrawer } from "./LeadDetailDrawer";
import { Avatar, SpecialtyBadge } from "./ui";

export function LeadFinder() {
  const search = useLeadSearch();
  const [active, setActive] = useState<Provider | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const { currentPage, totalPages, results, selectedLeads, savedLeads } = search;
  const rangeStart = results.length === 0 ? 0 : (currentPage - 1) * 25 + 1;
  const rangeEnd = Math.min(currentPage * 25, results.length);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Lead<span className="text-indigo-600">Hawk</span>
          </span>
          <span className="ml-1 hidden text-xs font-medium text-slate-400 sm:inline">AI Lead Finder</span>
          <span className="ml-2 hidden items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 sm:inline-flex">
            <ShieldCheck className="h-3 w-3" /> Real NPI data
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaved(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Bookmark className="h-4 w-4" /> Saved
            <span className="rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white">
              {savedLeads.length}
            </span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <FilterSidebar search={search} />

        <main className="flex min-w-0 flex-1 flex-col">
          {/* Toolbar */}
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search.filters.keyword}
                  onChange={(e) => search.setKeyword(e.target.value)}
                  placeholder="Search by name, specialty, or city…"
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <button
                onClick={() => downloadCsv(results, "leadhawk-providers.csv")}
                disabled={results.length === 0}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <Download className="h-4 w-4" /> Export all
              </button>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{results.length.toLocaleString()}</span>
              providers match
              {results.length > 0 && (
                <span className="text-slate-400">
                  · showing {rangeStart}–{rangeEnd}
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <LeadTable search={search} onOpen={setActive} />
          </div>

          {/* Pagination */}
          {results.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-2.5 text-sm">
              <a
                href={DATA_SOURCE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-xs text-slate-400 hover:text-indigo-600 sm:block"
              >
                {DATA_SOURCE.note}
              </a>
              <span className="text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => search.setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <button
                  onClick={() => search.setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Selection action bar */}
      {selectedLeads.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-xl animate-fade-in">
            <span className="text-sm font-semibold text-slate-800">{selectedLeads.length} selected</span>
            <span className="h-4 w-px bg-slate-200" />
            <button
              onClick={search.saveSelected}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Bookmark className="h-4 w-4" /> Save to list
            </button>
            <button
              onClick={() => downloadCsv(selectedLeads, "leadhawk-selection.csv")}
              className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={search.clearSelection} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Saved list drawer */}
      {showSaved && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={() => setShowSaved(false)} />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Bookmark className="h-5 w-5 text-indigo-600" /> Saved list ({savedLeads.length})
              </h2>
              <button onClick={() => setShowSaved(false)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {savedLeads.length > 0 && (
              <div className="border-b border-slate-100 p-4">
                <button
                  onClick={() => downloadCsv(savedLeads, "leadhawk-saved.csv")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" /> Export saved list
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-3">
              {savedLeads.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-20 text-center text-slate-400">
                  <Bookmark className="h-8 w-8" />
                  <p className="text-sm">No saved providers yet.</p>
                  <p className="text-xs">Select rows and choose “Save to list”.</p>
                </div>
              ) : (
                savedLeads.map((p) => (
                  <div key={p.npi} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50">
                    <Avatar name={p.name} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-800">{p.name}</div>
                      <div className="truncate text-xs text-slate-500">
                        {p.city}, {p.state}
                      </div>
                    </div>
                    <SpecialtyBadge group={p.specialtyGroup} />
                    <button
                      onClick={() => search.toggleSaved(p.npi)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>
        </>
      )}

      <LeadDetailDrawer
        provider={active}
        onClose={() => setActive(null)}
        isSaved={active ? search.saved.has(active.npi) : false}
        onToggleSaved={search.toggleSaved}
      />
    </div>
  );
}
