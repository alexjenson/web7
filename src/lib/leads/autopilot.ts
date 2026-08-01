import { PROVIDERS } from "./data";
import { filterProviders } from "./filter";
import { generateOutreach, leadScore, scoreTier, type Outreach } from "./ai";
import { EMPTY_FILTERS, type Filters, type Provider } from "./types";

/* ========================================================================
 * Autopilot — a self-operating lead-gen agent.
 *
 * Give it a plain-English goal ("find dermatologists in California") plus
 * what you offer, and it runs the whole pipeline on its own: it interprets
 * the goal into filters, searches the provider database, scores and ranks
 * the matches, picks the strongest leads, and drafts personalized outreach
 * for each one — no manual filtering or writing required.
 *
 * Everything is deterministic and runs client-side, so the app stays fully
 * static with no backend, no API keys, and no per-query cost.
 * ====================================================================== */

export interface AutopilotConfig {
  /** Plain-English description of who to target. */
  goal: string;
  /** What the user offers — feeds the outreach drafts. */
  offer: string;
  /** How many top leads to build outreach for. */
  targetCount: number;
}

export interface AutopilotPlan {
  filters: Filters;
  /** Human-readable summary of what the agent understood, shown in the log. */
  interpreted: string[];
}

export interface AutopilotLead {
  provider: Provider;
  score: number;
  tier: { label: string; color: string };
  outreach: Outreach;
}

export interface AutopilotResult {
  plan: AutopilotPlan;
  /** Total providers matching the interpreted filters (before top-N cut). */
  matched: number;
  leads: AutopilotLead[];
}

/* ------------------------- goal interpretation ------------------------- */

/** Extra words that should map onto a known specialty group. */
const SPECIALTY_SYNONYMS: Record<string, string[]> = {
  Dental: ["dentist", "dentistry", "dental", "orthodont", "endodont"],
  Dermatology: ["dermatolog", "derm", "skin"],
  "Family Medicine": ["family medicine", "family practice", "family doctor", "gp", "general practi"],
  Chiropractic: ["chiropract", "chiro"],
  "Physical Therapy": ["physical therap", "physio", "pt ", "rehab"],
  Optometry: ["optometr", "optician", "eye doctor", "vision"],
  "Psychiatry & Neurology": ["psychiatr", "neurolog", "psych", "mental health", "therapist"],
  Pediatrics: ["pediatr", "paediatr", "children", "kids doctor"],
  "Internal Medicine": ["internal medicine", "internist"],
};

/** Full US state names → 2-letter codes, so "california" resolves to "CA". */
const STATE_NAMES: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK",
  oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI",
  wyoming: "WY", "district of columbia": "DC",
};

/** Word-boundary containment so "pa" doesn't match inside "therapist". */
function mentions(haystack: string, needle: string): boolean {
  const n = needle.trim().toLowerCase();
  if (!n) return false;
  if (/[a-z]$/.test(n)) {
    // Prefix-style token (e.g. "dermatolog") — match as a whole word start.
    return new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(haystack);
  }
  return haystack.includes(n);
}

/**
 * Interpret a free-text goal into concrete filters, restricted to values
 * that actually exist in the dataset (via FACETS-equivalent scans).
 */
export function parseGoal(goal: string): AutopilotPlan {
  const text = ` ${goal.toLowerCase()} `;
  const filters: Filters = { ...EMPTY_FILTERS, specialtyGroups: [], states: [], cities: [] };
  const interpreted: string[] = [];

  const knownGroups = Array.from(new Set(PROVIDERS.map((p) => p.specialtyGroup)));
  const knownStates = new Set(PROVIDERS.map((p) => p.state));
  const knownCities = Array.from(new Set(PROVIDERS.map((p) => p.city)));

  // Specialties — direct name match or synonym match.
  for (const group of knownGroups) {
    const synonyms = SPECIALTY_SYNONYMS[group] ?? [];
    const hit =
      mentions(text, group.toLowerCase()) || synonyms.some((s) => mentions(text, s));
    if (hit) filters.specialtyGroups.push(group);
  }

  // States — full name, then bare 2-letter code as a standalone word.
  for (const [name, code] of Object.entries(STATE_NAMES)) {
    if (knownStates.has(code) && text.includes(` ${name} `)) filters.states.push(code);
  }
  for (const code of Array.from(knownStates)) {
    const c = code.toLowerCase();
    if (!filters.states.includes(code) && new RegExp(`\\b${c}\\b`).test(text)) {
      filters.states.push(code);
    }
  }

  // Cities — longest names first so "New York" wins over a stray "york".
  for (const city of [...knownCities].sort((a, b) => b.length - a.length)) {
    if (text.includes(` ${city.toLowerCase()} `)) filters.cities.push(city);
  }

  if (filters.specialtyGroups.length) {
    interpreted.push(`Specialty: ${filters.specialtyGroups.join(", ")}`);
  }
  if (filters.states.length) interpreted.push(`State: ${filters.states.join(", ")}`);
  if (filters.cities.length) interpreted.push(`City: ${filters.cities.join(", ")}`);
  if (interpreted.length === 0) {
    interpreted.push("No specific filters detected — scanning the full database");
  }

  return { filters, interpreted };
}

/* ---------------------------- pipeline run ----------------------------- */

/** Build the ranked, outreach-ready lead set for a goal. Pure + deterministic. */
export function runPipeline(config: AutopilotConfig): AutopilotResult {
  const plan = parseGoal(config.goal);
  const matches = filterProviders(PROVIDERS, plan.filters);

  const ranked = matches
    .map((provider) => ({ provider, score: leadScore(provider) }))
    .sort((a, b) => b.score - a.score || a.provider.npi.localeCompare(b.provider.npi));

  const top = ranked.slice(0, Math.max(1, config.targetCount));

  const leads: AutopilotLead[] = top.map(({ provider, score }, i) => ({
    provider,
    score,
    tier: scoreTier(score),
    outreach: generateOutreach(provider, config.offer, i),
  }));

  return { plan, matched: matches.length, leads };
}

/* ------------------------------ CSV export ----------------------------- */

function esc(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Export the agent's leads with their scores and drafted outreach. */
export function autopilotToCsv(leads: AutopilotLead[]): string {
  const header = [
    "Name", "Specialty", "City", "State", "Phone", "NPI",
    "Fit Score", "Tier", "Connection Note", "Opening Message",
  ].join(",");
  const rows = leads.map((l) =>
    [
      l.provider.name,
      l.provider.specialty,
      l.provider.city,
      l.provider.state,
      l.provider.phone,
      l.provider.npi,
      String(l.score),
      l.tier.label,
      l.outreach.connectionNote,
      l.outreach.openingMessage,
    ]
      .map(esc)
      .join(","),
  );
  return [header, ...rows].join("\n");
}
