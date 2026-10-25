/**
 * Slow / configurable MCP server mock used by the parallel-shutdown
 * integration tests.
 *
 * Exposes a shape compatible with the subset of the SDK `Client` surface
 * `McpClientManager.disconnect` touches:
 *
 * - `close(): Promise<void>` — awaits `shutdownDelayMs`, flips
 *   `isShutdown` to `true`, and (optionally) throws when
 *   `throwOnShutdown` is `true`. Repeated calls remain safe and keep
 *   `isShutdown === true` so idempotency can be asserted.
 *
 * The mock is deliberately independent from `@modelcontextprotocol/client`
 * so a test does not have to boot a real MCP server to exercise the
 * manager's shutdown orchestration.
 */
export interface SlowMcpServerOptions {
  /** Fail the shutdown by throwing after the configured delay. */
  throwOnShutdown?: boolean;
}

export class SlowMcpServer {
  readonly shutdownDelayMs: number;
  readonly throwOnShutdown: boolean;
  /** Number of times `close()` has been invoked (observed by tests). */
  shutdownCalls = 0;
  /** Flipped to `true` the first time `close()` resolves successfully. */
  isShutdown = false;

  constructor(shutdownDelayMs = 100, options: SlowMcpServerOptions = {}) {
    this.shutdownDelayMs = shutdownDelayMs;
    this.throwOnShutdown = options.throwOnShutdown === true;
  }

  async close(): Promise<void> {
    this.shutdownCalls += 1;
    if (this.shutdownDelayMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, this.shutdownDelayMs));
    }
    if (this.throwOnShutdown) {
      throw new Error(`SlowMcpServer forced-throw after ${this.shutdownDelayMs}ms`);
    }
    this.isShutdown = true;
  }
}
