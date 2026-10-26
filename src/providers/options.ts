/**
 * Provider option-key derivation (opencode `490456d` port).
 *
 * Problem: upstream opencode previously maintained a hand-rolled list of
 * known provider option keys (e.g. `anthropic.cacheControl`,
 * `openai.cacheBreakpoint`, `bedrock.reasoning_effort`). Every new
 * provider feature required a drift-prone touch to this list; forgetting
 * to update it caused the orchestrator to silently drop the option when
 * routing a request. The upstream fix derives the key set from the Zod
 * settings schema instead, so adding a new field automatically threads
 * through the wiring layer.
 *
 * This module exports:
 *   - {@link deriveProviderOptionKeys}: given a Zod object schema whose
 *     fields are provider-id → provider-settings-object, return a map
 *     of provider id → `Set<string>` of valid option keys.
 *   - {@link filterProviderOptions}: trim a provider-options bag down to
 *     the keys the schema admits, so the request builder never ships an
 *     unknown field to a provider that would reject it.
 *
 * No runtime schema is defined here — callers (SAP orchestration,
 * direct Anthropic / OpenAI / Bedrock paths) pass in their own schema
 * so this module stays independent of provider-specific type bundles.
 */

import { z } from 'zod';

/**
 * Settings-schema shape: a Zod object whose fields are themselves Zod
 * object schemas. The outer keys are provider ids; the inner keys are
 * the valid option names for that provider.
 */
export type ProviderSettingsSchema = z.ZodObject<
  Record<
    string,
    | z.ZodObject<Record<string, z.ZodTypeAny>>
    | z.ZodOptional<z.ZodObject<Record<string, z.ZodTypeAny>>>
  >
>;

/**
 * Extract the Zod object schema from a (possibly optional) wrapper so
 * the shape is reachable regardless of how the caller declared it.
 */
function unwrapObjectSchema(
  schema: z.ZodTypeAny
): z.ZodObject<Record<string, z.ZodTypeAny>> | undefined {
  // Peel optional / nullable / default wrappers that would hide the inner object.
  let cursor: z.ZodTypeAny = schema;
  while (
    cursor instanceof z.ZodOptional ||
    cursor instanceof z.ZodNullable ||
    cursor instanceof z.ZodDefault
  ) {
    cursor = (cursor as unknown as { _def: { innerType: z.ZodTypeAny } })._def.innerType;
  }
  if (cursor instanceof z.ZodObject) {
    return cursor as z.ZodObject<Record<string, z.ZodTypeAny>>;
  }
  return undefined;
}

/**
 * Derive the set of valid option keys for each provider from a settings
 * schema. The returned map is read-only — callers must not mutate it,
 * since multiple request builders typically share a single derivation.
 */
export function deriveProviderOptionKeys(
  schema: ProviderSettingsSchema
): ReadonlyMap<string, ReadonlySet<string>> {
  const result = new Map<string, ReadonlySet<string>>();
  const shape = schema.shape as Record<string, z.ZodTypeAny>;
  for (const [providerId, providerSchema] of Object.entries(shape)) {
    const inner = unwrapObjectSchema(providerSchema);
    if (!inner) {
      continue;
    }
    const keys = Object.keys(inner.shape as Record<string, z.ZodTypeAny>);
    result.set(providerId, new Set(keys));
  }
  return result;
}

/**
 * Filter a provider-options bag down to the keys the schema admits for
 * `providerId`. Unknown keys are dropped silently — the caller gets a
 * fresh object so the input bag is not mutated.
 *
 * Returns the original bag unchanged when the provider has no entry in
 * the derived key map (unknown providers pass through verbatim so a
 * caller using a bespoke extension does not have its options stripped).
 */
export function filterProviderOptions(
  providerId: string,
  options: Readonly<Record<string, unknown>>,
  keyMap: ReadonlyMap<string, ReadonlySet<string>>
): Record<string, unknown> {
  const validKeys = keyMap.get(providerId);
  if (!validKeys) {
    return { ...options };
  }
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(options)) {
    if (validKeys.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}
