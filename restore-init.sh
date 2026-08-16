#!/bin/sh
set -e

if [ -f /docker-entrypoint-initdb.d/toolstore_backup.dump ]; then
    echo "=== Auto-restoring database from toolstore_backup.dump ==="
    pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists /docker-entrypoint-initdb.d/toolstore_backup.dump || true
    echo "=== Database auto-restore completed! ==="
fi
