# MATRIX Data Verification Guide

## How to Verify Your Data Pipeline is Working

### Step 1: Open Browser Developer Console

1. Open Chrome/Edge DevTools (F12 or Cmd+Option+I on Mac)
2. Go to the **Console** tab
3. Keep it open while generating a report

---

## What You Should See in Console

### When Report Generates:

For **each section**, you'll see detailed logs like this:

```
=== SECTION BACKGROUND DATA ===
✅ Found 15 total results
Tables with data: [
  { table: 'dod_contract_news', count: 5 },
  { table: 'mantech_projects', count: 4 },
  { table: 'army_innovation_opportunities', count: 6 }
]
📎 Extracted 12 URLs
First 3 URLs:
  - Autonomous System Development - dod_contract_news
    https://www.defensenews.com/land/2024/01/15/army-tests-autonomous-convoy-technology/
  - AI-Powered Logistics - mantech_projects
    https://www.dodmantech.com/projects/ai-logistics-2024
  - Small Business Innovation Award - army_innovation_opportunities
    https://www.ausa.org/articles/army-awards-small-business-innovation-contracts
📝 Context length: 3456 chars
Context preview: Relevant data from internal databases:

From dod_contract_news (5 results):
- {"id": 123, "title": "Army Tests Autonomous Convoy Technology", "article_url": "https://www.defensenews.com/land/2024/01/15/...
================================
```

### On Vercel (Server-Side):

In your Vercel deployment logs, you'll see:

```
=== SEARCH API DEBUG ===
Topic: "autonomous vehicles"
Section: background
Small Business Focus: false
Tables searched: dod_contract_news, mantech_projects, army_innovation_opportunities, sbir_final
Total results: 15
Results per table:
  - dod_contract_news: 5 rows
  - mantech_projects: 4 rows
  - army_innovation_opportunities: 6 rows
URLs extracted: 12
  - Autonomous System Development - dod_contract_news...
    https://www.defensenews.com/land/2024/01/15/army-tests-autonomous-convoy-technology/
  - AI-Powered Logistics - mantech_projects...
    https://www.dodmantech.com/projects/ai-logistics-2024
Context length: 3456 chars
========================
```

---

## What to Check:

### ✅ Good Signs:

1. **"Found X total results"** where X > 0
   - Shows Supabase search is working
   - Data is being retrieved

2. **"Extracted X URLs"** where X > 0
   - Shows URL extraction is working
   - Your `article_url`, `source_url`, `website` columns have data

3. **"Context length: XXXX chars"**
   - Shows data is being formatted for LLM
   - The larger this number, the more data the LLM has

4. **Actual URLs showing up**
   - `https://www.defensenews.com/...`
   - `https://www.dodmantech.com/...`
   - These are REAL URLs from your database

### ❌ Bad Signs:

1. **"Found 0 total results"**
   - No data in Supabase for this topic
   - Check if data exists for this search term

2. **"Extracted 0 URLs"**
   - Data found but no URL columns populated
   - OR URL columns are NULL/empty in database

3. **"Context length: 0 chars"**
   - Search failed or no data returned
   - Check Supabase connection

4. **Console errors**
   - Red error messages indicate problems
   - Copy and send them for debugging

---

## How to Test Specific Data:

### Test 1: Verify Data Exists

Run this in **Supabase SQL Editor**:

```sql
-- Check if you have data for "drone"
SELECT 
  'dod_contract_news' as table_name,
  COUNT(*) as matching_rows,
  COUNT(article_url) as rows_with_urls
FROM dod_contract_news
WHERE 
  title ILIKE '%drone%' OR
  description ILIKE '%drone%'

UNION ALL

SELECT 
  'mantech_projects' as table_name,
  COUNT(*) as matching_rows,
  COUNT(article_url) as rows_with_urls
FROM mantech_projects
WHERE 
  project_title ILIKE '%drone%' OR
  project_description ILIKE '%drone%'

UNION ALL

SELECT 
  'army_innovation_opportunities' as table_name,
  COUNT(*) as matching_rows,
  COUNT(source_url) as rows_with_urls
FROM army_innovation_opportunities
WHERE 
  title ILIKE '%drone%' OR
  description ILIKE '%drone%';
```

**Expected Result:**
```
| table_name                         | matching_rows | rows_with_urls |
|------------------------------------|---------------|----------------|
| dod_contract_news                  | 15            | 12             |
| mantech_projects                   | 8             | 7              |
| army_innovation_opportunities      | 23            | 23             |
```

If `matching_rows` is 0: No data for "drone" in that table
If `rows_with_urls` is 0: Data exists but URLs are empty

---

### Test 2: Check Actual URLs

```sql
-- See actual URLs from your data
SELECT 
  title,
  article_url,
  source_url
FROM dod_contract_news
WHERE title ILIKE '%drone%'
LIMIT 5;
```

**Expected Result:**
```
| title                          | article_url                                    | source_url |
|--------------------------------|-----------------------------------------------|------------|
| Army Tests New UAV System      | https://defensenews.com/article-123           | NULL       |
| Drone Defense Contract Awarded | https://breakingdefense.com/article-456       | NULL       |
```

If all URLs are `NULL` → URLs not populated in database
If URLs have values → System should extract them!

---

## Quick Debug Checklist:

### Problem: "Found 0 total results"

**Solution:**
1. Check if data exists for your search term (Test 1 above)
2. Try a different search term (e.g., "autonomous" instead of "drones")
3. Check Supabase connection in Vercel environment variables

### Problem: "Extracted 0 URLs" but data exists

**Solution:**
1. Check if URL columns are populated (Test 2 above)
2. Verify column names match:
   - `article_url`, `source_url`, `website`
   - `url`, `link`, `reference_url`
3. If using different column names, we need to add them to the system

### Problem: URLs are generic/fake

**Solution:**
1. Check console logs - do you see real URLs there?
2. If console shows real URLs but UI doesn't → Frontend display issue
3. If console shows 0 URLs → Database URL columns are empty

### Problem: Report content is generic/not using my data

**Solution:**
1. Check "Context length" in console
2. If 0 chars → No data being sent to LLM
3. If large (>1000 chars) → Data is there, check "Context preview"
4. The preview should show YOUR data, not generic text

---

## Example: Perfect Console Output

```
=== SECTION BACKGROUND DATA ===
✅ Found 47 total results
Tables with data: [
  { table: 'dod_contract_news', count: 15 },
  { table: 'mantech_projects', count: 12 },
  { table: 'army_innovation_opportunities', count: 20 }
]
📎 Extracted 38 URLs
First 3 URLs:
  - Army Tests Autonomous Convoy Tech - dod_contract_news
    https://www.defensenews.com/land/2024/01/15/army-tests-autonomous-convoy-technology/
  - MANTECH Project: AI-Powered Logistics - mantech_projects
    https://www.dodmantech.com/projects/ai-logistics-2024
  - SBIR Phase II Award for Drone Navigation - army_innovation_opportunities
    https://www.ausa.org/articles/army-awards-small-business-innovation-contracts
📝 Context length: 8743 chars
Context preview: Relevant data from internal databases:

From dod_contract_news (15 results):
- {"id":12345,"title":"Army Tests Autonomous Convoy Technology","description":"The U.S. Army successfully tested new autonomous convoy technology...","article_url":"https://www.defensenews.com/land/2024/01/15/...","published_date":"2024-01-15"}
- {"id":12346,"title":"Pentagon Awards $50M Contract for UAV Systems","description":"The Department of Defense awarded a...
================================
```

**This shows:**
- ✅ 47 results found across 3 tables
- ✅ 38 real URLs extracted
- ✅ URLs are from your actual data
- ✅ 8,743 chars of context sent to LLM
- ✅ Context contains actual database records

---

## Next Steps:

1. **Generate a test report** with console open
2. **Copy all the console logs** for one section
3. **Send them to me** so I can verify everything
4. **Check Vercel logs** (Runtime Logs tab) for server-side output
5. **Run the SQL tests** to verify your data

If you see the pattern above, **everything is working perfectly**! 

If not, the logs will tell us exactly what's wrong.

