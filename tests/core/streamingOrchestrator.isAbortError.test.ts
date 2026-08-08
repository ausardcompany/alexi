/**
 * Tests for the `isAbortError` helper exported by the streaming orchestrator.
 *
 * Regression coverage for issue #1312: abort-family errors reach the CLI's
 * streaming catch block in three shapes and all three must be recognised so
 * the REPL logs a "Request cancelled" and returns to the prompt instead of
 * bubbling up as a generic error and (worst case) crashing the process.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

import { isAbortError } from '../../src/core/streamingOrchestrator.js';

describe('isAbortError', () => {
  it('detects a DOMException with name === "AbortError"', () => {
    // The standard `AbortController`/`AbortSignal` rejection shape.
    const err =
      typeof DOMException !== 'undefined'
        ? new DOMException('signal aborted', 'AbortError')
        : Object.assign(new Error('signal aborted'), { name: 'AbortError' });
    expect(isAbortError(err)).toBe(true);
  });

  it('detects a plain Error with name === "AbortError"', () => {
    // Older provider SDKs and hand-rolled aborts often throw a plain Error
    // whose `name` was flipped to `'AbortError'`.
    const err = new Error('aborted');
    err.name = 'AbortError';
    expect(isAbortError(err)).toBe(true);
  });

  it('detects a Node native abort error with code === "ABORT_ERR"', () => {
    // What `AbortSignal.throwIfAborted()`, undici, and some fs/timer APIs
    // emit. Note the `name` is NOT `'AbortError'` in this shape.
    const err = Object.assign(new Error('The operation was aborted'), {
      code: 'ABORT_ERR',
    });
    expect(err.name).not.toBe('AbortError');
    expect(isAbortError(err)).toBe(true);
  });

  it('detects a plain object carrying code === "ABORT_ERR"', () => {
    // Guard the object-shape path — some transports reject with plain objects
    // rather than proper Error instances.
    const err = { code: 'ABORT_ERR', message: 'aborted' };
    expect(isAbortError(err)).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isAbortError(new Error('boom'))).toBe(false);
    expect(isAbortError(new TypeError('nope'))).toBe(false);
    expect(isAbortError(Object.assign(new Error('http'), { code: 'ECONNRESET' }))).toBe(false);
  });

  it('returns false for null, undefined, and primitives', () => {
    expect(isAbortError(null)).toBe(false);
    expect(isAbortError(undefined)).toBe(false);
    expect(isAbortError('AbortError')).toBe(false);
    expect(isAbortError(42)).toBe(false);
    expect(isAbortError(false)).toBe(false);
  });
});
