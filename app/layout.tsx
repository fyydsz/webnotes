import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Navbar } from "nextra-theme-docs";
import NextraLayoutWrapper from "../components/nextra-layout-wrapper";
import { Footer } from "./_components/footer/footer";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { ThemeToggle } from "@/components/theme-toggle";
import { connection } from "next/server";
import SnowfallWrapper from "@/components/snowfall";

// --- Konfigurasi Font (Dari Landing Page) ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- Konfigurasi SEO (Dari Landing Page) ---
const BASE_URL = "https://bukukampus.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Buku Kampus",
    template: "%s | Buku Kampus",
  },
  description:
    "Kumpulan catatan kuliah. Ditulis dengan format yang rapi, mudah dibaca, dan terstruktur.",
  applicationName: "Buku Kampus",
  authors: [
    { name: "M.Raffi Pra Diestyawan", url: "https://github.com/fyydsz" },
  ],
  keywords: [
    "Digital Garden",
    "Documentation",
    "Next.js",
    "Nextra",
    "Catatan Kuliah",
    "Catatan Kampus",
    "Teknik Informatika",
  ],
  creator: "M.Raffi Pra Diestyawan",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Buku Kampus",
    title: "Buku Kampus - Catatan Belajar, Disimpan Rapi",
    description:
      "Kumpulan catatan kuliah. Ditulis dengan format yang rapi, mudah dibaca, dan terstruktur.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Buku Kampus Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buku Kampus - Catatan Belajar, Disimpan Rapi",
    description:
      "Kumpulan catatan kuliah yang rapi, mudah dibaca, dan terstruktur.",
    creator: "@fyydsz_",
    images: ["/image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

// --- Komponen Nextra (Dari Docs Layout) ---
const navbar = (
  <Navbar
    logo={
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-notebook-icon lucide-notebook"
        >
          <path d="M2 6h4" />
          <path d="M2 10h4" />
          <path d="M2 14h4" />
          <path d="M2 18h4" />
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M16 2v20" />
        </svg>
        <b>Buku Kampus</b>
      </div>
    }
    logoLink="/"
    projectIcon={
      <div>
        <svg
          width="24"
          height="24"
          fill="currentColor"
          viewBox="3 3 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"></path>
        </svg>
      </div>
    }
    projectLink={"https://github.com/fyydsz/bukukampus"}
  >
    <ThemeToggle />
  </Navbar>
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  const pageMap = await getPageMap();
  return (
    <html lang="id" dir="ltr" suppressHydrationWarning>
      <Head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SnowfallWrapper>
          <NextraLayoutWrapper
            banner={
              <Banner storageKey="support-campaign-01" dismissible={true}>
                <span className="font-bold">Suka dengan catatan ini?</span>
                <a
                  href="https://saweria.co/fyyy"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 underline"
                >
                  Dukung Fyy di sini
                </a>
                <span className="ml-1">🎁</span>
              </Banner>
            }
            navbar={navbar}
            pageMap={pageMap}
            docsRepositoryBase="https://github.com/fyydsz/bukukampus/tree/master"
            copyPageButton={false}
            sidebar={{ toggleButton: true, defaultMenuCollapseLevel: 1 }}
            feedback={{
              content: "Beri kami saran atau masukan",
              labels: "feedback",
            }}
            editLink={"Edit halaman ini di Github"}
            toc={{ backToTop: "Kembali ke atas", title: "Daftar Isi Halaman" }}
          >
            {children}
            <Footer>{new Date().getFullYear()} © Buku Kampus.</Footer>
          </NextraLayoutWrapper>
        </SnowfallWrapper>
      </body>
    </html>
  );
}
