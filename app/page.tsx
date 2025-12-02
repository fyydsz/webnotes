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
                      /* Light: Merah Pudar ala Label Obat/File Rahasia */
                      border-red-900/20 bg-red-50 text-red-900
                      /* Dark: Biru Toxic Glowing */
                      dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-200 dark:shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          >
            <span
              className="flex h-2 w-2 rounded-full mr-2 animate-pulse
                        /* Dot Indicator */
                        bg-red-700 dark:bg-cyan-400"
            ></span>
            <span className="font-semibold tracking-wide">
              Digital Garden & Documentation
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[hsl(355,85%,45%)] dark:text-white">
            Catatan Belajar, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[hsl(355,85%,45%)] to-[hsl(355,100%,30%)] dark:from-blue-400 dark:to-cyan-300">
              Disimpan Rapi.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-serif
                      /* Light: Abu Tua (Tinta) */
                      text-zinc-800
                      /* Dark: Biru Pucat (Kabut) */
                      dark:text-blue-100/80"
          >
            <span className="text-[hsl(355,85%,45%)] dark:text-cyan-300">
              Kumpulan catatan kuliah.
            </span>
            <br />
            <span className="italic opacity-80 text-[hsl(355,85%,45%)] dark:text-cyan-300">
              Ditulis dengan format yang rapi, mudah dibaca, dan terstruktur.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/docs"
              className="group relative h-12 px-8 rounded-full font-bold flex items-center justify-center transition-all duration-300 active:scale-95

                        /* LIGHT MODE: Narrow Red Border (like dark-mode but red) */
                        bg-transparent text-[hsl(355,85%,45%)] border-2 border-[hsl(355,85%,45%)/50]
                        shadow-[0_0_8px_rgba(220,20,60,0.2)]
                        hover:bg-[hsl(355,85%,45%)/8] hover:border-[hsl(355,85%,45%)/70] hover:shadow-[0_0_12px_rgba(220,20,60,0.3)]

                        /* DARK MODE: Upside Down Neon Border */
                        dark:bg-transparent dark:text-cyan-300 dark:border-2 dark:border-cyan-500/50
                        dark:shadow-[0_0_15px_rgba(6,182,212,0.3)]
                        dark:hover:bg-cyan-950/30 dark:hover:border-cyan-400 dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
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
          </div>
        </div>
      </main>
    </div>
  );
}
