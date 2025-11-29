import type { NextConfig } from "next";
import nextra from "nextra";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  },
  transpilePackages: ['shiki']
};

const withNextra = nextra({
  latex: {
    renderer: 'katex', // 'katex' | 'mathjax'}
    options: {}
  }
})
export default withNextra(nextConfig);