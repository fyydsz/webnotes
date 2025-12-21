import type { NextConfig } from "next";
import nextra from "nextra";
import lightTheme from './public/syntax/light.json' assert { type: 'json' } // atau baca file manual
import darkTheme from './public/syntax/dark.json' assert { type: 'json' }

// Daftar mata kuliah yang tersedia di folder mata_kuliah
const courses = [
  'dasar_pemrograman_python',
  'kalkulus',
  'logika_matematika',
];

// Daftar program studi
const programStudi = [
  'sistem_informasi',
  'teknik_informatika',
];

// Generate rewrites untuk setiap kombinasi prodi dan course
const generateCourseRewrites = () => {
  const rewrites: Array<{ source: string; destination: string }> = [];

  for (const prodi of programStudi) {
    for (const course of courses) {
      // Rewrite untuk halaman index course
      rewrites.push({
        source: `/docs/program_studi/${prodi}/${course}`,
        destination: `/docs/mata_kuliah/${course}`,
      });
      // Rewrite untuk subhalaman course
      rewrites.push({
        source: `/docs/program_studi/${prodi}/${course}/:path*`,
        destination: `/docs/mata_kuliah/${course}/:path*`,
      });
    }
  }

  return rewrites;
};

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  },
  transpilePackages: ['shiki'],
  async rewrites() {
    return {
      beforeFiles: generateCourseRewrites(),
    };
  },
};

const withNextra = nextra({
  latex: {
    renderer: 'katex', // 'katex' | 'mathjax'}
    options: {}
  },
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        //@ts-expect-error // shiki theme type issue
        light: lightTheme,
        //@ts-expect-error // shiki theme type issue
        dark: darkTheme
      }
    }
  }
})
export default withNextra(nextConfig);
