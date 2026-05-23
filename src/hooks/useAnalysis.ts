"use client";

import { useState, useRef } from "react";
import { APISuccessResponse } from "@/lib/types";

type State =
  | { status: "idle" }
  | { status: "loading"; step: 0 | 1 | 2 }
  | { status: "success"; data: APISuccessResponse }
  | { status: "error"; code: string; message: string };

export function useAnalysis() {
  const [state, setState] = useState<State>({ status: "idle" });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  async function analyze(username: string) {
    clearTimers();
    setState({ status: "loading", step: 0 });

    timersRef.current = [
      setTimeout(
        () =>
          setState((s) =>
            s.status === "loading" ? { ...s, step: 1 } : s
          ),
        1500
      ),
      setTimeout(
        () =>
          setState((s) =>
            s.status === "loading" ? { ...s, step: 2 } : s
          ),
        3000
      ),
    ];

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      clearTimers();

      if (!res.ok) {
        setState({
          status: "error",
          code: data.error?.code ?? "UNKNOWN",
          message: data.error?.message ?? "Something went wrong",
        });
      } else {
        setState({ status: "success", data });
      }
    } catch {
      clearTimers();
      setState({
        status: "error",
        code: "NETWORK_ERROR",
        message: "Network error — please check your connection and try again",
      });
    }
  }

  function reset() {
    clearTimers();
    setState({ status: "idle" });
  }

  return { state, analyze, reset };
}
