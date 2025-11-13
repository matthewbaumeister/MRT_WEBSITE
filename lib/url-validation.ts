/**
 * URL Validation Utilities
 * Validates URLs to prevent dead links and placeholder URLs
 */

// List of invalid/placeholder URL patterns - ZERO TOLERANCE
const INVALID_URL_PATTERNS = [
  /exact-url\.com/i,
  /example\.com/i,
  /placeholder/i,
  /test\.com/i,
  /localhost/i,
  /127\.0\.0\.1/i,
  /\[.*\]/, // Brackets in URL
  /\{.*\}/, // Braces in URL
  /placeholder/i,
  /example/i,
  /test/i,
  /dummy/i,
  /fake/i,
  /sample/i,
  /demo/i,
  /\.\.\./, // Ellipsis
  /etc/i,
  /and so on/i,
];

// Invalid hostname patterns
const INVALID_HOSTNAMES = [
  'exact-url.com',
  'example.com',
  'test.com',
  'placeholder.com',
  'dummy.com',
  'fake.com',
  'sample.com',
  'demo.com',
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
];

/**
 * Validates if a URL is valid and not a placeholder - ZERO TOLERANCE
 * @param url - The URL to validate
 * @returns true if URL is valid, false if it's a placeholder or invalid
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim();
  if (trimmedUrl.length === 0) {
    return false;
  }

  // Check for placeholder patterns anywhere in the URL
  for (const pattern of INVALID_URL_PATTERNS) {
    if (pattern.test(trimmedUrl)) {
      return false;
    }
  }

  // Basic URL format validation
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Must have http or https protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Must have a hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }
    
    // Check against invalid hostnames
    const hostnameLower = urlObj.hostname.toLowerCase();
    for (const invalidHost of INVALID_HOSTNAMES) {
      if (hostnameLower === invalidHost || hostnameLower.includes(invalidHost)) {
        return false;
      }
    }
    
    // Hostname should not match placeholder patterns
    if (hostnameLower.match(/^(exact-url|example|placeholder|test|dummy|fake|sample|demo)$/i)) {
      return false;
    }
    
    // Hostname must be at least 3 characters (e.g., "co.uk")
    if (hostnameLower.length < 3) {
      return false;
    }
    
    // Must have at least one dot in hostname (domain structure)
    if (!hostnameLower.includes('.')) {
      return false;
    }
    
    // Reject if hostname is just a single word (likely placeholder)
    const parts = hostnameLower.split('.');
    if (parts.length < 2) {
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

