import { AnalysisResult } from "@/lib/types";
import { NicheCard } from "./cards/NicheCard";
import { StyleCard } from "./cards/StyleCard";
import { LanguageCard } from "./cards/LanguageCard";
import { TrendingTopicsCard } from "./cards/TrendingTopicsCard";

export function ResultsPanel({
  username,
  analysis,
  onReset,
}: {
  username: string;
  analysis: AnalysisResult;
  onReset: () => void;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Analysis for</p>
          <h2 className="text-xl font-bold text-white">@{username}</h2>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10"
        >
          ← Analyze another
        </button>
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
