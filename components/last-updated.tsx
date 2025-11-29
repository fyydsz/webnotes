'use client'

import { usePathname } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import gitMetaRaw from '../git-meta.json'

const gitMeta = gitMetaRaw as Record<string, string>

export const LastUpdated: FC<{
  children?: ReactNode
  locale?: string
}> = ({ children = 'Terakhir diupdate pada', locale = 'id-ID' }) => {
  const pathname = usePathname()
  const [dateStr, setDateStr] = useState<string | null>(null)

  useEffect(() => {
    if (!pathname) return

    // 1. Bersihkan path dari prefix '/docs', dan slash di awal/akhir
    const slug = pathname.replace(/^\/docs/, '').replace(/^\//, '').replace(/\/$/, '')
    
    // 2. Siapkan variabel untuk slug legacy (folder content biasa pakai 'index' untuk root)
    const legacySlug = slug === '' ? 'index' : slug

    // 3. Susun kemungkinan lokasi file di git-meta.json
    const possibleKeys = [
      // --- Pola App Router (app/...) ---
      // Menangani file page.mdx di dalam folder (misal: docs/kalkulus/page.mdx atau docs/page.mdx)
      `app/(documentation)/docs/${slug ? slug + '/' : ''}page.mdx`,
      `app/(documentation)/docs/${slug ? slug + '/' : ''}page.md`,
      
      // Menangani file flat (misal: docs/kalkulus.mdx), hanya jika slug tidak kosong
      ...(slug ? [
        `app/(documentation)/docs/${slug}.mdx`,
        `app/(documentation)/docs/${slug}.md`,
      ] : []),

      // --- Pola Content Folder (Legacy/Fallback) ---
      `content/${legacySlug}.mdx`,
      `content/${legacySlug}.md`,
      `content/${legacySlug}/index.mdx`,
      `content/${legacySlug}/index.md`
    ]

    // 4. Cari kunci yang cocok di data JSON
    const foundKey = possibleKeys.find(key => gitMeta[key])

    if (foundKey) {
      setDateStr(gitMeta[foundKey])
    } else {
      setDateStr(null)
    }
  }, [pathname])

  if (!dateStr) {
    return null
  }

  const date = new Date(dateStr)

  return (
    <div className="mt-8 mb-4 text-right text-xs text-gray-500 dark:text-gray-400">
      {children}{' '}
      <time
        dateTime={date.toISOString()}
        suppressHydrationWarning
      >
        {date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </time>
    </div>
  )
}