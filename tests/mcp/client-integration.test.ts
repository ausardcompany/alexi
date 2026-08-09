/**
 * MCP client integration tests.
 *
 * End-to-end coverage of the `connect -> initialize -> fetch-metadata
 * -> timeout` pipeline against a real subprocess MCP server. Unit
 * tests in `client.test.ts`, `client-timeout.test.ts`, and
 * `client-timeout-lifecycle.test.ts` all mock the SDK and child_process
 * layers; those pin the internal timeout wiring but cannot catch a
 * regression in the actual wire protocol handshake, stdio transport,
 * or SDK version bump. This file uses `tests/fixtures/slow-mcp-server.js`,
 * a real `McpServer` over stdio driven by `STARTUP_DELAY_MS`, so we
 * exercise the SDK end-to-end.
 *
 * Test-fast constraints: every scenario caps the client-side `timeout`
 * to a few seconds and every fixture subprocess is killed in
 * `afterEach` via `disconnectAll()`. The full file should finish well
 * under 30s.
 */
import { describe, it, expect, afterEach } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import { McpClientManager } from '../../src/mcp/client.js';
import type { McpServerConfig } from '../../src/mcp/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PATH = path.resolve(__dirname, '../fixtures/slow-mcp-server.js');

/**
 * Build an `McpServerConfig` that spawns the fixture with the given
 * `STARTUP_DELAY_MS` value. All fields default to values that keep
 * tests fast: stdio transport, autoConnect disabled (the tests drive
 * `connect()` manually), and a short client-side `timeout` unless the
 * caller overrides it.
 */
function fixtureConfig(
  name: string,
  startupDelayMs: number,
  timeout?: McpServerConfig['timeout']
): McpServerConfig {
  const config: McpServerConfig = {
    name,
    transport: 'stdio',
    command: 'node',
    args: [FIXTURE_PATH],
    env: {
      STARTUP_DELAY_MS: String(startupDelayMs),
    },
    enabled: true,
  };
  if (timeout !== undefined) {
    config.timeout = timeout;
  }
  return config;
}

describe('McpClientManager (integration)', () => {
  let manager: McpClientManager;

  afterEach(async () => {
    if (manager) {
      await manager.disconnectAll();
    }
  });

  it('connects successfully against a fast server (0ms delay)', async () => {
    manager = new McpClientManager();
    const connection = await manager.connect(fixtureConfig('fast', 0, 5000));

    expect(connection.status).toBe('connected');
    expect(connection.error).toBeUndefined();
    // The fixture registers exactly one tool named `ping`.
    const toolNames = connection.tools.map((t) => t.name);
    expect(toolNames).toContain('ping');
  }, 15000);

  it('fails after the configured startup timeout when the server is slow', async () => {
    manager = new McpClientManager();

    // Server delays 5s before responding to initialize. Client budget
    // is 2s (per-server `timeout`) so the startup guard must fire and
    // classify this as `failed` rather than let the handshake block.
    const config = fixtureConfig('slow-default', 5000, 2000);
    const t0 = Date.now();
    const connection = await manager.connect(config);
    const elapsed = Date.now() - t0;

    expect(connection.status).toBe('failed');
    // The manager-formatted timeout error names the exceeded budget
    // and points at `timeout.startup` so an operator knows which
    // field to raise. See `formatTimeoutError` in src/mcp/client.ts.
    expect(connection.error).toMatch(/startup timeout for server 'slow-default'/);
    expect(connection.error).toMatch(/timeout\.startup/);
    // Wall-clock: must not exceed the client-side bound by more than
    // a spawn-and-kill buffer. 4s leaves ample margin on cold CI while
    // still catching a regression that ignores the bound entirely.
    expect(elapsed).toBeLessThan(4000);
  }, 15000);

  it('succeeds when a slow server has a matching timeout override', async () => {
    manager = new McpClientManager();

    // Server delays 2s before responding; per-server `timeout` is 6s
    // so the handshake completes well before the budget expires.
    const config = fixtureConfig('slow-override', 2000, 6000);
    const t0 = Date.now();
    const connection = await manager.connect(config);
    const elapsed = Date.now() - t0;

    expect(connection.status).toBe('connected');
    expect(connection.error).toBeUndefined();
    // Sanity check: the delay was actually observed. This guards
    // against a regression where the fixture ignores STARTUP_DELAY_MS
    // and connects immediately, which would mask an override bug.
    expect(elapsed).toBeGreaterThanOrEqual(1500);
    expect(elapsed).toBeLessThan(6000);
  }, 15000);

  it('fails when a hung server exhausts the configured timeout', async () => {
    manager = new McpClientManager();

    // `STARTUP_DELAY_MS < 0` puts the fixture into hung mode: the
    // subprocess stays alive but never connects the transport, so no
    // `initialize` response ever arrives. With a 2s client-side budget
    // this must fail with the same actionable message as a slow server.
    const config = fixtureConfig('hung', -1, 2000);
    const t0 = Date.now();
    const connection = await manager.connect(config);
    const elapsed = Date.now() - t0;

    expect(connection.status).toBe('failed');
    expect(connection.error).toMatch(/startup timeout for server 'hung'/);
    expect(elapsed).toBeLessThan(4000);
  }, 15000);

  it('connects a fast server and rejects a slow one when both use mixed configs', async () => {
    manager = new McpClientManager();

    const [fast, slow] = await Promise.all([
      manager.connect(fixtureConfig('mixed-fast', 0, 5000)),
      manager.connect(fixtureConfig('mixed-slow', 5000, 1500)),
    ]);

    expect(fast.status).toBe('connected');
    expect(fast.error).toBeUndefined();
    expect(fast.tools.map((t) => t.name)).toContain('ping');

    expect(slow.status).toBe('failed');
    expect(slow.error).toMatch(/startup timeout for server 'mixed-slow'/);
    expect(slow.error).toMatch(/timeout\.startup/);
  }, 15000);
});
