"use client";

import { useState } from "react";
import { TrendingTopic } from "@/lib/types";
import { generateScript, ScriptLength } from "@/lib/generateScript";

const formatColors: Record<string, string> = {
  Reel:     "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Carousel: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Static:   "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const LENGTH_OPTIONS: { value: ScriptLength; label: string; desc: string }[] = [
  { value: "short",  label: "Short",  desc: "~30 sec" },
  { value: "medium", label: "Medium", desc: "~60 sec" },
  { value: "long",   label: "Long",   desc: "~90 sec" },
];

function TopicRow({ topic, niche, index }: { topic: TrendingTopic; niche: string; index: number }) {
  const [expanded, setExpanded]     = useState(false);
  const [length, setLength]         = useState<ScriptLength>("medium");
  const [hookCopied, setHookCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);

  const script = generateScript(topic, niche, length);

  function copyHook() {
    navigator.clipboard.writeText(`${topic.title}\n\nHook: ${topic.hook}`).then(() => {
      setHookCopied(true);
      setTimeout(() => setHookCopied(false), 2000);
    });
  }

  function copyScript() {
    navigator.clipboard.writeText(script.text).then(() => {
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-xl overflow-hidden">
      {/* ── Topic row ── */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex gap-4 p-4 text-left group hover:bg-white/3 transition-colors rounded-xl"
      >
        <span className="text-2xl font-bold text-white/20 w-8 shrink-0 text-right tabular-nums mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-white text-sm leading-snug">{topic.title}</p>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${formatColors[topic.format] ?? "bg-white/10 text-gray-300 border-white/20"}`}>
                {topic.format}
              </span>
              {/* Copy hook */}
              <span
                role="button"
                onClick={e => { e.stopPropagation(); copyHook(); }}
                title="Copy hook"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white p-1 rounded"
              >
                {hookCopied
                  ? <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                }
              </span>
              {/* Chevron */}
              <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-purple-300 mt-1 italic">&ldquo;{topic.hook}&rdquo;</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{topic.rationale}</p>
          {!expanded && (
            <p className="text-xs text-purple-400/50 mt-2 group-hover:text-purple-400 transition-colors">
              Click to view full script →
            </p>
          )}
        </div>
      </button>

      {/* ── Script panel ── */}
      {expanded && (
        <div className="mx-4 mb-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden">

          {/* Header with length selector */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/10 bg-purple-500/10">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Full Script
            </span>

            {/* Length tabs */}
            <div className="flex items-center gap-1 bg-black/20 rounded-lg p-0.5">
              {LENGTH_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setLength(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    length === opt.value
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                  <span className={`text-xs ${length === opt.value ? "text-purple-200" : "text-gray-600"}`}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {script.estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {script.characters.toLocaleString()} chars
              </span>
              {/* Copy script */}
              <button
                onClick={copyScript}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                {scriptCopied
                  ? <><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-emerald-400">Copied!</span></>
                  : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                }
              </button>
            </div>
          </div>

          {/* Script body */}
          <pre className="px-4 py-4 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
            {script.text}
          </pre>
        </div>
      )}
    </div>
  );
}

export function TrendingTopicsCard({ topics, niche }: { topics: TrendingTopic[]; niche: string }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔥</span>
        <h3 className="text-lg font-semibold text-white">Trending Topics for You</h3>
        <span className="ml-auto text-xs text-gray-500">Click a topic to get its script</span>
      </div>
      <div className="divide-y divide-white/5">
        {topics.map((topic, i) => (
          <TopicRow key={i} topic={topic} niche={niche} index={i} />
        ))}
      </div>
    </div>
  );
}
