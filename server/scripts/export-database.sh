#!/bin/bash
# Database Export Script
# Kullanım: bash server/scripts/export-database.sh

echo "🗄️  Database export başlıyor..."

# Environment variables'ı yükle
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Timestamp için
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="database_backup_${TIMESTAMP}.sql"

# pg_dump ile backup al
pg_dump $DATABASE_URL > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Database başarıyla export edildi: $BACKUP_FILE"
    echo "📦 Dosya boyutu: $(ls -lh $BACKUP_FILE | awk '{print $5}')"
    echo ""
    echo "📤 Şimdi bu dosyayı production sunucusuna kopyalayın:"
    echo "   scp $BACKUP_FILE user@your-server:/path/to/backup/"
else
    echo "❌ Export başarısız!"
    exit 1
fi
