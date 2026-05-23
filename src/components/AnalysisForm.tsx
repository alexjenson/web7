"use client";

import { useState, FormEvent } from "react";
import { parseUsername } from "@/lib/parseUsername";
import { useAnalysis } from "@/hooks/useAnalysis";
import { LoadingState } from "./LoadingState";
import { ErrorBanner } from "./ErrorBanner";
import { ResultsPanel } from "./ResultsPanel";

export function AnalysisForm() {
  const [input, setInput] = useState("");
  const { state, analyze, reset } = useAnalysis();

  const parsed = parseUsername(input);
  const isValid = parsed !== null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (parsed) analyze(parsed);
  }

  if (state.status === "success") {
    return <ResultsPanel data={state.data} onReset={() => { reset(); setInput(""); }} />;
  }

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="instagram.com/username or @handle"
            className="w-full pl-12 pr-36 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
            disabled={state.status === "loading"}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={!isValid || state.status === "loading"}
            className="absolute right-2 top-2 bottom-2 px-5 rounded-xl font-semibold text-sm transition-all
              bg-gradient-to-r from-purple-600 to-pink-600 text-white
              hover:from-purple-500 hover:to-pink-500 hover:scale-[1.02]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Analyze
          </button>
        </div>
        {input && !isValid && (
          <p className="text-xs text-orange-400 mt-2 ml-1">
            Please enter a valid Instagram username or URL
          </p>
        )}
        {input && isValid && (
          <p className="text-xs text-gray-500 mt-2 ml-1">
            Analyzing: <span className="text-purple-300">@{parsed}</span>
          </p>
        )}
      </form>

      {state.status === "loading" && <LoadingState step={state.step} />}
      {state.status === "error" && (
        <ErrorBanner message={state.message} onRetry={reset} />
      )}
    </div>
  );
}
