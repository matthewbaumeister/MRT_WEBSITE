# MATRIX Testing Guide - New Features

## Quick Start Testing Checklist

### Prerequisites
1. ✅ Website deployed (should be live now)
2. ⏳ Run SQL scripts in Supabase (see below)
3. ✅ OpenAI API key set in Vercel
4. ✅ Logged into your account

## Feature 1: Updated Welcome Text
**Status**: Ready to test immediately

### How to Test:
1. Go to https://makereadytech.com/matrix
2. Log in if needed
3. Check welcome screen shows: **"What do you want to start research on?"**
4. Check input placeholder says: **"What do you want to start research on?"**

**Expected**: Both should say "research" not "help"

---

## Feature 2: Small Business Focus Toggle
**Status**: Ready to test immediately

### How to Test:
1. On Matrix page, click the **sliders icon** (options menu) in the input bar
2. Scroll down past "Extended thinking", "Web search", "Research"
3. Find **"Small Business Focus"** toggle (has building icon)
4. Toggle it ON (should turn gold)
5. Expand to see help text showing data sources

**Expected**:
- Toggle turns gold when ON
- Shows: "DSIP, MANTECH, xTech, FUZE"
- Shows: "Coming soon: SBA Awards, FPDS Small Business data"

### What It Does:
When enabled, AI responses prioritize small business opportunities from:
- xTech (Army Innovation)
- MANTECH projects
- DSIP opportunities
- FUZE platform

---

## Feature 3: Live Search Status Updates
**Status**: Ready to test immediately

### How to Test:
1. Type any question: "Tell me about Army xTech"
2. Press submit
3. Watch for animated purple dots and "Researching..." text
4. Should see progressive status updates with gold checkmarks:
   - ✓ Initializing research...
   - ✓ Searching all available data sources...
   - ✓ Analyzing SBIR/STTR programs...
   - ✓ Reviewing government contracts...
   - ✓ Checking innovation opportunities...
   - ✓ Compiling results...
   - ✓ Generating response...

**Expected**: Real-time status list that builds progressively

**With Small Business Focus ON**: Different messages:
- ✓ Searching xTech (Army Innovation) historical data...
- ✓ Analyzing MANTECH manufacturing projects...
- ✓ Checking DSIP opportunities...
- ✓ Reviewing FUZE innovation platform...

---

## Feature 4: Market Research Report Mode ⭐️ BIG FEATURE
**Status**: Ready to test immediately

### How to Test:

#### Step 1: Trigger Report Mode
1. Go to Matrix (fresh page)
2. Type a research topic: **"AI-powered surveillance drones for border security"**
3. Press submit
4. UI should transform into report mode

#### Step 2: Verify Report Structure
**Expected to see**:
- Header changes to "Market Research Report"
- 10 numbered sections appear:
  1. Background & Market Overview
  2. Funding & Investment Landscape
  3. Market Size & Revenue Analysis
  4. Total Addressable Market (TAM)
  5. Competitive Analysis
  6. Technology Trends & Innovation
  7. USG Mission Alignment
  8. Regulatory Environment
  9. Barriers to Entry & Risk Assessment
  10. Conclusions & Recommendations

#### Step 3: Watch Generation
**Expected**:
- Sections appear with loading spinner initially
- Each section populates with content progressively
- Status updates show "Researching [Section Name]..."
- Takes ~2-3 minutes for full report

#### Step 4: Test Section Interaction
1. Click any section header to expand/collapse
2. Click a section to select it
3. Should see "Advanced Query Panel" toggle button appear (top right)

**Expected**:
- Sections expand/collapse smoothly
- Content appears in paragraph format
- Data source tags show at bottom (xTech, MANTECH, DSIP)

---

## Feature 5: Advanced Query Panel ⭐️ BIG FEATURE
**Status**: Ready to test immediately (only in report mode)

### How to Test:

#### Step 1: Open Panel
1. In report mode (after generating report)
2. Click **search icon** in top-right header
3. Right sidebar should slide in

**Expected**: 
- Panel title: "Advanced Query"
- Shows: "Query entire research report" by default

#### Step 2: Section-Specific Query
1. Click on a report section (e.g., "Competitive Analysis")
2. Panel should update
3. Shows: "Querying: Competitive Analysis"

**Expected**: Panel indicates which section is selected

#### Step 3: Run a Query
1. Type in query box: "What are the top 3 competitors?"
2. Click "Run Query"
3. Wait for results

**Expected**:
- Loading spinner appears
- Results display in gray box
- "Merge to Report" button appears

#### Step 4: Test Merge Functionality
1. After getting results, click "Merge to Report"
2. Type merge instructions: "Add competitor pricing information"
3. Click "Apply Merge"

**Expected**:
- Section updates with new content appended
- Query and results clear
- Panel stays open for more queries

#### Step 5: Test Full Report Query
1. Don't click any section (or click away from sections)
2. Type query: "What's the total market size?"
3. Run query

**Expected**: 
- Panel shows "Query entire research report"
- Returns information synthesized from all sections

---

## Feature 6: Projects Feature 🔴 REQUIRES SQL SETUP
**Status**: ⏳ Needs SQL scripts run in Supabase first

### Required Setup (ONE-TIME):
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Click "New Query"
4. **FIRST**: Copy/paste contents of `SUPABASE_MATRIX_TABLES.sql`
5. Click "Run"
6. Wait for "Success"
7. **SECOND**: Copy/paste contents of `SUPABASE_MATRIX_PROJECTS.sql`
8. Click "Run"
9. Wait for "Success"

### After SQL Setup, Test:

#### Step 1: Open Projects
1. In Matrix, click "Projects" in left sidebar
2. Should expand with arrow animation

**Expected**:
- Shows "All Chats" option
- Shows "No projects" message
- Shows "+ New Project" button

#### Step 2: Create Project
1. Click "+ New Project"
2. Modal should appear
3. Enter name: "Army Innovation Research"
4. Enter description: "xTech and MANTECH opportunities"
5. Pick a color (try Gold)
6. Click "Create"

**Expected**:
- Modal closes
- Project appears in list with gold dot
- Can click project to filter chats

#### Step 3: Test Project Features
1. Click project name to select
2. Header should show "Project Active"
3. Click "All Chats" to clear filter
4. Click trash icon to delete project
5. Confirmation dialog appears

**Expected**:
- Projects save to database
- Filtering works
- Delete requires confirmation

---

## Mobile Testing

### Test on Phone/Tablet:
1. Visit site on mobile device
2. Sidebar should hide by default
3. Hamburger menu toggles sidebar
4. Advanced panel should overlay on mobile
5. Report sections should be scrollable
6. All features should be touch-friendly

---

## Common Issues & Solutions

### Issue: "Supabase URL and key must be set"
**Solution**: This was a build error we fixed. Should be resolved now.

### Issue: Projects not loading
**Solution**: Run the SQL scripts in correct order (TABLES first, then PROJECTS)

### Issue: Report sections not generating
**Solution**: 
- Check browser console for errors
- Verify OpenAI API key is set
- Check network tab for failed requests

### Issue: Advanced panel not appearing
**Solution**: Only appears in report mode (after first query generates report)

### Issue: Sections show "Generating content..."
**Solution**: Normal - they populate progressively. Wait 2-3 minutes for full report.

---

## Full Test Scenario (Recommended)

### Complete Workflow Test:
```
1. Log in → https://makereadytech.com/matrix
2. Verify welcome text changed ✓
3. Open settings → Test Small Business Focus toggle ✓
4. Type: "Autonomous vehicle technology for military"
5. Submit → Watch live search status updates ✓
6. Report generates with 10 sections ✓
7. Click Section 5 (Competitive Analysis)
8. Advanced panel opens ✓
9. Query: "Who has recent Army contracts?"
10. Results appear ✓
11. Merge with instructions ✓
12. Section updates ✓
13. Left sidebar → Projects ✓
14. Create new project "AV Research" ✓
15. Project appears in list ✓
```

---

## Performance Expectations

### Report Generation:
- **Full Report**: 2-3 minutes (10 sections × ~15 seconds each)
- **Single Query**: 3-5 seconds
- **Advanced Query**: 3-5 seconds
- **Merge**: 3-5 seconds

### Network:
- Each section = 1 API call to OpenAI
- Advanced queries = 1 API call each
- Projects = Supabase queries (instant)

---

## What to Look For (Quality Check)

### Good Signs:
✅ Sections have substantive content (3-5 paragraphs)
✅ Data sources mentioned (xTech, MANTECH, etc.)
✅ Professional tone and formatting
✅ DOD/USG context included
✅ Numbers and statistics where applicable
✅ Smooth animations and transitions
✅ No console errors

### Red Flags:
❌ Sections are very short (1-2 sentences)
❌ Generic content not specific to topic
❌ No DOD/USG context
❌ Console errors
❌ UI elements not responding
❌ Slow or hanging requests

---

## Browser DevTools (Advanced)

### Check Network Tab:
1. Open DevTools (F12)
2. Go to Network tab
3. Submit query
4. Look for `/api/matrix/chat` calls
5. Should see:
   - Status: 200 OK
   - Response time: 3-15 seconds
   - Response includes message.content

### Check Console:
- Should be clean (no red errors)
- May see info logs (that's fine)

---

## Feedback & Iteration

### What to Note:
- Which features work well
- Which are confusing
- UI/UX issues
- Content quality issues
- Performance problems
- Feature requests

### Quick Fixes Available:
- Section content too short → Adjust prompts
- Generation too slow → Optimize or parallelize
- UI tweaks → CSS/layout changes
- More sections needed → Easy to add
- Different section focus → Modify prompts

---

## Next Steps After Testing

Once features are tested and working:
1. Generate actual reports on real topics
2. Test with different industries/technologies
3. Compare report quality with/without Small Business Focus
4. Create projects for organizing research
5. Use advanced queries to refine sections
6. Export/save important reports (future feature)

---

## Support

If you find issues:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify SQL scripts ran successfully
4. Check Vercel deployment logs
5. Test in different browser (Chrome/Firefox/Safari)

---

## Summary

**Immediately Testable** (No setup required):
- ✅ Welcome text changes
- ✅ Small Business Focus toggle
- ✅ Live search status
- ✅ Market Research Report mode
- ✅ Advanced Query Panel

**Requires SQL Setup**:
- ⏳ Projects feature (run 2 SQL files first)

**Estimated Testing Time**:
- Quick test: 5-10 minutes
- Full test: 20-30 minutes
- Comprehensive: 1 hour

Ready to test! Start with the report generation - that's the most impressive feature! 🚀

