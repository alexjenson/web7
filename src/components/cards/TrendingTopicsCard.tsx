"use client";

import { useState } from "react";
import { TrendingTopic } from "@/lib/types";

const formatColors: Record<string, string> = {
  Reel: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Carousel: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Static: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

function TopicRow({ topic, index }: { topic: TrendingTopic; index: number }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    const text = `${topic.title}\n\nHook: ${topic.hook}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="group flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
      <span className="text-2xl font-bold text-white/20 w-8 shrink-0 text-right tabular-nums">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-white text-sm leading-snug">{topic.title}</p>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${formatColors[topic.format] ?? "bg-white/10 text-gray-300 border-white/20"}`}
            >
              {topic.format}
            </span>
            <button
              onClick={copy}
              title="Copy to clipboard"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white p-1 rounded"
            >
              {copied ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-purple-300 mt-1 italic">&ldquo;{topic.hook}&rdquo;</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{topic.rationale}</p>
      </div>
    </div>
  );
}

export function TrendingTopicsCard({ topics }: { topics: TrendingTopic[] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔥</span>
        <h3 className="text-lg font-semibold text-white">Trending Topics for You</h3>
        <span className="ml-auto text-xs text-gray-500">Hover to copy</span>
      </div>
      <div className="divide-y divide-white/5">
        {topics.map((topic, i) => (
          <TopicRow key={i} topic={topic} index={i} />
        ))}
      </div>
    </div>
  );
}
