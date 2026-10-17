/**
 * MCP OAuth token refresh with bounded single-flight.
 *
 * Ports kilocode commits:
 *   - f9b632fd6 ("fix(cli): refresh expired MCP OAuth tokens automatically")
 *   - fb9277937 (bounded refresh timeout)
 *   - 9204aac51 (single-flight guard clears on failure)
 *
 * SAP integrations typically ship short-lived (5–15 min) OAuth tokens
 * on their MCP connectors; without proactive refresh the operator sees
 * random 401s on long-running agent sessions and has to re-auth each
 * MCP server manually. This module makes refresh:
 *
 *   1. Automatic — triggered whenever `expiresAt - skew` has passed.
 *   2. Single-flight per server — concurrent calls dedupe to one
 *      outbound refresh request.
 *   3. Bounded — the refresh request is wrapped in a timeout so a
 *      hung IdP cannot stall the entire MCP client; the single-flight
 *      entry is ALWAYS cleared in a `finally` so a transient failure
 *      does not poison subsequent refresh attempts (kilocode 9204aac51
 *      regression).
 *   4. Separate from the SAP AI Core auth path — AI Core uses its own
 *      client-credentials grant via `src/providers/auth.ts`; this
 *      module only serves third-party MCP connectors.
 */

/**
 * Token record as persisted by the MCP OAuth flow.
 *   - `accessToken` is sent as `Authorization: Bearer <token>`.
 *   - `expiresAt` is an absolute epoch-ms timestamp. Relative
 *     `expires_in` responses from the IdP are converted at acquisition
 *     time, not here, so this module is stateless w.r.t. the clock.
 */
export interface McpOauthToken {
  accessToken: string;
  expiresAt: number;
}

/**
 * Refresh callback supplied by the MCP client. Must return a fresh
 * token record. Thrown errors are propagated to the caller after the
 * single-flight entry is cleared — see `ensureFreshToken`.
 */
export type RefreshFn = () => Promise<McpOauthToken>;

export interface EnsureFreshTokenOptions {
  /**
   * Hard cap on the refresh request duration (ms). After this timeout
   * fires, the single-flight entry is cleared and the caller sees an
   * `Error('mcp.refresh.timeout')`. Required to keep a hung IdP from
   * stalling the MCP client indefinitely.
   */
  connectTimeoutMs: number;
  /**
   * Clock skew margin (ms). A token is considered expired when
   * `expiresAt - skewMs <= now()`. Default: 30 s.
   */
  skewMs?: number;
}

/**
 * Default clock skew when the caller does not override it. 30 s is
 * conservative enough to survive wall-clock drift between the operator
 * and the IdP without being so large that short-lived tokens appear
 * never-valid.
 */
export const DEFAULT_REFRESH_SKEW_MS = 30_000;

/**
 * In-flight refresh promises keyed by server id. The value is the
 * promise that resolves with the fresh access token, so late joiners
 * can `await` the same work instead of issuing a parallel refresh.
 */
const inflight = new Map<string, Promise<string>>();

/**
 * Return a non-expired access token for the given MCP server. Triggers
 * a refresh when `current` is `undefined` or past its `expiresAt - skew`
 * boundary. Concurrent callers share the same in-flight refresh.
 *
 * The single-flight entry is cleared in a `finally` block (kilocode
 * 9204aac51 regression) — this is CRITICAL: if a refresh fails and the
 * entry is not cleared, every subsequent call sees the same failed
 * promise and the client is permanently stuck.
 */
export async function ensureFreshToken(
  serverId: string,
  current: McpOauthToken | undefined,
  refresh: RefreshFn,
  opts: EnsureFreshTokenOptions
): Promise<string> {
  const now = Date.now();
  const skew = opts.skewMs ?? DEFAULT_REFRESH_SKEW_MS;
  if (current && current.expiresAt - skew > now) {
    return current.accessToken;
  }

  const existing = inflight.get(serverId);
  if (existing) {
    return existing;
  }

  const p = (async (): Promise<string> => {
    try {
      const refreshed = await withTimeout(refresh(), opts.connectTimeoutMs, 'mcp.refresh.timeout');
      return refreshed.accessToken;
    } finally {
      // CRITICAL: clear the single-flight entry so a transient
      // refresh failure does not poison every subsequent attempt.
      // Mirrors kilocode 9204aac51.
      inflight.delete(serverId);
    }
  })();
  inflight.set(serverId, p);
  return p;
}

/**
 * Race `p` against a timeout. Resolves with `p`'s result if it wins;
 * rejects with `Error(label)` if the timeout wins. The timer is
 * cleared in both outcomes so the test runner does not see dangling
 * handles. Not exported because its only consumer is this module.
 */
async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race<T>([
      p,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(label)), ms);
      }),
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

/**
 * Test-only hook: forget the in-flight entry for a given server. Not
 * exported from the module's public barrel to keep production code
 * from using it as a side-channel.
 */
export function _clearInflightForTests(serverId?: string): void {
  if (serverId === undefined) {
    inflight.clear();
    return;
  }
  inflight.delete(serverId);
}
