import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://webnotes-fyy.vercel.app'

function getMdxFiles(
  dir: string,
  fileList: Array<{ relativePath: string; lastModified: Date }> = [],
  rootDir: string = dir
): Array<{ relativePath: string; lastModified: Date }> {
  // Check if directory exists before trying to read it
  if (!fs.existsSync(dir)) {
    return fileList
  }

  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getMdxFiles(filePath, fileList, rootDir)
    } else {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        // Create relative path from the root content folder and include mtime
        const relativePath = path.relative(rootDir, filePath)
        fileList.push({
          relativePath,
          lastModified: stat.mtime,
        })
      }
    }
  })

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

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: fs.existsSync(path.join(process.cwd(), 'app', 'layout.tsx'))
        ? fs.statSync(path.join(process.cwd(), 'app', 'layout.tsx')).mtime
        : new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
  ]

  return [...staticRoutes, ...routes]
}
