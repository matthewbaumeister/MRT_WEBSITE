# DOD Tech Company Contract Scraper - Implementation Plan

## Overview
Adapting the USA Spending FPDS scraper to focus specifically on DOD contracts for tech companies.

## Current Scraper Capabilities
The existing scraper (from PropShop_AI_Website) has:
- API rate limiting with exponential backoff (up to 20 retries)
- Progress tracking with resume capability
- Failed contract logging and retry
- Page-by-page scraping
- Data validation and quality scoring
- Can run for months continuously

## Target: DOD Tech Contracts

### What We Want to Filter:
1. **Department of Defense contracts only**
   - Army, Navy, Air Force, Marines, Space Force
   - Defense Logistics Agency (DLA)
   - DARPA, missile defense, etc.

2. **Tech companies specifically**
   - Software development (NAICS 541511, 541512, 541519)
   - IT services (NAICS 541513, 541519)
   - Computer systems design (NAICS 541512)
   - Data processing/hosting (NAICS 518210)
   - Telecommunications (NAICS 517)
   - Manufacturing of computers/electronics (NAICS 334)
   - R&D in engineering/physical sciences (NAICS 541712, 541715)
   - Cybersecurity services

### API Filtering Options

The USA Spending API supports the following filters:

#### 1. **Agency Filtering** (✅ FULLY SUPPORTED)
```javascript
filters: {
  agencies: [
    { type: "awarding", tier: "toptier", name: "Department of Defense" },
    { type: "funding", tier: "toptier", name: "Department of Defense" }
  ]
}
```

Or by agency codes:
- `97` - Department of Defense
- `21` - Department of the Army
- `17` - Department of the Navy
- `57` - Department of the Air Force
- `97DARPA` - Defense Advanced Research Projects Agency

#### 2. **NAICS Code Filtering** (✅ FULLY SUPPORTED)
```javascript
filters: {
  naics_codes: ["541511", "541512", "541513", "541519", "518210"]
}
```

Tech-relevant NAICS codes:
- `541511` - Custom Computer Programming Services
- `541512` - Computer Systems Design Services
- `541513` - Computer Facilities Management Services
- `541519` - Other Computer Related Services
- `518210` - Data Processing, Hosting, and Related Services
- `541330` - Engineering Services
- `541712` - Research and Development in Physical, Engineering, Life Sciences
- `541715` - Research and Development in Physical, Engineering, Life Sciences (except Biotech)
- `334` - Computer and Electronic Product Manufacturing (all subcodes)
- `517` - Telecommunications (all subcodes)

#### 3. **PSC (Product/Service Code) Filtering** (✅ SUPPORTED)
```javascript
filters: {
  product_or_service_codes: ["D302", "D307", "D310", "R408", "R425"]
}
```

Tech-relevant PSC codes:
- `D3` series - IT and Telecom
- `D302` - Cyber Security and Data Backup
- `D307` - IT and Telecom - Cloud Computing Services
- `D310` - IT and Telecom - Cyber Security
- `D311` - IT and Telecom - Systems Development
- `R4` series - Professional, Administrative, and Management Support Services
- `R408` - Program Management/Support Services
- `R425` - Engineering and Technical Services

#### 4. **Award Amount Filtering** (✅ SUPPORTED)
Filter out micro-contracts to focus on substantial tech investments:
```javascript
filters: {
  award_amounts: [
    { lower_bound: 100000 } // $100K minimum
  ]
}
```

#### 5. **Keywords in Description** (❌ NOT SUPPORTED BY API)
The API doesn't support text search in descriptions. We'd need to:
- Fetch all DOD contracts with tech NAICS codes
- Post-filter by keywords like "software", "AI", "machine learning", "cloud", "cybersecurity"

### Recommended Filtering Strategy

#### **Option 1: Pre-filtered API Query (RECOMMENDED)**
Most efficient - let the API do the heavy lifting:

```javascript
{
  filters: {
    // 1. DOD only
    agencies: [{
      type: "awarding",
      tier: "toptier", 
      name: "Department of Defense"
    }],
    
    // 2. Tech NAICS codes
    naics_codes: [
      "541511", "541512", "541513", "541519", // Software/IT
      "518210", // Data processing
      "541330", // Engineering
      "541712", // R&D
      "334", // Computer manufacturing
      "517" // Telecom
    ],
    
    // 3. Minimum contract size
    award_amounts: [{
      lower_bound: 100000 // $100K+
    }],
    
    // 4. Time period
    time_period: [{
      start_date: "2024-01-01",
      end_date: "2025-12-31"
    }]
  }
}
```

**Pros:**
- Much faster (API does filtering)
- Lower API call volume
- More reliable

**Cons:**
- Might miss some tech contracts with non-tech NAICS codes
- No keyword filtering possible

**Expected Volume:**
- ~500-2,000 contracts per day (estimate)
- Much more manageable than all FPDS data

#### **Option 2: Broad Scrape + Post-filtering**
Scrape all DOD contracts, filter locally:

```javascript
{
  filters: {
    agencies: [{
      type: "awarding",
      tier: "toptier",
      name: "Department of Defense"
    }],
    award_amounts: [{
      lower_bound: 100000
    }]
  }
}
```

Then filter in code:
```javascript
function isTechContract(contract: any): boolean {
  const techNAICS = ['541511', '541512', '541513', '541519', '518210', ...];
  const techKeywords = ['software', 'cyber', 'AI', 'cloud', 'data', 'machine learning'];
  
  // Check NAICS
  if (techNAICS.some(code => contract.naics_code?.startsWith(code))) {
    return true;
  }
  
  // Check description
  const desc = contract.description_of_requirement?.toLowerCase() || '';
  if (techKeywords.some(keyword => desc.includes(keyword))) {
    return true;
  }
  
  return false;
}
```

**Pros:**
- Can use keyword filtering
- Won't miss edge cases
- More comprehensive

**Cons:**
- Higher API usage
- Slower scraping
- More data to process

### Recommended Implementation

**Phase 1: API-Filtered Scraper**
1. Copy existing FPDS scraper
2. Add DOD + tech NAICS filtering to API queries
3. Test with recent data (last 30 days)
4. Validate we're getting relevant contracts

**Phase 2: Optional Post-Filter Enhancement**
If Phase 1 misses important contracts:
1. Add keyword-based post-filtering
2. Build list of known tech vendors
3. Secondary classification pass

**Phase 3: Long-term Operation**
1. Run daily for new contracts
2. Backfill historical data (2020-present)
3. Monthly full refresh to catch modifications

## Implementation Files Needed

1. `lib/dod-tech-scraper.ts` - Main scraper with DOD+tech filtering
2. `lib/tech-naics-classifier.ts` - NAICS code lists and validation
3. `scripts/dod-tech-daily-scraper.ts` - Daily cron job
4. `scripts/dod-tech-historical-scraper.ts` - Backfill historical data
5. `DOD_TECH_CONTRACTS_TABLE.sql` - Database schema

## Next Steps

1. Review this plan - does the filtering approach match your needs?
2. Confirm NAICS codes - are there specific tech areas you want to focus on?
3. Confirm minimum contract size ($100K+, $1M+?)
4. Create the scrapers with your confirmed parameters

