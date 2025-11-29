// scripts/gen-meta.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
// TARGET: Folder 'content' sesuai struktur project kamu
const contentDir = path.join(rootDir, 'content'); 
const metaFile = path.join(rootDir, 'git-meta.json');

function getAllFiles(dirPath, arrayOfFiles) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles || [];
  }
  
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Ambil hanya file .md dan .mdx
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

try {
  if (!fs.existsSync(contentDir)) {
    console.warn(`⚠️ Folder content tidak ditemukan di ${contentDir}`);
    fs.writeFileSync(metaFile, '{}');
    process.exit(0);
  }

  const files = getAllFiles(contentDir);
  const meta = {};

  console.log(`🔍 Scanning ${files.length} files in 'content/'...`);

  files.forEach((file) => {
    // Simpan path relatif, misal: content/kalkulus/index.mdx
    const relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
    
    try {
      // Ambil tanggal commit terakhir
      const lastCommitDate = execSync(`git log -1 --format=%cs "${relativePath}"`).toString().trim();
      
      if (lastCommitDate) {
        // Kunci JSON kita buat agar cocok dengan URL (opsional, tapi memudahkan)
        // Kita simpan dengan key path file aslinya
        meta[relativePath] = lastCommitDate;
      }
    } catch (e) {
      // Ignore error jika file belum di-commit
    }
  });

  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
  console.log('✅ Success: git-meta.json generated.');

} catch (error) {
  console.error('❌ Error:', error);
  fs.writeFileSync(metaFile, '{}');
}