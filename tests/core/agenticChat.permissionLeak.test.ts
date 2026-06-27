/**
 * Regression test for issue #518: agenticChat() must not leak duplicate
 * 'agentic-allow-write' / 'agentic-allow-execute' permission rules across
 * invocations within the same process (long-running TUI sessions).
 *
 * addRule() does not de-dup by id; agenticChat() now calls removeRule() for
 * each id before re-registering, so the rule list stays bounded.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CompletionResult } from '../../src/providers/sapOrchestration.js';

// Memory + session context modules (dynamic imports inside agenticChat)
vi.mock('../../src/core/memory.js', () => ({
  getMemoryManager: vi.fn(() => ({
    getContextString: vi.fn().mockReturnValue(''),
  })),
}));

vi.mock('../../src/core/sessionContext.js', () => ({
  getSessionContextString: vi.fn().mockReturnValue(''),
}));

// Providers — return a single text response so the loop terminates after one
// iteration with no tool calls.
vi.mock('../../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

// Router (not exercised, but agenticChat imports it eagerly).
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

// Tool registry — empty list, so no tool schemas are sent.
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

describe('agenticChat permission rule leak (issue #518)', () => {
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

    // Make sure the singleton starts clean for each test — agenticChat() is
    // expected to keep the rule list bounded, but explicit cleanup keeps the
    // assertion meaningful even if other tests in the suite touched the
    // singleton earlier.
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

  it('does not leak duplicate agentic-allow-* rules across repeated calls', async () => {
    await agenticChat('hi', { workdir: process.cwd() });
    await agenticChat('hi', { workdir: process.cwd() });
    await agenticChat('hi', { workdir: process.cwd() });

    const rules = getPermissionManager().getRules();
    expect(rules.filter((r) => r.id === 'agentic-allow-write')).toHaveLength(1);
    expect(rules.filter((r) => r.id === 'agentic-allow-execute')).toHaveLength(1);
  });
});
