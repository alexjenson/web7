import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadHawk — Find B2B Leads & Contacts",
  description:
    "Search 260M+ contacts and companies. Filter by title, industry, company size, location and tech stack, then export verified emails. A self-contained Apollo-style lead finder.",
  openGraph: {
    title: "LeadHawk — Find B2B Leads",
    description: "The lead database for modern sales teams.",
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
