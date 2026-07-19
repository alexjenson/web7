import type { Provider } from "./types";

/* --------------------------- profile lookups ---------------------------- */

/** LinkedIn people-search deep link for this exact person. */
export function linkedInSearchUrl(p: Provider): string {
  const q = `${p.firstName} ${p.lastName} ${p.specialtyGroup} ${p.city}`;
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}`;
}

/** Google fallback that usually lands directly on the person's LinkedIn profile. */
export function googleLinkedInUrl(p: Provider): string {
  const q = `site:linkedin.com/in "${p.firstName} ${p.lastName}" ${p.city} ${p.state}`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

/* ----------------------------- lead scoring ----------------------------- */

const HIGH_VALUE_GROUPS = new Set(["Dermatology", "Dental", "Internal Medicine", "Psychiatry & Neurology"]);
const METROS = new Set([
  "New York", "Los Angeles", "Chicago", "Houston", "Boston", "Seattle",
  "San Diego", "Philadelphia", "Atlanta", "Dallas", "Phoenix", "Scottsdale",
]);

/** Deterministic 0–100 "fit" score derived from the provider's real attributes. */
export function leadScore(p: Provider): number {
  let score = 60;
  if (HIGH_VALUE_GROUPS.has(p.specialtyGroup)) score += 14;
  if (METROS.has(p.city)) score += 10;
  if (p.phone) score += 6;
  // Stable per-provider jitter so the list isn't visually uniform.
  let h = 0;
  for (let i = 0; i < p.npi.length; i++) h = (h * 31 + p.npi.charCodeAt(i)) | 0;
  score += Math.abs(h) % 11;
  return Math.min(99, score);
}

export function scoreTier(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Hot", color: "bg-rose-50 text-rose-700" };
  if (score >= 72) return { label: "Warm", color: "bg-amber-50 text-amber-700" };
  return { label: "Cool", color: "bg-sky-50 text-sky-700" };
}

/* --------------------------- outreach drafting -------------------------- */

export interface Outreach {
  connectionNote: string;
  openingMessage: string;
  talkingPoints: string[];
}

const OPENERS = [
  (p: Provider, first: string) =>
    `Hi ${first}, I came across your ${p.specialtyGroup.toLowerCase()} practice in ${p.city} and wanted to reach out.`,
  (p: Provider, first: string) =>
    `Hi ${first} — I work with ${p.specialtyGroup.toLowerCase()} providers across ${p.state} and your ${p.city} practice stood out.`,
  (p: Provider, first: string) =>
    `Hi ${first}, I help practices like yours in ${p.city} and would love to connect.`,
];

const BODIES = [
  (offer: string) =>
    `We help practices ${offer} without adding to the admin workload. Would you be open to a quick 10-minute call this week?`,
  (offer: string) =>
    `I'd love to share how similar practices are using us to ${offer}. Worth a short conversation?`,
  (offer: string) =>
    `Our focus is helping teams ${offer}. If that's relevant, I can send a couple of examples — just let me know.`,
];

const DEFAULT_OFFER = "attract and retain more patients";

export function generateOutreach(p: Provider, offerRaw: string, variant: number): Outreach {
  const offer = (offerRaw.trim() || DEFAULT_OFFER).replace(/\.$/, "");
  const first = p.firstName;
  const i = ((variant % OPENERS.length) + OPENERS.length) % OPENERS.length;

  const opener = OPENERS[i](p, first);
  const body = BODIES[i](offer);

  const connectionNote =
    `Hi ${first}, I work with ${p.specialtyGroup.toLowerCase()} practices in ${p.state} on ${offer}. ` +
    `Would love to connect!`;

  return {
    connectionNote: connectionNote.slice(0, 300),
    openingMessage: `${opener} ${body}`,
    talkingPoints: [
      `${p.specialtyGroup} practice based in ${p.city}, ${p.state} — tailor the pitch to local patients.`,
      `Reachable by phone at ${p.phone}.`,
      `Lead against a clear outcome: "${offer}".`,
    ],
  };
}
