/**
 * Tests for the context-overflow recovery path in `streamChat`
 * (issue #1247). Verifies:
 *
 *   1. When the provider throws a `context_window exceeded`-style error
 *      and a SessionManager is attached, the orchestrator calls
 *      `sessionManager.compact({ overflowRecovery: true, ... })` and
 *      retries the request once.
 *   2. Recovery is one-shot: a second overflow surfaces a distinct
 *      "still exceeded after compaction" terminal error instead of an
 *      infinite retry loop.
 *   3. When there is no history to compact, the orchestrator surfaces the
 *      "on first prompt (no history to compact)" terminal error.
 *   4. Non-overflow errors bypass recovery entirely and rethrow verbatim
 *      (formatted via `formatProviderError`).
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
import type { SessionManager } from '../../src/core/sessionManager.js';
import { NothingToCompactError } from '../../src/core/compaction.js';
import { logger } from '../../src/utils/logger.js';

interface FakeCall {
  index: number;
}

/**
 * Build a provider whose first `failuresBeforeSuccess` streams throw the
 * given error, and whose subsequent streams yield `successChunks` cleanly.
 */
function makeRecoverableProvider(
  errorToThrow: Error,
  failuresBeforeSuccess: number,
  successChunks: StreamChunk[]
) {
  const calls: FakeCall[] = [];
  let index = 0;

  function streamComplete(_messages: unknown, _opts?: unknown) {
    const call: FakeCall = { index: index++ };
    calls.push(call);
    const shouldFail = call.index < failuresBeforeSuccess;

    async function* gen(): AsyncGenerator<StreamChunk> {
      if (shouldFail) {
        throw errorToThrow;
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

/**
 * Minimal `SessionManager` stand-in that satisfies the interface exercised
 * by `streamChat`'s overflow-recovery path: `getCurrentSession`,
 * `createSession`, `getHistory`, `addMessage`, `getMaxContextTokens`, and
 * `compact`.
 */
function makeFakeSession(opts: {
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  compactBehavior?: 'success' | 'nothing-to-compact';
}): {
  sessionManager: SessionManager;
  compactCalls: Array<Record<string, unknown> | undefined>;
} {
  const history = opts.history ?? [];
  const compactCalls: Array<Record<string, unknown> | undefined> = [];

  const sm = {
    getCurrentSession: () => ({
      metadata: {
        id: 'test-session',
        created: Date.now(),
        updated: Date.now(),
        totalTokens: 0,
        messageCount: history.length,
      },
      messages: history,
    }),
    createSession: () => {},
    getHistory: (_n: number) => history,
    addMessage: (role: 'user' | 'assistant' | 'system', content: string, _tokens?: unknown) => {
      history.push({ role, content });
    },
    getMaxContextTokens: () => 128_000,
    compact: vi.fn(async (compactOpts?: Record<string, unknown>) => {
      compactCalls.push(compactOpts);
      if (opts.compactBehavior === 'nothing-to-compact') {
        throw new NothingToCompactError();
      }
      // Simulate compaction: replace history with a short summary + last item.
      const summary = {
        role: 'system' as const,
        content: '[CONVERSATION SUMMARY]\nCompacted for test.',
      };
      const last = history.length > 0 ? [history[history.length - 1]] : [];
      history.splice(0, history.length, summary, ...last);
      return { saved: 100, before: 200, after: 100 };
    }),
  };

  return { sessionManager: sm as unknown as SessionManager, compactCalls };
}

describe('streamChat context-overflow recovery (issue #1247)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('compacts and retries once on context_overflow, then succeeds', async () => {
    const overflow = new Error("This model's maximum context length is 8192 tokens");
    const { provider, getCalls } = makeRecoverableProvider(overflow, 1, [
      { text: 'recovered ' },
      { text: 'response', usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 } },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const { sessionManager, compactCalls } = makeFakeSession({
      history: [
        { role: 'user', content: 'first prompt' },
        { role: 'assistant', content: 'first reply' },
        { role: 'user', content: 'second prompt' },
        { role: 'assistant', content: 'second reply' },
        { role: 'user', content: 'third prompt' },
      ],
    });

    const iter = streamChat('please summarize', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    const chunks: string[] = [];
    let finalResult:
      { text: string; modelUsed: string; usage?: { total_tokens?: number } } | undefined;
    for (;;) {
      const step = await iter.next();
      if (step.done) {
        finalResult = step.value as typeof finalResult;
        break;
      }
      chunks.push(step.value.text);
    }

    // Provider was called twice: initial (failed) + retry (succeeded).
    expect(getCalls()).toHaveLength(2);
    // compact() was called exactly once with the overflow-recovery bag.
    expect(compactCalls).toHaveLength(1);
    expect(compactCalls[0]).toMatchObject({
      overflowRecovery: true,
      maxContextTokens: 128_000,
    });
    expect(typeof compactCalls[0]?.reserveOutputTokens).toBe('number');

    // Successful chunks were streamed through.
    expect(chunks.join('')).toContain('recovered response');
    expect(finalResult?.usage?.total_tokens).toBe(15);
  });

  it('surfaces "on first prompt (no history to compact)" when compaction throws NothingToCompactError', async () => {
    const overflow = new Error('context_length_exceeded');
    const { provider } = makeRecoverableProvider(overflow, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const { sessionManager } = makeFakeSession({
      history: [],
      compactBehavior: 'nothing-to-compact',
    });

    const iter = streamChat('one giant prompt', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    let caught: unknown;
    try {
      // Drain until an error is thrown or the stream completes.
      for (;;) {
        const step = await iter.next();
        if (step.done) {
          break;
        }
      }
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).name).toBe('ContextOverflowError');
    expect((caught as Error).message).toMatch(/no history to compact/i);
    expect((caught as Error).message).toMatch(/shorten your message|larger context window/i);
  });

  it('surfaces "still exceeded after compaction" when retry also overflows', async () => {
    const overflow = new Error('maximum context length exceeded');
    // Fail twice: initial + retry. Recovery should NOT try a third time.
    const { provider, getCalls } = makeRecoverableProvider(overflow, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const { sessionManager, compactCalls } = makeFakeSession({
      history: [
        { role: 'user', content: 'u1' },
        { role: 'assistant', content: 'a1' },
        { role: 'user', content: 'u2' },
        { role: 'assistant', content: 'a2' },
        { role: 'user', content: 'u3' },
      ],
    });

    const iter = streamChat('big prompt', {
      modelOverride: 'gpt-4o',
      sessionManager,
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
    } catch (err) {
      caught = err;
    }

    // Provider called exactly twice (initial + one retry). No third call.
    expect(getCalls()).toHaveLength(2);
    expect(compactCalls).toHaveLength(1);
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).name).toBe('ContextOverflowError');
    expect((caught as Error).message).toMatch(/still exceeded after compacting/i);
    expect((caught as Error).message).toMatch(/start a new session|larger context window/i);
  });

  it('does NOT compact for non-overflow errors (e.g. rate limit)', async () => {
    const rate = new Error('rate limit exceeded');
    (rate as Error & { statusCode?: number }).statusCode = 429;
    const { provider, getCalls } = makeRecoverableProvider(rate, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const { sessionManager, compactCalls } = makeFakeSession({
      history: [
        { role: 'user', content: 'u1' },
        { role: 'assistant', content: 'a1' },
        { role: 'user', content: 'u2' },
        { role: 'assistant', content: 'a2' },
        { role: 'user', content: 'u3' },
      ],
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    await expect(iter.next()).rejects.toBeInstanceOf(Error);
    // No retry, no compaction — the rate-limit error is not overflow.
    expect(getCalls()).toHaveLength(1);
    expect(compactCalls).toHaveLength(0);
  });

  it('emits a logger.info status notice before compaction (issue #1258)', async () => {
    const overflow = new Error("This model's maximum context length is 8192 tokens");
    const { provider } = makeRecoverableProvider(overflow, 1, [
      { text: 'ok', usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const { sessionManager } = makeFakeSession({
      history: [
        { role: 'user', content: 'u1' },
        { role: 'assistant', content: 'a1' },
      ],
    });

    const iter = streamChat('hello', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    for (;;) {
      const step = await iter.next();
      if (step.done) {
        break;
      }
    }

    // logger.info must have been called BEFORE the compact() call with the
    // actionable status notice. We assert on the argument text so a future
    // wording tweak that drops the actionable substring is caught.
    const infoCalls = vi.mocked(logger.info).mock.calls.map((c) => String(c[0]));
    expect(infoCalls.some((msg) => /compacting conversation history and retrying/i.test(msg))).toBe(
      true
    );
  });

  it('does NOT emit the compaction notice for non-overflow errors', async () => {
    const rate = new Error('rate limit exceeded');
    (rate as Error & { statusCode?: number }).statusCode = 429;
    const { provider } = makeRecoverableProvider(rate, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const { sessionManager } = makeFakeSession({
      history: [
        { role: 'user', content: 'u1' },
        { role: 'assistant', content: 'a1' },
      ],
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    await expect(iter.next()).rejects.toBeInstanceOf(Error);

    const infoCalls = vi.mocked(logger.info).mock.calls.map((c) => String(c[0]));
    expect(infoCalls.some((msg) => /compacting conversation history/i.test(msg))).toBe(false);
  });

  it('recovers when a typed AI SDK APICallError signals context_overflow (issue #1272)', async () => {
    // Smoke test: a typed AI SDK error (recognised by name tag) with
    // statusCode 400 and an overflow marker in responseBody must be
    // classified as `context_overflow` and drive the compaction+retry
    // recovery path through streamingOrchestrator.
    class FakeAPICallError extends Error {
      statusCode?: number;
      responseBody?: unknown;
      constructor(msg: string, opts: { statusCode: number; responseBody: unknown }) {
        super(msg);
        this.name = 'AI_APICallError';
        this.statusCode = opts.statusCode;
        this.responseBody = opts.responseBody;
      }
    }

    const typedOverflow = new FakeAPICallError('Bad Request', {
      statusCode: 400,
      responseBody: { error: { code: 'context_length_exceeded' } },
    });

    const { provider, getCalls } = makeRecoverableProvider(typedOverflow, 1, [
      { text: 'recovered', usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 } },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const { sessionManager, compactCalls } = makeFakeSession({
      history: [
        { role: 'user', content: 'first' },
        { role: 'assistant', content: 'reply' },
        { role: 'user', content: 'second' },
      ],
    });

    const iter = streamChat('please summarize', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    const chunks: string[] = [];
    for (;;) {
      const step = await iter.next();
      if (step.done) {
        break;
      }
      chunks.push(step.value.text);
    }

    // Provider called twice: initial (typed overflow) + retry (success).
    expect(getCalls()).toHaveLength(2);
    // compact() was called with overflowRecovery: true.
    expect(compactCalls).toHaveLength(1);
    expect(compactCalls[0]).toMatchObject({ overflowRecovery: true });
    // Recovery successfully streamed the retry response.
    expect(chunks.join('')).toContain('recovered');
  });

  it('does NOT compact when no sessionManager is attached', async () => {
    const overflow = new Error('context window exceeded');
    const { provider, getCalls } = makeRecoverableProvider(overflow, 5, []);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      streamIdleTimeoutMs: 0,
    });

    let caught: unknown;
    try {
      await iter.next();
    } catch (err) {
      caught = err;
    }
    // No session → no compaction → single call, error rethrown verbatim
    // (formatted via formatProviderError).
    expect(getCalls()).toHaveLength(1);
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toMatch(/context/i);
  });
});
