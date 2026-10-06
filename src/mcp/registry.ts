/**
 * MCP server runtime-status registry.
 *
 * Ports upstream kilocode commits `c58468b1c` ("clear cached MCP
 * status when a server is uninstalled") and `d395d0314` ("scoped
 * purge — only clear status entries owned by the scope that uninstalled
 * them"). Prevents misleading "signed in / connected" status entries
 * from lingering after a server is removed from `mcp-servers.json`.
 *
 * Alexi's MCP configuration is single-scope today (user-only, stored
 * at `~/.alexi/mcp-servers.json`). The {@link McpScope} enum is still
 * exposed so a future project-scope rollout can distinguish entries
 * without a schema migration. `uninstallServer` only purges entries
 * whose `ownerScope` matches the scope it was called with — matching
 * upstream's two-scope semantics.
 */

/**
 * Scope that owns a status entry. User-scope entries come from
 * `~/.alexi/mcp-servers.json`; project-scope entries come from a
 * `.alexi/mcp-servers.json` next to the current working directory
 * (reserved for a future rollout).
 */
export type McpScope = 'user' | 'project';

export interface McpStatusEntry {
  /** Server id (matches `McpServerConfig.name`). */
  serverId: string;
  /** Scope that owns this entry — determines who may purge it. */
  ownerScope: McpScope;
  /** Last observed runtime state. */
  state: 'connected' | 'disconnected' | 'connecting' | 'failed' | 'signed-in';
  /** Human-readable detail message (optional). */
  detail?: string;
  /** `Date.now()` timestamp of the last update. */
  updatedAt: number;
}

/**
 * In-memory status cache keyed by `${scope}::${serverId}`. Kept at
 * module scope so every caller shares the same registry; tests can
 * clear it with {@link _clearStatusCacheForTests}.
 */
const mcpStatusCache = new Map<string, McpStatusEntry>();

function cacheKey(serverId: string, scope: McpScope): string {
  return `${scope}::${serverId}`;
}

/**
 * Record or update the runtime status of an MCP server.
 */
export function setStatus(entry: Omit<McpStatusEntry, 'updatedAt'>): void {
  const full: McpStatusEntry = { ...entry, updatedAt: Date.now() };
  mcpStatusCache.set(cacheKey(entry.serverId, entry.ownerScope), full);
}

/**
 * Look up the current status entry for a server in a specific scope.
 * Returns `undefined` when nothing is cached.
 */
export function getStatus(serverId: string, scope: McpScope): McpStatusEntry | undefined {
  return mcpStatusCache.get(cacheKey(serverId, scope));
}

/**
 * Return every cached status entry (for diagnostics / `alexi mcp status`).
 */
export function listStatuses(): McpStatusEntry[] {
  return Array.from(mcpStatusCache.values());
}

/**
 * Uninstall an MCP server from a given scope.
 *
 * Ports kilocode `c58468b1c` + `d395d0314`:
 *   - Clears every cached status entry for `serverId` whose
 *     `ownerScope` equals `scope`. Entries owned by OTHER scopes are
 *     preserved so e.g. uninstalling a user-scope server does not
 *     purge a same-named project-scope entry (upstream regression).
 *   - Returns the number of entries actually purged so callers (e.g.
 *     an `alexi mcp remove` CLI subcommand) can log an accurate
 *     "removed N stale status entries" line.
 */
export function uninstallServer(serverId: string, scope: McpScope): number {
  let removed = 0;
  for (const [key, entry] of mcpStatusCache) {
    if (entry.serverId === serverId && entry.ownerScope === scope) {
      mcpStatusCache.delete(key);
      removed++;
    }
  }
  return removed;
}

/**
 * Test-only hook: drop every cached status entry. Not exported from
 * `src/mcp/index.ts`; tests import this file directly.
 * @internal
 */
export function _clearStatusCacheForTests(): void {
  mcpStatusCache.clear();
}
