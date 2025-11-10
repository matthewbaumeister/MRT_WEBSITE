# Knowledge Base Feature Guide

## Overview

The Knowledge Base is a powerful data browsing and search interface for your Matrix tool. It allows users to explore, search, and analyze all your data sources without generating full reports.

---

## Features

### 1. **Dual Search Modes**

#### Keyword Search
- Traditional text matching within selected table
- Fast and precise for exact terms
- Searches across all text columns automatically

#### AI Semantic Search
- Uses OpenAI embeddings for intelligent search
- Finds conceptually similar content
- Example: "cyber defense" will match "information security"
- Searches across ALL tables or filtered by selection

### 2. **Table Browsing**

**15 Data Sources Available:**

- **Army xTech** (4 tables)
  - Army Innovation Opportunities
  - Army Innovation Programs
  - Army Innovation Submissions
  - Army Innovation Documents

- **ManTech** (2 tables)
  - ManTech Projects
  - ManTech Company Mentions

- **DoD Contracts** (2 tables)
  - DoD Contract News (44K+ records)
  - DVIDS Military News (3K+ records)

- **SBIR** (1 table)
  - SBIR Awards (32K+ records)

- **GSA** (3 tables)
  - GSA Labor Categories (196K+ records)
  - GSA Schedule Holders (14K+ records)
  - GSA Price Lists (2K+ records)

- **Financial** (2 tables)
  - Congressional Stock Trades (3K+ records)
  - Defense Contractor Tickers

### 3. **Category Filtering**

Filter tables by category:
- All Categories
- Army xTech
- ManTech
- DoD Contracts
- SBIR
- GSA
- Financial

### 4. **Advanced Table Features**

#### Sorting
- Click any column header to sort
- Toggle between ascending/descending
- Visual indicators for active sort

#### Pagination
- 50 records per page
- Navigate with Previous/Next buttons
- Shows current position (e.g., "Showing 1-50 of 44,113")

#### Dynamic Column Display
- Automatically detects and displays all columns
- Shows first 8 columns in table view
- Truncates long text (hover to see full text)

### 5. **Record Details Modal**

- Click "View Full" on any record
- See all fields and complete data
- Formatted for easy reading
- Long text fields fully expanded

### 6. **Smart Column Detection**

The system automatically identifies searchable columns:
- title, name, description
- company, contractor
- content, text, abstract
- technology, category
- program, project, solution

---

## How to Use

### Basic Table Browsing

1. Navigate to Knowledge Base from Matrix sidebar
2. Select a **Category** (optional)
3. Choose a **Data Source** from dropdown
4. Data loads automatically with pagination
5. Click column headers to sort
6. Click "View Full" to see complete records

### Keyword Search

1. Select "Keyword" search mode
2. Choose a specific table
3. Enter search terms
4. Hit Enter or click "Search"
5. Results show matching records from that table

### Semantic Search

1. Select "AI Semantic" search mode
2. Optionally select a table (or leave blank for all tables)
3. Describe what you're looking for in natural language
4. System finds semantically similar content
5. Results can span multiple tables

### Filtering & Sorting

1. **Category Filter**: Narrow down table list
2. **Table Selection**: Focus on specific data source
3. **Column Sorting**: Click headers to organize data
4. **Clear Filters**: Reset all filters and start fresh

---

## Example Use Cases

### 1. Find SBIR Awards in AI/ML
```
Mode: Semantic Search
Query: "artificial intelligence machine learning"
Table: SBIR Awards
Result: All AI/ML-related SBIR awards with similarity scores
```

### 2. Browse Recent DoD Contracts
```
Mode: Keyword (no search)
Table: DoD Contract News
Sort By: created_at (descending)
Result: Latest contract awards
```

### 3. Find Companies with GSA Schedules
```
Mode: Keyword Search
Query: "IT support cybersecurity"
Table: GSA Schedule Holders
Result: IT/cyber companies with GSA schedules
```

### 4. Research xTech Winners
```
Mode: Keyword Search
Query: "autonomous"
Table: Army Innovation Submissions
Result: All autonomous system submissions
```

### 5. Cross-Table Semantic Search
```
Mode: Semantic Search
Query: "quantum computing defense applications"
Table: (leave blank)
Result: Relevant records from ALL tables
```

---

## Performance Notes

### Large Tables

Some tables have massive amounts of data:
- **GSA Labor Categories**: 196,714 rows
- **DoD Contract News**: 44,113 rows
- **SBIR Awards**: 32,131 rows

**Optimization:**
- Pagination limits to 50 rows per page
- Sorting happens server-side
- Search is indexed and fast
- Semantic search pre-filters results

### Search Speed

- **Keyword Search**: < 500ms
- **Semantic Search**: 1-2 seconds (includes AI embedding generation)
- **Table Load**: < 300ms per page

---

## API Endpoints

### GET `/api/matrix/knowledge-base/table`
Fetch paginated table data with optional sorting

**Parameters:**
- `table` (required): Table name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 50)
- `sortColumn` (optional): Column to sort by
- `sortDirection` (optional): "asc" or "desc"

### POST `/api/matrix/knowledge-base/search`
Keyword search within a table

**Body:**
```json
{
  "table": "sbir_final",
  "query": "cybersecurity",
  "page": 1,
  "limit": 50
}
```

### POST `/api/matrix/semantic-search`
AI semantic search across tables

**Body:**
```json
{
  "query": "cyber defense technologies",
  "filterTables": ["sbir_final"],
  "matchThreshold": 0.7,
  "matchCount": 50
}
```

---

## Technical Details

### Stack
- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI Search**: OpenAI Embeddings + pgvector
- **Authentication**: NextAuth.js

### Data Flow

1. User selects table → API fetches first page
2. User searches → API queries Supabase with filters
3. User sorts → API re-queries with ORDER BY
4. User views record → Modal displays full data
5. Semantic search → OpenAI generates embedding → pgvector finds similar records

### Column Detection Algorithm

```typescript
1. Fetch sample row from table
2. Identify text columns (typeof === 'string')
3. Prioritize searchable column names:
   - title, name, description
   - company, contractor
   - content, technology, etc.
4. Build OR query across all text columns
5. Cache column mapping (1 hour)
```

---

## Future Enhancements

Potential additions:
- [ ] Export results to CSV/Excel
- [ ] Save searches as favorites
- [ ] Advanced filters (date ranges, numeric ranges)
- [ ] Bulk actions (select multiple records)
- [ ] Compare records side-by-side
- [ ] Visualizations (charts, graphs)
- [ ] Create reports from selected records
- [ ] Share search results via link

---

## Troubleshooting

### No Results Found
- Check spelling in keyword search
- Try semantic search for broader matching
- Verify table has data
- Check category filter isn't hiding tables

### Slow Loading
- Large tables (100K+ rows) may take longer
- Semantic search requires AI processing (1-2s)
- Try narrowing search with filters
- Reduce page size if needed

### Search Not Working
- Ensure table is selected for keyword search
- Semantic search requires OpenAI API key
- Check console for error messages
- Verify user permissions

---

## Access

**Location**: Matrix sidebar → "Knowledge Base" button

**URL**: `https://makereadytech.com/matrix/knowledge-base`

**Permissions**: Requires Matrix tool access (authenticated users)

---

## Summary

The Knowledge Base transforms your data from static tables into an explorable, searchable intelligence library. Whether you need quick lookups, deep data exploration, or AI-powered discovery, this feature provides the tools to find exactly what you need across 290,000+ records.

**Key Value:**
- ✅ Browse all data sources in one place
- ✅ AI semantic search finds hidden connections
- ✅ Filter, sort, and paginate large datasets
- ✅ Export-ready detailed views
- ✅ Fast keyword search for precision
- ✅ No need to generate full reports

**Next Steps:**
1. Click "Knowledge Base" in Matrix sidebar
2. Explore different data sources
3. Try both keyword and semantic search
4. Sort and filter to find insights
5. View full records for detailed analysis

