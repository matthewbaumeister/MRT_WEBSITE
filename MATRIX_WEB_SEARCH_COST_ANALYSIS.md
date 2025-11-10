# MATRIX Web Search & Research Agent - Cost Analysis

## Overview
Adding LLM-powered web search to MATRIX for supplementing our closed database research.

---

## Cost Breakdown

### Option 1: Per-Section Web Search (RECOMMENDED)
**Strategy**: Run one web search per report section (10 searches total)

#### Costs Per Report:
- **OpenAI GPT-4o-mini API**: ~$0.15-0.30/section × 10 sections = **$1.50-3.00**
- **Web Search API** (e.g., Serper, Tavily):
  - Serper: $0.001 per search × 100 searches (10 per section) = **$0.10**
  - Tavily: $0.003 per search × 100 searches = **$0.30**
- **Total per report**: **$1.60-3.30**

#### Benefits:
✅ Most thorough research  
✅ Section-specific queries get better results  
✅ Can customize search depth per section  
✅ More data sources cited  
✅ Better quality final report  

#### Timing:
- Adds ~3-5 seconds per section
- Total report time: 3-5 minutes (vs 2-3 minutes without)

---

### Option 2: Single Large Query
**Strategy**: One comprehensive web search for entire topic, then distribute findings

#### Costs Per Report:
- **OpenAI GPT-4o-mini API**: 
  - Initial large query: ~$0.50-1.00
  - Section generation: ~$1.50-3.00
  - Total: **$2.00-4.00**
- **Web Search API**: 
  - 50-100 searches for comprehensive coverage: **$0.05-0.30**
- **Total per report**: **$2.05-4.30**

#### Downsides:
❌ Less focused results per section  
❌ May miss section-specific nuances  
❌ Harder to attribute sources to sections  
❌ Potentially more expensive  
❌ More tokens used in context  

---

## Recommended Approach: **Per-Section + Smart Caching**

### Implementation:
```
1. Generate report outline (no cost)
2. For each of 10 sections:
   a. Run 5-10 targeted web searches ($0.01-0.03)
   b. Generate section with web context ($0.15-0.30)
   c. Cache results for related sections
3. Conclusion section uses ALL previous data (no additional search)

Total: $1.60-3.30 per report
```

### Why This Works Best:
1. **Section-Specific**: Each section gets relevant, recent web data
2. **Cost-Effective**: Only pay for what you use
3. **High Quality**: More targeted results = better report
4. **Attributable**: Can cite specific web sources per section
5. **Scalable**: Can adjust search depth based on user tier

---

## Web Search API Options

### 1. Serper API (RECOMMENDED)
- **Cost**: $50/month for 5,000 searches = $0.01/search
- **Features**: Google search results, news, scholar
- **Pros**: Cheap, fast, reliable
- **Cons**: Rate limits
- **Best for**: Production use

### 2. Tavily AI
- **Cost**: $0.003/search (first 1000 free)
- **Features**: AI-optimized search, research mode
- **Pros**: Built for LLM research, smart filtering
- **Cons**: More expensive
- **Best for**: High-quality research

### 3. Exa (formerly Metaphor)
- **Cost**: $29/month for 1,000 searches = $0.029/search
- **Features**: Semantic search, AI-native
- **Pros**: Best semantic understanding
- **Cons**: Most expensive
- **Best for**: Complex queries

### 4. SerpAPI
- **Cost**: $50/month for 5,000 searches = $0.01/search
- **Features**: Multiple search engines
- **Pros**: Flexible, many engines
- **Cons**: Can be slow
- **Best for**: Diverse sources

---

## Cost Comparison: Monthly Usage

### Scenario: 100 Reports/Month

| Approach | OpenAI | Web Search | Total/Month | Per Report |
|----------|--------|------------|-------------|------------|
| No Web Search | $150-300 | $0 | $150-300 | $1.50-3.00 |
| Per-Section (Serper) | $150-300 | $50 | $200-350 | $2.00-3.50 |
| Per-Section (Tavily) | $150-300 | $100 | $250-400 | $2.50-4.00 |
| Single Query | $200-400 | $25 | $225-425 | $2.25-4.25 |

### Scenario: 500 Reports/Month

| Approach | OpenAI | Web Search | Total/Month | Per Report |
|----------|--------|------------|-------------|------------|
| No Web Search | $750-1,500 | $0 | $750-1,500 | $1.50-3.00 |
| Per-Section (Serper) | $750-1,500 | $250 | $1,000-1,750 | $2.00-3.50 |
| Per-Section (Tavily) | $750-1,500 | $500 | $1,250-2,000 | $2.50-4.00 |

---

## ROI Analysis

### Value Add:
- **Without Web Search**: Good report from closed databases
- **With Web Search**: 
  - Recent news and announcements (last 6 months)
  - Latest funding rounds and contracts
  - Current market sentiment
  - Recent technology developments
  - Latest regulatory changes
  - Competitive intelligence updates

### Worth It?
**YES** - for these reasons:
1. **Recency**: Our databases may be outdated, web search adds current data
2. **Completeness**: Fills gaps in our coverage
3. **Credibility**: More sources = more trusted reports
4. **Competitive Advantage**: Better reports than competitors
5. **Low Cost**: $1-2 extra per report for significantly better quality

---

## Implementation Recommendation

### Phase 1: MVP (IMMEDIATE)
```
✅ Enable web search toggle in settings
✅ Use Serper API ($50/month)
✅ 5 searches per section (50 total per report)
✅ Cost: ~$2.00-3.50 per report
✅ Monitor usage and quality
```

### Phase 2: Optimization (MONTH 2)
```
- Implement smart caching
- Add result quality scoring
- Cache common queries (e.g., "SBIR funding")
- Reduce redundant searches
- Target: $1.50-2.50 per report
```

### Phase 3: Advanced (MONTH 3)
```
- Multi-source aggregation (Serper + Tavily)
- User-configurable search depth
- Tier-based features:
  * General: 3 searches/section ($1.00 extra)
  * Pro: 5 searches/section ($1.50 extra)
  * Enterprise: 10 searches/section ($2.50 extra)
```

---

## Technical Implementation

### Architecture:
```typescript
// Per section:
1. Generate initial content from our databases
2. Identify key entities (companies, programs, etc.)
3. Run targeted web searches:
   - "[Company] recent contracts 2024"
   - "[Program] latest awards"
   - "[Technology] DOD applications"
4. Parse and extract relevant facts
5. Merge web findings with database content
6. Generate final section with all sources cited
```

### Search Strategy:
```typescript
const searchQueries = {
  background: [
    `${topic} DOD contracts 2024`,
    `${topic} recent news`,
    `${topic} market analysis`
  ],
  funding: [
    `${topic} SBIR awards 2024`,
    `${topic} funding rounds`,
    `${topic} investment news`
  ],
  competition: [
    `${topic} major companies`,
    `${topic} contract winners`,
    `${topic} competitive landscape`
  ]
  // ... etc for each section
};
```

---

## Alternatives to Consider

### Option A: Pre-built Research APIs
- **Perplexity API**: $5/1000 requests = $0.005/request
  - Pros: All-in-one, handles search + LLM
  - Cons: Less control, expensive at scale

### Option B: Custom Scraping
- **Cost**: Development time + proxy services ($100-500/month)
  - Pros: Full control, no per-search cost
  - Cons: Maintenance, legal risks, breaking

### Option C: Hybrid Approach
- **Strategy**: Web search for new topics, database for known topics
  - Pros: Optimize costs based on data coverage
  - Cons: Complex logic, harder to implement

---

## Decision Matrix

| Factor | No Web Search | Per-Section | Single Query |
|--------|---------------|-------------|--------------|
| **Cost** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Quality** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Recency** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Attribution** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Winner**: Per-Section Approach

---

## Final Recommendation

### IMPLEMENT: Per-Section Web Search
- **Why**: Best balance of cost, quality, and speed
- **Cost**: $1.60-3.30 per report
- **Provider**: Start with Serper API
- **Searches**: 5-10 per section = 50-100 total
- **Timeline**: Can implement in 1-2 days
- **ROI**: High - significantly better reports for minimal cost increase

### Start Small, Scale Smart:
1. **Week 1**: Test with 10 reports, measure quality improvement
2. **Week 2**: Optimize queries, reduce redundant searches
3. **Week 3**: Add caching, implement tier-based limits
4. **Week 4**: Roll out to all users with usage tracking

### Success Metrics:
- Report quality score (user ratings)
- Data source count per report
- Recency of information cited
- Cost per report
- User satisfaction scores

---

## Questions Answered

**Q: Web search per section or one large query?**  
A: **Per section** - better quality, similar cost, more thorough

**Q: How much does it cost?**  
A: **$1.60-3.30 per report** (adds ~$1 to current cost)

**Q: Is it worth it?**  
A: **Absolutely** - fills data gaps, adds recency, improves credibility

**Q: Which API?**  
A: **Serper** to start (cheap, reliable), **Tavily** for premium tier later

**Q: How to implement?**  
A: Add search step before each section generation, merge results

---

## Next Steps

1. ✅ Add web search toggle to settings (already have this)
2. ⏳ Sign up for Serper API account
3. ⏳ Implement search function in report generation
4. ⏳ Test with 5-10 reports
5. ⏳ Measure quality improvement
6. ⏳ Roll out to production

**Estimated Development Time**: 4-8 hours  
**Estimated Testing Time**: 2-4 hours  
**Total**: 1-2 days to production-ready

---

Ready to implement! The per-section approach is clearly the winner. 🚀

