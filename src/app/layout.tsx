import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram AI Analyzer — Decode Your Account in Seconds",
  description:
    "Paste your Instagram link and get AI-powered analysis of your niche, content style, language, and 10 trending topic ideas tailored just for you.",
  openGraph: {
    title: "Instagram AI Analyzer",
    description: "Instant AI analysis of your Instagram niche, style, and trending topics.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
