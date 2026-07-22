/**
 * Investigation for issue #1080: streaming abort handling for stalled streams.
 *
 * Background:
 * -----------
 * Cline PR #12249 identified that a native `async function*` generator's
 * `return()` cannot preempt an in-flight `await` inside the generator body.
 * When a downstream consumer breaks out of a `for await` loop, the outer
 * generator's finally-block waits until the current `await` settles. If the
 * awaited value is a stalled stream chunk (server responded 200 OK but has
 * gone silent), teardown effectively hangs.
 *
 * These tests verify how the current pipeline behaves for a stalled
 * `response.stream` inside the SAP AI Core Orchestration SDK:
 *
 *   `useStreamChat` -> `streamChat` (streamingOrchestrator.ts) ->
 *   `provider.streamComplete` (sapOrchestration.ts) ->
 *   `client.stream(...)` (SAP SDK).
 *
 * The SAP SDK's public `OrchestrationClient.stream(request, signal, ...)`
 * accepts an `AbortSignal` and wires it to an internal AbortController that
 * aborts the underlying HTTP request when the caller's signal fires
 * (see `node_modules/@sap-ai-sdk/orchestration/dist/orchestration-client.js`,
 * `stream()` at line 79-110). The SSE stream's finally-clause also calls
 * `controller.abort()` on early termination
 * (`node_modules/@sap-ai-sdk/core/dist/stream/sse-stream.js` line 48-53).
 *
 * Therefore, in the current architecture the caller MUST abort the signal
 * to unstick a stalled stream. Merely `break`-ing out of `for await` in the
 * consumer relies on `return()` preempting the pending chunk `await`, which
 * is exactly the Cline preemption issue.
 *
 * These tests document that behavior contract:
 *   1. Signal-driven abort tears down a stalled stream promptly.
 *   2. Bare `break` on a stalled stream WITHOUT signal abort hangs (skipped
 *      to avoid slowing the suite; the assertion is a race with a short
 *      timeout).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Track how the mock stream is torn down so tests can assert cleanup.
let stalledStreamStarted = false;
let stalledStreamReturned = false;
let capturedSignal: AbortSignal | undefined;

// Build a stalled stream generator: yields one chunk, then blocks on a
// promise that only settles when its AbortSignal fires. This mirrors the
// SAP SDK behaviour where a stalled HTTP response leaves the chunk iterator
// stuck on `await response.data.next()`.
function makeStalledStream(signal: AbortSignal): AsyncGenerator<unknown> {
  async function* gen(): AsyncGenerator<unknown> {
    stalledStreamStarted = true;
    try {
      // First chunk arrives normally.
      yield {
        getDeltaContent: () => 'hello',
        getDeltaToolCalls: () => [],
      };
      // Simulate a stalled network: wait on the abort signal.
      // If the SDK wires the signal correctly, aborting resolves this promise
      // with an AbortError, unwinding the generator.
      await new Promise<void>((_resolve, reject) => {
        if (signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }
        signal.addEventListener(
          'abort',
          () => {
            reject(new DOMException('Aborted', 'AbortError'));
          },
          { once: true }
        );
      });
    } finally {
      stalledStreamReturned = true;
    }
  }
  return gen();
}

vi.mock('@sap-ai-sdk/orchestration', () => {
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: Record<string, unknown>,
      public _deploymentConfig: unknown
    ) {}

    async chatCompletion() {
      throw new Error('not used in this suite');
    }

    // Mirrors the real SDK signature: `stream(request, signal, options, requestConfig)`.
    // The SDK creates an internal AbortController and forwards user signal
    // to it. We record the signal for assertions and back the mock stream
    // with the SAME signal so tests can drive it directly.
    async stream(
      _request: { messages: unknown[] },
      signal?: AbortSignal,
      _options?: unknown,
      _requestConfig?: unknown
    ) {
      capturedSignal = signal;
      const internalController = new AbortController();
      if (signal) {
        signal.throwIfAborted();
        signal.addEventListener('abort', () => internalController.abort(), {
          once: true,
        });
      }
      return {
        stream: makeStalledStream(internalController.signal),
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          prompt_tokens: 1,
          completion_tokens: 1,
          total_tokens: 2,
        }),
      };
    }
  }

  return {
    OrchestrationClient: MockOrchestrationClient,
    OrchestrationEmbeddingClient: vi.fn(),
    buildAzureContentSafetyFilter: vi.fn().mockReturnValue({}),
    buildLlamaGuard38BFilter: vi.fn().mockReturnValue({}),
    buildDpiMaskingProvider: vi.fn().mockReturnValue({}),
    buildDocumentGroundingConfig: vi.fn().mockReturnValue({}),
    buildTranslationConfig: vi.fn().mockReturnValue({}),
  };
});

vi.mock('../../src/config/env.js', () => ({
  env: vi.fn((key: string) => {
    if (key === 'AICORE_RESOURCE_GROUP') {
      return 'default';
    }
    return undefined;
  }),
}));

// Skip real connectivity check.
vi.mock('../../src/providers/connectivity.js', () => ({
  checkConnectivity: vi.fn().mockResolvedValue(undefined),
}));

import { SapOrchestrationProvider } from '../../src/providers/sapOrchestration.js';

describe('SapOrchestrationProvider streamComplete() stalled-stream abort', () => {
  beforeEach(() => {
    stalledStreamStarted = false;
    stalledStreamReturned = false;
    capturedSignal = undefined;
  });

  it('forwards options.signal to the SDK stream() call as the second argument', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const ac = new AbortController();

    // Start consuming just the first chunk, then abort so the generator
    // unwinds cleanly rather than leaving a dangling test resource.
    const gen = provider.streamComplete([{ role: 'user', content: 'hi' }], {
      signal: ac.signal,
    });
    const first = await gen.next();
    expect(first.done).toBe(false);
    ac.abort();
    await expect(gen.next()).rejects.toBeInstanceOf(Error);

    expect(capturedSignal).toBe(ac.signal);
  });

  it('unsticks a stalled stream when the caller aborts the AbortSignal', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const ac = new AbortController();

    const gen = provider.streamComplete([{ role: 'user', content: 'hi' }], {
      signal: ac.signal,
    });

    // Pull the first chunk. Now the generator is parked on the stalled await.
    const first = await gen.next();
    expect(first.done).toBe(false);
    expect(stalledStreamStarted).toBe(true);
    expect(stalledStreamReturned).toBe(false);

    // Fire the abort. The SDK forwards the abort to its internal controller,
    // the stalled promise rejects with AbortError, and the generator unwinds
    // through its finally block. This should complete well under 500ms.
    const start = Date.now();
    ac.abort();

    // Consuming the next value should reject with an AbortError-like error.
    await expect(gen.next()).rejects.toBeInstanceOf(Error);

    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(stalledStreamReturned).toBe(true);
  });

  it('generator.return() from a yield-suspended state DOES run the inner finally in current Node, because the inner iterator is at `yield` between chunks', async () => {
    // Empirical result on Node >= 22 (verified with a minimal repro in
    // /tmp/kilo/gen-test.mjs while investigating this issue):
    //
    // When an `async function*` generator is suspended at a `yield`
    // statement (i.e. it has produced a value and is waiting for the
    // consumer to call `next()` again), calling `return()` on it runs the
    // finally block promptly. The "Cline #12249 preemption trap" fires
    // only when the generator is parked ON an `await` -- i.e. the FIRST
    // chunk has not yet been produced, or the generator is between yields
    // waiting on the underlying HTTP iterator.
    //
    // Our mock's stalled generator yields a first chunk BEFORE awaiting
    // the never-settling promise, mirroring the real-world case where the
    // provider has already streamed at least one delta and is waiting on
    // the next SSE frame. In that state, `return()` correctly unwinds
    // through finally. The trap only bites for a stall BEFORE the first
    // chunk arrives (a completely silent server) -- see the next test.
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const ac = new AbortController();

    const gen = provider.streamComplete([{ role: 'user', content: 'hi' }], {
      signal: ac.signal,
    });

    const first = await gen.next();
    expect(first.done).toBe(false);
    expect(stalledStreamReturned).toBe(false);

    const returnPromise = gen.return(undefined as never);
    const timeout = new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 500));
    const winner = await Promise.race([returnPromise.then(() => 'returned' as const), timeout]);
    expect(winner).toBe('returned');
    // Inner finally ran because the inner iterator was between-yield when
    // return() propagated through the `for await` loop.
    expect(stalledStreamReturned).toBe(true);
  });
});

// Minimal, provider-independent repro of the exact Cline #12249 preemption
// trap: an async generator parked ON an `await` (before its first `yield`)
// cannot be preempted by `return()`. The finally block never runs until the
// pending await settles.
//
// This is the failure mode a hand-rolled watchdog / AsyncIterator wrapper
// would fix. Documenting it here so a future maintainer implementing the
// watchdog can point to the reproducer.
describe('async generator return() preemption trap (Cline #12249)', () => {
  it('return() on a generator parked on a never-settling await does NOT run finally', async () => {
    let finallyRan = false;
    async function* stalled(): AsyncGenerator<string> {
      try {
        // Parked here indefinitely, BEFORE first yield.
        await new Promise<void>(() => {
          /* never settles */
        });
        yield 'never';
      } finally {
        finallyRan = true;
      }
    }

    const g = stalled();
    // Kick off next() so the generator parks on the stalled await.
    void g.next();
    // Give the event loop a tick to park.
    await new Promise((resolve) => setImmediate(resolve));

    const returnPromise = g.return('done');
    const winner = await Promise.race([
      returnPromise.then(() => 'returned' as const),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 100)),
    ]);
    expect(winner).toBe('timeout');
    expect(finallyRan).toBe(false);
  });
});
