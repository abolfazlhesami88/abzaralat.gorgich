#!/bin/bash
set -e
cd /root/toolstore

DC="docker compose"
$DC version &>/dev/null || DC="docker-compose"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
BACKUP_DIR="/root/toolstore-backups"
mkdir -p "$BACKUP_DIR"

echo "=== گرفتن بک‌آپ از نسخه فعلی (کد + عکس‌ها) ==="
STAMP=$(date +%Y%m%d-%H%M%S)
tar --exclude='node_modules' --exclude='.git' -czf "$BACKUP_DIR/backup-$STAMP.tar.gz" .
ls -t "$BACKUP_DIR"/*.tar.gz | tail -n +6 | xargs -r rm  # فقط ۵ بک‌آپ آخر نگه دار

echo "=== دریافت دقیق آخرین نسخه از گیت‌هاب (بدون merge conflict) ==="
git fetch origin
git reset --hard origin/$BRANCH

echo "=== بیلد و اجرا ==="
if $DC up -d --build; then
  sleep 5
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/adminsite)
  if [ "$CODE" == "200" ]; then
    echo "✅ دیپلوی موفق بود. پنل ادمین سالمه (HTTP $CODE)."
  else
    echo "⚠️ پنل ادمین جواب نداد (HTTP $CODE) — بازگشت به بک‌آپ..."
    tar -xzf "$BACKUP_DIR/backup-$STAMP.tar.gz" -C .
    $DC up -d --build
    echo "↩️ به نسخه سالم قبلی برگشتیم."
  fi
else
  echo "❌ بیلد fail شد — بازگشت به بک‌آپ..."
  tar -xzf "$BACKUP_DIR/backup-$STAMP.tar.gz" -C .
  $DC up -d --build
  echo "↩️ به نسخه سالم قبلی برگشتیم."
fi
