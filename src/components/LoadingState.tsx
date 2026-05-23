const steps = [
  { label: "Fetching Instagram profile", icon: "👤" },
  { label: "Scanning recent posts", icon: "📸" },
  { label: "Running AI analysis", icon: "🤖" },
];

export function LoadingState({ step }: { step: 0 | 1 | 2 }) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="card p-6 space-y-4">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                  done
                    ? "bg-emerald-500/20 border border-emerald-500/50"
                    : active
                    ? "bg-purple-600/30 border border-purple-500/50 animate-pulse"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm">{s.icon}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  done ? "text-emerald-400" : active ? "text-white" : "text-gray-600"
                }`}
              >
                {s.label}
                {active && (
                  <span className="inline-flex gap-0.5 ml-2">
                    <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Skeleton shimmer cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="shimmer h-4 w-24 rounded-full" />
            <div className="shimmer h-7 w-32 rounded-lg" />
            <div className="shimmer h-3 w-full rounded" />
            <div className="shimmer h-3 w-4/5 rounded" />
          </div>
        ))}
      </div>
      <div className="card p-5 space-y-3">
        <div className="shimmer h-4 w-32 rounded-full" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="shimmer h-4 w-6 rounded" />
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 w-full rounded" />
              <div className="shimmer h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
