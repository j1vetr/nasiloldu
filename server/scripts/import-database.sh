#!/bin/bash
# Database Import Script
# Kullanım: bash server/scripts/import-database.sh database_backup_YYYYMMDD_HHMMSS.sql

if [ -z "$1" ]; then
    echo "❌ Kullanım: bash server/scripts/import-database.sh <backup_file.sql>"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Dosya bulunamadı: $BACKUP_FILE"
    exit 1
fi

echo "🗄️  Database import başlıyor..."
echo "📂 Backup dosyası: $BACKUP_FILE"

# Environment variables'ı yükle
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# UYARI
echo ""
echo "⚠️  DİKKAT: Bu işlem mevcut production database'i SİLECEK!"
echo "⚠️  Database URL: $DATABASE_URL"
echo ""
read -p "Devam etmek istediğinizden emin misiniz? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ İşlem iptal edildi."
    exit 0
fi

# Database'i drop ve yeniden oluştur (temiz import için)
echo "🔄 Mevcut database temizleniyor..."
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Import
echo "📥 Import ediliyor..."
psql $DATABASE_URL < $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Database başarıyla import edildi!"
    echo ""
    echo "🔍 Kontrol edin:"
    echo "   psql $DATABASE_URL -c 'SELECT COUNT(*) FROM persons;'"
else
    echo "❌ Import başarısız!"
    exit 1
fi
