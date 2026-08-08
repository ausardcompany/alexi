/**
 * Regression tests for issue #1312: `handleStreamingError` must classify
 * abort-family errors gracefully (log "Request cancelled", never crash the
 * REPL or call `process.exit()`).
 *
 * We drive the extracted helper directly rather than booting a full readline
 * REPL. That keeps the test deterministic and avoids the fragility of piping
 * fake input into `readline.createInterface`.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { handleStreamingError } from '../../src/cli/interactive.js';
import { StreamStalledError } from '../../src/core/streamWatchdog.js';

describe('handleStreamingError (interactive REPL abort handling)', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let logs: string[];
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logs = [];
    logSpy = vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.map((a) => String(a)).join(' '));
    });
    // `process.exit` is typed as `never`; the cast keeps vitest happy while
    // still recording every call.
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(((_code?: number) => {
      throw new Error('process.exit was called — REPL crashed');
    }) as (code?: number) => never);
  });

  afterEach(() => {
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('logs "Request cancelled" for a DOMException AbortError', () => {
    const err =
      typeof DOMException !== 'undefined'
        ? new DOMException('signal aborted', 'AbortError')
        : Object.assign(new Error('signal aborted'), { name: 'AbortError' });

    handleStreamingError(err);

    expect(exitSpy).not.toHaveBeenCalled();
    expect(logs.some((l) => l.includes('Request cancelled'))).toBe(true);
    // Must not surface the abort as a generic error.
    expect(logs.some((l) => l.includes('Error:'))).toBe(false);
  });

  it('logs "Request cancelled" for a plain Error with name === "AbortError"', () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';

    handleStreamingError(err);

    expect(exitSpy).not.toHaveBeenCalled();
    expect(logs.some((l) => l.includes('Request cancelled'))).toBe(true);
    expect(logs.some((l) => l.includes('Error:'))).toBe(false);
  });

  it('logs "Request cancelled" for a Node native abort (code === "ABORT_ERR")', () => {
    // AbortSignal.throwIfAborted() / undici / node core surface aborts this
    // way. Regression for the exact shape that used to slip past the old
    // `name === 'AbortError'`-only check.
    const err = Object.assign(new Error('The operation was aborted'), {
      code: 'ABORT_ERR',
    });
    expect(err.name).not.toBe('AbortError');

    handleStreamingError(err);

    expect(exitSpy).not.toHaveBeenCalled();
    expect(logs.some((l) => l.includes('Request cancelled'))).toBe(true);
    expect(logs.some((l) => l.includes('Error:'))).toBe(false);
  });

  it('surfaces a retry-oriented hint for a StreamStalledError', () => {
    const err = new StreamStalledError(30_000);

    handleStreamingError(err);

    expect(exitSpy).not.toHaveBeenCalled();
    // The stall message includes the retry/switch-models hint.
    expect(logs.some((l) => l.includes('retry the request or switch models'))).toBe(true);
    expect(logs.some((l) => l.includes('Request cancelled'))).toBe(false);
  });

  it('renders a generic error for unrelated failures', () => {
    const err = new Error('provider blew up');

    handleStreamingError(err);

    expect(exitSpy).not.toHaveBeenCalled();
    expect(logs.some((l) => l.includes('Error: provider blew up'))).toBe(true);
    expect(logs.some((l) => l.includes('Request cancelled'))).toBe(false);
  });

  it('stringifies non-Error throws without crashing', () => {
    handleStreamingError('boom');
    expect(exitSpy).not.toHaveBeenCalled();
    expect(logs.some((l) => l.includes('Error: boom'))).toBe(true);
  });
});
