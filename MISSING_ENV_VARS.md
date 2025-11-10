# ⚠️ Missing Environment Variables

Your MATRIX tool needs these environment variables in Vercel for full functionality:

## 🔍 **SERPER_API_KEY** (Web Search & Enrichment)

**Why you need it:**
- Powers web enrichment for market reports
- Finds company intelligence from public sources
- Discovers recent news and contracts
- Cost: $50/month for 5,000 searches (~$0.01 per search)

**How to get it:**
1. Go to https://serper.dev/
2. Sign up for account
3. Get API key from dashboard
4. Add to Vercel:
   ```
   SERPER_API_KEY=your_key_here
   ```

**What happens without it:**
- ⚠️ Console warning: "Serper API key not configured - web search disabled"
- Reports only use Supabase data (no live web enrichment)
- Company intelligence limited to your database
- No recent news or public data verification

---

## Current Status of Environment Variables:

### ✅ Working:
- `OPENAI_API_KEY` - LLM report generation
- `SUPABASE_URL` - Database access
- `SUPABASE_SERVICE_ROLE_KEY` - Admin database access
- `NEXTAUTH_SECRET` - Authentication
- `NEXTAUTH_URL` - Session management
- `SENDGRID_API_KEY` - Email notifications

### ⚠️ Missing (Optional but Recommended):
- `SERPER_API_KEY` - Web search & enrichment
  - Impact: No live web data in reports
  - Solution: Sign up at https://serper.dev/

---

## Recommendations:

### For Now (Without Serper):
- Your tool works fine with 290K+ database records
- Semantic search makes it very powerful
- Reports are data-driven from your Supabase

### To Enable Full Power:
1. Add `SERPER_API_KEY` to Vercel
2. Redeploy
3. Reports will now include:
   - Live company intelligence
   - Recent news and contracts
   - Public data verification
   - CEO names, company sizes, funding info

---

## Cost Analysis:

**Semantic Search (Already Implemented):**
- One-time cost: ~$30-50 for 290K records
- Per-query cost: ~$0.00001 (basically free)

**Web Enrichment (Serper API):**
- Monthly cost: $50 for 5,000 searches
- Per-report cost: ~$0.13 (13 searches per company)
- 100 reports/month = ~$13
- 1,000 reports/month = ~$130

---

## How to Add to Vercel:

1. Go to https://vercel.com/matt-baumeisters-projects/mrt-website
2. Settings → Environment Variables
3. Add new variable:
   - Name: `SERPER_API_KEY`
   - Value: `your_key_here`
   - Environment: Production, Preview, Development
4. Redeploy

---

## Testing After Adding:

Run a new report and check console for:
```
✅ Searching public web sources...
✅ Found X company intelligence results
✅ Enrichment complete
```

Instead of:
```
⚠️ Serper API key not configured - web search disabled
```

