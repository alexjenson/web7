export interface Provider {
  /** National Provider Identifier — the real 10-digit US healthcare ID. */
  npi: string;
  firstName: string;
  lastName: string;
  name: string;
  /** Full NUCC taxonomy description, e.g. "Dentist, Endodontics". */
  specialty: string;
  /** Rolled-up specialty group used for filtering, e.g. "Dental". */
  specialtyGroup: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Filters {
  keyword: string;
  specialtyGroups: string[];
  states: string[];
  cities: string[];
}

export const EMPTY_FILTERS: Filters = {
  keyword: "",
  specialtyGroups: [],
  states: [],
  cities: [],
};
