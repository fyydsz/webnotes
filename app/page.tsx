import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--nextra-navbar-height))] flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="max-w-2xl space-y-8">
          {/* Badge kecil */}
          <div
            className="inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm mb-4 border transition-colors duration-300
                      /* Light: Subtle neutral */
                      border-zinc-200 bg-zinc-50 text-zinc-700
                      /* Dark: Biru Toxic Glowing */
                      dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-200 dark:shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          >
            <span
              className="flex h-2 w-2 rounded-full mr-2 animate-pulse
                        /* Dot Indicator */
                        bg-cyan-600 dark:bg-cyan-400"
            ></span>
            <span className="font-semibold tracking-wide">
              Digital Garden & Documentation
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Catatan Belajar, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              Disimpan Rapi.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-serif
                      /* Light: Neutral untuk readability */
                      text-zinc-700
                      /* Dark: Biru Pucat (Kabut) */
                      dark:text-blue-100/80"
          >
            <span className="text-zinc-800 dark:text-white">
              Kumpulan catatan kuliah.
            </span>
            <br />
            <span className="italic opacity-80 text-zinc-600 dark:text-white">
              Ditulis dengan format yang rapi, mudah dibaca, dan terstruktur.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/docs"
              className="group relative h-12 px-8 rounded-full font-bold flex items-center justify-center transition-all duration-300 active:scale-95

                        /* LIGHT MODE: Black Border */
                        bg-transparent text-zinc-900 border-2 border-zinc-300
                        shadow-[0_0_8px_rgba(0,0,0,0.1)]
                        hover:bg-zinc-50 hover:border-zinc-400 hover:shadow-[0_0_12px_rgba(0,0,0,0.15)]

                        /* DARK MODE: White Border */
                        dark:bg-transparent dark:text-white dark:border-2 dark:border-zinc-600
                        dark:shadow-[0_0_8px_rgba(255,255,255,0.1)]
                        dark:hover:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10 flex items-center">
                Mulai Membaca
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link
              href="https://saweria.co/fyyy"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-12 px-8 rounded-full font-bold flex items-center justify-center transition-all duration-300 active:scale-95

                         /* LIGHT MODE: Black solid button */
                         bg-zinc-900 text-white border-2 border-zinc-900
                         shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                         hover:bg-zinc-800 hover:border-zinc-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]

                         /* DARK MODE: White solid button */
                         dark:bg-white dark:text-zinc-900 dark:border-white
                         dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.15)]
                         dark:hover:bg-zinc-200 dark:hover:border-zinc-200 dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center">
                Dukung
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 group-hover:scale-110 transition-transform"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
