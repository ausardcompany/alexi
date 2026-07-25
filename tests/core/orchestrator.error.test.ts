import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock providers module BEFORE importing the module under test.
// vi.mock() is hoisted, but we keep the block above the import
// explicitly for readability (matches project convention).
vi.mock('../../src/providers/index.js', () => {
  const getProviderForModel = vi.fn();
  return {
    getProviderForModel,
    getProviderForModelWithFallback: vi.fn((modelId: string) => ({
      provider: getProviderForModel(modelId),
      effectiveModelId: modelId,
      usedFallback: false,
    })),
    getDefaultModel: vi.fn(),
  };
});

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

import { sendChat } from '../../src/core/orchestrator.js';
import { getProviderForModel, getDefaultModel } from '../../src/providers/index.js';

describe('sendChat error formatting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('rethrows with cause folded into message for undici-shape transport errors', async () => {
    // Build the reference undici error: TypeError('fetch failed') with a
    // SocketError-shape cause carrying a code.
    const cause: Error & { code?: string } = new Error('other side closed');
    cause.name = 'SocketError';
    cause.code = 'UND_ERR_SOCKET';
    const transport = new TypeError('fetch failed');
    (transport as Error & { cause?: unknown }).cause = cause;

    const mockProvider = {
      complete: vi.fn().mockRejectedValue(transport),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    let caught: unknown;
    try {
      await sendChat('hi');
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(Error);
    const rethrown = caught as Error;

    // Original instance is preserved so instanceof checks elsewhere
    // continue to work.
    expect(rethrown).toBe(transport);

    // The rethrown message now carries the underlying cause: its name
    // AND its code.
    expect(rethrown.message).toContain('SocketError');
    expect(rethrown.message).toContain('UND_ERR_SOCKET');
    expect(rethrown.message).toContain('other side closed');
  });

  it('leaves the error untouched when there is no error-shaped cause', async () => {
    const plain = new Error('plain provider failure');

    const mockProvider = {
      complete: vi.fn().mockRejectedValue(plain),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    let caught: unknown;
    try {
      await sendChat('hi');
    } catch (err) {
      caught = err;
    }

    expect(caught).toBe(plain);
    expect((caught as Error).message).toBe('plain provider failure');
  });

  // Context-window overflow rewrite — verifies that expanded pattern
  // matching in `src/core/contextOverflow.ts` is wired through the
  // orchestrator so users see an actionable message.
  const overflowFixtures: Array<[string, string]> = [
    ['context_length_exceeded', 'context_length_exceeded: too many input tokens'],
    ['context window', "This model's context window is 200000 tokens"],
    ['maximum context length', 'The maximum context length is 128000 tokens'],
    ['too_many_tokens', 'error: too_many_tokens returned by provider'],
    ['context limit', 'You have exceeded the context limit for this model'],
    ['exceeds the context', 'Request exceeds the context of this deployment'],
  ];

  it.each(overflowFixtures)(
    'rewrites overflow error (%s) into the user-facing message',
    async (_label, providerMessage) => {
      const providerErr = new Error(providerMessage);
      const mockProvider = {
        complete: vi.fn().mockRejectedValue(providerErr),
      };
      vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

      let caught: unknown;
      try {
        await sendChat('hi');
      } catch (err) {
        caught = err;
      }

      expect(caught).toBe(providerErr);
      const msg = (caught as Error).message;
      // The user-facing prefix is prepended.
      expect(msg).toContain('Context window exceeded');
      expect(msg).toContain('Reduce context size');
      expect(msg).toContain('larger window');
      // The raw provider message is preserved (in parentheses) for
      // operator debugging.
      expect(msg).toContain(providerMessage);
    }
  );

  it('does NOT rewrite non-overflow provider errors', async () => {
    const providerErr = new Error('some unrelated 500 from provider');
    const mockProvider = {
      complete: vi.fn().mockRejectedValue(providerErr),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    let caught: unknown;
    try {
      await sendChat('hi');
    } catch (err) {
      caught = err;
    }

    expect((caught as Error).message).toBe('some unrelated 500 from provider');
  });
});
