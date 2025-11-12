# DOD Tech Scraper - Files Summary

## Files Copied from PropShop_AI_Website

The following files were copied and adapted from your PropShop_AI_Website FPDS scraper:

### Source Files (PropShop_AI_Website):
- `src/lib/fpds-scraper-full.ts` - Original USA Spending scraper
- `src/lib/fpds-data-cleaner.ts` - Data validation library
- `src/lib/fpds-transactions-scraper.ts` - Transaction endpoint scraper
- `src/scripts/fpds-historical-transactions-scraper.ts` - Historical scraper
- `src/scripts/fpds-daily-scraper.ts` - Daily scraper

## New Files Created in MRT_WEBSITE

### Core Libraries (`lib/`):
1. **`lib/fpds-data-cleaner.ts`**
   - **Copied from**: PropShop original (identical)
   - **Purpose**: Data validation, quality scoring, deduplication
   - **No modifications needed**: Universal for all contract data

2. **`lib/tech-naics-classifier.ts`**
   - **New file**: Custom for DOD tech filtering
   - **Purpose**: 
     - Lists 50+ tech NAICS codes (software, IT, R&D, cybersecurity, etc.)
     - Lists DOD-specific PSC codes
     - Tech keyword matching (AI, cloud, software, etc.)
     - Auto-classification into tech categories
   - **Key functions**:
     - `isTechNAICS()` - Check if NAICS is tech-related
     - `classifyTechContract()` - Classify contract as tech with confidence
     - `isDODContract()` - Verify it's a DOD contract

3. **`lib/dod-tech-scraper.ts`**
   - **Adapted from**: `fpds-scraper-full.ts`
   - **Purpose**: Main scraper library with DOD+tech filtering
   - **Key modifications**:
     - API filters for DOD agencies
     - API filters for tech NAICS codes
     - Minimum contract amount ($100K default)
     - Tech classification during normalization
     - New fields: `is_tech_contract`, `tech_confidence`, `tech_categories`
     - Database table: `dod_tech_contracts` (instead of `fpds_contracts`)

### Scripts (`scripts/`):
4. **`scripts/dod-tech-daily-scraper.ts`**
   - **Adapted from**: `fpds-daily-scraper.ts`
   - **Purpose**: Daily scraper for automation
   - **Features**:
     - Same retry logic (20 attempts, exponential backoff)
     - Same progress tracking
     - Same resume capability
     - Updated to use DOD tech scraper library
   - **Usage**:
     ```bash
     npx tsx scripts/dod-tech-daily-scraper.ts           # Yesterday
     npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10
     npx tsx scripts/dod-tech-daily-scraper.ts --days=7  # Last 7 days
     ```

### Database Schema:
5. **`DOD_TECH_CONTRACTS_SCHEMA.sql`**
   - **New file**: Database structure
   - **Contains**:
     - `dod_tech_contracts` table (main contracts)
     - `dod_tech_scraper_log` (progress tracking)
     - `dod_tech_page_progress` (page-level tracking)
     - `dod_tech_failed_contracts` (retry log)
     - Views: high-value, small business, R&D, top vendors
     - Indexes for performance
   - **Run in Supabase**: Copy entire file to SQL Editor

### Documentation:
6. **`DOD_TECH_SCRAPER_PLAN.md`**
   - Technical implementation details
   - Filtering strategy explanation
   - API capabilities analysis
   - Pre-filter vs post-filter comparison

7. **`DOD_TECH_SCRAPER_README.md`**
   - Complete user guide
   - Setup instructions
   - Usage examples
   - Monitoring queries
   - Troubleshooting guide

8. **`DOD_SCRAPER_FILES_SUMMARY.md`**
   - This file
   - Overview of what was copied/created

## Key Differences from FPDS Scraper

### What's the Same:
- Retry logic (20 attempts with exponential backoff)
- Progress tracking system
- Resume capability
- Rate limiting (500-600ms delays)
- Data validation and quality scoring
- Failed contract logging
- Database structure pattern

### What's Different:

| Aspect | FPDS Scraper | DOD Tech Scraper |
|--------|-------------|------------------|
| **API Filtering** | None (scrapes all) | DOD agencies + tech NAICS |
| **Daily Volume** | ~6,000 contracts | ~200-800 contracts |
| **Speed** | Slower (more data) | Faster (pre-filtered) |
| **Classification** | No | Yes (auto tech categories) |
| **Min Amount** | No filter | $100K default |
| **Database Table** | `fpds_contracts` | `dod_tech_contracts` |
| **Use Case** | All federal contracts | DOD tech contracts only |

## How Pre-Filtering Works

### Old FPDS Approach (PropShop):
1. API returns ALL contracts for a date (~6,000/day)
2. Fetch details for all 6,000
3. Filter locally for relevant ones
4. Store relevant subset

**Result**: Wastes API calls and time on irrelevant contracts

### New DOD Tech Approach (MRT):
1. API returns ONLY DOD tech contracts (~200-800/day)
   ```javascript
   filters: {
     agencies: [{ name: "Department of Defense" }],
     naics_codes: ["541511", "541512", ...], // 50+ tech codes
     award_amounts: [{ lower_bound: 100000 }]
   }
   ```
2. Fetch details for filtered subset only
3. Additional tech classification (AI, cyber, cloud, etc.)
4. Store all

**Result**: 85% fewer API calls, 85% faster

## Running the Scraper

### Quick Start:
```bash
# 1. Create database tables
# Copy DOD_TECH_CONTRACTS_SCHEMA.sql into Supabase SQL Editor and run

# 2. Test scrape
npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10

# 3. Check results
# Go to Supabase → dod_tech_contracts table

# 4. If good, run daily automation
npx tsx scripts/dod-tech-daily-scraper.ts --days=7
```

### Long-Running (like your current FPDS scraper):
```bash
# Start tmux session
tmux new -s dod-tech-scraper

# Run for many days
npx tsx scripts/dod-tech-daily-scraper.ts --days=365

# Detach: Ctrl+B, then D
# Check later: tmux attach -t dod-tech-scraper
```

## Tech Classification Examples

The scraper automatically identifies tech categories:

### Example 1: AI/ML Contract
```json
{
  "vendor_name": "Palantir Technologies",
  "naics_code": "541511", // Custom programming
  "description": "AI-powered data analytics platform for intelligence",
  "tech_confidence": "high",
  "tech_categories": "software_it, ai_data",
  "current_total_value_of_award": 15000000
}
```

### Example 2: Cybersecurity Contract
```json
{
  "vendor_name": "CrowdStrike",
  "naics_code": "541512", // Systems design
  "psc_code": "D310", // Cyber security
  "description": "Endpoint protection and threat intelligence",
  "tech_confidence": "high",
  "tech_categories": "cybersecurity, software_it",
  "current_total_value_of_award": 5000000
}
```

### Example 3: R&D Contract
```json
{
  "vendor_name": "MIT Lincoln Laboratory",
  "naics_code": "541712", // R&D
  "description": "Advanced radar systems research",
  "contracting_agency_name": "Defense Advanced Research Projects Agency",
  "tech_confidence": "high",
  "tech_categories": "research_dev, aerospace_defense",
  "is_research": true
}
```

## Useful Queries

### Check scraping progress:
```sql
-- Today's scraping status
SELECT date, SUM(contracts_inserted) as total_inserted, 
       MAX(page_number) as last_page
FROM dod_tech_page_progress
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date
ORDER BY date DESC;
```

### Find high-value AI/ML contracts:
```sql
SELECT vendor_name, current_total_value_of_award, 
       date_signed, description_of_requirement
FROM dod_tech_contracts
WHERE tech_categories LIKE '%ai_data%'
  AND current_total_value_of_award >= 1000000
ORDER BY current_total_value_of_award DESC
LIMIT 20;
```

### Top tech vendors by DOD spend:
```sql
SELECT * FROM dod_tech_top_vendors
LIMIT 50;
```

## Maintenance

### Daily Checks:
1. Verify scraper is running (tmux or cron logs)
2. Check for failed contracts:
   ```sql
   SELECT COUNT(*) FROM dod_tech_failed_contracts WHERE resolved = FALSE;
   ```
3. Review data quality:
   ```sql
   SELECT AVG(data_quality_score) FROM dod_tech_contracts
   WHERE last_scraped >= CURRENT_DATE - INTERVAL '1 day';
   ```

### Weekly Checks:
1. Review database growth rate
2. Check for duplicate contracts
3. Validate tech classifications are accurate
4. Review any persistent failures

### Monthly Maintenance:
1. Clean up old failed contract logs
2. Vacuum database tables
3. Review and optimize indexes if needed

## Next Steps

1. **Test the scraper**: 
   ```bash
   npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10
   ```

2. **Verify results in Supabase**:
   - Check `dod_tech_contracts` table
   - Review tech classifications
   - Validate agency names are DOD

3. **Adjust if needed**:
   - Modify NAICS codes in `tech-naics-classifier.ts`
   - Change minimum amount in daily scraper
   - Add/remove tech categories

4. **Deploy for long-term**:
   - Set up tmux session OR cron job
   - Monitor for first week
   - Let it run continuously

## Questions?

Review these files:
- `DOD_TECH_SCRAPER_README.md` - Full user guide
- `DOD_TECH_SCRAPER_PLAN.md` - Technical details
- `lib/tech-naics-classifier.ts` - See what's classified as "tech"
- `scripts/dod-tech-daily-scraper.ts` - See retry logic in action

All the resilience features from your FPDS scraper are here:
- 20 retry attempts
- Exponential backoff
- Progress tracking
- Resume capability
- API rate limiting

Plus new features:
- Pre-filtered for DOD + tech
- Auto tech classification
- Faster execution
- Lower API usage

