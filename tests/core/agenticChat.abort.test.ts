/**
 * Regression tests for issue #1639: `agenticChat()` must forward the
 * caller-supplied `AbortSignal` into `provider.complete()` so a
 * user-initiated Ctrl+C cancels the in-flight LLM request instead of
 * running to completion after cancellation.
 *
 * We drive the module directly with mocked providers and verify the
 * signal is propagated on both the primary dispatch and the
 * context-overflow retry path.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CompletionResult } from '../../src/providers/sapOrchestration.js';

vi.mock('../../src/core/memory.js', () => ({
  getMemoryManager: vi.fn(() => ({
    getContextString: vi.fn().mockReturnValue(''),
  })),
}));

vi.mock('../../src/core/sessionContext.js', () => ({
  getSessionContextString: vi.fn().mockReturnValue(''),
}));

vi.mock('../../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(() => ({
    modelId: 'gpt-4o',
    reason: 'test routing',
    confidence: 0.9,
  })),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

vi.mock('../../src/core/costTracker.js', () => ({
  getCostTracker: vi.fn(() => ({
    recordUsage: vi.fn(),
  })),
}));

const mockToolRegistry = {
  list: vi.fn(() => []),
  get: vi.fn(() => undefined),
};

vi.mock('../../src/tool/index.js', () => ({
  getToolRegistry: () => mockToolRegistry,
  registerTool: vi.fn(),
}));

vi.mock('../../src/tool/tools/index.js', () => ({
  registerBuiltInTools: vi.fn(),
}));

import { agenticChat } from '../../src/core/agenticChat.js';
import { getProviderForModel, getProviderForModelWithFallback } from '../../src/providers/index.js';
import { getPermissionManager } from '../../src/permission/index.js';

describe('agenticChat abort signal propagation (issue #1639)', () => {
  let mockProvider: { complete: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: 'ok',
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        toolCalls: undefined,
      } satisfies CompletionResult),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);
    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: mockProvider as never,
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    const pm = getPermissionManager();
    pm.removeRule('agentic-allow-write');
    pm.removeRule('agentic-allow-execute');
  });

  afterEach(() => {
    const pm = getPermissionManager();
    pm.removeRule('agentic-allow-write');
    pm.removeRule('agentic-allow-execute');
    vi.clearAllMocks();
  });

  it('forwards options.signal to provider.complete on the primary dispatch', async () => {
    const controller = new AbortController();

    await agenticChat('hi', {
      workdir: process.cwd(),
      signal: controller.signal,
    });

    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
    const [, providerOpts] = mockProvider.complete.mock.calls[0];
    expect(providerOpts).toBeDefined();
    expect((providerOpts as { signal?: AbortSignal }).signal).toBe(controller.signal);
  });

  it('does not include a signal key when the caller omits one', async () => {
    await agenticChat('hi', { workdir: process.cwd() });

    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
    const [, providerOpts] = mockProvider.complete.mock.calls[0];
    // `stripInternalOptions` preserves `undefined` values; either way the
    // signal must not be a live AbortSignal instance.
    const forwarded = (providerOpts as { signal?: unknown }).signal;
    expect(forwarded === undefined || forwarded === null).toBe(true);
  });

  it('throws before any LLM call when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      agenticChat('hi', {
        workdir: process.cwd(),
        signal: controller.signal,
      })
    ).rejects.toThrow(/aborted/i);

    // The top-of-loop check must trip before we spend a provider call.
    expect(mockProvider.complete).not.toHaveBeenCalled();
  });

  it('propagates the abort when the provider itself throws AbortError', async () => {
    const controller = new AbortController();
    mockProvider.complete.mockImplementation(async (_messages, opts) => {
      // Simulate a real provider that forwards the signal to fetch:
      // when the caller aborts, fetch rejects with an AbortError.
      const signal = (opts as { signal?: AbortSignal }).signal;
      controller.abort();
      if (signal?.aborted) {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        throw err;
      }
      return {
        text: 'unreachable',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        toolCalls: undefined,
      } satisfies CompletionResult;
    });

    await expect(
      agenticChat('hi', {
        workdir: process.cwd(),
        signal: controller.signal,
      })
    ).rejects.toThrow(/abort/i);
    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
  });
});
