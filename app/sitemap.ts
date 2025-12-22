import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://bukukampus.xyz'

// Daftar program studi
const programStudi = ['sistem_informasi', 'teknik_informatika', 'general']

// Function to read _meta.js and get course mappings for a prodi
function getProdiCourses(prodi: string): string[] {
  const metaPath = path.join(
    process.cwd(),
    'app',
    'docs',
    'program_studi',
    prodi,
    '_meta.js'
  )

  if (!fs.existsSync(metaPath)) {
    return []
  }

  try {
    // Read the _meta.js file content
    const metaContent = fs.readFileSync(metaPath, 'utf-8')

    // Extract course keys from the routes object
    const courseMatches = metaContent.matchAll(/^\s*([a-z_]+):\s*{/gm)
    const courses: string[] = []

    for (const match of courseMatches) {
      if (match[1] && match[1] !== 'routes') {
        courses.push(match[1])
      }
    }

    return courses
  } catch (error) {
    console.error(`Error reading meta file for ${prodi}:`, error)
    return []
  }
}

function getMdxFiles(
  dir: string,
  fileList: Array<{ relativePath: string; lastModified: Date }> = [],
  rootDir: string = dir
): Array<{ relativePath: string; lastModified: Date }> {
  if (!fs.existsSync(dir)) {
    return fileList
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      getMdxFiles(filePath, fileList, rootDir)
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
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
  const contentDir = path.join(process.cwd(), 'app', 'docs', 'mata_kuliah')
  const allMdxFiles = getMdxFiles(contentDir)

  const routes: MetadataRoute.Sitemap = []

  // For each prodi, generate URLs for their courses
  for (const prodi of programStudi) {
    const prodiCourses = getProdiCourses(prodi)

    for (const course of prodiCourses) {
      // Filter files that belong to this course
      const courseFiles = allMdxFiles.filter((file) => {
        const normalizedPath = file.relativePath.replace(/\\/g, '/')
        return normalizedPath.startsWith(`${course}/`)
      })

      for (const fileEntry of courseFiles) {
        const file = fileEntry.relativePath.replace(/\\/g, '/')
        const lastModified = fileEntry.lastModified ?? new Date()

        // Remove course prefix and file extension
        const slug = file
          .replace(new RegExp(`^${course}/`), '')
          .replace(/\.mdx?$/, '')
          .replace(/(^|\/)(index|page)$/, '')

        // Generate URL with program_studi format
        if (slug === '') {
          // Course index page
          routes.push({
            url: `${BASE_URL}/docs/program_studi/${prodi}/${course}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
          })
        } else {
          // Course material pages
          routes.push({
            url: `${BASE_URL}/docs/program_studi/${prodi}/${course}/${slug}`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
          })
        }
      }
    }
  }

  // Add other static docs pages
  const otherDocsDir = path.join(process.cwd(), 'app', 'docs')
  const otherDirs = ['kontribusi', 'tentang', 'program_studi']

  for (const dir of otherDirs) {
    const dirPath = path.join(otherDocsDir, dir)
    if (fs.existsSync(dirPath)) {
      const files = getMdxFiles(dirPath)

      for (const fileEntry of files) {
        const file = fileEntry.relativePath.replace(/\\/g, '/')
        const lastModified = fileEntry.lastModified ?? new Date()

        const slug = file
          .replace(/\.mdx?$/, '')
          .replace(/(^|\/)(index|page)$/, '')

        if (slug === '') {
          routes.push({
            url: `${BASE_URL}/docs/${dir}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
          })
        } else {
          routes.push({
            url: `${BASE_URL}/docs/${dir}/${slug}`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
          })
        }
      }
    }
  }

  // Add docs root page
  const docsPagePath = path.join(otherDocsDir, 'page.mdx')
  routes.push({
    url: `${BASE_URL}/docs`,
    lastModified: fs.existsSync(docsPagePath)
      ? fs.statSync(docsPagePath).mtime
      : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  })

  // Add homepage
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
  routes.unshift({
    url: BASE_URL,
    lastModified: fs.existsSync(layoutPath)
      ? fs.statSync(layoutPath).mtime
      : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 1,
  })

  return routes
}
