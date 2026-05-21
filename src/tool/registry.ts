/**
 * Enhanced Tool Registry with Prompt Tool Resolution
 * Based on opencode refactor(session): extract prompt tool resolution
 * Updated with improved type safety and consistent naming conventions
 */

import type { Tool } from './index.js';

export interface ToolResolutionContext {
  sessionId: string;
  agentId?: string;
  permissions: string[];
}

export interface ToolDefinition<TArgs = unknown, TResult = unknown> {
  name: string;
  description: string;
  args: TArgs;
  execute: (args: TArgs) => Promise<TResult>;
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

  /**
   * Register a static tool
   */
  register(tool: Tool<any, any>): void {
    if (!tool.name) {
      throw new ToolResolutionError('Tool must have a name');
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Register a prompt tool resolver for dynamic tool resolution
   * Based on opencode refactor(session): extract prompt tool resolution
   */
  registerPromptResolver(name: string, resolver: PromptToolResolver): void {
    if (!name) {
      throw new ToolResolutionError('Resolver must have a name');
    }
    this.promptResolvers.set(name, resolver);
  }

  /**
   * Get a tool by name
   */
  get(name: string): Tool<any, any> | undefined {
    return this.tools.get(name);
  }

  /**
   * Check if a tool exists
   */
  has(name: string): boolean {
    return this.tools.has(name);
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

  /**
   * Check if a tool has required permissions
   */
  private hasPermission(tool: Tool<any, any>, permissions: string[]): boolean {
    // If tool doesn't specify required permissions, allow it
    const requiredPermissions = (tool as any).requiredPermissions;
    if (!requiredPermissions) {
      return true;
    }
    return requiredPermissions.every((p: string) => permissions.includes(p));
  }

  /**
   * List all registered tools
   */
  list(): Tool<any, any>[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get count of registered tools
   */
  count(): number {
    return this.tools.size;
  }

  /**
   * Clear all tools and resolvers
   */
  clear(): void {
    this.tools.clear();
    this.promptResolvers.clear();
  }
}
