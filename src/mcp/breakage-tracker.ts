/**
 * MCP breakage tracker.
 *
 * Keeps an in-memory tally of protocol-violation counts per server so
 * that a server that keeps returning malformed MCP responses can be
 * disabled after a bounded number of violations instead of degrading
 * every session that touches it.
 *
 * The tracker is deliberately decoupled from the validator
 * (`src/mcp/validator.ts`) and from the MCP client wiring. Callers
 * record violations by name; a separate query answers whether the
 * server should be disabled; a reset hook clears the tally when the
 * operator restarts the server.
 *
 * This is intentionally NOT persisted: a server that was disabled
 * mid-session gets a fresh chance on the next process boot. Operators
 * who want the previous disable to stick should fix the server before
 * reconnecting.
 */

/**
 * Default number of violations before a server is considered broken
 * enough to disable for the remainder of the session. Three is the
 * middle ground: one transient hiccup is forgiven, but a server that
 * keeps returning malformed payloads cannot keep burning tool-call
 * budgets.
 */
export const DEFAULT_BREAKAGE_THRESHOLD = 3;

/**
 * A single recorded violation. Retained so operators / tests can
 * reconstruct exactly which methods and messages tripped the budget.
 */
export interface RecordedViolation {
  method: string;
  violations: string[];
  recordedAt: number;
}

/**
 * Error thrown by {@link McpClientManager} when a server crosses the
 * breakage threshold during `connect()`. Carries the actionable disable
 * reason so the retry loop can classify it as a permanent config error
 * (no amount of retrying will un-break a server that keeps returning
 * malformed responses).
 */
export class McpBreakageExceededError extends Error {
  override readonly name = 'McpBreakageExceededError';
  readonly serverName: string;

  constructor(serverName: string, message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.serverName = serverName;
  }
}

/**
 * In-memory breakage tracker for MCP servers.
 *
 * Not thread-safe (Node.js is single-threaded in the main loop; the
 * surface is only intended to be touched from the MCP client manager).
 * `recordViolation` is cheap: a single map lookup + push.
 */
export class McpBreakageTracker {
  private readonly counts: Map<string, number> = new Map();
  private readonly history: Map<string, RecordedViolation[]> = new Map();
  private readonly threshold: number;

  constructor(threshold: number = DEFAULT_BREAKAGE_THRESHOLD) {
    if (!Number.isFinite(threshold) || !Number.isInteger(threshold) || threshold < 1) {
      throw new Error(`McpBreakageTracker threshold must be a positive integer, got ${threshold}`);
    }
    this.threshold = threshold;
  }

  /**
   * Record a single violation against `serverName`. `violations` should
   * come straight from {@link validateMcpResponse}; the tracker counts
   * the CALL (not the number of distinct violation strings) because a
   * single malformed response is a single breakage event.
   *
   * No-ops when `violations` is empty — callers can therefore pipe the
   * validator result unconditionally without a guard.
   */
  recordViolation(serverName: string, method: string, violations: string[]): void {
    if (violations.length === 0) {
      return;
    }
    const next = (this.counts.get(serverName) ?? 0) + 1;
    this.counts.set(serverName, next);
    const log = this.history.get(serverName) ?? [];
    log.push({ method, violations: [...violations], recordedAt: Date.now() });
    this.history.set(serverName, log);
  }

  /**
   * Current violation count for `serverName`. Zero when no violations
   * have been recorded.
   */
  getViolationCount(serverName: string): number {
    return this.counts.get(serverName) ?? 0;
  }

  /**
   * True when `serverName` has accumulated at least {@link threshold}
   * violations. The caller is responsible for actually disabling the
   * server; the tracker only exposes the decision.
   */
  shouldDisableServer(serverName: string): boolean {
    return this.getViolationCount(serverName) >= this.threshold;
  }

  /**
   * Return a shallow copy of the recorded violation history for
   * `serverName`. Useful for diagnostics / tests. Returns an empty
   * array when no violations have been recorded.
   */
  getHistory(serverName: string): RecordedViolation[] {
    return [...(this.history.get(serverName) ?? [])];
  }

  /**
   * Clear all recorded violations for `serverName`. Call this when the
   * operator reconnects / restarts the server after an operator-side
   * fix so the fresh connection does not start pre-poisoned.
   */
  reset(serverName: string): void {
    this.counts.delete(serverName);
    this.history.delete(serverName);
  }

  /**
   * Clear all recorded violations across all servers. Intended for
   * tests and for `resetMcpClientManager()`-style global teardown.
   */
  resetAll(): void {
    this.counts.clear();
    this.history.clear();
  }

  /**
   * Build the operator-facing warning message emitted when a server
   * crosses the breakage threshold. Extracted so the client wiring and
   * the tests can assert the exact wording.
   */
  disableReason(serverName: string): string {
    return (
      `MCP server '${serverName}' disabled after ${this.threshold} protocol violations. ` +
      `Check the server's logs and update 'mcp-servers.json' or roll back to a ` +
      `working version. Restart Alexi (or call 'tracker.reset()') to retry.`
    );
  }
}
