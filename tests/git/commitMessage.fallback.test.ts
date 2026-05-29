import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing the module under test.
vi.mock('../../src/providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(() => ({ modelId: 'gpt-4o-mini', reason: 'cheap', confidence: 0.9 })),
}));

import { generateCommitMessage } from '../../src/git/commitMessage.js';
import { getProviderForModelWithFallback } from '../../src/providers/index.js';
import type { GitConfig } from '../../src/git/config.js';

const baseConfig: GitConfig = {
  autoCommits: true,
  dirtyCommits: true,
  commitVerify: false,
  attribution: {
    style: 'co-authored-by',
    name: 'Alexi AI',
    email: 'alexi@assistant.local',
  },
  commitMessage: {
    useAI: true,
    conventional: true,
  },
};

describe('generateCommitMessage fallback model resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('uses the LLM result when getProviderForModelWithFallback fires the fallback', async () => {
    const completeFn = vi.fn().mockResolvedValue({
      text: 'feat: add fallback resolution',
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    });

    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: { complete: completeFn } as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: true,
    });

    const msg = await generateCommitMessage([{ filePath: 'src/foo.ts', toolName: 'write' }], {
      ...baseConfig,
      commitMessage: { ...baseConfig.commitMessage, model: 'totally-bogus' },
    });

    expect(getProviderForModelWithFallback).toHaveBeenCalledWith('totally-bogus');
    expect(completeFn).toHaveBeenCalledTimes(1);
    expect(msg).toBe('feat: add fallback resolution');
  });

  it('uses the LLM result on the no-fallback path', async () => {
    const completeFn = vi.fn().mockResolvedValue({
      text: 'feat: a new thing',
      usage: { prompt_tokens: 8, completion_tokens: 4, total_tokens: 12 },
    });

    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: { complete: completeFn } as never,
      effectiveModelId: modelId,
      usedFallback: false,
    }));

    const msg = await generateCommitMessage([{ filePath: 'src/foo.ts', toolName: 'write' }], {
      ...baseConfig,
      commitMessage: { ...baseConfig.commitMessage, model: 'gpt-4o' },
    });

    expect(getProviderForModelWithFallback).toHaveBeenCalledWith('gpt-4o');
    expect(completeFn).toHaveBeenCalledTimes(1);
    expect(msg).toBe('feat: a new thing');
  });

  it('falls back to heuristic message when provider.complete throws', async () => {
    const completeFn = vi.fn().mockRejectedValue(new Error('boom'));

    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: { complete: completeFn } as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: true,
    });

    const msg = await generateCommitMessage([{ filePath: 'src/foo.ts', toolName: 'write' }], {
      ...baseConfig,
      commitMessage: { ...baseConfig.commitMessage, model: 'totally-bogus' },
    });

    // Heuristic path must run; the function still returns a non-empty message
    expect(getProviderForModelWithFallback).toHaveBeenCalledWith('totally-bogus');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });
});
