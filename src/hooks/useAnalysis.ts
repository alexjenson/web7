"use client";

import { useState, useRef } from "react";
import { APISuccessResponse, UserInput } from "@/lib/types";

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
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();

      if (!res.ok) {
        setState({ status: "error", code: data.error?.code ?? "UNKNOWN", message: data.error?.message ?? "Something went wrong" });
      } else {
        setState({ status: "success", data });
      }
    } catch {
      setState({ status: "error", code: "NETWORK_ERROR", message: "Network error — please check your connection" });
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
