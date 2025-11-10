# Serper API Setup Guide

## What is Serper API?

Serper is a Google Search API that provides:
- Real-time web search results
- News article searches
- Cost: $50/month for 5,000 searches (~$0.01 per search)
- Much cheaper than Google's official API

## Why Use Web Search?

Web search supplements your Supabase data with:
- **Recent information** (last 6 months)
- **Latest news articles** about contracts, awards, companies
- **Current market data** that may not be in your databases yet
- **Public company information** and announcements

## Cost Estimate

For Market Research Reports:
- Each report generates 10 sections
- Each section makes 1-2 web searches (funding/competition get news too)
- **~12-15 searches per report**
- **Cost per report: $0.12-0.15**
- **100 reports/month: $12-15**
- **500 reports/month: $60-75**

**Very affordable** for the value it adds!

---

## Setup Instructions

### Step 1: Sign Up for Serper API

1. Go to https://serper.dev/
2. Click "Sign Up" or "Get API Key"
3. Sign up with Google or email
4. Free tier: 2,500 searches (enough to test!)
5. Paid: $50/month for 5,000 searches

### Step 2: Get Your API Key

1. After signing up, go to Dashboard
2. Copy your API key (starts with something like `abc123...`)
3. Keep this key private!

### Step 3: Add to Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/
2. Select your `mrt-website` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name**: `SERPER_API_KEY`
   - **Value**: [paste your API key]
   - **Environment**: Production, Preview, Development (select all)
6. Click **Save**
7. **Important**: Redeploy your site for the variable to take effect
   - Go to **Deployments** tab
   - Click the three dots (•••) on latest deployment
   - Click **Redeploy**

### Step 4: Verify It's Working

1. After redeployment, start a new research report
2. Make sure **Web Search** toggle is ON in settings
3. Watch the search status - should show:
   - "Searching databases for [section]..."
   - "Searching web for [section]..." ← This means it's working!
   - "Generating [section]..."
4. Check the report - should have more recent, specific data

---

## How It Works

### When You Enable Web Search:

1. **User starts research** on "drone technology"

2. **For each section**, MATRIX does:
   ```
   Step 1: Search Supabase databases
   Step 2: Search the web (Serper API)
     - Query: "drone technology DOD defense military overview 2024"
     - Gets top 5-10 results
   Step 3: For Funding/Competition sections:
     - Also searches recent news
     - Query: "drone technology DOD defense military contracts"
     - Last 6 months of news
   Step 4: Combines all data
     - Your database results
     - Web search results
     - News articles
   Step 5: Sends to OpenAI
     - OpenAI writes section using ALL data
     - Cites specific sources
   ```

3. **Result**: Report includes:
   - Your historical database data
   - Recent web information
   - Latest news and announcements
   - Specific company updates

### Search Queries Per Section:

| Section | Query Example |
|---------|---------------|
| Background | "{topic} DOD defense military overview 2024" |
| Funding | "{topic} SBIR STTR funding awards contracts DOD" + News |
| Market Size | "{topic} market size revenue defense industry" |
| TAM | "{topic} total addressable market defense DOD" |
| Competition | "{topic} companies contractors DOD awards" + News |
| Technology | "{topic} technology innovation DOD military" |
| USG Alignment | "{topic} DOD priorities Army Navy Air Force" |
| Regulatory | "{topic} regulations FAR DFARS compliance" |
| Barriers | "{topic} barriers entry risks defense contracting" |
| Conclusion | "{topic} DOD opportunities recommendations" |

---

## Features

### Automatic Web Search:
- ✅ Searches when **Web Search** or **Research** toggles are ON
- ✅ Disabled when toggles are OFF (saves money)
- ✅ Gracefully falls back if API key not set

### Smart Querying:
- ✅ DOD-specific queries (includes "DOD defense military")
- ✅ Section-specific queries (funding vs technology vs competition)
- ✅ News search for time-sensitive sections
- ✅ Recent results only (last 6 months)

### Cost Control:
- ✅ Only searches when user enables it
- ✅ Limited to 5-10 results per search
- ✅ ~$0.12-0.15 per report
- ✅ Cost estimation function included

### Source Citation:
- ✅ Web results include URLs
- ✅ Articles include titles and dates
- ✅ OpenAI told to cite web sources
- ✅ Sources appear in report

---

## Testing

### Test Without API Key (Should Work):
1. Don't add SERPER_API_KEY to Vercel
2. Generate report with Web Search ON
3. Should still work (using only Supabase data)
4. Console will log: "Serper API key not configured - web search disabled"

### Test With API Key:
1. Add SERPER_API_KEY to Vercel
2. Redeploy
3. Generate report with Web Search ON
4. Should show "Searching web..." in status
5. Report should have more recent, detailed information
6. Check Serper dashboard - should see API calls

### Compare Reports:
1. Generate report with Web Search OFF
   - Only uses your database data
   - Historical information
2. Generate same topic with Web Search ON
   - Uses database + web data
   - Recent news and updates
   - More comprehensive

---

## Troubleshooting

### "Searching web..." never appears:
- Check Vercel environment variable is set
- Make sure you redeployed after adding the variable
- Check browser console for errors
- Verify API key is correct (no extra spaces)

### API key not working:
- Go to Serper Dashboard
- Check if key is valid
- Check if you've exceeded quota (2,500 free or 5,000 paid)
- Try generating a new key

### Web results not in report:
- Enable **Web Search** toggle in settings
- Or enable **Research** toggle (also enables web search)
- Check console for errors

### Too expensive:
- Disable Web Search toggle by default
- Only enable for important reports
- Or reduce numResults in web-search.ts (currently 10)

---

## Cost Management

### If You Want to Save Money:

1. **Reduce results per search**:
   ```typescript
   // In lib/web-search.ts
   const webResults = await searchDoDWeb(topic, section.id);
   const webContext = formatWebSearchContext(webResults, 3); // Was 5
   ```

2. **Only search critical sections**:
   ```typescript
   // Only search for funding and competition
   if (section.id === 'funding' || section.id === 'competition') {
     const webResults = await searchDoDWeb(topic, section.id);
     // ...
   }
   ```

3. **Disable news search**:
   ```typescript
   // Remove the news search entirely
   // Comment out the searchRecentNews calls
   ```

4. **User-level toggle**:
   - Already have Web Search toggle
   - Users can disable to save money
   - Default to OFF to save costs

---

## API Limits

### Free Tier:
- 2,500 searches
- ~170-200 reports
- Good for testing

### Paid Tier ($50/month):
- 5,000 searches
- ~350-400 reports
- ~$0.125 per report

### Higher Usage:
- Contact Serper for custom pricing
- Or implement caching (search once, reuse results)

---

## Alternative APIs

If you want to try different providers:

### Tavily AI (Research-focused):
- Cost: $0.003/search
- API: https://tavily.com/
- Better for research, more expensive
- Change to Tavily in lib/web-search.ts

### Exa (Semantic Search):
- Cost: $29/month for 1,000 searches
- API: https://exa.ai/
- Best semantic understanding
- Most expensive

### SerpAPI (Multi-engine):
- Cost: $50/month for 5,000 searches
- API: https://serpapi.com/
- More search engines available
- Similar to Serper

**Recommendation**: Stick with Serper - best price/performance ratio for your use case.

---

## Summary

### To Enable Web Search:
1. Sign up at https://serper.dev/
2. Get API key
3. Add `SERPER_API_KEY` to Vercel environment variables
4. Redeploy site
5. Enable Web Search toggle in MATRIX settings
6. Generate reports with recent, comprehensive data

### Cost:
- $50/month = 5,000 searches
- ~350-400 comprehensive reports
- ~$0.12-0.15 per report
- Worth it for significantly better reports

### Value:
- ✅ Recent information (last 6 months)
- ✅ Latest news and announcements  
- ✅ Current company updates
- ✅ Market trends and insights
- ✅ Fills gaps in your databases
- ✅ Better, more complete reports

**Highly recommended to enable!** 🚀

