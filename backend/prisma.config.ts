import { defineConfig, env } from "prisma/config";

// Prisma migrate requires mysql:// scheme, but the mariadb driver adapter
// uses mariadb:// at runtime. We normalise here so both work correctly.
const rawUrl = env("DATABASE_URL");
const migrateUrl = rawUrl.replace(/^mariadb:\/\//, "mysql://");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: migrateUrl,
  },
  migrations: {
    seed: "bun run prisma/seed.ts",
  },
});
