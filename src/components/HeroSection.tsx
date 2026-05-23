export function HeroSection() {
  return (
    <div className="text-center space-y-6 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        Powered by Claude AI
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
        Decode Your{" "}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Instagram
        </span>{" "}
        in Seconds
      </h1>

      <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
        Paste your Instagram link and get an instant AI analysis of your niche, content style,
        language, and 10 trending topic ideas tailored just for you.
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        {[
          { icon: "🤖", label: "AI-Powered Analysis" },
          { icon: "🔓", label: "No Login Required" },
          { icon: "⚡", label: "Instant Results" },
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
