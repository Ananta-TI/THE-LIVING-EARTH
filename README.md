# THE LIVING EARTH

**A Journey Through Our Changing Planet**

Platform pengetahuan dan storytelling lingkungan (*Environmental Knowledge & Storytelling Platform*) dengan pendekatan *Nature Editorial & Immersive Storytelling*. Proyek ini menyajikan informasi lingkungan lintas lima pilar utama berbasis sumber ilmiah terverifikasi.

---

## 1. Project Overview

**THE LIVING EARTH** dirancang untuk membantu masyarakat umum, pelajar, mahasiswa, pendidik, dan pemerhati lingkungan memahami kondisi planet bumi sebagai satu sistem yang saling terhubung.

### Lima Pilar Konten

1. **Climate & Atmosphere** — Iklim, atmosfer, suhu global, dan dinamika energi bumi.
2. **Oceans & Water** — Lautan, terumbu karang, air bersih, dan siklus hidrologi.
3. **Forests & Biodiversity** — Hutan, ekosistem darat, dan keanekaragaman hayati.
4. **Pollution & Human Impact** — Polusi udara, limbah elektronik, dan jejak aktivitas manusia.
5. **Solutions & Restoration** — Konservasi, restorasi ekosistem, dan aksi berkelanjutan.

---

## 2. Product Vision

Menjadi ruang belajar digital yang memadukan narasi editorial, integritas ilmiah (sumber terverifikasi, periode data terpisah dari tanggal publikasi, serta label klaim `Fakta`, `Proyeksi`, dan `Interpretasi`), visualisasi data yang jujur, dan solusi yang realistis tanpa bahasa alarmis.

---

## 3. Technology Stack

### Frontend
- **Next.js 16 (App Router)** dengan React 19 dan **TypeScript** (strict mode)
- **Tailwind CSS v4** dengan token desain editorial berbasis CSS variables
- **shadcn/ui** (Radix UI primitives + `lucide-react`)
- **Motion for React** (`motion/react`) dengan dukungan `prefers-reduced-motion`
- **Recharts** untuk visualisasi data lingkungan

### Content & Validation
- **JSON statis** di `src/data/` sebagai satu-satunya sumber konten
- **Zod** untuk validasi formulir kontak

### Deployment Target
- **Vercel** — seluruh halaman publik dibaca dari JSON saat build dan disajikan sebagai konten statis/read-only.

> Tidak ada database, autentikasi, storage, atau CMS admin. Konten diubah dengan mengedit file JSON lalu melakukan commit dan deploy ulang.

---

## 4. Project Directory Structure

```text
.
├── .agents/
│   └── skills/                         # Project-specific frontend skills
├── docs/
│   └── content-architecture.md         # Panduan struktur dan alur kerja konten JSON
├── public/
│   └── images/                         # Gambar editorial statis
├── src/
│   ├── app/
│   │   ├── (public)/                   # Public editorial routes
│   │   │   ├── layout.tsx              # Public shell (header, main, footer)
│   │   │   ├── page.tsx                # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── explore/page.tsx
│   │   │   ├── explore/[slug]/page.tsx
│   │   │   ├── stories/page.tsx
│   │   │   ├── stories/[slug]/page.tsx
│   │   │   ├── our-planet/page.tsx
│   │   │   ├── case-studies/[slug]/page.tsx
│   │   │   ├── solutions/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── globals.css                 # Tailwind v4 + brand & semantic design tokens
│   │   ├── layout.tsx                  # Root layout (fonts, metadata, skip link, motion config)
│   │   ├── robots.ts                   # robots.txt
│   │   ├── sitemap.ts                  # sitemap.xml dari konten JSON
│   │   └── not-found.tsx               # Accessible 404 fallback page
│   ├── components/
│   │   ├── layout/                     # SiteHeader, SiteFooter, BrandLogo
│   │   ├── providers/                  # MotionProvider (reduced-motion config)
│   │   ├── public/                     # Editorial UI (cards, charts, form, markdown, dll.)
│   │   └── ui/                         # shadcn/ui primitives
│   ├── config/
│   │   └── site.ts                     # Brand identity, navigation, contact email
│   ├── data/
│   │   ├── articles.json
│   │   ├── case-studies.json
│   │   ├── pillars.json
│   │   ├── topics.json
│   │   ├── statistics.json
│   │   ├── references.json
│   │   ├── article-references.json
│   │   ├── case-study-references.json
│   │   ├── site-settings.json
│   │   └── index.ts                    # Loader, map, filter, dan helper referensi
│   ├── features/
│   │   ├── contact/schemas.ts          # Validasi formulir kontak
│   │   └── public/queries.ts           # Query API publik (membaca JSON)
│   ├── lib/
│   │   ├── constants/pillars.ts        # Metadata lima pilar konten
│   │   └── utils/                      # Format, media URL, reading time, slug
│   └── types/
│       ├── content-data.ts             # Tipe record konten JSON
│       └── content.ts                  # Tipe domain PRD (referensi)
├── .env.example                        # Template environment variables
├── components.json                     # shadcn/ui CLI configuration
├── eslint.config.mjs                   # ESLint configuration
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies and npm scripts
└── tsconfig.json                       # Strict TypeScript configuration
```

---

## 5. Installation Instructions

Pastikan **Node.js** dan **npm** telah terpasang, lalu pasang seluruh dependensi:

```bash
npm install
```

---

## 6. Local Development Instructions

Jalankan server pengembangan lokal:

```bash
npm run dev
```

Buka `http://localhost:3000`.

---

## 7. Environment Variable Setup

Semua konten sudah berada di dalam repository, jadi aplikasi dapat dijalankan tanpa file env. Jika ingin menyesuaikan URL kanonis atau alamat email editorial, salin `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Variabel yang tersedia:

```env
NEXT_PUBLIC_SITE_URL=https://thelivingearth.org
NEXT_PUBLIC_CONTACT_EMAIL=editorial@thelivingearth.org
```

| Variabel | Kegunaan |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL kanonis untuk metadata, sitemap, dan robots. Fallback: `http://localhost:3000`. Di Vercel, URL produksi otomatis dipakai dari `VERCEL_PROJECT_PRODUCTION_URL` bila variabel ini kosong. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Alamat email tujuan formulir kontak. Fallback: nilai di `src/data/site-settings.json`. |

---

## 8. Content Workflow

Konten publik **tidak** disimpan di database. Semua data editorial berada di `src/data/*.json` dan dibaca saat build:

1. Edit file JSON yang relevan (misalnya `src/data/articles.json`).
2. Pastikan `status` bernilai `"published"` agar konten tampil di situs publik.
3. Jalankan `npx tsc --noEmit` dan `npm run build` untuk memvalidasi tipe dan prerender.
4. Commit dan deploy ulang ke Vercel.

Detail struktur setiap file, relasi antar-record, dan aturan penulisan tersedia di [`docs/content-architecture.md`](docs/content-architecture.md).

### Formulir Kontak

Formulir kontak tidak menyimpan data ke server. Setelah validasi, formulir membuka aplikasi email pengunjung melalui tautan `mailto:` yang sudah terisi nama, email, subjek, dan isi pesan. Alamat tujuan diambil dari `NEXT_PUBLIC_CONTACT_EMAIL` atau `site-settings.json`.

---

## 9. Available Project Scripts

| Script | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js |
| `npm run build` | Membuild aplikasi Next.js untuk produksi |
| `npm run start` | Menjalankan hasil build produksi |
| `npm run lint` | Menjalankan pemeriksaan ESLint |
| `npx tsc --noEmit` | Menjalankan pemeriksaan tipe TypeScript |

---

## 10. Deployment

Target utama adalah **Vercel**:

1. Hubungkan repository ke Vercel.
2. Set environment variable opsional (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`).
3. Deploy. Seluruh konten publik dibaca dari JSON saat build dan tidak memerlukan database.

Tidak diperlukan konfigurasi database atau layanan eksternal lainnya.

---

## 11. Current Development Status

**Selesai:**
- Seluruh konten editorial disimpan sebagai JSON statis di `src/data/`.
- Situs publik lengkap: Home, About, Explore, Stories, Our Planet, Solutions, Contact.
- Detail pilar, artikel, dan studi kasus dengan `generateStaticParams` untuk prerender.
- Visualisasi statistik, kartu editorial, referensi ilmiah, sitemap, dan robots.
- Formulir kontak berbasis `mailto:` tanpa penyimpanan server.
- Tidak ada autentikasi, storage, database, atau CMS admin; seluruh situs publik berjalan dari JSON.

**Pengembangan berikutnya (opsional):**
- Menambah artikel, studi kasus, statistik, atau referensi baru melalui file JSON.
- Menyesuaikan identitas situs dan alamat email editorial melalui `src/data/site-settings.json`.
