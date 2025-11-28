import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Definisikan Base URL (Ganti dengan domain asli Anda saat deploy, misal: fyynotebook.com)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://webnotes-fyydsz.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Fyy's Notebook",
    template: "%s | Fyy's Notebook" // Judul halaman akan jadi "Judul | Fyy's Notebook"
  },
  description: "Digital Garden & Dokumentasi pribadi M.Raffi Pra Diestyawan. Catatan belajar pemrograman, kalkulus, dan bahasa Indonesia.",
  verification: {
    google: "3ueHVA0Djja_8A2wnxLQ9Dvv3RmhPaDG4-bWSaUUhL0"
  },
  applicationName: "Fyy's Notebook",
  authors: [{ name: "M.Raffi Pra Diestyawan", url: "https://github.com/fyydsz" }],
  keywords: ["Digital Garden", "Documentation", "Next.js", "Nextra", "Catatan Kuliah", "Teknik Informatika"],
  creator: "M.Raffi Pra Diestyawan",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Fyy's Notebook",
    title: "Fyy's Notebook - Catatan Belajar Terstruktur",
    description: "Kumpulan materi kuliah dan tutorial koding yang disusun rapi.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Fyy's Notebook Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fyy's Notebook",
    description: "Catatan belajar dan dokumentasi kuliah.",
    creator: "@fyydsz_",
    images: ["/image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-zinc-900 dark:text-zinc-100`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}