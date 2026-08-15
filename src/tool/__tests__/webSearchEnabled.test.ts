/**
 * Tests for `webSearchEnabled` — the per-provider gate for the built-in
 * websearch tool. Mirrors the upstream OpenCode test suite (PR #42630) that
 * added `opencode-go` alongside `opencode`.
 */
import { describe, it, expect } from 'vitest';

import { webSearchEnabled } from '../registry.js';

describe('webSearchEnabled', () => {
  it('is enabled for OpenCode providers or explicit websearch provider flags', () => {
    expect(webSearchEnabled('opencode', { exa: false, parallel: false })).toBe(true);
    expect(webSearchEnabled('opencode-go', { exa: false, parallel: false })).toBe(true);
    expect(webSearchEnabled('openai', { exa: false, parallel: false })).toBe(false);
    expect(webSearchEnabled('openai', { exa: true, parallel: false })).toBe(true);
    expect(webSearchEnabled('openai', { exa: false, parallel: true })).toBe(true);
  });

  it('defaults `flags` to all-false when omitted', () => {
    expect(webSearchEnabled('opencode')).toBe(true);
    expect(webSearchEnabled('opencode-go')).toBe(true);
    expect(webSearchEnabled('sap-ai-core')).toBe(false);
  });
});
