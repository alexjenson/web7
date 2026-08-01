"use client";

import { useCallback, useRef, useState } from "react";
import {
  Bot,
  Check,
  Download,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { LeadSearch } from "@/hooks/useLeadSearch";
import { downloadText } from "@/lib/leads/csv";
import {
  autopilotToCsv,
  runPipeline,
  type AutopilotLead,
  type AutopilotResult,
} from "@/lib/leads/autopilot";
import { Avatar, ScoreBadge, SpecialtyBadge } from "./ui";

interface Props {
  search: LeadSearch;
  onClose: () => void;
  onOpenLead: (lead: AutopilotLead) => void;
}

type StepStatus = "pending" | "active" | "done";
interface Step {
  label: string;
  detail?: string;
  status: StepStatus;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Autopilot({ search, onClose, onOpenLead }: Props) {
  const [goal, setGoal] = useState("");
  const [offer, setOffer] = useState("");
  const [targetCount, setTargetCount] = useState(10);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [steps, setSteps] = useState<Step[]>([]);
  const [result, setResult] = useState<AutopilotResult | null>(null);
  const runId = useRef(0);

  const reset = useCallback(() => {
    runId.current += 1; // cancel any in-flight run
    setPhase("idle");
    setSteps([]);
    setResult(null);
  }, []);

  const run = useCallback(async () => {
    const id = ++runId.current;
    const res = runPipeline({ goal, offer, targetCount });
    const picked = res.leads.length;

    const script: Step[] = [
      {
        label: "Interpreting your goal",
        detail: res.plan.interpreted.join(" · "),
        status: "pending",
      },
      {
        label: "Searching the provider database",
        detail: `${res.matched.toLocaleString()} providers matched the criteria`,
        status: "pending",
      },
      {
        label: "Scoring & ranking every match",
        detail: `Ranked by AI fit score (0–100)`,
        status: "pending",
      },
      {
        label: `Selecting the top ${picked}`,
        detail: picked
          ? `${res.leads.filter((l) => l.tier.label === "Hot").length} hot · ${
              res.leads.filter((l) => l.tier.label === "Warm").length
            } warm`
          : "No matches — try a broader goal",
        status: "pending",
      },
      {
        label: "Drafting personalized outreach",
        detail: picked ? `${picked} connection notes + opening messages` : "Skipped",
        status: "pending",
      },
      {
        label: "Saving leads to your list",
        detail: picked ? `${picked} leads saved & ready to export` : "Nothing to save",
        status: "pending",
      },
    ];

    setPhase("running");
    setResult(null);
    setSteps(script.map((s) => ({ ...s })));

    for (let i = 0; i < script.length; i++) {
      if (runId.current !== id) return; // superseded / reset
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "active" } : s)),
      );
      await sleep(650);
      if (runId.current !== id) return;
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "done" } : s)),
      );
      // Commit the picks to the saved list as the "save" step completes.
      if (i === script.length - 1 && picked) {
        search.saveMany(res.leads.map((l) => l.provider.npi));
      }
    }

    if (runId.current !== id) return;
    setResult(res);
    setPhase("done");
  }, [goal, offer, targetCount, search]);

  const exportCsv = useCallback(() => {
    if (result?.leads.length) {
      downloadText(autopilotToCsv(result.leads), "leadhawk-autopilot.csv");
    }
  }, [result]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-slate-50 shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Autopilot</h2>
              <p className="text-xs text-slate-500">
                Describe your ideal lead — the agent does the rest.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Goal form */}
          <div className="border-b border-slate-200 bg-white p-5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Target className="mr-1 inline h-3.5 w-3.5" /> Your goal
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              disabled={phase === "running"}
              rows={2}
              placeholder="e.g. Find dermatologists and dentists in California and New York"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            />

            <label className="mb-1 mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Sparkles className="mr-1 inline h-3.5 w-3.5" /> What you offer
            </label>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              disabled={phase === "running"}
              placeholder="e.g. patient-booking software that fills empty appointment slots"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            />

            <div className="mt-3 flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Leads to build
              </label>
              <select
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                disabled={phase === "running"}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-indigo-400 disabled:bg-slate-50"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <div className="ml-auto flex gap-2">
                {phase !== "idle" && (
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset
                  </button>
                )}
                <button
                  onClick={run}
                  disabled={phase === "running" || goal.trim().length === 0}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
                >
                  {phase === "running" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {phase === "done" ? "Run again" : "Run Autopilot"}
                </button>
              </div>
            </div>
          </div>

          {/* Agent activity log */}
          {steps.length > 0 && (
            <div className="border-b border-slate-200 bg-white p-5">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                Agent activity
              </h3>
              <ol className="space-y-2.5">
                {steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        s.status === "done"
                          ? "bg-emerald-100 text-emerald-700"
                          : s.status === "active"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {s.status === "done" ? (
                        <Check className="h-3 w-3" />
                      ) : s.status === "active" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-medium ${
                          s.status === "pending" ? "text-slate-400" : "text-slate-800"
                        }`}
                      >
                        {s.label}
                      </div>
                      {s.detail && s.status !== "pending" && (
                        <div className="text-xs text-slate-500">{s.detail}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Results */}
          {phase === "done" && result && (
            <div className="p-5">
              {result.leads.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-center text-slate-400">
                  <Target className="h-8 w-8" />
                  <p className="text-sm font-medium text-slate-500">No leads matched that goal.</p>
                  <p className="text-xs">Try naming a specialty, state, or city that&apos;s in the data.</p>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">
                      {result.leads.length} leads ready
                    </h3>
                    <button
                      onClick={exportCsv}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                  </div>
                  <p className="mb-3 text-xs text-slate-500">
                    Saved to your list. Click a lead to view its full profile and outreach drafts.
                  </p>
                  <ul className="space-y-2">
                    {result.leads.map((l) => (
                      <li key={l.provider.npi}>
                        <button
                          onClick={() => onOpenLead(l)}
                          className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-indigo-200 hover:bg-indigo-50/40"
                        >
                          <Avatar name={l.provider.name} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-semibold text-slate-800">
                                {l.provider.name}
                              </span>
                              <ScoreBadge score={l.score} tier={l.tier} />
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                              <SpecialtyBadge group={l.provider.specialtyGroup} />
                              <span>
                                {l.provider.city}, {l.provider.state}
                              </span>
                            </div>
                            <p className="mt-1.5 line-clamp-2 text-xs italic text-slate-500">
                              “{l.outreach.connectionNote}”
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {phase === "idle" && steps.length === 0 && (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600">
                <Bot className="h-7 w-7" />
              </span>
              <p className="max-w-xs text-sm text-slate-500">
                Autopilot reads your goal, finds and scores matching providers, picks the strongest
                leads, and writes personalized outreach for each — automatically.
              </p>
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                {[
                  "Find dentists in Texas",
                  "Top dermatologists in New York",
                  "Chiropractors in California",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setGoal(example)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
