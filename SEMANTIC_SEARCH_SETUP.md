# 🧠 AI Semantic Search Setup Guide

## What is Semantic Search?

**Regular Keyword Search:**
- Searches for exact text matches
- "cyber defense" won't match "information security"
- "ai machine learning" won't match "artificial intelligence"

**AI Semantic Search:**
- Understands meaning and context
- "cyber defense" WILL match "information security"
- "ai machine learning" WILL match "artificial intelligence"  
- "body armor" WILL match "ballistic protection"
- Even handles misspellings and variations!

## How It Works

1. **Embeddings**: AI converts text into 1536-dimensional vectors (numbers)
2. **Similarity**: Vectors that are close together are semantically similar
3. **Fast Search**: Supabase pgvector finds similar vectors in milliseconds
4. **Smart Results**: Returns truly relevant matches, not just keyword matches

---

## 🚀 Step-by-Step Setup

### Step 1: Enable Vector Extension (5 minutes)

1. **Run the SQL script** in Supabase SQL Editor:
   ```bash
   SUPABASE_ENABLE_VECTOR_SEARCH.sql
   ```

2. **What it does:**
   - Enables pgvector extension
   - Creates `document_embeddings` table
   - Creates search function `search_documents_semantic()`
   - Sets up indexes for fast search

3. **Verify it worked:**
   ```sql
   -- Check if extension is enabled
   SELECT * FROM pg_extension WHERE extname = 'vector';
   
   -- Check if table exists
   SELECT COUNT(*) FROM document_embeddings;
   ```

---

### Step 2: Generate Embeddings for Your Data (1-2 hours)

⚠️ **IMPORTANT: This costs money!** Each embedding costs ~$0.0001 with OpenAI.

**Cost Estimate:**
- 1,000 records = ~$0.10
- 10,000 records = ~$1.00
- 100,000 records = ~$10.00
- **Your 290K records = ~$30-50 total**

This is a ONE-TIME cost. After initial setup, only new data needs embeddings.

#### How to Generate Embeddings:

**Option A: Use the API (Recommended)**

```bash
# Test with small batch first (1000 records)
curl -X POST https://www.makereadytech.com/api/matrix/generate-embeddings \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "tableName": "army_innovation_opportunities",
    "batchSize": 100,
    "limit": 1000,
    "skipExisting": true
  }'
```

**Option B: Generate embeddings table by table**

Start with your most important tables:

1. `army_innovation_opportunities`
2. `dod_contract_news`
3. `sbir_final`
4. `mantech_projects`
5. Then all others...

**Monitor progress:**
- Watch Vercel logs for progress
- Check `document_embeddings` table for count
- Each batch of 100 takes ~1 minute (rate limiting)

---

### Step 3: Test Semantic Search

Once you have embeddings, test it:

```bash
curl -X POST https://www.makereadytech.com/api/matrix/semantic-search \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "query": "cybersecurity artificial intelligence",
    "matchThreshold": 0.7,
    "matchCount": 10
  }'
```

**What to look for:**
- `success: true`
- `totalMatches > 0`
- `averageSimilarity > 0.7` (70% similar)

---

### Step 4: Enable in MATRIX Tool

Semantic search is now **automatically enabled** in the MATRIX tool!

The search flow:
1. **Try semantic search first** (if embeddings exist)
2. **Fall back to keyword search** (if no embeddings or semantic fails)
3. **Hybrid results** (combines both for best accuracy)

You'll see in the console:
```
[SEARCH] Search Method: SEMANTIC 🧠 (AI-powered)
```

Or:
```
[SEARCH] Search Method: KEYWORD 🔍 (keyword)
```

---

## 📊 How to Manage Embeddings

### Check What's Been Embedded

```sql
-- Count embeddings by source table
SELECT 
  source_table,
  COUNT(*) as embedding_count
FROM document_embeddings
GROUP BY source_table
ORDER BY embedding_count DESC;
```

### Re-generate Embeddings (if data changes)

```bash
# Delete old embeddings for a table
DELETE FROM document_embeddings WHERE source_table = 'army_innovation_opportunities';

# Generate new ones
curl -X POST https://www.makereadytech.com/api/matrix/generate-embeddings \
  -d '{"tableName": "army_innovation_opportunities", "limit": 10000}'
```

### Monitor Costs

OpenAI embeddings cost **$0.0001 per 1K tokens**.

- Average record = ~500 tokens = $0.00005
- 1,000 records = ~$0.05
- 10,000 records = ~$0.50

**Your actual cost will be visible in OpenAI dashboard.**

---

## 🎯 Expected Results

### Before Semantic Search:
```
Search: "cybersecurity ai ml"
Results: 8 matches (only exact "cybersecurity" text)
```

### After Semantic Search:
```
Search: "cybersecurity ai ml"  
Results: 143 matches (includes "information security", "machine learning", "artificial intelligence", "cyber defense", etc.)
Similarity: 78% average
```

**Semantic search finds 10-20x more relevant results!**

---

## 🛠️ Troubleshooting

### Semantic search not working?

**Check #1:** Are embeddings generated?
```sql
SELECT COUNT(*) FROM document_embeddings;
```
Should be > 0

**Check #2:** Is OpenAI key set?
```bash
# Check Vercel env vars
OPENAI_API_KEY=sk-proj-...
```

**Check #3:** Check Vercel logs
```
[SEARCH] Attempting semantic search for: "..."
[SEARCH] ✅ Semantic search found X matches
```

### Search is slow?

Semantic search adds ~200-500ms latency (embedding generation).

**Solutions:**
- Cache query embeddings (same query = reuse embedding)
- Increase `matchThreshold` to 0.75 (fewer results, faster)
- Reduce `matchCount` to 20

### Getting irrelevant results?

Increase `matchThreshold`:
- `0.65` = Very broad (more results, lower quality)
- `0.70` = Balanced (default)
- `0.75` = Strict (fewer results, higher quality)
- `0.80` = Very strict (only very similar matches)

---

## 🚀 Next Steps After Setup

1. ✅ Run `SUPABASE_ENABLE_VECTOR_SEARCH.sql`
2. ✅ Generate embeddings for top 5 tables (test)
3. ✅ Test semantic search with API
4. ✅ Try a market research report
5. ✅ Generate embeddings for remaining tables
6. ✅ Monitor OpenAI costs

**Once complete, your MATRIX tool will understand meaning, not just keywords!** 🧠

---

## 📞 Need Help?

If semantic search fails, the tool automatically falls back to keyword search, so your users won't see any errors. You can gradually roll it out table by table!

