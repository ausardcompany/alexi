/**
 * Tests for the per-server shutdown timeout added to
 * `McpClientManager.disconnect`.
 *
 * Resolves issue #2160: a hung `client.close()` must not block the
 * surrounding `disconnectAll` indefinitely. The parallel-shutdown
 * contract itself is covered by `tests/mcp/parallel-shutdown.test.ts`
 * — this file focuses on the timeout + forced-cleanup path and the
 * timing invariant (max per-server, not sum per-server) that the
 * timeout preserves even in the pathological "one server hangs
 * forever" case.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DISCONNECT_TIMEOUT_MS, McpClientManager } from '../client.js';
import type { McpConnection } from '../client.js';
import type { McpServerConfig } from '../config.js';

// Silence the manager's shutdown-path logging. We assert on observable
// state (connections map emptied, timing, kill called) rather than on
// log calls, but the warn / info lines would otherwise pollute output.
vi.mock('../../utils/logger.js', async () => {
  const actual =
    await vi.importActual<typeof import('../../utils/logger.js')>('../../utils/logger.js');
  return {
    ...actual,
    logger: {
      ...actual.logger,
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
  };
});

/**
 * Minimal fake client that resolves `close()` after `delayMs`. A
 * delay of `Infinity` means the close never resolves (used to exercise
 * the timeout path without actually waiting forever: the timeout
 * fires first).
 */
class FakeClient {
  closeCalls = 0;
  closed = false;
  constructor(private readonly delayMs: number) {}
  async close(): Promise<void> {
    this.closeCalls += 1;
    if (this.delayMs === Infinity) {
      // Resolve-never promise. The surrounding race's timeout wins.
      await new Promise<void>(() => undefined);
      return;
    }
    if (this.delayMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, this.delayMs));
    }
    this.closed = true;
  }
}

function buildFakeConnection(
  name: string,
  client: FakeClient,
  process?: { kill: () => void; killed?: boolean }
): McpConnection {
  const config: McpServerConfig = {
    name,
    transport: 'stdio',
    command: 'node',
    args: [],
    enabled: true,
  };
  return {
    config,
    client: client as unknown as McpConnection['client'],
    tools: [],
    status: 'connected',
    attemptCount: 1,
    // Cast widens the structural shape without needing a full ChildProcess.
    process: process as unknown as McpConnection['process'],
  };
}

function registerFakeConnection(manager: McpClientManager, connection: McpConnection): void {
  const connections = (manager as unknown as { connections: Map<string, McpConnection> })
    .connections;
  connections.set(connection.config.name, connection);
}

describe('McpClientManager.disconnect (per-server shutdown timeout)', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    manager = new McpClientManager();
  });

  afterEach(async () => {
    await manager.disconnectAll();
  });

  it('exposes a 5 second default disconnect timeout', () => {
    expect(DISCONNECT_TIMEOUT_MS).toBe(5000);
  });

  it('returns promptly when client.close() exceeds the timeout', async () => {
    // A client whose close() never resolves. The disconnect path must
    // still complete within the timeout budget (plus overhead) because
    // the race rejects on the deadline.
    const client = new FakeClient(Infinity);
    const kill = vi.fn();
    registerFakeConnection(manager, buildFakeConnection('hung', client, { kill, killed: false }));

    const start = Date.now();
    await manager.disconnect('hung');
    const elapsed = Date.now() - start;

    // Sanity: timeout must have driven this, not a resolved close().
    expect(client.closeCalls).toBe(1);
    expect(client.closed).toBe(false);
    // Forced cleanup still ran: the child was killed and the entry
    // was removed from the connection map.
    expect(kill).toHaveBeenCalledTimes(1);
    expect(
      (manager as unknown as { connections: Map<string, McpConnection> }).connections.has('hung')
    ).toBe(false);
    // The timeout bound is 5s; we assert elapsed stays within a
    // slack-aware budget (6s) so a scheduler hiccup on CI does not
    // flake. A regression that removed the timeout would wait forever.
    expect(elapsed).toBeLessThan(DISCONNECT_TIMEOUT_MS + 1000);
  }, 10_000);

  it('does not block the parallel teardown when one server hangs', async () => {
    const hung = new FakeClient(Infinity);
    const fast = new FakeClient(10);
    registerFakeConnection(
      manager,
      buildFakeConnection('hung', hung, { kill: () => undefined, killed: false })
    );
    registerFakeConnection(
      manager,
      buildFakeConnection('fast', fast, { kill: () => undefined, killed: false })
    );

    const start = Date.now();
    await manager.disconnectAll();
    const elapsed = Date.now() - start;

    // Entire shutdown bounded by the slowest per-server deadline, not
    // by the sum of all shutdowns and NOT by infinity.
    expect(elapsed).toBeLessThan(DISCONNECT_TIMEOUT_MS + 1000);
    expect(fast.closed).toBe(true);
    expect(hung.closed).toBe(false);
    // Both entries dropped — the manager has forgotten every server.
    expect(
      (manager as unknown as { connections: Map<string, McpConnection> }).connections.size
    ).toBe(0);
  }, 10_000);

  it('still kills the spawned child process on timeout', async () => {
    const client = new FakeClient(Infinity);
    const kill = vi.fn();
    registerFakeConnection(manager, buildFakeConnection('stuck', client, { kill, killed: false }));

    await manager.disconnect('stuck');

    expect(kill).toHaveBeenCalledTimes(1);
  }, 10_000);

  it('leaves fast closes untouched (no spurious timeout)', async () => {
    const client = new FakeClient(5);
    registerFakeConnection(
      manager,
      buildFakeConnection('quick', client, { kill: () => undefined, killed: false })
    );

    await manager.disconnect('quick');

    expect(client.closed).toBe(true);
    expect(
      (manager as unknown as { connections: Map<string, McpConnection> }).connections.has('quick')
    ).toBe(false);
  });

  it('logs a warning when the close() races the timeout', async () => {
    const { logger } = await import('../../utils/logger.js');
    const client = new FakeClient(Infinity);
    registerFakeConnection(
      manager,
      buildFakeConnection('warn-me', client, { kill: () => undefined, killed: false })
    );

    await manager.disconnect('warn-me');

    const warnMock = logger.warn as unknown as ReturnType<typeof vi.fn>;
    const messages = warnMock.mock.calls.map((args) => String(args[0]));
    expect(messages.some((m) => /exceeded .*ms, forcing cleanup/.test(m))).toBe(true);
  }, 10_000);
});
