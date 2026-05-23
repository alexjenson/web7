import { AnalysisResult } from "@/lib/types";
import { NicheCard } from "./cards/NicheCard";
import { StyleCard } from "./cards/StyleCard";
import { LanguageCard } from "./cards/LanguageCard";
import { TrendingTopicsCard } from "./cards/TrendingTopicsCard";

export function ResultsPanel({
  username,
  analysis,
  onReset,
  onRefresh,
  refreshing,
}: {
  username: string;
  analysis: AnalysisResult;
  onReset: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Analysis for</p>
          <h2 className="text-xl font-bold text-white">@{username}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Get new topic ideas"
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-purple-500/15 border border-purple-500/20 hover:border-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? "Refreshing…" : "Refresh topics"}
          </button>
          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10"
          >
            ← New analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NicheCard niche={analysis.niche} />
        <StyleCard style={analysis.contentStyle} />
        <LanguageCard language={analysis.language} />
      </div>

      <TrendingTopicsCard topics={analysis.trendingTopics} />
    </div>
  );
}
