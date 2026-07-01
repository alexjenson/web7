import type { Filters, Provider } from "./types";

export function filterProviders(providers: Provider[], f: Filters): Provider[] {
  const kw = f.keyword.trim().toLowerCase();
  return providers.filter((p) => {
    if (kw) {
      const hay = `${p.name} ${p.specialty} ${p.city} ${p.state} ${p.npi}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    if (f.specialtyGroups.length && !f.specialtyGroups.includes(p.specialtyGroup)) return false;
    if (f.states.length && !f.states.includes(p.state)) return false;
    if (f.cities.length && !f.cities.includes(p.city)) return false;
    return true;
  });
}

export function activeFilterCount(f: Filters): number {
  return (
    (f.keyword.trim() ? 1 : 0) +
    f.specialtyGroups.length +
    f.states.length +
    f.cities.length
  );
}
