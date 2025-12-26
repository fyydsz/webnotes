"use client";

import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";

import gitMetaRaw from "../git-meta.json";

const gitMeta = gitMetaRaw as Record<string, string>;

export const LastUpdated: FC<{
  children?: ReactNode;
  locale?: string;
}> = ({ children = "Terakhir diupdate pada", locale = "id-ID" }) => {
  const pathname = usePathname();
  const dateStr = useMemo<string | null>(() => {
    if (!pathname) return null;

    // 1. Hapus prefix locale kalau ada (mis. /id, /en-US)
    let path = pathname;
    const maybeLocale = path.split("/")[1];
    if (maybeLocale && /^[a-z]{2}(?:-[a-z]{2})?$/i.test(maybeLocale)) {
      path = path.replace(`/${maybeLocale}`, "");
    }

    // 2. Bersihkan path dari prefix '/docs', dan slash di awal/akhir
    let slug = path
      .replace(/^\/docs/, "")
      .replace(/^\//, "")
      .replace(/\/$/, "");
    slug = slug.replace(/\/+/g, "/"); // normalisasi multiple slashes

    // 3. Helper untuk mencoba key dengan ekstensi .mdx/.md
    const tryKey = (key: string) =>
      gitMeta[`${key}.mdx`] || gitMeta[`${key}.md`] || null;

    // 4. Periksa pola App Router secara lebih generik:
    //    - app/<slug>/page(.mdx|.md)
    //    - app/<slug>(.mdx|.md)
    //    - tetap periksa app/docs/... untuk kompatibilitas
    const candidates = [
      `app/${slug ? slug + "/" : ""}page`,
      `app/${slug}`,
      `app/docs/${slug ? slug + "/" : ""}page`,
      `app/docs/${slug}`,
    ];

    for (const c of candidates) {
      const found = tryKey(c);
      if (found) return found;
    }

    // 5. Jika slug berakhiran 'index' atau 'page', coba tanpa segmen tersebut
    const slugNoIndex = slug.replace(/\/(?:index|page)$/, "");
    if (slugNoIndex !== slug) {
      for (const c of [
        `app/${slugNoIndex ? slugNoIndex + "/" : ""}page`,
        `app/${slugNoIndex}`,
      ]) {
        const found = tryKey(c);
        if (found) return found;
      }
    }

    // 6. Fallback ke pola folder legacy 'content/...'
    const legacySlug = slug === "" ? "index" : slug;
    const legacyCandidates = [
      `content/${legacySlug}`,
      `content/${legacySlug}/index`,
    ];

    for (const c of legacyCandidates) {
      const found = tryKey(c);
      if (found) return found;
    }

    return null;
  }, [pathname]);

  if (!dateStr) {
    return null;
  }

  const date = new Date(dateStr);

  return (
    <div className="mt-8 mb-4 text-right text-xs text-gray-500 dark:text-gray-400">
      {children}{" "}
      <time dateTime={date.toISOString()} suppressHydrationWarning>
        {date.toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>
    </div>
  );
};
