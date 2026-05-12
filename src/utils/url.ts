/**
 * URL Normalization Utilities
 * Protects against IDN homograph attacks by normalizing internationalized domain names
 */

/**
 * Normalize URLs to protect against IDN homograph attacks.
 * Converts internationalized domain names to punycode representation.
 */
export function normalizeUrls(text: string): string {
  // Match URLs in text
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

  return text.replace(urlPattern, (url) => {
    try {
      const parsed = new URL(url);
      // Convert IDN hostname to punycode (ASCII)
      const asciiHostname = toASCII(parsed.hostname);

      if (asciiHostname !== parsed.hostname) {
        parsed.hostname = asciiHostname;
      }

      // Strip trailing sentence punctuation that may have been captured
      let normalized = parsed.toString();
      normalized = normalized.replace(/[.,;:!?]+$/, '');

      return normalized;
    } catch {
      return url;
    }
  });
}

/**
 * Convert Unicode hostname to ASCII (punycode) representation.
 * Uses the WHATWG URL standard's ToASCII algorithm.
 */
function toASCII(hostname: string): string {
  try {
    // Use URL constructor which handles punycode conversion
    const url = new URL(`http://${hostname}`);
    return url.hostname;
  } catch {
    return hostname;
  }
}
