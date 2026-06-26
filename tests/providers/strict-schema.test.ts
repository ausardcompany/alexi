/**
 * Tests for `enforceStrictSchema` in `src/providers/transform.ts`.
 *
 * `enforceStrictSchema` is the post-#856 lowering step that rewrites a
 * JSON Schema fragment to satisfy the OpenAI Responses strict-mode
 * contract on every object node:
 *   - `additionalProperties: false`
 *   - `required` lists every key in `properties`
 *
 * The transform is non-mutating and only fires on nodes that have a
 * `properties` key — leaves, refs, arrays, and composition wrappers are
 * recursed into but otherwise pass through. Callers gate on
 * `strict === true` from the tool definition; this suite asserts the
 * helper's intrinsic contract, not the gating site.
 */

import { describe, expect, it } from 'vitest';
import { enforceStrictSchema } from '../../src/providers/transform.js';

describe('enforceStrictSchema - object nodes', () => {
  it('adds additionalProperties:false and fills required from properties', () => {
    const input = {
      type: 'object',
      properties: {
        path: { type: 'string' },
        recursive: { type: 'boolean' },
      },
    };
    const result = enforceStrictSchema(input);
    expect(result).toEqual({
      type: 'object',
      properties: {
        path: { type: 'string' },
        recursive: { type: 'boolean' },
      },
      additionalProperties: false,
      required: ['path', 'recursive'],
    });
  });

  it('overwrites an existing additionalProperties:true on an object node', () => {
    const input = {
      type: 'object',
      properties: { name: { type: 'string' } },
      additionalProperties: true,
    };
    const result = enforceStrictSchema(input) as Record<string, unknown>;
    expect(result.additionalProperties).toBe(false);
  });

  it('replaces an existing required list with every key in properties', () => {
    const input = {
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'boolean' },
      },
      required: ['a'],
    };
    const result = enforceStrictSchema(input) as Record<string, unknown>;
    expect(result.required).toEqual(['a', 'b', 'c']);
  });

  it('preserves property declaration order in required', () => {
    const input = {
      type: 'object',
      properties: {
        z: { type: 'string' },
        a: { type: 'string' },
        m: { type: 'string' },
      },
    };
    const result = enforceStrictSchema(input) as Record<string, unknown>;
    expect(result.required).toEqual(['z', 'a', 'm']);
  });

  it('emits required:[] when properties is an empty object', () => {
    const input = { type: 'object', properties: {} };
    const result = enforceStrictSchema(input);
    expect(result).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
      required: [],
    });
  });
});

describe('enforceStrictSchema - recursion', () => {
  it('recurses into nested object properties', () => {
    const input = {
      type: 'object',
      properties: {
        outer: {
          type: 'object',
          properties: {
            inner: { type: 'string' },
          },
        },
      },
    };
    const result = enforceStrictSchema(input) as {
      properties: { outer: Record<string, unknown> };
    };
    expect(result.properties.outer).toEqual({
      type: 'object',
      properties: { inner: { type: 'string' } },
      additionalProperties: false,
      required: ['inner'],
    });
  });

  it('recurses into array `items` that is itself an object schema', () => {
    const input = {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      },
    };
    const result = enforceStrictSchema(input) as {
      properties: { tags: { items: Record<string, unknown> } };
    };
    expect(result.properties.tags.items).toEqual({
      type: 'object',
      properties: {
        key: { type: 'string' },
        value: { type: 'string' },
      },
      additionalProperties: false,
      required: ['key', 'value'],
    });
  });

  it('recurses into tuple-form `items` array of object schemas', () => {
    const input = {
      type: 'array',
      items: [
        { type: 'object', properties: { a: { type: 'string' } } },
        { type: 'object', properties: { b: { type: 'number' } } },
      ],
    };
    const result = enforceStrictSchema(input) as { items: Record<string, unknown>[] };
    expect(result.items[0]).toEqual({
      type: 'object',
      properties: { a: { type: 'string' } },
      additionalProperties: false,
      required: ['a'],
    });
    expect(result.items[1]).toEqual({
      type: 'object',
      properties: { b: { type: 'number' } },
      additionalProperties: false,
      required: ['b'],
    });
  });

  it('recurses into each branch of a oneOf union of object schemas', () => {
    const input = {
      oneOf: [
        { type: 'object', properties: { kind: { type: 'string' }, value: { type: 'string' } } },
        { type: 'object', properties: { kind: { type: 'string' }, count: { type: 'number' } } },
      ],
    };
    const result = enforceStrictSchema(input) as { oneOf: Record<string, unknown>[] };
    expect(result.oneOf[0]).toMatchObject({
      additionalProperties: false,
      required: ['kind', 'value'],
    });
    expect(result.oneOf[1]).toMatchObject({
      additionalProperties: false,
      required: ['kind', 'count'],
    });
  });

  it('recurses into anyOf and allOf branches', () => {
    const input = {
      anyOf: [{ type: 'object', properties: { a: { type: 'string' } } }],
      allOf: [{ type: 'object', properties: { b: { type: 'string' } } }],
    };
    const result = enforceStrictSchema(input) as {
      anyOf: Record<string, unknown>[];
      allOf: Record<string, unknown>[];
    };
    expect(result.anyOf[0]).toMatchObject({
      additionalProperties: false,
      required: ['a'],
    });
    expect(result.allOf[0]).toMatchObject({
      additionalProperties: false,
      required: ['b'],
    });
  });

  it('recurses into $defs and definitions values', () => {
    const input = {
      $defs: {
        Point: {
          type: 'object',
          properties: { x: { type: 'number' }, y: { type: 'number' } },
        },
      },
      definitions: {
        Label: {
          type: 'object',
          properties: { text: { type: 'string' } },
        },
      },
    };
    const result = enforceStrictSchema(input) as {
      $defs: { Point: Record<string, unknown> };
      definitions: { Label: Record<string, unknown> };
    };
    expect(result.$defs.Point).toMatchObject({
      additionalProperties: false,
      required: ['x', 'y'],
    });
    expect(result.definitions.Label).toMatchObject({
      additionalProperties: false,
      required: ['text'],
    });
  });

  it('recurses into additionalProperties when it is itself a schema', () => {
    // A node with `additionalProperties` (schema form) but no `properties`
    // is NOT treated as an object node, so the recursed schema is what we
    // assert on. (The enclosing node remains pass-through-shaped.)
    const input = {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: { inner: { type: 'string' } },
      },
    };
    const result = enforceStrictSchema(input) as {
      additionalProperties: Record<string, unknown>;
    };
    expect(result.additionalProperties).toEqual({
      type: 'object',
      properties: { inner: { type: 'string' } },
      additionalProperties: false,
      required: ['inner'],
    });
  });
});

describe('enforceStrictSchema - pass-through cases', () => {
  it('passes through a plain string-leaf schema unchanged', () => {
    const input = { type: 'string', description: 'a leaf' };
    const result = enforceStrictSchema(input);
    expect(result).toEqual({ type: 'string', description: 'a leaf' });
  });

  it('passes through a number-leaf schema with range keywords unchanged', () => {
    const input = { type: 'number', minimum: 0, maximum: 100 };
    const result = enforceStrictSchema(input);
    expect(result).toEqual({ type: 'number', minimum: 0, maximum: 100 });
  });

  it('passes through a $ref-only node without injecting additionalProperties', () => {
    const input = { $ref: '#/$defs/Point' };
    const result = enforceStrictSchema(input) as Record<string, unknown>;
    expect(result).toEqual({ $ref: '#/$defs/Point' });
    expect(result.additionalProperties).toBeUndefined();
    expect(result.required).toBeUndefined();
  });

  it('passes through primitives (boolean, number, string, null) untouched', () => {
    expect(enforceStrictSchema(true)).toBe(true);
    expect(enforceStrictSchema(false)).toBe(false);
    expect(enforceStrictSchema(42)).toBe(42);
    expect(enforceStrictSchema('text')).toBe('text');
    expect(enforceStrictSchema(null)).toBe(null);
    expect(enforceStrictSchema(undefined)).toBe(undefined);
  });

  it('does NOT inject additionalProperties on a node without properties', () => {
    // An object schema that declares `type: 'object'` but has no
    // `properties` (e.g. a free-form map) is intentionally NOT augmented
    // — the strict contract only governs declared property keys.
    const input = { type: 'object' };
    const result = enforceStrictSchema(input) as Record<string, unknown>;
    expect(result).toEqual({ type: 'object' });
    expect(result.additionalProperties).toBeUndefined();
    expect(result.required).toBeUndefined();
  });
});

describe('enforceStrictSchema - non-mutation', () => {
  it('returns a new top-level object (reference inequality)', () => {
    const input = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    const result = enforceStrictSchema(input);
    expect(result).not.toBe(input);
  });

  it('returns new nested objects (reference inequality at every level)', () => {
    const inner = { type: 'string' as const };
    const outer = {
      type: 'object',
      properties: { name: inner },
    };
    const result = enforceStrictSchema(outer) as {
      properties: { name: unknown };
    };
    expect(result.properties).not.toBe(outer.properties);
    expect(result.properties.name).not.toBe(inner);
  });

  it('does not mutate the input properties record', () => {
    const input = {
      type: 'object',
      properties: { a: { type: 'string' } },
    };
    const snapshot = JSON.stringify(input);
    enforceStrictSchema(input);
    expect(JSON.stringify(input)).toBe(snapshot);
    expect('additionalProperties' in input).toBe(false);
    expect('required' in input).toBe(false);
  });

  it('does not mutate input arrays', () => {
    const input = {
      anyOf: [
        { type: 'object', properties: { a: { type: 'string' } } },
        { type: 'object', properties: { b: { type: 'number' } } },
      ],
    };
    const originalLength = input.anyOf.length;
    const originalFirst = input.anyOf[0];
    const result = enforceStrictSchema(input) as { anyOf: unknown[] };
    expect(input.anyOf.length).toBe(originalLength);
    expect(input.anyOf[0]).toBe(originalFirst);
    expect(result.anyOf).not.toBe(input.anyOf);
    expect(result.anyOf[0]).not.toBe(input.anyOf[0]);
  });
});

describe('enforceStrictSchema - gate sanity', () => {
  // These tests document the caller-side gating contract: the call site
  // that consumes the #856 `strict` flag MUST gate on `strict === true`
  // before invoking `enforceStrictSchema`. The helper itself has no
  // notion of the flag — it simply enforces strict-mode unconditionally
  // on any object node it walks. The two tests below simulate the gate
  // by NOT calling the helper at all, which is the same behaviour
  // callers must produce when `strict !== true`.
  it('a strict:undefined caller emits the schema verbatim (no helper call)', () => {
    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    // Simulate caller gate: `strict === true` is false, so we do NOT call
    // enforceStrictSchema. The emitted schema is the input verbatim.
    const strict: boolean | undefined = undefined;
    const emitted = strict === true ? enforceStrictSchema(schema) : schema;
    expect(emitted).toBe(schema);
    expect('additionalProperties' in (emitted as object)).toBe(false);
  });

  it('a strict:false caller emits the schema verbatim (no helper call)', () => {
    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    const strict = false;
    const emitted = strict === true ? enforceStrictSchema(schema) : schema;
    expect(emitted).toBe(schema);
    expect('additionalProperties' in (emitted as object)).toBe(false);
  });

  it('a strict:true caller emits the enforced schema (helper applied)', () => {
    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    const strict = true;
    const emitted = strict === true ? enforceStrictSchema(schema) : schema;
    expect(emitted).not.toBe(schema);
    expect(emitted).toMatchObject({
      additionalProperties: false,
      required: ['name'],
    });
  });
});
