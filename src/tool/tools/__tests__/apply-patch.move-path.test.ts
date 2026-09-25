/**
 * Regression tests for `normalizeMovePath` — the empty-string / undefined
 * guard that ports upstream kilocode `f7da00f35` (PR #45329). An empty
 * `move_path` previously survived serialization and caused patch
 * application to fail on files that were not actually being renamed.
 */

import { describe, expect, it } from 'vitest';

import { normalizeMovePath } from '../apply-patch.js';

describe('normalizeMovePath', () => {
  it('returns undefined for an undefined input', () => {
    expect(normalizeMovePath(undefined)).toBeUndefined();
  });

  it('treats the empty string as absent (regression: kilocode f7da00f35)', () => {
    expect(normalizeMovePath('')).toBeUndefined();
  });

  it('preserves a non-empty destination path verbatim', () => {
    expect(normalizeMovePath('src/renamed.ts')).toBe('src/renamed.ts');
  });

  it('preserves a whitespace-only string (not our concern to trim)', () => {
    // The upstream fix specifically targets the empty-string case;
    // whitespace-only paths remain the caller's responsibility.
    expect(normalizeMovePath('  ')).toBe('  ');
  });
});
