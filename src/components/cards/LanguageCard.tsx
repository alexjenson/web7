import { LanguageAnalysis } from "@/lib/types";

const LANGUAGE_FLAGS: Record<string, string> = {
  English: "🇺🇸",
  Spanish: "🇪🇸",
  Portuguese: "🇧🇷",
  Hindi: "🇮🇳",
  Arabic: "🇸🇦",
  French: "🇫🇷",
  German: "🇩🇪",
  Italian: "🇮🇹",
  Japanese: "🇯🇵",
  Korean: "🇰🇷",
  Chinese: "🇨🇳",
  Russian: "🇷🇺",
  Turkish: "🇹🇷",
  Indonesian: "🇮🇩",
};

export function LanguageCard({ language }: { language: LanguageAnalysis }) {
  const flag = LANGUAGE_FLAGS[language.primary] ?? "🌐";

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🌍</span>
        <h3 className="text-lg font-semibold text-white">Language & Audience</h3>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold text-white">
            {flag} {language.primary}
          </p>
          {language.secondary && (
            <p className="text-sm text-gray-400 mt-1">
              Also: {language.secondary}
            </p>
          )}
        </div>
        <div className="bg-white/5 rounded-xl px-4 py-2 inline-block">
          <p className="text-sm text-purple-300 font-medium">{language.region}</p>
        </div>
        <p className="text-sm text-gray-400 italic leading-relaxed">
          &ldquo;{language.audienceNote}&rdquo;
        </p>
      </div>
    </div>
  );
}
