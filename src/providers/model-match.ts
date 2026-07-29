/**
 * Model matching and detection utilities
 * Identifies model families for routing and feature decisions
 */

/**
 * Check if model ID represents a Ling model
 * Excludes false positives: kling, bling, spelling, etc.
 */
export function isLing(modelId: string): boolean {
  const lower = modelId.toLowerCase();

  // Must start with "ling" as a word boundary
  if (!lower.startsWith('ling')) {
    // Check for ling after a separator
    const lingIndex = lower.indexOf('ling');
    if (lingIndex === -1) {
      return false;
    }

    // Ensure it's a word boundary (preceded by separator)
    const prevChar = lower[lingIndex - 1];
    if (prevChar !== '-' && prevChar !== '_' && prevChar !== '/' && prevChar !== ':') {
      return false;
    }
  }

  // Exclude known false positives
  const exclusions = ['kling', 'bling', 'spelling', 'sibling', 'handling', 'enabling'];
  for (const exclusion of exclusions) {
    if (lower.includes(exclusion)) {
      return false;
    }
  }

  return true;
}

/**
 * Get model family for routing decisions
 */
export function getModelFamily(modelId: string): string {
  if (isLing(modelId)) {
    return 'ling';
  }
  if (modelId.includes('deepseek')) {
    return 'deepseek';
  }
  if (modelId.includes('claude')) {
    return 'claude';
  }
  if (modelId.includes('gpt')) {
    return 'openai';
  }
  if (modelId.includes('gemini')) {
    return 'google';
  }
  return 'unknown';
}

/**
 * Check if model supports reasoning content
 */
export function supportsReasoning(modelId: string): boolean {
  const family = getModelFamily(modelId);
  return family === 'deepseek' || family === 'claude';
}

/**
 * Check if model is a DeepSeek variant
 */
export function isDeepSeek(modelId: string): boolean {
  return modelId.toLowerCase().includes('deepseek');
}

/**
 * Check if model is Claude variant
 */
export function isClaude(modelId: string): boolean {
  return modelId.toLowerCase().includes('claude');
}

/**
 * Known Anthropic model ids that Alexi's router recognizes explicitly.
 *
 * This catalog is used by `isAnthropicModel` for fast, unambiguous matching
 * of well-known ids (including provider-prefixed forms such as
 * `sap-ai-core/anthropic--claude-...`). Unlisted ids still fall through to
 * substring detection via `isClaude`, so this constant does not gate
 * routing — it just documents the supported set.
 *
 * Added claude-opus-4, sonnet-4.5, sonnet-4.7 + -1221-v1 variants
 * (Cline #12620, 2026-07-20).
 */
export const ANTHROPIC_MODELS: readonly string[] = [
  // Claude 3 family
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'claude-3.5-sonnet',
  'claude-3.5-haiku',
  'claude-3.7-sonnet',
  // Claude 4 family
  'claude-4-opus',
  'claude-4-sonnet',
  'claude-opus-4',
  'claude-opus-4-1221-v1',
  'claude-sonnet-4',
  'claude-sonnet-4.5',
  'claude-sonnet-4.5-1221-v1',
  'claude-sonnet-4.7',
  'claude-sonnet-4.7-1221-v1',
  // Alexi-pinned agent model (SAP AI Core provider-prefixed form)
  'claude-4.7-opus',
];

/**
 * Check if a model id refers to an Anthropic model.
 *
 * Returns true when either:
 * - the id matches (case-insensitive) a known entry in `ANTHROPIC_MODELS`
 *   (also matched as a substring, so provider-prefixed ids such as
 *   `sap-ai-core/anthropic--claude-opus-4` are recognized), or
 * - the id contains `claude` as a fallback for unlisted variants.
 */
export function isAnthropicModel(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  for (const known of ANTHROPIC_MODELS) {
    if (lower.includes(known.toLowerCase())) {
      return true;
    }
  }
  return isClaude(modelId);
}

/**
 * Check if model is OpenAI variant
 */
export function isOpenAI(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  return lower.includes('gpt') || lower.includes('o1') || lower.includes('openai');
}

/**
 * Check if model is Google Gemini variant
 */
export function isGemini(modelId: string): boolean {
  return modelId.toLowerCase().includes('gemini');
}

/** Reasoning-effort capability for a given model id */
export type ReasoningEffortMode = 'none' | 'binary' | 'levels';

/**
 * Return how a model accepts reasoning_effort:
 * - 'levels' -> send `reasoning_effort: 'low'|'medium'|'high'` as-is.
 * - 'binary' -> send `enable_thinking: true` (drop the level).
 * - 'none'   -> do not forward the field.
 */
export function modelSupportsReasoningEffort(modelId: string): ReasoningEffortMode {
  const lower = modelId.toLowerCase();
  if (lower.includes('deepseek')) {
    return 'levels';
  }
  // Anthropic Opus 4.7+ accepts adaptive reasoning_effort levels natively.
  // Match either "opus-<major>[.<minor>]" or "claude-<major>[.<minor>]-opus".
  const opusMatch =
    lower.match(/opus-(\d+)(?:\.(\d+))?/) ?? lower.match(/claude-(\d+)(?:\.(\d+))?-opus/);
  if (opusMatch) {
    const major = Number(opusMatch[1]);
    const minor = opusMatch[2] !== undefined ? Number(opusMatch[2]) : 0;
    if (major > 4 || (major === 4 && minor >= 7)) {
      return 'levels';
    }
  }
  // Anthropic Sonnet 5+ accepts adaptive reasoning_effort levels natively.
  // Match either "sonnet-<major>" or "claude-<major>-sonnet".
  const sonnetMatch = lower.match(/sonnet-(\d+)/) ?? lower.match(/claude-(\d+)-sonnet/);
  if (sonnetMatch) {
    const major = Number(sonnetMatch[1]);
    if (major >= 5) {
      return 'levels';
    }
  }
  // Pre-emptive carve-out for future binary-only thinking models.
  // Add concrete model substrings here when wired into the router.
  return 'none';
}
