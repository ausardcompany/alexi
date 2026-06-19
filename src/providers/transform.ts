/**
 * Provider-specific message transformations
 * Handles format differences between providers
 */

interface Message {
  role: string;
  content: string;
  reasoning_content?: string;
  [key: string]: unknown;
}

/**
 * Transform interleaved reasoning for DeepSeek models via OpenRouter
 * Preserves empty reasoning_content to maintain message structure
 */
export function transformInterleavedReasoning(
  messages: Message[],
  provider: string,
  model: string
): Message[] {
  // Skip transform for Kilo gateway - it handles this internally
  if (provider === '@kilocode/kilo-gateway') {
    return messages;
  }

  // Only apply to OpenRouter DeepSeek models
  if (provider !== 'openrouter' || !model.includes('deepseek')) {
    return messages;
  }

  return messages.map((msg) => {
    if (msg.role === 'assistant') {
      // Ensure reasoning_content exists even if empty
      return {
        ...msg,
        reasoning_content: msg.reasoning_content ?? '',
      };
    }
    return msg;
  });
}

/**
 * Ensure assistant messages always have reasoning for DeepSeek
 */
export function ensureDeepSeekReasoning(messages: Message[], model: string): Message[] {
  if (!model.includes('deepseek')) {
    return messages;
  }

  return messages.map((msg) => {
    if (msg.role === 'assistant' && msg.reasoning_content === undefined) {
      return { ...msg, reasoning_content: '' };
    }
    return msg;
  });
}

// ============================================================================
// OpenAI / Codex JSON Schema lowering for MCP tool inputSchemas
// ============================================================================
//
// SAP AI Core OpenAI deployments (gpt-*, o1-*, o3-*, and any provider whose
// underlying ai-sdk wrapper is `@ai-sdk/openai`) reject MCP tool input
// schemas that use JSON Schema 2020-12 features OpenAI's function-tool
// registration does not understand (`prefixItems`, boolean schemas,
// `if`/`then`/`else`, `unevaluatedProperties`, etc.). The tool registers
// successfully but every call rejects with `Invalid schema for function`.
//
// `sanitizeOpenAISchema` mirrors the lowering pass Codex / opencode ship
// (opencode #32489, port of Codex's Rust schema compatibility layer).
// It drops unsupported keywords, rewrites `const` -> `enum`, infers a
// missing `type` from neighbouring keywords, and keeps `$ref` / `description`
// verbatim so downstream registration only ever sees the OpenAI-supported
// JSON Schema subset.
//
// Important: `sanitizeOpenAISchema` does NOT mutate its input. It always
// produces a new object so the cached `McpToolInfo.inputSchema` is safe to
// reuse for non-OpenAI deployments in the same process.

type JsonRecord = Record<string, unknown>;

const OPENAI_SCHEMA_TYPES = [
  'string',
  'number',
  'boolean',
  'integer',
  'object',
  'array',
  'null',
] as const;

const OPENAI_COMPOSITION_KEYS = ['anyOf', 'oneOf', 'allOf'] as const;

function isPlainObject(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Lower a JSON Schema fragment to the subset OpenAI's function-tool
 * registration accepts. Mirrors the Codex / opencode lowering verbatim.
 *
 * Rules (in order):
 *  - Boolean schemas (`true`/`false`) -> `{ type: 'string' }` (matches
 *    opencode's choice; OpenAI rejects boolean schemas outright).
 *  - Arrays are mapped element-wise (covers `prefixItems`-style tuple
 *    `items: [...]`).
 *  - Non-objects pass through.
 *  - `$ref` and `description` preserved verbatim.
 *  - `const: X` folded into `enum: [X]`.
 *  - `properties` recursed with key order preserved.
 *  - `required` filtered to string entries only.
 *  - `items` recursed (handles both single-schema and tuple forms).
 *  - `additionalProperties` recursed when it is a schema; booleans pass
 *    through untouched.
 *  - `anyOf` / `oneOf` / `allOf` each recursed element-wise.
 *  - `$defs` and `definitions` recursed value-wise.
 *  - `type` filtered against the OpenAI-accepted set.
 *  - Type inferred from neighbouring keywords when absent
 *    (`properties`/`required`/`additionalProperties` -> object;
 *    `items`/`prefixItems` -> array; `format`/`enum` -> string;
 *    numeric range keywords -> number).
 *  - Object schemas without `properties` get `properties: {}` and array
 *    schemas without `items` get `items: { type: 'string' }` so the
 *    registration call site never sees a half-formed schema.
 *
 * @param value - The schema fragment to lower
 * @returns A new schema value that uses only OpenAI-supported keywords
 */
export function sanitizeOpenAISchema(value: unknown): unknown {
  // JSON Schema's boolean form (`true`/`false`) is unsupported by OpenAI
  // tool schemas; opencode rewrites both to `{ type: 'string' }`.
  if (typeof value === 'boolean') {
    return { type: 'string' };
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeOpenAISchema);
  }
  if (!isPlainObject(value)) {
    return value;
  }

  const result: JsonRecord = {};

  if (typeof value.$ref === 'string') {
    result.$ref = value.$ref;
  }
  if (typeof value.description === 'string') {
    result.description = value.description;
  }
  if ('const' in value) {
    result.enum = [value.const];
  } else if (Array.isArray(value.enum)) {
    result.enum = value.enum;
  }

  if (isPlainObject(value.properties)) {
    result.properties = Object.fromEntries(
      Object.entries(value.properties).map(([key, item]) => [key, sanitizeOpenAISchema(item)])
    );
  }

  if (Array.isArray(value.required)) {
    result.required = value.required.filter((item): item is string => typeof item === 'string');
  }

  if ('items' in value) {
    result.items = sanitizeOpenAISchema(value.items);
  }

  if ('additionalProperties' in value) {
    result.additionalProperties =
      typeof value.additionalProperties === 'boolean'
        ? value.additionalProperties
        : sanitizeOpenAISchema(value.additionalProperties);
  }

  for (const key of OPENAI_COMPOSITION_KEYS) {
    const composition = value[key];
    if (Array.isArray(composition)) {
      result[key] = composition.map(sanitizeOpenAISchema);
    }
  }

  for (const key of ['$defs', 'definitions'] as const) {
    const defs = value[key];
    if (isPlainObject(defs)) {
      result[key] = Object.fromEntries(
        Object.entries(defs).map(([name, item]) => [name, sanitizeOpenAISchema(item)])
      );
    }
  }

  // Filter declared types against the OpenAI-accepted set.
  const declaredType = value.type;
  const schemaTypes: string[] =
    typeof declaredType === 'string'
      ? (OPENAI_SCHEMA_TYPES as readonly string[]).includes(declaredType)
        ? [declaredType]
        : []
      : Array.isArray(declaredType)
        ? declaredType.filter(
            (item): item is string =>
              typeof item === 'string' && (OPENAI_SCHEMA_TYPES as readonly string[]).includes(item)
          )
        : [];

  // If the schema is a pure $ref or pure composition, the type is implicit
  // and we should not invent one.
  if (
    schemaTypes.length === 0 &&
    (typeof result.$ref === 'string' || OPENAI_COMPOSITION_KEYS.some((key) => key in result))
  ) {
    return result;
  }

  // Infer `type` from neighbouring keywords when absent. MCP servers in the
  // wild routinely emit `properties` without `type: 'object'` or `items`
  // without `type: 'array'`.
  const inferredTypes: string[] =
    schemaTypes.length > 0
      ? schemaTypes
      : ['properties', 'required', 'additionalProperties'].some((key) => key in value)
        ? ['object']
        : ['items', 'prefixItems'].some((key) => key in value)
          ? ['array']
          : 'enum' in result || 'format' in value
            ? ['string']
            : ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf'].some(
                  (key) => key in value
                )
              ? ['number']
              : [];

  if (inferredTypes.length === 0) {
    return {};
  }

  result.type = inferredTypes.length === 1 ? inferredTypes[0] : inferredTypes;
  if (inferredTypes.includes('object') && !('properties' in result)) {
    result.properties = {};
  }
  if (inferredTypes.includes('array') && !('items' in result)) {
    result.items = { type: 'string' };
  }
  return result;
}

/**
 * Provider metadata hint used to detect OpenAI-shaped tool-call wire formats.
 * Mirrors opencode's `Provider.Model.api.npm` shape so the same fixtures port
 * 1:1 from upstream.
 */
export interface OpenAIShapeProviderMeta {
  /** AI SDK package id, e.g. `@ai-sdk/openai`, `@ai-sdk/azure`. */
  sdk?: string;
}

/**
 * Returns true when a model id (or its provider metadata) indicates the
 * deployment uses the OpenAI function-tool wire format. Used to decide
 * whether MCP `inputSchema` payloads must be lowered through
 * `sanitizeOpenAISchema` before serialization.
 *
 * Detection rules (any match wins):
 *  - `model` matches `/^(gpt-|o[13]-)/i` (OpenAI naming convention used by
 *    SAP AI Core OpenAI deployments).
 *  - `providerMeta.sdk` is `@ai-sdk/openai` or `@ai-sdk/azure`.
 *
 * @param model - The model id string
 * @param providerMeta - Optional provider metadata
 * @returns true if the deployment expects OpenAI-shaped tool schemas
 */
export function isOpenAIShapedModel(
  model: string,
  providerMeta?: OpenAIShapeProviderMeta
): boolean {
  if (providerMeta?.sdk === '@ai-sdk/openai' || providerMeta?.sdk === '@ai-sdk/azure') {
    return true;
  }
  return /^(gpt-|o[13]-)/i.test(model);
}

/**
 * Minimal MCP tool shape consumed by `lowerMcpToolsForOpenAIShaped`. Mirrors
 * `McpToolInfo` from `src/mcp/client.ts` without importing it (keeps this
 * module free of MCP-side type coupling).
 */
export interface McpToolForLowering {
  name: string;
  description?: string;
  inputSchema: unknown;
  serverName?: string;
}

/**
 * Lower a list of MCP tool descriptors for serialization against an
 * OpenAI-shaped deployment. Returns NEW objects per call so the cached
 * `McpToolInfo` in `McpClientManager` is never mutated.
 *
 * If `model` is not OpenAI-shaped (e.g. `anthropic--claude-4.5-sonnet`),
 * the tools pass through untouched — non-OpenAI SAP AI Core deployments
 * accept JSON Schema 2020-12 fine and the lowering would strip
 * semantically meaningful constraints.
 *
 * Call site responsibility: invoke this immediately before assembling the
 * `tools: ChatCompletionTool[]` payload for the chat completion request.
 *
 * @param tools - MCP tool descriptors
 * @param model - The target model id
 * @param providerMeta - Optional provider metadata hint
 * @returns A new array of tool descriptors with lowered `inputSchema` when
 *   the deployment is OpenAI-shaped, or the original array reference when
 *   the deployment is not OpenAI-shaped.
 */
export function lowerMcpToolsForOpenAIShaped<T extends McpToolForLowering>(
  tools: readonly T[],
  model: string,
  providerMeta?: OpenAIShapeProviderMeta
): T[] {
  if (!isOpenAIShapedModel(model, providerMeta)) {
    // Non-OpenAI deployments: return a shallow copy so the caller can treat
    // the result as owned, but do NOT touch the cached schema objects.
    return tools.slice() as T[];
  }
  return tools.map(
    (tool) =>
      ({
        ...tool,
        inputSchema: sanitizeOpenAISchema(tool.inputSchema),
      }) as T
  );
}
