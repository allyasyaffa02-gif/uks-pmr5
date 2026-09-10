#!/bin/sh
set -e

# Parse DATABASE_URL -> host & port
# Format: scheme://user:pass@host:port/dbname?opts  (scheme mysql|mariadb|tidb,
# lihat prisma/db-url.ts). Query string dibuang lebih dulu agar port tidak
# ikut terbaca ketika URL tidak memakai path, mis. .../host:4000?sslaccept=strict
DB_HOSTPORT=${DATABASE_URL#*://}
DB_HOSTPORT=${DB_HOSTPORT#*@}
DB_HOSTPORT=${DB_HOSTPORT%%\?*}
DB_HOSTPORT=${DB_HOSTPORT%%/*}
DB_HOST=${DB_HOSTPORT%%:*}
DB_PORT=${DB_HOSTPORT##*:}
if [ "$DB_PORT" = "$DB_HOSTPORT" ]; then
  DB_PORT=3306
fi

echo "Waiting for database $DB_HOST:$DB_PORT ..."
tries=0
until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  tries=$((tries + 1))
  if [ "$tries" -ge 60 ]; then
    echo "Database $DB_HOST:$DB_PORT not reachable after 5 minutes. Aborting."
    exit 1
  fi
  sleep 5
done
echo "Database reachable ($DB_HOST:$DB_PORT)"

echo "Running Prisma migrations..."
bunx prisma migrate deploy

echo "Starting NestJS backend..."
exec node dist/src/main
