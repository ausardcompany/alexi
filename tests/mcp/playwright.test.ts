/**
 * Playwright MCP server registration — end-to-end contract tests.
 *
 * The Playwright MCP server is an OPTIONAL, external alternative to the
 * bundled Puppeteer browser tool (`src/tool/tools/browser.ts`). Alexi
 * does NOT ship a Playwright-specific registration helper: the same
 * generic MCP config path used for every other stdio server also
 * powers Playwright. These tests pin that contract so a future
 * refactor cannot accidentally regress registration, startup retry, or
 * tool schema passthrough for the Playwright entry.
 *
 * Coverage:
 *   1. Registration — the example scaffold parses cleanly through the
 *      Zod schema and normalizes to the `stdio` transport with the
 *      documented retry policy.
 *   2. Startup + retry — the generic retry loop retries a transient
 *      spawn failure with the 3-attempt / 1s-4s exponential-backoff
 *      policy and eventually succeeds when the Playwright server
 *      finishes booting.
 *   3. Graceful degradation — a persistent Playwright startup failure
 *      lands the connection in `failed` state with an actionable error
 *      message, without throwing out of `connect()` (so autoConnect
 *      never bricks session startup).
 *   4. Tool schema passthrough — tools advertised by the Playwright
 *      server flow through the generic tool-discovery path unchanged.
 *
 * These tests deliberately mock `@modelcontextprotocol/client` and
 * `child_process.spawn` so no live Playwright binary or browser
 * install is required in CI.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock child_process.spawn — the real spawn would fail without
// @playwright/mcp-server on PATH. See tests/mcp/client-resilience.test.ts
// for the identical mocking pattern shared across MCP tests.
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock the MCP SDK so no real transport handshake happens. The mocks
// are hoisted by vitest, so declare them above the imports of the code
// under test — same ordering as client-resilience.test.ts.
const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn().mockResolvedValue({ tools: [] });
const mockClientCallTool = vi.fn();
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/client', () => {
  return {
    Client: class MockClient {
      connect = mockClientConnect;
      listTools = mockClientListTools;
      callTool = mockClientCallTool;
      close = mockClientClose;
    },
  };
});

vi.mock('@modelcontextprotocol/client/stdio', () => ({
  StdioClientTransport: vi.fn().mockImplementation(function () {
    return {};
  }),
}));

vi.mock('../../src/mcp/config.js', async () => {
  // Import the REAL module so `validateMcpConfig` (a pure function) is
  // exercised against the example scaffold below, while only stubbing
  // the side-effectful loaders.
  const actual =
    await vi.importActual<typeof import('../../src/mcp/config.js')>('../../src/mcp/config.js');
  return {
    ...actual,
    loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
    resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
  };
});

import { McpClientManager, resolveRetryPolicy } from '../../src/mcp/client.js';
import { validateMcpConfig, type McpConfig, type McpServerConfig } from '../../src/mcp/config.js';

function createMockProcess() {
  const proc = new EventEmitter() as EventEmitter & {
    stdin: EventEmitter;
    stdout: EventEmitter;
    stderr: EventEmitter;
    kill: ReturnType<typeof vi.fn>;
    pid: number;
  };
  proc.stdin = new EventEmitter();
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  proc.kill = vi.fn();
  proc.pid = 54321;
  return proc;
}

/**
 * Node system-call-style error carrying a `code` — the shape the
 * classifier in `src/mcp/client.ts` inspects when deciding transient
 * vs. config errors.
 */
function sysError(code: string, message: string): Error & { code: string } {
  const err = new Error(message) as Error & { code: string };
  err.code = code;
  return err;
}

/**
 * The canonical Playwright MCP server entry as shipped in
 * `mcp-servers.example.json`. Kept inline here so a drift in the
 * example file also fails this test's assertions — the example is
 * simultaneously validated in `tests/mcp-config.test.ts`.
 */
const playwrightServerConfig: McpServerConfig = {
  name: 'playwright',
  description: 'Browser automation via Playwright (optional alternative to bundled Puppeteer tool)',
  transport: 'stdio',
  command: 'npx',
  args: ['-y', '@playwright/mcp-server'],
  enabled: true,
  autoConnect: false,
  timeout: { startup: 10000, request: 30000 },
  retry: {
    enabled: true,
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 4000,
  },
};

describe('Playwright MCP server registration', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    mockClientConnect.mockResolvedValue(undefined);
    mockClientListTools.mockResolvedValue({ tools: [] });
    mockClientClose.mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await manager.disconnectAll();
    vi.restoreAllMocks();
  });

  describe('config registration', () => {
    it('validates a Playwright entry through the generic MCP config schema', () => {
      // The generic Zod schema (`validateMcpConfig`) is the ONE contract
      // Playwright registration goes through — there is no
      // Playwright-specific schema. If the entry drifts (e.g. a new
      // required field appears), operators copying it into their real
      // `mcp-servers.json` would silently fall back to defaults.
      const config: McpConfig = {
        version: '1.0',
        servers: [playwrightServerConfig],
      };
      const result = validateMcpConfig(config);
      expect(result.ok).toBe(true);
      if (result.ok) {
        const server = result.config.servers.find((s) => s.name === 'playwright');
        expect(server).toBeDefined();
        expect(server?.transport).toBe('stdio');
        expect(server?.command).toBe('npx');
        expect(server?.args).toEqual(['-y', '@playwright/mcp-server']);
      }
    });

    it('resolves the documented retry policy (3 attempts, 1s-4s backoff) for the Playwright entry', () => {
      // Retry policy is the ONLY startup-hardening lever Playwright
      // registration exposes; assert the numbers match the docs in
      // `docs/mcp-servers.md` so an accidental copy-paste of the wrong
      // defaults gets caught.
      const policy = resolveRetryPolicy(playwrightServerConfig);
      expect(policy).toEqual({
        maxAttempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 4000,
      });
    });

    it('mcp-servers.example.json is the source of truth for the Playwright entry', () => {
      // Cross-check the inline `playwrightServerConfig` against the
      // committed example file. If the example drifts, either update
      // the inline copy here or update the example — never let them
      // diverge silently.
      const here = path.dirname(fileURLToPath(import.meta.url));
      const examplePath = path.resolve(here, '..', '..', 'mcp-servers.example.json');
      const raw = JSON.parse(fs.readFileSync(examplePath, 'utf-8')) as McpConfig;
      const example = raw.servers.find((s) => s.name === 'playwright');
      expect(example).toBeDefined();
      // The example ships disabled by default (opt-in); the inline
      // copy flips `enabled` to true so the retry / connect flow can
      // be exercised. All other fields must match verbatim.
      expect(example?.transport).toBe(playwrightServerConfig.transport);
      expect(example?.command).toBe(playwrightServerConfig.command);
      expect(example?.args).toEqual(playwrightServerConfig.args);
      expect(example?.timeout).toEqual(playwrightServerConfig.timeout);
      expect(example?.retry).toEqual(playwrightServerConfig.retry);
    });
  });

  describe('startup retry', () => {
    it('retries a transient Playwright startup failure with exponential backoff and succeeds', async () => {
      // Simulate a first-attempt spawn race (ECONNRESET on the stdio
      // pipe — the Playwright server's Node child had not yet grabbed
      // stdin when we sent the initialize request). Second attempt
      // succeeds. The delay spy asserts the 1s backoff schedule.
      const delaySpy = vi
        .spyOn(manager as unknown as { delay: (ms: number) => Promise<void> }, 'delay')
        .mockResolvedValue(undefined);

      mockClientConnect
        .mockRejectedValueOnce(sysError('ECONNRESET', 'read ECONNRESET (playwright pipe)'))
        .mockResolvedValueOnce(undefined);

      const connection = await manager.connect(playwrightServerConfig);
      expect(connection.status).toBe('connected');
      expect(connection.attemptCount).toBe(2);
      expect(mockClientConnect).toHaveBeenCalledTimes(2);
      // First (and only) backoff between attempts 1 and 2 is the
      // documented 1000ms initial delay.
      const delays = delaySpy.mock.calls.map((c) => c[0]);
      expect(delays).toEqual([1000]);
    });

    it('exhausts the 3-attempt retry budget on persistent Playwright startup timeouts and lands failed', async () => {
      // Simulate a permanently-slow Playwright cold start: every
      // attempt hits an ETIMEDOUT during the JSON-RPC handshake.
      // Retry classifier treats this as transient, so all 3 attempts
      // are spent before falling into the terminal `failed` state.
      mockClientConnect.mockRejectedValue(sysError('ETIMEDOUT', 'connect ETIMEDOUT (playwright)'));

      // Compress delays to zero so the test runs fast.
      vi.spyOn(
        manager as unknown as { delay: (ms: number) => Promise<void> },
        'delay'
      ).mockResolvedValue(undefined);

      const connection = await manager.connect(playwrightServerConfig);
      expect(connection.status).toBe('failed');
      expect(connection.attemptCount).toBe(3);
      expect(mockClientConnect).toHaveBeenCalledTimes(3);
      expect(connection.error).toMatch(/ETIMEDOUT/);
    });
  });

  describe('graceful degradation', () => {
    it('does NOT throw when @playwright/mcp-server is missing (ENOENT); connection registered with actionable error', async () => {
      // The classic operator foot-gun: the config entry is present,
      // but `@playwright/mcp-server` has not been installed. `spawn`
      // fails with ENOENT (config-class error) so retry is NOT spent
      // — the connection lands in `failed` on the first attempt with
      // an error message that names the exact config field to fix.
      mockClientConnect.mockRejectedValue(sysError('ENOENT', 'spawn npx ENOENT'));

      const connection = await manager.connect({
        ...playwrightServerConfig,
        command: 'playwright-mcp-not-installed',
      });

      // Must NOT have thrown out of `connect()` — session startup
      // stays alive so the operator can chat with other tools while
      // fixing the Playwright install.
      expect(connection.status).toBe('failed');
      expect(connection.attemptCount).toBe(1);
      expect(mockClientConnect).toHaveBeenCalledTimes(1);
      expect(connection.error).toContain("'playwright'");
      expect(connection.error).toContain('ENOENT');
      expect(connection.error).toContain("'command' field in mcp-servers.json");
    });

    it('leaves a failed Playwright connection visible via getStatus() for operator diagnostics', async () => {
      // `getStatus()` is what `alexi mcp status` and the TUI status
      // panel read. A failed Playwright server must remain listed
      // (not silently swallowed) so operators can see the error and
      // reconnect after fixing it.
      mockClientConnect.mockRejectedValue(sysError('ENOENT', 'spawn ENOENT'));

      await manager.connect({
        ...playwrightServerConfig,
        command: 'ghost-binary',
      });

      const entries = manager.getStatus();
      const entry = entries.find((s) => s.name === 'playwright');
      expect(entry).toBeDefined();
      expect(entry?.status).toBe('failed');
      expect(entry?.error).toContain('playwright');
    });
  });

  describe('tool schema passthrough', () => {
    it('auto-discovers Playwright tools with their upstream schemas unchanged', async () => {
      // The upstream Playwright MCP server exposes tools whose names
      // and Zod-equivalent JSON Schemas come from Playwright itself.
      // Alexi does NOT remap them; the generic `listAllTools` path
      // simply forwards what the server advertises.
      mockClientListTools.mockResolvedValue({
        tools: [
          {
            name: 'browser_navigate',
            description: 'Navigate to a URL in the Playwright-controlled browser',
            inputSchema: {
              type: 'object',
              properties: {
                url: { type: 'string', description: 'Target URL' },
              },
              required: ['url'],
            },
          },
          {
            name: 'browser_screenshot',
            description: 'Capture a screenshot of the current Playwright page',
            inputSchema: {
              type: 'object',
              properties: {
                fullPage: { type: 'boolean' },
              },
            },
          },
        ],
      });

      const connection = await manager.connect(playwrightServerConfig);
      expect(connection.status).toBe('connected');
      // Both Playwright tools show up on the connection object with
      // their advertised names and schemas — no filtering, no
      // renaming beyond the qualified-name prefix Alexi adds for
      // cross-server disambiguation.
      const toolNames = connection.tools.map((t) => t.name).sort();
      expect(toolNames).toEqual(['browser_navigate', 'browser_screenshot']);

      const navigate = connection.tools.find((t) => t.name === 'browser_navigate');
      expect(navigate?.serverName).toBe('playwright');
      expect(navigate?.qualifiedName).toContain('playwright');
      // Upstream schema is preserved verbatim (with the standard
      // object-schema `properties` normalization applied by
      // `mapToolInfo` — a no-op here because `properties` is already
      // present).
      expect(navigate?.inputSchema).toEqual({
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Target URL' },
        },
        required: ['url'],
      });
    });

    it('tolerates a Playwright server that advertises zero tools without failing the connection', async () => {
      // Edge case: some upstream builds gate tools behind a runtime
      // config (e.g. no browser binaries installed). The connection
      // should still succeed so operators see a clear "connected but
      // empty" state rather than a mysterious failure.
      mockClientListTools.mockResolvedValue({ tools: [] });

      const connection = await manager.connect(playwrightServerConfig);
      expect(connection.status).toBe('connected');
      expect(connection.tools).toEqual([]);
    });
  });
});
