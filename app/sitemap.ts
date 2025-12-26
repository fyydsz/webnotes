import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://bukukampus.xyz'

function getPageFiles(
  dir: string,
  fileList: Array<{ relativePath: string; lastModified: Date }> = [],
  rootDir: string = dir
): Array<{ relativePath: string; lastModified: Date }> {
  // Check if directory exists before trying to read it
  if (!fs.existsSync(dir)) {
    return fileList
  }

  // Use withFileTypes to get file type info without additional stat calls
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      getPageFiles(filePath, fileList, rootDir)
      continue
    }

    const name = entry.name.toLowerCase()
    // Consider MD/MDX files and any files named `page.*` or `index.*` that represent App Router pages
    const isPageLike = /^(page|index)\.(mdx?|tsx?|jsx?|ts|js)$/.test(name)
    const isMdx = name.endsWith('.mdx') || name.endsWith('.md')

    if (isPageLike || isMdx) {
      // Only call stat for files we actually need mtime from
      const stat = fs.statSync(filePath)
      const relativePath = path.relative(rootDir, filePath)
      fileList.push({
        relativePath,
        lastModified: stat.mtime,
      })
    }
  }

  return fileList
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Scan the entire `app` directory so pages in any subfolder are discovered
  const contentDir = path.join(process.cwd(), 'app')

  const allPageFiles = getPageFiles(contentDir)

  // Build a map keyed by URL to deduplicate entries and prefer the most recently modified file
  type RouteEntry = {
    url: string
    lastModified: Date
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }
  const routesMap = new Map<string, RouteEntry>()

  for (const fileEntry of allPageFiles) {
    const file = fileEntry.relativePath
    const lastModified = fileEntry.lastModified ?? new Date()

    // Normalize Windows paths and strip known page/index filenames & extensions
    let slug = file
      .replace(/\\/g, '/')
      .replace(/\.(mdx?|tsx?|jsx?|ts|js)$/, '')
      .replace(/^\/+|\/+$/g, '')

    // Remove any route group folders like `(group)` used by Next.js App Router
    slug = slug.replace(/(^|\/)\([^/]+\)/g, '')

    // Re-normalize slashes in case group removal left extra separators
    slug = slug.replace(/^\/+|\/+$/g, '')

    // Remove trailing 'index' or 'page' segment
    slug = slug.replace(/(^|\/)(index|page)$/, '')

    // Ensure no leading/trailing slashes after removing 'page' or 'index'
    slug = slug.replace(/^\/+|\/+$/g, '')

    // Skip dynamic routes (segments like [id])
    if (slug.includes('[') || slug.includes(']')) {
      continue
    }

    const url = slug === '' ? BASE_URL : `${BASE_URL}/${slug}`

    const route: RouteEntry = {
      url,
      lastModified,
      changeFrequency: url === BASE_URL ? 'yearly' : 'monthly',
      priority: url === BASE_URL ? 1 : 0.8,
    }

    const existing = routesMap.get(url)
    if (!existing || lastModified.getTime() > existing.lastModified.getTime()) {
      routesMap.set(url, route)
    }
  }

  const routes = Array.from(routesMap.values())

  // Keep the existing layout-based static route for the site root
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
  const staticRoutes: RouteEntry[] = [
    {
      url: BASE_URL,
      lastModified: fs.existsSync(layoutPath) ? fs.statSync(layoutPath).mtime : new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]

  // Final dedupe to avoid collisions between staticRoutes and discovered routes
  const merged = [...staticRoutes, ...routes]
  const deduped = Array.from(
    merged.reduce((map, r) => {
      const prev = map.get(r.url)
      if (!prev || r.lastModified.getTime() > prev.lastModified.getTime()) {
        map.set(r.url, r)
      }
      return map
    }, new Map<string, RouteEntry>()).values()
  )

  return deduped
}
