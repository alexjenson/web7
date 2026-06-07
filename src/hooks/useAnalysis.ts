"use client";

import { useState, useRef } from "react";
import { APISuccessResponse, UserInput } from "@/lib/types";
import { analyzeFromInput } from "@/lib/analyzer";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: APISuccessResponse }
  | { status: "error"; code: string; message: string };

export function useAnalysis() {
  const [state, setState] = useState<State>({ status: "idle" });
  const lastInputRef = useRef<UserInput | null>(null);

  async function analyze(input: UserInput) {
    lastInputRef.current = input;
    setState({ status: "loading" });

    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      const analysis = analyzeFromInput(input);
      setState({ status: "success", data: { username: input.username, analysis } });
    } catch {
      setState({ status: "error", code: "ANALYSIS_ERROR", message: "Something went wrong — please try again." });
    }
  }

  function refresh() {
    if (lastInputRef.current) analyze(lastInputRef.current);
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, analyze, refresh, reset };
}
