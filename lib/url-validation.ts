/**
 * URL Validation Utilities
 * Validates URLs to prevent dead links and placeholder URLs
 */

// List of invalid/placeholder URL patterns
const INVALID_URL_PATTERNS = [
  /^https?:\/\/exact-url\.com/i,
  /^https?:\/\/example\.com/i,
  /^https?:\/\/placeholder/i,
  /^https?:\/\/www\.example\.com/i,
  /^https?:\/\/test\.com/i,
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\.0\.0\.1/i,
  /^https?:\/\/\[.*\]/, // Brackets in URL
  /^https?:\/\/\{.*\}/, // Braces in URL
];

/**
 * Validates if a URL is valid and not a placeholder
 * @param url - The URL to validate
 * @returns true if URL is valid, false if it's a placeholder or invalid
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check for placeholder patterns
  for (const pattern of INVALID_URL_PATTERNS) {
    if (pattern.test(url)) {
      return false;
    }
  }

  // Basic URL format validation
  try {
    const urlObj = new URL(url);
    // Must have http or https protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    // Must have a hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }
    // Hostname should not be just "exact-url" or similar
    if (urlObj.hostname.match(/^(exact-url|example|placeholder|test)$/i)) {
      return false;
    }
    return true;
  } catch (e) {
    // Invalid URL format
    return false;
  }
}

/**
 * Filters out invalid URLs from an array
 * @param urls - Array of URLs to filter
 * @returns Array of valid URLs
 */
export function filterValidUrls(urls: string[]): string[] {
  return urls.filter(isValidUrl);
}

/**
 * Validates and cleans a citation URL
 * @param url - The URL to validate
 * @returns The URL if valid, null if invalid
 */
export function validateCitationUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();
  
  if (!isValidUrl(trimmedUrl)) {
    return null;
  }

  return trimmedUrl;
}

