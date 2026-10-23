/**
 * Unit tests for the structured MCP startup logger.
 *
 * These tests mock `../../src/utils/logger.js` so we can assert on the
 * exact log level and format the startup logger uses. The format is
 * considered part of the contract: operator tooling (grep, dashboards,
 * future `alexi logs mcp` subcommand) depends on the stable
 * `MCP startup [<server>] phase=... attempt=... ...` shape.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  formatError: (err: unknown) => (err instanceof Error ? err.message : String(err)),
}));

import { logger } from '../../src/utils/logger.js';
import {
  logPhaseEnd,
  logPhaseStart,
  logRetryScheduled,
  logStartupError,
  type StartupPhase,
} from '../../src/mcp/startup-logger.js';

describe('mcp/startup-logger', () => {
  const base: StartupPhase = {
    server: 'test-server',
    phase: 'spawn',
    attempt: 1,
    startedAt: 1_000_000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logPhaseStart emits an info line with server, phase and attempt on first attempt', () => {
    logPhaseStart(base);

    expect(logger.info).toHaveBeenCalledTimes(1);
    const line = (logger.info as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0];
    expect(line).toBe('MCP startup [test-server] phase=spawn attempt=1 started');
    expect(logger.debug).not.toHaveBeenCalled();
  });

  it('logPhaseEnd includes the duration in milliseconds', () => {
    logPhaseEnd({ ...base, phase: 'initialize' }, 234);

    expect(logger.info).toHaveBeenCalledTimes(1);
    const line = (logger.info as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0];
    expect(line).toBe('MCP startup [test-server] phase=initialize attempt=1 completed in 234ms');
  });

  it('phase start/end on a retry attempt downgrade to debug level', () => {
    const retry: StartupPhase = { ...base, phase: 'capabilities', attempt: 3 };

    logPhaseStart(retry);
    logPhaseEnd(retry, 42);

    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledTimes(2);
    const [start, end] = (logger.debug as unknown as { mock: { calls: unknown[][] } }).mock.calls;
    expect(start[0]).toBe('MCP startup [test-server] phase=capabilities attempt=3 started');
    expect(end[0]).toBe('MCP startup [test-server] phase=capabilities attempt=3 completed in 42ms');
  });

  it('logStartupError appends the server stderr buffer when provided', () => {
    const err = new Error('spawn ENOENT');
    const stderr = 'Error: Cannot find module "foo"\n    at Module._resolveFilename';

    logStartupError('test-server', 'spawn', err, stderr);

    expect(logger.error).toHaveBeenCalledTimes(1);
    const line = (logger.error as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0];
    expect(line).toContain('MCP startup [test-server] phase=spawn failed: spawn ENOENT');
    expect(line).toContain('stderr: Error: Cannot find module "foo"');
  });

  it('logStartupError omits the stderr line when the buffer is empty or whitespace', () => {
    logStartupError('test-server', 'initialize', new Error('boom'), '   \n');

    expect(logger.error).toHaveBeenCalledTimes(1);
    const line = (logger.error as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0];
    expect(line).toBe('MCP startup [test-server] phase=initialize failed: boom');
    expect(line).not.toContain('stderr:');
  });

  it('logStartupError truncates very large stderr tails to keep log lines bounded', () => {
    const huge = 'x'.repeat(5000);
    logStartupError('test-server', 'spawn', new Error('boom'), huge);

    const line = (logger.error as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0][0] as string;
    // The default tail cap is 2000 chars + a truncation marker; the
    // full 5000-char buffer must not land in the log.
    expect(line.length).toBeLessThan(huge.length);
    expect(line).toContain('truncated');
  });

  it('logRetryScheduled reports the next attempt number and delay at warn level', () => {
    logRetryScheduled('test-server', 2, 2000);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    const line = (logger.warn as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0];
    expect(line).toBe('MCP startup [test-server] retrying in 2000ms (attempt 2)');
  });

  it('non-Error values thrown through logStartupError are stringified safely', () => {
    logStartupError('test-server', 'capabilities', 'raw string failure');

    expect(logger.error).toHaveBeenCalledTimes(1);
    const line = (logger.error as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0];
    expect(line).toBe('MCP startup [test-server] phase=capabilities failed: raw string failure');
  });
});
