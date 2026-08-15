import { describe, expect, it } from 'vitest';
import {
  ANTHROPIC_MODELS,
  isAnthropicModel,
  isClaudeOpus4,
  modelSupportsReasoningEffort,
  supportsReasoning,
} from '../model-match.js';
import {
  ORCHESTRATION_MODEL_METADATA,
  modelHasCapability,
  type ModelCapability,
} from '../sapOrchestration.js';
import { extractImageChunk, extractImageChunks } from '../transform.js';

describe('modelSupportsReasoningEffort', () => {
  it('returns "levels" for deepseek model ids', () => {
    expect(modelSupportsReasoningEffort('deepseek-r1')).toBe('levels');
  });

  it('is case-insensitive when matching deepseek', () => {
    expect(modelSupportsReasoningEffort('DeepSeek-R1')).toBe('levels');
    expect(modelSupportsReasoningEffort('sap-ai-core/DEEPSEEK-V3')).toBe('levels');
  });

  it('returns "none" for an empty model id', () => {
    expect(modelSupportsReasoningEffort('')).toBe('none');
  });

  it('returns "levels" for Anthropic Opus 4.7 (pinned AGENT_MODEL)', () => {
    expect(modelSupportsReasoningEffort('sap-ai-core/anthropic--claude-4.7-opus')).toBe('levels');
  });

  it('returns "levels" for Anthropic Sonnet 5+', () => {
    expect(modelSupportsReasoningEffort('anthropic--claude-5-sonnet')).toBe('levels');
  });

  it('returns "none" for Opus below the 4.7 gate', () => {
    expect(modelSupportsReasoningEffort('claude-4.6-opus')).toBe('none');
  });

  it('returns "none" for Sonnet below the 5 gate', () => {
    expect(modelSupportsReasoningEffort('claude-4-sonnet')).toBe('none');
  });

  it('returns "none" for Claude 3.5 Sonnet (regression guard)', () => {
    expect(modelSupportsReasoningEffort('claude-3.5-sonnet')).toBe('none');
  });

  it('is case-insensitive when matching Anthropic Opus 4.7', () => {
    expect(modelSupportsReasoningEffort('SAP-AI-CORE/ANTHROPIC--CLAUDE-4.7-OPUS')).toBe('levels');
  });
});

describe('supportsReasoning (Claude family unchanged)', () => {
  it('still returns true for Anthropic Claude ids', () => {
    expect(supportsReasoning('sap-ai-core/anthropic--claude-4.7-opus')).toBe(true);
  });
});

describe('ANTHROPIC_MODELS catalog', () => {
  it('includes claude-opus-4 and its -1221-v1 extended-context variant', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-1221-v1');
  });

  it('includes claude-sonnet-4.5 and its -1221-v1 extended-context variant', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.5');
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.5-1221-v1');
  });

  it('includes claude-sonnet-4.7 and its -1221-v1 extended-context variant', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.7');
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.7-1221-v1');
  });

  it('is frozen/readonly at the type level and non-empty at runtime', () => {
    expect(Array.isArray(ANTHROPIC_MODELS)).toBe(true);
    expect(ANTHROPIC_MODELS.length).toBeGreaterThan(0);
  });
});

describe('isAnthropicModel', () => {
  it('returns true for claude-opus-4', () => {
    expect(isAnthropicModel('claude-opus-4')).toBe(true);
  });

  it('returns true for claude-sonnet-4.7-1221-v1', () => {
    expect(isAnthropicModel('claude-sonnet-4.7-1221-v1')).toBe(true);
  });

  it('returns true for claude-sonnet-4.5 and its -1221-v1 variant', () => {
    expect(isAnthropicModel('claude-sonnet-4.5')).toBe(true);
    expect(isAnthropicModel('claude-sonnet-4.5-1221-v1')).toBe(true);
  });

  it('returns true for provider-prefixed SAP AI Core Anthropic ids', () => {
    expect(isAnthropicModel('sap-ai-core/anthropic--claude-opus-4')).toBe(true);
    expect(isAnthropicModel('sap-ai-core/anthropic--claude-4.7-opus')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isAnthropicModel('CLAUDE-OPUS-4')).toBe(true);
    expect(isAnthropicModel('Claude-Sonnet-4.7')).toBe(true);
  });

  it('falls back to the claude substring for unlisted Claude variants', () => {
    // Not in the explicit catalog, but still an Anthropic model.
    expect(isAnthropicModel('claude-99-experimental')).toBe(true);
  });

  it('returns false for non-Anthropic model ids', () => {
    expect(isAnthropicModel('gpt-4o')).toBe(false);
    expect(isAnthropicModel('deepseek-r1')).toBe(false);
    expect(isAnthropicModel('gemini-2.5-pro')).toBe(false);
    expect(isAnthropicModel('')).toBe(false);
  });
});

describe('ANTHROPIC_MODELS catalog - Aider #5173 additions', () => {
  it('includes bare Anthropic opus 4.1 / 4.5 / 4.6 / 4.7 ids', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-1');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-5');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-6');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-7');
  });

  it('includes dated snapshot ids for opus 4.1+ variants', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-1-20250805');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-5-20251101');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-6-20260205');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-7-20260416');
  });

  it('includes the dated claude-3-7-sonnet snapshot id', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-3-7-sonnet-20250219');
  });

  it('includes SAP-shaped 4.5 / 4.6 / 4.7 opus aliases', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-4.5-opus');
    expect(ANTHROPIC_MODELS).toContain('claude-4.6-opus');
    expect(ANTHROPIC_MODELS).toContain('claude-4.7-opus');
  });
});

describe('isAnthropicModel - new Claude opus 4.1+ ids', () => {
  it('recognizes bare opus-4-N ids', () => {
    expect(isAnthropicModel('claude-opus-4-1')).toBe(true);
    expect(isAnthropicModel('claude-opus-4-5')).toBe(true);
    expect(isAnthropicModel('claude-opus-4-6')).toBe(true);
    expect(isAnthropicModel('claude-opus-4-7')).toBe(true);
  });

  it('recognizes dated snapshot ids', () => {
    expect(isAnthropicModel('claude-opus-4-1-20250805')).toBe(true);
    expect(isAnthropicModel('claude-opus-4-7-20260416')).toBe(true);
  });

  it('recognizes SAP AI Core provider-prefixed opus 4.1+ ids', () => {
    expect(isAnthropicModel('sap-ai-core/anthropic--claude-4.5-opus')).toBe(true);
    expect(isAnthropicModel('sap-ai-core/anthropic--claude-4.6-opus')).toBe(true);
    expect(isAnthropicModel('sap-ai-core/anthropic--claude-4.7-opus')).toBe(true);
  });
});

describe('isClaudeOpus4', () => {
  it('returns true for bare opus-4-N ids', () => {
    expect(isClaudeOpus4('claude-opus-4-1')).toBe(true);
    expect(isClaudeOpus4('claude-opus-4-5')).toBe(true);
    expect(isClaudeOpus4('claude-opus-4-6')).toBe(true);
    expect(isClaudeOpus4('claude-opus-4-7')).toBe(true);
  });

  it('returns true for dated snapshot ids', () => {
    expect(isClaudeOpus4('claude-opus-4-1-20250805')).toBe(true);
    expect(isClaudeOpus4('claude-opus-4-7-20260416')).toBe(true);
  });

  it('returns true for SAP double-dash 4.N-opus ids', () => {
    expect(isClaudeOpus4('anthropic--claude-4.5-opus')).toBe(true);
    expect(isClaudeOpus4('anthropic--claude-4.6-opus')).toBe(true);
    expect(isClaudeOpus4('anthropic--claude-4.7-opus')).toBe(true);
  });

  it('returns true for provider-prefixed SAP forms', () => {
    expect(isClaudeOpus4('sap-ai-core/anthropic--claude-4.7-opus')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isClaudeOpus4('CLAUDE-OPUS-4-7')).toBe(true);
    expect(isClaudeOpus4('SAP-AI-CORE/ANTHROPIC--CLAUDE-4.7-OPUS')).toBe(true);
  });

  it('returns false for unversioned claude-4-opus (backwards compatibility)', () => {
    // The deprecation only applies to 4.1+ per Aider #5173. The bare
    // `claude-4-opus` alias must keep sending `temperature` for callers
    // that still rely on it.
    expect(isClaudeOpus4('claude-4-opus')).toBe(false);
  });

  it('returns false for the SAP extended-context claude-opus-4-1221-v1 alias', () => {
    // `-1221-v1` is a Cline-side extended-context version tag on the
    // UNVERSIONED opus-4, not the Anthropic 4.1 minor revision. Matching
    // it as opus-4.1 would incorrectly drop temperature for a family
    // that still accepts it.
    expect(isClaudeOpus4('claude-opus-4-1221-v1')).toBe(false);
  });

  it('returns false for bare claude-opus-4 (no minor revision)', () => {
    expect(isClaudeOpus4('claude-opus-4')).toBe(false);
  });

  it('returns false for Claude Sonnet and Haiku variants', () => {
    expect(isClaudeOpus4('claude-4.5-sonnet')).toBe(false);
    expect(isClaudeOpus4('anthropic--claude-4.5-sonnet')).toBe(false);
    expect(isClaudeOpus4('anthropic--claude-4.5-haiku')).toBe(false);
    expect(isClaudeOpus4('claude-3.7-sonnet')).toBe(false);
  });

  it('returns false for non-Anthropic models', () => {
    expect(isClaudeOpus4('gpt-4o')).toBe(false);
    expect(isClaudeOpus4('deepseek-r1')).toBe(false);
    expect(isClaudeOpus4('')).toBe(false);
  });
});

describe('modelHasCapability', () => {
  it('returns true when the model advertises the requested capability', () => {
    expect(modelHasCapability('gpt-4o', 'tools')).toBe(true);
    expect(modelHasCapability('anthropic--claude-4.7-opus', 'tools')).toBe(true);
    expect(modelHasCapability('gemini-2.5-pro', 'tools')).toBe(true);
    expect(modelHasCapability('amazon--nova-lite', 'tools')).toBe(true);
  });

  it('returns false when the model has an entry but not the capability', () => {
    // deepseek-r1 has metadata with an empty capabilities array.
    expect(modelHasCapability('deepseek-ai--deepseek-r1', 'tools')).toBe(false);
    expect(modelHasCapability('meta--llama3.1-70b-instruct', 'tools')).toBe(false);
    expect(modelHasCapability('mistralai--mistral-small-instruct', 'tools')).toBe(false);
    // Nothing in the current catalog advertises image-generation.
    expect(modelHasCapability('gpt-4o', 'image-generation')).toBe(false);
    expect(modelHasCapability('anthropic--claude-4.7-opus', 'image-generation')).toBe(false);
  });

  it('returns false by default when the model id is unknown', () => {
    expect(modelHasCapability('some-unknown-model', 'tools')).toBe(false);
    expect(modelHasCapability('some-unknown-model', 'image-generation')).toBe(false);
    expect(modelHasCapability('some-unknown-model', 'embeddings')).toBe(false);
  });

  it('honours assumeWhenUnspecified when the model id is unknown', () => {
    expect(modelHasCapability('some-unknown-model', 'tools', { assumeWhenUnspecified: true })).toBe(
      true
    );
    expect(
      modelHasCapability('some-unknown-model', 'embeddings', { assumeWhenUnspecified: false })
    ).toBe(false);
  });

  it('does NOT apply assumeWhenUnspecified when the model is known but lacks the capability', () => {
    // deepseek-r1 has an explicit empty capability list; the assumption
    // only kicks in when NO metadata entry exists at all.
    expect(
      modelHasCapability('deepseek-ai--deepseek-r1', 'tools', { assumeWhenUnspecified: true })
    ).toBe(false);
  });

  it('strips leading provider prefix before lookup', () => {
    expect(modelHasCapability('sap-ai-core/anthropic--claude-4.7-opus', 'tools')).toBe(true);
    expect(modelHasCapability('sap-ai-core/gpt-4o', 'tools')).toBe(true);
    expect(modelHasCapability('sap-ai-core/deepseek-ai--deepseek-r1', 'tools')).toBe(false);
  });

  it('returns the fallback for empty / non-string ids', () => {
    expect(modelHasCapability('', 'tools')).toBe(false);
    expect(modelHasCapability('', 'tools', { assumeWhenUnspecified: true })).toBe(true);
  });

  it('metadata surface uses only valid ModelCapability values', () => {
    const valid: ReadonlySet<ModelCapability> = new Set<ModelCapability>([
      'image-generation',
      'tools',
      'embeddings',
    ]);
    for (const meta of Object.values(ORCHESTRATION_MODEL_METADATA)) {
      if (!meta?.capabilities) {
        continue;
      }
      for (const cap of meta.capabilities) {
        expect(valid.has(cap)).toBe(true);
      }
    }
  });
});

describe('extractImageChunk', () => {
  it('normalises an OpenAI-style image_url payload', () => {
    const chunk = extractImageChunk({
      type: 'image_url',
      image_url: { url: 'https://example.com/cat.png', mime_type: 'image/png' },
    });
    expect(chunk).toEqual({
      kind: 'url',
      url: 'https://example.com/cat.png',
      mimeType: 'image/png',
    });
  });

  it('omits mimeType when image_url does not carry one', () => {
    const chunk = extractImageChunk({
      type: 'image_url',
      image_url: { url: 'https://example.com/cat.png' },
    });
    expect(chunk).toEqual({ kind: 'url', url: 'https://example.com/cat.png' });
  });

  it('normalises an Anthropic-style base64 image payload (b64_json)', () => {
    const chunk = extractImageChunk({
      type: 'image',
      image: { b64_json: 'AAECAw==', mime_type: 'image/png' },
    });
    expect(chunk).toEqual({ kind: 'base64', data: 'AAECAw==', mimeType: 'image/png' });
  });

  it('normalises a Gemini-style base64 image payload (data)', () => {
    const chunk = extractImageChunk({
      type: 'image',
      image: { data: 'AAECAw==' },
    });
    expect(chunk).toEqual({ kind: 'base64', data: 'AAECAw==' });
  });

  it('returns undefined for non-image items', () => {
    expect(extractImageChunk({ type: 'text', text: 'hi' })).toBeUndefined();
    expect(extractImageChunk({ type: 'tool_use' })).toBeUndefined();
    expect(extractImageChunk(null)).toBeUndefined();
    expect(extractImageChunk(undefined)).toBeUndefined();
    expect(extractImageChunk('plain string')).toBeUndefined();
    expect(extractImageChunk(42)).toBeUndefined();
  });

  it('returns undefined for malformed image payloads', () => {
    expect(extractImageChunk({ type: 'image_url', image_url: { url: '' } })).toBeUndefined();
    expect(extractImageChunk({ type: 'image_url', image_url: { url: 42 } })).toBeUndefined();
    expect(extractImageChunk({ type: 'image_url' })).toBeUndefined();
    expect(extractImageChunk({ type: 'image', image: {} })).toBeUndefined();
    expect(extractImageChunk({ type: 'image', image: { b64_json: '' } })).toBeUndefined();
  });
});

describe('extractImageChunks', () => {
  it('returns [] for null / undefined / empty payloads', () => {
    expect(extractImageChunks(null)).toEqual([]);
    expect(extractImageChunks(undefined)).toEqual([]);
    expect(extractImageChunks([])).toEqual([]);
  });

  it('extracts multiple image chunks from an array, skipping non-images', () => {
    const chunks = extractImageChunks([
      { type: 'text', text: 'here' },
      { type: 'image_url', image_url: { url: 'https://a/1.png' } },
      { type: 'image', image: { b64_json: 'ZZ==', mime_type: 'image/jpeg' } },
      { type: 'tool_use' },
    ]);
    expect(chunks).toEqual([
      { kind: 'url', url: 'https://a/1.png' },
      { kind: 'base64', data: 'ZZ==', mimeType: 'image/jpeg' },
    ]);
  });

  it('handles a single non-array item', () => {
    const chunks = extractImageChunks({
      type: 'image_url',
      image_url: { url: 'https://a/1.png' },
    });
    expect(chunks).toEqual([{ kind: 'url', url: 'https://a/1.png' }]);
  });
});
