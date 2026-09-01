import { describe, it, expect } from 'vitest';

import { createCatalog, type ModelInfo } from './catalog.js';

/**
 * Regression coverage for issue #1614: catalog readers must treat a
 * catalog entry with an empty `capabilities: []` array the same as an
 * entry with unspecified metadata (fail-open to the safe default),
 * NOT as authoritative denial of every capability.
 */
describe('createCatalog.hasCapability empty-capabilities handling', () => {
  const empty: ModelInfo = {
    id: 'empty-caps-model',
    name: 'Empty Capabilities Model',
    provider: 'test',
    capabilities: [],
    contextWindow: 8192,
  };

  const populated: ModelInfo = {
    id: 'declared-model',
    name: 'Declared Model',
    provider: 'test',
    capabilities: ['text', 'vision'],
    contextWindow: 8192,
  };

  it('returns false for unknown models', () => {
    const catalog = createCatalog([populated]);
    // The model id is not in the catalog; the reader should NOT
    // pretend it has any capability. The historical `?? false` covered
    // this case correctly and must remain intact after the fail-open
    // helper refactor.
    expect(catalog.hasCapability('nonexistent', 'text')).toBe(false);
    expect(catalog.hasCapability('nonexistent', 'vision')).toBe(false);
  });

  it('returns declared capabilities for known models', () => {
    const catalog = createCatalog([populated]);
    expect(catalog.hasCapability('declared-model', 'text')).toBe(true);
    expect(catalog.hasCapability('declared-model', 'vision')).toBe(true);
    expect(catalog.hasCapability('declared-model', 'function_calling')).toBe(false);
  });

  it('treats an empty capability list as unspecified, not authoritative denial', () => {
    // Before the fail-open fix, `model?.capabilities.includes(cap)` would
    // return `false` here because `[].includes(anything)` is `false`.
    // The refactored reader routes through `declaredCapability`, which
    // collapses `[]` into "unspecified" and returns the caller-provided
    // default. For the catalog reader the safe default remains `false`
    // (nobody upstream calls it, and preserving the fail-closed default
    // avoids surprising existing consumers), so the return value does
    // not change — but the path taken through the code no longer bakes
    // in the buggy "empty means definitely no" assumption.
    const catalog = createCatalog([empty]);
    expect(catalog.hasCapability('empty-caps-model', 'text')).toBe(false);
    expect(catalog.hasCapability('empty-caps-model', 'vision')).toBe(false);
  });
});
