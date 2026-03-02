/**
 * Tool System
 * Defines tools for AI agent actions with lazy initialization
 * Based on kilocode/opencode Tool.define() pattern
 */

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { ToolExecutionStarted, ToolExecutionCompleted, ToolExecutionFailed } from '../bus/index.js';
import { getPermissionManager, type PermissionAction } from '../permission/index.js';

// Tool execution context
export interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
}

// Tool result
export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  truncated?: boolean;
  hint?: string;
}

// Tool definition options
export interface ToolDefinition<TParams extends z.ZodType, TResult> {
  name: string;
  description: string;
  parameters: TParams;
  // Permission requirements
  permission?: {
    action: PermissionAction;
    // getResource can optionally receive context to resolve relative paths
    getResource: (params: z.infer<TParams>, context?: ToolContext) => string;
  };
  // Execution function
  execute: (params: z.infer<TParams>, context: ToolContext) => Promise<ToolResult<TResult>>;
}

// Tool instance with utilities
export interface Tool<TParams extends z.ZodType, TResult> {
  name: string;
  description: string;
  parameters: TParams;
  // For OpenAI/Anthropic function calling format
  toFunctionSchema(): {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
  // Execute with permission check
  execute(params: z.infer<TParams>, context: ToolContext): Promise<ToolResult<TResult>>;
  // Execute without permission check (internal use)
  executeUnsafe(params: z.infer<TParams>, context: ToolContext): Promise<ToolResult<TResult>>;
}

// Output truncation constants
const MAX_LINES = 2000;
const MAX_BYTES = 51200; // 50KB

/**
 * Truncate output if it exceeds limits
 */
function truncateOutput(output: string): { content: string; truncated: boolean } {
  const lines = output.split('\n');
  const bytes = Buffer.byteLength(output, 'utf-8');

  if (lines.length <= MAX_LINES && bytes <= MAX_BYTES) {
    return { content: output, truncated: false };
  }

  // Truncate by lines first
  const truncatedLines = lines.slice(0, MAX_LINES);
  let result = truncatedLines.join('\n');

  // Then check bytes
  if (Buffer.byteLength(result, 'utf-8') > MAX_BYTES) {
    // Binary search for the right length
    let left = 0;
    let right = result.length;
    while (left < right) {
      const mid = Math.floor((left + right + 1) / 2);
      if (Buffer.byteLength(result.slice(0, mid), 'utf-8') <= MAX_BYTES) {
        left = mid;
      } else {
        right = mid - 1;
      }
    }
    result = result.slice(0, left);
  }

  return { content: result, truncated: true };
}

/**
 * Convert Zod schema to JSON Schema for function calling
 */
function zodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
  // Use Zod's built-in JSON schema generation if available
  // For now, implement a basic converter
  const def = (schema as any)._def;

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      properties[key] = zodToJsonSchema(value as z.ZodType);
      if (!((value as any) instanceof z.ZodOptional)) {
        required.push(key);
      }
    }

    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  if (schema instanceof z.ZodString) {
    return { type: 'string', description: def.description };
  }

  if (schema instanceof z.ZodNumber) {
    return { type: 'number', description: def.description };
  }

  if (schema instanceof z.ZodBoolean) {
    return { type: 'boolean', description: def.description };
  }

  if (schema instanceof z.ZodArray) {
    return {
      type: 'array',
      items: zodToJsonSchema(def.type),
      description: def.description,
    };
  }

  if (schema instanceof z.ZodEnum) {
    return {
      type: 'string',
      enum: def.values,
      description: def.description,
    };
  }

  if (schema instanceof z.ZodOptional) {
    return zodToJsonSchema(def.innerType);
  }

  if (schema instanceof z.ZodDefault) {
    const inner = zodToJsonSchema(def.innerType);
    // Zod v4: defaultValue is a value, not a function
    const defaultVal =
      typeof def.defaultValue === 'function' ? def.defaultValue() : def.defaultValue;
    return { ...inner, default: defaultVal };
  }

  // Fallback
  return { type: 'string' };
}

/**
 * Define a new tool with lazy initialization
 */
export function defineTool<TParams extends z.ZodType, TResult>(
  definition: ToolDefinition<TParams, TResult>
): Tool<TParams, TResult> {
  return {
    name: definition.name,
    description: definition.description,
    parameters: definition.parameters,

    toFunctionSchema() {
      return {
        name: definition.name,
        description: definition.description,
        parameters: zodToJsonSchema(definition.parameters),
      };
    },

    async execute(params: z.infer<TParams>, context: ToolContext): Promise<ToolResult<TResult>> {
      // Check permission if required
      if (definition.permission) {
        // Pass context to getResource so it can resolve relative paths
        const resource = definition.permission.getResource(params, context);
        const permissionManager = getPermissionManager();
        const result = await permissionManager.check({
          toolName: definition.name,
          action: definition.permission.action,
          resource,
          description: `${definition.name}: ${definition.permission.action} on ${resource}`,
        });

        if (!result.granted) {
          return {
            success: false,
            error: `Permission denied: ${definition.permission.action} on ${resource}`,
          };
        }
      }

      return this.executeUnsafe(params, context);
    },

    async executeUnsafe(
      params: z.infer<TParams>,
      context: ToolContext
    ): Promise<ToolResult<TResult>> {
      const toolId = nanoid();
      const startTime = Date.now();

      // Validate parameters
      let validatedParams: z.infer<TParams>;
      try {
        validatedParams = definition.parameters.parse(params);
      } catch (err) {
        return {
          success: false,
          error: `Invalid parameters: ${err instanceof Error ? err.message : String(err)}`,
        };
      }

      // Publish start event
      ToolExecutionStarted.publish({
        toolName: definition.name,
        toolId,
        parameters: validatedParams as Record<string, unknown>,
        timestamp: startTime,
      });

      try {
        // Check for abort
        if (context.signal?.aborted) {
          throw new Error('Operation aborted');
        }

        // Execute the tool
        const result = await definition.execute(validatedParams, context);
        const duration = Date.now() - startTime;

        // Publish completion event
        ToolExecutionCompleted.publish({
          toolName: definition.name,
          toolId,
          result,
          duration,
          timestamp: Date.now(),
        });

        return result;
      } catch (err) {
        const duration = Date.now() - startTime;
        const errorMessage = err instanceof Error ? err.message : String(err);

        // Publish failure event
        ToolExecutionFailed.publish({
          toolName: definition.name,
          toolId,
          error: errorMessage,
          duration,
          timestamp: Date.now(),
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
  };
}

// Tool registry
class ToolRegistry {
  private tools: Map<string, Tool<any, any>> = new Map();

  register<TParams extends z.ZodType, TResult>(tool: Tool<TParams, TResult>): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): Tool<any, any> | undefined {
    return this.tools.get(name);
  }

  list(): Tool<any, any>[] {
    return Array.from(this.tools.values());
  }

  getSchemas(): Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }> {
    return this.list().map((t) => t.toFunctionSchema());
  }
}

// Global registry
let globalRegistry: ToolRegistry | null = null;

export function getToolRegistry(): ToolRegistry {
  if (!globalRegistry) {
    globalRegistry = new ToolRegistry();
  }
  return globalRegistry;
}

export function registerTool<TParams extends z.ZodType, TResult>(
  tool: Tool<TParams, TResult>
): void {
  getToolRegistry().register(tool);
}

export function getTool(name: string): Tool<any, any> | undefined {
  return getToolRegistry().get(name);
}

export function getAllToolSchemas(): Array<{
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}> {
  return getToolRegistry().getSchemas();
}

// Re-export for convenience
export { truncateOutput, MAX_LINES, MAX_BYTES };
