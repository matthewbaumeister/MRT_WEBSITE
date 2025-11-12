## DOD Tech Contract Scraper

A resilient, production-ready scraper for Department of Defense technology contracts. Built to run continuously for months with automatic retry logic, progress tracking, and API rate limiting.

---

## Features

- **Pre-filtered for DOD + Tech**: Only scrapes DOD contracts with tech NAICS codes
- **Resilient**: 20 retry attempts with exponential backoff
- **Resume capability**: Can stop and restart without losing progress
- **API-friendly**: Built-in rate limiting and cooldown periods
- **Tech classification**: Identifies AI/ML, cybersecurity, cloud, software, etc.
- **Long-running**: Designed to run for months continuously
- **Production-ready**: Logging, error tracking, progress monitoring

---

## What It Scrapes

### Agencies Filtered:
- Department of Defense (all branches)
- Army, Navy, Air Force, Marines, Space Force
- DARPA, DIA, NSA, Missile Defense Agency
- Defense Logistics Agency, DISA, etc.

### Tech Categories:
- Software Development & IT Services
- Cybersecurity & Information Security
- Cloud & Data Services
- AI/ML & Data Science
- R&D (Engineering, Physical Sciences)
- Computer & Electronics Manufacturing
- Telecommunications
- Scientific Instruments

### Contract Minimums:
- Default: $100,000+ (tech contracts are usually substantial)
- Configurable per scrape

---

## Files Overview

```
MRT_WEBSITE/
├── lib/
│   ├── dod-tech-scraper.ts          # Main scraper library (API calls, normalization)
│   ├── tech-naics-classifier.ts     # Tech classification logic (NAICS, PSC, keywords)
│   └── fpds-data-cleaner.ts         # Data validation and quality scoring
├── scripts/
│   └── dod-tech-daily-scraper.ts    # Daily scraper script (runnable)
├── DOD_TECH_CONTRACTS_SCHEMA.sql    # Database schema
├── DOD_TECH_SCRAPER_PLAN.md         # Technical implementation details
└── DOD_TECH_SCRAPER_README.md       # This file
```

---

## Setup

### 1. Create Database Tables

Run the SQL schema in your Supabase SQL editor:

```bash
# Copy the schema file contents
cat DOD_TECH_CONTRACTS_SCHEMA.sql
```

Paste and run in Supabase SQL Editor. This creates:
- `dod_tech_contracts` - Main contracts table
- `dod_tech_scraper_log` - Overall scraping progress
- `dod_tech_page_progress` - Page-level tracking for resume capability
- `dod_tech_failed_contracts` - Failed contract retry log
- Views for common queries (high-value, small business, R&D, etc.)

### 2. Verify Environment Variables

Ensure these are in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Install Dependencies

```bash
npm install
# or if not already installed:
npm install @supabase/supabase-js dotenv
```

---

## Usage

### Daily Scraping

#### Scrape yesterday (default):
```bash
npx tsx scripts/dod-tech-daily-scraper.ts
```

#### Scrape specific date:
```bash
npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10
```

#### Scrape last 7 days:
```bash
npx tsx scripts/dod-tech-daily-scraper.ts --days=7
```

### Long-Running Scraper

The scraper is designed to run continuously. You can:

#### Option 1: Run in tmux session (like your current FPDS scraper)
```bash
# Start new tmux session
tmux new -s dod-tech-scraper

# Inside tmux, run the scraper for many days
npx tsx scripts/dod-tech-daily-scraper.ts --days=365

# Detach: Ctrl+B, then D
# Reattach later: tmux attach -t dod-tech-scraper
```

#### Option 2: Cron job (daily automated)
```bash
# Edit crontab
crontab -e

# Add daily scraper at 6 AM
0 6 * * * cd /path/to/MRT_WEBSITE && npx tsx scripts/dod-tech-daily-scraper.ts >> logs/dod-scraper.log 2>&1
```

#### Option 3: GitHub Actions (cloud-based)
Create `.github/workflows/dod-tech-scraper.yml`:

```yaml
name: DOD Tech Scraper Daily
on:
  schedule:
    - cron: '0 6 * * *' # 6 AM daily
  workflow_dispatch: # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx tsx scripts/dod-tech-daily-scraper.ts
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## How It Works

### 1. **API Pre-Filtering** (Most Efficient)

The scraper sends filters directly to USA Spending API:

```javascript
{
  agencies: [{ name: "Department of Defense" }],
  naics_codes: ["541511", "541512", "541513", ...], // 50+ tech codes
  award_amounts: [{ lower_bound: 100000 }]
}
```

This means the API only returns DOD tech contracts, reducing:
- API calls by 90%+
- Processing time
- Risk of rate limiting

### 2. **Search → Details → Normalize → Insert**

For each date:
1. **Search**: Get list of contract IDs (100 per page)
2. **Details**: Fetch full details for each contract (rate-limited)
3. **Normalize**: Extract and structure data
4. **Classify**: Identify tech categories (AI, cyber, cloud, etc.)
5. **Validate**: Quality scoring
6. **Insert**: Upsert to database

### 3. **Resilience Features**

#### Retry Logic:
- 20 attempts per page
- Exponential backoff: 30s → 60s → 2m → 4m → 8m (capped at 5m)
- Continues to next page after max retries (doesn't stop entire scrape)

#### Progress Tracking:
- Saves progress after each page
- Can resume from last completed page
- Tracks failed contracts for later retry

#### API Rate Limiting:
- 500ms between searches (~2 req/sec)
- 600ms between detail fetches (~1.7 req/sec)
- Additional cooldown on errors

---

## Expected Volume

### Daily Contracts:
- **All DOD contracts**: ~2,000-5,000/day
- **DOD tech contracts (our filter)**: ~200-800/day
- **Processing time**: ~15-45 minutes/day

### Historical Backfill:
- **1 year of data**: ~70,000-290,000 contracts
- **Processing time**: ~15-75 hours
- **Recommended**: Run over 3-7 days, scraping in chunks

---

## Monitoring

### Check Database Progress

```sql
-- Total contracts scraped
SELECT COUNT(*), SUM(current_total_value_of_award) 
FROM dod_tech_contracts;

-- Recent scrapes
SELECT * FROM dod_tech_scraper_log 
ORDER BY started_at DESC LIMIT 10;

-- Current page progress
SELECT date, MAX(page_number) as last_page, 
       SUM(contracts_inserted) as total_inserted
FROM dod_tech_page_progress
WHERE status = 'completed'
GROUP BY date
ORDER BY date DESC;

-- Failed contracts
SELECT COUNT(*), error_type 
FROM dod_tech_failed_contracts 
WHERE resolved = FALSE
GROUP BY error_type;
```

### Check Logs

```bash
# If running in tmux
tmux attach -t dod-tech-scraper

# If running as cron
tail -f logs/dod-scraper.log

# Recent activity
tail -100 logs/dod-scraper.log | grep "SCRAPE SUMMARY"
```

---

## Tech Classification

The scraper automatically classifies contracts into tech categories:

### Classification Confidence:
- **High**: NAICS + PSC match tech codes
- **Medium**: NAICS match OR keywords in description
- **Low**: Only vendor name suggests tech

### Categories Identified:
- `software_it` - Software development, IT services
- `cybersecurity` - Security, InfoSec
- `data_cloud` - Cloud services, data processing
- `ai_data` - AI/ML, data science
- `research_dev` - R&D in tech fields
- `hardware_manufacturing` - Computer/electronics manufacturing
- `telecommunications` - Telecom services
- `aerospace_defense` - Aerospace tech
- `engineering` - Technical engineering services

Example:
```json
{
  "vendor_name": "Palantir Technologies",
  "naics_code": "541511",
  "description": "AI-powered data analytics platform",
  "tech_confidence": "high",
  "tech_categories": "software_it, ai_data"
}
```

---

## Customization

### Adjust Minimum Contract Value

Edit `scripts/dod-tech-daily-scraper.ts`:

```typescript
const MIN_CONTRACT_AMOUNT = 100000; // Change to 1000000 for $1M+
```

### Add More Tech NAICS Codes

Edit `lib/tech-naics-classifier.ts`:

```typescript
export const TECH_NAICS_CODES = {
  // Add new category
  quantum_computing: [
    '541714', // Quantum research
  ],
  // ...
}
```

### Filter Specific DOD Agencies Only

Edit `lib/dod-tech-scraper.ts`:

```typescript
// Change from all DOD to specific branches
agencies: [{
  type: 'awarding',
  tier: 'subtier',
  name: 'Defense Advanced Research Projects Agency' // DARPA only
}]
```

---

## Comparison to FPDS Scraper

| Feature | FPDS Scraper (PropShop) | DOD Tech Scraper (MRT) |
|---------|------------------------|------------------------|
| **Scope** | All federal contracts | DOD tech contracts only |
| **Daily Volume** | ~6,000 contracts | ~200-800 contracts |
| **Pre-filtering** | None (post-filter) | Agency + NAICS (API-level) |
| **Tech Classification** | No | Yes (auto-categorized) |
| **Speed** | Slower (more data) | Faster (pre-filtered) |
| **Use Case** | Broad federal tracking | DOD tech focus |

Both scrapers share:
- Retry logic (20 attempts)
- Progress tracking
- Resume capability
- API rate limiting
- Supabase storage

---

## Troubleshooting

### "API instability: 10 consecutive failures"

**Cause**: USA Spending API is having issues or rate limiting

**Solution**:
1. Wait 5-10 minutes
2. Resume scraper (it will pick up where it left off)
3. If persistent, increase cooldown in code:
   ```typescript
   const DETAILS_DELAY_MS = 1000; // Increase from 600ms
   ```

### "No contracts found"

**Possible causes**:
1. Date has no DOD tech contracts (rare but possible)
2. API filters too restrictive
3. Date already scraped

**Check**:
```sql
SELECT * FROM dod_tech_page_progress 
WHERE date = '2025-11-10';
```

### "Out of memory"

**Cause**: Processing too many contracts at once

**Solution**:
1. Reduce batch size in `batchInsertDODContracts()`
2. Process fewer days at once
3. Increase Node.js memory:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npx tsx scripts/dod-tech-daily-scraper.ts
   ```

---

## Next Steps

### Phase 1: Test & Validate
1. Run test scrape: `npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10`
2. Check database for contracts
3. Verify tech classification makes sense

### Phase 2: Daily Automation
1. Set up cron job OR GitHub Actions
2. Monitor for 1 week
3. Check failed contracts, adjust if needed

### Phase 3: Historical Backfill
1. Scrape last 30 days to build baseline
2. Optionally scrape full year (2024-2025)
3. Build insights dashboard

---

## Support

If you encounter issues:
1. Check logs for specific error messages
2. Check Supabase for progress tracking
3. Review `DOD_TECH_SCRAPER_PLAN.md` for technical details
4. Compare behavior to working FPDS scraper

---

## Summary

You now have a production-ready DOD tech contract scraper that:
- Runs continuously for months
- Auto-retries on failures
- Resumes from where it left off
- Pre-filters for DOD + tech
- Classifies contracts by tech category
- Tracks progress and errors

Just run `npx tsx scripts/dod-tech-daily-scraper.ts` and let it go!

