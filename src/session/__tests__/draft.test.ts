/**
 * Regression tests for DraftCache.
 *
 * Ports upstream kilocode `0d2fee251` "discard empty draft caches after
 * goal promotion" — empty drafts must be evicted immediately (on set)
 * and on promotion (submit), even when the promotion is a no-op.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DraftCache, getDraftCache, resetDraftCache } from '../draft.js';

describe('DraftCache', () => {
  beforeEach(() => {
    resetDraftCache();
  });

  it('stores and retrieves a non-empty draft', () => {
    const cache = new DraftCache();
    cache.set('s1', 'hello world');
    expect(cache.get('s1')).toBe('hello world');
  });

  it('evicts an empty draft immediately on set (does not persist)', () => {
    const cache = new DraftCache();
    cache.set('s1', 'in progress');
    expect(cache.get('s1')).toBe('in progress');

    // User clears the input box back to empty — the cache must NOT
    // keep the stale non-empty value AND must not persist the empty one.
    cache.set('s1', '');
    expect(cache.get('s1')).toBeUndefined();
  });

  it('treats whitespace-only drafts as empty', () => {
    const cache = new DraftCache();
    cache.set('s1', '   \n\t  ');
    expect(cache.get('s1')).toBeUndefined();
  });

  it('promote returns the trimmed prompt and evicts the cache entry', () => {
    const cache = new DraftCache();
    cache.set('s1', 'in progress');

    const promoted = cache.promote('s1', '   final prompt   ');
    expect(promoted).toBe('final prompt');
    expect(cache.get('s1')).toBeUndefined();
  });

  it('promote of an empty draft returns undefined and still evicts stale cache', () => {
    const cache = new DraftCache();
    // Simulate a stale non-empty cache entry left behind by an earlier
    // set (e.g. session was reloaded and the new user submits empty).
    cache.set('s1', 'stale content');

    const promoted = cache.promote('s1', '   ');
    expect(promoted).toBeUndefined();
    // Critically: the stale cache MUST be evicted even on empty promote —
    // that is exactly the upstream kilocode `0d2fee251` fix.
    expect(cache.get('s1')).toBeUndefined();
  });

  it('delete is idempotent', () => {
    const cache = new DraftCache();
    expect(() => cache.delete('never-set')).not.toThrow();
    cache.set('s1', 'draft');
    cache.delete('s1');
    cache.delete('s1'); // second call must be a no-op
    expect(cache.get('s1')).toBeUndefined();
  });

  it('clear wipes every entry', () => {
    const cache = new DraftCache();
    cache.set('s1', 'a');
    cache.set('s2', 'b');
    cache.clear();
    expect(cache.get('s1')).toBeUndefined();
    expect(cache.get('s2')).toBeUndefined();
  });

  it('getDraftCache returns a shared singleton across calls', () => {
    const a = getDraftCache();
    const b = getDraftCache();
    expect(a).toBe(b);

    a.set('shared', 'draft');
    expect(b.get('shared')).toBe('draft');
  });
});
