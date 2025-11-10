# Supabase Project Migration Guide

This guide explains how to migrate data from one Supabase project to another using terminal commands.

## Prerequisites

Make sure you have PostgreSQL tools installed:

```bash
# For macOS
brew install postgresql

# For Ubuntu/Debian
sudo apt-get install postgresql-client
```

## Method 1: Quick Migration (Recommended)

Use the automated script:

```bash
chmod +x migrate-supabase.sh
./migrate-supabase.sh
```

You'll need your connection strings from both projects:
- Go to Supabase Dashboard → Settings → Database → Connection string (URI format)
- The format looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Method 2: Manual Migration (More Control)

### Step 1: Export from Source Project

```bash
# Set your source connection string
SOURCE_DB="postgresql://postgres:[PASSWORD]@db.[SOURCE-REF].supabase.co:5432/postgres"

# Export all data (excluding Supabase system schemas)
pg_dump "$SOURCE_DB" \
  --format=custom \
  --no-owner \
  --no-acl \
  --exclude-schema=auth \
  --exclude-schema=storage \
  --exclude-schema=realtime \
  --exclude-schema=extensions \
  --file=backup.dump
```

### Step 2: Import to Destination Project

```bash
# Set your destination connection string
DEST_DB="postgresql://postgres:[PASSWORD]@db.[DEST-REF].supabase.co:5432/postgres"

# Import data
pg_restore \
  --dbname="$DEST_DB" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  backup.dump
```

## Method 3: Export Specific Tables Only

If you only want to migrate specific tables:

```bash
# Export specific tables
pg_dump "$SOURCE_DB" \
  --format=custom \
  --no-owner \
  --no-acl \
  --table=public.users \
  --table=public.contact_submissions \
  --table=public.verification_codes \
  --file=tables-only.dump

# Import
pg_restore \
  --dbname="$DEST_DB" \
  --no-owner \
  --no-acl \
  tables-only.dump
```

## Method 4: SQL Export (Plain Text)

If you prefer a readable SQL file:

```bash
# Export as SQL
pg_dump "$SOURCE_DB" \
  --format=plain \
  --no-owner \
  --no-acl \
  --exclude-schema=auth \
  --exclude-schema=storage \
  --exclude-schema=realtime \
  --exclude-schema=extensions \
  --file=backup.sql

# Import SQL
psql "$DEST_DB" -f backup.sql
```

## Important Notes

1. **Auth Users**: The `auth` schema is excluded because Supabase manages it. You'll need to:
   - Export auth.users separately if needed
   - Consider having users re-register, or
   - Use Supabase's built-in user export/import features

2. **RLS Policies**: Row Level Security policies will be included in the dump. Make sure they're compatible with your new project.

3. **Storage**: Files in Supabase Storage are not included. You'll need to migrate those separately using Supabase's Storage API.

4. **Environment Variables**: After migration, update your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[NEW-PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[NEW-ANON-KEY]
   SUPABASE_SERVICE_ROLE_KEY=[NEW-SERVICE-KEY]
   ```

## Troubleshooting

### Permission Errors
If you get permission errors, try adding `--no-privileges`:
```bash
pg_dump "$SOURCE_DB" --no-privileges --file=backup.dump
```

### Connection Issues
Make sure your IP is allowed in both projects:
- Supabase Dashboard → Settings → Database → Connection pooling
- Check "SSL Mode" is set appropriately

### Large Databases
For very large databases, use compression:
```bash
pg_dump "$SOURCE_DB" --format=custom --compress=9 --file=backup.dump
```

## Verification

After migration, verify your data:

```bash
# Connect to new database
psql "$DEST_DB"

# Check table counts
SELECT schemaname, tablename, n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

## Rollback

If something goes wrong, you can always restore from your backup:
```bash
pg_restore --dbname="$SOURCE_DB" --clean backup.dump
```

## Next Steps

1. Test your application with the new database
2. Update all environment variables in Vercel/deployment platform
3. Test authentication flows
4. Verify all data integrity
5. Update any API keys or webhooks
6. Keep the old project active for a few days as backup

