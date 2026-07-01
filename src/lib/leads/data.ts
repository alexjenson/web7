import type { Company, EmailStatus, Lead, Seniority } from "./types";

/* ------------------------------------------------------------------ *
 * Deterministic PRNG so the generated dataset is stable across loads. *
 * ------------------------------------------------------------------ */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260701);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const pickN = <T,>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};

/* ------------------------------- pools ---------------------------------- */

const FIRST_NAMES = [
  "James", "Maria", "David", "Sarah", "Michael", "Priya", "Daniel", "Emily",
  "Carlos", "Aisha", "Kevin", "Sofia", "Andrew", "Mei", "Rahul", "Laura",
  "Thomas", "Nina", "Marcus", "Chloe", "Ethan", "Olivia", "Liam", "Ava",
  "Noah", "Grace", "Lucas", "Zoe", "Diego", "Hannah", "Omar", "Isabella",
  "Ryan", "Yuki", "Samuel", "Fatima", "Jonas", "Leah", "Victor", "Amara",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Patel", "Garcia", "Chen", "Müller", "Rossi", "Kim",
  "Nguyen", "Andersson", "Okafor", "Silva", "Kowalski", "Ivanov", "Tanaka",
  "Cohen", "Reyes", "Fischer", "Dubois", "Novak", "Haddad", "Sharma",
  "O'Brien", "Walker", "Bennett", "Torres", "Foster", "Bauer", "Costa",
  "Larsson", "Mensah", "Yamamoto", "Petrov", "Khan", "Moreau", "Schmidt",
];

const CITIES: [string, string, string][] = [
  ["San Francisco", "CA", "United States"],
  ["New York", "NY", "United States"],
  ["Austin", "TX", "United States"],
  ["Seattle", "WA", "United States"],
  ["Boston", "MA", "United States"],
  ["Chicago", "IL", "United States"],
  ["Denver", "CO", "United States"],
  ["Atlanta", "GA", "United States"],
  ["London", "England", "United Kingdom"],
  ["Berlin", "Berlin", "Germany"],
  ["Toronto", "ON", "Canada"],
  ["Amsterdam", "NH", "Netherlands"],
  ["Singapore", "", "Singapore"],
  ["Bangalore", "KA", "India"],
  ["Sydney", "NSW", "Australia"],
  ["Paris", "IDF", "France"],
];

const INDUSTRIES = [
  "Software",
  "Financial Services",
  "Healthcare",
  "E-commerce",
  "Marketing & Advertising",
  "Manufacturing",
  "Cybersecurity",
  "Logistics",
  "Real Estate",
  "Education",
];

const SIZE_BUCKETS: [string, number, number][] = [
  ["1-10", 1, 10],
  ["11-50", 11, 50],
  ["51-200", 51, 200],
  ["201-500", 201, 500],
  ["501-1000", 501, 1000],
  ["1001-5000", 1001, 5000],
  ["5001-10000", 5001, 10000],
];

const REVENUE_BY_SIZE: Record<string, string> = {
  "1-10": "<$1M",
  "11-50": "$1M-$10M",
  "51-200": "$10M-$50M",
  "201-500": "$50M-$100M",
  "501-1000": "$100M-$250M",
  "1001-5000": "$250M-$1B",
  "5001-10000": "$1B+",
};

const TECH = [
  "Salesforce", "HubSpot", "AWS", "Google Cloud", "Snowflake", "Segment",
  "Stripe", "Shopify", "React", "Kubernetes", "Datadog", "Marketo",
  "Zendesk", "Okta", "Databricks", "Twilio", "Figma", "Notion",
];

const DEPARTMENTS: Record<string, string[]> = {
  Engineering: [
    "Software Engineer", "Senior Software Engineer", "Staff Engineer",
    "Engineering Manager", "Director of Engineering", "VP of Engineering",
    "CTO", "DevOps Engineer", "Platform Engineer",
  ],
  Sales: [
    "Account Executive", "Sales Development Rep", "Sales Manager",
    "Director of Sales", "VP of Sales", "Chief Revenue Officer",
    "Enterprise Account Executive",
  ],
  Marketing: [
    "Marketing Manager", "Content Marketer", "Growth Marketer",
    "Director of Marketing", "VP of Marketing", "CMO", "Demand Gen Manager",
  ],
  Product: [
    "Product Manager", "Senior Product Manager", "Director of Product",
    "VP of Product", "Chief Product Officer", "Product Designer",
  ],
  Finance: [
    "Financial Analyst", "Controller", "Finance Manager",
    "Director of Finance", "VP of Finance", "CFO",
  ],
  Operations: [
    "Operations Manager", "Business Operations", "Director of Operations",
    "VP of Operations", "COO", "Chief of Staff",
  ],
  "Human Resources": [
    "Recruiter", "HR Manager", "Talent Acquisition Lead",
    "Director of People", "VP of People", "CHRO",
  ],
};

const COMPANY_NAMES = [
  "Northwind", "Acme", "Lumina", "Vertex", "Cobalt", "Meridian", "Apex",
  "Orbital", "Cascade", "Quill", "Beacon", "Ironclad", "Nimbus", "Fathom",
  "Tessera", "Verdant", "Solstice", "Kestrel", "Halcyon", "Anvil", "Zephyr",
  "Bramble", "Sable", "Cinder", "Drift", "Ember", "Fjord", "Grove",
  "Harbor", "Juniper", "Larkspur", "Monarch", "Onyx", "Pinnacle", "Quartz",
  "Riptide", "Summit", "Thistle", "Umbra", "Vantage", "Willow", "Axiom",
];

const COMPANY_SUFFIX = ["Labs", "Systems", "Technologies", "Group", "Digital", "Works", "AI", "Cloud", ""];

const SENIORITY_RULES: [RegExp, Seniority][] = [
  [/^(CTO|CFO|CMO|COO|CHRO|Chief|Chief Revenue Officer|Chief Product Officer)/i, "C-Suite"],
  [/VP of/i, "VP"],
  [/Director/i, "Director"],
  [/Manager|Lead|Controller|Chief of Staff/i, "Manager"],
  [/Senior|Staff|Enterprise/i, "Senior"],
];

function seniorityFor(title: string): Seniority {
  for (const [re, s] of SENIORITY_RULES) if (re.test(title)) return s;
  return "Entry";
}

function domainFor(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 18) + pick([".com", ".io", ".co", ".ai"])
  );
}

/* --------------------------- company factory ---------------------------- */

function buildCompanies(count: number): Company[] {
  const companies: Company[] = [];
  const used = new Set<string>();
  while (companies.length < count) {
    const base = pick(COMPANY_NAMES);
    const suffix = pick(COMPANY_SUFFIX);
    const name = suffix ? `${base} ${suffix}` : base;
    if (used.has(name)) continue;
    used.add(name);

    const [sizeLabel, lo, hi] = pick(SIZE_BUCKETS);
    const [city, state, country] = pick(CITIES);
    companies.push({
      name,
      domain: domainFor(name),
      industry: pick(INDUSTRIES),
      size: sizeLabel,
      employees: lo + Math.floor(rand() * (hi - lo)),
      revenue: REVENUE_BY_SIZE[sizeLabel],
      foundedYear: 1990 + Math.floor(rand() * 33),
      city,
      state,
      country,
      techStack: pickN(TECH, 3 + Math.floor(rand() * 4)),
      linkedin: `https://linkedin.com/company/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    });
  }
  return companies;
}

/* ----------------------------- lead factory ----------------------------- */

const EMAIL_STATUS_WEIGHTS: [EmailStatus, number][] = [
  ["verified", 0.62],
  ["probable", 0.26],
  ["unavailable", 0.12],
];

function weightedEmailStatus(): EmailStatus {
  const r = rand();
  let acc = 0;
  for (const [status, w] of EMAIL_STATUS_WEIGHTS) {
    acc += w;
    if (r <= acc) return status;
  }
  return "verified";
}

function buildLeads(companies: Company[], count: number): Lead[] {
  const leads: Lead[] = [];
  const departments = Object.keys(DEPARTMENTS);
  for (let i = 0; i < count; i++) {
    const company = pick(companies);
    const department = pick(departments);
    const title = pick(DEPARTMENTS[department]);
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const emailStatus = weightedEmailStatus();

    // Person is usually in a company office city, sometimes remote elsewhere.
    const remote = rand() < 0.25;
    const [pCity, pState, pCountry] = remote ? pick(CITIES) : [company.city, company.state, company.country];

    const handle = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z.]/g, "");
    leads.push({
      id: `ld_${(i + 1).toString().padStart(4, "0")}`,
      firstName,
      lastName,
      title,
      seniority: seniorityFor(title),
      department,
      email: emailStatus === "unavailable" ? "" : `${handle}@${company.domain}`,
      emailStatus,
      phone: rand() < 0.45 ? `+1 (${200 + Math.floor(rand() * 700)}) ${100 + Math.floor(rand() * 899)}-${1000 + Math.floor(rand() * 8999)}` : null,
      city: pCity,
      state: pState,
      country: pCountry,
      linkedin: `https://linkedin.com/in/${handle}-${(i + 1).toString(36)}`,
      company,
    });
  }
  return leads;
}

const COMPANIES = buildCompanies(70);
export const LEADS: Lead[] = buildLeads(COMPANIES, 260);

/* --------------------- facet values for the filter UI ------------------- */

export const FACETS = {
  seniorities: ["C-Suite", "VP", "Director", "Manager", "Senior", "Entry"] as Seniority[],
  departments: Object.keys(DEPARTMENTS),
  industries: INDUSTRIES,
  sizes: SIZE_BUCKETS.map((s) => s[0]),
  locations: Array.from(new Set(CITIES.map((c) => c[2]))).sort(),
  techStack: [...TECH].sort(),
  emailStatuses: ["verified", "probable", "unavailable"] as EmailStatus[],
};
