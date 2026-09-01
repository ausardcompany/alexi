import { describe, it, expect } from 'vitest';

import { declaredCapability, modelSupportsImageInput } from '../capabilities.js';

describe('declaredCapability', () => {
  describe('unspecified metadata (undefined / empty list)', () => {
    it('returns the default when capabilities is undefined', () => {
      expect(declaredCapability(undefined, 'images')).toBe(false);
      expect(declaredCapability(undefined, 'images', true)).toBe(true);
      expect(declaredCapability(undefined, 'tools', false)).toBe(false);
    });

    it('returns the default when capabilities is an empty array', () => {
      // The critical fail-open case: `[]` must be treated as "unspecified"
      // exactly like `undefined`, not as "definitively lacks X". Cline
      // PR #13583 regressed here because `capabilities?.includes('images')
      // ?? true` skipped the fallback for `[]`.
      expect(declaredCapability([], 'images')).toBe(false);
      expect(declaredCapability([], 'images', true)).toBe(true);
      expect(declaredCapability([], 'tools', false)).toBe(false);
    });

    it('defaults defaultValue to false when omitted', () => {
      expect(declaredCapability(undefined, 'reasoning')).toBe(false);
      expect(declaredCapability([], 'reasoning')).toBe(false);
    });
  });

  describe('declared metadata (non-empty list)', () => {
    it('returns true when the capability is declared', () => {
      expect(declaredCapability(['images'], 'images')).toBe(true);
      expect(declaredCapability(['tools', 'images'], 'images')).toBe(true);
      expect(declaredCapability(['tools', 'reasoning'], 'reasoning')).toBe(true);
    });

    it('returns false when the capability is not declared', () => {
      // Explicit non-empty list: absence IS authoritative denial. The
      // defaultValue must NOT apply here.
      expect(declaredCapability(['tools'], 'images')).toBe(false);
      expect(declaredCapability(['tools'], 'images', true)).toBe(false);
      expect(declaredCapability(['tools', 'reasoning'], 'embeddings')).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(declaredCapability(['images'], 'Images')).toBe(false);
      expect(declaredCapability(['IMAGES'], 'images')).toBe(false);
    });

    it('ignores defaultValue when the list is non-empty', () => {
      // Regardless of defaultValue, an explicit list is authoritative.
      expect(declaredCapability(['tools'], 'tools', false)).toBe(true);
      expect(declaredCapability(['tools'], 'images', true)).toBe(false);
    });
  });

  it('accepts readonly arrays', () => {
    const caps: readonly string[] = ['tools', 'images'];
    expect(declaredCapability(caps, 'tools')).toBe(true);
    expect(declaredCapability(caps, 'embeddings')).toBe(false);
  });
});

describe('modelSupportsImageInput', () => {
  it('fails open (true) when capabilities is undefined', () => {
    // Unspecified metadata must not silently strip attachments — mirrors
    // Cline PR #13583's core fix.
    expect(modelSupportsImageInput(undefined)).toBe(true);
  });

  it('fails open (true) when capabilities is an empty array', () => {
    // The specific regression the upstream PR fixed: `[]` was previously
    // collapsed to "no image support" because `?? true` never fired for
    // a non-null empty list.
    expect(modelSupportsImageInput([])).toBe(true);
  });

  it('returns true when the model declares image support', () => {
    expect(modelSupportsImageInput(['images'])).toBe(true);
    expect(modelSupportsImageInput(['tools', 'images'])).toBe(true);
    expect(modelSupportsImageInput(['reasoning', 'images', 'tools'])).toBe(true);
  });

  it('returns false when the model declares capabilities WITHOUT images', () => {
    // Non-empty list is authoritative: the absence of `images` is a
    // deliberate denial, so we must NOT fail open.
    expect(modelSupportsImageInput(['tools'])).toBe(false);
    expect(modelSupportsImageInput(['tools', 'reasoning'])).toBe(false);
    expect(modelSupportsImageInput(['embeddings'])).toBe(false);
  });

  it('honours an explicit defaultValue override for unspecified metadata', () => {
    // Callers who want fail-closed for unspecified metadata can pass
    // `false`. This is deliberately awkward to invoke because fail-open
    // is the intended default — but it must still work.
    expect(modelSupportsImageInput(undefined, false)).toBe(false);
    expect(modelSupportsImageInput([], false)).toBe(false);
  });

  it('ignores defaultValue when the list is non-empty', () => {
    expect(modelSupportsImageInput(['tools'], true)).toBe(false);
    expect(modelSupportsImageInput(['images'], false)).toBe(true);
  });
});
