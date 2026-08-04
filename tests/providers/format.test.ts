import { describe, it, expect } from 'vitest';
import {
  formatProviderError,
  classifyProviderError,
  verdictFromSignals,
} from '../../src/providers/format.js';

// Minimal AI SDK error stand-ins. The `ai` package is not a direct
// dependency of this project, but its error classes are identified by
// stable `name` tags (`AI_APICallError`, `AI_RetryError`, ...) and a
// static `isInstance` guard. We reproduce that contract here so the
// pre-pass can be exercised without pulling in the real dependency.
class FakeAPICallError extends Error {
  statusCode?: number;
  responseBody?: unknown;
  static isInstance(v: unknown): boolean {
    return v instanceof Error && v.name === 'AI_APICallError';
  }
  constructor(message: string, opts: { statusCode?: number; responseBody?: unknown } = {}) {
    super(message);
    this.name = 'AI_APICallError';
    this.statusCode = opts.statusCode;
    this.responseBody = opts.responseBody;
  }
}

class FakeRetryError extends Error {
  lastError?: unknown;
  errors?: unknown[];
  static isInstance(v: unknown): boolean {
    return v instanceof Error && v.name === 'AI_RetryError';
  }
  constructor(message: string, opts: { lastError?: unknown; errors?: unknown[] } = {}) {
    super(message);
    this.name = 'AI_RetryError';
    this.lastError = opts.lastError;
    this.errors = opts.errors;
  }
}

class FakeTypeValidationError extends Error {
  value?: unknown;
  static isInstance(v: unknown): boolean {
    return v instanceof Error && v.name === 'AI_TypeValidationError';
  }
  constructor(message: string, opts: { value?: unknown } = {}) {
    super(message);
    this.name = 'AI_TypeValidationError';
    this.value = opts.value;
  }
}

class FakeAISDKError extends Error {
  static isInstance(v: unknown): boolean {
    return v instanceof Error && v.name === 'AI_AISDKError';
  }
  constructor(message: string, opts: { cause?: unknown } = {}) {
    super(message);
    this.name = 'AI_AISDKError';
    if (opts.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = opts.cause;
    }
  }
}

describe('formatProviderError', () => {
  it('formats the undici fetch failed / SocketError reference case', () => {
    // Reproduce the undici shape:
    //   TypeError: fetch failed
    //     [cause]: SocketError { message: 'other side closed', code: 'UND_ERR_SOCKET' }
    const cause: Error & { code?: string } = new Error('other side closed');
    cause.name = 'SocketError';
    cause.code = 'UND_ERR_SOCKET';

    const outer = new TypeError('fetch failed');
    (outer as Error & { cause?: unknown }).cause = cause;

    expect(formatProviderError(outer)).toBe(
      'fetch failed: SocketError: other side closed (UND_ERR_SOCKET)'
    );
  });

  it('returns message unchanged for a plain Error with no cause', () => {
    expect(formatProviderError(new Error('boom'))).toBe('boom');
  });

  it('coerces non-Error input via String()', () => {
    expect(formatProviderError(42)).toBe('42');
  });

  it('caps recursion at depth 2 and does not walk cause.cause', () => {
    // Build a 3-level chain: outer -> middle -> inner
    const inner: Error & { code?: string } = new Error('inner message');
    inner.name = 'InnerError';
    inner.code = 'INNER_CODE';

    const middle: Error & { cause?: unknown; code?: string } = new Error('middle message');
    middle.name = 'MiddleError';
    middle.code = 'MIDDLE_CODE';
    middle.cause = inner;

    const outer = new Error('outer message');
    (outer as Error & { cause?: unknown }).cause = middle;

    const formatted = formatProviderError(outer);

    // First two levels are folded in.
    expect(formatted).toBe('outer message: MiddleError: middle message (MIDDLE_CODE)');
    // Third level (cause.cause) is NOT included.
    expect(formatted).not.toContain('InnerError');
    expect(formatted).not.toContain('inner message');
    expect(formatted).not.toContain('INNER_CODE');
  });

  it('omits the code suffix when cause has no code', () => {
    const cause = new Error('some reason');
    cause.name = 'GenericError';
    const outer = new Error('wrapper');
    (outer as Error & { cause?: unknown }).cause = cause;

    expect(formatProviderError(outer)).toBe('wrapper: GenericError: some reason');
  });

  it('ignores non-error-shaped cause values', () => {
    const outer = new Error('wrapper');
    (outer as Error & { cause?: unknown }).cause = 'a plain string';

    expect(formatProviderError(outer)).toBe('wrapper');
  });
});

describe('classifyProviderError', () => {
  it('returns context_overflow for message: "context window exceeded"', () => {
    expect(classifyProviderError(new Error('context window exceeded'))).toBe('context_overflow');
  });

  it('matches common overflow phrasings from provider bodies', () => {
    expect(classifyProviderError(new Error('context_length_exceeded'))).toBe('context_overflow');
    expect(
      classifyProviderError(new Error("this model's maximum context length is 8192 tokens"))
    ).toBe('context_overflow');
    expect(classifyProviderError(new Error('prompt too long for this deployment'))).toBe(
      'context_overflow'
    );
    expect(classifyProviderError(new Error('input too long: 300000 tokens'))).toBe(
      'context_overflow'
    );
  });

  it('returns rate_limit for statusCode 429 (with veto over context_overflow)', () => {
    const err = new Error('too many requests');
    (err as Error & { statusCode?: number }).statusCode = 429;
    expect(classifyProviderError(err)).toBe('rate_limit');
  });

  it('vetoes context_overflow when a 429 is present, even if body mentions context', () => {
    // Real-world: 429 body sometimes carries "context length exceeded" as
    // the reason for the throttle. The correct recovery is backoff, not
    // compaction, so rate_limit must win.
    const err = new Error('rate limit exceeded: context length exceeded');
    (err as Error & { statusCode?: number }).statusCode = 429;
    expect(classifyProviderError(err)).toBe('rate_limit');
  });

  it('detects rate_limit from message alone (no status code)', () => {
    expect(classifyProviderError(new Error('rate limit hit, retry in 5s'))).toBe('rate_limit');
  });

  it('returns auth for statusCode 401 and 403', () => {
    const e401 = new Error('unauthorized');
    (e401 as Error & { statusCode?: number }).statusCode = 401;
    expect(classifyProviderError(e401)).toBe('auth');

    const e403 = new Error('forbidden');
    (e403 as Error & { statusCode?: number }).statusCode = 403;
    expect(classifyProviderError(e403)).toBe('auth');
  });

  it('returns validation for statusCode 400 and 422 without overflow markers', () => {
    const e400 = new Error('bad request');
    (e400 as Error & { statusCode?: number }).statusCode = 400;
    expect(classifyProviderError(e400)).toBe('validation');

    const e422 = new Error('unprocessable entity');
    (e422 as Error & { statusCode?: number }).statusCode = 422;
    expect(classifyProviderError(e422)).toBe('validation');
  });

  it('prefers context_overflow over validation when 400 body indicates overflow', () => {
    // Some SAP AI Core deployments map overflow to HTTP 400. The overflow
    // path is recoverable via compaction; do not lose it.
    const err = new Error('bad request');
    (err as Error & { statusCode?: number; responseBody?: string }).statusCode = 400;
    (err as Error & { responseBody?: string }).responseBody = '{"error":"context window exceeded"}';
    expect(classifyProviderError(err)).toBe('context_overflow');
  });

  it('returns undefined for unclassified errors', () => {
    expect(classifyProviderError(new Error('boom'))).toBeUndefined();
    expect(classifyProviderError(new Error('fetch failed'))).toBeUndefined();
    expect(classifyProviderError(null)).toBeUndefined();
    expect(classifyProviderError(undefined)).toBeUndefined();
  });

  it('walks cause chains up to 2 levels deep', () => {
    // Level 2: cause carries the overflow message.
    const inner = new Error('context window exceeded');
    const outer = new Error('provider request failed');
    (outer as Error & { cause?: unknown }).cause = inner;
    expect(classifyProviderError(outer)).toBe('context_overflow');

    // Level 3: cause.cause carries the overflow message but is BEYOND
    // the depth cap. Still detected because collectMessages walks 0/1/2.
    const deep = new Error('bottom');
    const mid = new Error('middle');
    (mid as Error & { cause?: unknown }).cause = deep;
    const top = new Error('top');
    (top as Error & { cause?: unknown }).cause = mid;
    // top -> mid -> deep, three levels; the "deep" message has no overflow
    // marker so this stays undefined.
    expect(classifyProviderError(top)).toBeUndefined();

    // Same 3-level chain but the overflow marker is at level 2 (mid), so
    // it IS detected.
    const midOverflow = new Error('context_length_exceeded');
    const top2 = new Error('top');
    (top2 as Error & { cause?: unknown }).cause = midOverflow;
    expect(classifyProviderError(top2)).toBe('context_overflow');
  });

  it('extracts status from response.status when top-level status is absent', () => {
    const err = new Error('nested response');
    (err as Error & { response?: { status?: number } }).response = { status: 401 };
    expect(classifyProviderError(err)).toBe('auth');
  });

  it('does not blow up on self-referential cause chains', () => {
    const err = new Error('loop');
    (err as Error & { cause?: unknown }).cause = err;
    expect(classifyProviderError(err)).toBeUndefined();
  });
});

describe('verdictFromSignals', () => {
  it('returns rate_limit for statusCode 429', () => {
    expect(verdictFromSignals({ message: 'throttled', statusCode: 429 })).toBe('rate_limit');
  });

  it('returns rate_limit when message mentions rate limit', () => {
    expect(verdictFromSignals({ message: 'rate limit hit' })).toBe('rate_limit');
  });

  it('vetoes context_overflow when statusCode is 429 even if body mentions context', () => {
    expect(
      verdictFromSignals({
        message: 'context window exceeded',
        statusCode: 429,
      })
    ).toBe('rate_limit');
  });

  it('returns auth for 401 and 403', () => {
    expect(verdictFromSignals({ message: 'nope', statusCode: 401 })).toBe('auth');
    expect(verdictFromSignals({ message: 'nope', statusCode: 403 })).toBe('auth');
  });

  it('returns validation for 400/422 with no overflow markers', () => {
    expect(verdictFromSignals({ message: 'bad request', statusCode: 400 })).toBe('validation');
    expect(verdictFromSignals({ message: 'unprocessable', statusCode: 422 })).toBe('validation');
  });

  it('prefers context_overflow over validation on 400 with overflow marker in message', () => {
    expect(
      verdictFromSignals({
        message: 'context window exceeded',
        statusCode: 400,
      })
    ).toBe('context_overflow');
  });

  it('finds overflow markers inside a string responseBody on 400', () => {
    expect(
      verdictFromSignals({
        message: 'bad request',
        statusCode: 400,
        responseBody: '{"error":"context_length_exceeded"}',
      })
    ).toBe('context_overflow');
  });

  it('finds overflow markers inside an object responseBody on 400', () => {
    expect(
      verdictFromSignals({
        message: 'bad request',
        statusCode: 400,
        responseBody: { error: 'context window exceeded' },
      })
    ).toBe('context_overflow');
  });

  it('finds overflow markers inside a data payload', () => {
    expect(
      verdictFromSignals({
        message: 'validation failed',
        data: { detail: 'prompt too long for model' },
      })
    ).toBe('context_overflow');
  });

  it('returns context_overflow purely from message when no status is set', () => {
    expect(verdictFromSignals({ message: 'context_length_exceeded' })).toBe('context_overflow');
  });

  it('returns undefined for unclassifiable signals', () => {
    expect(verdictFromSignals({ message: 'random failure' })).toBeUndefined();
    expect(verdictFromSignals({ message: '' })).toBeUndefined();
  });

  it('does not blow up on a non-serializable responseBody', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    // Should not throw even though JSON.stringify(circular) throws.
    expect(() =>
      verdictFromSignals({
        message: 'bad request',
        statusCode: 400,
        responseBody: circular,
      })
    ).not.toThrow();
  });
});

describe('classifyProviderError - typed AI SDK pre-pass', () => {
  it('APICallError.statusCode 429 yields rate_limit', () => {
    const err = new FakeAPICallError('too many requests', { statusCode: 429 });
    expect(classifyProviderError(err)).toBe('rate_limit');
  });

  it('APICallError.statusCode 401 yields auth', () => {
    const err = new FakeAPICallError('unauthorized', { statusCode: 401 });
    expect(classifyProviderError(err)).toBe('auth');
  });

  it('APICallError.statusCode 400 with overflow marker in responseBody yields context_overflow', () => {
    const err = new FakeAPICallError('bad request', {
      statusCode: 400,
      responseBody: { error: 'context window exceeded' },
    });
    expect(classifyProviderError(err)).toBe('context_overflow');
  });

  it('APICallError.statusCode 400 without overflow marker yields validation', () => {
    const err = new FakeAPICallError('bad request', { statusCode: 400 });
    expect(classifyProviderError(err)).toBe('validation');
  });

  it('APICallError.statusCode is authoritative over surrounding shape', () => {
    // Even if a stale response.status hangs off the error, we must use
    // the typed statusCode (401), not the structural fallback (500).
    const err = new FakeAPICallError('unauthorized', { statusCode: 401 });
    (err as unknown as { response?: { status?: number } }).response = { status: 500 };
    expect(classifyProviderError(err)).toBe('auth');
  });

  it('RetryError unwraps to lastError and classifies from it', () => {
    const inner = new FakeAPICallError('rate limited', { statusCode: 429 });
    const retry = new FakeRetryError('retries exhausted', { lastError: inner });
    expect(classifyProviderError(retry)).toBe('rate_limit');
  });

  it('RetryError falls back to lastAttempt when lastError is missing', () => {
    const inner = new FakeAPICallError('unauth', { statusCode: 401 });
    const retry = new FakeRetryError('retries exhausted');
    (retry as unknown as { lastAttempt?: unknown }).lastAttempt = inner;
    expect(classifyProviderError(retry)).toBe('auth');
  });

  it('RetryError falls back to last entry of errors[] when neither lastError nor lastAttempt is set', () => {
    const first = new Error('transient blip');
    const last = new FakeAPICallError('server error', { statusCode: 400 });
    const retry = new FakeRetryError('retries exhausted', { errors: [first, last] });
    expect(classifyProviderError(retry)).toBe('validation');
  });

  it('TypeValidationError extracts value into overflow detection', () => {
    const err = new FakeTypeValidationError('type mismatch', {
      value: { error: 'context window exceeded' },
    });
    expect(classifyProviderError(err)).toBe('context_overflow');
  });

  it('TypeValidationError defaults to validation when payload does not indicate overflow', () => {
    const err = new FakeTypeValidationError('type mismatch', { value: { field: 'foo' } });
    expect(classifyProviderError(err)).toBe('validation');
  });

  it('AISDKError recurses into cause', () => {
    const inner = new FakeAPICallError('rate limited', { statusCode: 429 });
    const wrapper = new FakeAISDKError('wrapped', { cause: inner });
    expect(classifyProviderError(wrapper)).toBe('rate_limit');
  });

  it('AISDKError with plain-Error cause carrying overflow marker classifies as context_overflow', () => {
    const inner = new Error('context_length_exceeded');
    const wrapper = new FakeAISDKError('wrapped', { cause: inner });
    expect(classifyProviderError(wrapper)).toBe('context_overflow');
  });

  it('Nested RetryError->APICallError chain still resolves', () => {
    const call = new FakeAPICallError('unauth', { statusCode: 403 });
    const retry = new FakeRetryError('retries exhausted', { lastError: call });
    const outer = new FakeAISDKError('outer', { cause: retry });
    expect(classifyProviderError(outer)).toBe('auth');
  });

  it('Falls back to structural walk when RetryError has no inner failure', () => {
    // No lastError / lastAttempt / errors[] — must not crash and should
    // consult the outer message via the structural path.
    const retry = new FakeRetryError('rate limit exceeded');
    expect(classifyProviderError(retry)).toBe('rate_limit');
  });

  it('Recognises AI SDK errors by name tag even without isInstance on constructor', () => {
    // Plain object with only the AI SDK name tag (e.g. serialised over
    // an IPC boundary that dropped the class).
    const obj = { name: 'AI_APICallError', message: 'unauth', statusCode: 401 };
    expect(classifyProviderError(obj)).toBe('auth');
  });

  it('Depth-caps deeply nested AISDKError->AISDKError chains without infinite loop', () => {
    // Build a 5-deep AISDKError chain. Should not blow the stack; the
    // internal depth cap (3) means the innermost overflow marker is not
    // required to be detected — we only assert termination.
    let inner: unknown = new Error('deep bottom');
    for (let i = 0; i < 5; i += 1) {
      inner = new FakeAISDKError(`wrap-${i}`, { cause: inner });
    }
    expect(() => classifyProviderError(inner)).not.toThrow();
  });
});

describe('classifyProviderError - edge cases (issue #1272)', () => {
  // Case 1: Plain Error (no AI SDK tag) must fall back to the structural
  // walk — the typed pre-pass is skipped entirely and the message + status
  // are consulted directly.
  it('plain Error (no AI SDK tag) falls back to the structural walk', () => {
    // Overflow marker present → structural walk detects it.
    const overflow = new Error('context_length_exceeded');
    expect(classifyProviderError(overflow)).toBe('context_overflow');

    // Auth status → structural walk detects via statusCode.
    const auth = new Error('nope');
    (auth as Error & { statusCode?: number }).statusCode = 401;
    expect(classifyProviderError(auth)).toBe('auth');

    // No overflow marker, no status → unclassified.
    const noise = new Error('some completely unrelated failure');
    expect(classifyProviderError(noise)).toBeUndefined();
  });

  // Case 2: Depth cap. Beyond depth 3, recursion terminates and returns
  // undefined for the wrapper — but the wrapper's own signals may still
  // classify via the structural fallback. We assert BOTH that a deeper
  // chain is safely capped AND that the outer classification is
  // deterministic (never blows up).
  it('depth limit (>3) prevents infinite recursion in pathological chains', () => {
    // Build a 10-deep RetryError-of-RetryError chain terminating in an
    // APICallError with an auth status. Depth 3 is exceeded before we
    // reach the terminal APICallError, so the auth verdict is NOT
    // propagated. The classification returns undefined via the structural
    // walk of the outermost wrapper (which has no message match).
    const bottom = new FakeAPICallError('unauth', { statusCode: 401 });
    let chain: unknown = bottom;
    for (let i = 0; i < 10; i += 1) {
      chain = new FakeRetryError(`retry-${i}`, { lastError: chain });
    }
    // Whatever the exact verdict, the call must terminate deterministically
    // and not throw or hang.
    expect(() => classifyProviderError(chain)).not.toThrow();
    // The outer message contains no rate-limit / overflow markers, so the
    // structural walk of what the depth cap surfaces returns undefined.
    // We do NOT assert 'auth' — the cap is intentional: pathological
    // chains should not be able to force deep classification work.
    expect(classifyProviderError(chain)).toBeUndefined();
  });

  // Case 3: Mixed scenario. A RetryError wraps an APICallError; the typed
  // statusCode on the APICallError must win, even if the RetryError's
  // message text hints at a different classification.
  it('RetryError wrapping APICallError uses inner statusCode as authoritative', () => {
    // RetryError message says "rate limit" but the terminal APICallError
    // has statusCode 401 — the terminal attempt is what actually failed
    // the retry loop, so auth must win.
    const call = new FakeAPICallError('unauthorized', { statusCode: 401 });
    const retry = new FakeRetryError('rate limit exceeded after retries', {
      lastError: call,
    });
    expect(classifyProviderError(retry)).toBe('auth');

    // Same shape, inverted: RetryError message is generic, terminal has
    // 429 — the typed statusCode must be used.
    const call429 = new FakeAPICallError('unhelpful', { statusCode: 429 });
    const retry2 = new FakeRetryError('retries exhausted', { lastError: call429 });
    expect(classifyProviderError(retry2)).toBe('rate_limit');
  });

  // Case 4: AI SDK error whose constructor lacks isInstance() (e.g.
  // hand-serialized over IPC that dropped the class prototype). The
  // classifier must still match on the name tag alone.
  it('AI SDK error without isInstance() method still matches via name tag', () => {
    // A plain object literal with only the AI SDK name tag. No prototype,
    // no isInstance, no Error class — just structural shape.
    const bare = {
      name: 'AI_APICallError',
      message: 'unauthorized',
      statusCode: 403,
    };
    expect(classifyProviderError(bare)).toBe('auth');

    // Same for RetryError shape — must unwrap lastError even without the
    // class guard.
    const bareRetry = {
      name: 'AI_RetryError',
      message: 'retries exhausted',
      lastError: {
        name: 'AI_APICallError',
        message: 'context window exceeded',
        statusCode: 400,
      },
    };
    expect(classifyProviderError(bareRetry)).toBe('context_overflow');
  });

  // Case 5: Gateway-forwarded plain JSON error (no AI SDK shape). Some
  // proxies flatten the AI SDK error into a plain object with only the
  // provider's JSON body. The structural walk must handle this.
  it('gateway-forwarded plain JSON error (no AI SDK shape) uses structural walk', () => {
    // Simulate a gateway that received an AI SDK error, unwrapped it, and
    // forwarded the provider's JSON body without preserving the name tag.
    const gatewayForwarded = {
      // No `name: 'AI_APICallError'` — the AI SDK shape was dropped.
      message: 'Bad Request',
      status: 400,
      responseBody: {
        error: {
          code: 'context_length_exceeded',
          message: 'This model has a maximum context length of 8192 tokens',
        },
      },
    };
    // The typed pre-pass is skipped (no AI SDK tag). The structural walk
    // examines statusCode + responseBody and detects the overflow marker.
    expect(classifyProviderError(gatewayForwarded)).toBe('context_overflow');

    // Gateway-forwarded auth error: only status + generic message.
    const authGateway = {
      message: 'Authentication failed',
      status: 401,
    };
    expect(classifyProviderError(authGateway)).toBe('auth');

    // Gateway-forwarded 429 with a message that mentions context: still
    // rate_limit (veto rule applies in structural path too).
    const rateGateway = {
      message: 'rate limit exceeded due to context length',
      status: 429,
    };
    expect(classifyProviderError(rateGateway)).toBe('rate_limit');
  });

  // Case 6: Error with both typed statusCode AND response.status. The
  // typed field must win — response.status may be stale from an earlier
  // attempt or synthesized by a wrapper.
  it('error with both typed statusCode and response.status uses typed field', () => {
    // APICallError with typed statusCode=401 and a stale response.status=500.
    const err = new FakeAPICallError('unauthorized', { statusCode: 401 });
    (err as unknown as { response?: { status?: number } }).response = { status: 500 };
    // Typed path wins — auth, not undefined-from-500.
    expect(classifyProviderError(err)).toBe('auth');

    // Reverse: typed statusCode=429 (rate limit) vs stale response.status=200.
    const err2 = new FakeAPICallError('throttled', { statusCode: 429 });
    (err2 as unknown as { response?: { status?: number } }).response = { status: 200 };
    expect(classifyProviderError(err2)).toBe('rate_limit');

    // Typed error with no statusCode and a response.status: falls back
    // to structural, which reads response.status (this is the ONLY case
    // where response.status is authoritative — when the typed path
    // yielded no status).
    const err3 = new FakeAPICallError('bad request');
    (err3 as unknown as { response?: { status?: number } }).response = { status: 400 };
    // Typed pre-pass hits APICallError but statusCode is undefined, so
    // verdictFromSignals sees no status and no overflow → undefined.
    // NOTE: this documents the current contract — APICallError with no
    // statusCode does NOT fall through to the structural extractor. If
    // that changes, this test will need to be updated.
    expect(classifyProviderError(err3)).toBeUndefined();
  });

  // Case 7: Unclassified error with no matching patterns returns
  // undefined — the classifier is conservative and does NOT default to
  // any bucket.
  it('unclassified error (no matching patterns) returns undefined', () => {
    // Empty error object.
    expect(classifyProviderError({})).toBeUndefined();

    // Non-standard status codes not in any bucket.
    const err418 = new Error("I'm a teapot");
    (err418 as Error & { statusCode?: number }).statusCode = 418;
    expect(classifyProviderError(err418)).toBeUndefined();

    // AI SDK error with an unknown status and no overflow markers.
    const err = new FakeAPICallError('mystery failure', { statusCode: 504 });
    expect(classifyProviderError(err)).toBeUndefined();

    // Non-error primitives.
    expect(classifyProviderError('a string')).toBeUndefined();
    expect(classifyProviderError(42)).toBeUndefined();
    expect(classifyProviderError(false)).toBeUndefined();
    expect(classifyProviderError([])).toBeUndefined();
  });

  // Bonus edge case: an AI SDK error whose only signal lives on the
  // `data` field (some SDK versions use `data` instead of `value` for
  // typed payloads). The signalsFromAiSdkError helper prefers `value`
  // but falls back to `data`.
  it('AI SDK error with data (not value) payload still routes through overflow detection', () => {
    const err = new FakeAPICallError('bad payload', {
      statusCode: 400,
    });
    (err as unknown as { data?: unknown }).data = {
      code: 'context_length_exceeded',
    };
    expect(classifyProviderError(err)).toBe('context_overflow');
  });

  // Bonus edge case: verify verdictFromSignals precedence when multiple
  // signals compete (documents the priority order explicitly).
  it('verdictFromSignals priority: rate_limit > auth > validation > context_overflow', () => {
    // 429 + auth message → rate_limit wins.
    expect(
      verdictFromSignals({
        message: 'unauthorized rate limited',
        statusCode: 429,
      })
    ).toBe('rate_limit');

    // 401 + overflow message → auth wins (no overflow override on 401).
    expect(
      verdictFromSignals({
        message: 'context window exceeded but also unauthorized',
        statusCode: 401,
      })
    ).toBe('auth');

    // 400 + overflow message → context_overflow wins (the ONE case
    // where validation defers to overflow).
    expect(
      verdictFromSignals({
        message: 'context window exceeded',
        statusCode: 400,
      })
    ).toBe('context_overflow');
  });
});
