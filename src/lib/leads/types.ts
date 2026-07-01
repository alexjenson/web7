export type EmailStatus = "verified" | "probable" | "unavailable";

export type Seniority =
  | "C-Suite"
  | "VP"
  | "Director"
  | "Manager"
  | "Senior"
  | "Entry";

export interface Company {
  name: string;
  domain: string;
  industry: string;
  /** Employee headcount bucket label, e.g. "51-200" */
  size: string;
  employees: number;
  revenue: string;
  foundedYear: number;
  city: string;
  state: string;
  country: string;
  techStack: string[];
  linkedin: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  seniority: Seniority;
  department: string;
  email: string;
  emailStatus: EmailStatus;
  phone: string | null;
  city: string;
  state: string;
  country: string;
  linkedin: string;
  company: Company;
}

export interface Filters {
  keyword: string;
  titles: string[];
  seniorities: Seniority[];
  departments: string[];
  industries: string[];
  sizes: string[];
  locations: string[];
  techStack: string[];
  emailStatuses: EmailStatus[];
}

export const EMPTY_FILTERS: Filters = {
  keyword: "",
  titles: [],
  seniorities: [],
  departments: [],
  industries: [],
  sizes: [],
  locations: [],
  techStack: [],
  emailStatuses: [],
};
