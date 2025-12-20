import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://bukukampus.xyz'

function getMdxFiles(
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
      getMdxFiles(filePath, fileList, rootDir)
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
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
  // FIX: Point to the correct directory where your MDX files are located
  const contentDir = path.join(process.cwd(), 'app', 'docs')

  const allMdxFiles = getMdxFiles(contentDir)

  const routes = allMdxFiles.map((fileEntry) => {
    const file = fileEntry.relativePath
    const lastModified = fileEntry.lastModified ?? new Date()

    const slug = file
      .replace(/\\/g, '/')
      .replace(/\.mdx?$/, '')
      .replace(/(^|\/)(index|page)$/, '') // Remove trailing 'index' or 'page' including root

    // Handle the root docs page (usually page.mdx or index.mdx at the root of docs folder)
    if (slug === '') {
      return {
        url: `${BASE_URL}/docs`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 1,
      }
    }

    return {
      url: `${BASE_URL}/docs/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  })

  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: fs.existsSync(layoutPath)
        ? fs.statSync(layoutPath).mtime
        : new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
  ]

  return [...staticRoutes, ...routes]
}
