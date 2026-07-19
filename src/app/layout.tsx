import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadHawk — AI Lead Finder for Healthcare Providers",
  description:
    "AI lead finder for real US healthcare providers. Filter by specialty, state, and city, look up each lead's LinkedIn profile, generate personalized AI outreach, and export to CSV. Real public-record data, free.",
  openGraph: {
    title: "LeadHawk — Healthcare Provider Finder",
    description: "Find real US healthcare providers. Filter, save, and export.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
