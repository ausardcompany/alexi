/**
 * Verifies that the streaming orchestrator honours an inline
 * `@provider/model` reference in the user message for a single turn
 * (issue #1708). Confirms:
 *
 *  - The referenced model resolves to the provider used for streaming.
 *  - The `@provider/model` token is stripped from the outbound content.
 *  - The session default is left unchanged across turns.
 *  - An invalid inline reference is ignored (session default is used
 *    and the raw text is passed through).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { StreamChunk } from '../../src/providers/index.js';

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
import { getProviderForModelWithFallback } from '../../src/providers/index.js';

function makeFiniteProvider(chunks: StreamChunk[]): {
  provider: { streamComplete: ReturnType<typeof vi.fn> };
  messagesSeen: Array<Array<{ role: string; content: string | unknown[] }>>;
} {
  const messagesSeen: Array<Array<{ role: string; content: string | unknown[] }>> = [];
  const provider = {
    streamComplete: vi.fn(async function* streamComplete(
      messages: Array<{ role: string; content: string | unknown[] }>,
      _opts?: unknown
    ): AsyncGenerator<StreamChunk> {
      messagesSeen.push(messages);
      for (const c of chunks) {
        yield c;
      }
    }),
  };
  return { provider, messagesSeen };
}

async function drain(iter: ReturnType<typeof streamChat>): Promise<string> {
  let text = '';
  for await (const chunk of iter) {
    text += chunk.text;
  }
  return text;
}

describe('streamChat inline @provider/model reference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes the turn to the referenced model when the reference is valid', async () => {
    const { provider, messagesSeen } = makeFiniteProvider([{ text: 'opus reply' }]);
    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: provider as unknown as ReturnType<
        typeof getProviderForModelWithFallback
      >['provider'],
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    const iter = streamChat('@anthropic/claude-4.7-opus explain bubble sort');
    const text = await drain(iter);
    const final = await iter.next();

    expect(text).toBe('opus reply');
    expect(final.done).toBe(true);
    if (final.done) {
      expect(final.value.modelUsed).toBe('anthropic--claude-4.7-opus');
    }
    // Provider was requested for the referenced id, NOT the session default.
    expect(getProviderForModelWithFallback).toHaveBeenCalledWith('anthropic--claude-4.7-opus');
    // The `@provider/model` token was stripped from the outbound message.
    const lastMessages = messagesSeen[messagesSeen.length - 1];
    const userMsg = lastMessages[lastMessages.length - 1];
    expect(userMsg.role).toBe('user');
    expect(userMsg.content).toBe('explain bubble sort');
  });

  it('leaves the session default unchanged after an inline-override turn', async () => {
    const { provider } = makeFiniteProvider([{ text: 'ok' }]);
    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: provider as unknown as ReturnType<
        typeof getProviderForModelWithFallback
      >['provider'],
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    await drain(streamChat('@anthropic/claude-4.7-opus turn one'));
    await drain(streamChat('turn two'));

    expect(getProviderForModelWithFallback).toHaveBeenNthCalledWith(
      1,
      'anthropic--claude-4.7-opus'
    );
    expect(getProviderForModelWithFallback).toHaveBeenNthCalledWith(2, 'gpt-4o');
  });

  it('falls back to session default and preserves message for invalid references', async () => {
    const { provider, messagesSeen } = makeFiniteProvider([{ text: 'default' }]);
    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: provider as unknown as ReturnType<
        typeof getProviderForModelWithFallback
      >['provider'],
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    const iter = streamChat('@nonexistent/model-x hello world');
    await drain(iter);
    const final = await iter.next();

    expect(final.done).toBe(true);
    if (final.done) {
      expect(final.value.modelUsed).toBe('gpt-4o');
    }
    // Invalid reference is NOT stripped so the model still sees the raw
    // input (graceful ignore per the issue contract).
    const lastMessages = messagesSeen[messagesSeen.length - 1];
    const userMsg = lastMessages[lastMessages.length - 1];
    expect(userMsg.content).toBe('@nonexistent/model-x hello world');
  });

  it('explicit modelOverride wins over an inline reference', async () => {
    const { provider } = makeFiniteProvider([{ text: 'ok' }]);
    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: provider as unknown as ReturnType<
        typeof getProviderForModelWithFallback
      >['provider'],
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    await drain(streamChat('@anthropic/claude-4.7-opus hi', { modelOverride: 'gpt-4o' }));

    expect(getProviderForModelWithFallback).toHaveBeenCalledWith('gpt-4o');
  });
});
