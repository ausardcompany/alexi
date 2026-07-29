import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { PendingOverridesStore, applyPendingOverrides } from '../../src/config/pendingOverrides.js';
import type { ModelOverride } from '../../src/config/pendingOverrides.js';
import type { ModelCapability } from '../../src/core/router.js';
import { saveRoutingConfig, loadRoutingConfig } from '../../src/config/routingConfig.js';

describe('PendingOverridesStore', () => {
  let store: PendingOverridesStore;

  beforeEach(() => {
    store = new PendingOverridesStore();
  });

  describe('stage', () => {
    it('records overrides for a model id', () => {
      store.stage('gpt-4o', { costTier: 'expensive', maxTokens: 200_000 });
      expect(store.get('gpt-4o')).toEqual({
        costTier: 'expensive',
        maxTokens: 200_000,
      });
    });

    it('merges overrides for the same id (last-write-wins per field)', () => {
      store.stage('gpt-4o', { costTier: 'expensive', maxTokens: 200_000 });
      store.stage('gpt-4o', { maxTokens: 128_000, inputPrice: 2.5 });
      expect(store.get('gpt-4o')).toEqual({
        costTier: 'expensive',
        maxTokens: 128_000,
        inputPrice: 2.5,
      });
    });

    it('rejects empty model id', () => {
      expect(() => store.stage('', { costTier: 'cheap' })).toThrow(/modelId is required/);
    });

    it('scopes overrides per mode', () => {
      store.stage('gpt-4o', { costTier: 'cheap' }, 'plan');
      store.stage('gpt-4o', { costTier: 'expensive' }, 'act');
      expect(store.get('gpt-4o', 'plan')).toEqual({ costTier: 'cheap' });
      expect(store.get('gpt-4o', 'act')).toEqual({ costTier: 'expensive' });
    });
  });

  describe('renameModelId (the core fix for #1175)', () => {
    it('carries staged overrides from old id to new id', () => {
      store.stage('gpt-4o', {
        costTier: 'expensive',
        maxTokens: 128_000,
        inputPrice: 2.5,
        outputPrice: 10,
        supportsPromptCache: true,
      });

      store.renameModelId('gpt-4o', 'gpt-4o-custom');

      expect(store.get('gpt-4o')).toBeUndefined();
      expect(store.get('gpt-4o-custom')).toEqual({
        costTier: 'expensive',
        maxTokens: 128_000,
        inputPrice: 2.5,
        outputPrice: 10,
        supportsPromptCache: true,
      });
    });

    it('is a no-op when oldId === newId', () => {
      store.stage('gpt-4o', { costTier: 'medium' });
      store.renameModelId('gpt-4o', 'gpt-4o');
      expect(store.get('gpt-4o')).toEqual({ costTier: 'medium' });
      expect(store.getCommitting()).toBeNull();
    });

    it('rejects empty oldId or newId', () => {
      expect(() => store.renameModelId('', 'x')).toThrow();
      expect(() => store.renameModelId('x', '')).toThrow();
    });

    it('records the rename as in-flight so getCommitting reflects it', () => {
      store.stage('gpt-4o', { costTier: 'expensive' });
      store.renameModelId('gpt-4o', 'gpt-4o-custom');
      expect(store.getCommitting()).toEqual({ oldId: 'gpt-4o', newId: 'gpt-4o-custom' });
    });

    it('does nothing when there are no staged overrides but still records the rename', () => {
      store.renameModelId('unknown-id', 'renamed-id');
      expect(store.get('unknown-id')).toBeUndefined();
      expect(store.get('renamed-id')).toBeUndefined();
      expect(store.getCommitting()).toEqual({ oldId: 'unknown-id', newId: 'renamed-id' });
    });

    it('merges into any overrides already staged on the new id', () => {
      store.stage('gpt-4o', { costTier: 'expensive', maxTokens: 128_000 });
      store.stage('gpt-4o-custom', { inputPrice: 1.0, maxTokens: 32_000 });
      store.renameModelId('gpt-4o', 'gpt-4o-custom');
      // Carried values win over pre-staged newId values (they represent
      // the user's most recently displayed metadata).
      expect(store.get('gpt-4o-custom')).toEqual({
        inputPrice: 1.0,
        costTier: 'expensive',
        maxTokens: 128_000,
      });
    });
  });

  describe('stageWhileCommitting (round-trip race handling)', () => {
    it('routes edits to the pending id while a rename is in flight', () => {
      store.stage('gpt-4o', { costTier: 'expensive', maxTokens: 128_000 });
      store.renameModelId('gpt-4o', 'gpt-4o-custom');

      // Editor sends an edit still referencing the old id because it
      // has not yet observed the commit round-trip.
      const targetId = store.stageWhileCommitting('gpt-4o', { maxTokens: 200_000 });

      expect(targetId).toBe('gpt-4o-custom');
      expect(store.get('gpt-4o')).toBeUndefined();
      expect(store.get('gpt-4o-custom')).toEqual({
        costTier: 'expensive',
        maxTokens: 200_000,
      });
    });

    it('routes to modelId directly when no rename is in flight', () => {
      const targetId = store.stageWhileCommitting('gpt-4o', { costTier: 'cheap' });
      expect(targetId).toBe('gpt-4o');
      expect(store.get('gpt-4o')).toEqual({ costTier: 'cheap' });
    });

    it('finishCommit clears the in-flight state', () => {
      store.stage('gpt-4o', { costTier: 'expensive' });
      store.renameModelId('gpt-4o', 'gpt-4o-custom');
      store.finishCommit();
      const targetId = store.stageWhileCommitting('gpt-4o', { maxTokens: 500 });
      // Rename is no longer in flight; edit lands on the original id.
      expect(targetId).toBe('gpt-4o');
      expect(store.get('gpt-4o')).toEqual({ maxTokens: 500 });
    });
  });

  describe('drain / clear', () => {
    it('drain returns and empties the staged bucket', () => {
      store.stage('a', { costTier: 'cheap' });
      store.stage('b', { costTier: 'medium' });
      const drained = store.drain();
      expect(drained.size).toBe(2);
      expect(store.get('a')).toBeUndefined();
      expect(store.get('b')).toBeUndefined();
    });

    it('drain returns an empty map when nothing is staged', () => {
      expect(store.drain().size).toBe(0);
    });

    it('clear wipes all modes and in-flight state', () => {
      store.stage('a', { costTier: 'cheap' }, 'plan');
      store.stage('b', { costTier: 'medium' }, 'act');
      store.renameModelId('a', 'a2', 'plan');
      store.clear();
      expect(store.get('a', 'plan')).toBeUndefined();
      expect(store.get('a2', 'plan')).toBeUndefined();
      expect(store.get('b', 'act')).toBeUndefined();
      expect(store.getCommitting('plan')).toBeNull();
    });
  });
});

describe('applyPendingOverrides', () => {
  const baseModels: ModelCapability[] = [
    {
      id: 'gpt-4o',
      type: 'openai',
      costTier: 'medium',
      strengths: ['coding'],
      maxTokens: 128_000,
      reasoning: false,
    },
    {
      id: 'gpt-4o-mini',
      type: 'openai',
      costTier: 'cheap',
      strengths: ['simple-qa'],
      maxTokens: 16_000,
      reasoning: false,
    },
  ];

  it('patches an existing model in place', () => {
    const pending = new Map<string, ModelOverride>([
      ['gpt-4o', { inputPrice: 2.5, outputPrice: 10, supportsPromptCache: true }],
    ]);
    const { models, unresolved } = applyPendingOverrides(baseModels, pending);
    expect(unresolved).toEqual([]);
    const patched = models.find((m) => m.id === 'gpt-4o')!;
    expect(patched.inputPrice).toBe(2.5);
    expect(patched.outputPrice).toBe(10);
    expect(patched.supportsPromptCache).toBe(true);
    // Original fields preserved.
    expect(patched.costTier).toBe('medium');
    expect(patched.strengths).toEqual(['coding']);
  });

  it('does not mutate the input array', () => {
    const pending = new Map<string, ModelOverride>([['gpt-4o', { costTier: 'expensive' }]]);
    const snapshot = JSON.stringify(baseModels);
    applyPendingOverrides(baseModels, pending);
    expect(JSON.stringify(baseModels)).toBe(snapshot);
  });

  it('appends a new model when the override is complete', () => {
    const pending = new Map<string, ModelOverride>([
      [
        'gpt-4o-custom',
        {
          type: 'openai',
          costTier: 'expensive',
          strengths: ['coding'],
          maxTokens: 200_000,
          reasoning: true,
          inputPrice: 3,
          outputPrice: 15,
          supportsPromptCache: true,
        },
      ],
    ]);
    const { models, unresolved } = applyPendingOverrides(baseModels, pending);
    expect(unresolved).toEqual([]);
    const added = models.find((m) => m.id === 'gpt-4o-custom');
    expect(added).toBeDefined();
    expect(added?.inputPrice).toBe(3);
    expect(added?.reasoning).toBe(true);
  });

  it('reports unresolved ids when the override is a partial patch for an unknown id', () => {
    const pending = new Map<string, ModelOverride>([['ghost-model', { inputPrice: 1.0 }]]);
    const { models, unresolved } = applyPendingOverrides(baseModels, pending);
    expect(unresolved).toEqual(['ghost-model']);
    expect(models.find((m) => m.id === 'ghost-model')).toBeUndefined();
  });
});

describe('saveRoutingConfig round-trip with pending overrides (integration)', () => {
  let tmpDir: string;
  let cfgPath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-routing-'));
    cfgPath = path.join(tmpDir, 'routing-config.json');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('preserves custom metadata across a model-id rename via disk round-trip', () => {
    // 1. Seed a config file with a custom model + overrides.
    const initialModels: ModelCapability[] = [
      {
        id: 'gpt-4o',
        type: 'openai',
        costTier: 'expensive',
        strengths: ['coding'],
        maxTokens: 128_000,
        reasoning: false,
        inputPrice: 2.5,
        outputPrice: 10,
        supportsPromptCache: true,
      },
    ];
    saveRoutingConfig(
      {
        models: initialModels,
        rules: [],
        preferences: {
          defaultCostTier: 'medium',
          preferCheapWhenPossible: false,
          maxCostPerRequest: null,
          fallbackModel: 'gpt-4o',
        },
      },
      cfgPath
    );

    // 2. Load, stage a rename of the model id.
    const loaded = loadRoutingConfig(cfgPath);
    const store = new PendingOverridesStore();
    const displayed = loaded.models.find((m) => m.id === 'gpt-4o')!;

    // Simulate the editor: stage displayed metadata under the OLD id,
    // then rename to the NEW id (upstream Cline #12628 pattern).
    store.stage('gpt-4o', {
      type: displayed.type,
      costTier: displayed.costTier,
      strengths: displayed.strengths,
      maxTokens: displayed.maxTokens,
      reasoning: displayed.reasoning,
      inputPrice: displayed.inputPrice,
      outputPrice: displayed.outputPrice,
      supportsPromptCache: displayed.supportsPromptCache,
    });
    store.renameModelId('gpt-4o', 'gpt-4o-custom');

    // Concurrent edit still targeting old id (round-trip race).
    store.stageWhileCommitting('gpt-4o', { maxTokens: 256_000 });

    // 3. Apply, save, reload.
    const pending = store.drain();
    // For a rename we must drop the old id entry from the models list
    // before merging; simulate what the editor would do.
    const withoutOld = loaded.models.filter((m) => m.id !== 'gpt-4o');
    const { models, unresolved } = applyPendingOverrides(withoutOld, pending);
    expect(unresolved).toEqual([]);
    saveRoutingConfig({ ...loaded, models }, cfgPath);

    const reloaded = loadRoutingConfig(cfgPath);
    const custom = reloaded.models.find((m) => m.id === 'gpt-4o-custom');
    expect(custom).toBeDefined();
    expect(custom?.inputPrice).toBe(2.5);
    expect(custom?.outputPrice).toBe(10);
    expect(custom?.supportsPromptCache).toBe(true);
    expect(custom?.costTier).toBe('expensive');
    expect(custom?.maxTokens).toBe(256_000); // race-safe edit landed on new id
    expect(reloaded.models.find((m) => m.id === 'gpt-4o')).toBeUndefined();
  });
});
