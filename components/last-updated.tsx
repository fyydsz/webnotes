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

    let cleanPath = pathname.replace(/^\/docs/, '').replace(/^\//, '').replace(/\/$/, '')

    // Handle halaman index/root docs
    if (cleanPath === '') cleanPath = 'index'

    const possibleKeys = [
      `content/${cleanPath}.mdx`,
      `content/${cleanPath}.md`,
      `content/${cleanPath}/index.mdx`,
      `content/${cleanPath}/index.md`
    ]

    const foundKey = possibleKeys.find(key => gitMeta[key])

    if (foundKey) {
      setDateStr(gitMeta[foundKey])
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