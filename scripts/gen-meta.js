// scripts/gen-meta.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// rootDir is derived from process.cwd(), not user input, so it's safe from command injection
const rootDir = process.cwd();
const metaFile = path.join(rootDir, "git-meta.json");

// DEFINISI FOLDER KONTEN
const contentDirs = ["app/docs", "app/mata_kuliah"];

// Daftar program studi
const programStudi = ["sistem_informasi", "teknik_informatika", "general"];

// Only normalize paths on Windows where backslashes are used
const isWindows = process.platform === "win32";
const normalizePath = isWindows ? (p) => p.replace(/\\/g, "/") : (p) => p;

// Function to read _meta.js and get course mappings for a prodi
function getProdiCourses(prodi) {
  const metaPath = path.join(
    rootDir,
    "app",
    "docs",
    "program_studi",
    prodi,
    "_meta.js",
  );

  if (!fs.existsSync(metaPath)) {
    return [];
  }

  try {
    // Read the _meta.js file content
    const metaContent = fs.readFileSync(metaPath, "utf-8");

    // Extract course keys from the routes object
    const courseMatches = metaContent.matchAll(/^\s*([a-z_]+):\s*{/gm);
    const courses = [];

    for (const match of courseMatches) {
      if (match[1] && match[1] !== "routes") {
        courses.push(match[1]);
      }
    }

    return courses;
  } catch (error) {
    console.error(`Error reading meta file for ${prodi}:`, error);
    return [];
  }
}

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

    // Create a map from physical file paths to their commit dates
    const physicalFileDates = {};

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
        if (!physicalFileDates[trimmedLine]) {
          physicalFileDates[trimmedLine] = currentDate;
        }
      }
    }

    // For files not found in git log (e.g., newly added files), set a default date
    const defaultDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    for (const file of fileSet) {
      if (!physicalFileDates[file]) {
        physicalFileDates[file] = defaultDate;
      }
    }

    // Now map physical paths to virtual paths (with rewrites)
    const mataKuliahDir = "app/mata_kuliah";

    for (const [physicalPath, date] of Object.entries(physicalFileDates)) {
      // Check if this is a mata_kuliah file
      if (physicalPath.startsWith(mataKuliahDir + "/")) {
        const relativePath = physicalPath.substring(mataKuliahDir.length + 1);
        const parts = relativePath.split("/");
        const course = parts[0]; // e.g., "bahasa_indonesia"

        // For each prodi, check if they have this course
        for (const prodi of programStudi) {
          const prodiCourses = getProdiCourses(prodi);

          if (prodiCourses.includes(course)) {
            // Generate virtual path: app/docs/program_studi/{prodi}/{course}/{rest}
            const restPath = parts.slice(1).join("/");
            const virtualPath = restPath
              ? `app/docs/program_studi/${prodi}/${course}/${restPath}`
              : `app/docs/program_studi/${prodi}/${course}`;

            meta[virtualPath] = date;
          }
        }

        // Also include the physical path for mata_kuliah files
        meta[physicalPath] = date;
      } else {
        // For non-mata_kuliah files, keep the original path
        meta[physicalPath] = date;
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

  // Get all commit dates and map to virtual paths
  const meta = getLastCommitDates(allFiles);

  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
  console.log(
    `✅ Success: Scanned ${allFiles.length} files. Generated ${Object.keys(meta).length} meta entries saved to git-meta.json`,
  );
} catch (error) {
  console.error("❌ Error generating meta:", error);
  // Pastikan file meta tetap ada meski kosong agar build tidak error
  if (!fs.existsSync(metaFile)) {
    fs.writeFileSync(metaFile, "{}");
  }
}
