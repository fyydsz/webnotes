/**
 * scripts/test-sitemap.js
 *
 * Quick CLI for previewing the sitemap routes generated from `app/docs`.
 * Run from project root (my-app):
 *   node scripts/test-sitemap.js [--format=json|xml|text] [--base=https://...] [--docsdir=app/docs]
 *
 * Defaults:
 *   --format=text
 *   --base=https://webnotes-fyy.vercel.app
 *   --docsdir=app/docs
 *
 * This script follows the same route generation rules as `app/sitemap.ts`:
 *  - Collect .mdx / .md files under `app/docs` recursively
 *  - Remove trailing `/page` and `/index` from slugs (handles both root and nested files)
 *  - Root docs page (app/docs/page.mdx) maps to /docs
 *  - Outputs each route with lastModified (file mtime)
 */

"use strict";

const fs = require("fs");
const path = require("path");

/* simple argv parsing */
const args = process.argv.slice(2);
const getArgValue = (name) => {
  const entry = args.find((a) => a.startsWith(`${name}=`));
  if (entry) return entry.split("=")[1];
  return undefined;
};

const format = getArgValue("--format") || "text";
const BASE_URL = getArgValue("--base") || "https://webnotes-fyy.vercel.app";
const docsDirFromArgs = getArgValue("--docsdir") || "app/docs";
const contentDir = path.isAbsolute(docsDirFromArgs)
  ? docsDirFromArgs
  : path.join(process.cwd(), docsDirFromArgs);

function getMdxFiles(dir, fileList = [], rootDir = dir) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir);
  entries.forEach((entry) => {
    const filePath = path.join(dir, entry);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getMdxFiles(filePath, fileList, rootDir);
    } else {
      if (entry.endsWith(".mdx") || entry.endsWith(".md")) {
        const relativePath = path.relative(rootDir, filePath);
        fileList.push({
          relativePath,
          lastModified: stat.mtime,
        });
      }
    }
  });
  return fileList;
}

/* Convert file relative path into slug:
   - normalize windows separators to forward slash
   - remove extension
   - remove trailing 'index' or 'page' (including if at root)
*/
function toSlug(relativePath) {
  if (!relativePath) return "";
  const normalized = relativePath.replace(/\\/g, "/").replace(/\.mdx?$/, "");
  // Remove 'index' or 'page' at the end, including root (start) or after a slash
  return normalized.replace(/(^|\/)(index|page)$/, "");
}

/* Use the layout.tsx mtime for the base URL if present, else fallback to now */
function getSiteRootLastModified() {
  const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    try {
      return fs.statSync(layoutPath).mtime;
    } catch (e) {
      // Ignore and fallback
      return new Date();
    }
  }
  return new Date();
}

/* Validate */
if (!fs.existsSync(contentDir)) {
  console.error(`Docs directory not found at: ${contentDir}`);
  console.error("If you have a different path, pass --docsdir=<path>");
  process.exit(1);
}

/* Build routes */
const mdxFiles = getMdxFiles(contentDir);
const routes = [];

// Add base URL
routes.push({
  url: BASE_URL,
  lastModified: getSiteRootLastModified(),
});

// Add each doc page
mdxFiles.forEach((f) => {
  const slug = toSlug(f.relativePath);
  const lastModified =
    f.lastModified instanceof Date ? f.lastModified : new Date(f.lastModified);
  if (slug === "") {
    // doc root (app/docs/page.mdx or app/docs/index.mdx)
    routes.push({
      url: `${BASE_URL}/docs`,
      lastModified,
    });
  } else {
    routes.push({
      url: `${BASE_URL}/docs/${slug}`,
      lastModified,
    });
  }
});

/* Output result based on format */
switch (format.toLowerCase()) {
  case "json": {
    // Convert dates to ISO strings for JSON
    const output = routes.map((r) => ({
      url: r.url,
      lastModified: r.lastModified.toISOString(),
    }));
    console.log(JSON.stringify(output, null, 2));
    break;
  }

  case "xml": {
    console.log('<?xml version="1.0" encoding="UTF-8"?>');
    console.log('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    for (const r of routes) {
      console.log("  <url>");
      console.log(`    <loc>${escapeXml(r.url)}</loc>`);
      console.log(`    <lastmod>${r.lastModified.toISOString()}</lastmod>`);
      console.log("  </url>");
    }
    console.log("</urlset>");
    break;
  }

  case "text":
  default: {
    for (const r of routes) {
      console.log(`${r.url} - ${r.lastModified.toISOString()}`);
    }
    break;
  }
}

/* Small helper to escape XML special chars for the loc element */
function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* If you prefer to run programmatically:
   node scripts/test-sitemap.js --format=json
   node scripts/test-sitemap.js --format=xml > sitemap-preview.xml
*/
