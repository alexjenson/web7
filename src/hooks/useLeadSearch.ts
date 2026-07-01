"use client";

import { useCallback, useMemo, useState } from "react";
import { LEADS } from "@/lib/leads/data";
import { activeFilterCount, filterLeads } from "@/lib/leads/filter";
import { EMPTY_FILTERS, type Filters, type Lead } from "@/lib/leads/types";

const PAGE_SIZE = 25;

type FacetKey = Exclude<keyof Filters, "keyword">;

export function useLeadSearch() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const results = useMemo(() => filterLeads(LEADS, filters), [filters]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageLeads = useMemo(
    () => results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [results, currentPage],
  );

  const setKeyword = useCallback((keyword: string) => {
    setFilters((f) => ({ ...f, keyword }));
    setPage(1);
  }, []);

  const toggleFacet = useCallback((key: FacetKey, value: string) => {
    setFilters((f) => {
      const arr = f[key] as string[];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...f, [key]: next };
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectPage = useCallback(() => {
    setSelected((prev) => {
      const ids = pageLeads.map((l) => l.id);
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }, [pageLeads]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const saveSelected = useCallback(() => {
    setSaved((prev) => {
      const next = new Set(prev);
      selected.forEach((id) => next.add(id));
      return next;
    });
  }, [selected]);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectedLeads = useMemo<Lead[]>(
    () => LEADS.filter((l) => selected.has(l.id)),
    [selected],
  );
  const savedLeads = useMemo<Lead[]>(
    () => LEADS.filter((l) => saved.has(l.id)),
    [saved],
  );

  return {
    filters,
    setKeyword,
    toggleFacet,
    clearFilters,
    activeFilters: activeFilterCount(filters),

    results,
    pageLeads,
    currentPage,
    totalPages,
    setPage,
    total: LEADS.length,

    selected,
    selectedLeads,
    toggleSelect,
    toggleSelectPage,
    clearSelection,

    saved,
    savedLeads,
    saveSelected,
    toggleSaved,
  };
}

export type LeadSearch = ReturnType<typeof useLeadSearch>;
