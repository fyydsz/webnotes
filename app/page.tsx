import Link from "next/link";
import { Map, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--nextra-navbar-height))] justify-center overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 pt-12 md:pt-32 pb-20">
      <main className="flex flex-col items-center space-y-4 text-center xl:items-start xl:text-left max-w-6xl py-8 w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 px-4 py-1.5 backdrop-blur-sm transition-all hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Digital Garden & Documentation
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-extrabold text-5xl sm:text-6xl tracking-tight leading-[1.1] text-zinc-900 dark:text-white">
          Catatan Belajar,{" "}
          <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
            Disimpan Rapi.
          </span>
        </h1>

        {/* Description */}

        <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 text-balance leading-relaxed">
          <span className="mb-1 block font-medium text-zinc-900 dark:text-zinc-200">
            Kumpulan catatan kuliah.
          </span>
          Ditulis dengan format yang rapi, mudah dibaca, dan terstruktur.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="w-48 sm:w-auto rounded-full font-bold"
          >
            <Link href="/docs">
              Mulai Membaca
              <ArrowRight />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="w-38 sm:w-auto rounded-full font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30"
          >
            <Link
              href="https://saweria.co/fyyy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dukung
              <Heart />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="w-38 sm:w-auto rounded-full font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30"
          >
            <a
              href="https://github.com/users/fyydsz/projects/5/views/2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Roadmap
              <Map />
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
