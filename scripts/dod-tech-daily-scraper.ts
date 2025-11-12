#!/usr/bin/env node
/**
 * DOD Tech Daily Scraper
 * 
 * Scrapes Department of Defense technology contracts daily.
 * Designed to run continuously with built-in resilience.
 * 
 * Features:
 * - Pre-filtered for DOD agencies and tech NAICS codes
 * - Exponential backoff retry logic (up to 20 attempts)
 * - Progress tracking and resume capability
 * - API rate limiting with cooldowns
 * - Can run for months without intervention
 * 
 * Usage:
 *   # Scrape yesterday (default)
 *   npx tsx scripts/dod-tech-daily-scraper.ts
 * 
 *   # Scrape specific date
 *   npx tsx scripts/dod-tech-daily-scraper.ts --date=2025-11-10
 * 
 *   # Scrape last 7 days
 *   npx tsx scripts/dod-tech-daily-scraper.ts --days=7
 */

import 'dotenv/config';
import { 
  searchDODTechContracts,
  getDODContractFullDetails,
  normalizeDODContract,
  batchInsertDODContracts 
} from '../lib/dod-tech-scraper';
import { validateContractBatch } from '../lib/fpds-data-cleaner';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// Configuration
// ============================================

const CONTRACTS_PER_PAGE = 100;
const MAX_PAGES_PER_DAY = 100; // Safety limit
const MAX_RETRY_ATTEMPTS = 20; // Very persistent for long-running operation
const CONSECUTIVE_ERROR_THRESHOLD = 10; // Abort page if 10+ consecutive failures
const MIN_CONTRACT_AMOUNT = 100000; // $100K minimum (tech contracts are usually substantial)

// ============================================
// Helper Functions
// ============================================

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [DOD Tech Daily] ${message}`);
}

// ============================================
// Progress Tracking
// ============================================

async function getLastCompletedPage(date: string): Promise<number> {
  const { data, error } = await supabase
    .from('fpds_page_progress')
    .select('page_number')
    .eq('date', date)
    .eq('status', 'completed')
    .order('page_number', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return 0;
  }

  return data.page_number;
}

async function markPageComplete(
  date: string,
  page: number,
  found: number,
  inserted: number,
  failed: number
): Promise<void> {
  const { error } = await supabase
    .from('fpds_page_progress')
    .upsert({
      date,
      page_number: page,
      status: 'completed',
      contracts_found: found,
      contracts_inserted: inserted,
      contracts_failed: failed,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'date,page_number'
    });

  if (error) {
    log(`Failed to save progress for ${date}:P${page}: ${error.message}`);
  }
}

async function markPageFailed(date: string, page: number, errorMsg: string): Promise<void> {
  const { error } = await supabase
    .from('fpds_page_progress')
    .upsert({
      date,
      page_number: page,
      status: 'failed',
      error_message: errorMsg.substring(0, 500),
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'date,page_number'
    });

  if (error) {
    log(`Failed to log failure for ${date}:P${page}: ${error.message}`);
  }
}

// ============================================
// Page Scraping Logic
// ============================================

async function scrapePage(
  date: string,
  page: number,
  attempt: number = 1
): Promise<{
  success: boolean;
  found: number;
  inserted: number;
  updated: number;
  failed: number;
  hasMore: boolean;
}> {
  try {
    log(`[${date}:P${page}] Searching page ${page}...`);
    
    const searchResult = await searchDODTechContracts({
      startDate: date,
      endDate: date,
      page,
      limit: CONTRACTS_PER_PAGE,
      minAmount: MIN_CONTRACT_AMOUNT
    });

    const results = searchResult.results || [];
    
    if (results.length === 0) {
      log(`[${date}:P${page}] No more contracts (end of day)`);
      return { success: true, found: 0, inserted: 0, updated: 0, failed: 0, hasMore: false };
    }

    const contractIds = results.map((r: any) => r.generated_internal_id || r['Award ID']);
    log(`[${date}:P${page}] Found ${contractIds.length} DOD tech contracts`);

    // Fetch full details with error tracking
    const fullContracts: any[] = [];
    const successfulIds: string[] = [];
    let fetchErrors = 0;
    let consecutiveErrors = 0;

    for (let i = 0; i < contractIds.length; i++) {
      try {
        const fullData = await getDODContractFullDetails(contractIds[i]);
        
        if (fullData) {
          fullContracts.push(fullData);
          successfulIds.push(contractIds[i]);
          consecutiveErrors = 0;
        } else {
          fetchErrors++;
          consecutiveErrors++;
          
          await supabase.from('fpds_failed_contracts').insert({
            contract_id: contractIds[i],
            error_message: 'Contract details fetch returned null',
            error_type: 'details_fetch_failed',
            date_range: date,
            page_number: page,
            attempt_count: attempt
          });

          if (consecutiveErrors >= CONSECUTIVE_ERROR_THRESHOLD) {
            log(`[${date}:P${page}] ${consecutiveErrors} consecutive errors - API issue detected`);
            throw new Error(`API instability: ${consecutiveErrors} consecutive failures`);
          }
        }
      } catch (err) {
        fetchErrors++;
        consecutiveErrors++;
        
        if (err instanceof Error && err.message.includes('API instability')) {
          throw err;
        }
        
        await supabase.from('fpds_failed_contracts').insert({
          contract_id: contractIds[i],
          error_message: err instanceof Error ? err.message : 'Unknown error',
          error_type: 'details_fetch_failed',
          date_range: date,
          page_number: page,
          attempt_count: attempt
        });

        if (consecutiveErrors >= CONSECUTIVE_ERROR_THRESHOLD) {
          log(`[${date}:P${page}] ${consecutiveErrors} consecutive errors - API issue detected`);
          throw new Error(`API instability: ${consecutiveErrors} consecutive failures`);
        }
      }

      if ((i + 1) % 10 === 0) {
        log(`[${date}:P${page}] Fetched ${i + 1}/${contractIds.length} details...`);
      }

      // Rate limiting - 600ms between requests (~1.7 req/sec)
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    log(`[${date}:P${page}] Fetched ${fullContracts.length}/${contractIds.length} details`);
    
    if (fetchErrors > 0) {
      log(`[${date}:P${page}] Failed: ${fetchErrors} contracts (logged for retry)`);
    }

    // Clean up resolved failures
    if (successfulIds.length > 0) {
      const { count: deletedCount } = await supabase
        .from('fpds_failed_contracts')
        .delete({ count: 'exact' })
        .in('contract_id', successfulIds)
        .eq('date_range', date)
        .eq('page_number', page);
      
      if (deletedCount && deletedCount > 0) {
        log(`[${date}:P${page}] Cleaned ${deletedCount} resolved failures`);
      }
    }

    // Normalize, validate, and insert
    if (fullContracts.length > 0) {
      const normalized = fullContracts.map(normalizeDODContract);
      const validated = validateContractBatch(normalized);
      
      log(`[${date}:P${page}] Quality: ${validated.stats.averageScore.toFixed(1)}/100`);
      
      const result = await batchInsertDODContracts(validated.cleaned);
      log(`[${date}:P${page}] New: ${result.inserted} | Updated: ${result.updated} | Errors: ${result.errors}`);

      await markPageComplete(date, page, contractIds.length, result.inserted, fetchErrors);

      return {
        success: true,
        found: contractIds.length,
        inserted: result.inserted,
        updated: result.updated,
        failed: fetchErrors,
        hasMore: contractIds.length === CONTRACTS_PER_PAGE
      };
    }

    await markPageComplete(date, page, contractIds.length, 0, fetchErrors);
    return { 
      success: true, 
      found: contractIds.length, 
      inserted: 0, 
      updated: 0, 
      failed: fetchErrors, 
      hasMore: contractIds.length === CONTRACTS_PER_PAGE 
    };

  } catch (error) {
    log(`[${date}:P${page}] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// ============================================
// Date Scraping with Retry Logic
// ============================================

async function scrapeDate(date: string): Promise<{
  date: string;
  totalFound: number;
  totalInserted: number;
  totalUpdated: number;
  totalFailed: number;
  pagesProcessed: number;
}> {
  log(`Starting scrape for date: ${date}`);
  
  const lastPage = await getLastCompletedPage(date);
  const startPage = lastPage + 1;
  
  if (lastPage > 0) {
    log(`Resuming from page ${startPage} (last completed: ${lastPage})`);
  }

  let currentPage = startPage;
  let totalFound = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalFailed = 0;
  let pagesProcessed = 0;

  while (currentPage <= MAX_PAGES_PER_DAY) {
    let attempt = 0;
    let success = false;
    let result;

    // Retry logic with exponential backoff
    while (attempt < MAX_RETRY_ATTEMPTS && !success) {
      attempt++;
      
      try {
        if (attempt > 1) {
          // Exponential backoff: 30s, 60s, 2m, 4m, 8m, capped at 5m
          const cooldown = Math.min(30000 * Math.pow(2, attempt - 2), 300000);
          const minutes = Math.floor(cooldown / 60000);
          const seconds = Math.floor((cooldown % 60000) / 1000);
          
          log(`[${date}:P${currentPage}] Retry ${attempt}/${MAX_RETRY_ATTEMPTS}`);
          log(`[${date}:P${currentPage}] API cooldown: ${minutes}m ${seconds}s...`);
          await new Promise(resolve => setTimeout(resolve, cooldown));
        }

        result = await scrapePage(date, currentPage, attempt);
        success = true;
      } catch (error: any) {
        log(`[${date}:P${currentPage}] Attempt ${attempt} failed: ${error.message}`);
        
        if (attempt >= MAX_RETRY_ATTEMPTS) {
          await markPageFailed(date, currentPage, error.message);
          log(`[${date}:P${currentPage}] Failed after ${MAX_RETRY_ATTEMPTS} attempts. Continuing to next page.`);
          // Continue to next page instead of stopping entirely
          currentPage++;
          break;
        }
      }
    }

    if (!success || !result) {
      continue; // Move to next page
    }

    totalFound += result.found;
    totalInserted += result.inserted;
    totalUpdated += result.updated;
    totalFailed += result.failed;
    pagesProcessed++;

    if (!result.hasMore) {
      log(`[${date}] Reached end of results at page ${currentPage}`);
      break;
    }

    currentPage++;
  }

  log(`Completed scrape for ${date}:`);
  log(`  Pages: ${pagesProcessed}`);
  log(`  Found: ${totalFound}`);
  log(`  Inserted: ${totalInserted}`);
  log(`  Updated: ${totalUpdated}`);
  log(`  Failed: ${totalFailed}`);

  return {
    date,
    totalFound,
    totalInserted,
    totalUpdated,
    totalFailed,
    pagesProcessed
  };
}

// ============================================
// Main Entry Point
// ============================================

async function main() {
  const args = process.argv.slice(2);
  
  console.log('================================================================================');
  console.log('DOD TECH CONTRACTS DAILY SCRAPER');
  console.log('================================================================================');
  console.log('Scraping Department of Defense contracts for technology companies');
  console.log('Pre-filtered for:');
  console.log('  - DOD agencies (Army, Navy, Air Force, etc.)');
  console.log('  - Tech NAICS codes (Software, IT, R&D, etc.)');
  console.log('  - Minimum contract value: $100,000');
  console.log('================================================================================\n');

  // Parse arguments
  const dateArg = args.find(arg => arg.startsWith('--date='));
  const daysArg = args.find(arg => arg.startsWith('--days='));
  
  let dates: string[] = [];
  
  if (dateArg) {
    // Single date mode
    dates = [dateArg.split('=')[1]];
  } else if (daysArg) {
    // Multi-day mode
    const numDays = parseInt(daysArg.split('=')[1]);
    const today = new Date();
    for (let i = 1; i <= numDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(formatDate(date));
    }
  } else {
    // Default: yesterday only
    dates = [getYesterday()];
  }
  
  console.log(`Dates to scrape: ${dates.join(', ')}\n`);
  console.log('================================================================================\n');

  // Get initial database count (DOD tech contracts only)
  const { count: initialCount } = await supabase
    .from('fpds_contracts')
    .select('*', { count: 'exact', head: true })
    .eq('is_tech_contract', true)
    .ilike('contracting_agency_name', '%defense%');

  console.log(`Database currently has: ${initialCount?.toLocaleString() || 0} DOD tech contracts\n`);

  const results = [];
  let totalFound = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalFailed = 0;

  for (const date of dates) {
    try {
      log(`\nProcessing ${date}...`);
      const result = await scrapeDate(date);
      results.push(result);
      
      totalFound += result.totalFound;
      totalInserted += result.totalInserted;
      totalUpdated += result.totalUpdated;
      totalFailed += result.totalFailed;
      
      log(`${date}: ${result.totalInserted} new, ${result.totalUpdated} updated`);
    } catch (error: any) {
      log(`${date}: FAILED - ${error.message}`);
      results.push({
        date,
        totalFound: 0,
        totalInserted: 0,
        totalUpdated: 0,
        totalFailed: 0,
        pagesProcessed: 0,
        error: error.message
      });
    }
  }

  // Get final database count (DOD tech contracts only)
  const { count: finalCount } = await supabase
    .from('fpds_contracts')
    .select('*', { count: 'exact', head: true })
    .eq('is_tech_contract', true)
    .ilike('contracting_agency_name', '%defense%');

  console.log('\n' + '='.repeat(80));
  console.log('SCRAPE SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Found: ${totalFound}`);
  console.log(`Total Inserted: ${totalInserted}`);
  console.log(`Total Updated: ${totalUpdated}`);
  console.log(`Total Failed: ${totalFailed}`);
  console.log(`Database Before: ${initialCount?.toLocaleString() || 0}`);
  console.log(`Database After: ${finalCount?.toLocaleString() || 0}`);
  console.log(`Database Growth: ${((finalCount || 0) - (initialCount || 0)).toLocaleString()}`);
  console.log('='.repeat(80) + '\n');
  
  process.exit(0);
}

// Export for use in cron endpoint
export { scrapeDate };

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

