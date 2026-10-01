/**
 * Issue #1903 regression tests: `sendChat()` must treat a
 * `finishReason === 'content-filter'` provider response as a PERMANENT
 * failure.
 *
 * Contract exercised here:
 *  - Content-filter responses raise a dedicated `ContentFilterError`
 *    (not a generic Error) carrying the `content_filter` machine code.
 *  - The provider's `complete()` is invoked exactly once — no retry
 *    loop can see the same prompt again.
 *  - The error message names the content policy block in user-facing
 *    language, so the CLI/TUI does not render a generic failure.
 *  - A telemetry event (`provider.content_filter`) is fired with the
 *    model id so operators can trace filter occurrences.
 *  - `ErrorBackoff.isFatal(err)` returns `true` for the thrown error,
 *    short-circuiting any outer retry budget.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock providers module BEFORE importing the module under test.
vi.mock('../../src/providers/index.js', () => {
  const getProviderForModel = vi.fn();
  return {
    getProviderForModel,
    getProviderForModelWithFallback: vi.fn((modelId: string) => ({
      provider: getProviderForModel(modelId),
      effectiveModelId: modelId,
      usedFallback: false,
    })),
    getDefaultModel: vi.fn(),
    modelHasCapability: vi.fn(() => false),
  };
});

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

import { sendChat } from '../../src/core/orchestrator.js';
import { getProviderForModel, getDefaultModel } from '../../src/providers/index.js';
import { recordRouteOutcome } from '../../src/core/router.js';
import {
  ContentFilterError,
  CONTENT_FILTER_ERROR_CODE,
  isContentFilterError,
} from '../../src/providers/sapOrchestration.js';
import {
  ErrorBackoff,
  isContentFilterError as isContentFilterErrorBackoff,
} from '../../src/core/error-backoff.js';
import { Telemetry } from '../../src/utils/telemetry.js';

describe('sendChat content-filter handling (issue #1903)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
    Telemetry.setEnabled(true);
    Telemetry.clear();
  });

  afterEach(() => {
    Telemetry.setEnabled(false);
    Telemetry.clear();
    vi.resetAllMocks();
  });

  it('throws ContentFilterError when the provider reports finishReason=content-filter', async () => {
    const mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: '',
        finishReason: 'content-filter',
        usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 },
      }),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    await expect(sendChat('disallowed prompt')).rejects.toBeInstanceOf(ContentFilterError);
  });

  it('does NOT retry — provider.complete is called exactly once', async () => {
    const mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: '',
        finishReason: 'content-filter',
        usage: { prompt_tokens: 5, completion_tokens: 0, total_tokens: 5 },
      }),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    await expect(sendChat('nope')).rejects.toBeInstanceOf(ContentFilterError);
    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
  });

  it('surfaces a user-friendly policy-rejection message, not a generic error', async () => {
    const mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: '',
        finishReason: 'content-filter',
        usage: { prompt_tokens: 7, completion_tokens: 0, total_tokens: 7 },
      }),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    let caught: unknown;
    try {
      await sendChat('bad prompt');
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(ContentFilterError);
    const err = caught as ContentFilterError;
    expect(err.name).toBe('ContentFilterError');
    expect(err.code).toBe(CONTENT_FILTER_ERROR_CODE);
    expect(err.modelName).toBe('gpt-4o');
    // The user-facing message explicitly names the policy block so the
    // CLI/TUI never shows a generic "unknown error".
    expect(err.message.toLowerCase()).toContain('content policy');
    expect(err.message.toLowerCase()).toContain('permanent');
    expect(err.message.toLowerCase()).toContain('retry');
    expect(err.suggestedAction.toLowerCase()).toContain('rephrase');
  });

  it('fires a telemetry event capturing the model id and partial-text flag', async () => {
    const mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: 'partial text before filter',
        finishReason: 'content-filter',
        usage: { prompt_tokens: 11, completion_tokens: 4, total_tokens: 15 },
      }),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    await expect(sendChat('mixed prompt')).rejects.toBeInstanceOf(ContentFilterError);

    const events = Telemetry.getEvents();
    const filterEvents = events.filter((e) => e.event === 'provider.content_filter');
    expect(filterEvents.length).toBe(1);
    expect(filterEvents[0].properties?.model).toBe('gpt-4o');
    expect(filterEvents[0].properties?.hasPartialText).toBe(true);
    expect(filterEvents[0].properties?.promptTokens).toBe(11);
    expect(filterEvents[0].properties?.completionTokens).toBe(4);
  });

  it('does NOT record a route success for content-filter responses', async () => {
    const mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: '',
        finishReason: 'content-filter',
        usage: { prompt_tokens: 3, completion_tokens: 0, total_tokens: 3 },
      }),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    await expect(sendChat('nope')).rejects.toBeInstanceOf(ContentFilterError);

    // The route-success bookkeeping lives AFTER the content-filter check,
    // so a filtered response must not spuriously reset the route counter.
    expect(recordRouteOutcome).not.toHaveBeenCalledWith('gpt-4o', { kind: 'success' });
  });

  it('still returns successfully for a non-content-filter finish reason', async () => {
    const mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: 'all good',
        finishReason: 'stop',
        usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 },
      }),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    const result = await sendChat('hello');
    expect(result.text).toBe('all good');
  });
});

describe('ContentFilterError classification helpers', () => {
  it('isContentFilterError matches by code', () => {
    expect(isContentFilterError({ code: 'content_filter' })).toBe(true);
    expect(isContentFilterError({ code: 'other' })).toBe(false);
  });

  it('isContentFilterError matches by class name (cross-module safe)', () => {
    expect(isContentFilterError({ name: 'ContentFilterError' })).toBe(true);
    expect(isContentFilterError({ name: 'Error' })).toBe(false);
  });

  it('isContentFilterError rejects non-objects and nullish values', () => {
    expect(isContentFilterError(null)).toBe(false);
    expect(isContentFilterError(undefined)).toBe(false);
    expect(isContentFilterError('content_filter')).toBe(false);
    expect(isContentFilterError(42)).toBe(false);
  });

  it('error-backoff isContentFilterError matches an instance of ContentFilterError', () => {
    const err = new ContentFilterError('gpt-4o');
    expect(isContentFilterErrorBackoff(err)).toBe(true);
  });

  it('ErrorBackoff.isFatal returns true for ContentFilterError without prior recordError', () => {
    const b = new ErrorBackoff();
    const err = new ContentFilterError('gpt-4o');
    // Short-circuit path: `isFatal(err)` is true before any `recordError`
    // call so CLI renderers can decide synchronously.
    expect(b.isFatal(err)).toBe(true);
  });

  it('ErrorBackoff.recordError marks content-filter errors as fatal', () => {
    const b = new ErrorBackoff();
    expect(b.isFatal()).toBe(false);
    const err = new ContentFilterError('gpt-4o');
    b.recordError(undefined, err);
    expect(b.isFatal()).toBe(true);
  });

  it('ContentFilterError carries partial text when provided', () => {
    const err = new ContentFilterError('gpt-4o', 'partial response');
    const withPartial = err as ContentFilterError & { partialText?: string };
    expect(withPartial.partialText).toBe('partial response');
  });

  it('ContentFilterError omits partialText when the model produced none', () => {
    const err = new ContentFilterError('gpt-4o');
    const withPartial = err as ContentFilterError & { partialText?: string };
    expect(withPartial.partialText).toBeUndefined();
  });
});
