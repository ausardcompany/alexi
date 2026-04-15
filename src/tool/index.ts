/**
 * Tool System
 * Defines tools for AI agent actions with lazy initialization
 * Based on kilocode/opencode Tool.define() pattern
 */

import { z } from 'zod';
import { nanoid } from 'nanoid';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { ToolExecutionStarted, ToolExecutionCompleted, ToolExecutionFailed } from '../bus/index.js';
import { getPermissionManager, type PermissionAction } from '../permission/index.js';
import type { AutoCommitManager } from '../git/autoCommit.js';

// Tool execution context
export interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  /** Optional git auto-commit manager — injected by agenticChat when enabled */
  gitManager?: AutoCommitManager;
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
    // metadata can provide additional context for permission checks
    metadata?: (params: z.infer<TParams>, context?: ToolContext) => Record<string, unknown>;
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

// Directory for persisting large tool outputs
const TOOL_OUTPUT_DIR = path.join(os.homedir(), '.alexi', 'tool-output');

/**
 * Persist large tool output to disk so truncated data is recoverable.
 * Returns the file path if persisted, or null if output was within limits.
 */
async function persistLargeOutput(output: string, toolName: string): Promise<string | null> {
  const lines = output.split('\n');
  const bytes = Buffer.byteLength(output, 'utf-8');
  if (lines.length <= MAX_LINES && bytes <= MAX_BYTES) {
    return null;
  }

  try {
    await fs.mkdir(TOOL_OUTPUT_DIR, { recursive: true });
    const filename = `${toolName}-${nanoid(8)}.txt`;
    const filePath = path.join(TOOL_OUTPUT_DIR, filename);
    await fs.writeFile(filePath, output, 'utf-8');
    return filePath;
  } catch {
    // Non-fatal: if we can't persist, proceed without it
    return null;
  }
}

/**
 * Clean up old tool output files.
 * Removes files older than maxAgeMs (default: 24 hours).
 * Returns the number of files removed.
 */
async function cleanupToolOutputs(maxAgeMs = 24 * 60 * 60 * 1000): Promise<number> {
  try {
    const entries = await fs.readdir(TOOL_OUTPUT_DIR);
    const now = Date.now();
    let removed = 0;

    for (const entry of entries) {
      const filePath = path.join(TOOL_OUTPUT_DIR, entry);
      try {
        const stat = await fs.stat(filePath);
        if (now - stat.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          removed++;
        }
      } catch {
        // Skip files we can't stat or remove
      }
    }

    return removed;
  } catch {
    // Directory may not exist yet
    return 0;
  }
}

/**
 * Convert Zod schema to JSON Schema for function calling
 */

interface ZodDefBase {
  description?: string;
}

interface ZodArrayDef extends ZodDefBase {
  type: z.ZodType;
}

interface ZodWrappedDef extends ZodDefBase {
  innerType: z.ZodType;
  defaultValue?: unknown;
}

interface ZodEnumDef extends ZodDefBase {
  values: string[];
}

function zodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
  // Use Zod's built-in JSON schema generation if available
  // For now, implement a basic converter

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as Record<string, z.ZodType>;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      properties[key] = zodToJsonSchema(value);
      if (!(value instanceof z.ZodOptional)) {
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
    const def = (schema as unknown as { _def: ZodDefBase })._def;
    return { type: 'string', description: def.description };
  }

  if (schema instanceof z.ZodNumber) {
    const def = (schema as unknown as { _def: ZodDefBase })._def;
    return { type: 'number', description: def.description };
  }

  if (schema instanceof z.ZodBoolean) {
    const def = (schema as unknown as { _def: ZodDefBase })._def;
    return { type: 'boolean', description: def.description };
  }

  if (schema instanceof z.ZodArray) {
    const def = (schema as unknown as { _def: ZodArrayDef })._def;
    return {
      type: 'array',
      items: zodToJsonSchema(def.type),
      description: def.description,
    };
  }

  if (schema instanceof z.ZodEnum) {
    const def = (schema as unknown as { _def: ZodEnumDef })._def;
    return {
      type: 'string',
      enum: def.values,
      description: def.description,
    };
  }

  if (schema instanceof z.ZodOptional) {
    const def = (schema as unknown as { _def: ZodWrappedDef })._def;
    return zodToJsonSchema(def.innerType);
  }

  if (schema instanceof z.ZodDefault) {
    const def = (schema as unknown as { _def: ZodWrappedDef })._def;
    const inner = zodToJsonSchema(def.innerType);
    // Zod v4: defaultValue is a value, not a function
    const defaultVal =
      typeof def.defaultValue === 'function'
        ? (def.defaultValue as () => unknown)()
        : def.defaultValue;
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
        const metadata = definition.permission.metadata
          ? definition.permission.metadata(params, context)
          : undefined;
        const permissionManager = getPermissionManager();
        const result = await permissionManager.check({
          toolName: definition.name,
          action: definition.permission.action,
          resource,
          description: `${definition.name}: ${definition.permission.action} on ${resource}`,
          metadata,
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
  private dynamicTools: Map<string, Tool<any, any>> = new Map();

  register<TParams extends z.ZodType, TResult>(tool: Tool<TParams, TResult>): void {
    this.tools.set(tool.name, tool);
  }

  registerDynamic<TParams extends z.ZodType, TResult>(tool: Tool<TParams, TResult>): void {
    if (this.tools.has(tool.name) || this.dynamicTools.has(tool.name)) {
      throw new Error(`Tool with name '${tool.name}' is already registered`);
    }
    this.dynamicTools.set(tool.name, tool);
  }

  unregisterDynamic(name: string): boolean {
    return this.dynamicTools.delete(name);
  }

  get(name: string): Tool<any, any> | undefined {
    return this.tools.get(name) || this.dynamicTools.get(name);
  }

  list(): Tool<any, any>[] {
    return [...Array.from(this.tools.values()), ...Array.from(this.dynamicTools.values())];
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

export function registerDynamicTool<TParams extends z.ZodType, TResult>(
  tool: Tool<TParams, TResult>
): void {
  getToolRegistry().registerDynamic(tool);
}

export function unregisterDynamicTool(name: string): boolean {
  return getToolRegistry().unregisterDynamic(name);
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
export {
  truncateOutput,
  MAX_LINES,
  MAX_BYTES,
  persistLargeOutput,
  cleanupToolOutputs,
  TOOL_OUTPUT_DIR,
};

// Re-export schema types
export type {
  ToolID,
  ToolCallID,
  ToolResultID,
  ToolExecutionState,
  ToolPermissionLevel,
  ToolMetadata,
} from './schema.js';
