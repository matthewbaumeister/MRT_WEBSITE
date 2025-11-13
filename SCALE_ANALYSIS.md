# Web Search at Scale - Analysis & Recommendations

## Current Usage Pattern

### Per Report Calculation:
- **10 sections** per report
- **Up to 8 companies** extracted per section
- **8 search queries** per company:
  1. `{company} official website`
  2. `{company} CEO president leadership team`
  3. `{company} headquarters location address`
  4. `{company} employees headcount workforce size`
  5. `{company} revenue financial information`
  6. `{company} defense contracts DOD awards`
  7. `{company} government contractor GSA CAGE code`
  8. `{company} recent news 2024 2025`

**Maximum searches per report:**
- 10 sections × 8 companies × 8 queries = **640 searches per report**

**Realistic average (not all sections have 8 companies):**
- Average: 3-4 companies per section
- 10 sections × 4 companies × 8 queries = **320 searches per report**

---

## Scale Scenarios

### Scenario 1: Low Volume (10 reports/month)
- **Searches:** 10 reports × 320 = **3,200 searches/month**
- **Bing Cost:** 1,000 free + (2,200 × $0.004) = **$8.80/month**
- **Serper Cost:** **$50/month** (2,500 included, then $0.02/search)
- **Savings with Bing:** $41.20/month

### Scenario 2: Medium Volume (50 reports/month)
- **Searches:** 50 reports × 320 = **16,000 searches/month**
- **Bing Cost:** 1,000 free + (15,000 × $0.004) = **$60/month**
- **Serper Cost:** **$50/month** (2,500) + (13,500 × $0.02) = **$320/month**
- **Savings with Bing:** $260/month

### Scenario 3: High Volume (200 reports/month)
- **Searches:** 200 reports × 320 = **64,000 searches/month**
- **Bing Cost:** 1,000 free + (63,000 × $0.004) = **$252/month**
- **Serper Cost:** **$50/month** (2,500) + (61,500 × $0.02) = **$1,280/month**
- **Savings with Bing:** $1,028/month

---

## Cost Comparison at Scale

| Monthly Reports | Searches/Month | Bing Cost | Serper Cost | Savings |
|----------------|----------------|-----------|-------------|---------|
| 10 | 3,200 | **$8.80** | $50 | $41.20 |
| 25 | 8,000 | **$28** | $160 | $132 |
| 50 | 16,000 | **$60** | $320 | $260 |
| 100 | 32,000 | **$124** | $640 | $516 |
| 200 | 64,000 | **$252** | $1,280 | $1,028 |
| 500 | 160,000 | **$636** | $3,200 | $2,564 |

**Key Insight:** Bing is **8-10x cheaper** at scale than Serper.

---

## Optimization Strategies for Scale

### 1. **Caching Strategy** ⭐ HIGHEST IMPACT
**Problem:** Same companies searched repeatedly across reports

**Solution:** Cache search results in database
- Store: `company_name`, `query_type`, `results`, `timestamp`
- Cache TTL: 7-30 days (company info doesn't change daily)
- **Impact:** Reduce searches by 60-80%

**Example:**
- Without cache: 320 searches/report
- With cache: 64-128 searches/report (80% reduction)
- **Cost at 50 reports/month:** $60 → **$12-24/month**

**Implementation:**
```sql
CREATE TABLE search_cache (
  id UUID PRIMARY KEY,
  company_name TEXT,
  query_type TEXT,
  results JSONB,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  UNIQUE(company_name, query_type)
);
```

### 2. **Smart Query Reduction**
**Current:** 8 queries per company (always)

**Optimized:** Only search what's missing
- If company website found → skip "official website" query
- If CEO found → skip "CEO" query
- If revenue found → skip "revenue" query
- **Impact:** Reduce searches by 30-40%

### 3. **Batch Processing**
**Current:** Sequential searches (one at a time)

**Optimized:** Batch multiple queries
- Group queries by company
- Process in parallel (with rate limiting)
- **Impact:** Faster generation, same cost

### 4. **Priority-Based Search**
**Current:** Search all companies equally

**Optimized:** Prioritize important companies
- Search top 3-4 companies per section thoroughly
- Search remaining companies with fewer queries
- **Impact:** Reduce searches by 20-30%

### 5. **Rate Limiting & Retry Logic**
**For Scale:**
- Implement exponential backoff
- Handle rate limits gracefully
- Queue searches if needed
- **Impact:** Prevents API errors, maintains reliability

---

## Recommended Architecture for Scale

### Phase 1: Start with Bing (Immediate)
✅ **Switch to Bing Search API**
- Cost: $6-60/month (vs $50-320/month)
- No code changes needed (already implemented)
- Just add `BING_SEARCH_API_KEY` to environment

### Phase 2: Add Caching (High ROI)
✅ **Implement search result caching**
- Store results in Supabase
- Cache for 7-30 days
- **ROI:** 60-80% cost reduction
- **Time to implement:** 2-4 hours

### Phase 3: Smart Query Optimization
✅ **Reduce redundant searches**
- Skip queries when data already found
- Prioritize important companies
- **ROI:** Additional 20-30% reduction
- **Time to implement:** 1-2 hours

### Phase 4: Monitoring & Analytics
✅ **Track search usage**
- Monitor costs per report
- Identify optimization opportunities
- Set up alerts for unusual usage
- **ROI:** Better cost control

---

## Best Practice: Multi-Provider Strategy

### Primary: Bing Search API
- **Use for:** All standard searches
- **Why:** Cost-effective, reliable, official API
- **Cost:** $0.004 per search after free tier

### Fallback: Serper API
- **Use for:** When Bing fails or rate-limited
- **Why:** Backup reliability
- **Cost:** Only pay when used

### Future: Tavily AI (Optional)
- **Use for:** Research-heavy queries
- **Why:** AI-optimized for LLM context
- **Cost:** $20/month for 5,000 queries

**Implementation:** Already done! Code supports Bing → Serper fallback.

---

## Cost Optimization Roadmap

### Month 1: Switch to Bing
- **Action:** Add `BING_SEARCH_API_KEY`
- **Savings:** 80-90% cost reduction
- **Effort:** 5 minutes

### Month 2: Add Caching
- **Action:** Implement search cache table
- **Savings:** Additional 60-80% reduction
- **Effort:** 2-4 hours
- **New cost:** $2-10/month (vs original $50-320)

### Month 3: Smart Queries
- **Action:** Skip redundant searches
- **Savings:** Additional 20-30% reduction
- **Effort:** 1-2 hours
- **New cost:** $1-7/month

### Month 4: Monitor & Optimize
- **Action:** Track usage, identify patterns
- **Savings:** Continuous improvement
- **Effort:** Ongoing

---

## Recommendation for Your Scale

### If generating < 25 reports/month:
1. ✅ **Use Bing Search API** (already implemented)
2. ✅ **Add caching** (high ROI, easy to implement)
3. **Expected cost:** $2-10/month

### If generating 25-100 reports/month:
1. ✅ **Use Bing Search API**
2. ✅ **Add caching** (critical at this scale)
3. ✅ **Smart query optimization**
4. **Expected cost:** $10-50/month

### If generating 100+ reports/month:
1. ✅ **Use Bing Search API**
2. ✅ **Add caching** (essential)
3. ✅ **Smart query optimization**
4. ✅ **Consider Tavily AI** for research-heavy sections
5. ✅ **Implement rate limiting & queuing**
6. **Expected cost:** $50-200/month

---

## Implementation Priority

### 🔴 Critical (Do First):
1. **Switch to Bing** - 5 minutes, saves 80-90%
2. **Add caching** - 2-4 hours, saves 60-80% more

### 🟡 Important (Do Soon):
3. **Smart query reduction** - 1-2 hours, saves 20-30% more
4. **Rate limiting** - 1 hour, prevents errors

### 🟢 Nice to Have (Do Later):
5. **Monitoring dashboard** - Track costs
6. **Multi-provider analytics** - Compare Bing vs Serper quality

---

## Why NOT to Scrape Bing Directly

### Technical Issues:
- ❌ **CAPTCHAs** - Will block you immediately
- ❌ **IP blocking** - Your server IP will be banned
- ❌ **Unreliable** - Breaks constantly, maintenance nightmare
- ❌ **Legal risk** - Violates Terms of Service

### Cost Reality:
- ❌ **Time cost:** Hours debugging CAPTCHA bypasses
- ❌ **Infrastructure cost:** Need proxy rotation, CAPTCHA solving services
- ❌ **Opportunity cost:** Time spent on scraping = time not building features

### Better Alternative:
- ✅ **Bing API:** $0.004/search = $1.28 for 320 searches
- ✅ **No maintenance:** Official API, just works
- ✅ **Reliable:** 99.9% uptime guaranteed by Microsoft

**Verdict:** Scraping costs more in time/effort than just paying for the API.

---

## Final Recommendation

### For Scale Success:

1. **Start with Bing Search API** (already implemented)
   - Add `BING_SEARCH_API_KEY` to Vercel
   - Immediate 80-90% cost savings

2. **Add Caching Layer** (next priority)
   - Implement search cache in Supabase
   - Cache results for 7-30 days
   - Additional 60-80% cost reduction

3. **Optimize Queries** (after caching)
   - Skip redundant searches
   - Prioritize important companies
   - Additional 20-30% reduction

4. **Monitor & Iterate**
   - Track actual usage
   - Adjust cache TTL based on data freshness needs
   - Fine-tune query priorities

### Expected Final Cost:
- **Without optimization:** $50-320/month (Serper)
- **With Bing only:** $6-60/month
- **With Bing + Caching:** $2-12/month
- **With Bing + Caching + Optimization:** **$1-7/month**

**Total savings: 95-98% cost reduction** while maintaining quality.

---

## Next Steps

1. **Get Bing API Key:**
   - Go to https://portal.azure.com
   - Create "Bing Search v7" resource
   - Copy API key
   - Add to Vercel: `BING_SEARCH_API_KEY`

2. **Test Current Implementation:**
   - Generate a test report
   - Verify Bing is being used (check logs)
   - Confirm results quality

3. **Plan Caching Implementation:**
   - Design cache schema
   - Implement cache lookup
   - Set cache TTL strategy

4. **Monitor Usage:**
   - Track searches per report
   - Calculate actual costs
   - Identify optimization opportunities

