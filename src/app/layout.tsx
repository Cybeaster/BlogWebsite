import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Minimal Blog Starter",
    template: "%s | Minimal Blog Starter",
  },
  description: "A minimal, strictly typed Next.js blog starter powered by local Markdown posts.",
  openGraph: {
    title: "Minimal Blog Starter",
    description: "A minimal, strictly typed Next.js blog starter powered by local Markdown posts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 px-4 py-10 sm:px-6">
            <div className="mx-auto w-full max-w-3xl space-y-10">{children}</div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
