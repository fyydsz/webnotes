import type { NextConfig } from "next";
import nextra from "nextra";
import lightTheme from './public/syntax/light.json' assert { type: 'json' } // atau baca file manual
import darkTheme from './public/syntax/dark.json' assert { type: 'json' }

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  },
  transpilePackages: ['shiki'],
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
