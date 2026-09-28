/**
 * Tests for the provider fetch wrapper timeout — port of opencode's
 * `test/provider/header-timeout.test.ts` (commit 35fc7a7).
 *
 * The critical assertion: the timeout must fire for BOTH direct
 * provider URLs and gateway URLs (Cloudflare AI Gateway, SAP AI Core).
 * The upstream bug allowed gateway-routed requests to skip the wrapper
 * and hang forever.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildFetch, DEFAULT_PROVIDER_TIMEOUT_MS } from './provider.js';

describe('buildFetch — provider timeout', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('exposes a sane default timeout', () => {
    expect(DEFAULT_PROVIDER_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it('aborts gateway-routed (Cloudflare AI Gateway) requests when timeout elapses', async () => {
    // Simulate an endpoint that never resolves; the timeout must abort it.
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal!.reason ?? new Error('aborted'));
        });
      });
    }) as unknown as typeof globalThis.fetch;

    const fetchFn = buildFetch({
      baseURL: 'https://gateway.ai.cloudflare.com/v1/xxx',
      timeout: 50,
    });

    await expect(fetchFn('https://gateway.ai.cloudflare.com/v1/xxx/slow', {})).rejects.toThrow(
      /timeout/i
    );
  });

  it('aborts SAP AI Core-routed requests when timeout elapses', async () => {
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal!.reason ?? new Error('aborted'));
        });
      });
    }) as unknown as typeof globalThis.fetch;

    const fetchFn = buildFetch({
      baseURL: 'https://api.ai.sap.example/v2/',
      timeout: 50,
    });

    await expect(fetchFn('https://api.ai.sap.example/v2/slow', {})).rejects.toThrow(/timeout/i);
  });

  it('aborts direct provider URLs when timeout elapses', async () => {
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal!.reason ?? new Error('aborted'));
        });
      });
    }) as unknown as typeof globalThis.fetch;

    const fetchFn = buildFetch({ baseURL: 'https://api.anthropic.com', timeout: 50 });
    await expect(fetchFn('https://api.anthropic.com/v1/messages', {})).rejects.toThrow(/timeout/i);
  });

  it('passes through when the request completes before the timeout', async () => {
    globalThis.fetch = vi.fn(async () => new Response('ok', { status: 200 })) as unknown as typeof globalThis.fetch;

    const fetchFn = buildFetch({ timeout: 1_000 });
    const res = await fetchFn('https://example.test/', {});
    expect(res.status).toBe(200);
  });

  it('honours a caller-supplied AbortSignal alongside the timeout', async () => {
    // The caller's own abort signal must still win when it fires before
    // the timeout. This validates the AbortSignal composition path.
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal!.reason ?? new Error('aborted'));
        });
      });
    }) as unknown as typeof globalThis.fetch;

    const fetchFn = buildFetch({ timeout: 5_000 });
    const controller = new AbortController();
    const promise = fetchFn('https://example.test/', { signal: controller.signal });
    controller.abort(new Error('user cancelled'));
    await expect(promise).rejects.toThrow(/cancelled|abort/i);
  });

  it('disables the timeout when timeout <= 0', async () => {
    // A resolved response comes back even though we set timeout=0.
    globalThis.fetch = vi.fn(async () => new Response('ok', { status: 200 })) as unknown as typeof globalThis.fetch;

    const fetchFn = buildFetch({ timeout: 0 });
    const res = await fetchFn('https://example.test/', {});
    expect(res.status).toBe(200);
  });
});
