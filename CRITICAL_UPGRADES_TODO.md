# 🔧 CRITICAL UPGRADES TODO

## High Priority (Fix Now)

### 1. ✅ **FIX: Merge Button Not Working**
**Problem:** 
- User tried to merge TAM query
- Merge button disappeared
- TAM section didn't rewrite with new data

**Root Cause:**
- Advanced query now uses new API endpoint
- Merge logic needs to handle the new response format
- Missing visual feedback during merge

**Solution:**
- Fix merge button handling
- Add proper loading state
- Show section updating in real-time
- Save merged content to database

**Status:** 🔴 BROKEN - Needs immediate fix

---

### 2. ⚠️ **Project Chats Should Appear in Recents**
**Problem:**
- Project chats only show in Projects dropdown
- Recents only shows orphaned chats
- Users can't see all their recent work in one place

**Solution:**
- "Recents" should show ALL conversations (sorted by date)
- Add project color dot + name next to project chats in Recents
- Clicking a project chat in Recents opens it in that project context
- No duplicates - just one comprehensive view

**Example:**
```
📋 Recents
  • Research: Army AI (just now) 🔵 DOD Research
  • Cybersecurity Market (2 hours ago)
  • Defense Contracts (yesterday) 🟢 Q4 2024 Reports
```

**Status:** 🟡 High Priority

---

### 3. 🧠 **LLM-Powered Query Parsing (Main Input)**
**Problem:**
- Users type raw queries: "army ai contracts last 3 months"
- Tool does basic parsing for dates
- Missing intelligent prompt engineering

**Solution:**
- Main input → LLM analyzes query
- Extracts:
  - Research topic ("army ai contracts")
  - Date range ("last 3 months")
  - Semantic keywords for better search
  - Report focus (TAM, competition, funding, etc.)
- Creates optimized search prompt
- Shows user what was parsed

**Example:**
```
User Input: "army ai contracts last 3 months"

LLM Parsed:
✅ Topic: Army artificial intelligence contracts
✅ Date Range: Nov 10, 2024 - Feb 10, 2025
✅ Keywords: military AI, defense contracts, DoD machine learning
✅ Focus Areas: Funding, Competition, Market Size
```

**Status:** 🟡 High Priority

---

### 4. 🔧 **Advanced Query: Change Parameters & Regenerate**
**Problem:**
- Advanced query only adds text to sections
- Can't change date ranges, focus areas, or regenerate sections
- Limited flexibility

**Solution:**
- Advanced query detects parameter changes:
  - "Show me 2022 data instead" → changes date range
  - "Focus on small business" → changes filter
  - "Add more competition analysis" → regenerates competition section
- Smart detection: "This will regenerate 3 sections: TAM, Market Size, Competition"
- User confirms → regenerates affected sections with new parameters
- Merge with confirmation dialog

**Example:**
```
Advanced Query: "what would be the TAM for 2022 not 2024"

AI Detects:
⚠️ Date range change: 2024 → 2022
⚠️ Affected sections: Background, TAM, Market Size, Funding

Prompt:
"This will regenerate 4 sections with 2022 data. Continue?"
[Cancel] [Regenerate Sections]
```

**Status:** 🟡 High Priority

---

## Medium Priority

### 5. 📊 **Serper API Setup**
**Current Status:**
- Serper API key NOT set in Vercel
- Web enrichment disabled
- Tool works fine with database only

**Question:**
Do you need Serper API for "ChatGPT browser research"?

**Answer:**
- **For current tool:** No, semantic search + 290K database is powerful enough
- **For enrichment:** Yes, adds live company intelligence
- **Cost:** $50/month for 5,000 searches

**Recommendation:**
- Test tool without Serper first
- See if 290K database + semantic search is enough
- Add Serper later if you need:
  - Live company intelligence
  - Recent news
  - CEO names, funding, employee counts

**Status:** 🟢 Optional - Test without it first

---

### 6. 🎨 **Visual Improvements**
- Show data sources being searched in real-time
- Better loading animations
- Merge progress indicator
- Parameter change detection UI

**Status:** 🟢 Enhancement

---

## Implementation Order

### Phase 1: Fix Critical Issues (Now)
1. ✅ Fix merge button functionality
2. ✅ Show merge in progress
3. ✅ Update section with new data
4. ✅ Save to database

### Phase 2: Better UX (Next)
1. ✅ Project chats in Recents
2. ✅ Smart "Recents" list (all chats, project indicators)
3. ✅ Click from Recents → opens in project context

### Phase 3: Intelligence (After)
1. ✅ LLM-powered query parsing
2. ✅ Advanced query parameter detection
3. ✅ Smart regeneration with warnings
4. ✅ Multi-section regeneration

---

## Technical Details

### Merge Fix (Priority 1)
**Files to modify:**
- `components/matrix/AdvancedQueryPanel.tsx`
  - Fix handleQuery to preserve data sources
  - Show loading state
- `components/matrix/MatrixChat.tsx`
  - Fix handleAdvancedQuery merge logic
  - Add visual feedback
  - Proper database save

### Recents Fix (Priority 2)
**Files to modify:**
- `components/matrix/MatrixSidebar.tsx`
  - Query ALL conversations (not filtered by project_id)
  - Sort by updated_at DESC
  - Show project indicator (color dot + name)
  - onSelectChat updates both chatId and projectId
- `app/api/matrix/conversations/route.ts`
  - Add "all=true" parameter for comprehensive list

### Query Parsing (Priority 3)
**New endpoint:**
- `app/api/matrix/parse-query/route.ts`
  - Uses OpenAI to analyze query
  - Extracts parameters
  - Returns structured data

### Smart Regeneration (Priority 4)
**Files to modify:**
- `components/matrix/AdvancedQueryPanel.tsx`
  - Detect parameter changes
  - Show affected sections
  - Confirm before regenerating
- `app/api/matrix/advanced-query/route.ts`
  - Return affected sections
  - Support parameter updates

---

## Testing Plan

### Test 1: Merge Fix
```
1. Generate report: "army ai"
2. Open Advanced Query on TAM section
3. Ask: "what would be the TAM for 2022 not 2024"
4. Click Merge
5. Expected: TAM section updates with 2022 data
```

### Test 2: Recents with Projects
```
1. Create project "DOD Research"
2. Generate report in that project
3. Check "Recents" sidebar
4. Expected: See report with 🔵 DOD Research indicator
5. Click it → opens in DOD Research project view
```

### Test 3: Smart Query Parsing
```
1. Type: "army ai contracts last 3 months for small business"
2. Expected: Shows parsed parameters
3. Searches with optimized query
```

---

## Current Priorities

**RIGHT NOW:**
1. Fix merge button (30 min)
2. Test merge with TAM query

**TODAY:**
3. Project chats in Recents (1 hour)
4. Test comprehensive Recents view

**THIS WEEK:**
5. LLM query parsing (2 hours)
6. Smart regeneration (3 hours)
7. Add Serper API (optional, based on testing)

---

## Questions for User

1. **Serper API:** Test without it first, or add now?
2. **Merge behavior:** Should merge append or replace section content?
3. **Regeneration:** Confirm dialog before regenerating multiple sections?

