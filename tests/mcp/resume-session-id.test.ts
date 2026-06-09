/**
 * Integration test: ALEXI_SESSION_ID re-emission on session resume.
 *
 * Issue #739: pin the contract that resuming a session via SessionManager
 * and connecting to a stdio MCP server forwards the resumed session id
 * through McpConnectOptions.sessionId, which client.ts injects as
 * ALEXI_SESSION_ID into the spawned process env.
 *
 * The fallback at src/mcp/client.ts:177 (`options?.sessionId ?? ''`) means
 * a regression dropping the sessionId would silently surface as an empty
 * env var rather than a test failure. This test exercises the full
 * resume -> connect -> spawned env path end-to-end so the regression
 * cannot land unnoticed (see #733 for the upcoming loadSession changes
 * this guards).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mock child_process.spawn so we can capture the env without launching anything
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock the MCP SDK Client + transport surfaces
const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn().mockResolvedValue({ tools: [] });
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: class MockClient {
    connect = mockClientConnect;
    listTools = mockClientListTools;
    close = mockClientClose;
  },
}));

vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({
  StdioClientTransport: vi.fn().mockImplementation(() => ({})),
}));

// Mock loadMcpConfig (only resolveEnvVars is exercised at runtime)
vi.mock('../../src/mcp/config.js', () => ({
  loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
  resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
}));

import { McpClientManager } from '../../src/mcp/client.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SessionManager } from '../../src/core/sessionManager.js';
import type { McpServerConfig } from '../../src/mcp/config.js';

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

const stdioConfig: McpServerConfig = {
  name: 'resume-test-server',
  transport: 'stdio',
  command: 'node',
  args: ['server.js'],
  enabled: true,
};

describe('integration: resume session forwards id to MCP ALEXI_SESSION_ID', () => {
  let manager: McpClientManager;
  let tmpSessionsDir: string;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSpawn.mockReturnValue(createMockProcess());
    manager = new McpClientManager();
    tmpSessionsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-sessions-'));
  });

  afterEach(async () => {
    await manager.disconnectAll();
    if (fs.existsSync(tmpSessionsDir)) {
      fs.rmSync(tmpSessionsDir, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
  });

  it('forwards the resumed session id as ALEXI_SESSION_ID to the spawned MCP server', async () => {
    // 1. Create a persisted session via the same SessionManager surface used by
    //    `alexi sessions resume <id>` / `chat --session <id>` / interactive.
    const persistManager = new SessionManager({ sessionsDir: tmpSessionsDir });
    const created = persistManager.createSession('test-model');
    const persistedId = created.metadata.id;

    // 2. Simulate a fresh process resuming the session: new SessionManager
    //    pointed at the same on-disk directory, then loadSession(id).
    const resumeManager = new SessionManager({ sessionsDir: tmpSessionsDir });
    const resumed = resumeManager.loadSession(persistedId);
    expect(resumed).not.toBeNull();
    expect(resumed?.metadata.id).toBe(persistedId);

    // 3. Mirror src/cli/interactive.ts:1096 - read the active session id and
    //    pass it as the McpConnectOptions.sessionId to the manager.
    const sessionId = resumeManager.getCurrentSession()?.metadata.id;
    expect(sessionId).toBe(persistedId);

    await manager.connect(stdioConfig, { sessionId });

    // 4. Assert: the StdioClientTransport (which is what the MCP SDK actually
    //    spawns) received the resumed id verbatim - no '' fallback.
    expect(StdioClientTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        env: expect.objectContaining({
          ALEXI_SESSION_ID: persistedId,
        }),
      })
    );

    // 5. Belt and braces: the eager spawn() (used for stderr piping) also
    //    carries the id, so any tool that bypasses the SDK transport still
    //    sees the resumed session.
    expect(mockSpawn).toHaveBeenCalledWith(
      'node',
      ['server.js'],
      expect.objectContaining({
        env: expect.objectContaining({
          ALEXI_SESSION_ID: persistedId,
        }),
      })
    );
  });

  it('passes a stable, non-empty id (negative-control: empty fallback would NOT match)', async () => {
    // This test exists to make the regression that #739 worries about
    // visible. If `client.ts:177` were `ALEXI_SESSION_ID: ''` instead of
    // `options?.sessionId ?? ''`, this assertion would fail because '' !==
    // the persisted id.
    const persistManager = new SessionManager({ sessionsDir: tmpSessionsDir });
    const persistedId = persistManager.createSession().metadata.id;

    const resumeManager = new SessionManager({ sessionsDir: tmpSessionsDir });
    resumeManager.loadSession(persistedId);
    const sessionId = resumeManager.getCurrentSession()?.metadata.id;

    await manager.connect(stdioConfig, { sessionId });

    const transportCall = vi.mocked(StdioClientTransport).mock.calls[0]?.[0] as
      | { env?: Record<string, string> }
      | undefined;
    expect(transportCall?.env?.ALEXI_SESSION_ID).toBe(persistedId);
    expect(transportCall?.env?.ALEXI_SESSION_ID).not.toBe('');
    expect(transportCall?.env?.ALEXI_SESSION_ID).toMatch(/.+/);
  });
});
