/**
 * Forward-compatibility tests for streaming unknown-event handling.
 *
 * SST OpenCode PRs #58596 (image events), #58609 (speech events), and
 * #58608 (finish reasons) all shipped the same discipline: a stream
 * decoder MUST NOT crash the whole turn when a provider surfaces a new
 * event kind the client has not learned about yet. Alexi's defensive
 * guards live in two layers:
 *
 *   1. `src/providers/protocols/stream-events.ts` — the structural
 *      guards (`isTypedStreamEvent`, `classifyStreamEvent`,
 *      `isRecognizedStreamChunk`) exposed to any decoder that wants a
 *      forward-compat classifier.
 *   2. `src/core/streamingOrchestrator.ts` — the consumer-facing
 *      iterator that uses `isRecognizedStreamChunk` to warn + skip
 *      chunks with no recognised field instead of merging them into
 *      `fullText` or the tool-call accumulator.
 *
 * These tests pin both behaviours:
 *   - Known chunks (`text`, `toolCalls`, `finishReason`, `usage`,
 *     `images`) still flow through unchanged.
 *   - Unknown-shape chunks are logged at `warn` and skipped, with the
 *     stream continuing to the next chunk.
 *   - A mix of known + unknown chunks completes successfully, with the
 *     final `StreamingResult` reflecting only the known chunks.
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
import { logger } from '../../src/utils/logger.js';
import {
  isRecognizedStreamChunk,
  isTypedStreamEvent,
  classifyStreamEvent,
  KNOWN_STREAM_CHUNK_FIELDS,
} from '../../src/providers/protocols/stream-events.js';

/**
 * Build a provider that yields a fixed list of (possibly unknown-shape)
 * payloads. Typed loosely so a test can inject objects that don't
 * conform to `StreamChunk` — this is the whole point: forward-rolled
 * providers emit shapes the client type does not describe yet.
 */
function makeProvider(chunks: unknown[]): {
  provider: { streamComplete: ReturnType<typeof vi.fn> };
} {
  function streamComplete(_messages: unknown, _opts?: unknown) {
    async function* gen(): AsyncGenerator<StreamChunk> {
      for (const c of chunks) {
        yield c as StreamChunk;
      }
    }
    return gen();
  }
  return { provider: { streamComplete: vi.fn(streamComplete) } };
}

describe('isRecognizedStreamChunk (forward-compat guard)', () => {
  it('accepts chunks carrying any known field', () => {
    expect(isRecognizedStreamChunk({ text: 'hi' })).toBe(true);
    expect(isRecognizedStreamChunk({ toolCalls: [{ index: 0 }] })).toBe(true);
    expect(isRecognizedStreamChunk({ finishReason: 'stop' })).toBe(true);
    expect(isRecognizedStreamChunk({ usage: { total_tokens: 1 } })).toBe(true);
    expect(isRecognizedStreamChunk({ images: [] })).toBe(true);
  });

  it('rejects null / primitive / empty payloads', () => {
    expect(isRecognizedStreamChunk(null)).toBe(false);
    expect(isRecognizedStreamChunk(undefined)).toBe(false);
    expect(isRecognizedStreamChunk('text')).toBe(false);
    expect(isRecognizedStreamChunk(42)).toBe(false);
    expect(isRecognizedStreamChunk({})).toBe(false);
  });

  it('rejects chunks whose fields are all unknown to the orchestrator', () => {
    // Mirrors SST OpenCode #58596: a new `image.chunk.delta` style event
    // reaches the normalised chunk shape with a brand-new field name.
    expect(isRecognizedStreamChunk({ imageChunkDelta: 'base64...' })).toBe(false);
    expect(isRecognizedStreamChunk({ speechDelta: 'audio...' })).toBe(false);
    expect(isRecognizedStreamChunk({ type: 'image.chunk.delta', data: '...' })).toBe(false);
  });

  it('exposes the known-field set for callers that extend it', () => {
    // Keep this snapshot in sync with the StreamChunk interface.
    expect([...KNOWN_STREAM_CHUNK_FIELDS].sort()).toEqual(
      ['finishReason', 'images', 'text', 'toolCalls', 'usage'].sort()
    );
  });
});

describe('classifyStreamEvent / isTypedStreamEvent (shared with provider decoders)', () => {
  it('narrows typed stream events', () => {
    expect(isTypedStreamEvent({ type: 'content_block_delta' })).toBe(true);
    expect(isTypedStreamEvent({ type: '' })).toBe(false);
    expect(isTypedStreamEvent({ type: 42 })).toBe(false);
    expect(isTypedStreamEvent(null)).toBe(false);
  });

  it('classifies known / unknown / untyped SSE payloads', () => {
    const known = new Set(['content_block_delta', 'message_stop']);
    expect(classifyStreamEvent({ type: 'content_block_delta' }, known)).toBe('known');
    expect(classifyStreamEvent({ type: 'image.chunk.delta' }, known)).toBe('unknown');
    expect(classifyStreamEvent({ foo: 'bar' }, known)).toBe('untyped');
  });
});

describe('streamChat gracefully handles unknown chunk shapes', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
    // Logger.warn goes through console.warn under the hood. Spy on the
    // logger surface directly so the assertion is stable regardless of
    // log-level filtering in CI.
    warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    vi.resetAllMocks();
  });

  it('skips an unknown-shape chunk and completes with only known content', async () => {
    const { provider } = makeProvider([
      { text: 'hello ' },
      // Forward-rolled image event: no known field.
      { imageChunkDelta: 'base64-blob' },
      { text: 'world' },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', { modelOverride: 'gpt-4o' });
    const emitted: string[] = [];
    let final: { text: string } | undefined;

    for (;;) {
      const step = await iter.next();
      if (step.done) {
        final = step.value as { text: string };
        break;
      }
      emitted.push(step.value.text);
    }

    // The unknown chunk surfaces as an empty-text pass-through so
    // `for await` consumers do not see a crash. The known chunks still
    // accumulate verbatim.
    expect(final?.text).toBe('hello world');
    // Three provider chunks → three iterator yields: one for each known
    // chunk plus one empty-text yield for the unknown one.
    expect(emitted).toEqual(['hello ', '', 'world']);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const warnMsg = warnSpy.mock.calls[0]?.[0];
    expect(typeof warnMsg).toBe('string');
    expect(warnMsg as string).toMatch(/Unknown streaming chunk shape/);
  });

  it('keeps the stream alive across multiple consecutive unknown chunks', async () => {
    const { provider } = makeProvider([
      { text: 'A' },
      { speechDelta: 'audio-1' },
      { imageChunkDelta: 'image-1' },
      { someFutureField: 'x' },
      { text: 'B' },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', { modelOverride: 'gpt-4o' });
    let final: { text: string } | undefined;
    for (;;) {
      const step = await iter.next();
      if (step.done) {
        final = step.value as { text: string };
        break;
      }
    }

    expect(final?.text).toBe('AB');
    // One warn per unknown chunk.
    expect(warnSpy).toHaveBeenCalledTimes(3);
  });

  it('still records usage from a known chunk after an unknown one', async () => {
    const { provider } = makeProvider([
      { text: 'ok' },
      { unknownField: 'ignored' },
      {
        text: '',
        finishReason: 'stop',
        usage: { prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 },
      },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', { modelOverride: 'gpt-4o' });
    let final: { text: string; usage?: { total_tokens?: number } } | undefined;
    for (;;) {
      const step = await iter.next();
      if (step.done) {
        final = step.value as { text: string; usage?: { total_tokens?: number } };
        break;
      }
    }

    expect(final?.text).toBe('ok');
    expect(final?.usage?.total_tokens).toBe(5);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('does not warn when all chunks carry at least one known field', async () => {
    const { provider } = makeProvider([
      { text: 'a' },
      { text: 'b' },
      { finishReason: 'stop', usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } },
    ]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', { modelOverride: 'gpt-4o' });
    for (;;) {
      const step = await iter.next();
      if (step.done) {
        break;
      }
    }

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
