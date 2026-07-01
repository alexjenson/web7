import type { Filters, Lead } from "./types";

export function filterLeads(leads: Lead[], f: Filters): Lead[] {
  const kw = f.keyword.trim().toLowerCase();
  return leads.filter((l) => {
    if (kw) {
      const hay = `${l.firstName} ${l.lastName} ${l.title} ${l.company.name} ${l.department}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    if (f.titles.length && !f.titles.includes(l.title)) return false;
    if (f.seniorities.length && !f.seniorities.includes(l.seniority)) return false;
    if (f.departments.length && !f.departments.includes(l.department)) return false;
    if (f.industries.length && !f.industries.includes(l.company.industry)) return false;
    if (f.sizes.length && !f.sizes.includes(l.company.size)) return false;
    if (f.locations.length && !f.locations.includes(l.country)) return false;
    if (f.emailStatuses.length && !f.emailStatuses.includes(l.emailStatus)) return false;
    if (f.techStack.length && !f.techStack.every((t) => l.company.techStack.includes(t))) return false;
    return true;
  });
}

export function activeFilterCount(f: Filters): number {
  return (
    (f.keyword.trim() ? 1 : 0) +
    f.titles.length +
    f.seniorities.length +
    f.departments.length +
    f.industries.length +
    f.sizes.length +
    f.locations.length +
    f.techStack.length +
    f.emailStatuses.length
  );
}
