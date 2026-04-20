"use client";

/**
 * AI Healthcare Text Analyzer
 * ⚠️ EDUCATIONAL PURPOSES ONLY — NOT FOR REAL MEDICAL DIAGNOSIS ⚠️
 *
 * This app uses a Hugging Face instruct model
 * to explain health-related text. It is a demo project and
 * should never replace professional medical advice.
 */

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/lib/types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AnalyzerForm from "./components/AnalyzerForm";
import ResultCard from "./components/ResultCard";
import HistorySection from "./components/HistorySection";
import Footer from "./components/Footer";

const STORAGE_KEY = "medanalyze_history";

function normalizeHistoryItem(item: Partial<AnalysisResult>): AnalysisResult | null {
  if (
    typeof item.summary !== "string" ||
    !Array.isArray(item.keywords) ||
    typeof item.inputText !== "string" ||
    typeof item.timestamp !== "number" ||
    typeof item.id !== "string"
  ) {
    return null;
  }

  return {
    summary: item.summary,
    keywords: item.keywords.filter((value): value is string => typeof value === "string"),
    possibleCauses: Array.isArray(item.possibleCauses)
      ? item.possibleCauses.filter((value): value is string => typeof value === "string")
      : [],
    careSuggestions: Array.isArray(item.careSuggestions)
      ? item.careSuggestions.filter((value): value is string => typeof value === "string")
      : [],
    redFlags: Array.isArray(item.redFlags)
      ? item.redFlags.filter((value): value is string => typeof value === "string")
      : [],
    inputText: item.inputText,
    timestamp: item.timestamp,
    id: item.id,
  };
}

export default function Home() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(
            parsed
              .map((item) => normalizeHistoryItem(item as Partial<AnalysisResult>))
              .filter((item): item is AnalysisResult => item !== null)
          );
        }
      }
    } catch {
      // localStorage unavailable — silently ignore
    }
    setLoaded(true);
  }, []);

  // Save history to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage quota exceeded or unavailable
    }
  }, [history, loaded]);

  function handleResult(result: AnalysisResult) {
    setHistory((prev) => [result, ...prev].slice(0, 10)); // Keep max 10 entries
    // Smooth scroll to result
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const latestResult = history[0] ?? null;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 space-y-10 py-4">
        <Hero />
        <AnalyzerForm onResult={handleResult} />

        {/* Results section */}
        {latestResult && (
          <section
            id="results"
            className="relative z-10 max-w-3xl mx-auto px-6 animate-fade-up"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1e3a5f]" />
              <h2
                className="text-sm font-bold text-[#00d4ff] uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Results
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1e3a5f]" />
            </div>
            <ResultCard result={latestResult} isLatest />
          </section>
        )}

        {/* History (shows from index 1+) */}
        {loaded && history.length > 1 && (
          <HistorySection history={history} onClear={clearHistory} />
        )}
      </main>
      <Footer />
    </div>
  );
}
