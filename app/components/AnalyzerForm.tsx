"use client";

import { useState } from "react";
import { ApiResponse, AnalysisResult } from "@/lib/types";

interface Props {
  onResult: (result: AnalysisResult) => void;
}

const EXAMPLE_TEXTS = [
  "I have been experiencing persistent headache for the last three days, along with mild fever of 100.4°F, fatigue, and a runny nose. I also noticed some muscle aches and occasional chills.",
  "Patient presents with shortness of breath, elevated blood pressure (145/95 mmHg), and chest tightness. History of hypertension and Type 2 diabetes. Currently on Metformin and Lisinopril.",
  "I've had lower back pain for two weeks that radiates down my left leg. The pain worsens when sitting for long periods. I also feel numbness and tingling in my foot.",
];

export default function AnalyzerForm({ onResult }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = text.length;
  const isValid = text.trim().length >= 30;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data: ApiResponse & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const result: AnalysisResult = {
        summary: data.summary,
        keywords: data.keywords,
        inputText: text,
        timestamp: Date.now(),
        id: crypto.randomUUID(),
      };

      onResult(result);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea */}
        <div className="relative rounded-2xl glow-border bg-[#111827] border border-[#1e3a5f] overflow-hidden transition-all duration-300">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste symptoms, health notes, or a medical paragraph here...&#10;&#10;Example: I have been feeling fatigued with a mild fever and persistent cough for 5 days..."
            rows={7}
            maxLength={5000}
            disabled={loading}
            className="w-full bg-transparent p-5 text-[#e2e8f0] placeholder:text-[#4b6280] text-sm leading-relaxed resize-none focus:outline-none disabled:opacity-50"
            style={{ fontFamily: "var(--font-body)" }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1e3a5f]/60 bg-[#0d1729]/50">
            <span
              className={`text-xs font-mono ${
                charCount > 4800
                  ? "text-red-400"
                  : charCount > 0
                  ? "text-[#4b6280]"
                  : "text-[#2a3f5a]"
              }`}
            >
              {charCount}/5000 characters
            </span>
            <span className="text-xs text-[#2a3f5a]">
              Min. 30 chars required
            </span>
          </div>
        </div>

        {/* Example prompts */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-[#4b6280] self-center">Try:</span>
          {["Symptoms example", "Clinical notes", "Back pain case"].map(
            (label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setText(EXAMPLE_TEXTS[i])}
                disabled={loading}
                className="text-xs px-3 py-1 rounded-full border border-[#1e3a5f] text-[#94a3b8] hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all duration-200 disabled:opacity-40"
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
            <svg
              className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full relative py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 overflow-hidden group
            disabled:opacity-50 disabled:cursor-not-allowed
            enabled:hover:scale-[1.01] enabled:active:scale-[0.99]"
          style={{
            background: isValid && !loading
              ? "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)"
              : "linear-gradient(135deg, #1e3a5f 0%, #2a2a5a 100%)",
            fontFamily: "var(--font-display)",
          }}
        >
          {/* Shimmer overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing with AI… (may take 20–30s on first run)
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              Analyze Health Text
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
