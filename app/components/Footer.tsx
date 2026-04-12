"use client";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#1e3a5f] py-8 px-6 mt-8">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p
            className="text-sm font-semibold text-[#4b6280]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MedAnalyze<span className="text-[#00d4ff]">AI</span>
          </p>
          <p className="text-xs text-[#2a3f5a] mt-0.5">
            Built with Next.js 14 · Hugging Face Inference API
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1">
          <p className="text-xs text-amber-400/70 font-medium">
            ⚠️ For educational purposes only
          </p>
          <p className="text-xs text-[#2a3f5a]">
            Not a substitute for professional medical advice
          </p>
        </div>
      </div>
    </footer>
  );
}
