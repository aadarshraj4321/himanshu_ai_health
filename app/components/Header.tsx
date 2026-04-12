"use client";

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[#1e3a5f]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="8" cy="8" r="2" fill="white" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#0a0f1e]" />
        </div>
        <span
          className="text-sm font-semibold tracking-wide text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          MedAnalyze<span className="text-[#00d4ff]">AI</span>
        </span>
      </div>

      {/* Disclaimer badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1L11 10H1L6 1Z"
            stroke="#f59e0b"
            strokeWidth="1.2"
            fill="none"
          />
          <line x1="6" y1="5" x2="6" y2="7.5" stroke="#f59e0b" strokeWidth="1.2" />
          <circle cx="6" cy="9" r="0.5" fill="#f59e0b" />
        </svg>
        <span className="text-xs text-amber-400 font-medium">
          Educational Use Only — Not Medical Advice
        </span>
      </div>
    </header>
  );
}
