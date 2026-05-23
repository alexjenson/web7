import { HeroSection } from "@/components/HeroSection";
import { AnalysisForm } from "@/components/AnalysisForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-purple-950">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 pt-20 pb-16 gap-12">
        <HeroSection />
        <AnalysisForm />
      </main>

      <footer className="relative z-10 text-center pb-8 text-xs text-gray-600">
        Public profiles only · No login required · Powered by Claude AI
      </footer>
    </div>
  );
}
