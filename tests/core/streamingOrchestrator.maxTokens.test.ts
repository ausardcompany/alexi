/**
 * Integration tests for the `streamChat` max-tokens recovery path
 * (issue #1850). Verifies:
 *
 *   1. When the provider throws a `max_tokens_exceeded` / 413 error,
 *      the orchestrator retries once with a reduced `maxTokens`.
 *   2. In headless mode (no recovery prompt callback), the retry is
 *      automatic.
 *   3. When the TUI callback declines, no retry occurs and the error
 *      surfaces.
 *   4. Recovery is one-shot: a second max-tokens error is terminal.
 *   5. `logger.info` breadcrumb is emitted before the retry.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    setLevel: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    print: vi.fn(),
  },
}));

import { streamChat } from '../../src/core/streamingOrchestrator.js';
import { getProviderForModelWithFallback, getDefaultModel } from '../../src/providers/index.js';
import type { StreamChunk } from '../../src/providers/index.js';
import { logger } from '../../src/utils/logger.js';
import { setRecoveryPrompt } from '../../src/core/maxTokensRecovery.js';

interface Call {
  index: number;
  maxTokens?: number;
}

function makeMaxTokensProvider(
  error: unknown,
  failuresBeforeSuccess: number,
  successChunks: StreamChunk[]
) {
  const calls: Call[] = [];
  let index = 0;
  function streamComplete(_messages: unknown, opts?: { maxTokens?: number }) {
    const call: Call = { index: index++, maxTokens: opts?.maxTokens };
    calls.push(call);
    const shouldFail = call.index < failuresBeforeSuccess;
    async function* gen(): AsyncGenerator<StreamChunk> {
      if (shouldFail) {
        throw error;
      }
      for (const c of successChunks) {
        yield c;
      }
    }
    return gen();
  }
  return {
    provider: { streamComplete: vi.fn(streamComplete) },
    getCalls: () => calls,
  };
}

describe('streamChat max-tokens recovery (issue #1850)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
    setRecoveryPrompt(null);
  });

  afterEach(() => {
    setRecoveryPrompt(null);
    vi.resetAllMocks();
  });

  it('auto-retries with reduced maxTokens on max_tokens_exceeded (headless)', async () => {
    const err = new Error("This model's maximum context length is 8192 tokens");
    const { provider, getCalls } = makeMaxTokensProvider(err, 1, [
      { text: 'ok', usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 } },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4-legacy',
      usedFallback: false,
    });

    // Force a large starting maxTokens so the plan reduces it. Send a
    // moderately long message so the prompt eats into the window.
    const iter = streamChat('x'.repeat(20000), {
      modelOverride: 'gpt-4-legacy',
      maxTokens: 6000,
      streamIdleTimeoutMs: 0,
    });

    for (;;) {
      const step = await iter.next();
      if (step.done) {
        break;
      }
    }

    const calls = getCalls();
    expect(calls).toHaveLength(2);
    // First call used the original 6000.
    expect(calls[0].maxTokens).toBe(6000);
    // Retry used a strictly smaller value.
    expect(calls[1].maxTokens).toBeLessThan(6000);
    expect(calls[1].maxTokens).toBeGreaterThanOrEqual(100);

    // logger.info breadcrumb fires with the retry announcement.
    const infoCalls = vi.mocked(logger.info).mock.calls.map((c) => String(c[0]));
    expect(infoCalls.some((msg) => /max_tokens exceeded; retrying with maxTokens=/.test(msg))).toBe(
      true
    );
  });

  it('auto-retries on HTTP 413 (Request Entity Too Large) when error carries a context window', async () => {
    // 413 alone does not carry a token count; combine it with an
    // explicit "maximum context length" body marker so the plan has a
    // window to reduce against.
    const err = Object.assign(
      new Error('Request Entity Too Large: maximum context length is 8192 tokens'),
      {
        statusCode: 413,
      }
    );
    const { provider, getCalls } = makeMaxTokensProvider(err, 1, [
      { text: 'ok', usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 } },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4-legacy',
      usedFallback: false,
    });

    const iter = streamChat('x'.repeat(20000), {
      modelOverride: 'gpt-4-legacy',
      // Force a starting value larger than the tight 8K window so the
      // plan is guaranteed to reduce it.
      maxTokens: 6000,
      streamIdleTimeoutMs: 0,
    });

    for (;;) {
      const step = await iter.next();
      if (step.done) {
        break;
      }
    }

    const calls = getCalls();
    expect(calls).toHaveLength(2);
    expect(calls[1].maxTokens).toBeLessThan(6000);
  });

  it('honours a TUI callback that declines the retry', async () => {
    const err = new Error("This model's maximum context length is 8192 tokens");
    const { provider, getCalls } = makeMaxTokensProvider(err, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4-legacy',
      usedFallback: false,
    });

    setRecoveryPrompt(() => false);

    const iter = streamChat('x'.repeat(20000), {
      modelOverride: 'gpt-4-legacy',
      maxTokens: 6000,
      streamIdleTimeoutMs: 0,
    });

    let caught: unknown;
    try {
      for (;;) {
        const step = await iter.next();
        if (step.done) {
          break;
        }
      }
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(Error);
    // No retry; declined callback means single provider call.
    expect(getCalls()).toHaveLength(1);
  });

  it('is one-shot: a second max-tokens error is terminal', async () => {
    const err = new Error("This model's maximum context length is 8192 tokens");
    const { provider, getCalls } = makeMaxTokensProvider(err, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4-legacy',
      usedFallback: false,
    });

    const iter = streamChat('x'.repeat(20000), {
      modelOverride: 'gpt-4-legacy',
      maxTokens: 6000,
      streamIdleTimeoutMs: 0,
    });

    let caught: unknown;
    try {
      for (;;) {
        const step = await iter.next();
        if (step.done) {
          break;
        }
      }
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(Error);
    // First call + one retry = 2 total calls, no more.
    expect(getCalls()).toHaveLength(2);
  });

  it('does not retry non-max-tokens errors (e.g. auth)', async () => {
    const err = Object.assign(new Error('Unauthorized'), { statusCode: 401 });
    const { provider, getCalls } = makeMaxTokensProvider(err, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      streamIdleTimeoutMs: 0,
    });

    await expect(iter.next()).rejects.toBeInstanceOf(Error);
    expect(getCalls()).toHaveLength(1);
  });
});
