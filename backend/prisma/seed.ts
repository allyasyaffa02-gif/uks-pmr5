/**
 * Seed idempotent: memastikan baris `master_kategori` yang dipakai aplikasi
 * ada ("Saat Upacara" | "Hari Biasa", lihat src/modules/uks/dto/create-kasus.dto.ts).
 *
 * Jalan di database mana pun yang ditunjuk DATABASE_URL - MySQL/MariaDB lokal
 * maupun TiDB Cloud - karena URL-nya diparse lewat prisma/db-url.ts (scheme
 * apa pun + TLS untuk TiDB). Dijalankan otomatis di akhir `prisma migrate dev`,
 * atau manual dengan `bun run prisma/seed.ts`.
 *
 * Catatan: seed ini untuk dijalankan dari host (dev). Di image production,
 * `src/generated` tidak ikut di-copy (client ada di `dist/src/generated`), dan
 * entrypoint container hanya memakai `migrate deploy` yang memang tidak
 * menjalankan seed.
 */
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";
import { PrismaClient } from "../src/generated/prisma";
import { describeConnection, requireDatabaseConnection, toMariadbPoolOptions } from "./db-url";

const DEFAULT_KATEGORI = ["Saat Upacara", "Hari Biasa"];

async function main() {
  const connection = requireDatabaseConnection();
  console.log(`[seed] ${describeConnection(connection)}`);

  const pool = mariadb.createPool(toMariadbPoolOptions(connection) as any);
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(pool as any) });

  try {
    for (const name of DEFAULT_KATEGORI) {
      const existing = await prisma.masterKategori.findFirst({ where: { name } });
      if (existing) {
        console.log(`[seed] kategori "${name}" sudah ada (id ${existing.id})`);
        continue;
      }
      const created = await prisma.masterKategori.create({ data: { name } });
      console.log(`[seed] kategori "${name}" dibuat (id ${created.id})`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[seed] gagal:", error);
  process.exit(1);
});
