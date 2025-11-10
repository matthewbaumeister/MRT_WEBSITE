# MATRIX Small Business Focus - Data Sources

## Overview
The "Small Business Focus" toggle in MATRIX prioritizes information from small business-specific government programs and data sources. This feature helps users find opportunities, contracts, and programs specifically designed for or awarded to small businesses.

## Current Data Sources (Active)

### 1. MANTECH (Manufacturing Technology)
**Status**: ✅ Active  
**Supabase Tables**:
- `mantech_projects` - All MANTECH projects
- `mantech_by_component` - Projects organized by DOD component
- `mantech_company_mentions` - Companies mentioned in projects
- `mantech_top_companies` - Top companies by project count
- `mantech_sbir_transitions` - SBIR/STTR transitions to MANTECH
- `mantech_transition_pipeline` - Technology transition tracking
- `mantech_recent_projects` - Most recent projects view

**Description**: Manufacturing Technology program helps transition innovative manufacturing technologies from small businesses into defense production.

### 2. xTech (Army Innovation)
**Status**: ✅ Active  
**Supabase Tables**:
- `army_innovation_opportunities` - Open competitions and challenges
- `army_innovation_programs` - Program details
- `army_innovation_submissions` - Company submissions
- `army_innovation_documents` - Supporting documents
- `army_innovation_finalists_with_details` - Finalist companies
- `army_innovation_winners_with_details` - Winner companies
- `army_innovation_phase_progress` - Competition phase tracking
- `army_innovation_competition_stats` - Statistics and metrics
- `army_innovation_prize_summary` - Prize information
- `army_innovation_upcoming_deadlines` - Upcoming deadlines

**Description**: Army's xTech program connects innovators and small businesses with Army challenges through prize competitions and prototyping opportunities.

### 3. DSIP (Defense SBIR/STTR Innovation Portal)
**Status**: ✅ Active (when available)  
**Description**: Central portal for Defense SBIR/STTR programs, tracking awards and opportunities for small businesses.

### 4. FUZE Innovation Platform
**Status**: ✅ Active (when available)  
**Description**: DOD innovation platform connecting small businesses with defense challenges and opportunities.

## Upcoming Data Sources (To Be Added)

### 5. SBA Awards
**Status**: ⏳ Pending (Government API currently down)  
**Planned Table**: `sba_awards`  
**Description**: Small Business Administration awards and contracts. Will include:
- Federal contracts awarded to small businesses
- SBA loan programs
- Government contracting certifications
- Set-aside opportunities

**Note**: Federal API endpoint is currently unavailable. Will add once service is restored.

### 6. FPDS Small Business Data
**Status**: ⏳ Not yet imported  
**Planned Table**: `fpds_small_business`  
**Description**: Federal Procurement Data System filtered for small business contracts. Will include:
- Small business set-asides
- 8(a) program contracts
- HUBZone contracts
- Women-owned small business contracts
- Veteran-owned small business contracts
- Service-disabled veteran-owned contracts

**Note**: Data exists but needs to be filtered and imported from FPDS.

## How Small Business Focus Works

### In the UI
1. Open settings menu (sliders icon) in Matrix chat
2. Toggle "Small Business Focus" switch
3. Gold accent color indicates it's active
4. Shows current and upcoming data sources

### In the API
When enabled, the system prompt instructs the AI to:
1. **Prioritize** small business-specific opportunities
2. **Lead with** small business programs in responses
3. **Query** relevant Supabase tables for real data
4. **Include broader context** when needed, but maintain small business focus

### System Prompt Addition
```
SMALL BUSINESS FOCUS MODE: When answering questions, prioritize information from these small business-focused data sources:

Current Data Sources:
- DSIP (Defense SBIR/STTR Innovation Portal)
- MANTECH (Manufacturing Technology) - [tables listed]
- xTech (Army Innovation) - [tables listed]
- FUZE Innovation Platform

Upcoming Data Sources (not yet available):
- SBA Awards (Government API currently down)
- FPDS Small Business data (not yet imported)

Focus on opportunities, contracts, and programs specifically designed for or awarded to small businesses.
```

## Data Integration Roadmap

### Phase 1: Current (Complete)
- ✅ MANTECH data integrated
- ✅ xTech/Army Innovation data integrated
- ✅ Small Business Focus toggle implemented
- ✅ System prompt enhancement

### Phase 2: Short Term (Next)
- ⏳ DSIP data scraping and import
- ⏳ FUZE data scraping and import
- ⏳ Direct Supabase queries from MATRIX
- ⏳ Real-time data in AI responses

### Phase 3: Medium Term (Pending API/Data)
- ⏳ SBA Awards integration (waiting for API)
- ⏳ FPDS Small Business filtering and import
- ⏳ Additional small business programs

### Phase 4: Advanced Features (Future)
- 📋 Small business opportunity alerts
- 📋 Contract matching based on company profile
- 📋 Deadline tracking and reminders
- 📋 Historical trend analysis
- 📋 Competitive landscape insights

## Technical Implementation

### Frontend (MatrixChat.tsx)
```typescript
const [smallBusinessFocus, setSmallBusinessFocus] = useState(false);

// Sent to API
{
  messages: apiMessages,
  smallBusinessFocus,
  // ... other settings
}
```

### Backend (API Route)
```typescript
const { smallBusinessFocus = false } = await request.json();

// Modifies system prompt
// TODO: Query Supabase tables directly
// TODO: Include real data in context
```

### Database Tables to Query
When smallBusinessFocus is enabled, these tables should be queried:
- All `mantech_*` tables
- All `army_innovation_*` tables
- `sba_awards` (once available)
- `fpds_small_business` (once imported)
- DSIP tables (once created)
- FUZE tables (once created)

## Use Cases

### Finding Opportunities
User: "What SBIR opportunities are available right now?"
- With SB Focus: Lists DSIP, xTech, and MANTECH opportunities for small businesses
- Without: General SBIR information

### Market Research
User: "Who are the top small business winners in Army innovation?"
- With SB Focus: Queries `army_innovation_winners_with_details`, filters for small businesses
- Without: General information about Army innovation

### Contract History
User: "Show me MANTECH transitions from SBIR companies"
- With SB Focus: Queries `mantech_sbir_transitions` directly
- Without: General MANTECH information

## Data Refresh Schedule

### Current Data
- **MANTECH**: Updates when scraped (manual trigger)
- **xTech**: Updates when scraped (manual trigger)

### Planned Data
- **DSIP**: Daily refresh (once implemented)
- **FUZE**: Daily refresh (once implemented)
- **SBA Awards**: Weekly refresh (once API available)
- **FPDS**: Monthly refresh (once imported)

## Notes for Future Development

1. **Remember**: Once SBA Awards API is back online, add to active sources
2. **Remember**: FPDS data exists, just needs small business filtering and import
3. **Consider**: Adding small business size standards filter (employees, revenue)
4. **Consider**: Industry category filtering (NAICS codes)
5. **Consider**: Geographic filtering (state, region)
6. **Consider**: Certification type filtering (8(a), HUBZone, WOSB, VOSB, SDVOSB)

## Testing Checklist

- [x] Small Business Focus toggle works in UI
- [x] Toggle state persists during conversation
- [x] System prompt updates based on toggle
- [x] Help text shows current and upcoming sources
- [x] Gold accent color when active
- [ ] Direct Supabase queries return data
- [ ] AI responses include real data from tables
- [ ] Performance with large dataset queries
- [ ] Cache strategy for frequently accessed data

## Maintenance

### When Adding New Data Sources:
1. Update this document with new source
2. Update system prompt in `app/api/matrix/chat/route.ts`
3. Update UI help text in `components/matrix/MatrixChat.tsx`
4. Update MATRIX_SETUP.md documentation
5. Test AI responses with new data
6. Announce new data source to users

### When API/Data Becomes Available:
1. Move from "Upcoming" to "Current" in this doc
2. Remove "(not yet available)" from UI
3. Update system prompt to mark as active
4. Implement actual data queries
5. Test thoroughly
6. Update user documentation

