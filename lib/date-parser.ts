/**
 * Date Range Parser for Natural Language Queries
 * Parses phrases like "last 3 months", "past year", "since January 2024"
 */

export interface DateRange {
  start: Date;
  end: Date;
  originalPhrase: string;
}

/**
 * Extract and parse date ranges from natural language queries
 * Examples:
 * - "army contracts last 3 months" → last 3 months from today
 * - "cyber security past year" → last 12 months
 * - "ai projects since January 2024" → from Jan 2024 to now
 * - "defense spending Q4 2024" → Oct-Dec 2024
 */
export function parseDateRange(query: string): DateRange | null {
  const today = new Date();
  const queryLower = query.toLowerCase();

  // Pattern: "last X days/weeks/months/years"
  const lastPattern = /last\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i;
  const lastMatch = query.match(lastPattern);
  if (lastMatch) {
    const amount = parseInt(lastMatch[1]);
    const unit = lastMatch[2].toLowerCase();
    const start = new Date(today);

    if (unit.startsWith('day')) {
      start.setDate(start.getDate() - amount);
    } else if (unit.startsWith('week')) {
      start.setDate(start.getDate() - (amount * 7));
    } else if (unit.startsWith('month')) {
      start.setMonth(start.getMonth() - amount);
    } else if (unit.startsWith('year')) {
      start.setFullYear(start.getFullYear() - amount);
    }

    return {
      start,
      end: today,
      originalPhrase: lastMatch[0],
    };
  }

  // Pattern: "past X days/weeks/months/years" (same as "last")
  const pastPattern = /past\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i;
  const pastMatch = query.match(pastPattern);
  if (pastMatch) {
    const amount = parseInt(pastMatch[1]);
    const unit = pastMatch[2].toLowerCase();
    const start = new Date(today);

    if (unit.startsWith('day')) {
      start.setDate(start.getDate() - amount);
    } else if (unit.startsWith('week')) {
      start.setDate(start.getDate() - (amount * 7));
    } else if (unit.startsWith('month')) {
      start.setMonth(start.getMonth() - amount);
    } else if (unit.startsWith('year')) {
      start.setFullYear(start.getFullYear() - amount);
    }

    return {
      start,
      end: today,
      originalPhrase: pastMatch[0],
    };
  }

  // Pattern: "since MONTH YEAR" or "since YEAR"
  const sincePattern = /since\s+(january|february|march|april|may|june|july|august|september|october|november|december)?\s*(\d{4})/i;
  const sinceMatch = query.match(sincePattern);
  if (sinceMatch) {
    const month = sinceMatch[1];
    const year = parseInt(sinceMatch[2]);
    const start = new Date(year, month ? getMonthNumber(month) : 0, 1);

    return {
      start,
      end: today,
      originalPhrase: sinceMatch[0],
    };
  }

  // Pattern: "in YEAR" or "during YEAR"
  const yearPattern = /(in|during)\s+(\d{4})/i;
  const yearMatch = query.match(yearPattern);
  if (yearMatch) {
    const year = parseInt(yearMatch[2]);
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    return {
      start,
      end,
      originalPhrase: yearMatch[0],
    };
  }

  // Pattern: "Q1/Q2/Q3/Q4 YEAR"
  const quarterPattern = /q([1-4])\s+(\d{4})/i;
  const quarterMatch = query.match(quarterPattern);
  if (quarterMatch) {
    const quarter = parseInt(quarterMatch[1]);
    const year = parseInt(quarterMatch[2]);
    const startMonth = (quarter - 1) * 3;
    const start = new Date(year, startMonth, 1);
    const end = new Date(year, startMonth + 3, 0, 23, 59, 59);

    return {
      start,
      end,
      originalPhrase: quarterMatch[0],
    };
  }

  // Pattern: "this month/year/quarter"
  if (queryLower.includes('this month')) {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      start,
      end: today,
      originalPhrase: 'this month',
    };
  }

  if (queryLower.includes('this year')) {
    const start = new Date(today.getFullYear(), 0, 1);
    return {
      start,
      end: today,
      originalPhrase: 'this year',
    };
  }

  if (queryLower.includes('this quarter')) {
    const currentMonth = today.getMonth();
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    const start = new Date(today.getFullYear(), quarterStartMonth, 1);
    return {
      start,
      end: today,
      originalPhrase: 'this quarter',
    };
  }

  // No date range found
  return null;
}

/**
 * Helper: Convert month name to number (0-11)
 */
function getMonthNumber(monthName: string): number {
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3,
    may: 4, june: 5, july: 6, august: 7,
    september: 8, october: 9, november: 10, december: 11,
  };
  return months[monthName.toLowerCase()] || 0;
}

/**
 * Remove date range phrase from query
 * E.g., "army contracts last 3 months" → "army contracts"
 */
export function stripDateRange(query: string, dateRange: DateRange | null): string {
  if (!dateRange) return query;
  return query.replace(dateRange.originalPhrase, '').trim();
}

/**
 * Format date range for display
 */
export function formatDateRange(dateRange: DateRange): string {
  const startStr = dateRange.start.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const endStr = dateRange.end.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return `${startStr} to ${endStr}`;
}

/**
 * Convert date range to SQL WHERE clause
 * Example: "created_at >= '2024-01-01' AND created_at <= '2024-03-31'"
 */
export function dateRangeToSQL(dateRange: DateRange, columnName: string = 'created_at'): string {
  const startISO = dateRange.start.toISOString();
  const endISO = dateRange.end.toISOString();
  return `${columnName} >= '${startISO}' AND ${columnName} <= '${endISO}'`;
}

