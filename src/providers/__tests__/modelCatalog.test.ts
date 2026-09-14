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
