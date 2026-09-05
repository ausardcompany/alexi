/**
 * Tests for prompt-cache breakpoint detection and env-block hardening
 * (kilocode #13190).
 */

import { describe, it, expect } from 'vitest';
import {
  applyCacheBreakpoint,
  hasEnvironmentDetailsBlock,
  supportsPromptCacheBreakpoint,
  isChatGPTSubscription,
  isGpt5_6OrLater,
  type LanguageModelV2Prompt,
} from '../prompt-cache.js';

describe('hasEnvironmentDetailsBlock', () => {
  it('returns false for empty content', () => {
    expect(hasEnvironmentDetailsBlock('')).toBe(false);
  });

  it('returns false for content without the block', () => {
    expect(hasEnvironmentDetailsBlock('plain system prompt')).toBe(false);
  });

  it('returns true when the block is present verbatim', () => {
    expect(hasEnvironmentDetailsBlock('<environment_details>\nfoo\n</environment_details>')).toBe(
      true
    );
  });

  it('returns true when preceded by leading whitespace (kilocode #13190)', () => {
    // Kilocode #13190: raw `startsWith('<environment_details>')` fails when
    // blank lines precede the block. `.trim().includes(...)` must handle it.
    expect(
      hasEnvironmentDetailsBlock('\n\n  <environment_details>\nfoo\n</environment_details>')
    ).toBe(true);
  });

  it('returns true when preceded by a blank-line-only prefix', () => {
    expect(
      hasEnvironmentDetailsBlock('   \n\t\n<environment_details>\nfoo\n</environment_details>')
    ).toBe(true);
  });

  it('returns false for non-string content', () => {
    expect(hasEnvironmentDetailsBlock(undefined)).toBe(false);
    expect(hasEnvironmentDetailsBlock(null)).toBe(false);
    expect(hasEnvironmentDetailsBlock(42)).toBe(false);
    expect(hasEnvironmentDetailsBlock({})).toBe(false);
  });
});

describe('supportsPromptCacheBreakpoint', () => {
  it('returns true for GPT-5.6+ on the openai provider', () => {
    expect(supportsPromptCacheBreakpoint({ providerId: 'openai', modelId: 'gpt-5.6' })).toBe(true);
    expect(supportsPromptCacheBreakpoint({ providerId: 'openai', modelId: 'gpt-6' })).toBe(true);
  });

  it('returns true for GPT-5.6+ routed through SAP AI Core', () => {
    expect(supportsPromptCacheBreakpoint({ providerId: 'sap-ai-core', modelId: 'gpt-5.6' })).toBe(
      true
    );
  });

  it('returns false for older GPT models', () => {
    expect(supportsPromptCacheBreakpoint({ providerId: 'openai', modelId: 'gpt-4o' })).toBe(false);
    expect(supportsPromptCacheBreakpoint({ providerId: 'openai', modelId: 'gpt-5.4' })).toBe(false);
  });

  it('returns false for ChatGPT subscription accounts', () => {
    expect(
      supportsPromptCacheBreakpoint({
        providerId: 'openai',
        modelId: 'gpt-6',
        isChatGPTSubscription: true,
      })
    ).toBe(false);
  });

  it('returns false for unrelated providers', () => {
    expect(supportsPromptCacheBreakpoint({ providerId: 'anthropic', modelId: 'gpt-6' })).toBe(
      false
    );
  });
});

describe('isGpt5_6OrLater (opencode #47384, #47385)', () => {
  // Guards for the two Codex GPT-version bugs opencode fixed upstream:
  //   #47384: integer versions like "gpt-6" crashing the parser.
  //   #47385: comparing only by major would misclassify "gpt-5.4" as >= 5.6.
  it('accepts integer major versions without a minor', () => {
    expect(isGpt5_6OrLater('gpt-6')).toBe(true);
    expect(isGpt5_6OrLater('gpt-7')).toBe(true);
  });

  it('compares by (major, minor) tuple, not major alone', () => {
    expect(isGpt5_6OrLater('gpt-5.6')).toBe(true);
    expect(isGpt5_6OrLater('gpt-5.7')).toBe(true);
    expect(isGpt5_6OrLater('gpt-5.4')).toBe(false);
    // "gpt-5" alone parses as (5, 0) which is < (5, 6).
    expect(isGpt5_6OrLater('gpt-5')).toBe(false);
  });

  it('rejects older major versions regardless of minor', () => {
    expect(isGpt5_6OrLater('gpt-4.9')).toBe(false);
    expect(isGpt5_6OrLater('gpt-4o')).toBe(false);
    expect(isGpt5_6OrLater('gpt-3.5')).toBe(false);
  });

  it('returns false for unparseable ids', () => {
    expect(isGpt5_6OrLater('')).toBe(false);
    expect(isGpt5_6OrLater('claude-3-opus')).toBe(false);
    expect(isGpt5_6OrLater('gpt-')).toBe(false);
  });

  it('is case-insensitive on the "gpt-" prefix', () => {
    expect(isGpt5_6OrLater('GPT-6')).toBe(true);
    expect(isGpt5_6OrLater('Gpt-5.6')).toBe(true);
  });
});

describe('isChatGPTSubscription', () => {
  it('detects the oauth+chatgpt combination', () => {
    expect(isChatGPTSubscription({ type: 'oauth', source: 'chatgpt' })).toBe(true);
  });

  it('returns false for other auth combinations', () => {
    expect(isChatGPTSubscription({ type: 'apikey', source: 'chatgpt' })).toBe(false);
    expect(isChatGPTSubscription({ type: 'oauth', source: 'other' })).toBe(false);
    expect(isChatGPTSubscription({})).toBe(false);
  });
});

describe('applyCacheBreakpoint', () => {
  it('returns the prompt unchanged when there is no system/assistant message', () => {
    const prompt: LanguageModelV2Prompt = [{ role: 'user', content: 'hi' }];
    const result = applyCacheBreakpoint(prompt);
    expect(result).toEqual(prompt);
  });

  it('marks the last system message when it has no env block', () => {
    const prompt: LanguageModelV2Prompt = [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'hello' },
    ];
    const result = applyCacheBreakpoint(prompt);
    expect(result).toHaveLength(2);
    const marked = result[0] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    expect(marked.providerOptions?.openai?.cacheBreakpoint).toBe(true);
  });

  it('prefers a stable prefix boundary before a system message carrying an env block', () => {
    // Two system messages: the first is the stable soul + rules, the second
    // is the volatile env-details wrapper. Cache boundary must land on the
    // stable one so per-call env variation cannot poison the prefix.
    const prompt: LanguageModelV2Prompt = [
      { role: 'system', content: 'You are helpful.' },
      {
        role: 'system',
        content: '<environment_details>\n  workdir=/tmp/abc\n</environment_details>',
      },
      { role: 'user', content: 'hello' },
    ];
    const result = applyCacheBreakpoint(prompt);
    const first = result[0] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    const second = result[1] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    expect(first.providerOptions?.openai?.cacheBreakpoint).toBe(true);
    expect(second.providerOptions?.openai?.cacheBreakpoint).toBeUndefined();
  });

  it('handles env blocks with leading whitespace when picking the stable boundary', () => {
    // If content-detection did not trim, this block would slip through and
    // the second (volatile) message would be marked as cacheable.
    const prompt: LanguageModelV2Prompt = [
      { role: 'system', content: 'You are helpful.' },
      {
        role: 'system',
        content: '\n\n  <environment_details>\n  workdir=/tmp/abc\n</environment_details>',
      },
      { role: 'user', content: 'hello' },
    ];
    const result = applyCacheBreakpoint(prompt);
    const first = result[0] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    const second = result[1] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    expect(first.providerOptions?.openai?.cacheBreakpoint).toBe(true);
    expect(second.providerOptions?.openai?.cacheBreakpoint).toBeUndefined();
  });

  it('falls back to the last system/assistant message when every stable-role message carries an env block', () => {
    // Degenerate case: no clean stable prefix. Still mark something so the
    // caller gets partial caching rather than none.
    const prompt: LanguageModelV2Prompt = [
      {
        role: 'system',
        content: '<environment_details>\nrun-1\n</environment_details>',
      },
      { role: 'user', content: 'hello' },
    ];
    const result = applyCacheBreakpoint(prompt);
    const marked = result[0] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    expect(marked.providerOptions?.openai?.cacheBreakpoint).toBe(true);
  });

  it('marks the last assistant message when no clean system message is available', () => {
    const prompt: LanguageModelV2Prompt = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello!' },
      { role: 'user', content: 'follow up' },
    ];
    const result = applyCacheBreakpoint(prompt);
    const marked = result[1] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    expect(marked.providerOptions?.openai?.cacheBreakpoint).toBe(true);
  });

  it('preserves existing providerOptions on the marked message', () => {
    const prompt: LanguageModelV2Prompt = [
      {
        role: 'system',
        content: 'stable',
        providerOptions: {
          openai: { existingHint: 'x' },
          anthropic: { other: 'y' },
        },
      },
      { role: 'user', content: 'hello' },
    ];
    const result = applyCacheBreakpoint(prompt);
    const marked = result[0] as unknown as {
      providerOptions: {
        openai: { cacheBreakpoint?: boolean; existingHint?: string };
        anthropic: { other?: string };
      };
    };
    expect(marked.providerOptions.openai.cacheBreakpoint).toBe(true);
    expect(marked.providerOptions.openai.existingHint).toBe('x');
    expect(marked.providerOptions.anthropic.other).toBe('y');
  });

  it('handles content-as-parts array shape without misdetecting env blocks', () => {
    // Vercel AI SDK v2 also supports content as an array of parts. The
    // detection helper must handle that shape rather than treating the
    // whole array as opaque.
    const prompt: LanguageModelV2Prompt = [
      { role: 'system', content: [{ type: 'text', text: 'You are helpful.' }] },
      {
        role: 'system',
        content: [
          { type: 'text', text: '<environment_details>\nworkdir=/x\n</environment_details>' },
        ],
      },
      { role: 'user', content: 'hi' },
    ];
    const result = applyCacheBreakpoint(prompt);
    const first = result[0] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    const second = result[1] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    expect(first.providerOptions?.openai?.cacheBreakpoint).toBe(true);
    expect(second.providerOptions?.openai?.cacheBreakpoint).toBeUndefined();
  });
});
