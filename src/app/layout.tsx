import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram Topic Analyzer — Find Your Next Viral Topic",
  description:
    "Get 10 trending topic ideas, full scripts, and potential customer profiles — tailored to your Instagram niche. Free and instant.",
  openGraph: {
    title: "Instagram Topic Analyzer",
    description: "AI-powered content strategy for Instagram creators.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
