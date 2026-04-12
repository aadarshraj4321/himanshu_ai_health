import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Healthcare Text Analyzer",
  description:
    "Analyze health-related text using AI. Educational tool only — not a substitute for medical advice.",
  keywords: ["healthcare", "AI", "text analysis", "symptoms", "medical NLP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise-bg grid-bg min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
