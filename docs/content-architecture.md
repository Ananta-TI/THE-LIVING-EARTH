# Content Architecture

THE LIVING EARTH menyajikan seluruh konten publik dari file JSON statis di `src/data/`. Tidak ada database, API eksternal, atau penyimpanan runtime. JSON adalah satu-satunya sumber kebenaran (*single source of truth*), dibaca saat build, dan disajikan sebagai halaman statis di Vercel.

---

## 1. Prinsip Utama

- **Read-only saat runtime.** Vercel tidak menulis file. Perubahan konten dilakukan dengan mengedit JSON, commit, lalu deploy ulang.
- **Konten dan presentasi terpisah.** Halaman memanggil fungsi di `src/features/public/queries.ts`; halaman tidak membaca JSON secara langsung (kecuali `generateStaticParams`).
- **Tipe ketat.** Bentuk setiap record didefinisikan di `src/types/content-data.ts`.
- **Kontrak query stabil.** `queries.ts` tetap mengembalikan `QueryResult<T>` agar halaman publik tidak perlu mengetahui detail sumber data.
- **Gambar lokal diutamakan.** Nilai `cover_image_path` berupa path publik seperti `/images/pillar-forests.jpg`; URL `http(s)` absolut juga didukung.

---

## 2. File Data

| File | Isi | Jumlah saat ini |
|---|---|---:|
| `pillars.json` | Lima pilar lingkungan | 5 |
| `topics.json` | Subtopik di bawah pilar | 5 |
| `references.json` | Sumber ilmiah terverifikasi | 3 |
| `statistics.json` | Indikator terverifikasi | 3 |
| `articles.json` | Artikel editorial | 6 |
| `case-studies.json` | Studi kasus regional | 3 |
| `article-references.json` | Relasi artikel ↔ referensi | 4 |
| `case-study-references.json` | Relasi studi kasus ↔ referensi | 3 |
| `site-settings.json` | Identitas situs, SEO, footer | 1 objek |

`src/data/index.ts` mengimpor seluruh file tersebut, mengekspor koleksi, map pencarian, filter `published`, dan helper referensi.

---

## 3. Skema Record

### Pillar (`pillars.json`)

```json
{
  "id": "pillar-climate-atmosphere",
  "name": "Climate & Atmosphere",
  "slug": "climate-atmosphere",
  "description": "...",
  "cover_image_path": "/images/pillar-climate.jpg",
  "display_order": 1,
  "is_active": true,
  "created_at": "2025-01-10T00:00:00Z",
  "updated_at": "2025-04-24T00:00:00Z"
}
```

- `slug` harus unik dan dipakai di route `/explore/[slug]`.
- Hanya pilar dengan `is_active: true` yang tampil.
- Urutan tampilan mengikuti `display_order`.

### Topic (`topics.json`)

```json
{
  "id": "topic-rising-temperatures",
  "pillar_id": "pillar-climate-atmosphere",
  "name": "Rising Temperatures",
  "slug": "rising-temperatures",
  "description": "...",
  "display_order": 1,
  "is_active": true,
  "created_at": "...",
  "updated_at": "..."
}
```

- `pillar_id` harus merujuk ke `pillars.json`.
- Hanya topik dengan `is_active: true` yang ditampilkan pada detail pilar.

### Reference (`references.json`)

```json
{
  "id": "ref-ipcc-ar6",
  "title": "Climate Change 2023: Synthesis Report (Sixth Assessment Report)",
  "organization": "Intergovernmental Panel on Climate Change (IPCC)",
  "source_type": "international_organization",
  "author": "IPCC Core Writing Team",
  "publication_date": "2023-03-20",
  "source_url": "https://www.ipcc.ch/report/ar6/syr/",
  "accessed_at": "2025-04-24",
  "notes": "...",
  "created_at": "...",
  "updated_at": "..."
}
```

Nilai `source_type` yang didukung:

- `scientific_journal`
- `research_report`
- `government_data`
- `international_organization`
- `institutional_report`
- `other`

### Statistic (`statistics.json`)

```json
{
  "id": "stat-global-temp-rise",
  "pillar_id": "pillar-climate-atmosphere",
  "reference_id": "ref-ipcc-ar6",
  "indicator": "Global Temp Rise",
  "value": 1.2,
  "unit": "°C",
  "measurement_year": 2023,
  "publication_date": "2023-03-20",
  "geographic_scope": "Global Mean Surface",
  "data_type": "historical_observation",
  "methodology": "...",
  "limitations": "...",
  "status": "published",
  "created_at": "...",
  "updated_at": "..."
}
```

- `data_type`: `historical_observation`, `current_estimate`, atau `projection`.
- `reference_id` harus merujuk ke `references.json`.
- Hanya statistik dengan `status: "published"` yang tampil.

### Article (`articles.json`)

```json
{
  "id": "art-urgent-climate-action",
  "pillar_id": "pillar-climate-atmosphere",
  "topic_id": "topic-rising-temperatures",
  "title": "The Urgent Need for Climate Action",
  "slug": "the-urgent-need-for-climate-action",
  "excerpt": "...",
  "content": "## Heading\n\nBody markdown...",
  "cover_image_path": "/images/pillar-climate.jpg",
  "author_id": null,
  "status": "published",
  "featured": true,
  "seo_title": null,
  "seo_description": null,
  "published_at": "2025-04-22T00:00:00Z",
  "created_at": "...",
  "updated_at": "..."
}
```

- `slug` harus unik dan dipakai di route `/stories/[slug]`.
- `content` berupa Markdown sederhana (heading, paragraf, list, bold, tautan).
- `status` harus `"published"` agar tampil. Nilai lain: `"draft"`, `"archived"`.
- `featured` menentukan artikel unggulan pada halaman Stories.
- `author_id` boleh `null` karena tidak ada sistem akun.

### Case Study (`case-studies.json`)

```json
{
  "id": "cs-mangrove-indonesia",
  "pillar_id": "pillar-oceans-water",
  "title": "Mangrove Restoration in Indonesia",
  "slug": "mangrove-restoration-indonesia",
  "summary": "...",
  "content": "## Overview\n\n...",
  "country": "Indonesia",
  "region": "Southeast Asia",
  "latitude": -2.5,
  "longitude": 118.0,
  "cover_image_path": "/images/mangrove-coastal.jpg",
  "organization": "...",
  "start_date": "2018-01-01",
  "end_date": null,
  "status": "published",
  "published_at": "...",
  "created_at": "...",
  "updated_at": "..."
}
```

- `slug` harus unik dan dipakai di route `/case-studies/[slug]`.
- `latitude` dan `longitude` boleh `null`.
- `status` harus `"published"` agar tampil.

### Join Tables

`article-references.json`:

```json
[{ "article_id": "art-urgent-climate-action", "reference_id": "ref-ipcc-ar6" }]
```

`case-study-references.json`:

```json
[{ "case_study_id": "cs-mangrove-indonesia", "reference_id": "ref-noaa-acidification" }]
```

Helper `getReferencesForArticle()` dan `getReferencesForCaseStudy()` menampilkan referensi yang terhubung terlebih dahulu, lalu referensi lain sebagai daftar sumber pendukung.

### Site Settings (`site-settings.json`)

Objek tunggal dengan bagian:

- `general` — nama situs, tagline, deskripsi, `contact_email`.
- `social_media` — URL Instagram, YouTube, X, LinkedIn (boleh kosong).
- `seo_defaults` — judul, deskripsi, dan gambar OG default.
- `footer` — mission statement, catatan metodologi, copyright.
- `site_identity` — judul situs, tagline, email kontak, slug artikel hero.

`src/config/site.ts` membaca `general.contact_email` lalu `site_identity.contactEmail` sebagai fallback `NEXT_PUBLIC_CONTACT_EMAIL`.

---

## 4. Relasi Antar-Record

```text
pillars
  ├── topics (pillar_id)
  ├── articles (pillar_id)
  │     └── article-references (article_id → references)
  ├── case-studies (pillar_id)
  │     └── case-study-references (case_study_id → references)
  └── statistics (pillar_id, reference_id → references)
```

Semua relasi menggunakan `id` stabil, bukan slug. Saat mengganti `id`, perbarui juga seluruh referensi di file lain.

---

## 5. Aturan Publikasi

| Record | Aturan tampil |
|---|---|
| Pillar | `is_active: true` |
| Topic | `is_active: true` dan pilar induk aktif |
| Article | `status: "published"` |
| Case Study | `status: "published"` |
| Statistic | `status: "published"` |
| Reference | Selalu tampil sebagai sumber pendukung; relasi join menentukan urutan |

Konten `draft` atau `archived` tetap boleh disimpan di JSON, tetapi tidak dirender di situs publik.

---

## 6. Query Layer

`src/features/public/queries.ts` mengekspor fungsi yang dipakai halaman:

- `getHomePageData()`
- `getExploreOverview()`
- `getPillarDetailBySlug(slug)`
- `getStoriesList({ search, pillarSlug, page, pageSize })`
- `getStoryDetailBySlug(slug)`
- `getOurPlanetData()`
- `getCaseStudyDetailBySlug(slug)`
- `getPublishedSitemapEntries()`

Semua fungsi mengembalikan `QueryResult<T>`:

```ts
type QueryResult<T> =
  | { status: "ok"; data: T }
  | { status: "unconfigured" }
  | { status: "error"; message: string };
```

Dengan JSON statis, hasilnya selalu `ok`. Varian lain dipertahankan agar kontrak halaman tetap stabil jika sumber data berubah di masa depan.

`generateStaticParams` pada route dinamis membaca `PILLARS`, `PUBLISHED_ARTICLES`, dan `PUBLISHED_CASE_STUDIES` langsung dari `src/data` agar semua halaman detail diprerender saat build.

---

## 7. Gambar

`resolveEditorialImageUrl()` di `src/lib/utils/media-url.ts`:

- Mengembalikan path lokal (`/images/...`) atau URL absolut (`https://...`) apa adanya.
- Jika nilai kosong atau tidak valid, memakai gambar fallback sesuai slug pilar.
- Nilai kosong atau tidak dikenal akan memakai gambar fallback sesuai slug pilar.

Letakkan gambar baru di `public/images/` dan rujuk dengan path `/images/nama-file.jpg`.

---

## 8. Menambah atau Mengubah Konten

### Menambah artikel

1. Tambahkan objek baru ke `src/data/articles.json` dengan `id` dan `slug` unik.
2. Set `pillar_id` (dan opsional `topic_id`) ke record yang sudah ada.
3. Isi `content` dengan Markdown.
4. Set `status: "published"` dan `published_at`.
5. Opsional: tambahkan relasi di `src/data/article-references.json`.
6. Jalankan `npx tsc --noEmit` dan `npm run build`.

### Menambah studi kasus

1. Tambahkan objek ke `src/data/case-studies.json`.
2. Set `pillar_id`, `country`, dan `summary`.
3. Isi `content` dengan Markdown.
4. Set `status: "published"`.
5. Opsional: tambahkan relasi di `src/data/case-study-references.json`.
6. Validasi dengan typecheck dan build.

### Menambah statistik

1. Pastikan referensi sumber sudah ada di `src/data/references.json`.
2. Tambahkan objek ke `src/data/statistics.json` dengan `reference_id` yang valid.
3. Set `status: "published"`.
4. Validasi dengan typecheck dan build.

### Menambah referensi

1. Tambahkan objek ke `src/data/references.json`.
2. Hubungkan ke artikel atau studi kasus melalui file join terkait.
3. Statistik dapat langsung merujuk `reference_id` baru.

---

## 9. Validasi dan Build

```bash
npx tsc --noEmit   # validasi tipe dan bentuk JSON
npm run lint       # pemeriksaan ESLint
npm run build      # prerender seluruh halaman publik
```

TypeScript memeriksa tipe komponen dan query, sedangkan `next build` memastikan seluruh halaman dapat dirender dari JSON. Karena JSON diimpor sebagai data statis, pastikan setiap record baru tetap mengikuti field dan contoh skema di atas.

---

## 10. Perilaku di Vercel

- JSON dibaca pada saat build dan ikut ke dalam bundle server.
- Halaman publik dan detail diprerender; tidak ada query database per request.
- Formulir kontak membuka aplikasi email pengunjung (`mailto:`) dan tidak menulis data apa pun.
- Untuk memperbarui konten: edit JSON → commit → deploy ulang.
