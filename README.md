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

### Backend, Database & Validasi
- **Supabase** (PostgreSQL, Supabase Auth, Supabase Storage, `@supabase/ssr`)
- **Zod**, **React Hook Form**, dan `@hookform/resolvers`

### Deployment Target
- GitHub, Vercel, dan Supabase Cloud

---

## 4. Project Directory Structure

```text
.
├── .agents/
│   └── skills/                         # Project-specific Antigravity frontend skills
├── public/                             # Static public assets
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx              # Public editorial shell (header, main, footer)
│   │   │   └── page.tsx                # Foundation verification landing page
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # Foundation admin login placeholder
│   │   │   ├── layout.tsx              # Separated admin/CMS layout shell
│   │   │   └── page.tsx                # Foundation admin workspace placeholder
│   │   ├── globals.css                 # Tailwind v4 + brand & semantic design tokens
│   │   ├── layout.tsx                  # Root layout (fonts, metadata, skip link, motion config)
│   │   └── not-found.tsx               # Accessible 404 fallback page
│   ├── components/
│   │   ├── layout/                     # SiteHeader, SiteFooter, AdminShell
│   │   ├── providers/                  # MotionProvider (reduced-motion config)
│   │   └── ui/                         # shadcn/ui primitives (Button)
│   ├── config/
│   │   └── site.ts                     # Brand identity & canonical navigation config
│   ├── lib/
│   │   ├── constants/
│   │   │   └── pillars.ts              # Five content pillars metadata & routes
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client (@supabase/ssr)
│   │   │   └── server.ts               # Cookie-aware Server Supabase client (@supabase/ssr)
│   │   ├── validations/
│   │   │   └── env.ts                  # Zod environment variable validation helpers
│   │   └── utils.ts                    # Class name helper (cn)
│   └── types/
│       └── content.ts                  # Core domain TypeScript types
├── .env.example                        # Template environment variables
├── components.json                     # shadcn/ui CLI configuration
├── eslint.config.mjs                   # ESLint configuration
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies and npm scripts
└── tsconfig.json                       # Strict TypeScript configuration
```

---

## 5. Installation Instructions

Pastikan **Node.js** dan **npm** telah terpasang di perangkat Anda, lalu pasang seluruh dependensi proyek:

```bash
npm install
```

---

## 6. Local Development Instructions

Jalankan server pengembangan lokal:

```bash
npm run dev
```

Buka `http://localhost:3000` untuk melihat tata letak publik fondasi, atau `http://localhost:3000/admin` untuk melihat shell layout administrasi yang terpisah.

---

## 7. Environment Variable Setup

Salin berkas `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Variabel lingkungan yang digunakan pada fase ini:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Aplikasi tetap dapat di-build dan dijalankan secara lokal meskipun variabel di atas belum diisi; helper `getSupabasePublicEnv()` dan `isSupabaseConfigured()` di `src/lib/validations/env.ts` akan melaporkan status konfigurasi secara aman tanpa mematahkan proses build.

---

## 8. Supabase Configuration Instructions

1. Buat proyek baru di [Supabase Cloud](https://supabase.com).
2. Buka **Project Settings → API**, lalu salin **Project URL** ke `NEXT_PUBLIC_SUPABASE_URL` dan **anon/public key** ke `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.
3. Gunakan `createClient()` dari:
   - `src/lib/supabase/client.ts` untuk Client Components.
   - `src/lib/supabase/server.ts` untuk Server Components, Server Actions, dan Route Handlers.
4. **Aturan keamanan:** Jangan pernah menyimpan `SUPABASE_SERVICE_ROLE_KEY` pada variabel `NEXT_PUBLIC_*`, jangan menggunakannya di browser/Client Components, dan jangan melakukan commit berkas `.env.local` ke repositori.

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

## 10. Current Development Status

**Selesai (Fase 1 — Project Initialization & Foundation):**
- Inisialisasi Next.js App Router, TypeScript strict, Tailwind CSS v4, dan `shadcn/ui`.
- Pemasangan seluruh dependensi stack (`@supabase/supabase-js`, `@supabase/ssr`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`, `motion`, `recharts`).
- Pengaturan token desain editorial (`Forest`, `Deep Forest`, `Sage`, `Ivory`, `Earth Brown`, `Charcoal`, `Muted`) serta pasangan font `Newsreader` dan `Plus Jakarta Sans`.
- Pemisahan layout dasar publik (`(public)`) dan administrasi (`admin`), konfigurasi `MotionConfig reducedMotion="user"`, serta fondasi klien Supabase SSR dan validasi env.

**Belum diimplementasikan (sesuai batasan ruang lingkup fase inisialisasi):**
- Skema basis data PostgreSQL, migrasi SQL, dan Row Level Security (RLS).
- Alur autentikasi Supabase Auth dan fitur CRUD CMS.
- Halaman konten publik lengkap (`About`, `Explore`, `Stories`, `Our Planet`, `Solutions`, `Contact`) serta dataset terverifikasi.

---

## 11. Next Development Milestones

1. **Phase 2 — Supabase Database Architecture, Schema Design, Migrations & Row Level Security (RLS):** Merancang skema tabel untuk pilar, topik, artikel, studi kasus, statistik, referensi, aset media, dan pesan kontak beserta kebijakan RLS.
2. **Phase 3 — Content Modeling, Verification Pipeline & Editorial CMS / Auth:** Membangun autentikasi admin dan mekanisme `Content Status Gate` (`Verified` vs. `Needs Verification`).
3. **Phase 4 — Public Editorial Pages & Verified Data Storytelling:** Mengimplementasikan halaman publik, artikel dua lapis (`Inti Cerita` & `Kajian Lanjut`), `Statistic Card`, grafik Recharts interaktif, dan formulir kontak.
