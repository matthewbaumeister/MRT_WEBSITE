#!/bin/bash

# Army Innovation Tables Migration Script

SOURCE_DB="postgresql://postgres.reprsoqodhmpdoiajhst:SN!ckers1!1770856@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
DEST_DB="postgresql://postgres.tclrwjccjnxjrlwrypec:SN!ckers1!1770856@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
PG_DUMP="/opt/homebrew/opt/postgresql@17/bin/pg_dump"
PSQL="/opt/homebrew/opt/postgresql@17/bin/psql"

# Tables to migrate
TABLES=(
  "active_army_innovation_opportunities"
  "army_innovation_competition_stats"
  "army_innovation_documents"
  "army_innovation_finalists_with_details"
  "army_innovation_opportunities"
  "army_innovation_phase_progress"
  "army_innovation_prize_summary"
  "army_innovation_programs"
  "army_innovation_scraper_log"
  "army_innovation_submissions"
  "army_innovation_upcoming_deadlines"
  "army_innovation_winners_with_details"
)

BACKUP_DIR="./army-migration-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "=========================================="
echo "Army Innovation Tables Migration"
echo "=========================================="
echo "Source: reprsoqodhmpdoiajhst"
echo "Destination: tclrwjccjnxjrlwrypec"
echo "Tables to migrate: ${#TABLES[@]}"
echo "Backup directory: $BACKUP_DIR"
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0

for TABLE in "${TABLES[@]}"; do
    echo "=========================================="
    echo "Migrating: $TABLE"
    echo "=========================================="
    
    BACKUP_FILE="$BACKUP_DIR/${TABLE}.sql"
    
    # Export table
    echo "Exporting..."
    $PG_DUMP "$SOURCE_DB" \
        --table=public.$TABLE \
        --no-owner \
        --no-acl \
        --file="$BACKUP_FILE" 2>&1
    
    if [ $? -eq 0 ]; then
        echo "Export successful!"
        
        # Get file size
        SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
        echo "Backup size: $SIZE"
        
        # Import to destination
        echo "Importing..."
        $PSQL "$DEST_DB" -f "$BACKUP_FILE" > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "Import successful!"
            
            # Verify row count
            SOURCE_COUNT=$($PSQL "$SOURCE_DB" -t -c "SELECT COUNT(*) FROM $TABLE" 2>/dev/null | tr -d ' ')
            DEST_COUNT=$($PSQL "$DEST_DB" -t -c "SELECT COUNT(*) FROM $TABLE" 2>/dev/null | tr -d ' ')
            
            echo "Row count - Source: $SOURCE_COUNT, Destination: $DEST_COUNT"
            
            if [ "$SOURCE_COUNT" = "$DEST_COUNT" ]; then
                echo "Verification: PASSED"
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            else
                echo "Verification: WARNING - Row counts don't match"
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            fi
        else
            echo "Import failed!"
            FAIL_COUNT=$((FAIL_COUNT + 1))
        fi
    else
        echo "Export failed!"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    echo ""
done

echo "=========================================="
echo "Migration Summary"
echo "=========================================="
echo "Total tables: ${#TABLES[@]}"
echo "Successful: $SUCCESS_COUNT"
echo "Failed: $FAIL_COUNT"
echo "Backups saved in: $BACKUP_DIR"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "All migrations completed successfully!"
else
    echo "Some migrations failed. Check the output above for details."
fi

