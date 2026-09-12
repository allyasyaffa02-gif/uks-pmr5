# 🏥 UKS & PMR Management System

Sistem Manajemen **Usaha Kesehatan Sekolah (UKS)** dan **Palang Merah Remaja (PMR)** berbasis web modern. Aplikasi ini digunakan untuk mencatat penanganan pasien, mengelola kategori penyakit/keluhan, melihat rekapitulasi data kunjungan per kelas, serta menyajikan statistik real-time.

---

## 🛠️ Teknologi & Stack Utama

### Backend

- **Framework**: [NestJS](https://nestjs.com/) (Node.js / TypeScript)
- **Database & ORM**: MariaDB / MySQL dengan [Prisma ORM](https://www.prisma.io/) (`@prisma/adapter-mariadb`)
- **Validation**: `class-validator` & `class-transformer`
- **Runtime / Package Manager**: [Bun](https://bun.sh/) / npm / Node.js

### Frontend

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **State & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS dengan Modern Design Tokens & Glassmorphism Aesthetics

---

## 📂 Struktur Folder Project

Project ini menggunakan struktur terpisah antara folder **`backend`** dan **`frontend`**:

```text
uks-pmr5/
├── backend/                  # Aplikasi Backend (NestJS + Prisma)
│   ├── prisma/
│   │   ├── migrations/       # Riwayat migrasi database
│   │   └── schema.prisma     # Schema Prisma (Model MasterKategori & Pasien)
│   ├── src/
│   │   ├── generated/        # Output Prisma Client yang digenerate
│   │   ├── modules/
│   │   │   └── uks/          # Module UKS
│   │   │       ├── controllers/   # Endpoint HTTP API Controller
│   │   │       ├── dto/           # Data Transfer Objects & Validasi
│   │   │       ├── repositories/  # Query Database / Repository Layer
│   │   │       ├── services/      # Business Logic Service Layer
│   │   │       └── uks.module.ts  # Deklarasi Module UKS
│   │   ├── prisma/           # Service koneksi Prisma Client ke MariaDB
│   │   ├── app.module.ts     # Root Module NestJS
│   │   └── main.ts           # Entry point (Bootstrap NestJS, CORS, Prefix /api)
│   ├── nest-cli.json
│   ├── package.json          # Dependency backend
│   ├── prisma.config.ts      # Konfigurasi Prisma 7
│   ├── tsconfig.json
│   ├── Dockerfile            # Docker image backend (multi-stage)
│   ├── docker-entrypoint.sh  # Script migrasi + start app di container
│   └── .dockerignore
│
├── frontend/                 # Aplikasi Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Komponen UI Reusable
│   │   │   └── ui/           # Komponen Header, NavigationTabs, StatsCard
│   │   ├── modules/
│   │   │   └── uks/          # Fitur Utama UKS
│   │   │       ├── hooks/    # Custom React Query Hooks (useKasus, useStats, dll)
│   │   │       ├── pages/    # Halaman UI (CatatBaruPage, DataSpreadsheetPage, RekapKelasPage)
│   │   │       ├── services/ # Pemanggilan HTTP API client (Axios)
│   │   │       └── types/    # Type Definitions & Interfaces TypeScript
│   │   ├── utils/            # Helper utilities & konfigurasi Axios Instance
│   │   ├── App.tsx           # Komponen Utama Aplikasi
│   │   ├── index.css         # Modern CSS Design Tokens & Styles
│   │   ├── main.tsx          # Entry Point React/Vite
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json          # Dependency frontend
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── nginx.conf            # Konfigurasi Nginx (SPA fallback + proxy /api)
│   ├── Dockerfile            # Docker image frontend (Vite build + Nginx)
│   └── .dockerignore
│
├── docker-compose.yml        # Orkestrasi seluruh service (db + backend + frontend)
├── .env.example              # Template environment variable
└── README.md                 # Dokumentasi Project
```

---

## ⚡ Prasyarat Sistem

### Cara 1 — Docker (Direkomendasikan)

- **Docker** (v24+) & **Docker Compose** (v2+)
- Tidak perlu install Node.js, Bun, atau database secara manual

### Cara 2 — Manual (Local Development)

- **Node.js** (v18+) atau **Bun** (v1.0+)
- **MySQL** atau **MariaDB Server** (v10.6+)
- Database kosong yang sudah dibuat (misal: `uks_db`)

---

## 🐳 Cara 1: Menjalankan dengan Docker (Production-Ready)

Cara ini menjalankan keseluruhan stack (database + backend + frontend) dalam container secara otomatis.

### Langkah-langkah

1. **Pastikan Docker Desktop sudah berjalan.**

2. **Salin file environment dan isi nilainya:**

   ```bash
   cp .env.example .env
   ```

   Kemudian edit file `.env`:

   ```env
   # Password database — ganti dengan nilai yang aman
   MYSQL_ROOT_PASSWORD=root_password_aman
   MYSQL_DATABASE=uks_pmr
   MYSQL_USER=uks_user
   MYSQL_PASSWORD=password_aman

   # Port yang akan dibuka ke browser (default: 80)
   APP_PORT=80

   # URL API untuk frontend (jangan diubah jika menggunakan Nginx proxy)
   VITE_API_BASE_URL=/api
   ```

3. **Build dan jalankan semua container:**

   ```bash
   docker compose up -d --build
   ```

   Proses ini akan:
   - Menarik image MySQL 8
   - Build image backend (NestJS) & frontend (React/Nginx)
   - Menjalankan migrasi Prisma secara otomatis
   - Menyajikan aplikasi di port yang dikonfigurasi

4. **Cek status container:**

   ```bash
   docker compose ps
   ```

   Semua service (`db`, `backend`, `frontend`) harus berstatus `running`.

5. **Pantau log backend** (opsional, untuk memastikan migrasi berhasil):

   ```bash
   docker compose logs -f backend
   ```

   Output yang diharapkan:

   ```
   ⏳ Running Prisma migrations...
   🚀 Starting NestJS backend...
   [NestJS] Application is running on: http://[::1]:3000/api
   ```

6. **Buka aplikasi di browser:**
   ```
   http://localhost           # jika APP_PORT=80
   http://localhost:8080      # jika APP_PORT=8080
   ```

### Menghentikan & Membersihkan

```bash
# Hentikan semua container (data tetap tersimpan)
docker compose down

# backup db sebelum menghapus seluruh volume
docker compose exec db mysqldump -u uks_user -pMySQL-DB!2026 uks_pmr > backup.sql

# Hentikan dan hapus semua data (volume database ikut terhapus)
docker compose down -v
```

### Memakai Database di Server Terpisah

Secara default, stack menjalankan container MySQL lokal (service `db`). Untuk memakai
database yang berada di server lain (misal MySQL di server produksi), cukup ubah `.env`:

1. **Hapus/komentari** baris `COMPOSE_PROFILES=local-db` — dengan ini container `db`
   tidak ikut dijalankan.
2. **Isi** `DATABASE_URL` mengarah ke server eksternal:

   ```env
   # COMPOSE_PROFILES=local-db
   DATABASE_URL=mariadb://uks_user:password_anda@192.168.1.50:3306/uks_pmr
   ```

3. **Jalankan ulang:**

   ```bash
   docker compose up -d
   ```

Catatan:

- Backend akan otomatis menunggu database bisa diakses (retry hingga ±5 menit) sebelum
  menjalankan migrasi Prisma — berlaku untuk database lokal maupun eksternal.
- Pastikan server eksternal mengizinkan koneksi dari jaringan Docker (misal subnet
  `172.16.0.0/12` atau host `'%-docker%'`), dan database serta user-nya sudah dibuat.
- Skema akan di-migrasi otomatis saat backend pertama kali terhubung.
- Untuk kembali ke database lokal, kembalikan `COMPOSE_PROFILES=local-db` dan hapus
  `DATABASE_URL`. Data lama tetap aman di volume `db_data`.

---

## 🚀 Cara 2: Menjalankan Manual (Local Development)

### 1. Menjalankan Backend (`/backend`)

1. **Masuk ke folder backend:**

   ```bash
   cd backend
   ```

2. **Install dependency:**
   Jika menggunakan Bun:

   ```bash
   bun install
   ```

   Atau jika menggunakan npm:

   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env`):**
   Buat file `.env` di dalam folder `backend/`:

   ```env
   DATABASE_URL="mariadb://root:password_database_anda@localhost:3306/uks_db"
   PORT=3000
   ```

   > ⚠️ Gunakan skema `mariadb://` (bukan `mysql://`) karena project ini menggunakan `@prisma/adapter-mariadb`.
   > Sesuaikan user, password, host, port, dan nama database dengan konfigurasi lokal Anda.

4. **Generate Prisma Client & Jalankan Migrasi Database:**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Jalankan migrasi ke database
   npx prisma migrate dev --name init
   ```

5. **Jalankan Server Backend (Development Mode):**
   Dengan Bun:
   ```bash
   bun run start:dev
   ```
   Dengan npm:
   ```bash
   npm run start:dev
   ```
   Backend akan berjalan di **`http://localhost:3000/api`**.

---

### 2. Menjalankan Frontend (`/frontend`)

1. **Buka terminal baru dan masuk ke folder frontend:**

   ```bash
   cd frontend
   ```

2. **Install dependency:**
   Jika menggunakan Bun:

   ```bash
   bun install
   ```

   Atau jika menggunakan npm:

   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env`):**
   Buat file `.env` di dalam folder `frontend/`:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Jalankan Development Server Frontend:**
   Dengan Bun:
   ```bash
   bun run dev
   ```
   Dengan npm:
   ```bash
   npm run dev
   ```
   Aplikasi Frontend akan dapat diakses di browser pada alamat **`http://localhost:5173`** (atau port yang ditampilkan Vite di terminal).

---

## 🏗️ Build Native (Tanpa Docker)

Seluruh project bisa di-build dan dijalankan **tanpa Docker sama sekali**. Jalur ini setara dengan
apa yang dilakukan Dockerfile, tetapi memakai toolchain lokal (Bun/Node) sehingga lebih cepat
untuk iterasi development.

> ✅ **Aman — build Docker tidak akan rusak.**
> `backend/.dockerignore` dan `frontend/.dockerignore` sudah mengecualikan `node_modules/`,
> `dist/`, dan `.env` dari build context (`backend/.dockerignore` juga mengecualikan
> `src/generated/`), dan kedua Dockerfile selalu menjalankan
> `bun install --frozen-lockfile` di dalam image. Artefak build native karenanya tidak pernah
> ikut terbawa ke image Docker, dan sebaliknya. Satu-satunya yang dipakai bersama adalah source
> code dan `bun.lock`.

### 1. Backend — Build & Run Native

```bash
cd backend

# a) Install dependency (sekali saja / saat lockfile berubah)
bun install            # atau: npm install

# b) Generate Prisma Client → src/generated/prisma
bun run prisma:generate   # atau: bunx prisma generate

# c) Jalankan migrasi ke database tujuan
bunx prisma migrate deploy    # produksi (apply migrasi yang sudah ada)
# atau saat mengembangkan skema baru:
bun run prisma:migrate        # = prisma migrate dev

# d) Build TypeScript → dist/
bun run build          # = nest build (hasil: dist/src/main.js)

# e) WAJIB: salin Prisma Client ke dalam dist
#    `nest build` tidak meng-compile src/generated, sehingga harus disalin manual
#    (di Docker, hal ini dilakukan oleh tahap runner: COPY --from=builder /app/src/generated ./dist/src/generated).
#    Linux / macOS:
cp -r src/generated dist/src/generated
#    Windows PowerShell:
Copy-Item src\generated dist\src\generated -Recurse -Force

# f) Jalankan hasil build (mode produksi)
bun run start:prod     # = node dist/src/main
```

Backend kini melayani **`http://localhost:3000/api`**.

<details>
<summary><b>Variabel environment yang dibutuhkan (backend/.env)</b></summary>

```env
PORT=3000

# Database lokal (tanpa TLS):
DATABASE_URL="mariadb://uks_user:password@127.0.0.1:3306/uks_pmr"

# Database hosted / TiDB Cloud — TLS otomatis aktif karena host mengandung "tidb".
# Enkripsi saja, tanpa verifikasi sertifikat (kondisi yang dipakai backend/.env sekarang):
# DATABASE_URL="mysql://<key>.root:pw@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/db_uks?ssl={"rejectUnauthorized":false}"
#
# Verifikasi sertifikat penuh (direkomendasikan untuk produksi) — cukup ganti query-nya:
# DATABASE_URL="mysql://<key>.root:pw@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/db_uks?sslaccept=strict"
```

> Catatan TLS (lihat `backend/prisma/db-url.ts`): TLS **otomatis aktif** untuk skema `tidb://`
> atau host yang mengandung `tidb` (mis. `*.tidbcloud.com`).
> - `?sslaccept=strict` → enkripsi **dan** verifikasi sertifikat (direkomendasikan untuk produksi).
> - `?ssl={"rejectUnauthorized":false}` → enkripsi saja, tanpa verifikasi.
> - `?ssl=false` → matikan TLS.
>
> Query `ssl` harus berupa **objek JSON**, bukan `?ssl=true`. Parser di `db-url.ts` sudah tahan
> terhadap nilai yang ter-escape maupun yang polos, jadi kedua gaya penulisan di `.env`
> tetap berfungsi. Untuk menjalankan CLI Prisma secara native, gunakan `bunx prisma …`
> (bin hasil Bun di `node_modules/.bin` berekstensi `.exe`, sehingga `npx` bisa gagal).

</details>

### 2. Frontend — Build & Serve Native

```bash
cd frontend

bun install                 # atau: npm install
bun run build               # = tsc && vite build → menghasilkan dist/
bun run preview             # serve hasil build di http://localhost:4173
```

Untuk pengembangan cepat, cukup jalankan `bun run dev` (Vite dev server + proxy `/api`
→ `http://localhost:3000`).

> 💡 `VITE_API_BASE_URL` **di-bake ke dalam bundle saat build**. Jadi:
> - Native build yang dilayani sendiri → isi `http://localhost:3000/api`
> - Build Docker (di belakang Nginx) → biarkan `/api` (Nginx yang mem-proxy)

### 3. Perintah Praktis (Cheat Sheet)

| Tujuan | Perintah |
| :----- | :------- |
| Backend dev (hot reload) | `cd backend && bun run start:dev` |
| Backend build produksi | `cd backend && bun run build && cp -r src/generated dist/src/generated && bun run start:prod` |
| Frontend dev | `cd frontend && bun run dev` |
| Frontend build | `cd frontend && bun run build && bun run preview` |
| Regenerate Prisma Client | `cd backend && bun run prisma:generate` |
| Buat migrasi baru | `cd backend && bun run prisma:migrate` |
| Terapkan migrasi | `cd backend && bunx prisma migrate deploy` |

### 4. Kombinasi: Database Saja via Docker

Jika Anda hanya menginginkan MySQL/MariaDB lokal tanpa meng-install server database:

```bash
docker compose --profile local-db up -d db
```

Lalu arahkan `backend/.env` ke `mariadb://uks_user:***@127.0.0.1:3307/uks_pmr`
dan jalankan backend + frontend secara native seperti di atas. Container
`backend` dan `frontend` tidak ikut berjalan karena hanya service `db` yang di-up.

---

## 📡 Ringkasan API Endpoints (Backend)

Semua endpoint backend berpusat pada prefix `/api/uks`:

| Method   | Endpoint             | Deskripsi                                                                    |
| :------- | :------------------- | :--------------------------------------------------------------------------- |
| `GET`    | `/api/uks/kasus`     | Mengambil daftar kasus/pasien (Dukungan filter tanggal, kelas, pencarian)    |
| `POST`   | `/api/uks/kasus`     | Menambahkan catatan kasus pasien baru                                        |
| `DELETE` | `/api/uks/kasus/:id` | Menghapus (soft delete) catatan kasus pasien berdasarkan ID                  |
| `GET`    | `/api/uks/rekap`     | Mengambil data rekapitulasi jumlah kunjungan per kelas                       |
| `GET`    | `/api/uks/stats`     | Mengambil statistik ringkasan (Total Pasien, Hari Ini, Kasus Terbanyak, dll) |
| `GET`    | `/api/uks/kategori`  | Mengambil master daftar kategori penyakit/keluhan                            |

---

## 📄 Lisensi

Project ini dikembangkan untuk kebutuhan manajemen Usaha Kesehatan Sekolah (UKS) & Palang Merah Remaja (PMR).
