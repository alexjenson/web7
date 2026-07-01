import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadHawk — Healthcare Provider Lead Finder",
  description:
    "Search real US healthcare providers from the CMS NPPES NPI Registry. Filter by specialty, state, and city, then export names, phone numbers, and practice addresses to CSV. Apollo-style, powered by real public-record data.",
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
