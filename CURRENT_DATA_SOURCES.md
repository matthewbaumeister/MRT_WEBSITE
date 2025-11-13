# Current Data Sources for MATRIX Reports

## What Data is Used Now (With Web Search Disabled)

### ✅ Primary Data Source: Your Internal Supabase Database

**What Gets Searched:**
1. **DOD Contract News** (`dod_contract_news`, `dod_tech_contracts`)
   - Contract awards
   - Company information
   - Contract values
   - URLs to contract pages

2. **SBIR Opportunities** (`sbir_final`)
   - SBIR program opportunities
   - Company participation
   - Program details
   - URLs to SBIR pages

3. **xTech Army Opps** (`army_innovation_opportunities`, `army_innovation_programs`, etc.)
   - xTech programs
   - Innovation competitions
   - Company submissions
   - URLs to program pages

4. **MANTECH Data** (if small business focus enabled)
   - Manufacturing technology projects
   - Company mentions
   - SBIR transitions

**How It Works:**
1. System searches your Supabase tables based on the research topic
2. Extracts relevant data (contracts, companies, programs)
3. Extracts real URLs from database records
4. Passes all this data to GPT-4o-mini as context

---

### 🤖 GPT-4o-mini: Does It "Bring Data"?

**Short Answer: No, GPT doesn't "bring" external data.**

**What GPT-4o-mini Does:**
1. **Uses Your Database Data** - Analyzes and synthesizes the data you provide from Supabase
2. **Uses Training Data for Context** - Uses its general knowledge (trained up to its knowledge cutoff) for:
   - Understanding concepts
   - Writing style and structure
   - General market knowledge
   - Industry terminology

**What GPT-4o-mini Does NOT Do:**
- ❌ Search the internet
- ❌ Access live data
- ❌ Pull current information
- ❌ Access databases it doesn't have

**Important:** GPT should cite your database sources, not make up information. It uses its training data to help write and analyze, but the facts should come from your database.

---

### ✨ Enrichment Stage: GPT-4o + Optional Web Data

**What Happens:**
1. After initial generation, each section is enriched with GPT-4o
2. **If Tavily/Serper API keys are configured:**
   - System searches web for company info (CEOs, executives, recent news)
   - Adds live data to the section
   - This is **separate** from the "Web search" toggle

3. **If NO API keys configured:**
   - Enrichment still happens
   - Uses only internal database data
   - Adds analysis and context
   - No live web data

**Key Point:** The enrichment web search is controlled by API keys, NOT by the UI toggles you disabled.

---

## Current Flow (With Web Search Toggle Disabled)

```
1. User starts report
   ↓
2. Search Supabase Database
   ├─ DOD Contracts
   ├─ SBIR Opportunities  
   ├─ Army Innovation
   └─ Extract URLs from records
   ↓
3. Pass data to GPT-4o-mini
   ├─ Your database data (primary source)
   └─ GPT's training knowledge (for writing/analysis)
   ↓
4. Generate base content
   └─ Citations from your database
   ↓
5. Enrich with GPT-4o
   ├─ If Tavily/Serper API keys exist:
   │  └─ Add live web data (CEOs, executives, news)
   └─ If NO API keys:
      └─ Use only database data + analysis
```

---

## What Data You Get

### ✅ Always Available (From Your Database):
- Historical contract data
- SBIR opportunities
- Army innovation programs
- Company information from your databases
- Real URLs from database records
- Contract values, dates, programs

### ⚠️ Only If API Keys Configured (Enrichment):
- Current CEO names
- Executive leadership
- Recent news (2024-2025)
- Official company websites
- Company size (employees, revenue)
- Recent contracts not in your DB

### ❌ NOT Available (Web Search Toggle Disabled):
- DOD web searches during initial generation
- Recent news searches during initial generation
- (But enrichment can still add this if API keys exist)

---

## Summary

**Current Setup:**
1. **Primary:** Your Supabase database (always used)
2. **GPT-4o-mini:** Uses your data + its training knowledge for writing
3. **Enrichment:** Can add web data if Tavily/Serper API keys configured

**GPT doesn't "bring" data** - it:
- ✅ Uses YOUR database data (primary)
- ✅ Uses its training knowledge for writing/analysis (secondary)
- ❌ Does NOT search the internet
- ❌ Does NOT access live data (unless you provide it via API)

**To get live web data:**
- Configure `TAVILY_API_KEY` or `SERPER_API_KEY` in Vercel
- Enrichment will automatically add live company info
- This is separate from the "Web search" toggle

---

## Recommendation

**For Now (Web Search Disabled):**
- Reports use your proven database data
- GPT synthesizes and writes from your data
- Citations come from your database
- Reliable, verified information

**To Add Live Data Later:**
- Add Tavily API key to Vercel
- Enrichment will automatically add:
  - Current CEOs
  - Executives
  - Recent news
  - Company websites
- No code changes needed (already implemented)

