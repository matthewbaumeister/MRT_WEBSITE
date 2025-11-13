# Web Search API Options for MATRIX Enrichment

## Current Implementation
- **Serper API** - Google search results via `https://google.serper.dev/search`
- Requires `SERPER_API_KEY` environment variable
- Pricing: ~$50/month for 2,500 searches

---

## Option Comparison

### 1. **Bing Search API (Microsoft Azure)** ⭐ RECOMMENDED
**Official Microsoft API - No CAPTCHA issues**

**Pros:**
- ✅ Official API - no scraping, no CAPTCHAs
- ✅ Reliable and stable
- ✅ Free tier: 1,000 queries/month
- ✅ Paid: $4 per 1,000 queries (very affordable)
- ✅ Good quality results
- ✅ No rate limiting issues
- ✅ Easy to implement

**Cons:**
- ⚠️ Requires Azure account setup
- ⚠️ Slightly different result format than Google

**Pricing:**
- Free: 1,000 queries/month
- Paid: $4 per 1,000 queries after free tier
- **Cost for 2,500 searches/month: ~$6/month** (vs Serper's $50)

**Setup:**
1. Create Azure account
2. Create "Bing Search v7" resource
3. Get API key
4. Add `BING_SEARCH_API_KEY` to environment variables

**API Endpoint:**
```
https://api.bing.microsoft.com/v7.0/search
```

---

### 2. **Serper API** (Current)
**Google search results via proxy**

**Pros:**
- ✅ Google-quality results
- ✅ Easy to use
- ✅ Good documentation
- ✅ Already implemented

**Cons:**
- ❌ Expensive: ~$50/month for 2,500 searches
- ❌ Third-party service (dependency risk)
- ❌ Rate limits on free tier

**Pricing:**
- Free: 100 searches/month
- Paid: $50/month for 2,500 searches

---

### 3. **Bing Web Scraping** ❌ NOT RECOMMENDED
**Direct scraping of Bing.com**

**Pros:**
- ✅ Free (no API costs)

**Cons:**
- ❌ **CAPTCHA protection** - will get blocked
- ❌ Violates Bing's Terms of Service
- ❌ Unreliable - breaks frequently
- ❌ Requires complex bot detection bypass
- ❌ Legal/ethical concerns
- ❌ IP blocking risk
- ❌ Maintenance nightmare

**Verdict:** Don't do this. Use the official Bing API instead.

---

### 4. **Google Custom Search API**
**Official Google API**

**Pros:**
- ✅ Official Google API
- ✅ No CAPTCHAs
- ✅ Reliable

**Cons:**
- ❌ Limited to 100 queries/day free
- ❌ Expensive: $5 per 1,000 queries after free tier
- ❌ Requires custom search engine setup
- ❌ More complex setup than Bing

**Pricing:**
- Free: 100 queries/day (3,000/month)
- Paid: $5 per 1,000 queries

---

### 5. **Tavily AI Search API** ⭐ ALTERNATIVE
**AI-optimized search for LLMs**

**Pros:**
- ✅ Designed specifically for LLM/RAG applications
- ✅ Returns structured, relevant results
- ✅ Good for research queries
- ✅ Reasonable pricing

**Cons:**
- ⚠️ Newer service (less proven)
- ⚠️ Different result format

**Pricing:**
- Free: 1,000 queries/month
- Paid: $20/month for 5,000 queries

---

### 6. **SerpAPI**
**Google/Bing search results**

**Pros:**
- ✅ Supports both Google and Bing
- ✅ Good documentation

**Cons:**
- ❌ Expensive: $50/month for 5,000 searches
- ❌ Similar to Serper

**Pricing:**
- Free: 100 searches/month
- Paid: $50/month for 5,000 searches

---

## Recommendation: **Bing Search API**

### Why Bing Search API?
1. **Cost-effective**: $6/month vs $50/month (Serper)
2. **Official API**: No CAPTCHA, no scraping issues
3. **Reliable**: Microsoft infrastructure
4. **Easy setup**: Simple API key authentication
5. **Good results**: Quality comparable to Google for most queries

### Implementation Plan
1. Add Bing Search API support alongside Serper
2. Use Bing as primary, Serper as fallback
3. Allow configuration via environment variable
4. Maintain backward compatibility

---

## Cost Comparison (2,500 searches/month)

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| **Bing Search API** | **$6** | Best value |
| Serper API | $50 | Current |
| Google Custom Search | $12.50 | Limited free tier |
| Tavily AI | $20 | AI-optimized |
| SerpAPI | $50 | Similar to Serper |
| Bing Scraping | $0 | ❌ Not viable (CAPTCHAs) |

---

## Implementation

### Option 1: Switch to Bing Search API
- Replace Serper with Bing
- Save ~$44/month
- More reliable (official API)

### Option 2: Multi-provider Support
- Support both Bing and Serper
- Use Bing as primary, Serper as fallback
- Allow users to choose provider

### Option 3: Hybrid Approach
- Use Bing for most queries
- Use Serper for specific high-priority queries
- Best of both worlds

---

## Next Steps

1. **Get Bing Search API Key:**
   - Go to https://portal.azure.com
   - Create "Bing Search v7" resource
   - Copy API key

2. **Add to Environment Variables:**
   ```
   BING_SEARCH_API_KEY=your_key_here
   ```

3. **Update Code:**
   - Add Bing search function
   - Update enrichment route to use Bing
   - Keep Serper as fallback option

---

## Code Example: Bing Search API

```typescript
async function searchBing(query: string, numResults: number = 3) {
  const apiKey = process.env.BING_SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('BING_SEARCH_API_KEY not configured');
  }

  const response = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${numResults}`,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
      },
    }
  );

  const data = await response.json();
  
  return data.webPages?.value?.map((result: any) => ({
    title: result.name,
    link: result.url,
    snippet: result.snippet,
    date: result.dateLastCrawled,
  })) || [];
}
```

---

## Conclusion

**Best Option: Bing Search API**
- Official Microsoft API
- No CAPTCHA issues
- Cost-effective ($6/month vs $50/month)
- Reliable and easy to implement
- Good quality results

**Don't Use: Direct Bing Scraping**
- Will hit CAPTCHAs
- Violates Terms of Service
- Unreliable and maintenance-heavy

