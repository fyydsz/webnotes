import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://webnotes-fyy.vercel.app' 

function getMdxFiles(dir: string, fileList: string[] = [], rootDir: string = dir): string[] {
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
        // Create relative path from the root content folder
        const relativePath = path.relative(rootDir, filePath)
        fileList.push(relativePath)
      }
    }
  })

  return fileList
}

export default function sitemap(): MetadataRoute.Sitemap {
  // FIX: Point to the correct directory where your MDX files are located
  const contentDir = path.join(process.cwd(), 'app', '(documentation)', 'docs')
  
  const allMdxFiles = getMdxFiles(contentDir)

  const routes = allMdxFiles.map((file) => {
    let slug = file
      .replace(/\\/g, '/') 
      .replace(/\.mdx?$/, '')
      .replace(/\/index$/, '')
      .replace(/\/page$/, '') // FIX: Remove '/page' from the end of the slug for App Router

    // Handle the root docs page (usually page.mdx at the root of docs folder)
    if (slug === '' || slug === 'index') {
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