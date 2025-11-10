# MATRIX SQL Setup - Correct Order

## Important: Run in This Order!

The Matrix database tables have dependencies. You **must** run the SQL files in this specific order:

### Step 1: Base Matrix Tables (Required First)
**File**: `SUPABASE_MATRIX_TABLES.sql`

This creates:
- `matrix_conversations` table
- `matrix_messages` table
- Base indexes
- Row Level Security policies
- Timestamp triggers

**Run this FIRST** - everything else depends on these tables.

### Step 2: Projects Feature (Optional, but recommended)
**File**: `SUPABASE_MATRIX_PROJECTS.sql`

This creates:
- `matrix_projects` table
- Adds `project_id` column to `matrix_conversations`
- Project indexes
- Project RLS policies
- Project timestamp triggers

**Only run this AFTER Step 1** - it references `matrix_conversations`.

## How to Run

1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy contents of `SUPABASE_MATRIX_TABLES.sql`
5. Paste into editor
6. Click "Run" button
7. Wait for "Success" message
8. Repeat steps 3-7 for `SUPABASE_MATRIX_PROJECTS.sql`

## Error Resolution

### "relation 'matrix_conversations' does not exist"
**Problem**: You tried to run SUPABASE_MATRIX_PROJECTS.sql before SUPABASE_MATRIX_TABLES.sql

**Solution**: 
1. Run SUPABASE_MATRIX_TABLES.sql first
2. Then run SUPABASE_MATRIX_PROJECTS.sql

### "column 'project_id' already exists"
**Problem**: You've already run SUPABASE_MATRIX_PROJECTS.sql before

**Solution**: Skip this file, it's already set up

### Other errors
Check that you have:
- `users` table exists (should already be set up for your site)
- `uuid_generate_v4()` function enabled (usually default in Supabase)

## Verification

After running both files, verify the tables exist:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'matrix%';

-- Should show:
-- matrix_conversations
-- matrix_messages
-- matrix_projects
```

## What Each Table Does

### matrix_conversations
Stores individual chat sessions per user

### matrix_messages
Stores individual messages within conversations (user & assistant messages)

### matrix_projects
Stores user-created projects for organizing chats

## Current Status

Based on your error, you need to:
1. ✅ Run `SUPABASE_MATRIX_TABLES.sql` (do this first)
2. ✅ Run `SUPABASE_MATRIX_PROJECTS.sql` (do this second)

The code is deployed and ready - just needs the database tables!

