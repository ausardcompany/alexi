/**
 * Tests for the empty-response retry wrapper added for issue #1279.
 *
 * Contract (mirrors Kilo PR #12927):
 *  - Retry only when a turn produces genuinely nothing (no text, no tool
 *    call). Tool-call-only turns are never retried. File/reasoning-only
 *    turns (via any future StreamChunk shape) are never retried.
 *  - Buffer structural chunks until an output chunk arrives, then commit.
 *  - Aggregate usage across discarded attempts and surface it on the first
 *    committed output chunk (or on a final structural chunk if all
 *    attempts were empty).
 *  - Errors thrown by the underlying stream are propagated immediately —
 *    higher layers (ErrorBackoff, workflow retries) own error retry.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  classifyStreamPart,
  mergeUsage,
  retryEmptyResponse,
  type StreamChunk,
  type TokenUsage,
} from '../../src/providers/sapOrchestration.js';

async function collect(gen: AsyncIterable<StreamChunk>): Promise<StreamChunk[]> {
  const out: StreamChunk[] = [];
  for await (const c of gen) {
    out.push(c);
  }
  return out;
}

function makeStream(chunks: StreamChunk[]): () => AsyncIterable<StreamChunk> {
  return () => {
    async function* gen(): AsyncGenerator<StreamChunk> {
      for (const c of chunks) {
        yield c;
      }
    }
    return gen();
  };
}

describe('classifyStreamPart', () => {
  it('classifies non-empty text as output', () => {
    expect(classifyStreamPart({ text: 'hello' })).toBe('output');
  });

  it('classifies tool-call-only chunks as output', () => {
    expect(
      classifyStreamPart({
        text: '',
        toolCalls: [{ index: 0, id: 'call_1', function: { name: 'x', arguments: '{}' } }],
      })
    ).toBe('output');
  });

  it('classifies empty text with no tool calls as structural', () => {
    expect(classifyStreamPart({ text: '' })).toBe('structural');
  });

  it('classifies a metadata-only finish chunk as structural', () => {
    expect(
      classifyStreamPart({
        text: '',
        finishReason: 'stop',
        usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 },
      })
    ).toBe('structural');
  });

  it('classifies an empty tool-calls array as structural', () => {
    expect(classifyStreamPart({ text: '', toolCalls: [] })).toBe('structural');
  });

  it('classifies image-only chunks as output', () => {
    expect(
      classifyStreamPart({
        text: '',
        images: [{ kind: 'url', url: 'https://example.com/1.png' }],
      })
    ).toBe('output');
  });

  it('classifies an empty images array as structural', () => {
    expect(classifyStreamPart({ text: '', images: [] })).toBe('structural');
  });
});

describe('mergeUsage', () => {
  it('returns undefined when both sides are undefined', () => {
    expect(mergeUsage(undefined, undefined)).toBeUndefined();
  });

  it('returns the defined side when one is undefined', () => {
    const u: TokenUsage = { prompt_tokens: 5 };
    expect(mergeUsage(u, undefined)).toBe(u);
    expect(mergeUsage(undefined, u)).toBe(u);
  });

  it('sums numeric fields field-by-field', () => {
    const a: TokenUsage = {
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15,
      cache_read_input_tokens: 3,
      cache_creation_input_tokens: 2,
    };
    const b: TokenUsage = {
      prompt_tokens: 20,
      completion_tokens: 7,
      total_tokens: 27,
      cache_read_input_tokens: 1,
      cache_creation_input_tokens: 4,
    };
    expect(mergeUsage(a, b)).toEqual({
      prompt_tokens: 30,
      completion_tokens: 12,
      total_tokens: 42,
      cache_read_input_tokens: 4,
      cache_creation_input_tokens: 6,
    });
  });

  it('omits fields undefined on both sides', () => {
    const a: TokenUsage = { prompt_tokens: 10 };
    const b: TokenUsage = { completion_tokens: 5 };
    const merged = mergeUsage(a, b);
    expect(merged).toEqual({ prompt_tokens: 10, completion_tokens: 5 });
    expect(merged?.total_tokens).toBeUndefined();
    expect(merged?.cache_read_input_tokens).toBeUndefined();
  });

  it('treats a missing field on one side as zero when the other is defined', () => {
    const a: TokenUsage = { prompt_tokens: 10 };
    const b: TokenUsage = { prompt_tokens: 5, completion_tokens: 3 };
    expect(mergeUsage(a, b)).toEqual({ prompt_tokens: 15, completion_tokens: 3 });
  });
});

describe('retryEmptyResponse', () => {
  it('passes through a normal, non-empty turn without retry', async () => {
    const chunks: StreamChunk[] = [
      { text: 'Hello ' },
      { text: 'world' },
      {
        text: '',
        finishReason: 'stop',
        usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 },
      },
    ];
    const factory = vi.fn(makeStream(chunks));
    const result = await collect(retryEmptyResponse(factory, { maxAttempts: 3 }));
    expect(factory).toHaveBeenCalledTimes(1);
    expect(result).toEqual(chunks);
  });

  it('does NOT retry a tool-call-only turn', async () => {
    const chunks: StreamChunk[] = [
      {
        text: '',
        toolCalls: [
          { index: 0, id: 'call_1', function: { name: 'read_file', arguments: '{"path":"x"}' } },
        ],
      },
      {
        text: '',
        finishReason: 'tool_calls',
        usage: { prompt_tokens: 8, completion_tokens: 12, total_tokens: 20 },
      },
    ];
    const factory = vi.fn(makeStream(chunks));
    const result = await collect(retryEmptyResponse(factory, { maxAttempts: 3 }));
    expect(factory).toHaveBeenCalledTimes(1);
    // Tool-call chunk must arrive first and unchanged; finish chunk follows.
    expect(result[0]?.toolCalls?.[0]?.id).toBe('call_1');
    expect(result[1]?.finishReason).toBe('tool_calls');
  });

  it('retries an empty attempt until an output chunk arrives', async () => {
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        if (callCount < 3) {
          // First two attempts: empty (only a finish chunk).
          yield {
            text: '',
            finishReason: 'stop',
            usage: { prompt_tokens: 5, completion_tokens: 0, total_tokens: 5 },
          };
          return;
        }
        // Third attempt succeeds.
        yield { text: 'finally' };
        yield {
          text: '',
          finishReason: 'stop',
          usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 },
        };
      }
      return gen();
    };
    const onEmpty = vi.fn();
    const result = await collect(
      retryEmptyResponse(factory, { maxAttempts: 3, onEmptyAttempt: onEmpty })
    );
    expect(callCount).toBe(3);
    expect(onEmpty).toHaveBeenCalledTimes(2);
    // First yielded chunk is the committed output.
    expect(result[0]).toEqual({
      text: 'finally',
      // Aggregated usage from 2 discarded attempts folded into the first
      // output chunk, since the output chunk itself had no usage field.
      usage: {
        prompt_tokens: 10,
        completion_tokens: 0,
        total_tokens: 10,
      },
    });
    // Trailing finish chunk passes through unchanged.
    expect(result[result.length - 1]?.finishReason).toBe('stop');
  });

  it('aggregates usage from discarded attempts into the first output chunk', async () => {
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        if (callCount === 1) {
          yield {
            text: '',
            finishReason: 'stop',
            usage: { prompt_tokens: 3, completion_tokens: 0, total_tokens: 3 },
          };
          return;
        }
        yield {
          text: 'ok',
          usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 },
        };
      }
      return gen();
    };
    const result = await collect(retryEmptyResponse(factory, { maxAttempts: 3 }));
    expect(result[0]).toEqual({
      text: 'ok',
      usage: {
        prompt_tokens: 8, // 3 discarded + 5 committed
        completion_tokens: 1,
        total_tokens: 9,
      },
    });
  });

  it('aggregates cache_read/creation tokens across discarded attempts', async () => {
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        if (callCount === 1) {
          yield {
            text: '',
            finishReason: 'stop',
            usage: {
              prompt_tokens: 100,
              completion_tokens: 0,
              total_tokens: 100,
              cache_read_input_tokens: 80,
              cache_creation_input_tokens: 20,
            },
          };
          return;
        }
        yield {
          text: 'success',
          usage: {
            prompt_tokens: 100,
            completion_tokens: 3,
            total_tokens: 103,
            cache_read_input_tokens: 95,
            cache_creation_input_tokens: 5,
          },
        };
      }
      return gen();
    };
    const result = await collect(retryEmptyResponse(factory, { maxAttempts: 3 }));
    expect(result[0]?.usage).toEqual({
      prompt_tokens: 200,
      completion_tokens: 3,
      total_tokens: 203,
      cache_read_input_tokens: 175,
      cache_creation_input_tokens: 25,
    });
  });

  it('stops buffering (commits) on the first output chunk', async () => {
    const seenAfterCommit: StreamChunk[] = [];
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        // First stream: an empty structural chunk, then output, then another
        // structural finish. The wrapper should NOT retry after the output
        // chunk even though the finish chunk carries no output.
        yield { text: '' };
        yield { text: 'hello' };
        yield {
          text: '',
          finishReason: 'stop',
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        };
      }
      return gen();
    };
    for await (const c of retryEmptyResponse(factory, { maxAttempts: 3 })) {
      seenAfterCommit.push(c);
    }
    expect(callCount).toBe(1);
    // Buffered structural chunk arrives before the output.
    expect(seenAfterCommit[0]).toEqual({ text: '' });
    expect(seenAfterCommit[1]).toEqual({ text: 'hello' });
    expect(seenAfterCommit[2]?.finishReason).toBe('stop');
  });

  it('yields a final aggregated metadata chunk when ALL attempts are empty', async () => {
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        yield {
          text: '',
          finishReason: 'stop',
          usage: { prompt_tokens: 4, completion_tokens: 0, total_tokens: 4 },
        };
      }
      return gen();
    };
    const result = await collect(retryEmptyResponse(factory, { maxAttempts: 3 }));
    expect(callCount).toBe(3);
    // Exactly one chunk: the aggregated final structural chunk.
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      text: '',
      finishReason: 'stop',
      usage: {
        prompt_tokens: 12, // 4 * 3 attempts
        completion_tokens: 0,
        total_tokens: 12,
      },
    });
  });

  it('propagates errors thrown by the underlying stream without retrying', async () => {
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        yield { text: '' };
        throw new Error('provider blew up');
      }
      return gen();
    };
    await expect(collect(retryEmptyResponse(factory, { maxAttempts: 3 }))).rejects.toThrow(
      /provider blew up/
    );
    // Only one attempt: errors are NOT retried here.
    expect(callCount).toBe(1);
  });

  it('treats maxAttempts < 1 as a single attempt (no retry)', async () => {
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        yield { text: '' };
      }
      return gen();
    };
    await collect(retryEmptyResponse(factory, { maxAttempts: 0 }));
    expect(callCount).toBe(1);
  });

  it('does not retry a file-like output turn (future-proofing)', async () => {
    // The current StreamChunk shape has {text, toolCalls, finishReason,
    // usage}. If a future refactor adds a `file` field, classifyStreamPart
    // stays conservative and any chunk carrying non-empty text or tool
    // calls is treated as output. This test pins the "non-empty text is
    // output" branch even when the text is a file descriptor payload.
    const chunks: StreamChunk[] = [
      { text: '<file id="abc">contents</file>' },
      {
        text: '',
        finishReason: 'stop',
        usage: { prompt_tokens: 3, completion_tokens: 4, total_tokens: 7 },
      },
    ];
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      return makeStream(chunks)();
    };
    await collect(retryEmptyResponse(factory, { maxAttempts: 3 }));
    expect(callCount).toBe(1);
  });

  it('surfaces onEmptyAttempt callback errors without breaking retry', async () => {
    let callCount = 0;
    const factory = (): AsyncIterable<StreamChunk> => {
      callCount++;
      async function* gen(): AsyncGenerator<StreamChunk> {
        if (callCount === 1) {
          yield { text: '' };
          return;
        }
        yield { text: 'ok' };
      }
      return gen();
    };
    const onEmpty = vi.fn(() => {
      throw new Error('callback exploded');
    });
    const result = await collect(
      retryEmptyResponse(factory, { maxAttempts: 3, onEmptyAttempt: onEmpty })
    );
    expect(onEmpty).toHaveBeenCalledTimes(1);
    expect(result[0]?.text).toBe('ok');
  });
});
