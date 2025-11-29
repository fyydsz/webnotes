// scripts/gen-meta.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const metaFile = path.join(rootDir, 'git-meta.json');

// DEFINISI FOLDER KONTEN
const contentDirs = [
  'app/docs',
  'content'
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Ambil hanya file konten yang relevan (.md, .mdx, .tsx)
      if (/\.(mdx?|tsx)$/.test(file)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

try {
  const meta = {};
  let totalFiles = 0;

  console.log('🔄 Generating git-meta.json...');

  contentDirs.forEach(dir => {
    const absPath = path.join(rootDir, dir);
    
    if (fs.existsSync(absPath)) {
      const files = getAllFiles(absPath);
      totalFiles += files.length;

      files.forEach((file) => {
        // Buat path relatif dari root project untuk dijadikan KEY di JSON
        // .replace(/\\/g, '/') memaksa penggunaan forward slash agar konsisten di Windows/Linux
        const relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
        
        try {
          // Jalankan git log
          // Gunakan cwd: rootDir untuk memastikan git command berjalan di konteks yang benar
          const lastCommitDate = execSync(`git log -1 --format=%cs "${relativePath}"`, {
            cwd: rootDir,
            encoding: 'utf8'
          }).trim();
          
          if (lastCommitDate) {
            meta[relativePath] = lastCommitDate;
          }
        } catch (e) {
          // Error biasanya terjadi jika file belum pernah di-commit (untracked)
          // Kita abaikan saja
        }
      });
    } else {
      console.warn(`⚠️  Directory not found: ${dir}`);
    }
  });

  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
  console.log(`✅ Success: Scanned ${totalFiles} files. Meta saved to git-meta.json`);

} catch (error) {
  console.error('❌ Error generating meta:', error);
  // Pastikan file meta tetap ada meski kosong agar build tidak error
  if (!fs.existsSync(metaFile)) {
    fs.writeFileSync(metaFile, '{}');
  }
}