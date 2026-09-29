/**
 * Regression tests for issue #1888: `agenticChat()` must distinguish a
 * `content-filter` finish reason from a generic empty response.
 *
 * When the provider signals `content-filter`, the loop must:
 *  - Emit a specific progress message identifying the content-filter block
 *    (not a generic "empty response" warning).
 *  - Stop the turn immediately (no retry, no further tool loop).
 *  - Populate `finalText` so callers see a meaningful response.
 *
 * Mirrors the provider-layer retry short-circuit added in
 * `retryEmptyResponse` and ports the semantics from Cline PR #13302.
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
  defineTool: vi.fn(),
}));

vi.mock('../../src/tool/tools/index.js', () => ({
  registerBuiltInTools: vi.fn(),
}));

import { agenticChat } from '../../src/core/agenticChat.js';
import { getProviderForModel, getProviderForModelWithFallback } from '../../src/providers/index.js';
import { getPermissionManager } from '../../src/permission/index.js';

describe('agenticChat content-filter finish reason (issue #1888)', () => {
  let mockProvider: { complete: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockProvider = { complete: vi.fn() };
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

  it('emits a specific content-filter progress message when the provider blocks the request', async () => {
    mockProvider.complete.mockResolvedValue({
      text: '',
      finishReason: 'content-filter',
      usage: { prompt_tokens: 20, completion_tokens: 0, total_tokens: 20 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const progressEvents: Array<{ type: string; message?: string }> = [];
    await agenticChat('please generate disallowed content', {
      workdir: process.cwd(),
      onProgress: (evt) => {
        progressEvents.push(evt as { type: string; message?: string });
      },
    });

    // Provider was called exactly once — no retry loop entered by the
    // higher-level tool loop for a content-filter block.
    expect(mockProvider.complete).toHaveBeenCalledTimes(1);

    // A progress event names the content filter specifically. The generic
    // empty-response / unknown-finish messages must NOT appear.
    const filterMessages = progressEvents.filter(
      (e) => typeof e.message === 'string' && /content filter/i.test(e.message)
    );
    expect(filterMessages.length).toBeGreaterThan(0);
    expect(filterMessages[0]?.message).toMatch(/blocked this request/i);
    expect(filterMessages[0]?.message).toMatch(/retry will not succeed/i);
  });

  it('ends the turn immediately without triggering another iteration', async () => {
    mockProvider.complete.mockResolvedValue({
      text: '',
      finishReason: 'content-filter',
      usage: { prompt_tokens: 5, completion_tokens: 0, total_tokens: 5 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const result = await agenticChat('nope', { workdir: process.cwd() });

    // Only one provider call — the loop did not iterate again after the
    // content-filter block.
    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
    // The returned text is a meaningful, non-generic warning so callers
    // (TUI, `alexi chat`, session log) can surface why the turn ended.
    expect(result.text).toMatch(/content filter/i);
    expect(result.text).toMatch(/retry will not succeed/i);
  });

  it('preserves any assistant text the model still produced before the filter fired', async () => {
    mockProvider.complete.mockResolvedValue({
      text: 'partial before block',
      finishReason: 'content-filter',
      usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const result = await agenticChat('mixed prompt', { workdir: process.cwd() });

    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
    // When the model produced partial text, keep it verbatim rather than
    // overwriting with the canned warning — the warning went out on the
    // progress channel already.
    expect(result.text).toBe('partial before block');
  });
});
