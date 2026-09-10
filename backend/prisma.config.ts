import { defineConfig, env } from "prisma/config";
import { config as loadEnv } from "dotenv";
import { describeConnection, parseDatabaseUrl, toPrismaCliUrl } from "./prisma/db-url";

// Prisma 7 no longer auto-loads .env — load it here so local development
// (running prisma outside Docker) works. Existing env vars (e.g. injected by
// docker-compose) are NOT overwritten by dotenv (override defaults to false).
//
// Note: `quiet` is intentionally NOT passed — it only exists in dotenv >= 17,
// while the resolved dependency here is dotenv 16.x (pinned by @nestjs/config),
// whose config() prints nothing to begin with.
loadEnv();

// Satu DATABASE_URL dipakai dua driver dengan ekspektasi berbeda: schema engine
// Prisma hanya mau `mysql://` + `?sslaccept=...`, sedangkan adapter mariadb di
// runtime hanya bisa mem-parse `mariadb://` dan minta TLS sebagai options
// object. prisma/db-url.ts mem-parse sekali lalu membentuk ulang sesuai
// kebutuhan tiap sisi, jadi nilai yang sama jalan untuk MySQL/MariaDB lokal
// maupun TiDB Cloud (TLS otomatis aktif karena TiDB menolak koneksi plaintext).
const connection = parseDatabaseUrl(env("DATABASE_URL"));
const shadowConnection = process.env.SHADOW_DATABASE_URL
  ? parseDatabaseUrl(process.env.SHADOW_DATABASE_URL)
  : undefined;

// Sebutkan database mana yang disentuh (lokal atau TiDB); password tidak ditampilkan.
console.error(`[prisma] ${describeConnection(connection)}`);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: toPrismaCliUrl(connection),
    // Hanya dibutuhkan `prisma migrate dev` di MySQL/TiDB: schema engine membuat
    // shadow database sementara, yang butuh privilege CREATE DATABASE.
    ...(shadowConnection ? { shadowDatabaseUrl: toPrismaCliUrl(shadowConnection) } : {}),
  },
  migrations: {
    seed: "bun run prisma/seed.ts",
  },
});
