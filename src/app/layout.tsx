import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SubTrack — Stop Wasting Money on Forgotten Subscriptions",
  description:
    "Track all your subscriptions in one place. Get AI-powered savings suggestions, cancellation scripts, and spending analytics. Free to start.",
  openGraph: {
    title: "SubTrack — Subscription Management Made Simple",
    description: "Track spending, find savings, and cancel with ease.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-gray-950 text-white`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
