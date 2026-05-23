import { ContentStyleAnalysis } from "@/lib/types";

export function StyleCard({ style }: { style: ContentStyleAnalysis }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎬</span>
        <h3 className="text-lg font-semibold text-white">Content Style</h3>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {style.formats.map((fmt) => (
            <span
              key={fmt}
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                fmt === style.dominantFormat
                  ? "bg-purple-600/50 text-purple-200 border border-purple-500/50"
                  : "bg-white/5 text-gray-300 border border-white/10"
              }`}
            >
              {fmt === style.dominantFormat ? `★ ${fmt}` : fmt}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { label: "Tone", value: style.tone },
            { label: "Posting", value: style.postingPattern },
            { label: "Visual", value: style.visualStyle },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-xs text-gray-500 w-14 shrink-0 pt-0.5">{label}</span>
              <span className="text-sm text-gray-300">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
