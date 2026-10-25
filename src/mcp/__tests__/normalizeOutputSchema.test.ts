/**
 * Tests for the MCP output-schema normalizer.
 *
 * Backport of opencode `c41c3a0` — ensures tools whose server-declared
 * `outputSchema` is not a root object (unions, arrays, primitives) are
 * wrapped into a stable `{ properties }` shape so downstream code that
 * inspects `.properties` continues to work.
 */

import { describe, expect, it } from 'vitest';
import { normalizeOutputSchema } from '../client.js';

describe('normalizeOutputSchema', () => {
  it('returns undefined for non-object input', () => {
    expect(normalizeOutputSchema(undefined)).toBeUndefined();
    expect(normalizeOutputSchema(null)).toBeUndefined();
    expect(normalizeOutputSchema('string')).toBeUndefined();
    expect(normalizeOutputSchema(42)).toBeUndefined();
  });

  it('passes root object schemas through unchanged', () => {
    const schema = { type: 'object', properties: { foo: { type: 'string' } } };
    expect(normalizeOutputSchema(schema)).toEqual(schema);
  });

  it('passes schemas with properties through even without explicit type', () => {
    const schema = { properties: { foo: { type: 'string' } } };
    expect(normalizeOutputSchema(schema)).toEqual(schema);
  });

  it('wraps array schemas under properties.result', () => {
    const schema = { type: 'array', items: { type: 'string' } };
    expect(normalizeOutputSchema(schema)).toEqual({
      type: 'object',
      properties: { result: schema },
      required: ['result'],
    });
  });

  it('wraps primitive schemas under properties.result', () => {
    const schema = { type: 'string' };
    expect(normalizeOutputSchema(schema)).toEqual({
      type: 'object',
      properties: { result: schema },
      required: ['result'],
    });
  });

  it('wraps union (anyOf) schemas under properties.result', () => {
    const schema = { anyOf: [{ type: 'string' }, { type: 'number' }] };
    expect(normalizeOutputSchema(schema)).toEqual({
      type: 'object',
      properties: { result: schema },
      required: ['result'],
    });
  });
});
