# 🧪 Testing GPT-4o Enrichment - Quick Guide

## ✅ What We Just Deployed

**GPT-4o per-section enrichment** for professional-grade market intelligence!

---

## 🎯 Test #1: Generate a Report (2 minutes)

### Steps:
```
1. Open https://matrix.makereadytech.com
2. Log in
3. Click "+ New Chat" (top left sidebar)
4. Type: "defense ai contracts"
5. Press Enter or click Generate
6. ⏰ Wait ~90 seconds
```

### What to Watch For:

#### Phase 1: Section Generation (~60 sec)
```
Section 1: Background & Market Overview
  🔵 Searching MATRIX proprietary database...
  ✅ Complete!

Section 2: Funding & Investment Landscape
  🔵 Searching MATRIX proprietary database...
  ✅ Complete!

... (continues for all 10 sections)
```

#### Phase 2: GPT-4o Enrichment (~30 sec)
```
Section 1: Background & Market Overview
  🟢 Enriching with GPT-4o intelligence...
  ✅ Complete!

Section 2: Funding & Investment Landscape
  🟢 Enriching with GPT-4o intelligence...
  ✅ Complete!

... (continues for all 10 sections)
```

---

## 🎯 Test #2: Verify Intelligence Quality

### Check Any Section:
```
1. Expand "Background & Market Overview" (or any section)
2. Scroll through content
3. Look for:
   ✅ Company websites: https://company.com
   ✅ Employee counts: "500-1000 employees"
   ✅ Revenue data: "$50M annually"
   ✅ Locations: "San Francisco, CA"
   ✅ Executives: "Jane Doe (CEO)"
   ✅ Gov contractor info: "GSA Schedule 70"
   ✅ Citations: [Source: https://...]
```

### Good Example:
```
Palantir Technologies is a leading defense AI contractor 
based in Denver, CO with approximately 3,800 employees 
[Source: https://linkedin.com/company/palantir]. The company, 
led by CEO Alex Karp, specializes in data analytics platforms 
and has secured over $2B in government contracts since 2020 
[Source: https://fpds.gov].
```

### Bad Example (means enrichment didn't work):
```
Palantir is a company that works on AI. They have contracts.
```

---

## 🎯 Test #3: Check Console Logs

### Open Browser Console:
```
Chrome/Edge: Press F12 → Click "Console" tab
Safari: Cmd+Option+C → Click "Console"
```

### Look For These Logs:

#### During Generation:
```
[API] Searching Supabase for: defense ai contracts
[API] ✅ Found 1250 results from 8 tables
[API] 📎 Extracted 150 URLs
```

#### During Enrichment:
```
🤖 Starting GPT-4o per-section enrichment...
[ENRICH] Section background: Background & Market Overview
[ENRICH] Found 5 companies: ["Palantir", "Anduril", ...]
[ENRICH] Searching web for company intelligence...
[ENRICH] Calling GPT-4o for intelligence synthesis...
[ENRICH] ✅ background: +520 chars, 5 companies, web: true
[ENRICH] Section funding: Funding & Investment Landscape
[ENRICH] ✅ funding: +480 chars, 3 companies, web: true
...
✅ GPT-4o enrichment complete for all sections!
```

---

## 🎯 Test #4: Test Advanced Query (Fixed!)

### Steps:
```
1. In your generated report
2. Expand "TAM" section
3. Click magnifying glass icon (top right corner)
4. Advanced Query panel opens on right
5. Type: "what would be the tam for 2022"
6. Click "Run Query"
7. ⏰ Wait 5-10 seconds
```

### Expected Result:
```
✅ GOOD: Specific data with numbers
"Based on 2022 data from FPDS contracts and market 
analysis, the total addressable market for defense AI 
was approximately $4.2B in 2022, growing from $3.1B 
in 2021..."

❌ BAD: Generic instructions
"To calculate TAM for 2022, you should:
1. Define the market
2. Gather sources..."
```

### Test Merge:
```
8. Scroll down in Advanced Query
9. Type in merge box: "add this 2022 data to the TAM section"
10. Click "Apply Merge to Report"
11. ✅ Button turns GREEN with checkmark
12. ✅ TAM section updates with new content at bottom
```

---

## 🎯 Test #5: Test "All Chats" (Fixed!)

### Steps:
```
1. Look at left sidebar
2. Click "Projects" dropdown (arrow icon)
3. Click "All Chats"
4. ✅ You should see your test report
5. ✅ If it's in a project, it has a colored dot 🔵
6. Hover over the dot
7. ✅ Tooltip shows project name
8. Click the chat
9. ✅ Opens correctly and loads full report
```

---

## ❌ Common Issues & Fixes

### Issue 1: Enrichment Doesn't Happen
**Symptom**: Sections generate but no "Enriching with GPT-4o" appears

**Check**:
```
Console logs should show:
❌ "OpenAI API key not configured"
```

**Fix**: OpenAI API key missing in Vercel
- Go to Vercel → Settings → Environment Variables
- Add `OPENAI_API_KEY` = your key
- Redeploy

---

### Issue 2: No Web Sources
**Symptom**: Companies mentioned but no websites/LinkedIn

**Check**:
```
Console logs should show:
⚠️ "Serper API not configured, skipping web search"
```

**Fix**: Serper API key missing (not critical, enrichment still works)
- Optional: Add `SERPER_API_KEY` in Vercel for web search

---

### Issue 3: Advanced Query Returns Instructions
**Symptom**: Generic "how to" instead of real answers

**Check**: Console for errors

**Possible Causes**:
- API timeout (try simpler query)
- No data found (try broader topic)
- OpenAI quota exceeded (check usage)

**Fix**: Check `/api/matrix/advanced-query` logs in Vercel

---

### Issue 4: Merge Button Disappears
**Should be fixed!** If still happens:

**Check**:
```
Console logs:
[MERGE] Starting merge
[MERGE] ❌ Merge error: ...
```

**Report**: Copy error and send to me

---

## 📊 Success Metrics

### After Testing, You Should Have:

- [ ] Report generated in ~90 seconds
- [ ] All 10 sections have content
- [ ] At least 5 companies mentioned with:
  - [ ] Website URLs
  - [ ] Employee counts or revenue
  - [ ] Location data
- [ ] Console shows `[ENRICH]` logs for all sections
- [ ] Advanced Query returns real data (not instructions)
- [ ] Merge button works and updates section
- [ ] "All Chats" shows your report

---

## 💰 Cost Check

### Monitor Your Usage:

**OpenAI**: https://platform.openai.com/usage
- Should see ~15,000 tokens per report
- Cost: ~$0.15-0.20 per report

**Serper**: https://serper.dev/dashboard (if configured)
- Should see ~30-40 searches per report
- Cost: ~$0.10 per report

**Total**: ~$0.25-0.30 per comprehensive report

---

## 🚀 Next Steps After Testing

### If Everything Works:
1. ✅ Report back: "All tests passed!"
2. Move to Phase 2: Smart prompt parsing

### If Something Doesn't Work:
1. ❌ Report which test failed
2. Copy console logs (especially `[ENRICH]` and `[MERGE]`)
3. Screenshot if helpful
4. I'll fix it immediately

---

## 🎉 Ready?

**Start with Test #1** (Generate a Report)

**Run it now and tell me**:
- ✅ What worked
- ❌ What didn't work
- 📋 Console logs if issues

Then we'll either:
- Fix any problems, or
- Move on to Phase 2 (smart features)!

**Let's go!** 🚀

