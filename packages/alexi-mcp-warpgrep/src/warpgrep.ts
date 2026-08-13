/**
 * WarpGrep core - AI-powered semantic code search.
 *
 * This module is a standalone extraction of the built-in `codebase_search`
 * tool from Alexi. It intentionally has no dependency on Alexi internals
 * (telemetry, tool registry, permission system) so the MCP server can be
 * distributed independently.
 */

import { z } from 'zod';
import type { CodeSpan, WarpGrepOutcome } from './types.js';

/**
 * Zod schema for `codebase_search` parameters. Exported so callers (the MCP
 * server entry point, tests, and downstream integrators) can share a single
 * source of truth.
 */
export const WarpGrepParamsSchema = z.object({
  query: z
    .string()
    .describe(
      'Search query describing what code you are looking for. Be specific and descriptive for best results.'
    ),
});

export type WarpGrepParams = z.infer<typeof WarpGrepParamsSchema>;

/**
 * Tool description shown to LLM clients via `tools/list`. Kept in sync with
 * the built-in tool description in `alexi/src/tool/tools/warpgrep.ts` so a
 * client migrating from built-in to MCP sees identical guidance.
 */
export const WARPGREP_DESCRIPTION = `Find code snippets by semantic meaning and return ranked matches with file paths and line ranges.

## When to use

- Explore an unfamiliar code area before you know exact identifiers
- Find related implementations of a concept or behavior across the workspace
- Search by intent such as authentication, caching, or session resume logic
- Narrow a large codebase before following up with \`Read\` or \`Grep\`

## When NOT to use

- Search for an exact symbol or regex pattern - use \`Grep\`
- Find files by filename or extension - use \`Glob\`
- Read the contents of a known file - use \`Read\`
- Explore files outside the current workspace - use \`Grep\`, \`Glob\`, and \`Read\`

## Constraints

- Write the query in English.`;

/**
 * FREE_PERIOD_TODO: Remove KILO_WARPGREP_PROXY_URL constant and the proxy
 * fallback below. After the free period ends, require MORPH_API_KEY and
 * return an error when it is missing.
 */
const KILO_WARPGREP_PROXY_URL = 'https://api.kilo.ai/api/gateway';

/**
 * Injection point for `@morphllm/morphsdk`. Kept as a module-level function
 * so tests can override it via `setWarpgrepClientLoader` without needing to
 * mock the ESM module graph.
 */
type WarpGrepClientCtor = new (config: {
  morphApiKey: string;
  morphApiUrl?: string;
  timeout?: number;
}) => {
  execute: (input: {
    searchTerm: string;
    repoRoot: string;
  }) => Promise<{ success: boolean; error?: string; codeSpans?: CodeSpan[] }>;
};

let clientLoader: () => Promise<WarpGrepClientCtor | null> = async () => {
  try {
    // `@morphllm/morphsdk` is an optional peer dependency; the standard
    // dynamic import path returns `null` when it is not installed so the
    // MCP server can respond with a helpful error instead of crashing.
    const morphSDK = (await import(
      // @ts-expect-error - optional peer dep, not resolvable at build time
      '@morphllm/morphsdk'
    )) as { WarpGrepClient?: WarpGrepClientCtor };
    return morphSDK.WarpGrepClient ?? null;
  } catch {
    return null;
  }
};

/**
 * Override the loader used to obtain the `WarpGrepClient` constructor.
 * Primarily for tests that want to inject a stub without touching the
 * module graph.
 */
export function setWarpgrepClientLoader(
  loader: () => Promise<WarpGrepClientCtor | null>
): void {
  clientLoader = loader;
}

/**
 * Reset the client loader to the default `@morphllm/morphsdk` dynamic
 * import. Use in test `afterEach` blocks to isolate mocks.
 */
export function resetWarpgrepClientLoader(): void {
  clientLoader = async () => {
    try {
      const morphSDK = (await import(
        // @ts-expect-error - optional peer dep, not resolvable at build time
        '@morphllm/morphsdk'
      )) as { WarpGrepClient?: WarpGrepClientCtor };
      return morphSDK.WarpGrepClient ?? null;
    } catch {
      return null;
    }
  };
}

/**
 * Check whether `@morphllm/morphsdk` can be resolved at runtime. Returns
 * true when the package is installed and importable, false otherwise.
 */
export function isWarpgrepAvailable(): boolean {
  try {
    // `import.meta.resolve` is synchronous in Node >= 20.
    import.meta.resolve('@morphllm/morphsdk');
    return true;
  } catch {
    return false;
  }
}

/**
 * Execute a semantic code search using WarpGrep.
 *
 * @param params - Parsed `WarpGrepParams` (the schema is enforced by the
 *   MCP layer, but this function also parses to stay usable standalone).
 * @param opts.repoRoot - Absolute path to the repository root to search.
 *   Defaults to `process.cwd()`.
 * @returns A `WarpGrepOutcome` discriminated union. Never throws.
 */
export async function warpgrepExecute(
  params: unknown,
  opts: { repoRoot?: string } = {}
): Promise<WarpGrepOutcome> {
  const parsed = WarpGrepParamsSchema.safeParse(params);
  if (!parsed.success) {
    return {
      success: false,
      error: `Invalid parameters: ${parsed.error.message}`,
    };
  }

  const WarpGrepClient = await clientLoader();
  if (!WarpGrepClient) {
    return {
      success: false,
      error:
        'WarpGrep requires @morphllm/morphsdk to be installed. Run: npm install @morphllm/morphsdk',
    };
  }

  const apiKey = process.env['MORPH_API_KEY'];
  const repoRoot = opts.repoRoot ?? process.cwd();

  // FREE_PERIOD_TODO: Remove proxy fallback - require apiKey, error if missing.
  const client = new WarpGrepClient({
    morphApiKey: apiKey ?? 'kilo-free',
    ...(apiKey ? {} : { morphApiUrl: KILO_WARPGREP_PROXY_URL }),
    timeout: 60000,
  });

  try {
    const result = await client.execute({
      searchTerm: parsed.data.query,
      repoRoot,
    });

    if (!result.success) {
      return {
        success: false,
        error: `Search failed: ${result.error ?? 'Unknown error'}`,
      };
    }

    const spans: CodeSpan[] = result.codeSpans ?? [];

    if (spans.length === 0) {
      return {
        success: true,
        data: { spans: [], query: parsed.data.query },
        hint: 'No relevant code found for the given query.',
      };
    }

    return {
      success: true,
      data: { spans, query: parsed.data.query },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `WarpGrep search failed: ${message}`,
    };
  }
}
