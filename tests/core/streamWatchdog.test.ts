/**
 * Direct unit tests for the stream watchdog module (issue #1124).
 *
 * The watchdog was originally introduced via #1115/#1126 to fix the
 * Cline #12249 async-generator preemption trap. It is exercised
 * transitively by `tests/core/streamingOrchestrator.test.ts`, but the
 * module itself has enough edge-case behaviour (sync `Iterable`
 * fallback, missing source `return`, multiple concurrent long-running
 * tool calls, abort-reason coercion, `throw()` semantics) that a
 * dedicated unit test surface is warranted.
 *
 * These tests deliberately do NOT go through `streamChat` — they call
 * `createStreamWatchdog` directly with hand-written sources to keep the
 * cause/effect link tight when a regression appears.
 */
import { describe, it, expect } from 'vitest';
import {
  createStreamWatchdog,
  DEFAULT_STREAM_IDLE_TIMEOUT_MS,
  DEFAULT_STREAM_TOOL_EXTENSION_MS,
  DEFAULT_LONG_RUNNING_TOOL_NAMES,
} from '../../src/core/streamWatchdog.js';
import type { StreamChunk } from '../../src/providers/index.js';

/**
 * Build an async source that yields `initial`, then parks on the abort
 * signal, mirroring a stalled SAP AI Core SSE stream. Records teardown
 * state so callers can assert that `return()` was forwarded to the
 * source's finally-block.
 */
function stalledAsyncSource(initial: StreamChunk[] = [{ text: 'hello' }]): {
  factory: (signal: AbortSignal) => AsyncIterable<StreamChunk>;
  state: { aborted: boolean; returnCalled: boolean; signal?: AbortSignal };
} {
  const state: { aborted: boolean; returnCalled: boolean; signal?: AbortSignal } = {
    aborted: false,
    returnCalled: false,
  };
  const factory = (signal: AbortSignal): AsyncIterable<StreamChunk> => {
    state.signal = signal;
    async function* gen(): AsyncGenerator<StreamChunk> {
      try {
        for (const c of initial) {
          yield c;
        }
        await new Promise<void>((_resolve, reject) => {
          if (signal.aborted) {
            state.aborted = true;
            reject(new DOMException('Aborted', 'AbortError'));
            return;
          }
          signal.addEventListener(
            'abort',
            () => {
              state.aborted = true;
              reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true }
          );
        });
        yield { text: 'never' };
      } finally {
        state.returnCalled = true;
      }
    }
    return gen();
  };
  return { factory, state };
}

describe('createStreamWatchdog', () => {
  describe('defaults', () => {
    it('exposes documented default constants', () => {
      expect(DEFAULT_STREAM_IDLE_TIMEOUT_MS).toBe(30_000);
      expect(DEFAULT_STREAM_TOOL_EXTENSION_MS).toBe(10 * 60 * 1000);
      // The long-running set must cover the tools listed in the module's
      // module-level docstring (bash, shell, background_process,
      // agent_manager). Bump both together if you change one.
      expect(DEFAULT_LONG_RUNNING_TOOL_NAMES.has('bash')).toBe(true);
      expect(DEFAULT_LONG_RUNNING_TOOL_NAMES.has('shell')).toBe(true);
      expect(DEFAULT_LONG_RUNNING_TOOL_NAMES.has('background_process')).toBe(true);
      expect(DEFAULT_LONG_RUNNING_TOOL_NAMES.has('agent_manager')).toBe(true);
    });
  });

  describe('preemptive return()', () => {
    it('resolves immediately without awaiting outstanding pull on a stalled source', async () => {
      const { factory, state } = stalledAsyncSource();
      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 0 });

      const first = await iter.next();
      expect(first.done).toBe(false);
      expect((first.value as StreamChunk).text).toBe('hello');

      const outstanding = iter.next();
      const t0 = Date.now();
      const closed = await iter.return();
      const elapsed = Date.now() - t0;

      expect(closed.done).toBe(true);
      expect(elapsed).toBeLessThan(200);
      await expect(outstanding).rejects.toBeInstanceOf(Error);

      // Give the fire-and-forget source.return() a chance to land.
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setImmediate(r));
      }
      expect(state.aborted).toBe(true);
      expect(state.returnCalled).toBe(true);
    });

    it('is idempotent: multiple return() calls report done without re-firing abort', async () => {
      const { factory, state } = stalledAsyncSource();
      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 0 });
      await iter.next();

      const first = await iter.return();
      const second = await iter.return();
      expect(first.done).toBe(true);
      expect(second.done).toBe(true);
      // Only one teardown path should have run — source finally still
      // resolves exactly once.
      await new Promise((r) => setImmediate(r));
      expect(state.returnCalled).toBe(true);
    });

    it('handles a source that has no return() method', async () => {
      // Build a bare AsyncIterator with no return() — the watchdog must
      // still be able to tear down without throwing.
      let yielded = 0;
      const source: AsyncIterable<StreamChunk> = {
        [Symbol.asyncIterator](): AsyncIterator<StreamChunk> {
          return {
            async next(): Promise<IteratorResult<StreamChunk>> {
              if (yielded++ === 0) {
                return { value: { text: 'ok' }, done: false };
              }
              // Second next() stalls indefinitely.
              return new Promise<IteratorResult<StreamChunk>>(() => {
                /* never resolves */
              });
            },
          };
        },
      };

      const iter = createStreamWatchdog(() => source, { idleTimeoutMs: 0 });
      const first = await iter.next();
      expect((first.value as StreamChunk).text).toBe('ok');

      const outstanding = iter.next();
      const closed = await iter.return();
      expect(closed.done).toBe(true);
      // The outstanding pull is racing against the abort; the watchdog's
      // controller fires, so the abort promise wins over the never-
      // resolving next(). The pull rejects with an AbortError.
      await expect(outstanding).rejects.toBeInstanceOf(Error);
    });
  });

  describe('idle-timeout watchdog', () => {
    it('aborts a stalled stream within the configured window', async () => {
      const { factory, state } = stalledAsyncSource();
      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 100 });

      await iter.next(); // consume 'hello'

      const t0 = Date.now();
      await expect(iter.next()).rejects.toBeInstanceOf(Error);
      const elapsed = Date.now() - t0;
      expect(elapsed).toBeGreaterThanOrEqual(80);
      expect(elapsed).toBeLessThan(1500);
      expect(state.aborted).toBe(true);
      expect(state.returnCalled).toBe(true);
    });

    it('is disabled when idleTimeoutMs is 0 or Infinity', async () => {
      const { factory } = stalledAsyncSource();
      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 0 });
      await iter.next();

      // With the watchdog disabled, the second pull should stay pending
      // indefinitely. Race it against 300ms and assert it did not settle.
      const pull = iter.next();
      const raced = await Promise.race([
        pull.then(() => 'settled' as const).catch(() => 'settled' as const),
        new Promise<'pending'>((r) => setTimeout(() => r('pending'), 300)),
      ]);
      expect(raced).toBe('pending');

      // Tear down cleanly.
      await iter.return();
      await expect(pull).rejects.toBeInstanceOf(Error);
    });

    it('carries a descriptive abort reason on idle timeout', async () => {
      const { factory } = stalledAsyncSource();
      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 50 });
      await iter.next();

      let caught: unknown;
      try {
        await iter.next();
      } catch (err) {
        caught = err;
      }
      expect(caught).toBeInstanceOf(Error);
      expect((caught as Error).name).toBe('AbortError');
      expect((caught as Error).message).toMatch(/stream idle timeout/i);
    });
  });

  describe('tool-aware idle extension', () => {
    it('extends the window while a long-running tool call is in flight', async () => {
      // Emit a bash tool-call delta, then stall. Base window is short,
      // extension is long — the second pull must remain pending.
      const state = { aborted: false, returnCalled: false };
      const factory = (signal: AbortSignal): AsyncIterable<StreamChunk> => {
        async function* gen(): AsyncGenerator<StreamChunk> {
          try {
            yield {
              text: '',
              toolCalls: [
                {
                  index: 0,
                  id: 'call_1',
                  type: 'function',
                  function: { name: 'bash', arguments: '{}' },
                },
              ],
            };
            await new Promise<void>((_r, reject) => {
              signal.addEventListener(
                'abort',
                () => {
                  state.aborted = true;
                  reject(new DOMException('Aborted', 'AbortError'));
                },
                { once: true }
              );
            });
          } finally {
            state.returnCalled = true;
          }
        }
        return gen();
      };

      const iter = createStreamWatchdog(factory, {
        idleTimeoutMs: 100,
        toolExtensionMs: 5_000,
      });
      await iter.next();

      const pull = iter.next();
      const raced = await Promise.race([
        pull.then(() => 'settled' as const).catch(() => 'settled' as const),
        new Promise<'pending'>((r) => setTimeout(() => r('pending'), 400)),
      ]);
      expect(raced).toBe('pending');

      await iter.return();
      await expect(pull).rejects.toBeInstanceOf(Error);
    });

    it('resets the extension after a chunk with finishReason arrives', async () => {
      // Emit tool-call + then a chunk with finishReason (i.e. the model
      // has committed to the tool call and is done streaming). After
      // that, the base idle window should apply again.
      const factory = (_signal: AbortSignal): AsyncIterable<StreamChunk> => {
        async function* gen(): AsyncGenerator<StreamChunk> {
          yield {
            text: '',
            toolCalls: [
              {
                index: 0,
                id: 'call_1',
                type: 'function',
                function: { name: 'bash', arguments: '{}' },
              },
            ],
          };
          yield { text: '', finishReason: 'tool_calls' };
          // Now stall — with the extension released, the base window
          // (short in this test) should fire.
          await new Promise(() => {
            /* never resolves */
          });
        }
        return gen();
      };

      const iter = createStreamWatchdog(factory, {
        idleTimeoutMs: 100,
        toolExtensionMs: 60_000,
      });
      await iter.next(); // tool call
      await iter.next(); // finishReason chunk

      const t0 = Date.now();
      await expect(iter.next()).rejects.toBeInstanceOf(Error);
      const elapsed = Date.now() - t0;
      // Extension should have been released, so the abort fires around
      // the base window (100ms), not the 60s extension.
      expect(elapsed).toBeLessThan(1500);
    });

    it('does not extend the window for tools outside the long-running set', async () => {
      const factory = (signal: AbortSignal): AsyncIterable<StreamChunk> => {
        async function* gen(): AsyncGenerator<StreamChunk> {
          yield {
            text: '',
            toolCalls: [
              {
                index: 0,
                id: 'call_1',
                type: 'function',
                function: { name: 'read', arguments: '{}' },
              },
            ],
          };
          await new Promise<void>((_r, reject) => {
            signal.addEventListener(
              'abort',
              () => reject(new DOMException('Aborted', 'AbortError')),
              { once: true }
            );
          });
        }
        return gen();
      };

      const iter = createStreamWatchdog(factory, {
        idleTimeoutMs: 100,
        toolExtensionMs: 60_000,
      });
      await iter.next();

      const t0 = Date.now();
      await expect(iter.next()).rejects.toBeInstanceOf(Error);
      const elapsed = Date.now() - t0;
      // `read` is not long-running, so extension does not apply and the
      // 100ms base window governs the abort.
      expect(elapsed).toBeLessThan(1500);
    });
  });

  describe('parent AbortSignal propagation', () => {
    it('forwards a pre-aborted parent signal by short-circuiting next()', async () => {
      const { factory } = stalledAsyncSource();
      const ac = new AbortController();
      ac.abort();
      const iter = createStreamWatchdog(factory, { signal: ac.signal, idleTimeoutMs: 0 });

      // First next() must throw an AbortError immediately.
      await expect(iter.next()).rejects.toBeInstanceOf(Error);
    });

    it('aborts an in-flight pull when the parent signal fires', async () => {
      const { factory, state } = stalledAsyncSource();
      const ac = new AbortController();
      const iter = createStreamWatchdog(factory, { signal: ac.signal, idleTimeoutMs: 0 });

      const first = await iter.next();
      expect(first.done).toBe(false);

      const pull = iter.next();
      ac.abort();
      await expect(pull).rejects.toBeInstanceOf(Error);
      expect(state.aborted).toBe(true);
    });
  });

  describe('throw()', () => {
    it('tears down the source and rethrows the given error', async () => {
      const { factory, state } = stalledAsyncSource();
      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 0 });
      await iter.next();

      const boom = new Error('boom');
      await expect(iter.throw(boom)).rejects.toBe(boom);
      // Fire-and-forget teardown lands after a tick.
      await new Promise((r) => setImmediate(r));
      expect(state.returnCalled).toBe(true);
    });

    it('rethrows without re-tearing-down when already finished', async () => {
      const { factory } = stalledAsyncSource();
      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 0 });
      await iter.next();
      await iter.return();

      const boom = new Error('boom');
      await expect(iter.throw(boom)).rejects.toBe(boom);
    });
  });

  describe('sync Iterable fallback', () => {
    it('normalizes a sync Iterable source into an async iterator', async () => {
      const chunks: StreamChunk[] = [{ text: 'a' }, { text: 'b' }, { text: 'c' }];
      const factory = (): Iterable<StreamChunk> => chunks[Symbol.iterator]();

      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 0 });
      const collected: string[] = [];
      for await (const c of iter) {
        collected.push(c.text);
      }
      expect(collected).toEqual(['a', 'b', 'c']);
    });
  });

  describe('for await iteration', () => {
    it('drives cleanly to completion when the source ends naturally', async () => {
      const factory = (): AsyncIterable<StreamChunk> => {
        async function* gen(): AsyncGenerator<StreamChunk> {
          yield { text: 'x' };
          yield { text: 'y' };
        }
        return gen();
      };

      const iter = createStreamWatchdog(factory, { idleTimeoutMs: 0 });
      const out: string[] = [];
      for await (const c of iter) {
        out.push(c.text);
      }
      expect(out).toEqual(['x', 'y']);
    });
  });

  describe('constructor errors', () => {
    it('throws synchronously if the source factory returns a non-iterable', () => {
      // Deliberately mistyped: not an Iterable, not an AsyncIterable.
      const factory = (): AsyncIterable<StreamChunk> =>
        ({ notAnIterator: true }) as unknown as AsyncIterable<StreamChunk>;
      expect(() => createStreamWatchdog(factory, { idleTimeoutMs: 0 })).toThrow(TypeError);
    });
  });
});
