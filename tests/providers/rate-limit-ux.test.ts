/**
 * Rate-limit UX tests (issue #1397).
 *
 * These tests verify the end-to-end user experience improvements layered
 * on top of the existing 429 detection:
 *
 *   1. `FreeTierRateLimitError` and `ProviderRateLimitError` expose a
 *      `suggestedAction` string that the CLI can render as a single-line
 *      actionable hint (upgrade link for free-tier, wait/switch/contact
 *      for paid-tier).
 *   2. The `retryAfter` value flows through from both integer-seconds and
 *      HTTP-date shapes of the `Retry-After` header into the error's
 *      `retryAfterSeconds` and folds into the human-readable message.
 *   3. Free-tier vs paid-tier produce visibly different UX: the free-tier
 *      variant is a permanent failure that names the model AND surfaces
 *      the upgrade path; the paid-tier variant is transient and lists
 *      wait / switch-model / upgrade as three concrete options.
 *   4. The orchestrator surfaces the classified error unchanged to the
 *      CLI (no folded-cause noise) AND logs the full details at debug
 *      level so operators running with `LOG_LEVEL=debug` still see the
 *      upstream payload.
 *
 * Coverage carry-forward from the 2026-07-28 research task (MEDIUM
 * priority UX improvement): users hitting free-tier quotas historically
 * saw a bare `HTTP 429` with no guidance. Every assertion below maps to
 * a bullet in the issue's "Acceptance criteria" section.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock providers + router at module top level so the vi.mock hoisting is
// unambiguous. The `CLI display via the orchestrator` block dynamically
// imports the orchestrator so it picks up these mocks in every test.
vi.mock('../../src/providers/index.js', () => {
  const getProviderForModel = vi.fn();
  return {
    getProviderForModel,
    getProviderForModelWithFallback: vi.fn((modelId: string) => ({
      provider: getProviderForModel(modelId),
      effectiveModelId: modelId,
      usedFallback: false,
    })),
    getDefaultModel: vi.fn(() => 'gpt-4o'),
    // Rate-limit-UX tests exercise the text `complete()` path; keep
    // image-generation dispatch off so mocked providers only need
    // `complete()`.
    modelHasCapability: vi.fn(() => false),
  };
});

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

import {
  FreeTierRateLimitError,
  ProviderRateLimitError,
  FREE_TIER_RATE_LIMIT_CODE,
  PROVIDER_RATE_LIMIT_CODE,
  SAP_AI_CORE_RATE_LIMIT_DOCS_URL,
  classifyRateLimitError,
  extractRetryAfterSeconds,
  parseRetryAfterHeader,
} from '../../src/providers/sapOrchestration.js';

describe('suggestedAction field (free-tier)', () => {
  it('populates suggestedAction with the upgrade link when the header was absent', () => {
    const err = new FreeTierRateLimitError('anthropic--claude-4.7-haiku-free');
    expect(typeof err.suggestedAction).toBe('string');
    expect(err.suggestedAction.length).toBeGreaterThan(0);
    // The free-tier action must point at the upgrade path — that is the
    // *only* real fix for a permanent free-tier quota exhaustion.
    expect(err.suggestedAction.toLowerCase()).toContain('upgrade');
    expect(err.suggestedAction).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
  });

  it('folds the retry-after wait into suggestedAction when known', () => {
    const err = new FreeTierRateLimitError('gpt-4o-free', undefined, 42);
    expect(err.suggestedAction).toContain('Wait 42s');
    expect(err.suggestedAction).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
  });

  it('omits a specific wait number when retry-after was absent', () => {
    const err = new FreeTierRateLimitError('gpt-4o-free');
    // Falls back to "Wait for the quota window to reset" — a generic
    // phrase, NOT a bogus number like "Wait 0s" or "Wait NaNs".
    expect(err.suggestedAction).not.toMatch(/Wait \d+s/);
    expect(err.suggestedAction.toLowerCase()).toContain('quota');
  });

  it('is a single line so the CLI can render it inline', () => {
    const err = new FreeTierRateLimitError('gpt-4o-free', undefined, 15);
    expect(err.suggestedAction).not.toContain('\n');
  });
});

describe('suggestedAction field (paid-tier)', () => {
  it('populates suggestedAction with wait + switch + quota-contact guidance', () => {
    const err = new ProviderRateLimitError('anthropic--claude-4.7-opus');
    expect(typeof err.suggestedAction).toBe('string');
    expect(err.suggestedAction.length).toBeGreaterThan(0);
    // The paid-tier action is different from the free-tier one: quota
    // increase is the correct primary escalation, NOT "upgrade to paid".
    expect(err.suggestedAction.toLowerCase()).toContain('quota');
    expect(err.suggestedAction.toLowerCase()).toContain('smaller model');
    expect(err.suggestedAction).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
  });

  it('folds the specific retry-after value into suggestedAction', () => {
    const err = new ProviderRateLimitError('gpt-4o', undefined, 15);
    expect(err.suggestedAction).toContain('Wait 15s');
  });

  it('uses a sensible default wait when retry-after is unknown', () => {
    const err = new ProviderRateLimitError('gpt-4o');
    expect(err.suggestedAction).toContain('Wait 60s');
  });

  it('is visibly different from the free-tier suggestedAction', () => {
    // Guards against future refactors accidentally collapsing the two
    // messages into one. The free-tier variant must NOT tell the user to
    // switch to a smaller model (they are already on the smallest / free
    // tier); the paid-tier variant must NOT tell the user to "upgrade to
    // a paid deployment" (they are already paid).
    const free = new FreeTierRateLimitError('gpt-4o-free').suggestedAction;
    const paid = new ProviderRateLimitError('gpt-4o-mini').suggestedAction;
    expect(free).not.toBe(paid);
    expect(free.toLowerCase()).not.toContain('smaller model');
    expect(paid.toLowerCase()).not.toContain('paid sap ai core deployment');
  });

  it('is a single line so the CLI can render it inline', () => {
    const err = new ProviderRateLimitError('gpt-4o', undefined, 5);
    expect(err.suggestedAction).not.toContain('\n');
  });
});

describe('retryAfter parsing (integer seconds)', () => {
  it('parses a plain integer Retry-After header', () => {
    expect(parseRetryAfterHeader('42')).toBe(42);
  });

  it('classifyRateLimitError populates retryAfterSeconds from the integer header', () => {
    const upstream = { status: 429, headers: { 'Retry-After': '42' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
    const wrapped = classified as FreeTierRateLimitError;
    expect(wrapped.retryAfterSeconds).toBe(42);
    expect(wrapped.message).toContain('Retry after 42 seconds');
  });

  it('classifyRateLimitError populates retryAfterSeconds for paid-tier', () => {
    const upstream = { status: 429, headers: { 'retry-after': '90' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    const wrapped = classified as ProviderRateLimitError;
    expect(wrapped.retryAfterSeconds).toBe(90);
    expect(wrapped.message).toContain('Wait 90 seconds');
  });
});

describe('retryAfter parsing (HTTP-date)', () => {
  it('parses a future HTTP-date into a positive delta', () => {
    const future = new Date(Date.now() + 25_000).toUTCString();
    const parsed = parseRetryAfterHeader(future);
    // Allow a small jitter window for test timing.
    expect(parsed).toBeGreaterThanOrEqual(23);
    expect(parsed).toBeLessThanOrEqual(26);
  });

  it('treats a past HTTP-date as retry-immediately (0 seconds)', () => {
    const past = new Date(Date.now() - 120_000).toUTCString();
    expect(parseRetryAfterHeader(past)).toBe(0);
  });

  it('flows an HTTP-date header through classifyRateLimitError to retryAfterSeconds', () => {
    const future = new Date(Date.now() + 20_000).toUTCString();
    const upstream = { status: 429, headers: { 'Retry-After': future } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
    const wrapped = classified as FreeTierRateLimitError;
    // HTTP-date has second-level precision + jitter.
    expect(wrapped.retryAfterSeconds).toBeGreaterThanOrEqual(18);
    expect(wrapped.retryAfterSeconds).toBeLessThanOrEqual(21);
  });

  it('returns undefined for garbage that is neither integer nor HTTP-date', () => {
    expect(parseRetryAfterHeader('not-a-date-or-number')).toBeUndefined();
    // A pre-parsed error with no header at all yields undefined.
    expect(extractRetryAfterSeconds({ status: 429 })).toBeUndefined();
  });
});

describe('free-tier vs paid-tier message differentiation', () => {
  it('free-tier message emphasises "upgrade" and never says "smaller model"', () => {
    const err = new FreeTierRateLimitError('anthropic--claude-4.7-haiku-free', undefined, 30);
    // Free-tier users cannot "switch to a smaller model" — they are
    // already on free. Any refactor that adds that phrase is a bug.
    expect(err.message.toLowerCase()).not.toContain('smaller model');
    expect(err.message.toLowerCase()).toContain('upgrade');
    expect(err.code).toBe(FREE_TIER_RATE_LIMIT_CODE);
  });

  it('paid-tier message mentions "smaller model" but not the free-tier docs framing', () => {
    const err = new ProviderRateLimitError('anthropic--claude-4.7-opus', undefined, 15);
    expect(err.message.toLowerCase()).toContain('smaller model');
    // Paid-tier is transient, so the message must NOT tell users this is
    // a free-tier quota (which would be misleading).
    expect(err.message.toLowerCase()).not.toContain('free-tier');
    expect(err.code).toBe(PROVIDER_RATE_LIMIT_CODE);
  });

  it('classifyRateLimitError routes free vs paid model ids to the right class', () => {
    const upstream: Error & { status?: number } = new Error('Too Many Requests');
    upstream.status = 429;
    const free = classifyRateLimitError(upstream, 'anthropic--claude-4.7-haiku-free');
    const paid = classifyRateLimitError(upstream, 'anthropic--claude-4.7-opus');
    expect(free).toBeInstanceOf(FreeTierRateLimitError);
    expect(paid).toBeInstanceOf(ProviderRateLimitError);
    expect(paid).not.toBeInstanceOf(FreeTierRateLimitError);
  });
});

describe('CLI display via the orchestrator', () => {
  // Providers + router mocks are declared at the top of this file so the
  // hoisted vi.mock() calls apply to the dynamic imports below. This
  // mirrors the pattern used by tests/core/orchestrator.error.test.ts.

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('surfaces the free-tier error verbatim (no stack-trace burial, no cause folding)', async () => {
    const { sendChat } = await import('../../src/core/orchestrator.js');
    const { getProviderForModel } = await import('../../src/providers/index.js');

    const upstream = new Error('HTTP 429 Too Many Requests');
    const err = new FreeTierRateLimitError('anthropic--claude-4.7-haiku-free', upstream, 30);
    const mockProvider = { complete: vi.fn().mockRejectedValue(err) };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    let caught: unknown;
    try {
      await sendChat('hi');
    } catch (thrown) {
      caught = thrown;
    }
    expect(caught).toBe(err);
    const msg = (caught as Error).message;
    // User-facing surface: model name, retry-after, upgrade link.
    expect(msg).toContain("'anthropic--claude-4.7-haiku-free'");
    expect(msg).toContain('Retry after 30 seconds');
    expect(msg).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
    // The raw upstream text must NOT be appended by cause-folding.
    expect(msg).not.toContain(': Error: HTTP 429 Too Many Requests');
    // suggestedAction is accessible on the thrown error for structured
    // CLI/telemetry consumers.
    expect((caught as FreeTierRateLimitError).suggestedAction).toContain(
      SAP_AI_CORE_RATE_LIMIT_DOCS_URL
    );
  });

  it('surfaces the paid-tier error verbatim with quota guidance', async () => {
    const { sendChat } = await import('../../src/core/orchestrator.js');
    const { getProviderForModel } = await import('../../src/providers/index.js');

    const upstream = new Error('Too Many Requests');
    const err = new ProviderRateLimitError('anthropic--claude-4.7-opus', upstream, 15);
    const mockProvider = { complete: vi.fn().mockRejectedValue(err) };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    let caught: unknown;
    try {
      await sendChat('hi');
    } catch (thrown) {
      caught = thrown;
    }
    expect(caught).toBe(err);
    const msg = (caught as Error).message;
    expect(msg).toContain('Rate limit reached');
    expect(msg).toContain("'anthropic--claude-4.7-opus'");
    expect(msg).toContain('Wait 15 seconds');
    expect(msg).toContain('smaller model');
    // Free-tier framing must NOT leak into the paid-tier message.
    expect(msg.toLowerCase()).not.toContain('free-tier');
    expect(msg).not.toContain(': Error: Too Many Requests');
    expect((caught as ProviderRateLimitError).suggestedAction).toContain(
      SAP_AI_CORE_RATE_LIMIT_DOCS_URL
    );
  });

  it('logs the full rate-limit error details at debug level (operator debugging)', async () => {
    const { sendChat } = await import('../../src/core/orchestrator.js');
    const { getProviderForModel } = await import('../../src/providers/index.js');
    const { logger } = await import('../../src/utils/logger.js');

    const debugSpy = vi.spyOn(logger, 'debug').mockImplementation(() => {});

    const upstream = new Error('HTTP 429 raw provider text');
    const err = new ProviderRateLimitError('anthropic--claude-4.7-opus', upstream, 12);
    const mockProvider = { complete: vi.fn().mockRejectedValue(err) };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);

    try {
      await sendChat('hi');
    } catch {
      // expected
    }

    expect(debugSpy).toHaveBeenCalled();
    const firstCall = debugSpy.mock.calls[0];
    expect(firstCall[0]).toMatch(/rate limit/i);
    const details = firstCall[1] as Record<string, unknown>;
    expect(details.name).toBe('ProviderRateLimitError');
    expect(details.code).toBe(PROVIDER_RATE_LIMIT_CODE);
    expect(details.model).toBe('anthropic--claude-4.7-opus');
    expect(details.retryAfterSeconds).toBe(12);
    expect(details.suggestedAction).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
    // The raw upstream cause is preserved in the debug payload so
    // operators can still see the vendor-specific error string.
    expect(details.cause).toBe(upstream);

    debugSpy.mockRestore();
  });
});
