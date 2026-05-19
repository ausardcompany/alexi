/**
 * Plugin Tool Wrappers
 * Provides compatibility layer between plugin tools and Alexi's tool system
 * Based on opencode fix(plugin): `ask` in tools from plugins returns promise instead of effect
 */

import type { Tool, ToolDefinition, ToolContext, ToolResult } from '../tool/index.js';
import { defineTool } from '../tool/index.js';

/**
 * Plugin tool interface - simpler version for plugin authors
 */
export interface PluginToolDefinition<TParams = any, TResult = any> {
  name: string;
  description: string;
  schema: any;
  execute: (
    params: TParams,
    context: PluginToolContext
  ) => Promise<ToolResult<TResult>> | ToolResult<TResult>;
}

/**
 * Plugin tool context with Promise-based ask
 */
export interface PluginToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  /**
   * Ask the user a question and get a response
   * Returns a Promise instead of an Effect for simplicity
   */
  ask: (question: string) => Promise<string>;
}

/**
 * Create a tool wrapper for plugin tools
 * Ensures that `ask` in tools from plugins returns a Promise instead of an Effect
 * Fix from opencode: fix(plugin): `ask` in tools from plugins returns promise instead of effect
 */
export function createPluginToolWrapper<TParams = any, TResult = any>(
  pluginTool: PluginToolDefinition<TParams, TResult>
): Tool<any, TResult> {
  const toolDefinition: ToolDefinition<any, TResult> = {
    name: pluginTool.name,
    description: pluginTool.description,
    parameters: pluginTool.schema,
    execute: async (params: TParams, context: ToolContext): Promise<ToolResult<TResult>> => {
      // Wrap the context to ensure ask returns a Promise
      const wrappedContext: PluginToolContext = {
        workdir: context.workdir,
        signal: context.signal,
        sessionId: context.sessionId,
        /**
         * Wrap the ask function to return a Promise instead of Effect
         * This ensures plugin tools receive the expected Promise-based API
         */
        ask: async (question: string): Promise<string> => {
          // If the original context has an ask method, use it
          const originalAsk = (context as any).ask;
          if (originalAsk) {
            const result = originalAsk(question);
            // Handle both Effect and Promise returns for backwards compatibility
            if (result && typeof result === 'object' && '_tag' in result) {
              // Looks like an Effect - would need Effect.runPromise
              // For now, throw an error since we don't have Effect library
              throw new Error('Effect-based ask not supported in plugin wrapper');
            }
            return result as Promise<string>;
          }
          // Fallback: throw error if no ask method available
          throw new Error('ask method not available in tool context');
        },
      };

      return pluginTool.execute(params, wrappedContext);
    },
  };

  return defineTool(toolDefinition);
}

/**
 * Check if a tool definition is a plugin tool
 */
export function isPluginTool(tool: any): tool is PluginToolDefinition {
  return (
    tool &&
    typeof tool === 'object' &&
    typeof tool.name === 'string' &&
    typeof tool.description === 'string' &&
    typeof tool.execute === 'function'
  );
}
