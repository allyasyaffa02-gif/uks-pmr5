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
│   └── tsconfig.json
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
│   └── vite.config.ts
│
└── README.md                 # Dokumentasi Project
```

---

## ⚡ Prasyarat Sistem

Sebelum menjalankan project, pastikan perangkat Anda telah terinstall:
- **Node.js** (v18+) atau **Bun** (v1.0+)
- **MySQL** atau **MariaDB Server**
- Database kosong yang sudah dibuat (misal: `uks_db`)

---

## 🚀 Cara Menjalankan Project

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
   DATABASE_URL="mysql://root:password_database_anda@localhost:3306/uks_db"
   PORT=3000
   ```
   *(Sesuaikan user, password, host, port, dan nama database MariaDB/MySQL Anda)*.

4. **Generate Prisma Client & Jalankan Migrasi Database:**
   ```bash
   # Generate Client
   npx prisma generate

   # Jalankan Migrasi ke Database
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
   Buat file `.env` di dalam folder `frontend/` (opsional, jika ingin mengubah URL Backend):
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Jalankan Development Server Frontend:**
   Dengan Bun:
   ```bash
   bun dev
   ```
   Dengan npm:
   ```bash
   npm run dev
   ```
   Aplikasi Frontend akan dapat diakses di browser pada alamat **`http://localhost:5173`** (atau port yang ditampilkan Vite di terminal).

---

## 📡 Ringkasan API Endpoints (Backend)

Semua endpoint backend berpusat pada prefix `/api/uks`:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/uks/kasus` | Mengambil daftar kasus/pasien (Dukungan filter tanggal, kelas, pencarian) |
| `POST` | `/api/uks/kasus` | Menambahkan catatan kasus pasien baru |
| `DELETE` | `/api/uks/kasus/:id` | Menghapus (soft delete) catatan kasus pasien berdasarkan ID |
| `GET` | `/api/uks/rekap` | Mengambil data rekapitulasi jumlah kunjungan per kelas |
| `GET` | `/api/uks/stats` | Mengambil statistik ringkasan (Total Pasien, Hari Ini, Kasus Terbanyak, dll) |
| `GET` | `/api/uks/kategori` | Mengambil master daftar kategori penyakit/keluhan |

---

## 📄 Lisensi

Project ini dikembangkan untuk kebutuhan manajemen Usaha Kesehatan Sekolah (UKS) & Palang Merah Remaja (PMR).
