"use client";

export default function Hero() {
  return (
    <section className="relative z-10 text-center pt-16 pb-10 px-6">
      {/* Glowing orb behind title */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Eyebrow label */}
      <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-[#1e3a5f] bg-[#111827]/80 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4ff]" />
        </span>
        <span className="text-xs font-medium text-[#00d4ff] tracking-widest uppercase">
          Powered by Hugging Face AI
        </span>
      </div>

      {/* Main heading */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 glow-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        AI Healthcare
        <br />
        <span className="bg-gradient-to-r from-[#00d4ff] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent">
          Text Analyzer
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl mx-auto text-[#94a3b8] text-base sm:text-lg leading-relaxed">
        Describe your symptoms in plain language and get an AI explanation,
        possible reasons, general care ideas, and warning signs to watch for.
      </p>
    </section>
  );
}
