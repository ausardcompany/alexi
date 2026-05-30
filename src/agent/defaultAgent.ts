/**
 * Default Agent Resolution
 *
 * Determines which agent slug to use for a given CLI invocation.
 *
 * Precedence (highest → lowest):
 *   1. `--agent <name>` CLI flag (per-invocation override)
 *   2. `agent` field in ~/.alexi/config.json (user default)
 *   3. `undefined` — caller falls through to its own default
 *
 * If a slug is resolved but does not exist in the agent registry,
 * a warning is logged and `undefined` is returned (no throw).
 */

import { getAgentRegistry } from './index.js';
import { logger } from '../utils/logger.js';

export interface ResolveDefaultAgentInput {
  /** Slug supplied via CLI flag (e.g. `--agent debug`) */
  cliFlag?: string;
  /** Slug persisted in user config (`agent` key in config.json) */
  configValue?: string;
  /**
   * Working directory used to discover project-local custom agents.
   * Defaults to `process.cwd()` when omitted.
   */
  workdir?: string;
}

/**
 * Pure precedence resolver — picks the slug to use without validating
 * that it exists in the registry.
 *
 * Trims values and treats empty/whitespace-only strings as absent.
 *
 * Exported for unit testing.
 */
export function pickAgentSlug(input: ResolveDefaultAgentInput): string | undefined {
  const cli = input.cliFlag?.trim();
  if (cli && cli.length > 0) {
    return cli;
  }

  const cfg = input.configValue?.trim();
  if (cfg && cfg.length > 0) {
    return cfg;
  }

  return undefined;
}

/**
 * Resolve the default agent slug for an invocation, validating against
 * the agent registry.
 *
 * Returns `undefined` when no slug is set at any level, or when the
 * resolved slug does not match any registered agent (built-in or
 * custom) — in which case a warning is logged via the shared logger.
 *
 * Custom agents are loaded lazily from `~/.alexi/agents/` and
 * `<workdir>/.alexi/agents/` before validation so user-defined slugs
 * are recognized.
 *
 * Callers should pass the result as the `agentId` option to
 * `agenticChat()`.
 */
export async function resolveDefaultAgent(
  input: ResolveDefaultAgentInput
): Promise<string | undefined> {
  const slug = pickAgentSlug(input);
  if (!slug) {
    return undefined;
  }

  const registry = getAgentRegistry();

  // Load custom agents on demand so user-defined slugs are resolvable.
  // Failures here are non-fatal: built-in agents remain available.
  if (!registry.get(slug)) {
    try {
      await registry.loadCustomAgents(input.workdir);
    } catch (err) {
      logger.warn(
        `Failed to load custom agents while resolving '${slug}': ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  const agent = registry.get(slug);
  if (!agent) {
    logger.warn(`Unknown agent '${slug}' — falling back to default agent`);
    return undefined;
  }

  return agent.id;
}
