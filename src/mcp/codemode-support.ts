/**
 * MCP codemode support tracker.
 *
 * Ports upstream opencode `7b5f1bd` ("skip codemode query for servers
 * that reject it"). Alexi may probe an MCP server for codemode support
 * (a convention where the server exposes a `codemode` tool that returns
 * a boolean / struct). Servers that do not implement codemode respond
 * with `method not found` or an `isError` content block; repeating the
 * probe on every call ties up both sides for no benefit.
 *
 * This module caches the per-server verdict in-memory. The tracker is
 * cleared on process restart and when the MCP connection is torn down
 * (so a server that was reconfigured mid-session is re-probed).
 *
 * SAP AI Core note: unrelated to AI Core (purely about third-party MCP
 * servers), but important for operators who wire up legacy MCP servers
 * that pre-date the codemode convention.
 */

type CodemodeState = 'unknown' | 'supported' | 'unsupported';

const state = new Map<string, CodemodeState>();

/**
 * Mark the given server as having rejected a codemode probe. Future
 * calls to {@link shouldSkipCodemode} will return `true` so no further
 * probes are issued until the tracker is reset.
 */
export function markCodemodeUnsupported(serverName: string): void {
  state.set(serverName, 'unsupported');
}

/**
 * Mark the given server as having answered a codemode probe
 * affirmatively.
 */
export function markCodemodeSupported(serverName: string): void {
  state.set(serverName, 'supported');
}

/**
 * Return `true` when a codemode probe has previously been rejected by
 * the server. Callers SHOULD treat this as a hard "do not re-probe"
 * signal: the plan output stays stable across reconnects.
 */
export function shouldSkipCodemode(serverName: string): boolean {
  return state.get(serverName) === 'unsupported';
}

/**
 * Forget everything we know about `serverName`. Called by the MCP
 * manager on disconnect so a reconfigured server does not inherit a
 * stale verdict.
 */
export function forgetServer(serverName: string): void {
  state.delete(serverName);
}

/**
 * Reset the entire tracker. Exposed for tests.
 */
export function reset(): void {
  state.clear();
}
