# 📚 Fyy's Notebook

**Fyy's Notebook** adalah situs dokumentasi pribadi ("Digital Garden") yang dibangun untuk menyimpan catatan belajar, materi kuliah, dan dokumentasi teknis. Proyek ini dirancang dengan fokus pada kecepatan, kemudahan penulisan konten (MDX), dan tampilan yang modern.

![Project Banner](public/image.png)

## 🚀 Technology Used

Proyek ini dibangun menggunakan _tech stack_ terbaru (Next.js 16 & Tailwind v4):

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Dokumentasi:** [Nextra 4.6](https://nextra.site/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & `tw-animate-css`
- **Search Engine:** [Pagefind](https://pagefind.app/) (Static search)
- **Optimasi:** React Compiler & Turbopack enabled

## ✨ Features

- 📝 **Penulisan MDX:** Menulis konten semudah menulis Markdown dengan dukungan komponen React.
- 🌓 **Dark Mode:** Dukungan tema gelap/terang bawaan (via `next-themes`).
- ⚡ **Performa Tinggi:** Menggunakan Next.js App Router dengan Turbopack sebagai bundler.
- 🔍 **Pencarian Cepat:** Indeksasi konten statis menggunakan Pagefind saat _build_.
- 📱 **Responsif:** Tampilan antarmuka yang ramah.

## 🛠️ Installation

Required: nodejs & pnpm

1. **Clone repository**
   ```bash
   git clone [https://github.com/fyydsz/webnotes.git](https://github.com/fyydsz/webnotes.git)
   cd webnotes
   ```
2. Instal dependency menggunakan pnpm sebagai package manager.
   ```
   pnpm install
   ```
3. Jalankan server
   ```
   pnpm dev
   ```
   Buka http://localhost:3000 di browser

## 📂 App Structure
```
.
├── app/
│   ├── (documentation)/docs/  # Layout dan konfigurasi halaman dokumentasi
│   ├── (landing-page)/        # Halaman depan (Home)
│   └── _meta.global.tsx       # Konfigurasi navigasi/sidebar global
├── content/                   # 📝 Tempat menyimpan file materi (MDX)
│   ├── bahasa_indonesia/
│   ├── logika_matematika/
│   ├── index.mdx
│   └── tentang.mdx
├── public/                    # Aset statis (gambar, icon)
├── next.config.ts             # Konfigurasi Next.js & Nextra
└── package.json
```

## 📄 License
Proyek ini dilisensikan di bawah [MIT License](https://opensource.org/license/mit).