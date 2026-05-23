"use client";

import { useState, FormEvent } from "react";
import { parseUsername } from "@/lib/parseUsername";
import { useAnalysis } from "@/hooks/useAnalysis";
import { ErrorBanner } from "./ErrorBanner";
import { ResultsPanel } from "./ResultsPanel";
import { APISuccessResponse } from "@/lib/types";

const NICHES = [
  "Fitness & Wellness", "Food & Cooking", "Travel", "Fashion",
  "Beauty & Skincare", "Tech & Gadgets", "Business & Entrepreneurship",
  "Photography & Videography", "Art & Design", "Music", "Gaming",
  "Education & Learning", "Lifestyle", "Parenting & Family",
  "Comedy & Entertainment", "Sports", "Finance & Investing",
  "Nature & Sustainability", "Pets & Animals", "DIY & Crafts",
];

const LANGUAGES = [
  "English", "Hindi", "Spanish", "Portuguese", "Arabic",
  "French", "German", "Italian", "Japanese", "Korean",
  "Turkish", "Indonesian",
];

const FORMATS = [
  { value: "Reels",     label: "🎬 Reels",     desc: "Short videos, max reach" },
  { value: "Photos",    label: "📸 Photos",    desc: "Static posts, aesthetic" },
  { value: "Carousels", label: "📑 Carousels", desc: "Multi-slide, educational" },
  { value: "Mixed",     label: "🔀 Mixed",     desc: "All formats" },
] as const;

export function AnalysisForm() {
  const [username, setUsername] = useState("");
  const [niche, setNiche] = useState("");
  const [format, setFormat] = useState<"Reels" | "Photos" | "Carousels" | "Mixed" | "">("");
  const [language, setLanguage] = useState("English");
  const [lastData, setLastData] = useState<APISuccessResponse | null>(null);
  const { state, analyze, refresh, reset } = useAnalysis();

  const parsed = parseUsername(username);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!parsed || !niche || !format) return;
    analyze({ username: parsed, niche, format, language });
  }

  if (state.status === "success" && state.data !== lastData) {
    setLastData(state.data);
  }

  if (lastData && (state.status === "success" || state.status === "loading")) {
    const isRefreshing = state.status === "loading";
    const displayData = state.status === "success" ? state.data : lastData;
    return (
      <ResultsPanel
        username={displayData.username}
        analysis={displayData.analysis}
        onReset={() => { reset(); setLastData(null); setUsername(""); setNiche(""); setFormat(""); }}
        onRefresh={refresh}
        refreshing={isRefreshing}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5">

        {/* Step 1 — Username */}
        <div className="card p-5 space-y-3">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Step 1 — Your Instagram
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username or instagram.com/username"
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/60 transition-all"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {username && !parsed && (
            <p className="text-xs text-orange-400">Enter a valid Instagram username</p>
          )}
          {parsed && (
            <p className="text-xs text-emerald-400">✓ @{parsed}</p>
          )}
        </div>

        {/* Step 2 — Niche */}
        <div className="card p-5 space-y-3">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Step 2 — Your Content Niche
          </label>
          <select
            value={niche}
            onChange={e => setNiche(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/60 transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-gray-900">Select your niche...</option>
            {NICHES.map(n => (
              <option key={n} value={n} className="bg-gray-900">{n}</option>
            ))}
          </select>
        </div>

        {/* Step 3 — Format */}
        <div className="card p-5 space-y-3">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Step 3 — Main Content Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FORMATS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  format === f.value
                    ? "border-purple-500/60 bg-purple-500/15 text-white"
                    : "border-white/10 bg-white/3 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-sm font-medium">{f.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="card p-5 space-y-3">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Content Language
          </label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/60 transition-all appearance-none cursor-pointer"
          >
            {LANGUAGES.map(l => (
              <option key={l} value={l} className="bg-gray-900">{l}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!parsed || !niche || !format || state.status === "loading"}
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all
            bg-gradient-to-r from-purple-600 to-pink-600
            hover:from-purple-500 hover:to-pink-500 hover:scale-[1.02]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {state.status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating your topics...
            </span>
          ) : (
            "Get My 10 Trending Topics →"
          )}
        </button>
      </form>

      {state.status === "error" && (
        <ErrorBanner message={state.message} onRetry={reset} />
      )}
    </div>
  );
}
