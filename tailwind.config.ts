import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: "#0a0f1e",
        surface: "#111827",
        card: "#1a2236",
        border: "#1e3a5f",
        accent: "#00d4ff",
        "accent-2": "#7c3aed",
        "accent-3": "#10b981",
        muted: "#4b6280",
        text: "#e2e8f0",
        "text-dim": "#94a3b8",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00d4ff33, 0 0 20px #00d4ff11" },
          "100%": { boxShadow: "0 0 20px #00d4ff55, 0 0 40px #00d4ff22" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
