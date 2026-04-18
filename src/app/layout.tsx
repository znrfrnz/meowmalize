import '@xyflow/react/dist/style.css'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StorageHydration } from "@/components/StorageHydration";
import { Navbar } from "@/components/Navbar";
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
  title: "Meowmalize",
  description: "Study tool for Information Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#0a0a0b] text-[#f4f4f5] min-h-screen font-[family-name:var(--font-geist-sans)]">
        <StorageHydration />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
