export function HeroSection() {
  return (
    <div className="text-center space-y-6 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        AI-Powered Instagram Strategy
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
        Find Your Next{" "}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Viral Topic
        </span>{" "}
        on Instagram
      </h1>

      <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
        Tell us your niche and content style — get 10 trending topic ideas with
        hooks and rationale, tailored exactly to your account.
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        {[
          { icon: "🎯", label: "Niche Analysis" },
          { icon: "🔥", label: "10 Trending Topics" },
          { icon: "⚡", label: "Instant & Free" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
