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

    // 1. Bersihkan path dari prefix '/docs', dan slash di awal/akhir
    const slug = pathname
      .replace(/^\/docs/, "")
      .replace(/^\//, "")
      .replace(/\/$/, "");

    // 2. Try App Router patterns first (most common case)
    const appPrefix = `app/docs/${slug ? slug + "/" : ""}page`;
    const found =
      gitMeta[`${appPrefix}.mdx`] ||
      gitMeta[`${appPrefix}.md`] ||
      (slug && (gitMeta[`app/docs/${slug}.mdx`] || gitMeta[`app/docs/${slug}.md`]));

    if (found) return found;

    // 3. Fallback to legacy content folder patterns
    const legacySlug = slug === "" ? "index" : slug;
    return (
      gitMeta[`content/${legacySlug}.mdx`] ||
      gitMeta[`content/${legacySlug}.md`] ||
      gitMeta[`content/${legacySlug}/index.mdx`] ||
      gitMeta[`content/${legacySlug}/index.md`] ||
      null
    );
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
