# Complete Testing Guide - MATRIX Platform

## How Your Tables Are Used in Reports

### 📊 Current Tables Configured (37+ tables!):

#### 1. **xTech / Army Innovation** (10 tables)
- army_innovation_opportunities
- army_innovation_programs
- army_innovation_submissions
- army_innovation_finalists_with_details
- army_innovation_winners_with_details
- army_innovation_phase_progress
- army_innovation_competition_stats
- army_innovation_prize_summary
- army_innovation_documents
- army_innovation_upcoming_deadlines

#### 2. **MANTECH** (7 tables)
- mantech_projects
- mantech_by_component
- mantech_company_mentions
- mantech_top_companies
- mantech_sbir_transitions
- mantech_transition_pipeline
- mantech_recent_projects

#### 3. **DOD Contract News** (5 tables)
- dod_contract_news
- dod_news_scraper_log
- mil_recent_news
- military_news_articles
- military_news_scraper_log

#### 4. **GSA Schedule & Contractors** (9 tables)
- active_gsa_schedule_holders
- gsa_contractors_with_pricing
- gsa_gwac_scraper_log
- gsa_labor_categories
- gsa_price_lists
- gsa_pricing_scraper_log
- gsa_schedule_holders
- gsa_sin_catalog
- small_business_gsa_holders

#### 5. **Financial / Stock Data** (3 tables)
- congressional_stock_trades
- defense_contractors_tickers
- defense_stock_trades

#### 6. **Small Business** (1 table + more coming)
- small_business_gsa_holders
- sba_awards (coming soon)
- dsip_awards (coming soon)
- fpds_small_business (coming soon)

**TOTAL: 35+ tables actively searched!**

---

## 🔍 How Table Search Works

### When You Generate a Report:

1. **User enters topic**: "drone technology"

2. **For EACH of 10 sections**, system does:
   ```
   Step 1: Build search query
   - Takes your topic: "drone technology"
   - Searches across ALL 35+ tables
   - Looks in columns: title, description, name, company, etc.
   
   Step 2: Execute searches
   - xTech tables: Search for "drone"
   - MANTECH tables: Search for "drone"
   - DOD contracts: Search for "drone"
   - GSA tables: Search for "drone"
   - Financial: Search for "drone"
   - Gets up to 50 results PER TABLE
   
   Step 3: Format results
   - Combines all table results
   - Creates context: "From army_innovation_winners: [data]..."
   - Creates context: "From dod_contract_news: [data]..."
   - Creates context: "From gsa_contractors_with_pricing: [data]..."
   
   Step 4: Send to OpenAI
   - Passes ALL database results
   - Plus web search results (if enabled)
   - OpenAI writes section using YOUR data
   
   Step 5: Generate sources
   - Looks at what was referenced
   - Creates specific source citations
   - "Army xTech Competition Database"
   - "DOD Contract News - Recent Awards"
   - "GSA Schedule Holder Database"
   ```

3. **Result**: Section with your actual data cited!

---

## 📝 How Citations Work

### Automatic Source Generation:

The system looks at section content and generates sources:

```typescript
// Example: If content mentions...
"xTech" or "Army Innovation" 
  → Source: "Army xTech Competition Database - Innovation Submissions 2022-2024"

"MANTECH" or "manufacturing"
  → Source: "MANTECH Projects Database - Manufacturing Technology Transitions"

"GSA" or "schedule"
  → Source: "GSA Schedule Holder Database - Active Contractors"

"contract" or "award"
  → Source: "DOD Contract News Database - Recent Awards"

"stock" or "congressional"
  → Source: "Congressional Stock Trades Database - Defense Contractors"
```

### Example Output:

**Section: Funding & Investment Landscape**

Content generated:
> "According to Army xTech Competition 2024, DroneCompany Inc won $2.5M for autonomous systems. GSA Schedule data shows they hold Schedule 70 with $15M in annual sales. Recent DOD contract news from September 2024 reports a $3.2M Phase II SBIR award..."

Sources automatically cited:
- Army xTech Competition Database - Innovation Submissions 2022-2024
- MANTECH SBIR Transitions - Technology Pipeline  
- DOD Contract News Database - Military Awards Q3 2024
- GSA Schedule Holder Database - Active Contractors
- Congressional Stock Trades - Defense Sector Q4 2024

**All automatic based on what data was used!**

---

## 🚀 Adding More Tables

### If You Import New Tables:

1. Open `lib/supabase-queries.ts`

2. Add to appropriate category:
```typescript
const MATRIX_TABLES: Record<string, string[]> = {
  // ... existing tables ...
  
  your_new_category: [
    'your_new_table_1',
    'your_new_table_2',
  ],
};
```

3. Update `searchSupabaseTables` function if needed to include new category

4. Deploy - that's it!

### Example: Adding SBIR Tables

```typescript
sbir: [
  'sbir_awards',
  'sbir_phase_1_winners',
  'sbir_phase_2_winners',
  'sbir_phase_3_transitions',
],
```

Then in `searchSupabaseTables`:
```typescript
const tablesToSearch = options.smallBusinessFocus
  ? [...MATRIX_TABLES.xtech, ...MATRIX_TABLES.mantech, ...MATRIX_TABLES.sbir]
  : [...MATRIX_TABLES.xtech, ...MATRIX_TABLES.mantech, ...MATRIX_TABLES.sbir];
```

---

## 🧪 COMPLETE TESTING CHECKLIST

### Test 1: Table Discovery
**Find all your tables**

```bash
# Run the discovery script
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
npm install ts-node --save-dev
npx ts-node scripts/discover-supabase-tables.ts
```

**Expected Output:**
- List of all tables categorized
- Row counts
- Code snippet to copy into supabase-queries.ts

**Verify:**
- [ ] Script runs without errors
- [ ] All your imported tables appear
- [ ] Row counts look correct

---

### Test 2: Basic Report Generation
**Test that everything works end-to-end**

1. Go to https://matrix.makereadytech.com/
2. Start new research: "drone technology"
3. Watch status messages
4. Wait for report to complete (~3-5 minutes)

**Expected Status Messages:**
- "Searching databases for Background & Market Overview..."
- "Generating Background & Market Overview..."
- (Repeats for all 10 sections)

**Verify:**
- [ ] All 10 sections generate
- [ ] Each section has content (not empty)
- [ ] Each section has 10-15 sources listed
- [ ] Sources have actual names (not generic)
- [ ] Sources are clickable links
- [ ] No error messages in browser console

---

### Test 3: Database Search Working
**Verify your tables are being queried**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Generate a report on a topic YOU KNOW is in your data
   - Example: A company name from your DOD contract news
   - Example: A specific GSA schedule holder
4. Watch console for any error messages

**Check Report Content:**
- [ ] Mentions specific companies from your tables
- [ ] Mentions specific dollar amounts
- [ ] Mentions specific dates/programs
- [ ] References table categories in sources

**Example Good Output:**
> "According to recent DOD contract awards, Lockheed Martin received $45M for drone systems (Q3 2024). GSA Schedule data shows they maintain Schedule 70 with $2.1B in total sales..."

---

### Test 4: Source Citations
**Verify sources are being generated**

1. Generate report
2. Expand any section
3. Scroll to bottom → "Data Sources"
4. Should see 10-15 sources

**Check Sources Include:**
- [ ] xTech sources (if mentioned)
- [ ] MANTECH sources (if mentioned)
- [ ] DOD contract sources (if mentioned)
- [ ] GSA sources (if mentioned)
- [ ] Financial sources (if mentioned)
- [ ] Sources have descriptive names
- [ ] Sources have years/dates where applicable

**Good Source Examples:**
- "Army xTech Competition Database - Innovation Submissions 2022-2024"
- "DOD Contract News Database - Military Awards Q3 2024"
- "GSA Schedule Holder Database - Active Contractors"
- "MANTECH SBIR Transitions - Technology Pipeline"
- "Congressional Stock Trades Database - Defense Sector"

---

### Test 5: Small Business Focus
**Test the small business toggle**

1. Open settings (sliders icon)
2. Turn ON "Focus on Small Business"
3. Generate report on a topic

**Expected Behavior:**
- System prioritizes small business tables
- Mentions small business programs first
- References SBIR/STTR awards
- Shows small business GSA holders
- Leads with small business opportunities

**Verify:**
- [ ] Report mentions SBIR/STTR
- [ ] Report mentions small business contracts
- [ ] Report mentions small business GSA holders
- [ ] Small business data appears BEFORE general data
- [ ] Sources include small business-specific sources

---

### Test 6: Different Topics
**Test with various research topics**

Try these topics:
1. A company name you know is in your data
2. A technology from your xTech data
3. A general category (e.g., "cybersecurity")
4. A specific program name
5. A manufacturing technology

**For Each Topic:**
- [ ] Report generates successfully
- [ ] Contains specific data from your tables
- [ ] Citations are relevant
- [ ] No generic/vague content
- [ ] Mentions actual programs/companies/amounts

---

### Test 7: Chat History & Projects
**Test conversation management**

1. Generate a report (Topic A)
2. Check "Recents" in sidebar
3. Should see "Research: Topic A"
4. Generate another report (Topic B)
5. Should see both in "Recents"

**Test 3-Dot Menu:**
- [ ] Hover over chat → dots appear
- [ ] Click dots → menu opens
- [ ] Click "Open Chat" → loads conversation
- [ ] Click "Move to Project" → modal opens
- [ ] Click "Delete Chat" → confirms and deletes

**Test Projects:**
- [ ] Create new project
- [ ] Move chat to project
- [ ] Chat appears under project
- [ ] Search projects works
- [ ] Delete project works
- [ ] Chats remain after project delete

---

### Test 8: Web Search (If Enabled)
**Test Serper API integration**

Prerequisites:
- SERPER_API_KEY set in Vercel

1. Enable "Web Search" toggle
2. Generate report
3. Watch for "Searching web..." status

**Verify:**
- [ ] Status shows "Searching web..."
- [ ] Report has MORE recent information
- [ ] Sources include web URLs
- [ ] News articles cited (funding/competition sections)
- [ ] Serper dashboard shows API calls
- [ ] No "API key not found" errors

---

### Test 9: Performance
**Check speed and reliability**

1. Time a report generation
2. Check for any slowdowns

**Expected Times:**
- Without web search: 2-3 minutes
- With web search: 3-5 minutes

**Verify:**
- [ ] Generates in reasonable time
- [ ] No timeouts
- [ ] No stuck "loading" states
- [ ] Browser doesn't freeze
- [ ] Can navigate away and back

---

### Test 10: Error Handling
**Test edge cases**

**Test Empty Results:**
1. Research topic: "zzzzz123xyz" (nonsense)
2. Should still generate report
3. May have less specific data

**Test Special Characters:**
1. Research: "AI/ML & robotics (2024)"
2. Should handle cleanly

**Test Long Topics:**
1. Research: Very long description...
2. Should truncate or handle gracefully

**Verify:**
- [ ] No crashes
- [ ] Graceful error messages
- [ ] Still generates something useful
- [ ] No console errors that block functionality

---

## 🔍 Debugging Tools

### Check What Tables Are Being Queried:

1. Open browser console
2. Generate report
3. Look for logs like:
   ```
   Searching tables: xtech, mantech, dod_contracts, gsa, financial
   Found 45 results from army_innovation_winners_with_details
   Found 23 results from dod_contract_news
   Found 67 results from gsa_contractors_with_pricing
   ```

### Check Supabase Directly:

```sql
-- See row counts
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- Test a search
SELECT * FROM dod_contract_news 
WHERE title ILIKE '%drone%' 
LIMIT 5;
```

### Check API Responses:

1. Browser DevTools → Network tab
2. Filter: "chat"
3. Generate report
4. Click on POST to `/api/matrix/chat`
5. Check Request Payload → should include supabaseContext
6. Check Response → should have generated content

---

## 🎯 What Success Looks Like

### Excellent Report Characteristics:

✅ **Specific Data:**
- Company names
- Dollar amounts  
- Dates and quarters
- Program names
- Contract numbers

✅ **Proper Citations:**
- 10-15 sources per section
- Source names are descriptive
- Sources are clickable
- Mix of database + web sources (if enabled)

✅ **Comprehensive Coverage:**
- Uses xTech data
- Uses MANTECH data
- Uses DOD contract data
- Uses GSA data
- Uses financial data (if relevant)

✅ **Logical Flow:**
- Sections build on each other
- Conclusion synthesizes everything
- No contradictions
- Professional tone

✅ **Recent Information:**
- Mentions 2024 data
- References recent quarters
- Up-to-date company status
- Current programs

---

## 📊 Example Test Report

### Topic: "Autonomous Systems"

**Expected Section Output:**

**1. Background & Market Overview**
- Mentions specific xTech competitions for autonomous systems
- References MANTECH projects in autonomy
- Cites recent DOD contracts
- Names key companies from GSA data

**2. Funding & Investment**
- Lists actual SBIR/STTR awards from xTech
- Shows MANTECH funding amounts
- References Phase I/II/III transitions
- Cites congressional stock trades (interest indicator)

**3. Competition**
- Names companies from GSA schedule holders
- Lists contract awards from DOD news
- Shows market share indicators
- References stock performance

**Sources Should Include:**
- Army xTech Competition Database
- MANTECH Projects Database
- DOD Contract News - Recent Awards
- GSA Schedule Holder Database
- Defense Contractors Financial Database

---

## 🐛 Common Issues & Fixes

### Issue: No specific data in reports
**Fix:** 
- Check if tables have data: `SELECT COUNT(*) FROM your_table`
- Verify table names in supabase-queries.ts
- Check search query is matching your data

### Issue: Sources are generic
**Fix:**
- Update `generateDataSources` in report-prompts.ts
- Add more source URL mappings
- Add more content detection logic

### Issue: "Table does not exist" error
**Fix:**
- Run discovery script to find actual table names
- Update MATRIX_TABLES with correct names
- Check for typos

### Issue: Slow performance
**Fix:**
- Add indexes to frequently searched columns
- Reduce number of tables searched
- Implement caching (future enhancement)

### Issue: No web results
**Fix:**
- Check SERPER_API_KEY is set in Vercel
- Verify Web Search toggle is ON
- Check Serper dashboard for API usage/errors
- Check browser console for errors

---

## 🚀 Quick Start Testing

### 5-Minute Smoke Test:

1. ✅ Generate report on "cybersecurity"
2. ✅ Check report has 10 sections
3. ✅ Check sources listed (10-15 per section)
4. ✅ Check "Recents" shows your chat
5. ✅ Try 3-dot menu
6. ✅ Create a project
7. ✅ Move chat to project

**If all pass → System is working!**

---

## 📞 Support Checklist

If something isn't working:

1. [ ] Run discovery script - are tables found?
2. [ ] Check Supabase - do tables have data?
3. [ ] Check browser console - any errors?
4. [ ] Check Network tab - API calls succeeding?
5. [ ] Check Vercel logs - any server errors?
6. [ ] Try without web search - does it work?
7. [ ] Try different topic - same issue?

---

## 🎊 Success Metrics

Your system is working perfectly when:

✅ **Reports include YOUR data**
- Specific companies
- Actual dollar amounts
- Real program names
- Dates and details

✅ **35+ tables being searched**
- xTech: 10 tables
- MANTECH: 7 tables
- DOD contracts: 5 tables
- GSA: 9 tables
- Financial: 3 tables
- Small business: 1+ tables

✅ **Sources properly cited**
- 10-15 per section
- Descriptive names
- Clickable links
- Relevant to content

✅ **Fast and reliable**
- 2-5 minutes per report
- No timeouts
- No errors
- Smooth UX

**You now have a data-driven market research platform that uses ALL your imported data!** 🚀

---

## Next: Run These Commands

```bash
# 1. Discover all your tables
npx ts-node scripts/discover-supabase-tables.ts

# 2. Copy output to supabase-queries.ts (if needed)

# 3. Deploy
git add -A
git commit -m "Add all imported tables to MATRIX search"
git push origin main

# 4. Test!
# Go to matrix.makereadytech.com and generate a report
```

**Everything is ready to use your complete database!** 🎉

