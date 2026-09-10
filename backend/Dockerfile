# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDeps for build + prisma generate)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and generate Prisma client
COPY . .
# DATABASE_URL is required by prisma.config.ts to load, even during generate.
# This dummy value is only used at build time — real value comes from Docker Compose at runtime.
RUN DATABASE_URL="mariadb://dummy:dummy@localhost:3306/dummy" bunx prisma generate

# Build NestJS — outputs to ./dist
RUN bun run build

# Verify dist was created
RUN ls -la dist/

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only install production dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy built output and Prisma files from builder
COPY --from=builder /app/dist ./dist
# Generated Prisma client must be at dist/src/generated/prisma (mirrors the compiled import path)
COPY --from=builder /app/src/generated ./dist/src/generated
# Copy Prisma CLI from builder so migrate deploy works without it being a prod dep
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY prisma ./prisma
COPY prisma.config.ts ./

# Verify dist/src/main.js exists in runner
RUN ls -la dist/src/ && test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found!" && exit 1)

# Entrypoint script handles migration then starts the app
COPY docker-entrypoint.sh ./
# Strip Windows carriage returns (\r) in case file was edited on Windows
RUN sed -i 's/\r//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]

