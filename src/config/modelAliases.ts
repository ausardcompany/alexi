/**
 * Model alias resolution.
 *
 * Users repeatedly type long SAP AI Core model ids like
 * `sap-ai-core/anthropic--claude-4.7-opus` on the CLI and in config files.
 * The `modelAliases` section of `routing-config.json` lets operators map
 * short names to the canonical ids, e.g.:
 *
 *   {
 *     "modelAliases": {
 *       "opus":   "sap-ai-core/anthropic--claude-4.7-opus",
 *       "sonnet": "sap-ai-core/anthropic--claude-4.5-sonnet",
 *       "haiku":  "sap-ai-core/anthropic--claude-4.5-haiku"
 *     }
 *   }
 *
 * Resolution is recursive (an alias may point at another alias) with a
 * hard depth cap to detect pathological chains / cycles.
 */

import { logger } from '../utils/logger.js';
import { isOrchestrationModel } from '../providers/sapOrchestration.js';

/** Maximum recursion depth when resolving nested aliases. */
export const MAX_ALIAS_DEPTH = 5;

/**
 * Error thrown when alias resolution encounters a circular reference.
 *
 * The `chain` field records the resolution path (including the repeated
 * node at the end) so callers can surface a helpful error message, e.g.
 *   `a -> b -> c -> a`
 */
export class CircularAliasError extends Error {
  public readonly chain: string[];

  constructor(chain: string[]) {
    super(`Circular model alias detected: ${chain.join(' -> ')}`);
    this.name = 'CircularAliasError';
    this.chain = chain;
  }
}

/**
 * Resolve a possibly-aliased model name to its canonical id.
 *
 * - If `nameOrAlias` is not a key in `aliases`, it is returned unchanged.
 * - If `nameOrAlias` resolves recursively, each hop is followed up to
 *   {@link MAX_ALIAS_DEPTH} times.
 * - A cycle (`a -> b -> a`) throws {@link CircularAliasError}.
 * - Exceeding {@link MAX_ALIAS_DEPTH} without reaching a non-alias also
 *   throws {@link CircularAliasError} — in practice this is only reached
 *   when the chain forms a cycle, since a legitimate chain this long is
 *   essentially never useful.
 *
 * The resolution is case-sensitive. Keys are stripped of surrounding
 * whitespace before lookup; empty / whitespace-only values are ignored
 * (treated as "no alias").
 */
export function resolveModelAlias(
  nameOrAlias: string,
  aliases: Record<string, string> | undefined
): string {
  const start = typeof nameOrAlias === 'string' ? nameOrAlias.trim() : '';
  if (!start) {
    return nameOrAlias;
  }
  if (!aliases || typeof aliases !== 'object') {
    return start;
  }

  const seen: string[] = [start];
  let current = start;

  for (let depth = 0; depth < MAX_ALIAS_DEPTH; depth++) {
    const next = aliases[current];
    if (typeof next !== 'string') {
      return current;
    }
    const trimmed = next.trim();
    if (trimmed.length === 0) {
      return current;
    }
    if (trimmed === current) {
      // Self-reference is a trivial cycle.
      throw new CircularAliasError([...seen, trimmed]);
    }
    if (seen.includes(trimmed)) {
      throw new CircularAliasError([...seen, trimmed]);
    }
    seen.push(trimmed);
    current = trimmed;
  }

  // Reached max depth without converging on a non-alias — treat as cycle.
  throw new CircularAliasError([...seen, '...']);
}

/**
 * Validate an alias map and emit warnings for:
 *   - keys that collide with real SAP orchestration model ids (the alias
 *     will shadow the real id when `resolveModelAlias` is called on it)
 *   - values that are empty strings
 *   - cycles
 *
 * Returns a list of alias keys that failed validation. The intent is to
 * fail soft: a bad entry logs a warning and is skipped, rather than
 * breaking the whole chat pipeline.
 *
 * Pure function: the only side effect is `logger.warn` output.
 */
export function validateModelAliases(aliases: Record<string, string> | undefined): string[] {
  const invalid: string[] = [];
  if (!aliases || typeof aliases !== 'object') {
    return invalid;
  }

  for (const [key, value] of Object.entries(aliases)) {
    const trimmedKey = key.trim();
    if (trimmedKey.length === 0) {
      logger.warn(`Model alias: ignoring empty alias key`);
      invalid.push(key);
      continue;
    }
    if (typeof value !== 'string' || value.trim().length === 0) {
      logger.warn(`Model alias '${trimmedKey}': value is empty, ignoring`);
      invalid.push(key);
      continue;
    }
    if (isOrchestrationModel(trimmedKey)) {
      // Not fatal — alias still works — but surface the shadowing so
      // operators don't wonder why a real model id "doesn't work" when
      // they typo'd a key.
      logger.warn(
        `Model alias '${trimmedKey}' shadows a real SAP orchestration model id; ` +
          `the alias will take precedence when passed through resolveModelAlias.`
      );
    }
    try {
      resolveModelAlias(trimmedKey, aliases);
    } catch (err) {
      if (err instanceof CircularAliasError) {
        logger.warn(`Model alias '${trimmedKey}': ${err.message}`);
        invalid.push(key);
      } else {
        throw err;
      }
    }
  }

  return invalid;
}
