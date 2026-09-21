import { describe, expect, it } from 'vitest';
import { getAvailableModels, isAvailableModel, getModelMetadata } from '../modelCatalog.js';
import {
  ORCHESTRATION_MODELS,
  ORCHESTRATION_MODEL_METADATA,
  isOrchestrationModel,
  modelHasCapability,
} from '../sapOrchestration.js';
import { modelSupportsReasoningEffort } from '../model-match.js';

describe('modelCatalog: deepseek-v4.1-flash entry', () => {
  it('is present in the static ORCHESTRATION_MODELS list', () => {
    expect((ORCHESTRATION_MODELS as readonly string[]).includes('deepseek-v4.1-flash')).toBe(true);
  });

  it('is accepted by isOrchestrationModel()', () => {
    expect(isOrchestrationModel('deepseek-v4.1-flash')).toBe(true);
  });

  it('is exposed via getAvailableModels()', () => {
    expect(getAvailableModels()).toContain('deepseek-v4.1-flash');
  });

  it('is accepted by isAvailableModel()', () => {
    expect(isAvailableModel('deepseek-v4.1-flash')).toBe(true);
  });

  it('has a metadata entry matching the deepseek-r1 capability profile', () => {
    const flashMeta = ORCHESTRATION_MODEL_METADATA['deepseek-v4.1-flash'];
    const r1Meta = ORCHESTRATION_MODEL_METADATA['deepseek-ai--deepseek-r1'];
    expect(flashMeta).toBeDefined();
    expect(r1Meta).toBeDefined();
    expect(flashMeta?.capabilities).toEqual(r1Meta?.capabilities);
  });

  it('exposes the metadata through getModelMetadata()', () => {
    const meta = getModelMetadata('deepseek-v4.1-flash');
    expect(meta).toBeDefined();
    expect(meta?.capabilities).toEqual([]);
  });

  it('does not advertise tool-calling (matches deepseek family profile)', () => {
    expect(modelHasCapability('deepseek-v4.1-flash', 'tools')).toBe(false);
  });

  it('supports reasoning_effort at "levels" (low/medium/high) like deepseek-v4-chat', () => {
    // The provider dispatch and reasoning module already key off the
    // `deepseek` substring, so V4.1 Flash inherits the same reasoning API
    // as deepseek-r1 / deepseek-v4-chat: reasoning: 'levels',
    // budget: 'reasoning_effort'.
    expect(modelSupportsReasoningEffort('deepseek-v4.1-flash')).toBe('levels');
    expect(modelSupportsReasoningEffort('DEEPSEEK-V4.1-FLASH')).toBe('levels');
    expect(modelSupportsReasoningEffort('sap-ai-core/deepseek-v4.1-flash')).toBe('levels');
  });
});

// Aider PR #5173 (2026-09-21) added dated Claude snapshots to Anthropic's
// sanity-check model list. SAP AI Core exposes the same snapshots under
// its `anthropic--` prefix; the entries below make sure Alexi's catalog
// accepts them without an escape-hatch deployment id.
describe('modelCatalog: recent Claude dated snapshots (Aider #5173)', () => {
  const claudeSnapshots = [
    'anthropic--claude-3-7-sonnet-20250219',
    'anthropic--claude-opus-4-1-20250805',
    'anthropic--claude-opus-4-5-20251101',
    'anthropic--claude-opus-4-6-20260205',
    'anthropic--claude-opus-4-7-20260416',
  ] as const;

  it.each(claudeSnapshots)('%s is present in the static ORCHESTRATION_MODELS list', (id) => {
    expect((ORCHESTRATION_MODELS as readonly string[]).includes(id)).toBe(true);
  });

  it.each(claudeSnapshots)('%s is accepted by isOrchestrationModel()', (id) => {
    expect(isOrchestrationModel(id)).toBe(true);
  });

  it.each(claudeSnapshots)('%s is exposed via getAvailableModels()', (id) => {
    expect(getAvailableModels()).toContain(id);
  });

  it.each(claudeSnapshots)('%s is accepted by isAvailableModel()', (id) => {
    expect(isAvailableModel(id)).toBe(true);
  });

  it.each(claudeSnapshots)('%s has a tool-calling metadata entry', (id) => {
    const meta = ORCHESTRATION_MODEL_METADATA[id];
    expect(meta).toBeDefined();
    expect(meta?.capabilities).toEqual(['tools']);
  });

  it.each(claudeSnapshots)('%s exposes metadata through getModelMetadata()', (id) => {
    const meta = getModelMetadata(id);
    expect(meta).toBeDefined();
    expect(meta?.capabilities).toContain('tools');
  });

  it.each(claudeSnapshots)('%s advertises the tools capability', (id) => {
    expect(modelHasCapability(id, 'tools')).toBe(true);
  });

  it.each(claudeSnapshots)(
    '%s advertises tools even when queried through the sap-ai-core/ prefix',
    (id) => {
      expect(modelHasCapability(`sap-ai-core/${id}`, 'tools')).toBe(true);
    }
  );
});
