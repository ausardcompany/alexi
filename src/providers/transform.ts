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

// ============================================================================
// Image response transforms (issue #1389)
// ============================================================================
//
// SAP AI Core orchestration is planned to expose chat models with image
// generation via streaming responses. The SDK surfaces image payloads in
// two shapes depending on the underlying provider:
//   - URL form: `{ type: 'image_url', image_url: { url: '<https://...>' } }`
//     (OpenAI-style — GPT image and dedicated image endpoints).
//   - Base64 form: `{ type: 'image', image: { b64_json?, data?, mime_type? } }`
//     (Anthropic and Gemini-style — the payload is a base64-encoded blob
//     with a MIME type, no hosted URL).
//
// `extractImageChunk` normalises both shapes into a discriminated union
// so downstream code (the TUI image renderer, the session log serializer)
// can handle either without re-parsing the raw SDK payload. Callers gate
// on `modelHasCapability(modelId, 'image-generation')` before invoking
// this transform.

/**
 * Normalised image payload extracted from a streaming chunk.
 *
 * The two variants are structurally identical apart from the `kind`
 * discriminator; consumers narrow on `kind` to know whether to render
 * a remote URL or decode the base64 blob.
 */
export type NormalizedImageChunk =
  | { kind: 'url'; url: string; mimeType?: string }
  | { kind: 'base64'; data: string; mimeType?: string };

/**
 * Attempt to extract a normalised image payload from an SDK streaming
 * chunk item. Returns `undefined` when the item does not look like an
 * image (text delta, tool call, structural marker, ...) or when the
 * required fields are missing.
 *
 * The two supported shapes:
 *   - `type: 'image_url'` with `image_url.url` (OpenAI-style, hosted URL).
 *     Optional `image_url.mime_type` is preserved when present.
 *   - `type: 'image'` with either `image.b64_json` or `image.data` holding
 *     the base64 payload (Anthropic / Gemini-style). Optional
 *     `image.mime_type` is preserved.
 *
 * The extractor is deliberately permissive on the wrapping object type
 * (`unknown`) so it composes with the loosely-typed SAP SDK stream chunk
 * without a full interface duplication. Non-string URL / data fields are
 * rejected to guard against upstream schema drift.
 */
export function extractImageChunk(item: unknown): NormalizedImageChunk | undefined {
  if (item === null || item === undefined || typeof item !== 'object') {
    return undefined;
  }
  const rec = item as Record<string, unknown>;
  const type = rec.type;

  if (type === 'image_url') {
    const imageUrl = rec.image_url;
    if (!imageUrl || typeof imageUrl !== 'object') {
      return undefined;
    }
    const urlField = (imageUrl as Record<string, unknown>).url;
    if (typeof urlField !== 'string' || urlField.length === 0) {
      return undefined;
    }
    const mimeField = (imageUrl as Record<string, unknown>).mime_type;
    const result: NormalizedImageChunk = { kind: 'url', url: urlField };
    if (typeof mimeField === 'string' && mimeField.length > 0) {
      result.mimeType = mimeField;
    }
    return result;
  }

  if (type === 'image') {
    const image = rec.image;
    if (!image || typeof image !== 'object') {
      return undefined;
    }
    const imageRec = image as Record<string, unknown>;
    // Anthropic uses `b64_json`; Gemini uses `data`. Accept either.
    const b64 = imageRec.b64_json ?? imageRec.data;
    if (typeof b64 !== 'string' || b64.length === 0) {
      return undefined;
    }
    const mimeField = imageRec.mime_type;
    const result: NormalizedImageChunk = { kind: 'base64', data: b64 };
    if (typeof mimeField === 'string' && mimeField.length > 0) {
      result.mimeType = mimeField;
    }
    return result;
  }

  return undefined;
}

/**
 * Walk an arbitrary streaming payload (single item or array of items) and
 * return the normalised image chunks it contains, in order. Non-image
 * items are skipped. Returns an empty array when the payload holds no
 * recognisable image content.
 *
 * Accepts `unknown` on purpose: the SAP SDK exposes streaming content as
 * a loosely-typed union (`string | Array<{ type; ... }>`), and callers
 * routinely feed the raw `delta.content` field.
 */
export function extractImageChunks(content: unknown): NormalizedImageChunk[] {
  if (content === null || content === undefined) {
    return [];
  }
  const items = Array.isArray(content) ? content : [content];
  const out: NormalizedImageChunk[] = [];
  for (const item of items) {
    const chunk = extractImageChunk(item);
    if (chunk) {
      out.push(chunk);
    }
  }
  return out;
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

// ============================================================================
// OpenAI Responses strict-mode schema enforcement
// ============================================================================
//
// SAP-routed OpenAI Responses deployments (`gpt-5.5`, `gpt-nano`,
// `claude-haiku`) enforce a strict-mode JSON Schema contract on function-tool
// parameters when the tool is registered with `strict: true`:
//
//   - Every object node MUST set `additionalProperties: false`.
//   - Every object node's `required` array MUST list every key declared in
//     `properties` (no optional properties).
//
// `enforceStrictSchema` recursively rewrites a JSON Schema fragment to
// satisfy that contract. It is intentionally narrow: only nodes that have
// a `properties` key are treated as object nodes; leaves, refs, arrays,
// and composition wrappers are recursed into but otherwise pass through.
//
// Like `sanitizeOpenAISchema`, this function NEVER mutates its input. It
// always returns a new object so the same source schema can still be used
// for non-strict deployments in the same process.
//
// Callers MUST gate on `strict === true` from the tool definition (issue
// #856 threads the flag through `ToolDefinition`/`Tool`). Applying this
// transform unconditionally would over-constrain anthropic-routed tools
// that accept loose schemas and reject `additionalProperties: false`.

/**
 * Enforce the OpenAI Responses strict-mode contract on a JSON Schema
 * fragment. For every object node (any node with a `properties` key) the
 * returned schema will have:
 *
 *   - `additionalProperties: false`
 *   - `required` containing every key declared in `properties`, in the
 *     order the keys appear in `properties`
 *
 * Recursion targets:
 *   - `properties` (each value)
 *   - `items` (single schema or tuple form)
 *   - `additionalProperties` when it is a schema (booleans pass through;
 *     boolean values are overwritten by the `false` injection above when
 *     the enclosing node is an object node)
 *   - `anyOf` / `oneOf` / `allOf` (each element)
 *   - `$defs` / `definitions` (each value)
 *
 * Pass-through cases (returned by reference for primitives, deep-copied
 * for arrays / records):
 *   - Primitives (`string`, `number`, `boolean`, `null`, `undefined`)
 *   - Arrays (mapped element-wise into a new array)
 *   - Object nodes WITHOUT a `properties` key (`$ref`-only, leaves with
 *     just `type: 'string'`, etc.) — recursed into so nested objects are
 *     still enforced, but the node itself is not given
 *     `additionalProperties: false` because it is not an object schema.
 *
 * @param value - The JSON Schema fragment to enforce
 * @returns A new schema value satisfying the strict-mode contract on every
 *   object node, with all other nodes passed through unchanged
 */
export function enforceStrictSchema(value: unknown): unknown {
  // Primitives (string, number, boolean, null, undefined) pass through.
  if (!isPlainObject(value) && !Array.isArray(value)) {
    return value;
  }

  // Arrays: recurse element-wise into a new array.
  if (Array.isArray(value)) {
    return value.map((item) => enforceStrictSchema(item));
  }

  // Plain object: recurse into every recognised schema-bearing keyword,
  // copying the node so the input is never mutated. We always return a
  // new object even when no field changes, to give callers a deep,
  // reference-distinct copy they can mutate freely downstream.
  const result: JsonRecord = {};

  for (const [key, item] of Object.entries(value)) {
    if (key === 'properties' && isPlainObject(item)) {
      result.properties = Object.fromEntries(
        Object.entries(item).map(([propKey, propValue]) => [
          propKey,
          enforceStrictSchema(propValue),
        ])
      );
      continue;
    }

    if (key === 'items') {
      // `items` may be a single schema or a tuple-form array of schemas.
      result.items = enforceStrictSchema(item);
      continue;
    }

    if (key === 'additionalProperties') {
      // Schema form recurses; boolean form passes through. If this node
      // also has `properties`, the boolean will be overwritten to `false`
      // below.
      result.additionalProperties = typeof item === 'boolean' ? item : enforceStrictSchema(item);
      continue;
    }

    if ((key === 'anyOf' || key === 'oneOf' || key === 'allOf') && Array.isArray(item)) {
      result[key] = item.map((branch) => enforceStrictSchema(branch));
      continue;
    }

    if ((key === '$defs' || key === 'definitions') && isPlainObject(item)) {
      result[key] = Object.fromEntries(
        Object.entries(item).map(([defName, defValue]) => [defName, enforceStrictSchema(defValue)])
      );
      continue;
    }

    // All other keys (type, description, enum, format, $ref, minimum, ...)
    // pass through verbatim. Arrays/objects buried inside unknown keywords
    // are not recursed — the strict contract only governs schema-bearing
    // keywords listed above.
    result[key] = item;
  }

  // If this node is an object schema (has a `properties` key), enforce
  // `additionalProperties: false` and `required = keys(properties)`.
  // The presence of `properties` is the discriminant — a node with only
  // `$ref`, only a primitive `type`, or only composition keywords is not
  // an object schema and must NOT be augmented (over-constraining
  // pass-through nodes would break the upstream Codex parity contract).
  if (isPlainObject(result.properties)) {
    result.additionalProperties = false;
    result.required = Object.keys(result.properties);
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

// ============================================================================
// Reasoning-variant derivation & base/custom model merge
// ============================================================================
//
// Ports kilocode upstream `031ea2feb` — "preserve base model variants
// alongside custom provider fallback". Without this, reasoning variants
// (Grok reasoning, Kimi adaptive effort, GPT-5.x reasoning modes) get
// dropped when a custom provider (e.g. a SAP AI Core deployment that
// wraps a base model) overrides them.
//
// Two helpers:
//   1. `deriveReasoningVariants` — given a base model with a set of
//      reasoning efforts, produce one entry per effort (`gpt-5`,
//      `gpt-5-low`, `gpt-5-medium`, `gpt-5-high`) so downstream code
//      can pick the effort explicitly.
//   2. `mergeProviderModels` — merge a custom provider's `models` on top
//      of a base provider's `models` without wiping the base variants.
//      Custom overrides win per-id; base variants only survive when
//      the custom map does not define the same id.

/**
 * Minimal shape of a model descriptor consumed by the variant helpers.
 * Structural type kept deliberately loose so callers using either the
 * SAP orchestration model records or a custom `ModelInfo` shape can
 * both use these helpers without a coercion.
 */
export interface ModelInfoLike {
  id: string;
  variant?: string;
  reasoning?: {
    /** Available effort names, e.g. `['low', 'medium', 'high']`. */
    efforts?: readonly string[];
    /** Effort chosen when none is provided at call time. */
    defaultEffort?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Derive reasoning variants for a base model. Returns the base model
 * itself followed by one variant per available effort (id suffixed with
 * `-<effort>`). When the model has no `reasoning.efforts` the base is
 * returned unchanged.
 *
 * Never mutates its input.
 */
export function deriveReasoningVariants<T extends ModelInfoLike>(model: T): T[] {
  const efforts = model.reasoning?.efforts;
  if (!efforts || efforts.length === 0) {
    return [model];
  }
  const variants: T[] = [model];
  for (const effort of efforts) {
    variants.push({
      ...model,
      id: `${model.id}-${effort}`,
      variant: effort,
      reasoning: { ...model.reasoning, defaultEffort: effort },
    } as T);
  }
  return variants;
}

/**
 * Merge a custom provider's model map on top of a base provider's model
 * map. Custom entries win per-id; base variants (e.g. `-reasoning-high`)
 * survive when the custom map does not redefine the same id. This is
 * the fix behaviour from kilocode `031ea2feb` — previously the custom
 * map replaced the base map wholesale and reasoning variants
 * disappeared.
 */
export function mergeProviderModels<T>(
  base: Readonly<Record<string, T>> | undefined,
  custom: Readonly<Record<string, T>> | undefined
): Record<string, T> {
  return {
    ...(base ?? {}),
    ...(custom ?? {}),
  };
}
