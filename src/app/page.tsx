import { HeroSection } from "@/components/HeroSection";
import { AnalysisForm } from "@/components/AnalysisForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-purple-950 px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        <HeroSection />
        <AnalysisForm />
      </div>
    </main>
  );
}
