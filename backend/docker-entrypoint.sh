#!/bin/sh
set -e

echo "⏳ Running Prisma migrations..."
bunx prisma migrate deploy

echo "🚀 Starting NestJS backend..."
exec node dist/src/main

