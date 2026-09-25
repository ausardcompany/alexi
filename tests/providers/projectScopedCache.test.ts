/**
 * Tests for the project-scoped provider cache (issue #1834).
 *
 * The cache must:
 *   1. Return the same provider instance for repeated calls with the
 *      same (projectPath, modelId, resourceGroup) tuple.
 *   2. Return DIFFERENT instances when the project path differs — this
 *      is the credential-leak fix ported from Kilocode #14557.
 *   3. Return different instances when the resource group differs
 *      even inside the same project.
 *   4. Support surgical clearing per project via `clearProviderCache(path)`.
 *   5. Support full flush via `clearProviderCache()`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/providers/sapOrchestration.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/providers/sapOrchestration.js')>();
  class MockProvider {
    modelName: string;
    resourceGroup: string | undefined;
    __mockProvider = true;
    constructor(cfg: { modelName: string; resourceGroup?: string }) {
      this.modelName = cfg.modelName;
      this.resourceGroup = cfg.resourceGroup;
    }
  }
  return {
    ...actual,
    isOrchestrationModel: vi.fn(() => true),
    SapOrchestrationProvider: MockProvider,
  };
});

vi.mock('../../src/config/env.js', () => ({
  env: vi.fn(() => undefined),
}));

vi.mock('../../src/config/userConfig.js', () => ({
  getConfigDefaultModel: vi.fn(() => undefined),
}));

vi.mock('../../src/config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(() => ({
    models: [],
    rules: [],
    preferences: {
      defaultCostTier: 'medium',
      preferCheapWhenPossible: false,
      maxCostPerRequest: null,
      fallbackModel: 'gpt-4o',
    },
  })),
}));

import { env } from '../../src/config/env.js';
import {
  _providerCacheSize,
  clearProviderCache,
  getProviderForModel,
} from '../../src/providers/index.js';

const PROJECT_A = '/tmp/alexi-project-a';
const PROJECT_B = '/tmp/alexi-project-b';

describe('project-scoped provider cache', () => {
  beforeEach(() => {
    clearProviderCache();
    vi.mocked(env).mockReturnValue(undefined);
  });

  afterEach(() => {
    clearProviderCache();
    vi.clearAllMocks();
  });

  it('returns the same provider for repeated calls with the same project + model', () => {
    const a1 = getProviderForModel('gpt-4o', PROJECT_A);
    const a2 = getProviderForModel('gpt-4o', PROJECT_A);
    expect(a1).toBe(a2);
    expect(_providerCacheSize()).toBe(1);
  });

  it('returns DIFFERENT providers for the same model but different projects', () => {
    const a = getProviderForModel('gpt-4o', PROJECT_A);
    const b = getProviderForModel('gpt-4o', PROJECT_B);
    expect(a).not.toBe(b);
    expect(_providerCacheSize()).toBe(2);
  });

  it('separates cache entries by resource group even within a single project', () => {
    vi.mocked(env).mockReturnValueOnce('rg-one');
    const first = getProviderForModel('gpt-4o', PROJECT_A);
    vi.mocked(env).mockReturnValueOnce('rg-two');
    const second = getProviderForModel('gpt-4o', PROJECT_A);
    expect(first).not.toBe(second);
    expect(_providerCacheSize()).toBe(2);
  });

  it('separates cache entries by model within a single project', () => {
    const gpt = getProviderForModel('gpt-4o', PROJECT_A);
    const claude = getProviderForModel('anthropic--claude-4.5-sonnet', PROJECT_A);
    expect(gpt).not.toBe(claude);
    expect(_providerCacheSize()).toBe(2);
  });

  it('clearProviderCache(path) drops only entries for that project', () => {
    getProviderForModel('gpt-4o', PROJECT_A);
    getProviderForModel('gpt-4o', PROJECT_B);
    expect(_providerCacheSize()).toBe(2);

    clearProviderCache(PROJECT_A);
    expect(_providerCacheSize()).toBe(1);

    const a = getProviderForModel('gpt-4o', PROJECT_A);
    const b1 = getProviderForModel('gpt-4o', PROJECT_B);
    const b2 = getProviderForModel('gpt-4o', PROJECT_B);
    // Project B kept its warm provider.
    expect(b1).toBe(b2);
    // Project A rebuilt from scratch.
    expect(a).not.toBe(b1);
  });

  it('clearProviderCache() drops every entry', () => {
    getProviderForModel('gpt-4o', PROJECT_A);
    getProviderForModel('gpt-4o', PROJECT_B);
    clearProviderCache();
    expect(_providerCacheSize()).toBe(0);
  });

  it('normalizes trailing separators and dot-segments in the project path', () => {
    const canonical = getProviderForModel('gpt-4o', PROJECT_A);
    const trailing = getProviderForModel('gpt-4o', PROJECT_A + '/');
    const dotted = getProviderForModel('gpt-4o', PROJECT_A + '/./');
    expect(trailing).toBe(canonical);
    expect(dotted).toBe(canonical);
    expect(_providerCacheSize()).toBe(1);
  });

  it('defaults the project path to process.cwd() when the caller does not supply one', () => {
    const explicit = getProviderForModel('gpt-4o', process.cwd());
    const implicit = getProviderForModel('gpt-4o');
    expect(explicit).toBe(implicit);
  });
});
