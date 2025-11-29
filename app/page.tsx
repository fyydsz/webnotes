import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--nextra-navbar-height))] flex-col">
      {/* Header dihapus, diganti Navbar Nextra */}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="max-w-2xl space-y-8">
          {/* Badge kecil */}
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Digital Garden & Documentation
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Catatan Belajar, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              Disimpan Rapi.
            </span>
          </h1>

          <p className="text-sm sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl mx-auto">
            Kumpulan materi kuliah, tutorial koding, dsb hehe.<br />Ditulis dengan format yang rapi, mudah dibaca, dan terstruktur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/docs"
              className="h-10 px-6 text-sm sm:h-12 sm:px-8 sm:text-base rounded-full bg-black dark:bg-white text-white dark:text-black font-medium flex items-center justify-center hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
            >
              Mulai Membaca
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer juga dihapus, diganti Footer Nextra */}
    </div>
  );
}