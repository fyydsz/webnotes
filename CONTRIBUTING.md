# 🤝 Kontribusi & Lisensi Project

Terima kasih telah tertarik untuk berkontribusi pada proyek **Buku Kampus**! Proyek ini bersifat **open-source** dan terbuka bagi siapa saja yang ingin membantu mengembangkan catatan atau materi baru.

## Cara Berkontribusi

Berikut langkah-langkah untuk mulai berkontribusi:

### 1. Fork Repository
Kunjungi repository Buku Kampus:  
https://github.com/fyydsz/bukukampus  
Klik tombol **Fork** untuk membuat salinan repository ke akun GitHub kamu.

### 2. Clone Repository
Setelah melakukan fork, clone repository tersebut:

<pre>
git clone &lt;url-repository-kamu&gt;
</pre>

### 3. Buat Cabang Baru
Buat branch baru sebelum melakukan perubahan:

<pre>
git checkout -b add-kalkulus
</pre>

> Sesuaikan nama branch dengan perubahan yang kamu lakukan.

### 4. Lakukan Perubahan
Proyek ini menggunakan format **MDX** untuk halaman materi.

- Untuk **menambah materi baru**, buat folder baru di `app/docs/<nama-topik>` dan tambahkan `page.mdx`.
- Untuk **mengedit materi yang sudah ada**, ubah file `page.mdx` pada folder yang sesuai (misalnya: `app/docs/kalkulus/page.mdx`).

Referensi sintaks MDX:  
https://nextra.site/docs/built-ins

### 5. Commit dan Push Perubahan

<pre>
git add .
git commit -m "Menambahkan materi Kalkulus"
git push origin add-kalkulus
</pre>

### 6. Buat Pull Request
Buka repository hasil fork kamu → buat **Pull Request** ke branch `master` pada repository asli Buku Kampus.

---

## 📄 Lisensi Project

Proyek ini menggunakan lisensi **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.  
Lisensi: https://creativecommons.org/licenses/by-sa/4.0/

Dengan berkontribusi, kamu menyetujui bahwa kontribusi kamu akan dilisensikan di bawah lisensi yang sama.

### Kamu bebas untuk:
- Menyalin dan mendistribusikan materi.
- Mengadaptasi dan membuat karya turunan, termasuk untuk komersial.

### Dengan syarat:
- Memberikan atribusi (penulis asli, link repository, link lisensi, dan catatan perubahan).
- Membagikan karya turunan dengan lisensi yang sama (**ShareAlike**).
- Tidak menambahkan batasan hukum atau teknologi yang menghalangi orang lain.

Lisensi ini tidak memberikan jaminan apa pun; penulis dan kontributor tidak bertanggung jawab atas kerusakan akibat penggunaan materi.

---

### **Ringkasnya**
**Boleh digunakan bebas, asal beri kredit dan karya turunan wajib memakai lisensi yang sama (CC BY-SA 4.0).**
