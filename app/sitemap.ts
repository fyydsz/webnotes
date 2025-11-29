import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://webnotes-fyy.vercel.app' 

function getMdxFiles(dir: string, fileList: string[] = [], rootDir: string = dir): string[] {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getMdxFiles(filePath, fileList, rootDir)
    } else {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        // Buat relative path dari folder content
        const relativePath = path.relative(rootDir, filePath)
        fileList.push(relativePath)
      }
    }
  })

  return fileList
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentDir = path.join(process.cwd(), 'content')
  const allMdxFiles = getMdxFiles(contentDir)

  const routes = allMdxFiles.map((file) => {
    let slug = file
      .replace(/\\/g, '/') 
      .replace(/\.mdx?$/, '')
      .replace(/\/index$/, '')

    if (slug === 'index') {
        return {
            url: `${BASE_URL}/docs`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        }
    }

    return {
      url: `${BASE_URL}/docs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  })

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
  ]

  return [...staticRoutes, ...routes]
}