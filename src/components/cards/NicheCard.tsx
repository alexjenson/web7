import { NicheAnalysis } from "@/lib/types";

const confidenceColors = {
  high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export function NicheCard({ niche }: { niche: NicheAnalysis }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h3 className="text-lg font-semibold text-white">Niche</h3>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold text-white">{niche.primary}</p>
          {niche.secondary && (
            <p className="text-sm text-purple-300 mt-1">{niche.secondary}</p>
          )}
        </div>
        <span
          className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${confidenceColors[niche.confidence]}`}
        >
          {niche.confidence.charAt(0).toUpperCase() + niche.confidence.slice(1)} confidence
        </span>
        <p className="text-sm text-gray-400 leading-relaxed">{niche.reasoning}</p>
      </div>
    </div>
  );
}
