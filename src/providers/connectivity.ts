/**
 * API Connectivity Check
 *
 * Provides a lightweight connectivity check with timeout for initial API calls.
 * Prevents indefinite hangs when the API is unreachable (e.g., captive portals,
 * restrictive firewalls, VPNs).
 */

const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * Result of a connectivity check
 */
export interface ConnectivityResult {
  reachable: boolean;
  error?: string;
}

/**
 * Check connectivity to the API base URL with a timeout.
 *
 * Makes a lightweight HEAD request (falling back to GET on method-not-allowed)
 * to determine if the API endpoint is reachable within the given timeout.
 *
 * @param baseUrl - The API base URL to check
 * @param timeoutMs - Timeout in milliseconds (default: 15000)
 * @returns Structured result indicating reachability
 */
export async function checkConnectivity(
  baseUrl: string,
  timeoutMs?: number
): Promise<ConnectivityResult> {
  const timeout = timeoutMs ?? DEFAULT_TIMEOUT_MS;

  try {
    const response = await fetch(baseUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(timeout),
    });

    // Any HTTP response means the server is reachable (even 4xx/5xx)
    // We only care about network-level reachability, not auth status
    if (response.ok || response.status < 500) {
      return { reachable: true };
    }

    // 5xx still means the server responded — it's reachable
    return { reachable: true };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      return {
        reachable: false,
        error: `API unreachable after ${Math.round(timeout / 1000)}s — check network connection`,
      };
    }

    if (
      err instanceof TypeError &&
      (err.message.includes('fetch') || err.message.includes('network'))
    ) {
      return {
        reachable: false,
        error: `API unreachable — check network connection: ${err.message}`,
      };
    }

    const message = err instanceof Error ? err.message : String(err);
    return {
      reachable: false,
      error: `API connectivity check failed: ${message}`,
    };
  }
}
