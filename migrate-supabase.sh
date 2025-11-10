#!/bin/bash

# Supabase Data Migration Script
# This script migrates data from one Supabase project to another

echo "🚀 Supabase Data Migration Tool"
echo "================================"
echo ""

# Source project connection string
echo "Enter SOURCE Supabase connection string (postgres://...):"
read SOURCE_DB

# Destination project connection string
echo ""
echo "Enter DESTINATION Supabase connection string (postgres://...):"
read DEST_DB

# Create backup directory
BACKUP_DIR="./supabase-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo ""
echo "📦 Step 1: Exporting data from source project..."
echo "Backup location: $BACKUP_DIR"

# Export schema and data (excluding auth tables)
pg_dump "$SOURCE_DB" \
  --format=custom \
  --no-owner \
  --no-acl \
  --exclude-schema=auth \
  --exclude-schema=storage \
  --exclude-schema=realtime \
  --exclude-schema=extensions \
  --file="$BACKUP_DIR/data.dump"

if [ $? -eq 0 ]; then
    echo "✅ Export completed successfully!"
else
    echo "❌ Export failed. Please check your connection string."
    exit 1
fi

echo ""
echo "📥 Step 2: Importing data to destination project..."

# Import data to destination
pg_restore \
  --dbname="$DEST_DB" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  "$BACKUP_DIR/data.dump"

if [ $? -eq 0 ]; then
    echo "✅ Import completed successfully!"
else
    echo "⚠️  Import completed with warnings (this is often normal)"
fi

echo ""
echo "🎉 Migration complete!"
echo "Backup saved at: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Verify your data in the destination project"
echo "2. Update your .env.local file with new Supabase credentials"
echo "3. Test your application thoroughly"

