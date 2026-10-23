/**
 * Unit tests for `classifyMcpError`.
 *
 * Verifies that each supported error signal (Node syscall code, HTTP
 * status, named error class, message substring) maps to the stable
 * category + an actionable hint pointing at the right config field.
 * The classifier is pure, so these tests do not touch the client
 * manager or SDK — they construct errors directly and assert the
 * returned pair.
 */
import { describe, it, expect } from 'vitest';
import { classifyMcpError } from '../../src/mcp/error-classifier.js';
import type { McpServerConfig } from '../../src/mcp/config.js';

/**
 * Build a minimal stdio `McpServerConfig` for a test case. Only the
 * fields the classifier reads are set — the rest default to shape-only
 * values that keep Zod happy if we ever add round-trip validation to
 * the test.
 */
function stdioConfig(overrides: Partial<McpServerConfig> = {}): McpServerConfig {
  return {
    name: 'test-server',
    transport: 'stdio',
    command: 'my-mcp-server',
    args: [],
    enabled: true,
    ...overrides,
  };
}

/**
 * Build a minimal remote (`http`) `McpServerConfig` so classifier
 * branches that mention a URL / port can be exercised.
 */
function remoteConfig(overrides: Partial<McpServerConfig> = {}): McpServerConfig {
  return {
    name: 'remote-server',
    transport: 'http',
    url: 'https://mcp.example.com:9443/sse',
    enabled: true,
    ...overrides,
  };
}

/**
 * Attach a `code` field to a `new Error(...)` the way Node's
 * `child_process.spawn` and `net` modules do. Returned as `unknown`
 * so test assertions do not fight the function signature.
 */
function errorWithCode(message: string, code: string): unknown {
  const err = new Error(message) as Error & { code: string };
  err.code = code;
  return err;
}

describe('classifyMcpError', () => {
  it('classifies ENOENT as missing-command and names the command in the hint', () => {
    const result = classifyMcpError(
      errorWithCode('spawn my-mcp-server ENOENT', 'ENOENT'),
      stdioConfig()
    );
    expect(result.category).toBe('missing-command');
    expect(result.hint).toContain("'my-mcp-server'");
    expect(result.hint).toMatch(/installed and in PATH|'command' field/);
  });

  it('classifies EACCES as permission-denied and mentions chmod +x', () => {
    const result = classifyMcpError(errorWithCode('EACCES', 'EACCES'), stdioConfig());
    expect(result.category).toBe('permission-denied');
    expect(result.hint).toContain('chmod +x');
    expect(result.hint).toContain("'my-mcp-server'");
  });

  it('classifies EPERM the same as EACCES (permission-denied)', () => {
    const result = classifyMcpError(errorWithCode('EPERM', 'EPERM'), stdioConfig());
    expect(result.category).toBe('permission-denied');
  });

  it('classifies ENOTDIR as not-a-directory and points at cwd', () => {
    const result = classifyMcpError(errorWithCode('ENOTDIR', 'ENOTDIR'), stdioConfig());
    expect(result.category).toBe('not-a-directory');
    expect(result.hint).toContain("'cwd'");
  });

  it('classifies ETIMEDOUT as timeout and names connectTimeout/timeout.startup', () => {
    const result = classifyMcpError(errorWithCode('ETIMEDOUT', 'ETIMEDOUT'), remoteConfig());
    expect(result.category).toBe('timeout');
    expect(result.hint).toMatch(/connectTimeout|timeout\.startup/);
  });

  it('classifies ECONNREFUSED and names the port in the hint when the URL has one', () => {
    const result = classifyMcpError(errorWithCode('ECONNREFUSED', 'ECONNREFUSED'), remoteConfig());
    expect(result.category).toBe('connection-refused');
    expect(result.hint).toContain('9443');
    expect(result.hint).toContain('mcp.example.com');
  });

  it('classifies ECONNRESET and EPIPE as connection-reset', () => {
    for (const code of ['ECONNRESET', 'EPIPE']) {
      const result = classifyMcpError(errorWithCode('reset', code), remoteConfig());
      expect(result.category).toBe('connection-reset');
      expect(result.hint).toContain('mcp.example.com');
    }
  });

  it('classifies EAGAIN/EBUSY as transient-network', () => {
    for (const code of ['EAGAIN', 'EBUSY']) {
      const result = classifyMcpError(errorWithCode('busy', code), stdioConfig());
      expect(result.category).toBe('transient-network');
      expect(result.hint).toContain(code);
    }
  });

  it('classifies HTTP 401 responses as auth-failed and points at apiKey', () => {
    const result = classifyMcpError(
      Object.assign(new Error('unauthorized'), { status: 401 }),
      remoteConfig()
    );
    expect(result.category).toBe('auth-failed');
    expect(result.hint).toContain("'apiKey'");
    expect(result.hint).toContain('401');
  });

  it('classifies HTTP 403 responses as auth-failed', () => {
    const result = classifyMcpError(
      Object.assign(new Error('forbidden'), { statusCode: 403 }),
      remoteConfig()
    );
    expect(result.category).toBe('auth-failed');
    expect(result.hint).toContain('403');
  });

  it('classifies McpConnectAuthError (by name) as auth-failed even without a status field', () => {
    const err = new Error('remote transport returned HTTP 401');
    (err as Error & { name: string }).name = 'McpConnectAuthError';
    const result = classifyMcpError(err, remoteConfig());
    expect(result.category).toBe('auth-failed');
    expect(result.hint).toContain("'apiKey'");
  });

  it('classifies McpConnectTimeoutError (by name) as timeout', () => {
    const err = new Error('remote transport connect timeout');
    (err as Error & { name: string }).name = 'McpConnectTimeoutError';
    const result = classifyMcpError(err, remoteConfig());
    expect(result.category).toBe('timeout');
    expect(result.hint).toContain('connectTimeout');
  });

  it('classifies startup-timeout messages as timeout and points at timeout.startup', () => {
    const err = new Error(
      "MCP initialize timed out after 3000ms (startup timeout for server 'test-server'); increase 'timeout.startup' in mcp-servers.json to raise this bound."
    );
    const result = classifyMcpError(err, stdioConfig());
    expect(result.category).toBe('timeout');
    expect(result.hint).toContain("'timeout.startup'");
  });

  it('classifies missing env var messages as missing-env-var', () => {
    const err = new Error(
      "MCP server 'test-server' is missing environment variable(s): MY_TOKEN. Set them in the process environment or in the 'env' block of mcp-servers.json."
    );
    const result = classifyMcpError(err, stdioConfig());
    expect(result.category).toBe('missing-env-var');
    expect(result.hint).toContain("'env'");
  });

  it('classifies fetch failures as transient-network', () => {
    const result = classifyMcpError(new Error('fetch failed'), remoteConfig());
    expect(result.category).toBe('transient-network');
    expect(result.hint).toContain('mcp.example.com');
  });

  it('classifies HTTP 401 encoded in the message (no status field) as auth-failed', () => {
    const err = new Error('upstream returned HTTP 401');
    const result = classifyMcpError(err, remoteConfig());
    expect(result.category).toBe('auth-failed');
  });

  it('falls back to unknown for an unrecognised error', () => {
    const result = classifyMcpError(new Error('what even is this'), stdioConfig());
    expect(result.category).toBe('unknown');
    expect(result.hint).toContain("'my-mcp-server'");
  });

  it('falls back to the server name when no command or url is configured', () => {
    const result = classifyMcpError(
      new Error('something'),
      stdioConfig({ command: undefined, args: undefined })
    );
    expect(result.hint).toContain("'test-server'");
  });

  it('is defensive against non-object errors (string, undefined, null)', () => {
    expect(classifyMcpError('plain string', stdioConfig()).category).toBe('unknown');
    expect(classifyMcpError(undefined, stdioConfig()).category).toBe('unknown');
    expect(classifyMcpError(null, stdioConfig()).category).toBe('unknown');
  });

  it('ignores malformed URLs when extracting a port and still classifies ECONNREFUSED', () => {
    const result = classifyMcpError(
      errorWithCode('ECONNREFUSED', 'ECONNREFUSED'),
      remoteConfig({ url: 'not-a-valid-url' })
    );
    expect(result.category).toBe('connection-refused');
    // No numeric port is embedded when the URL is malformed, but the
    // target descriptor still surfaces so the operator has context.
    expect(result.hint).toContain('not-a-valid-url');
  });
});
