/**
 * Tests for the OpenAI-shape JSON schema lowering pass shipped with
 * `sanitizeOpenAISchema`, `isOpenAIShapedModel`, and
 * `lowerMcpToolsForOpenAIShaped` in `src/providers/transform.ts`.
 *
 * Fixtures are ported from sst/opencode #32489 (Codex schema lowering)
 * so any future divergence in the lowering pass is caught here first.
 */

import { describe, expect, it } from 'vitest';
import {
  isOpenAIShapedModel,
  lowerMcpToolsForOpenAIShaped,
  sanitizeOpenAISchema,
  type McpToolForLowering,
} from '../../src/providers/transform.js';

describe('sanitizeOpenAISchema - boolean schemas', () => {
  it('rewrites the boolean `true` schema to `{ type: "string" }`', () => {
    expect(sanitizeOpenAISchema(true)).toEqual({ type: 'string' });
  });

  it('rewrites the boolean `false` schema to `{ type: "string" }`', () => {
    expect(sanitizeOpenAISchema(false)).toEqual({ type: 'string' });
  });
});

describe('sanitizeOpenAISchema - keyword filtering', () => {
  it('drops unsupported JSON Schema keywords recursively', () => {
    const result = sanitizeOpenAISchema({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: 'Search',
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
          format: 'uri',
          pattern: '^https://',
          minLength: 1,
          maxLength: 100,
          default: 'https://example.com',
        },
        count: {
          type: 'integer',
          minimum: 1,
          maximum: 10,
          multipleOf: 1,
        },
        createdAt: {
          format: 'date-time',
        },
        mode: {
          const: 'fast',
        },
        tags: {
          type: 'array',
          minItems: 1,
          maxItems: 3,
          uniqueItems: true,
        },
        tuple: {
          type: 'array',
          items: [
            { type: 'number', minimum: 0 },
            { type: 'string', pattern: '^ok$' },
          ],
        },
        metadata: {
          type: 'object',
          patternProperties: {
            '^x-': { type: 'string' },
          },
          additionalProperties: {
            type: 'string',
            pattern: '^safe$',
          },
        },
      },
      patternProperties: {
        '^extra': { type: 'string' },
      },
      required: ['query'],
      additionalProperties: false,
    });

    expect(result).toEqual({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        count: {
          type: 'integer',
        },
        createdAt: {
          type: 'string',
        },
        mode: {
          enum: ['fast'],
          type: 'string',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        tuple: {
          type: 'array',
          items: [{ type: 'number' }, { type: 'string' }],
        },
        metadata: {
          type: 'object',
          properties: {},
          additionalProperties: {
            type: 'string',
          },
        },
      },
      required: ['query'],
      additionalProperties: false,
    });
  });

  it('drops unknown composition keywords (if/then/else, dependentSchemas, ...)', () => {
    // These keywords have no allowlist entry; the lowering pass simply omits them.
    const result = sanitizeOpenAISchema({
      type: 'object',
      properties: { a: { type: 'string' } },
      if: { properties: { a: { const: 'x' } } },
      then: { required: ['a'] },
      else: { required: [] },
      dependentSchemas: { a: { required: ['a'] } },
      unevaluatedProperties: false,
    }) as Record<string, unknown>;

    expect(result).toEqual({
      type: 'object',
      properties: { a: { type: 'string' } },
    });
    expect('if' in result).toBe(false);
    expect('then' in result).toBe(false);
    expect('else' in result).toBe(false);
    expect('dependentSchemas' in result).toBe(false);
    expect('unevaluatedProperties' in result).toBe(false);
  });
});

describe('sanitizeOpenAISchema - $ref handling', () => {
  it('keeps local references and sanitizes definitions', () => {
    const result = sanitizeOpenAISchema({
      type: 'object',
      properties: {
        value: {
          $ref: '#/$defs/Value',
          description: 'Referenced value',
          examples: ['ignored'],
        },
      },
      $defs: {
        Value: {
          type: 'string',
          pattern: '^value$',
          description: 'Definition description',
        },
        Unused: {
          type: 'number',
          minimum: 0,
        },
      },
    }) as { properties: Record<string, unknown>; $defs: Record<string, unknown> };

    expect(result.properties.value).toEqual({
      $ref: '#/$defs/Value',
      description: 'Referenced value',
    });
    expect(result.$defs).toEqual({
      Value: {
        type: 'string',
        description: 'Definition description',
      },
      Unused: {
        type: 'number',
      },
    });
  });

  it('preserves $ref when no other type info is present', () => {
    expect(sanitizeOpenAISchema({ $ref: '#/$defs/Foo' })).toEqual({ $ref: '#/$defs/Foo' });
  });
});

describe('sanitizeOpenAISchema - const -> enum folding', () => {
  it('folds `const: X` into `enum: [X]`', () => {
    expect(sanitizeOpenAISchema({ const: 'fast' })).toEqual({
      enum: ['fast'],
      type: 'string',
    });
  });

  it('preserves an existing `enum` when `const` is absent', () => {
    expect(sanitizeOpenAISchema({ enum: ['a', 'b'] })).toEqual({
      enum: ['a', 'b'],
      type: 'string',
    });
  });
});

describe('sanitizeOpenAISchema - type inference', () => {
  it('infers type "object" from `properties` when `type` is absent', () => {
    expect(sanitizeOpenAISchema({ properties: { foo: { type: 'string' } } })).toEqual({
      type: 'object',
      properties: { foo: { type: 'string' } },
    });
  });

  it('infers type "array" from `items` when `type` is absent', () => {
    expect(sanitizeOpenAISchema({ items: { type: 'string' } })).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('infers type "array" from `prefixItems` when `type` is absent', () => {
    expect(
      sanitizeOpenAISchema({
        prefixItems: [{ type: 'string' }, { type: 'number' }],
      })
    ).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('infers type "number" from numeric range keywords', () => {
    expect(sanitizeOpenAISchema({ minimum: 0, maximum: 10 })).toEqual({
      type: 'number',
    });
  });

  it('drops unknown `type` values silently', () => {
    expect(sanitizeOpenAISchema({ type: 'bigint', properties: {} })).toEqual({
      type: 'object',
      properties: {},
    });
  });

  it('returns `{}` when no type can be inferred and no $ref/composition is present', () => {
    expect(sanitizeOpenAISchema({ foo: 'bar' })).toEqual({});
  });
});

describe('sanitizeOpenAISchema - required filtering', () => {
  it('filters non-string entries out of `required`', () => {
    const result = sanitizeOpenAISchema({
      type: 'object',
      properties: { a: { type: 'string' } },
      required: ['a', 1, null, { x: 1 }, 'b'],
    });
    expect(result).toEqual({
      type: 'object',
      properties: { a: { type: 'string' } },
      required: ['a', 'b'],
    });
  });
});

describe('sanitizeOpenAISchema - description preservation', () => {
  it('preserves `description` verbatim', () => {
    const longText = 'Multi-line\ndescription with\t whitespace.';
    expect(sanitizeOpenAISchema({ type: 'string', description: longText })).toEqual({
      type: 'string',
      description: longText,
    });
  });
});

describe('sanitizeOpenAISchema - prefixItems / tuple lowering', () => {
  it('lowers tuple-form `items: [...]` to a legal shape', () => {
    expect(
      sanitizeOpenAISchema({
        type: 'array',
        items: [
          { type: 'number', minimum: 0 },
          { type: 'string', pattern: '^ok$' },
        ],
      })
    ).toEqual({
      type: 'array',
      items: [{ type: 'number' }, { type: 'string' }],
    });
  });
});

describe('sanitizeOpenAISchema - composition keywords', () => {
  it('recurses into anyOf/oneOf/allOf', () => {
    expect(
      sanitizeOpenAISchema({
        anyOf: [
          { type: 'string', pattern: '^a$' },
          { type: 'number', minimum: 0 },
        ],
      })
    ).toEqual({
      anyOf: [{ type: 'string' }, { type: 'number' }],
    });
  });
});

describe('sanitizeOpenAISchema - additionalProperties', () => {
  it('passes booleans through untouched', () => {
    expect(
      sanitizeOpenAISchema({
        type: 'object',
        properties: {},
        additionalProperties: true,
      })
    ).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: true,
    });
  });

  it('recurses when additionalProperties is a schema', () => {
    expect(
      sanitizeOpenAISchema({
        type: 'object',
        properties: {},
        additionalProperties: { type: 'string', pattern: '^safe$' },
      })
    ).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: { type: 'string' },
    });
  });
});

describe('isOpenAIShapedModel', () => {
  it('matches gpt-* ids', () => {
    expect(isOpenAIShapedModel('gpt-4o')).toBe(true);
    expect(isOpenAIShapedModel('gpt-4.1')).toBe(true);
    expect(isOpenAIShapedModel('gpt-5-mini')).toBe(true);
    expect(isOpenAIShapedModel('GPT-4O')).toBe(true);
  });

  it('matches o1-* and o3-* ids', () => {
    expect(isOpenAIShapedModel('o1-preview')).toBe(true);
    expect(isOpenAIShapedModel('o3-mini')).toBe(true);
    expect(isOpenAIShapedModel('O3-pro')).toBe(true);
  });

  it('matches when providerMeta.sdk is @ai-sdk/openai', () => {
    expect(isOpenAIShapedModel('custom-model', { sdk: '@ai-sdk/openai' })).toBe(true);
  });

  it('matches when providerMeta.sdk is @ai-sdk/azure', () => {
    expect(isOpenAIShapedModel('custom-model', { sdk: '@ai-sdk/azure' })).toBe(true);
  });

  it('returns false for non-OpenAI SAP AI Core ids', () => {
    expect(isOpenAIShapedModel('anthropic--claude-4.5-sonnet')).toBe(false);
    expect(isOpenAIShapedModel('anthropic--claude-3.7-sonnet')).toBe(false);
    expect(isOpenAIShapedModel('gemini-2.5-pro')).toBe(false);
    expect(isOpenAIShapedModel('mistralai--mistral-small-instruct')).toBe(false);
    expect(isOpenAIShapedModel('amazon--nova-pro')).toBe(false);
    expect(isOpenAIShapedModel('deepseek-ai--deepseek-r1')).toBe(false);
  });

  it('returns false for unrelated providerMeta sdks', () => {
    expect(isOpenAIShapedModel('claude-3-opus', { sdk: '@ai-sdk/anthropic' })).toBe(false);
  });

  it('does not falsely match ids that merely contain "gpt"', () => {
    expect(isOpenAIShapedModel('claude-but-with-gpt-in-name')).toBe(false);
  });
});

describe('lowerMcpToolsForOpenAIShaped', () => {
  const mcpTool: McpToolForLowering = {
    name: 'search',
    description: 'Search the filesystem',
    serverName: 'filesystem',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          pattern: '^https://',
          format: 'uri',
        },
        // tuple form via items: [...] — illegal for OpenAI without lowering
        path: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
        },
      },
      required: ['query'],
    },
  };

  it('lowers `inputSchema` for OpenAI-shaped models', () => {
    const result = lowerMcpToolsForOpenAIShaped([mcpTool], 'gpt-4o');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('search');
    expect(result[0].inputSchema).toEqual({
      type: 'object',
      properties: {
        query: { type: 'string' },
        path: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
        },
      },
      required: ['query'],
    });
  });

  it('does NOT lower `inputSchema` for SAP AI Core anthropic deployments', () => {
    const result = lowerMcpToolsForOpenAIShaped([mcpTool], 'anthropic--claude-4.5-sonnet');
    // Schema must pass through untouched - non-OpenAI deployments accept JSON
    // Schema 2020-12 fine and lowering would strip semantically meaningful
    // constraints (pattern, format, prefixItems, ...).
    expect(result[0].inputSchema).toEqual(mcpTool.inputSchema);
    expect(result[0].inputSchema).toBe(mcpTool.inputSchema);
  });

  it('does NOT mutate the original tool object or its inputSchema', () => {
    const tool: McpToolForLowering = {
      name: 'fs_read',
      inputSchema: {
        type: 'object',
        properties: { path: { type: 'string', pattern: '^/' } },
      },
    };
    const snapshot = JSON.parse(JSON.stringify(tool));

    const result = lowerMcpToolsForOpenAIShaped([tool], 'gpt-5');
    // Original tool must be unchanged so the cached McpToolInfo can serve
    // non-OpenAI deployments in the same process.
    expect(tool).toEqual(snapshot);
    expect(result[0]).not.toBe(tool);
    expect(result[0].inputSchema).not.toBe(tool.inputSchema);
  });

  it('honours providerMeta.sdk for non-prefixed model ids', () => {
    const result = lowerMcpToolsForOpenAIShaped([mcpTool], 'custom-deployment-id', {
      sdk: '@ai-sdk/openai',
    });
    expect((result[0].inputSchema as { properties: Record<string, unknown> }).properties).toEqual({
      query: { type: 'string' },
      path: {
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }],
      },
    });
  });

  it('returns an array reference distinct from the input', () => {
    const tools = [mcpTool];
    expect(lowerMcpToolsForOpenAIShaped(tools, 'gpt-4o')).not.toBe(tools);
    expect(lowerMcpToolsForOpenAIShaped(tools, 'anthropic--claude-4.5-sonnet')).not.toBe(tools);
  });
});
