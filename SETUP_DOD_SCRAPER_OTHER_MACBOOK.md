# DOD Tech Scraper - Setup on Another MacBook

## Overview

This guide shows you how to set up the DOD tech scraper on another MacBook. The scraper will:
- Write to the **same `fpds_contracts` table** as your full FPDS scraper
- Add tech classification fields (compatible with existing schema)
- Pre-filter for DOD + tech (85% faster than full scraping)
- Work seamlessly when you later add full FPDS data

---

## Step 1: Copy Files to Other MacBook

### Option A: Git (Recommended)

```bash
# On current MacBook - commit and push
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
git add lib/dod-tech-scraper.ts lib/tech-naics-classifier.ts lib/fpds-data-cleaner.ts
git add scripts/dod-tech-daily-scraper.ts
git add ADD_TECH_CLASSIFICATION_TO_FPDS.sql
git add DOD_TECH_SCRAPER_*.md SETUP_*.md
git commit -m "Add DOD tech scraper with FPDS table compatibility"
git push

# On other MacBook - pull
cd /path/to/MRT_WEBSITE
git pull
```

### Option B: Manual Copy

Copy these files to the other MacBook:

```
MRT_WEBSITE/
├── lib/
│   ├── fpds-data-cleaner.ts
│   ├── tech-naics-classifier.ts
│   └── dod-tech-scraper.ts
├── scripts/
│   └── dod-tech-daily-scraper.ts
└── ADD_TECH_CLASSIFICATION_TO_FPDS.sql
```

---

## Step 2: Setup Database (Run in Supabase)

### 2.1: Create Base FPDS Tables (if not already created)

If you haven't run the full FPDS schema yet, you need to create it first. Copy the schema from PropShop AI:

```sql
-- Copy from: PropShop_AI_Website/supabase/migrations/create_fpds_tables.sql
-- Run in Supabase SQL Editor
```

This creates:
- `fpds_contracts` (main table)
- `fpds_scraper_log` (progress tracking)
- `fpds_company_stats`, `fpds_naics_stats`, etc. (aggregations)

### 2.2: Add Tech Classification Columns

In Supabase SQL Editor, copy and run the entire contents of:

```
ADD_TECH_CLASSIFICATION_TO_FPDS.sql
```

This adds to `fpds_contracts`:
- `is_tech_contract` (BOOLEAN)
- `tech_confidence` (VARCHAR: 'high', 'medium', 'low')
- `tech_categories` (TEXT: 'software_it, ai_data, cybersecurity', etc.)
- `tech_classification_reasons` (TEXT: explanation)
- `sam_gov_opportunity_url` (TEXT: link to SAM.gov)

**Important**: These are **nullable fields** that won't break existing data or the full FPDS scraper.

### 2.3: Create Progress Tracking Tables (if not already created)

```sql
-- Page-level progress tracking
CREATE TABLE IF NOT EXISTS fpds_page_progress (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  page_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  contracts_found INTEGER DEFAULT 0,
  contracts_inserted INTEGER DEFAULT 0,
  contracts_failed INTEGER DEFAULT 0,
  error_message TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(date, page_number)
);

CREATE INDEX IF NOT EXISTS idx_fpds_page_progress_date ON fpds_page_progress(date);
CREATE INDEX IF NOT EXISTS idx_fpds_page_progress_status ON fpds_page_progress(status);

-- Failed contracts logging (for retry)
CREATE TABLE IF NOT EXISTS fpds_failed_contracts (
  id SERIAL PRIMARY KEY,
  contract_id TEXT NOT NULL,
  error_message TEXT,
  error_type TEXT, -- 'details_fetch_failed', 'enrichment_error', etc.
  date_range TEXT,
  page_number INTEGER,
  attempt_count INTEGER DEFAULT 1,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_fpds_failed_contracts_contract_id ON fpds_failed_contracts(contract_id);
CREATE INDEX IF NOT EXISTS idx_fpds_failed_contracts_resolved ON fpds_failed_contracts(resolved);
CREATE INDEX IF NOT EXISTS idx_fpds_failed_contracts_date_range ON fpds_failed_contracts(date_range);

-- Grant permissions
GRANT ALL ON fpds_page_progress TO service_role;
GRANT ALL ON fpds_failed_contracts TO service_role;
```

---

## Step 3: Environment Setup on Other MacBook

### 3.1: Install Dependencies

```bash
cd /path/to/MRT_WEBSITE

# Install Node.js if needed
# brew install node

# Install dependencies
npm install

# Verify packages
npm list @supabase/supabase-js dotenv tsx
```

### 3.2: Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_mrt_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_mrt_service_role_key
```

**Critical**: Use MRT Supabase credentials (not PropShop AI)

---

## Step 4: Test the Scraper

### 4.1: Quick Test (1-2 minutes)

```bash
npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10
```

You should see:
```
================================================================================
DOD TECH CONTRACTS DAILY SCRAPER
================================================================================
Scraping Department of Defense contracts for technology companies
Pre-filtered for:
  - DOD agencies (Army, Navy, Air Force, etc.)
  - Tech NAICS codes (Software, IT, R&D, etc.)
  - Minimum contract value: $100,000
================================================================================

[timestamp] [DOD Tech Daily] [2025-11-10:P1] Found 87 DOD tech contracts
[timestamp] [DOD Tech Daily] [2025-11-10:P1] Fetched 87/87 details
[timestamp] [DOD Tech Daily] [2025-11-10:P1] Quality: 94.2/100
[timestamp] [DOD Tech Daily] [2025-11-10:P1] New: 87 | Updated: 0 | Errors: 0

SCRAPE SUMMARY
================================================================================
Total Inserted: 87
Database Growth: 87
================================================================================
```

### 4.2: Verify in Supabase

```sql
-- Check contracts scraped
SELECT * FROM fpds_contracts 
WHERE is_tech_contract = TRUE
ORDER BY date_signed DESC 
LIMIT 10;

-- Check tech categories
SELECT tech_categories, COUNT(*) 
FROM fpds_contracts 
WHERE is_tech_contract = TRUE
GROUP BY tech_categories;

-- Check DOD agencies
SELECT contracting_agency_name, COUNT(*) 
FROM fpds_contracts 
WHERE is_tech_contract = TRUE
GROUP BY contracting_agency_name
ORDER BY COUNT(*) DESC;
```

### 4.3: Verify Tech Classification

```sql
-- High-confidence tech contracts
SELECT 
  vendor_name,
  tech_categories,
  tech_confidence,
  current_total_value_of_award,
  contracting_agency_name
FROM fpds_contracts
WHERE is_tech_contract = TRUE
  AND tech_confidence = 'high'
ORDER BY current_total_value_of_award DESC
LIMIT 20;
```

---

## Step 5: Long-Running Operation

### Option 1: tmux Session (like your current FPDS scraper)

```bash
# Start new tmux session
tmux new -s dod-tech-scraper

# Inside tmux, run for many days
npx tsx scripts/dod-tech-daily-scraper.ts --days=365

# Detach: Ctrl+B, then D

# Check progress later
tmux attach -t dod-tech-scraper

# View logs while attached
# You'll see real-time progress

# Kill session when done
tmux kill-session -t dod-tech-scraper
```

### Option 2: Cron Job (automated daily)

```bash
# Create logs directory
mkdir -p /path/to/MRT_WEBSITE/logs

# Edit crontab
crontab -e

# Add daily scraper at 6 AM
0 6 * * * cd /path/to/MRT_WEBSITE && npx tsx scripts/dod-tech-daily-scraper.ts >> logs/dod-scraper-$(date +\%Y\%m\%d).log 2>&1
```

### Option 3: Run Last 30 Days Then Daily

```bash
# Backfill last 30 days
npx tsx scripts/dod-tech-daily-scraper.ts --days=30

# Then set up cron for daily updates
```

---

## How It Works with Full FPDS Scraper

### Data Compatibility

Both scrapers write to `fpds_contracts`:

| Field | DOD Tech Scraper | Full FPDS Scraper |
|-------|-----------------|-------------------|
| All base fields | ✅ Filled | ✅ Filled |
| `is_tech_contract` | ✅ TRUE/FALSE | NULL (optional) |
| `tech_categories` | ✅ Filled | NULL (optional) |
| `tech_confidence` | ✅ Filled | NULL (optional) |

### No Conflicts

- Same `transaction_number` = upsert (updates existing record)
- Different `transaction_number` = insert (adds new record)
- DOD tech scraper adds tech classification
- Full FPDS scraper leaves tech fields NULL

### When Full FPDS Scraper Runs

1. **New contracts**: Full FPDS adds them (tech fields NULL)
2. **Duplicate contracts**: Full FPDS updates them (preserves tech fields if already set)
3. **Tech classification**: Can be added later via batch update

### Batch Classify Existing FPDS Data

If you want to tech-classify existing FPDS data:

```typescript
// Create scripts/batch-classify-tech.ts
import { classifyTechContract } from '../lib/tech-naics-classifier';
import { supabase } from '../lib/supabase';

// Fetch all contracts without tech classification
const { data } = await supabase
  .from('fpds_contracts')
  .select('*')
  .is('is_tech_contract', null)
  .limit(1000);

// Classify each
for (const contract of data) {
  const classification = classifyTechContract(contract);
  
  if (classification.isTech) {
    await supabase
      .from('fpds_contracts')
      .update({
        is_tech_contract: true,
        tech_confidence: classification.confidence,
        tech_categories: classification.categories.join(', '),
        tech_classification_reasons: classification.reasons.join('; ')
      })
      .eq('id', contract.id);
  }
}
```

---

## Monitoring

### Check Progress

```sql
-- Today's scraping
SELECT date, MAX(page_number) as pages, SUM(contracts_inserted) as inserted
FROM fpds_page_progress
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date
ORDER BY date DESC;

-- Total DOD tech contracts
SELECT 
  COUNT(*) as total_contracts,
  SUM(current_total_value_of_award) as total_value,
  COUNT(DISTINCT vendor_name) as unique_vendors
FROM fpds_contracts
WHERE is_tech_contract = TRUE;

-- Failed contracts
SELECT COUNT(*) as failed_count
FROM fpds_failed_contracts
WHERE resolved = FALSE;
```

### Check Scraper Status

```bash
# If running in tmux
tmux attach -t dod-tech-scraper

# View logs
tail -f /path/to/MRT_WEBSITE/logs/dod-scraper.log
```

---

## Troubleshooting

### "Cannot find module"

```bash
# Install dependencies
cd /path/to/MRT_WEBSITE
npm install
```

### "Supabase connection failed"

Check `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` correct?
- `SUPABASE_SERVICE_ROLE_KEY` correct?
- Using **MRT credentials** (not PropShop AI)?

### "Table fpds_contracts does not exist"

Run Step 2.1 - create base FPDS tables first.

### "Column is_tech_contract does not exist"

Run Step 2.2 - add tech classification columns.

---

## Summary

### What You Get

1. **Pre-filtered scraper**: Only DOD + tech contracts
2. **85% faster**: ~200-800 contracts/day vs ~6,000
3. **Tech classification**: Auto-categorized (AI, cyber, cloud, etc.)
4. **Same table**: Compatible with full FPDS scraper
5. **All resilience**: 20 retries, progress tracking, resume capability

### Workflow

```
Other MacBook (DOD Tech Scraper)
    ↓
  Filters: DOD agencies + tech NAICS codes
    ↓
  Writes to: fpds_contracts
    ↓
  Adds: tech classification fields
    ↓
  Result: 200-800 tech contracts/day

Later: Current MacBook (Full FPDS Scraper)
    ↓
  Filters: None (all federal contracts)
    ↓
  Writes to: fpds_contracts
    ↓
  Result: 6,000 contracts/day (includes DOD tech + everything else)
```

### Ready to Run

```bash
# Test
npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10

# Backfill 30 days
npx tsx scripts/dod-tech-daily-scraper.ts --days=30

# Long-running
tmux new -s dod-tech-scraper
npx tsx scripts/dod-tech-daily-scraper.ts --days=365
# Ctrl+B, D to detach
```

That's it! The scraper will run continuously with automatic retries, progress tracking, and resume capability - just like your current FPDS scraper.

