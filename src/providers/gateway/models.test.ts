/**
 * Tests for `modelSupportsTools` — gateway model capability helper.
 *
 * These cases mirror the fix from kilocode c4506f7ef: a model whose
 * `supported_parameters` is unspecified (undefined, null, or empty
 * array) must be treated as tool-capable rather than silently
 * downgraded.
 */

import { describe, expect, it } from 'vitest';
import { modelSupportsTools } from './models.js';

describe('modelSupportsTools', () => {
  it('returns true when supported_parameters is undefined', () => {
    expect(modelSupportsTools({ id: 'x' })).toBe(true);
  });

  it('returns true when supported_parameters is null', () => {
    expect(modelSupportsTools({ id: 'x', supported_parameters: null })).toBe(true);
  });

  it('returns true when supported_parameters is an empty array', () => {
    expect(modelSupportsTools({ id: 'x', supported_parameters: [] })).toBe(true);
  });

  it('returns true when "tools" is listed', () => {
    expect(modelSupportsTools({ id: 'x', supported_parameters: ['tools'] })).toBe(true);
  });

  it('returns true when "tool_choice" is listed', () => {
    expect(modelSupportsTools({ id: 'x', supported_parameters: ['tool_choice'] })).toBe(true);
  });

  it('returns true when both "tools" and "tool_choice" are listed', () => {
    expect(
      modelSupportsTools({ id: 'x', supported_parameters: ['tools', 'tool_choice', 'temperature'] })
    ).toBe(true);
  });

  it('returns false when parameters are listed but tools/tool_choice are absent', () => {
    expect(
      modelSupportsTools({ id: 'x', supported_parameters: ['temperature', 'top_p'] })
    ).toBe(false);
  });

  it('handles a realistic gateway record with no supported_parameters', () => {
    // SAP AI Core deployment records typically look like this — no
    // parameter metadata surfaced at all. Alexi must still register
    // tools for these models.
    const model: import('./models.js').GatewayModelInfo = {
      id: 'anthropic--claude-4.7-opus',
    };
    expect(modelSupportsTools(model)).toBe(true);
  });
});
