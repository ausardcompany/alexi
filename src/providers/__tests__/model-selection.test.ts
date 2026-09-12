/**
 * Tests for auxiliary-task model selection.
 *
 * Mirrors upstream kilocode `packages/opencode/test/kilocode/provider/provider.test.ts`
 * (introduced by commit `1e73d3862` — "small-model-fallback-requires-kilo-credentials")
 * but adapted to Alexi's SAP AI Core + optional `models.compaction`
 * deployment shape.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the underlying getDefaultModel + env before importing the module
// under test — vitest hoists vi.mock, but explicit ordering keeps it
// readable and matches the pattern in AGENTS.md > Testing quirks.
vi.mock('../index.js', () => ({
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));
vi.mock('../../config/env.js', () => ({
  env: vi.fn(() => undefined),
}));
vi.mock('../../config/userConfig.js', () => ({
  getConfigValue: vi.fn(() => undefined),
}));
vi.mock('../sapOrchestration.js', () => ({
  isOrchestrationModel: vi.fn(() => true),
}));

import {
  selectModelForTask,
  buildContext,
  resolveSmallModelDeployment,
  getModel,
  getAuxiliaryModelId,
  type ProviderContext,
} from '../model-selection.js';
import { getConfigValue } from '../../config/userConfig.js';
import { env } from '../../config/env.js';

function baseContext(overrides: Partial<ProviderContext> = {}): ProviderContext {
  return {
    providerID: 'sap-ai-core',
    defaultModel: 'gpt-4o',
    smallModelDeployment: undefined,
    hasKiloCredentials: (): boolean => false,
    hasSapDeployment: (): boolean => false,
    ...overrides,
  };
}

describe('selectModelForTask', () => {
  it('returns default model for primary tasks (no fallback logic)', async () => {
    const ref = await selectModelForTask('primary', baseContext());
    expect(ref).toEqual({ providerID: 'sap-ai-core', modelID: 'gpt-4o' });
  });

  it('reuses default model for auxiliary task when no small deployment is configured', async () => {
    const ref = await selectModelForTask('auxiliary', baseContext());
    // Critical safety property: no `deployment_not_found` because we
    // never attempt an unconfigured small-model id.
    expect(ref).toEqual({ providerID: 'sap-ai-core', modelID: 'gpt-4o' });
  });

  it('uses the SAP small deployment for auxiliary tasks when configured', async () => {
    const ctx = baseContext({
      smallModelDeployment: 'gpt-4o-mini',
      hasSapDeployment: (tier): boolean => tier === 'small',
    });
    const ref = await selectModelForTask('auxiliary', ctx);
    expect(ref).toEqual({ providerID: 'sap-ai-core', modelID: 'gpt-4o-mini' });
  });

  it('falls back to default model when SAP small deployment flag is false, even if the id is set', async () => {
    // Defensive: if hasSapDeployment() returns false the small id is
    // ignored to avoid auth failures.
    const ctx = baseContext({
      smallModelDeployment: 'gpt-4o-mini',
      hasSapDeployment: (): boolean => false,
    });
    const ref = await selectModelForTask('auxiliary', ctx);
    expect(ref.modelID).toBe('gpt-4o');
  });

  it('returns kilo-auto for auxiliary tasks when Kilo credentials are present', async () => {
    const ctx = baseContext({
      providerID: 'kilo',
      hasKiloCredentials: (): boolean => true,
    });
    const ref = await selectModelForTask('auxiliary', ctx);
    expect(ref).toEqual({ providerID: 'kilo', modelID: 'kilo-auto' });
  });

  it('does NOT return kilo-auto when Kilo credentials are absent', async () => {
    // The upstream bug this test guards against: `kilo-auto` was being
    // picked even without Kilo credentials, causing auth errors.
    const ctx = baseContext({
      providerID: 'kilo',
      hasKiloCredentials: (): boolean => false,
    });
    const ref = await selectModelForTask('auxiliary', ctx);
    expect(ref.modelID).toBe('gpt-4o');
    expect(ref.modelID).not.toBe('kilo-auto');
  });

  it('supports async credential probes', async () => {
    const ctx = baseContext({
      providerID: 'kilo',
      hasKiloCredentials: (): Promise<boolean> => Promise.resolve(true),
    });
    const ref = await selectModelForTask('auxiliary', ctx);
    expect(ref.modelID).toBe('kilo-auto');
  });
});

describe('resolveSmallModelDeployment', () => {
  beforeEach(() => {
    vi.mocked(getConfigValue).mockReset();
    vi.mocked(env).mockReset();
    vi.mocked(env).mockReturnValue(undefined);
  });

  it('reads from models.compaction (new location)', () => {
    vi.mocked(getConfigValue).mockImplementation((key: string) =>
      key === 'models' ? { compaction: 'gpt-4o-mini' } : undefined
    );
    expect(resolveSmallModelDeployment()).toBe('gpt-4o-mini');
  });

  it('falls back to legacy context.compactionModel', () => {
    vi.mocked(getConfigValue).mockImplementation((key: string) => {
      if (key === 'models') {
        return {};
      }
      if (key === 'context') {
        return { compactionModel: 'legacy-mini' };
      }
      return undefined;
    });
    expect(resolveSmallModelDeployment()).toBe('legacy-mini');
  });

  it('prefers models.compaction over legacy context.compactionModel', () => {
    vi.mocked(getConfigValue).mockImplementation((key: string) => {
      if (key === 'models') {
        return { compaction: 'new-mini' };
      }
      if (key === 'context') {
        return { compactionModel: 'legacy-mini' };
      }
      return undefined;
    });
    expect(resolveSmallModelDeployment()).toBe('new-mini');
  });

  it('falls back to AICORE_SMALL_MODEL env var when config is empty', () => {
    vi.mocked(getConfigValue).mockReturnValue(undefined);
    vi.mocked(env).mockImplementation((k: string) =>
      k === 'AICORE_SMALL_MODEL' ? 'env-mini' : undefined
    );
    expect(resolveSmallModelDeployment()).toBe('env-mini');
  });

  it('returns undefined when nothing is configured', () => {
    vi.mocked(getConfigValue).mockReturnValue(undefined);
    vi.mocked(env).mockReturnValue(undefined);
    expect(resolveSmallModelDeployment()).toBeUndefined();
  });
});

describe('buildContext', () => {
  beforeEach(() => {
    vi.mocked(getConfigValue).mockReset();
    vi.mocked(env).mockReset();
    vi.mocked(env).mockReturnValue(undefined);
  });

  it('pins providerID to sap-ai-core and reports Kilo credentials as absent', async () => {
    const ctx = buildContext();
    expect(ctx.providerID).toBe('sap-ai-core');
    expect(await Promise.resolve(ctx.hasKiloCredentials())).toBe(false);
  });

  it('reports hasSapDeployment(small) === true iff a deployment is configured', async () => {
    vi.mocked(getConfigValue).mockImplementation((key: string) =>
      key === 'models' ? { compaction: 'gpt-4o-mini' } : undefined
    );
    const ctx = buildContext();
    expect(ctx.smallModelDeployment).toBe('gpt-4o-mini');
    expect(await Promise.resolve(ctx.hasSapDeployment('small'))).toBe(true);
  });

  it('reports hasSapDeployment(small) === false when nothing is configured', async () => {
    vi.mocked(getConfigValue).mockReturnValue(undefined);
    const ctx = buildContext();
    expect(ctx.smallModelDeployment).toBeUndefined();
    expect(await Promise.resolve(ctx.hasSapDeployment('small'))).toBe(false);
  });
});

describe('getModel / getAuxiliaryModelId', () => {
  beforeEach(() => {
    vi.mocked(getConfigValue).mockReset();
    vi.mocked(env).mockReset();
    vi.mocked(env).mockReturnValue(undefined);
    vi.mocked(getConfigValue).mockReturnValue(undefined);
  });

  it('getModel() with an explicit id returns it verbatim', async () => {
    const ref = await getModel('anthropic--claude-3.7-sonnet');
    expect(ref).toEqual({
      providerID: 'sap-ai-core',
      modelID: 'anthropic--claude-3.7-sonnet',
    });
  });

  it('getModel() without an id returns the default model', async () => {
    const ref = await getModel();
    expect(ref.modelID).toBe('gpt-4o');
  });

  it('getModel({ auxiliary: true }) with no small deployment returns the default model', async () => {
    const ref = await getModel(undefined, { auxiliary: true });
    // Safety property enforced end-to-end: no phantom `kilo-auto` leak.
    expect(ref.modelID).toBe('gpt-4o');
  });

  it('getModel({ auxiliary: true }) with a configured small deployment returns it', async () => {
    vi.mocked(getConfigValue).mockImplementation((key: string) =>
      key === 'models' ? { compaction: 'gpt-4o-mini' } : undefined
    );
    const ref = await getModel(undefined, { auxiliary: true });
    expect(ref.modelID).toBe('gpt-4o-mini');
  });

  it('getAuxiliaryModelId() returns default when no small deployment is set', async () => {
    const id = await getAuxiliaryModelId();
    expect(id).toBe('gpt-4o');
  });

  it('getAuxiliaryModelId() returns the small deployment when set', async () => {
    vi.mocked(getConfigValue).mockImplementation((key: string) =>
      key === 'models' ? { compaction: 'gpt-4o-mini' } : undefined
    );
    const id = await getAuxiliaryModelId();
    expect(id).toBe('gpt-4o-mini');
  });
});
