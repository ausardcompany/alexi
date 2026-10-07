/**
 * MCP OAuth issuer-rotation detection.
 *
 * Ports upstream kilocode `84b26c697` ("fix(cli): let configured MCP
 * OAuth clients re-authorize at a new authorization server") plus the
 * new `oauth-issuer.ts` helper and its tests.
 *
 * Problem
 * -------
 * When an MCP server rotates its authorization-server (AS) endpoint —
 * e.g. an operator moves from one SSO tenant to another — a client
 * that caches the OLD issuer / token endpoint silently refreshes
 * against the stale AS forever. The refresh fails, Alexi reports an
 * opaque transport error, and the operator has no obvious path to
 * recovery short of wiping `~/.alexi/mcp-oauth/<server>.json` by
 * hand.
 *
 * Fix
 * ---
 * Before performing a token refresh, compare the stored client
 * metadata to the metadata discovered via `.well-known/
 * oauth-authorization-server`. On an issuer or authorization_endpoint
 * change, clear the stored client + tokens and fall through to a
 * fresh dynamic client registration against the new AS.
 *
 * SAP AI Core note
 * ----------------
 * SAP AI Core itself does not use OAuth (it authenticates via the
 * `AICORE_SERVICE_KEY` client-credentials flow against SAP's identity
 * zone). This helper is only relevant when the operator wires up a
 * third-party MCP server that requires an interactive OAuth flow;
 * everything in this module is a pure function so it has no runtime
 * cost when OAuth is unused.
 */

/** Minimal stored shape — only the fields we care about are typed. */
export interface StoredOAuthClient {
  issuer?: string;
  authorization_endpoint?: string;
  token_endpoint?: string;
  client_id?: string;
}

/** Metadata discovered live via `.well-known/oauth-authorization-server`. */
export interface DiscoveredOAuthMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint?: string;
}

/**
 * Returns `true` when the live-discovered metadata disagrees with the
 * stored copy on either `issuer` or `authorization_endpoint`.
 *
 * Semantics:
 *   - If `stored` has no `issuer` (fresh install, legacy record),
 *     returns `false` — there is nothing to compare against yet. The
 *     caller should treat this as "proceed with registration".
 *   - A missing `authorization_endpoint` on the stored side is treated
 *     as a drift signal (we can't prove it matches, so re-register).
 */
export function hasIssuerChanged(
  stored: StoredOAuthClient | undefined,
  discovered: DiscoveredOAuthMetadata
): boolean {
  if (!stored?.issuer) {
    return false;
  }
  if (stored.issuer !== discovered.issuer) {
    return true;
  }
  if (
    stored.authorization_endpoint === undefined ||
    stored.authorization_endpoint !== discovered.authorization_endpoint
  ) {
    return true;
  }
  return false;
}

/** Classification of what the OAuth flow needs to do with the stored state. */
export type ReregistrationAction = 'none' | 'issuer_rotated';

/**
 * Decide whether the current stored client is still usable against the
 * discovered authorization server.
 *
 *   - `'none'`           → stored state is current (or empty); proceed as normal.
 *   - `'issuer_rotated'` → stored state is stale; caller MUST clear the
 *                          cached client + tokens and re-register
 *                          dynamically.
 */
export function requireReregistration(
  stored: StoredOAuthClient | undefined,
  discovered: DiscoveredOAuthMetadata
): ReregistrationAction {
  if (!stored) {
    return 'none';
  }
  if (hasIssuerChanged(stored, discovered)) {
    return 'issuer_rotated';
  }
  return 'none';
}
