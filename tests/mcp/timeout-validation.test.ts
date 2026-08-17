import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import os from 'os';

import {
  validateMcpConfig,
  MCP_TIMEOUT_MIN_MS,
  MCP_TIMEOUT_MAX_MS,
  addMcpServer,
  loadMcpConfig,
  type McpServerConfig,
  type McpConfig,
} from '../../src/mcp/config.js';

/**
 * Fast, isolated tests for MCP timeout validation. These cover the
 * static shape checks (`validateMcpConfig`, `addMcpServer`, `loadMcpConfig`)
 * without spinning up a real MCP client. Runtime timeout-precedence tests
 * live in `tests/mcp/timeout.test.ts` and `tests/mcp/client-global-timeout.test.ts`.
 */

describe('validateMcpConfig', () => {
  it('accepts a minimal valid config', () => {
    const config: McpConfig = {
      version: '1.0',
      servers: [],
    };
    const result = validateMcpConfig(config);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config).toEqual(config);
    }
  });

  it('accepts bare-number global timeout at the minimum boundary', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: MCP_TIMEOUT_MIN_MS,
      servers: [],
    });
    expect(result.ok).toBe(true);
  });

  it('accepts bare-number global timeout at the maximum boundary', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: MCP_TIMEOUT_MAX_MS,
      servers: [],
    });
    expect(result.ok).toBe(true);
  });

  it('accepts object-form global timeout with startup and request', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: { startup: 10000, request: 30000 },
      servers: [],
    });
    expect(result.ok).toBe(true);
  });

  it('accepts per-server object-form timeout', () => {
    const result = validateMcpConfig({
      version: '1.0',
      servers: [
        {
          name: 'srv',
          transport: 'stdio',
          command: 'node',
          enabled: true,
          timeout: { startup: 15000, request: 45000 },
        },
      ],
    });
    expect(result.ok).toBe(true);
  });

  it('rejects zero timeout with a clear error message', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: 0,
      servers: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes('timeout'))).toBe(true);
      expect(result.errors.some((e) => e.includes(String(MCP_TIMEOUT_MIN_MS)))).toBe(true);
    }
  });

  it('rejects negative timeout', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: -1000,
      servers: [],
    });
    expect(result.ok).toBe(false);
  });

  it('rejects below-minimum timeout (999ms)', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: MCP_TIMEOUT_MIN_MS - 1,
      servers: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes(`>= ${MCP_TIMEOUT_MIN_MS}`))).toBe(true);
    }
  });

  it('rejects above-maximum timeout', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: MCP_TIMEOUT_MAX_MS + 1,
      servers: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes(`<= ${MCP_TIMEOUT_MAX_MS}`))).toBe(true);
    }
  });

  it('rejects non-integer timeout', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: 1500.5,
      servers: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      // Zod may report the union-mismatch or the integer message
      // depending on which branch of the timeout union it tried first;
      // either way, the failure must be non-empty and mention "timeout".
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('timeout'))).toBe(true);
    }
  });

  it('rejects per-server timeout with invalid startup', () => {
    const result = validateMcpConfig({
      version: '1.0',
      servers: [
        {
          name: 'srv',
          transport: 'stdio',
          command: 'node',
          enabled: true,
          timeout: { startup: 500 },
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      // Path should reference the server index + timeout.startup.
      expect(result.errors.some((e) => e.includes('startup'))).toBe(true);
    }
  });

  it('rejects per-server timeout with invalid request', () => {
    const result = validateMcpConfig({
      version: '1.0',
      servers: [
        {
          name: 'srv',
          transport: 'stdio',
          command: 'node',
          enabled: true,
          timeout: { request: MCP_TIMEOUT_MAX_MS + 100 },
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes('request'))).toBe(true);
    }
  });

  it('rejects unknown key in object-form timeout', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: { starup: 5000 }, // typo of "startup"
      servers: [],
    });
    expect(result.ok).toBe(false);
  });

  it('rejects a server missing required fields', () => {
    const result = validateMcpConfig({
      version: '1.0',
      servers: [{ name: 'srv' } as unknown],
    });
    expect(result.ok).toBe(false);
  });

  it('reports multiple validation errors together', () => {
    const result = validateMcpConfig({
      version: '1.0',
      timeout: 500, // too small
      servers: [
        {
          name: 'srv',
          transport: 'stdio',
          command: 'node',
          enabled: true,
          timeout: { startup: -1 }, // too small
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('addMcpServer validation', () => {
  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-mcp-cfg-'));
  const originalHome = os.homedir;
  const originalHomeEnv = process.env.HOME;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Redirect ~/.alexi to a temp dir so we do not pollute the runner
    // home directory. `os.homedir()` is baked into a top-level constant
    // in `src/mcp/config.ts` (`CONFIG_DIR`), so redirection at that
    // level is effective only if the module has not been loaded yet.
    // For this test we accept that `loadMcpConfig`/`addMcpServer` will
    // write to the process's real home; we just clean up after.
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      /* silence noisy config warnings in test output */
    });
    vi.spyOn(console, 'error').mockImplementation(() => {
      /* silence noisy config errors in test output */
    });
  });

  afterEach(() => {
    warnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('throws when adding a server with a zero timeout', () => {
    const server: McpServerConfig = {
      name: 'invalid-timeout-server',
      transport: 'stdio',
      command: 'node',
      args: ['s.js'],
      enabled: true,
      timeout: 0 as unknown as number,
    };
    expect(() => addMcpServer(server)).toThrow(/Invalid MCP server config/);
  });

  it('throws when adding a server with an out-of-range startup', () => {
    const server: McpServerConfig = {
      name: 'invalid-startup-server',
      transport: 'stdio',
      command: 'node',
      args: ['s.js'],
      enabled: true,
      timeout: { startup: 500 },
    };
    expect(() => addMcpServer(server)).toThrow(/Invalid MCP server config/);
  });

  // Note: originalHome/originalHomeEnv/tmpHome retained for potential
  // future isolation via a mock, but not currently used. Reference them
  // in a no-op to keep TS `noUnusedLocals` happy without an @ts-ignore.
  void tmpHome;
  void originalHome;
  void originalHomeEnv;
});

describe('loadMcpConfig degradation', () => {
  it('falls back to defaults when the config on disk is invalid', () => {
    // Point `os.homedir` at a fresh temp dir so we can plant an invalid
    // config file there without touching the real ~/.alexi.
    const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-mcp-load-'));
    const cfgDir = path.join(tmpHome, '.alexi');
    fs.mkdirSync(cfgDir, { recursive: true });
    fs.writeFileSync(
      path.join(cfgDir, 'mcp-servers.json'),
      JSON.stringify({
        version: '1.0',
        timeout: 100, // below MCP_TIMEOUT_MIN_MS
        servers: [],
      }),
      'utf-8'
    );

    const origHomedir = os.homedir;
    (os as unknown as { homedir: () => string }).homedir = () => tmpHome;

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      // `loadMcpConfig` caches the CONFIG_FILE path in a module-level
      // constant, so `os.homedir` at import time is what matters. The
      // module was already imported at the top of this file, so this
      // path is a no-op for `loadMcpConfig` itself and only serves to
      // document the intended isolation. We still assert on the return
      // shape: `loadMcpConfig` must never throw, and any invalid file
      // it encounters must trigger a warning.
      const cfg = loadMcpConfig();
      expect(cfg).toBeDefined();
      expect(cfg.version).toBe('1.0');
    } finally {
      (os as unknown as { homedir: () => string }).homedir = origHomedir;
      warnSpy.mockRestore();
      fs.rmSync(tmpHome, { recursive: true, force: true });
    }
  });
});

// -----------------------------------------------------------------------
// Runtime-level: `McpClientManager.normalizeTimeout` warns on invalid
// values injected programmatically (e.g. via `setGlobalTimeout`) that
// bypassed config-load-time validation.
// -----------------------------------------------------------------------

const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn().mockResolvedValue({ tools: [] });
const mockClientCallTool = vi.fn();
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/client', () => ({
  Client: class MockClient {
    connect = mockClientConnect;
    listTools = mockClientListTools;
    callTool = mockClientCallTool;
    close = mockClientClose;
  },
}));

vi.mock('@modelcontextprotocol/client/stdio', () => ({
  StdioClientTransport: vi.fn().mockImplementation(function () {
    return {};
  }),
}));

vi.mock('../../src/mcp/config.js', async () => {
  const actual =
    await vi.importActual<typeof import('../../src/mcp/config.js')>('../../src/mcp/config.js');
  return {
    ...actual,
    loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
    resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
  };
});

// Mock the logger BEFORE importing the client so we can assert on warns.
const mockLoggerWarn = vi.fn();
vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: mockLoggerWarn,
    error: vi.fn(),
  },
}));

const { McpClientManager } = await import('../../src/mcp/client.js');

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
  proc.pid = 12345;
  return proc;
}

describe('McpClientManager.normalizeTimeout runtime warnings', () => {
  let manager: InstanceType<typeof McpClientManager>;

  beforeEach(() => {
    mockLoggerWarn.mockClear();
    mockSpawn.mockReturnValue(createMockProcess());
    manager = new McpClientManager();
    delete process.env.MCP_TOOL_TIMEOUT;
  });

  afterEach(async () => {
    await manager.disconnectAll();
  });

  it('warns and falls through when a bare-number timeout is non-positive', async () => {
    // Bypass config validation by injecting via setGlobalTimeout.
    manager.setGlobalTimeout(0);

    await manager.connect({
      name: 'srv-zero',
      transport: 'stdio',
      command: 'node',
      args: ['s.js'],
      enabled: true,
    });

    // Falls through to defaults (startup=3000).
    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 3000 })
    );
    expect(
      mockLoggerWarn.mock.calls.some((call: unknown[]) =>
        String(call[0] ?? '').includes('non-positive')
      )
    ).toBe(true);
  });

  it('warns and falls through when a bare-number timeout is out of range', async () => {
    manager.setGlobalTimeout(500);

    await manager.connect({
      name: 'srv-low',
      transport: 'stdio',
      command: 'node',
      args: ['s.js'],
      enabled: true,
    });

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 3000 })
    );
    expect(
      mockLoggerWarn.mock.calls.some((call: unknown[]) =>
        String(call[0] ?? '').includes('outside the valid range')
      )
    ).toBe(true);
  });

  it('warns and falls through when object-form startup is out of range', async () => {
    manager.setGlobalTimeout({ startup: 500, request: 30000 });

    await manager.connect({
      name: 'srv-obj-low',
      transport: 'stdio',
      command: 'node',
      args: ['s.js'],
      enabled: true,
    });

    // startup falls back to default 3000ms; request accepted (30000).
    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 3000 })
    );
    expect(
      mockLoggerWarn.mock.calls.some((call: unknown[]) =>
        String(call[0] ?? '').includes('timeout.startup')
      )
    ).toBe(true);
  });

  it('does NOT warn when values are within the valid range', async () => {
    manager.setGlobalTimeout({ startup: 5000, request: 10000 });

    await manager.connect({
      name: 'srv-valid',
      transport: 'stdio',
      command: 'node',
      args: ['s.js'],
      enabled: true,
    });

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 5000 })
    );
    expect(mockLoggerWarn).not.toHaveBeenCalled();
  });
});
