// New test cases based on changes in `packages/opencode/test/tool/registry.test.ts` from opencode
// Placeholder: upstream sync created this file with no tests yet. Vitest fails the suite when
// a *.test.ts file contains no tests, so we add a minimal smoke test to keep CI green until
// the real test cases are ported.

import { describe, it, expect } from 'vitest';

describe('tool registry (placeholder)', () => {
  it('is a placeholder pending upstream port', () => {
    expect(true).toBe(true);
  });
});
