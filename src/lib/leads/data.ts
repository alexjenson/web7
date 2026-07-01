import raw from "./providers.json";
import type { Provider } from "./types";

/**
 * Real US healthcare providers pulled from the CMS NPPES NPI Registry
 * (the official national provider database). Names, specialties, practice
 * addresses, and phone numbers are genuine public-record data. Baked in at
 * build time so the site stays fully static — no API keys, no per-query cost.
 */
export const PROVIDERS: Provider[] = raw as Provider[];

const uniqueSorted = (values: string[]) => Array.from(new Set(values)).sort();

export const FACETS = {
  specialtyGroups: uniqueSorted(PROVIDERS.map((p) => p.specialtyGroup)),
  states: uniqueSorted(PROVIDERS.map((p) => p.state)),
  cities: uniqueSorted(PROVIDERS.map((p) => p.city)),
};

/** Data provenance shown in the UI. */
export const DATA_SOURCE = {
  label: "CMS NPPES NPI Registry",
  url: "https://npiregistry.cms.hhs.gov",
  note: "Real US healthcare providers · public record",
};
