/**
 * Tests for the streaming orchestrator watchdog and hand-rolled iterator
 * (issue #1115). Verifies that:
 *
 *  1. `streamChat` returns a hand-rolled iterator whose `return()` runs
 *     immediately and does NOT await an outstanding provider pull.
 *  2. A stalled provider stream is aborted by the idle-timeout watchdog
 *     within the configured window.
 *  3. Streamed tool-call deltas for long-running tools (bash, shell,
 *     background_process, agent_manager) extend the idle window so the
 *     model can wait for legitimate tool execution without being killed.
 *  4. External caller-provided AbortSignal is still honoured (cascades
 *     to the watchdog's controller).
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

import { streamChat } from '../../src/core/streamingOrchestrator.js';
import { getProviderForModelWithFallback, getDefaultModel } from '../../src/providers/index.js';
import type { StreamChunk } from '../../src/providers/index.js';

interface StreamCall {
  signal?: AbortSignal;
  aborted: boolean;
  returnCalled: boolean;
}

/**
 * Build a provider whose stream:
 *  - yields one initial chunk (so tests can distinguish "first chunk"
 *    from "waiting for next"), then
 *  - parks on a promise that only settles when the effective abort
 *    signal fires (mirroring a stalled SAP AI Core SSE stream).
 * Records teardown so tests can assert `return()` reached the source.
 */
function makeStalledProvider(): {
  provider: { streamComplete: ReturnType<typeof vi.fn> };
  latest(): StreamCall;
} {
  const calls: StreamCall[] = [];

  function streamComplete(_messages: unknown, opts?: { signal?: AbortSignal }) {
    const call: StreamCall = { signal: opts?.signal, aborted: false, returnCalled: false };
    calls.push(call);

    async function* gen(): AsyncGenerator<StreamChunk> {
      try {
        yield { text: 'hello' };
        await new Promise<void>((_resolve, reject) => {
          const sig = opts?.signal;
          if (sig?.aborted) {
            call.aborted = true;
            reject(new DOMException('Aborted', 'AbortError'));
            return;
          }
          sig?.addEventListener(
            'abort',
            () => {
              call.aborted = true;
              reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true }
          );
        });
        // Unreachable, but keeps the generator valid.
        yield { text: 'never' };
      } finally {
        call.returnCalled = true;
      }
    }

    return gen();
  }

  return {
    provider: { streamComplete: vi.fn(streamComplete) },
    latest: () => calls[calls.length - 1]!,
  };
}

/**
 * Build a provider that yields a fixed list of chunks (no stalling).
 */
function makeFiniteProvider(chunks: StreamChunk[]): {
  provider: { streamComplete: ReturnType<typeof vi.fn> };
} {
  function streamComplete(_messages: unknown, _opts?: unknown) {
    async function* gen(): AsyncGenerator<StreamChunk> {
      for (const c of chunks) {
        yield c;
      }
    }
    return gen();
  }
  return { provider: { streamComplete: vi.fn(streamComplete) } };
}

describe('streamChat hand-rolled iterator preemption (issue #1115)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('return() on a stalled stream resolves immediately without awaiting the outstanding pull', async () => {
    const { provider, latest } = makeStalledProvider();
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      // Disable idle timeout for this test — we want return() itself to
      // preempt, not the watchdog.
      streamIdleTimeoutMs: 0,
    });

    // Pull the first chunk; the provider generator will be suspended at
    // its post-yield state.
    const first = await iter.next();
    expect(first.done).toBe(false);
    expect((first.value as StreamChunk).text).toBe('hello');
    expect(latest().returnCalled).toBe(false);

    // Fire the second pull. The provider generator resumes and parks on
    // its stalled `await` — this is the Cline #12249 hot spot. The
    // outstanding `iter.next()` promise is now pending indefinitely.
    const outstanding = iter.next();

    // Preemptively return. This must resolve quickly even though the
    // provider is blocked on the stalled await. The Cline #12249
    // preemption trap for async-generator return() would have hung this
    // call because the source's return() has to unwind through the
    // pending await.
    const start = Date.now();
    const closed = await iter.return();
    const elapsed = Date.now() - start;

    expect(closed.done).toBe(true);
    expect(elapsed).toBeLessThan(200);

    // The outstanding pull rejects with an AbortError once the watchdog
    // fires its internal controller. This is deterministic and does not
    // require any wall-clock wait.
    await expect(outstanding).rejects.toBeInstanceOf(Error);

    // Give the event loop a few ticks so the fire-and-forget teardown
    // on the source generator's finally-block lands.
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setImmediate(r));
    }
    expect(latest().aborted).toBe(true);
    expect(latest().returnCalled).toBe(true);
  });

  it('aborts a stalled stream via idle-timeout watchdog within the configured window', async () => {
    const { provider, latest } = makeStalledProvider();
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      streamIdleTimeoutMs: 100, // tiny window for a fast test
    });

    const first = await iter.next();
    expect(first.done).toBe(false);
    expect((first.value as StreamChunk).text).toBe('hello');

    const start = Date.now();
    await expect(iter.next()).rejects.toBeInstanceOf(Error);
    const elapsed = Date.now() - start;

    // The idle timer should fire around 100ms. Allow a wide upper bound
    // for slow CI machines.
    expect(elapsed).toBeGreaterThanOrEqual(80);
    expect(elapsed).toBeLessThan(1500);
    expect(latest().aborted).toBe(true);
    expect(latest().returnCalled).toBe(true);
  });

  it('extends the idle window while a long-running tool call is being streamed', async () => {
    // Provider: emit a bash tool-call delta, then stall. With the default
    // idle window (very small in this test) the stream would be killed
    // fast — but the long-running-tool extension should keep it alive.
    const streamCalls: StreamCall[] = [];
    const provider = {
      streamComplete: vi.fn(function streamComplete(
        _messages: unknown,
        opts?: { signal?: AbortSignal }
      ) {
        const call: StreamCall = {
          signal: opts?.signal,
          aborted: false,
          returnCalled: false,
        };
        streamCalls.push(call);
        async function* gen(): AsyncGenerator<StreamChunk> {
          try {
            yield {
              text: '',
              toolCalls: [
                {
                  index: 0,
                  id: 'call_1',
                  type: 'function',
                  function: { name: 'bash', arguments: '{"cmd":"sleep 5"}' },
                },
              ],
            };
            await new Promise<void>((_resolve, reject) => {
              const sig = opts?.signal;
              if (sig?.aborted) {
                call.aborted = true;
                reject(new DOMException('Aborted', 'AbortError'));
                return;
              }
              sig?.addEventListener(
                'abort',
                () => {
                  call.aborted = true;
                  reject(new DOMException('Aborted', 'AbortError'));
                },
                { once: true }
              );
            });
            yield { text: 'never' };
          } finally {
            call.returnCalled = true;
          }
        }
        return gen();
      }),
    };

    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('run a bash command', {
      modelOverride: 'gpt-4o',
      streamIdleTimeoutMs: 100, // would fire in 100ms without extension
      streamToolExtensionMs: 5_000, // extended window
    });

    // First chunk carries the bash tool call.
    const first = await iter.next();
    expect(first.done).toBe(false);
    expect((first.value as StreamChunk).toolCalls?.[0]?.function?.name).toBe('bash');

    // Race a 400ms deadline against the second pull. Because bash is in
    // the long-running set, the idle window is now 5s and the second
    // pull should still be pending after 400ms (i.e. NOT aborted).
    const pull = iter.next();
    const raceResult = await Promise.race([
      pull.then(() => 'settled' as const).catch(() => 'settled'),
      new Promise<'pending'>((resolve) => setTimeout(() => resolve('pending'), 400)),
    ]);
    expect(raceResult).toBe('pending');

    // Tear down cleanly so vitest does not report leaked timers.
    await iter.return();
    await new Promise((r) => setImmediate(r));
    await expect(pull).rejects.toBeInstanceOf(Error);
    expect(streamCalls[streamCalls.length - 1]?.aborted).toBe(true);
  });

  it('forwards caller AbortSignal to the provider stream', async () => {
    const { provider, latest } = makeStalledProvider();
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const ac = new AbortController();
    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      signal: ac.signal,
      streamIdleTimeoutMs: 0,
    });

    const first = await iter.next();
    expect(first.done).toBe(false);

    const pull = iter.next();
    ac.abort();
    await expect(pull).rejects.toBeInstanceOf(Error);
    expect(latest().aborted).toBe(true);
  });

  it('completes naturally and returns a StreamingResult when the source ends', async () => {
    const { provider } = makeFiniteProvider([
      { text: 'a' },
      { text: 'b' },
      { text: '', usage: { prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 } },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', { modelOverride: 'gpt-4o' });
    const chunks: string[] = [];

    async function drain(): Promise<{ modelUsed: string; usage?: { total_tokens?: number } }> {
      for (;;) {
        const step = await iter.next();
        if (step.done) {
          return step.value as { modelUsed: string; usage?: { total_tokens?: number } };
        }
        chunks.push(step.value.text);
      }
    }

    const finalResult = await drain();
    expect(chunks.join('')).toBe('ab');
    expect(finalResult.modelUsed).toBe('gpt-4o');
    expect(finalResult.usage?.total_tokens).toBe(5);
  });

  it('is drivable via `for await` (Symbol.asyncIterator)', async () => {
    const { provider } = makeFiniteProvider([{ text: 'x' }, { text: 'y' }]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', { modelOverride: 'gpt-4o' });
    const chunks: string[] = [];
    for await (const c of iter) {
      chunks.push(c.text);
    }
    expect(chunks).toEqual(['x', 'y']);
  });
});
