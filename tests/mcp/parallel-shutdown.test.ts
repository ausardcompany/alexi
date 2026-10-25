import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { McpClientManager } from '../../src/mcp/client.js';
import type { McpConnection } from '../../src/mcp/client.js';
import type { McpServerConfig } from '../../src/mcp/config.js';
import { SlowMcpServer } from './__mocks__/slow-server.js';

// Silence logger warn/info/error spam coming out of the manager's
// shutdown path — we validate the public behaviour (timing + state),
// not what gets logged. Keep `debug` as-is so an unexpected log at that
// level still surfaces in CI.
vi.mock('../../src/utils/logger.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/utils/logger.js')>(
    '../../src/utils/logger.js'
  );
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
 * Build a bare `McpConnection` wrapping a {@link SlowMcpServer} as its
 * `client`. The real SDK `Client` is intentionally bypassed: this test
 * suite exercises {@link McpClientManager.disconnectAll} and friends,
 * which only touch `client.close()` plus a few bookkeeping fields.
 *
 * `connection.process` is omitted so the manager's `process.kill()`
 * branch is skipped — real stdio child cleanup is covered by other
 * integration tests.
 */
function buildFakeConnection(name: string, server: SlowMcpServer): McpConnection {
  const config: McpServerConfig = {
    name,
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };
  return {
    config,
    // The manager only ever calls `.close()` on this during disconnect;
    // cast through unknown is required because `SlowMcpServer` is
    // intentionally not a full SDK `Client`.
    client: server as unknown as McpConnection['client'],
    tools: [],
    status: 'connected',
    attemptCount: 1,
  };
}

/**
 * Access the private `connections` map so tests can inject fake
 * {@link McpConnection}s without going through the real transport
 * handshake. Isolated here so the cast lives in exactly one place.
 */
function registerFakeConnections(
  manager: McpClientManager,
  entries: Array<{ name: string; server: SlowMcpServer }>
): void {
  const connections = (manager as unknown as { connections: Map<string, McpConnection> })
    .connections;
  for (const { name, server } of entries) {
    connections.set(name, buildFakeConnection(name, server));
  }
}

describe('McpClientManager.disconnectAll (parallel shutdown)', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    manager = new McpClientManager();
  });

  afterEach(async () => {
    // Defensive — most tests already drained the manager.
    await manager.disconnectAll();
  });

  it('shuts down all servers concurrently (total time ~1x, not Nx)', async () => {
    const perServerDelayMs = 80;
    const serverCount = 5;
    const servers = Array.from({ length: serverCount }, () => new SlowMcpServer(perServerDelayMs));
    registerFakeConnections(
      manager,
      servers.map((server, i) => ({ name: `srv-${i}`, server }))
    );

    const start = Date.now();
    await manager.disconnectAll();
    const elapsed = Date.now() - start;

    // Sequential would be `perServerDelayMs * serverCount` (400ms); the
    // parallel bound is `perServerDelayMs + overhead`. Allow a generous
    // 2x of the per-server delay as overhead budget so CI's noisy
    // scheduler does not flake, while still catching a regression to
    // sequential (which would be >= 320ms here).
    expect(elapsed).toBeLessThan(perServerDelayMs * 2);
    // And every server must have been closed exactly once.
    for (const server of servers) {
      expect(server.isShutdown).toBe(true);
      expect(server.shutdownCalls).toBe(1);
    }
  });

  it('completes shutdown even when one server throws during close', async () => {
    const healthyA = new SlowMcpServer(20);
    const faulty = new SlowMcpServer(20, { throwOnShutdown: true });
    const healthyB = new SlowMcpServer(20);
    registerFakeConnections(manager, [
      { name: 'healthy-a', server: healthyA },
      { name: 'faulty', server: faulty },
      { name: 'healthy-b', server: healthyB },
    ]);

    // Must not reject — `disconnectAll` is a best-effort cleanup path.
    await expect(manager.disconnectAll()).resolves.toBeUndefined();

    // The two healthy servers were cleaned up despite the faulty peer.
    expect(healthyA.isShutdown).toBe(true);
    expect(healthyB.isShutdown).toBe(true);
    // The faulty server threw after advancing to `shutdownCalls === 1`
    // but never reached the `isShutdown = true` assignment.
    expect(faulty.shutdownCalls).toBe(1);
    expect(faulty.isShutdown).toBe(false);
  });

  it('is idempotent: a second disconnectAll is a no-op', async () => {
    const a = new SlowMcpServer(10);
    const b = new SlowMcpServer(10);
    registerFakeConnections(manager, [
      { name: 'a', server: a },
      { name: 'b', server: b },
    ]);

    await manager.disconnectAll();
    // Repeated shutdown must not throw and must not re-close already
    // removed connections.
    await expect(manager.disconnectAll()).resolves.toBeUndefined();

    expect(a.shutdownCalls).toBe(1);
    expect(b.shutdownCalls).toBe(1);
  });

  it('handles an empty connection map without error', async () => {
    await expect(manager.disconnectAll()).resolves.toBeUndefined();
  });

  it('repeated disconnect(name) after cleanup is a no-op', async () => {
    const a = new SlowMcpServer(5);
    registerFakeConnections(manager, [{ name: 'solo', server: a }]);

    await manager.disconnect('solo');
    // Already removed from the map — second call must early-return.
    await expect(manager.disconnect('solo')).resolves.toBeUndefined();
    // Also safe for a name that was never registered.
    await expect(manager.disconnect('never-existed')).resolves.toBeUndefined();

    expect(a.shutdownCalls).toBe(1);
  });
});
