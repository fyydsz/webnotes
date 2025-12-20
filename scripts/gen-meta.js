// scripts/gen-meta.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// rootDir is derived from process.cwd(), not user input, so it's safe from command injection
const rootDir = process.cwd();
const metaFile = path.join(rootDir, "git-meta.json");

// DEFINISI FOLDER KONTEN
const contentDirs = ["app/docs", "content"];

// Only normalize paths on Windows where backslashes are used
const isWindows = process.platform === "win32";
const normalizePath = isWindows
  ? (p) => p.replace(/\\/g, "/")
  : (p) => p;

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Ambil hanya file konten yang relevan (.md, .mdx, .tsx)
      if (/\.(mdx?|tsx)$/.test(file)) {
        arrayOfFiles.push(fullPath);
      }
    }
  }

  return arrayOfFiles;
}

/**
 * Get last commit dates for all files in a single git command.
 * This is much faster than running git log for each file individually.
 */
function getLastCommitDates(files) {
  const meta = {};

  if (files.length === 0) return meta;

  try {
    // Use git log with --name-only to get dates for all files in a single command
    // Format: commit date followed by list of files changed in that commit
    const gitOutput = execSync(
      "git log --format=%cs --name-only --diff-filter=ACMR",
      {
        cwd: rootDir,
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large repos
      },
    );

    // Create a Set of files we care about for O(1) lookup
    const fileSet = new Set(
      files.map((f) => normalizePath(path.relative(rootDir, f))),
    );

    // Parse git output: each commit shows date followed by changed files
    const lines = gitOutput.split("\n");
    let currentDate = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check if this line is a date (format: YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedLine)) {
        currentDate = trimmedLine;
      } else if (currentDate && fileSet.has(trimmedLine)) {
        // This line is a file path - only record if we haven't seen it yet
        // (first occurrence = most recent commit)
        if (!meta[trimmedLine]) {
          meta[trimmedLine] = currentDate;
        }
      }
    }
  } catch (e) {
    console.warn("⚠️  Error running git log:", e.message);
  }

  return meta;
}

try {
  console.log("🔄 Generating git-meta.json...");

  // Collect all files from all content directories
  const allFiles = [];

  for (const dir of contentDirs) {
    const absPath = path.join(rootDir, dir);

    if (fs.existsSync(absPath)) {
      const files = getAllFiles(absPath);
      allFiles.push(...files);
    } else {
      console.warn(`⚠️  Directory not found: ${dir}`);
    }
  }

  // Get all commit dates in a single git command
  const meta = getLastCommitDates(allFiles);

  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
  console.log(
    `✅ Success: Scanned ${allFiles.length} files. Meta saved to git-meta.json`,
  );
} catch (error) {
  console.error("❌ Error generating meta:", error);
  // Pastikan file meta tetap ada meski kosong agar build tidak error
  if (!fs.existsSync(metaFile)) {
    fs.writeFileSync(metaFile, "{}");
  }
}
