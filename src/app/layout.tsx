import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { StorageHydration } from "@/components/StorageHydration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infoman Reviewer",
  description: "Study tool for Information Management concepts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#0f0f0f] text-[#fafafa] min-h-screen font-[family-name:var(--font-geist-sans)]">
        <StorageHydration />
        <nav className="h-14 border-b border-[#27272a] flex items-center justify-between px-6">
          <span className="font-bold text-lg">Infoman Reviewer</span>
          <div className="flex gap-6 text-sm">
            <Link href="/decks" className="text-[#fafafa] hover:text-[#6366f1] transition-colors">
              Decks
            </Link>
            <span className="text-[#71717a] cursor-not-allowed">Normalization</span>
            <span className="text-[#71717a] cursor-not-allowed">ERD</span>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
