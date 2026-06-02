/**
 * Tests for `src/plugin/ruleCache.ts` (B004).
 *
 * Exercise the standalone cache module directly so we can assert the
 * key-shape contract independent of the rule-loader plumbing in
 * `src/plugin/index.ts`. End-to-end behaviour through `materializeCommandRule`
 * is covered separately in `tests/plugin/ruleCommand.test.ts`.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  alwaysCache,
  sessionCache,
  ruleCacheKey,
  getOrLoad,
  clearSession,
  clearAll,
} from '../../src/plugin/ruleCache.js';

describe('ruleCacheKey', () => {
  it('builds the canonical pluginId::ruleName shape', () => {
    expect(ruleCacheKey('pluginA', 'todos')).toBe('pluginA::todos');
  });

  it('does not collapse empty segments', () => {
    // Defensive: callers shouldn't pass empties, but the key shape must
    // remain unambiguous if they do.
    expect(ruleCacheKey('', 'r')).toBe('::r');
    expect(ruleCacheKey('p', '')).toBe('p::');
  });
});

describe('getOrLoad — scope: always', () => {
  beforeEach(() => clearAll());

  it('caches the loader result for the process lifetime', async () => {
    let calls = 0;
    const loader = async (): Promise<string> => {
      calls += 1;
      return `value-${calls}`;
    };

    const key = ruleCacheKey('p', 'r');
    const a = await getOrLoad('always', key, undefined, loader);
    const b = await getOrLoad('always', key, undefined, loader);

    expect(a).toBe('value-1');
    expect(b).toBe('value-1');
    expect(calls).toBe(1);
    expect(alwaysCache.get(key)).toBe('value-1');
  });

  it('ignores the sessionId for always-scoped lookups', async () => {
    let calls = 0;
    const loader = async (): Promise<string> => {
      calls += 1;
      return `v${calls}`;
    };

    const key = ruleCacheKey('p', 'r');
    const a = await getOrLoad('always', key, 'sess-A', loader);
    const b = await getOrLoad('always', key, 'sess-B', loader);

    // Same value across different session ids: always-cache is shared.
    expect(a).toBe(b);
    expect(calls).toBe(1);
  });

  it('does not cache loader rejections', async () => {
    let calls = 0;
    const loader = async (): Promise<string> => {
      calls += 1;
      if (calls === 1) {
        throw new Error('boom');
      }
      return 'ok';
    };

    const key = ruleCacheKey('p', 'r');
    await expect(getOrLoad('always', key, undefined, loader)).rejects.toThrow('boom');
    // Second call retries — error wasn't cached.
    const result = await getOrLoad('always', key, undefined, loader);
    expect(result).toBe('ok');
    expect(calls).toBe(2);
    expect(alwaysCache.get(key)).toBe('ok');
  });
});

describe('getOrLoad — scope: session', () => {
  beforeEach(() => clearAll());

  it('caches per-session and re-runs the loader for a new session', async () => {
    let calls = 0;
    const loader = async (): Promise<string> => {
      calls += 1;
      return `v${calls}`;
    };

    const key = ruleCacheKey('p', 'r');

    const a1 = await getOrLoad('session', key, 'sess-A', loader);
    const a2 = await getOrLoad('session', key, 'sess-A', loader);
    expect(a1).toBe('v1');
    expect(a2).toBe('v1');
    expect(calls).toBe(1);

    const b1 = await getOrLoad('session', key, 'sess-B', loader);
    expect(b1).toBe('v2');
    expect(calls).toBe(2);

    // sessionCache exposes the inner-map structure.
    expect(sessionCache.get('sess-A')?.get(key)).toBe('v1');
    expect(sessionCache.get('sess-B')?.get(key)).toBe('v2');
  });

  it('falls back to a synthetic id when sessionId is undefined', async () => {
    // Documents the runtime fallback used by callers that don't yet have
    // an active session (e.g. one-shot CLI invocations).
    let calls = 0;
    const loader = async (): Promise<string> => {
      calls += 1;
      return `v${calls}`;
    };

    const key = ruleCacheKey('p', 'r');
    const a = await getOrLoad('session', key, undefined, loader);
    const b = await getOrLoad('session', key, undefined, loader);

    expect(a).toBe('v1');
    expect(b).toBe('v1');
    expect(calls).toBe(1);
    expect(sessionCache.get('default')?.get(key)).toBe('v1');
  });

  it('does not cache loader rejections', async () => {
    let calls = 0;
    const loader = async (): Promise<string> => {
      calls += 1;
      if (calls === 1) {
        throw new Error('boom');
      }
      return 'ok';
    };

    const key = ruleCacheKey('p', 'r');
    await expect(getOrLoad('session', key, 'sess-A', loader)).rejects.toThrow('boom');
    // Inner map may exist (created on demand) but must not contain the key.
    expect(sessionCache.get('sess-A')?.get(key)).toBeUndefined();
    const result = await getOrLoad('session', key, 'sess-A', loader);
    expect(result).toBe('ok');
    expect(calls).toBe(2);
  });
});

describe('clearSession', () => {
  beforeEach(() => clearAll());

  it('drops only entries for the named session', async () => {
    const loader = async (): Promise<string> => 'v';
    const key = ruleCacheKey('p', 'r');

    await getOrLoad('session', key, 'sess-A', loader);
    await getOrLoad('session', key, 'sess-B', loader);
    await getOrLoad('always', key, undefined, loader);

    clearSession('sess-A');

    expect(sessionCache.has('sess-A')).toBe(false);
    expect(sessionCache.get('sess-B')?.get(key)).toBe('v');
    expect(alwaysCache.get(key)).toBe('v');
  });

  it('is a no-op for an unknown session id', () => {
    expect(() => clearSession('never-existed')).not.toThrow();
  });
});

describe('clearAll', () => {
  it('drops every entry from both maps', async () => {
    const loader = async (): Promise<string> => 'v';
    const key = ruleCacheKey('p', 'r');

    await getOrLoad('always', key, undefined, loader);
    await getOrLoad('session', key, 'sess-A', loader);

    clearAll();

    expect(alwaysCache.size).toBe(0);
    expect(sessionCache.size).toBe(0);
  });
});
