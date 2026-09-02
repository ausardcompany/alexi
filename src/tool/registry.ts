/**
 * Enhanced Tool Registry with Prompt Tool Resolution
 * Based on opencode refactor(session): extract prompt tool resolution
 */
import type { Tool } from './index.js';

// Alexi_change: re-export SessionDrain so ported call sites can import it
// through the tool registry surface, mirroring upstream opencode where
// `SessionDrain.node` is registered inside the tool registry LayerNode.
// Alexi's runtime does not use Effect-TS LayerNodes, so the "registration"
// here is a module-level singleton import (side effect: constructor runs).
// See `src/session/drain.ts` for the drain lifecycle contract.
export { SessionDrain } from '../session/drain.js';

// Updated code based on changes in `packages/core/src/tool/registry.ts` and `packages/opencode/src/tool/registry.ts` from opencode
// Re-export the registry-name accessor used by the permission system to
// cross-check deny-rule tool entries against the actual registered tools.
export { getAllToolNames } from './index.js';

/**
 * Feature flags that force-enable the websearch tool at request time regardless
 * of the calling provider. `exa` / `parallel` are the two upstream OpenCode
 * websearch flags — Alexi keeps the same shape for parity so that shared
 * fixtures and prompt paths ported from upstream continue to work.
 */
export interface WebSearchFlags {
  exa: boolean;
  parallel: boolean;
}

/**
 * Providers that ship websearch out-of-the-box (i.e. the built-in websearch
 * tool is enabled without any explicit `exa`/`parallel` opt-in). Mirrors
 * upstream opencode PR #42630, which added `opencode-go` alongside the
 * original `opencode` provider so the Go rewrite of the OpenCode server gets
 * the same treatment as the Node one.
 *
 * Alexi's default provider is SAP AI Core / SAP Orchestration, which does NOT
 * ship a first-party web search — the built-in `websearch` tool talks directly
 * to DuckDuckGo, and enablement is gated per-provider by this list. Any
 * OpenCode-family provider surfaced through a proxy or wrapper should be
 * listed here so shared prompts light up the same tool.
 */
const WEB_SEARCH_NATIVE_PROVIDERS: ReadonlySet<string> = new Set(['opencode', 'opencode-go']);

/**
 * Return `true` if the built-in websearch tool should be advertised to the
 * model for the given provider id and per-request feature flags.
 *
 * Mirrors upstream `webSearchEnabled(providerID, flags)` in
 * `packages/opencode/src/tool/registry.ts`. Alexi's provider ids are plain
 * strings (see `src/providers/index.ts`) rather than the `ProviderV2.ID`
 * newtype used upstream, so we accept `string` here.
 */
export function webSearchEnabled(
  providerId: string,
  flags: WebSearchFlags = { exa: false, parallel: false }
): boolean {
  return WEB_SEARCH_NATIVE_PROVIDERS.has(providerId) || flags.exa || flags.parallel;
}

export interface ToolResolutionContext {
  sessionId: string;
  agentId?: string;
  permissions: string[];
}

export interface PromptToolResolver {
  resolve(context: ToolResolutionContext): Promise<Tool<any, any>[]>;
}

export class ToolResolutionError extends Error {
  constructor(
    message: string,
    public readonly toolName?: string
  ) {
    super(message);
    this.name = 'ToolResolutionError';
  }
}

/**
 * Enhanced tool registry with dynamic tool resolution
 * Supports both static and prompt-based dynamic tool resolution
 */
export class EnhancedToolRegistry {
  private tools: Map<string, Tool<any, any>> = new Map();
  private promptResolvers: Map<string, PromptToolResolver> = new Map();

  register(tool: Tool<any, any>): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Register a prompt tool resolver for dynamic tool resolution
   * Based on opencode refactor(session): extract prompt tool resolution
   */
  registerPromptResolver(name: string, resolver: PromptToolResolver): void {
    this.promptResolvers.set(name, resolver);
  }

  get(name: string): Tool<any, any> | undefined {
    return this.tools.get(name);
  }

  /**
   * Resolve tools for a given prompt context
   * Handles both static and dynamic tool resolution
   */
  async resolveForPrompt(context: ToolResolutionContext): Promise<Tool<any, any>[]> {
    const resolvedTools: Tool<any, any>[] = [];

    // Add static tools that match permissions
    for (const [_name, tool] of this.tools) {
      if (this.hasPermission(tool, context.permissions)) {
        resolvedTools.push(tool);
      }
    }

    // Resolve dynamic prompt tools
    for (const [_name, resolver] of this.promptResolvers) {
      try {
        const dynamicTools = await resolver.resolve(context);
        resolvedTools.push(...dynamicTools);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new ToolResolutionError(`Failed to resolve prompt tools: ${message}`);
      }
    }

    return resolvedTools;
  }

  private hasPermission(tool: Tool<any, any>, permissions: string[]): boolean {
    // If tool doesn't specify required permissions, allow it
    const requiredPermissions = (tool as any).requiredPermissions;
    if (!requiredPermissions) {
      return true;
    }
    return requiredPermissions.every((p: string) => permissions.includes(p));
  }

  list(): Tool<any, any>[] {
    return Array.from(this.tools.values());
  }

  clear(): void {
    this.tools.clear();
    this.promptResolvers.clear();
  }
}
