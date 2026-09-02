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

  // Auth-classified errors (HTTP 401/403) should be rewritten into
  // actionable guidance rather than surfacing the raw provider JSON.
  // Mirrors Cline PR #13549. See `sanitizeApiKey` + `classifyProviderError`.
  describe('auth error rewriting (issue #1625)', () => {
    it('rewrites a 401 into actionable guidance and keeps raw response as diagnostic tail', () => {
      const err = Object.assign(new Error('{"detail":"Invalid API Key"}'), {
        status: 401,
      });

      handleStreamingError(err);

      expect(exitSpy).not.toHaveBeenCalled();
      // Actionable guidance is emitted...
      expect(logs.some((l) => l.includes('Authentication failed'))).toBe(true);
      expect(logs.some((l) => l.includes('API key'))).toBe(true);
      // ...and the raw provider message survives as a tail so operators
      // can still debug.
      expect(logs.some((l) => l.includes('Invalid API Key'))).toBe(true);
      // Must NOT render the generic "Error: ..." fallback for auth errors.
      expect(logs.some((l) => /^\s*Error: /.test(l))).toBe(false);
    });

    it('rewrites a 403 the same way as a 401', () => {
      const err = Object.assign(new Error('Forbidden'), { statusCode: 403 });

      handleStreamingError(err);

      expect(logs.some((l) => l.includes('Authentication failed'))).toBe(true);
      expect(logs.some((l) => l.includes('Forbidden'))).toBe(true);
    });

    it('leaves non-auth errors untouched (e.g. 500 generic failure)', () => {
      const err = Object.assign(new Error('internal server error'), { status: 500 });

      handleStreamingError(err);

      expect(logs.some((l) => l.includes('Authentication failed'))).toBe(false);
      expect(logs.some((l) => l.includes('Error: internal server error'))).toBe(true);
    });

    it('does not treat a generic Error mentioning "unauthorized" in prose as auth', () => {
      // The classifier is status-based for auth, so a message that
      // merely quotes the word without an HTTP status must not
      // trigger the auth rewrite.
      const err = new Error('The operation is not unauthorized to run tools');

      handleStreamingError(err);

      expect(logs.some((l) => l.includes('Authentication failed'))).toBe(false);
      expect(logs.some((l) => l.includes('Error:'))).toBe(true);
    });
  });
});
