import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing the module
vi.mock('../../src/providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

// Import after mocking
import { streamChat } from '../../src/core/streamingOrchestrator.js';
import { getProviderForModelWithFallback, getDefaultModel } from '../../src/providers/index.js';
import { INTERNAL_OPTION_KEYS } from '../../src/agent/index.js';

// Helper to create a mock provider that yields a single chunk
function createMockStreamProvider(chunks: Array<{ text: string; usage?: Record<string, number> }>) {
  const streamCompleteFn = vi.fn().mockImplementation(function* () {
    for (const chunk of chunks) {
      yield chunk;
    }
  });

  return {
    streamComplete: streamCompleteFn,
  };
}

describe('streamChat fallback model resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('uses the resolved effectiveModelId when getProviderForModelWithFallback fires the fallback', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'ok', usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 } },
    ]);

    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: mockProvider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: true,
    });

    const gen = streamChat('Hello', { modelOverride: 'totally-bogus-model' });

    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }
    const result = next.value;

    // Streaming orchestrator must surface the fallback model id, not the bogus one
    expect(result.modelUsed).toBe('gpt-4o');
    expect(getProviderForModelWithFallback).toHaveBeenCalledWith('totally-bogus-model');
    expect(mockProvider.streamComplete).toHaveBeenCalledTimes(1);
  });

  it('keeps the requested model id when usedFallback is false', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'hi', usage: { prompt_tokens: 4, completion_tokens: 2, total_tokens: 6 } },
    ]);

    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: mockProvider as never,
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    const gen = streamChat('Hi', { modelOverride: 'anthropic--claude-4-sonnet' });

    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }
    const result = next.value;

    expect(result.modelUsed).toBe('anthropic--claude-4-sonnet');
    expect(getProviderForModelWithFallback).toHaveBeenCalledWith('anthropic--claude-4-sonnet');
    expect(mockProvider.streamComplete).toHaveBeenCalledTimes(1);
  });
});

describe('streamChat provider dispatch strips internal agent-metadata options', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('never forwards INTERNAL_OPTION_KEYS to provider.streamComplete', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'hi', usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } },
    ]);

    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: mockProvider as never,
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    const gen = streamChat('hi', {
      modelOverride: 'anthropic--claude-4-sonnet',
      maxTokens: 512,
      temperature: 0.4,
      agentId: 'code',
    });

    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }

    // provider.streamComplete is called with (messages, options)
    expect(mockProvider.streamComplete).toHaveBeenCalledTimes(1);
    const [, opts] = mockProvider.streamComplete.mock.calls[0];
    const optsObj = opts as Record<string, unknown>;

    // Legitimate CompletionOptions fields must be preserved
    expect(optsObj).toHaveProperty('maxTokens', 512);
    expect(optsObj).toHaveProperty('temperature', 0.4);
    expect(optsObj).toHaveProperty('headers');

    // No agent-metadata key from the deny-list may leak through
    for (const key of INTERNAL_OPTION_KEYS) {
      expect(
        optsObj,
        `internal key '${key}' leaked into provider.streamComplete opts`
      ).not.toHaveProperty(key);
    }
  });
});
