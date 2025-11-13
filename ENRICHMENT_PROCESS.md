# MATRIX Report Enrichment Process

## Overview
The MATRIX report generation uses a **two-stage process** to create comprehensive, well-sourced market research reports:

1. **Initial Generation** - Creates base content from your internal databases
2. **Enrichment** - Enhances content with live web data and verified company intelligence

---

## Stage 1: Initial Section Generation

### Step 1: Search Internal Databases
**Location:** `components/matrix/MatrixChat.tsx` (lines 553-612)

When generating each section, the system:
1. **Searches Supabase tables** via `/api/matrix/search`:
   - DOD Contracts (`dod_tech_contracts`)
   - SBIR Opportunities (`sbir_final`)
   - Army Innovation Opportunities (`army_innovation_opportunities`)
   - GSA Schedules
   - Other proprietary data tables

2. **Extracts real URLs** from database records:
   - Contract URLs (e.g., `https://xtech.army.mil/competition/...`)
   - SBIR opportunity links
   - Company website URLs stored in database
   - Government source URLs

3. **Builds context** from internal data:
   - Relevant contract information
   - Company data from your databases
   - Historical contract awards
   - SBIR opportunity details

### Step 2: Optional Web Search (if enabled)
**Location:** `components/matrix/MatrixChat.tsx` (lines 617-647)

If `webSearch` or `research` flags are enabled:
- Searches DOD-specific web sources
- Searches recent news (for funding/competition sections)
- Adds web context to the data pool

### Step 3: Generate Base Content
**Location:** `components/matrix/MatrixChat.tsx` (lines 654-699)

Uses GPT-4o-mini (or GPT-4o in MAX mode) to:
- Synthesize internal database data into academic prose
- Create initial section content with citations from your databases
- Format as flowing paragraphs (PhD-level academic style)

**Result:** Base section content with citations like:
- `[Source: DOD Contracts]`
- `[Source: SBIR Opportunities]`
- `[Source: Internal Database]`
- Real URLs from your database records

---

## Stage 2: Enrichment with Live Web Data

### Step 1: Extract Companies from Section
**Location:** `app/api/matrix/enrich-section/route.ts` (lines 44-80)

The enrichment process:
1. **Scans the generated section** for company names using regex patterns:
   - Full company names (e.g., "Lockheed Martin", "ECS Federal")
   - Common defense contractors
   - Company names mentioned in context

2. **Identifies up to 8 companies** mentioned in the section

### Step 2: Live Web Search (if Serper API configured)
**Location:** `app/api/matrix/enrich-section/route.ts` (lines 86-162)

For each company found, performs **targeted web searches** via Serper API:

**Search Queries:**
- `{company} official website`
- `{company} CEO president leadership team`
- `{company} headquarters location address`
- `{company} employees headcount workforce size`
- `{company} revenue financial information`
- `{company} defense contracts DOD awards`
- `{company} government contractor GSA CAGE code`
- `{company} recent news 2024 2025`

**URL Validation:**
- Rejects placeholder URLs (`exact-url.com`, `example.com`, etc.)
- Validates URL format (must be http/https)
- Tracks verified URLs to prevent duplicates
- Only includes functional, real URLs

**Result:** `webContext` with format:
```
=== ECS Federal - official website ===
TITLE: ECS Federal Official Website
VERIFIED URL: https://www.ecsfederal.com
CONTENT: ECS Federal is a leading IT services provider...
DATE: 2024-11-13
```

### Step 3: GPT-4o Enrichment
**Location:** `app/api/matrix/enrich-section/route.ts` (lines 164-289)

Uses **GPT-4o** (always, regardless of mode) to:

1. **Enhance the base content** with:
   - Company website URLs (from web search)
   - Current CEO/executive information
   - Headquarters locations
   - Employee counts and revenue data
   - Recent contracts and awards
   - Government contractor status (GSA, CAGE codes)
   - Recent news and developments

2. **Citation Requirements:**
   - **If web search available:** Uses `[Source: Company Name](VERIFIED_URL)` format
   - **If web search NOT available:** Uses `[Source: Internal Database]` or `[Source: DOD Contracts]` format

3. **Writing Style:**
   - Academic paragraph form (PhD-level)
   - Flowing, analytical prose
   - Minimal bullets (only for true lists)
   - Tables only for structured data

**Result:** Enhanced section with:
- Base content from your databases (proven, historical data)
- Live company intelligence (current executives, recent news, official websites)
- All facts properly cited with verified URLs

---

## Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    REPORT GENERATION                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: Initial Generation                                │
│  ────────────────────────────────────────────────────────   │
│  1. Search Supabase Tables                                   │
│     ├─ DOD Contracts                                         │
│     ├─ SBIR Opportunities                                    │
│     ├─ Army Innovation Opportunities                         │
│     └─ Other proprietary tables                              │
│                                                              │
│  2. Extract Real URLs from Database Records                  │
│     └─ Contract URLs, company links, etc.                    │
│                                                              │
│  3. Generate Base Content (GPT-4o-mini)                      │
│     └─ Academic prose with database citations                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: Enrichment                                         │
│  ────────────────────────────────────────────────────────   │
│  1. Extract Company Names from Section                       │
│     └─ Up to 8 companies identified                          │
│                                                              │
│  2. Live Web Search (Serper API)                            │
│     ├─ Official websites                                     │
│     ├─ CEO/executive information                             │
│     ├─ Headquarters, employees, revenue                       │
│     ├─ Recent contracts and awards                          │
│     └─ Recent news (2024-2025)                              │
│                                                              │
│  3. Validate URLs                                            │
│     └─ Reject placeholders, verify format                    │
│                                                              │
│  4. GPT-4o Enrichment                                        │
│     └─ Integrate live data into base content                │
│     └─ Add verified citations with URLs                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Final Section  │
                    │  with Proven +  │
                    │  Live Data      │
                    └─────────────────┘
```

---

## Key Features

### ✅ Proven Data from Your Databases
- Historical contract data
- SBIR opportunities
- Company information stored in Supabase
- Real URLs extracted from database records

### ✅ Live Web Intelligence
- Current company information (when Serper API configured)
- Recent news and developments
- Official company websites
- Verified executive information

### ✅ Smart Fallback
- **If Serper API configured:** Uses live web data with VERIFIED URLs
- **If Serper API NOT configured:** Uses internal database sources only
- Never fails - always generates content using available sources

### ✅ Academic Quality
- PhD-level writing style
- Flowing paragraphs (not bullet-heavy)
- Proper citations for all facts
- Tables only when needed for structured data

---

## Configuration

### Required Environment Variables
- `OPENAI_API_KEY` - For GPT-4o enrichment (required)
- `SERPER_API_KEY` - For live web search (optional, but recommended)

### When Serper API is NOT configured:
- System uses internal database sources only
- Citations use `[Source: Internal Database]` format
- Still generates high-quality content
- No "sorry" messages - works with available data

### When Serper API IS configured:
- Combines internal database data + live web intelligence
- Citations include verified URLs from web search
- Most comprehensive and up-to-date reports

---

## Example Output

**Base Content (Stage 1):**
> ECS Federal, headquartered in Fairfax, Virginia, is a prominent defense contractor specializing in IT services [Source: DOD Contracts]. The company has secured significant contracts including a $50 million award [Source: Internal Database].

**Enriched Content (Stage 2):**
> ECS Federal, headquartered in Fairfax, Virginia, is a prominent defense contractor specializing in IT services [Source: DOD Contracts](https://www.ecsfederal.com). The company, led by CEO John Hengan, employs over 3,000 individuals and has secured significant contracts including a $50 million award from the Defense Innovation Unit in 2024 [Source: ECS Federal Official Website](https://www.ecsfederal.com/about). Recent developments include expansion of cybersecurity capabilities [Source: Defense News](https://www.defensenews.com/...).

---

## Benefits

1. **Proven Historical Data** - Your databases provide verified, historical contract and company data
2. **Live Updates** - Web search adds current information (executives, recent news, official websites)
3. **Comprehensive Citations** - Every fact has a source, either from your database or verified web URLs
4. **Never Fails** - Works with or without web search, using available data sources
5. **Academic Quality** - PhD-level writing with proper citations and flowing prose

