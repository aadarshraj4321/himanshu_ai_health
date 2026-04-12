"use client";

import { AnalysisResult } from "@/lib/types";
import ResultCard from "./ResultCard";

interface Props {
  history: AnalysisResult[];
  onClear: () => void;
}

export default function HistorySection({ history, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 w-8 bg-gradient-to-r from-transparent to-[#1e3a5f]" />
          <h2
            className="text-sm font-bold text-[#4b6280] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Analysis History ({history.length})
          </h2>
          <div className="h-px flex-1 w-8 bg-gradient-to-l from-transparent to-[#1e3a5f]" />
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs text-[#4b6280] hover:text-red-400 transition-colors duration-200 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-500/20 hover:bg-red-500/5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
          Clear History
        </button>
      </div>

      {/* History list — show past analyses (not the latest one, already shown above) */}
      <div className="space-y-4">
        {history.slice(1).map((item) => (
          <div key={item.id} className="animate-fade-up">
            <ResultCard result={item} isLatest={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
