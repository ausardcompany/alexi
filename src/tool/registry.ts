/**
 * Enhanced Tool Registry with Prompt Tool Resolution
 * Based on opencode refactor(session): extract prompt tool resolution
 */
import type { Tool } from './index.js';

// Updated code based on changes in `packages/core/src/tool/registry.ts` and `packages/opencode/src/tool/registry.ts` from opencode
// Re-export the registry-name accessor used by the permission system to
// cross-check deny-rule tool entries against the actual registered tools.
export { getAllToolNames } from './index.js';

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
