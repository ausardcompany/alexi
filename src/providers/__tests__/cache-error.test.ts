/**
 * Tests for prompt-cache error recovery helpers (issue #1930).
 *
 * Covers:
 *   - `isCacheError` detection across keyword and HTTP-status paths.
 *   - `stripOpenAICacheBreakpoints` purity + removal correctness.
 *   - `stripAnthropicCacheControl` purity + removal across both marker
 *     positions (top-level + content block).
 *   - `withCacheFallback` success / cache-fallback / rethrow matrix.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  isCacheError,
  stripOpenAICacheBreakpoints,
  stripAnthropicCacheControl,
  withCacheFallback,
  type AnthropicMessage,
} from '../cache-error.js';
import type { LanguageModelV2Prompt } from '../openai/prompt-cache.js';

describe('isCacheError', () => {
  describe('null / undefined / shape guards', () => {
    it('returns false for null', () => {
      expect(isCacheError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isCacheError(undefined)).toBe(false);
    });

    it('returns false for a plain number', () => {
      expect(isCacheError(42)).toBe(false);
    });

    it('returns false for an empty string', () => {
      expect(isCacheError('')).toBe(false);
    });

    it('returns false for an object without a message', () => {
      expect(isCacheError({})).toBe(false);
    });
  });

  describe('cache keyword detection (message-only)', () => {
    const keywords = [
      'prompt_cache miss',
      'Prompt cache error occurred',
      'cache_control block invalid',
      'cache control invalid',
      'cache breakpoint rejected',
      'cache_breakpoint error',
      'cache miss on prefix',
      'cache evicted',
      'cache eviction',
      'invalid breakpoint position',
      'invalid_breakpoint shape',
      'invalid cache marker',
      'evicted from cache',
    ];

    for (const msg of keywords) {
      it(`returns true for message containing cache signal: ${JSON.stringify(msg)}`, () => {
        expect(isCacheError(new Error(msg))).toBe(true);
      });
    }

    it('is case-insensitive', () => {
      expect(isCacheError(new Error('PROMPT_CACHE eviction'))).toBe(true);
      expect(isCacheError(new Error('CACHE_CONTROL invalid'))).toBe(true);
    });

    it('matches on a bare string error', () => {
      expect(isCacheError('cache eviction on prefix')).toBe(true);
    });

    it('matches on an object with a message property', () => {
      expect(isCacheError({ message: 'prompt_cache invalid' })).toBe(true);
    });
  });

  describe('non-cache errors (negative cases)', () => {
    const nonCacheErrors = [
      'Authentication failed: invalid API key',
      'HTTP 401 Unauthorized',
      'HTTP 403 Forbidden',
      'HTTP 429 Too Many Requests',
      'rate limit exceeded',
      'Model not found: gpt-5.6',
      'ECONNRESET',
      'socket hang up',
      'request timed out',
      'Internal server error',
      'Validation failed: messages must not be empty',
    ];

    for (const msg of nonCacheErrors) {
      it(`returns false for ${JSON.stringify(msg)}`, () => {
        expect(isCacheError(new Error(msg))).toBe(false);
      });
    }

    it('returns false for 422 with no cache signal (generic validation)', () => {
      const err = Object.assign(new Error('Validation failed'), { status: 422 });
      expect(isCacheError(err)).toBe(false);
    });
  });

  describe('HTTP status + cache signal (status path)', () => {
    it('returns true for 422 WITH a cache keyword in the message', () => {
      const err = Object.assign(new Error('invalid breakpoint'), { status: 422 });
      expect(isCacheError(err)).toBe(true);
    });

    it('returns true for 422 WITH breakpoint keyword in the message', () => {
      const err = Object.assign(new Error('422: breakpoint shape mismatch'), {
        status: 422,
      });
      expect(isCacheError(err)).toBe(true);
    });

    it('reads status from response.status (fetch-wrapper style)', () => {
      const err = Object.assign(new Error('cache_control invalid'), {
        response: { status: 422 },
      });
      expect(isCacheError(err)).toBe(true);
    });

    it('does NOT treat 429 as cache error (only 422 is cache-specific)', () => {
      // 429 is a rate-limit; retrying without cache does not help it.
      // Only 422 (invalid breakpoint) is the cache-specific HTTP status.
      // Even a message mentioning a cache endpoint on a 429 must NOT
      // trigger cache fallback unless a CACHE_KEYWORD is present.
      const err = Object.assign(new Error('rate limit on cache endpoint'), { status: 429 });
      expect(isCacheError(err)).toBe(false);
      const plain429 = Object.assign(new Error('rate limit exceeded'), { status: 429 });
      expect(isCacheError(plain429)).toBe(false);
    });

    it('DOES treat 429 as cache error when a CACHE_KEYWORD is present', () => {
      // The keyword path is independent of status: if the message
      // explicitly says prompt_cache / cache_control / etc., the error
      // is cache-shaped regardless of status.
      const err = Object.assign(new Error('prompt_cache rate limit'), { status: 429 });
      expect(isCacheError(err)).toBe(true);
    });
  });
});

describe('stripOpenAICacheBreakpoints', () => {
  it('returns the input unchanged when no breakpoint is present', () => {
    const prompt: LanguageModelV2Prompt = [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hi' },
    ];
    const result = stripOpenAICacheBreakpoints(prompt);
    // Returned reference-equal when no change (optimisation).
    expect(result).toBe(prompt);
  });

  it('removes a cacheBreakpoint marker from a system message', () => {
    const prompt: LanguageModelV2Prompt = [
      {
        role: 'system',
        content: 'sys',
        providerOptions: { openai: { cacheBreakpoint: true } },
      },
      { role: 'user', content: 'hi' },
    ];
    const result = stripOpenAICacheBreakpoints(prompt);
    expect(result).not.toBe(prompt);
    expect(result).toHaveLength(2);
    const first = result[0] as {
      providerOptions?: { openai?: { cacheBreakpoint?: boolean } };
    };
    expect(first.providerOptions?.openai?.cacheBreakpoint).toBeUndefined();
    // Second message untouched.
    expect(result[1]).toBe(prompt[1]);
  });

  it('preserves other openai providerOptions fields', () => {
    const prompt: LanguageModelV2Prompt = [
      {
        role: 'system',
        content: 'sys',
        providerOptions: { openai: { cacheBreakpoint: true, parallelToolCalls: false } },
      },
    ];
    const result = stripOpenAICacheBreakpoints(prompt);
    const first = result[0] as unknown as {
      providerOptions: { openai: { cacheBreakpoint?: boolean; parallelToolCalls?: boolean } };
    };
    expect(first.providerOptions.openai.cacheBreakpoint).toBeUndefined();
    expect(first.providerOptions.openai.parallelToolCalls).toBe(false);
  });

  it('preserves other providerOptions namespaces', () => {
    const prompt: LanguageModelV2Prompt = [
      {
        role: 'system',
        content: 'sys',
        providerOptions: {
          openai: { cacheBreakpoint: true },
          anthropic: { thinking: { type: 'enabled' } },
        },
      },
    ];
    const result = stripOpenAICacheBreakpoints(prompt);
    const first = result[0] as {
      providerOptions: {
        openai?: Record<string, unknown>;
        anthropic?: Record<string, unknown>;
      };
    };
    expect(first.providerOptions.openai).toEqual({});
    expect(first.providerOptions.anthropic).toEqual({ thinking: { type: 'enabled' } });
  });

  it('does not mutate the input', () => {
    const target = {
      role: 'system' as const,
      content: 'sys',
      providerOptions: { openai: { cacheBreakpoint: true } },
    };
    const prompt: LanguageModelV2Prompt = [target];
    const snapshot = JSON.stringify(prompt);
    stripOpenAICacheBreakpoints(prompt);
    expect(JSON.stringify(prompt)).toBe(snapshot);
    expect(target.providerOptions.openai.cacheBreakpoint).toBe(true);
  });
});

describe('stripAnthropicCacheControl', () => {
  it('returns the input unchanged when no cache_control is present', () => {
    const messages: AnthropicMessage[] = [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hi' },
    ];
    const result = stripAnthropicCacheControl(messages);
    expect(result).toBe(messages);
  });

  it('removes top-level cache_control', () => {
    const messages: AnthropicMessage[] = [
      {
        role: 'system',
        content: 'sys',
        cache_control: { type: 'ephemeral' },
      },
    ];
    const result = stripAnthropicCacheControl(messages);
    expect(result).not.toBe(messages);
    expect(result[0].cache_control).toBeUndefined();
    expect(result[0].content).toBe('sys');
  });

  it('removes cache_control from content blocks', () => {
    const messages: AnthropicMessage[] = [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'static prefix', cache_control: { type: 'ephemeral' } },
          { type: 'text', text: 'dynamic suffix' },
        ],
      },
    ];
    const result = stripAnthropicCacheControl(messages);
    expect(result).not.toBe(messages);
    const blocks = result[0].content as Array<Record<string, unknown>>;
    expect(blocks).toHaveLength(2);
    expect(blocks[0].cache_control).toBeUndefined();
    expect(blocks[0].text).toBe('static prefix');
    // Second block untouched.
    expect(blocks[1]).toEqual({ type: 'text', text: 'dynamic suffix' });
  });

  it('removes BOTH top-level and content-block markers in one pass', () => {
    const messages: AnthropicMessage[] = [
      {
        role: 'user',
        cache_control: { type: 'ephemeral' },
        content: [{ type: 'text', text: 'x', cache_control: { type: 'ephemeral' } }],
      },
    ];
    const result = stripAnthropicCacheControl(messages);
    expect(result[0].cache_control).toBeUndefined();
    const blocks = result[0].content as Array<Record<string, unknown>>;
    expect(blocks[0].cache_control).toBeUndefined();
  });

  it('does not mutate the input', () => {
    const messages: AnthropicMessage[] = [
      {
        role: 'user',
        cache_control: { type: 'ephemeral' },
        content: [{ type: 'text', text: 'x', cache_control: { type: 'ephemeral' } }],
      },
    ];
    const snapshot = JSON.stringify(messages);
    stripAnthropicCacheControl(messages);
    expect(JSON.stringify(messages)).toBe(snapshot);
  });

  it('leaves string content as-is', () => {
    const messages: AnthropicMessage[] = [{ role: 'user', content: 'plain string' }];
    const result = stripAnthropicCacheControl(messages);
    expect(result[0].content).toBe('plain string');
  });
});

describe('withCacheFallback', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns the cached result on success without invoking uncached()', async () => {
    const cached = vi.fn().mockResolvedValue('cached-ok');
    const uncached = vi.fn().mockResolvedValue('uncached-ok');
    const result = await withCacheFallback({ cached, uncached });
    expect(result).toBe('cached-ok');
    expect(cached).toHaveBeenCalledTimes(1);
    expect(uncached).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('retries with uncached() on a cache-specific error', async () => {
    const cacheErr = new Error('prompt_cache evicted');
    const cached = vi.fn().mockRejectedValue(cacheErr);
    const uncached = vi.fn().mockResolvedValue('fallback-ok');
    const result = await withCacheFallback({ cached, uncached, label: 'test call' });
    expect(result).toBe('fallback-ok');
    expect(cached).toHaveBeenCalledTimes(1);
    expect(uncached).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const warnMsg = String(warnSpy.mock.calls[0][0]);
    expect(warnMsg).toContain('test call');
    expect(warnMsg).toContain('prompt_cache evicted');
  });

  it('rethrows non-cache errors without invoking uncached()', async () => {
    const authErr = new Error('HTTP 401 Unauthorized');
    const cached = vi.fn().mockRejectedValue(authErr);
    const uncached = vi.fn().mockResolvedValue('fallback-ok');
    await expect(withCacheFallback({ cached, uncached })).rejects.toThrow('HTTP 401');
    expect(uncached).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('rethrows the ORIGINAL cache error if uncached() also fails', async () => {
    const cacheErr = new Error('cache evicted');
    const fallbackErr = new Error('network down');
    const cached = vi.fn().mockRejectedValue(cacheErr);
    const uncached = vi.fn().mockRejectedValue(fallbackErr);
    await expect(withCacheFallback({ cached, uncached })).rejects.toBe(cacheErr);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    // Fallback error is attached as `cause` for diagnosability.
    expect((cacheErr as Error & { cause?: unknown }).cause).toBe(fallbackErr);
  });

  it('invokes onFallback after a successful fallback', async () => {
    const cacheErr = new Error('prompt cache evicted');
    const cached = vi.fn().mockRejectedValue(cacheErr);
    const uncached = vi.fn().mockResolvedValue('ok');
    const onFallback = vi.fn();
    const result = await withCacheFallback({ cached, uncached, onFallback });
    expect(result).toBe('ok');
    expect(onFallback).toHaveBeenCalledTimes(1);
  });

  it('does NOT invoke onFallback when the fallback fails', async () => {
    const cacheErr = new Error('cache_control invalid');
    const cached = vi.fn().mockRejectedValue(cacheErr);
    const uncached = vi.fn().mockRejectedValue(new Error('network down'));
    const onFallback = vi.fn();
    await expect(withCacheFallback({ cached, uncached, onFallback })).rejects.toBe(cacheErr);
    expect(onFallback).not.toHaveBeenCalled();
  });

  it('swallows errors thrown by onFallback (does not mask success)', async () => {
    const cacheErr = new Error('cache_control invalid');
    const cached = vi.fn().mockRejectedValue(cacheErr);
    const uncached = vi.fn().mockResolvedValue('ok');
    const onFallback = vi.fn(() => {
      throw new Error('counter metric failed');
    });
    const result = await withCacheFallback({ cached, uncached, onFallback });
    expect(result).toBe('ok');
    expect(onFallback).toHaveBeenCalledTimes(1);
  });
});
