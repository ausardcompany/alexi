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
  /**
   * Per-session set of realpath()ed AGENTS.md files that have already been
   * surfaced to the agent as system-reminders. File-touching tools use this
   * to de-duplicate per-directory AGENTS.md emissions across a single
   * orchestrator execution.
   */
  agentsMdSeen?: Set<string>;
}

/**
 * A single per-directory AGENTS.md the agent should be reminded of after a
 * file-touching tool call. Emitted via `ToolResult.metadata.systemReminders`
 * and re-injected by the orchestrator as a synthetic user-role message
 * containing one or more `<system-reminder source="...">` blocks.
 */
export interface ToolSystemReminder {
  /** Workdir-relative path of the AGENTS.md, used as `source="..."`. */
  source: string;
  /** Trimmed contents of the AGENTS.md. */
  content: string;
}

// Tool result
export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  truncated?: boolean;
  hint?: string;
  metadata?: {
    /**
     * Per-directory AGENTS.md reminders discovered by this tool call.
     * Re-emitted by the orchestrator as `<system-reminder source="...">`
     * blocks in a synthetic user message before the next assistant turn.
     */
    systemReminders?: ToolSystemReminder[];
    [k: string]: unknown;
  };
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
 * Build the elision marker line that is inserted between the kept head and
 * kept tail of a truncated output. The marker text reports both omitted
 * lines and omitted bytes so the model can reason about how much was
 * dropped (and follow up with `read` against the persisted file if needed).
 */
function buildElisionMarker(omittedLines: number, omittedBytes: number): string {
  return `[... ${omittedLines} lines / ${omittedBytes} bytes elided ...]`;
}

/**
 * Find the largest index `i` (i <= maxBytes) into `buf` such that `i` is
 * either right after a `\n` byte or at a UTF-8 codepoint boundary. Used to
 * snap a head slice back to the previous line boundary, falling back to a
 * codepoint boundary if no newline is reachable inside the budget.
 */
function snapHeadToBoundary(buf: Buffer, maxBytes: number): number {
  if (maxBytes <= 0) {
    return 0;
  }
  if (maxBytes >= buf.length) {
    return buf.length;
  }

  // Prefer snapping back to the last '\n' (byte 0x0A) within budget so we
  // never cut a line in half.
  for (let i = maxBytes; i > 0; i--) {
    if (buf[i - 1] === 0x0a) {
      return i;
    }
  }

  // No newline reachable — fall back to a UTF-8 codepoint boundary. UTF-8
  // continuation bytes match 0b10xxxxxx (0x80..0xBF). Walk back until the
  // next byte is NOT a continuation byte.
  let i = maxBytes;
  while (i > 0 && (buf[i] & 0xc0) === 0x80) {
    i--;
  }
  return i;
}

/**
 * Find the smallest index `i` (i >= buf.length - maxBytes) into `buf` such
 * that `i` is either right after a `\n` byte or at a UTF-8 codepoint
 * boundary. Used to snap a tail slice start forward to the next line
 * boundary, falling back to a codepoint boundary if no newline is
 * reachable inside the budget.
 */
function snapTailToBoundary(buf: Buffer, maxBytes: number): number {
  if (maxBytes <= 0) {
    return buf.length;
  }
  if (maxBytes >= buf.length) {
    return 0;
  }

  const minStart = buf.length - maxBytes;

  // Prefer snapping forward to the byte right after a '\n' so the tail
  // begins at the start of a complete line.
  for (let i = minStart; i < buf.length; i++) {
    if (i > 0 && buf[i - 1] === 0x0a) {
      return i;
    }
  }

  // No newline reachable — fall back to a UTF-8 codepoint boundary. Walk
  // forward until `buf[i]` is NOT a continuation byte (0b10xxxxxx).
  let i = minStart;
  while (i < buf.length && (buf[i] & 0xc0) === 0x80) {
    i++;
  }
  return i;
}

/**
 * Truncate output if it exceeds the line or byte budget, preserving BOTH
 * the head and the tail of the output. Failure-relevant content (final
 * assertion, last stack frame, "X tests failed" summary) lives at the END
 * of long tool runs, so a head-only strategy clips the most useful part.
 *
 * Strategy:
 * - If both budgets fit: return as-is, `truncated: false`.
 * - If line count exceeds `MAX_LINES`: keep `floor(MAX_LINES/2)` head
 *   lines and the remaining tail lines, joined with a single elision
 *   marker line in the middle.
 * - If the (possibly already line-truncated) result still exceeds
 *   `MAX_BYTES`: split the byte budget roughly 50/50 between head and
 *   tail, snapping each slice to a newline boundary (or a UTF-8 codepoint
 *   boundary if no newline is reachable inside the budget) so we never
 *   cut a line or codepoint in half. Concatenate as
 *   `head + '\n' + marker + '\n' + tail`.
 *
 * The full original output is still persisted by `persistLargeOutput` so
 * the truncated text is recoverable; this function only governs what is
 * surfaced inline to the model.
 */
function truncateOutput(output: string): { content: string; truncated: boolean } {
  const lines = output.split('\n');
  const totalBytes = Buffer.byteLength(output, 'utf-8');

  if (lines.length <= MAX_LINES && totalBytes <= MAX_BYTES) {
    return { content: output, truncated: false };
  }

  let result = output;

  // Line-budget head + tail truncation.
  if (lines.length > MAX_LINES) {
    const headCount = Math.floor(MAX_LINES / 2);
    const tailCount = MAX_LINES - headCount;
    const headLines = lines.slice(0, headCount);
    const tailLines = lines.slice(lines.length - tailCount);
    const elidedLines = lines.slice(headCount, lines.length - tailCount);
    const omittedLineCount = elidedLines.length;
    const omittedByteCount = Buffer.byteLength(elidedLines.join('\n'), 'utf-8');
    const marker = buildElisionMarker(omittedLineCount, omittedByteCount);
    result = [...headLines, marker, ...tailLines].join('\n');
  }

  // Byte-budget head + tail truncation. Either the line-truncated result
  // is still too big, or the input fit in lines but exceeds bytes (e.g.
  // a single very long line).
  if (Buffer.byteLength(result, 'utf-8') > MAX_BYTES) {
    const buf = Buffer.from(result, 'utf-8');

    // Reserve space for the elision marker plus its surrounding newlines.
    // We can only finalise the marker text once we know how many bytes
    // were elided, so first reserve a conservative upper bound, then
    // recompute.
    const markerOverhead = (marker: string): number => Buffer.byteLength(`\n${marker}\n`, 'utf-8');
    const placeholderMarker = buildElisionMarker(buf.length, buf.length);
    const reserved = markerOverhead(placeholderMarker);
    const usable = Math.max(0, MAX_BYTES - reserved);
    const headBudget = Math.floor(usable / 2);
    const tailBudget = usable - headBudget;

    const headEnd = snapHeadToBoundary(buf, headBudget);
    const tailStart = snapTailToBoundary(buf, tailBudget);
    // Guarantee head and tail do not overlap (can happen for tiny
    // budgets). When they would, fall back to a head-only slice.
    const safeTailStart = Math.max(tailStart, headEnd);
    const headSlice = buf.subarray(0, headEnd);
    const tailSlice = buf.subarray(safeTailStart);
    const omittedBytes = Math.max(0, buf.length - headSlice.length - tailSlice.length);
    // Approximate omitted lines from the elided byte slice.
    const elidedSlice = buf.subarray(headEnd, safeTailStart);
    let omittedLines = 0;
    for (const byte of elidedSlice) {
      if (byte === 0x0a) {
        omittedLines++;
      }
    }
    const finalMarker = buildElisionMarker(omittedLines, omittedBytes);
    result = `${headSlice.toString('utf-8')}\n${finalMarker}\n${tailSlice.toString('utf-8')}`;

    // If the recomputed marker is shorter than the placeholder we may now
    // have a few free bytes; we deliberately do not try to grow head/tail
    // to claim them — the simpler structure is easier to reason about and
    // the persisted full output is the source of truth.
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
  private dynamicTools: Map<string, Tool<any, any>> = new Map();
  private indexingTools: Map<string, Tool<any, any>> = new Map();
  private indexingInitialized = false;

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

  /**
   * Register an indexing tool (semantic search, etc.)
   * These tools are initialized asynchronously to prevent startup failures
   */
  registerIndexing<TParams extends z.ZodType, TResult>(tool: Tool<TParams, TResult>): void {
    this.indexingTools.set(tool.name, tool);
  }

  /**
   * Initialize indexing tools asynchronously
   * Failures won't block the registry
   */
  async initializeIndexingAsync(): Promise<void> {
    try {
      // Load semantic search and other indexing tools here
      // For now, this is a placeholder for future implementation
      this.indexingInitialized = true;

      // Merge indexing tools into main registry if successful
      for (const [name, tool] of this.indexingTools) {
        this.tools.set(name, tool);
      }
    } catch (error) {
      console.warn('Indexing tools failed to initialize:', error);
      // Continue without indexing tools - non-fatal
    }
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

  /**
   * Check if indexing tools are ready
   */
  isIndexingReady(): boolean {
    return this.indexingInitialized;
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

/**
 * Get the names of every registered tool (static and dynamic).
 * Used by the permission system to validate deny-rule tool entries.
 */
export function getAllToolNames(): string[] {
  return getToolRegistry()
    .list()
    .map((t) => t.name);
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

// ============ Tool Description Enhancement ============

const SEMANTIC_SEARCH_HINT =
  '- When you are doing an open-ended search where you do not know the exact symbol name, use the `semantic_search` tool first to narrow down the search scope, then follow up with `Grep` and/or `Read`';

/**
 * Augment tool descriptions with semantic search hints when semantic search is available.
 * @param tools - Array of tool definitions to potentially augment
 * @param extra - Object containing optional semantic search tool definition
 * @returns Tool definitions with augmented descriptions where applicable
 */
export function describeTools(
  tools: Tool<any, any>[],
  extra: { semantic?: Tool<any, any> }
): Tool<any, any>[] {
  if (!extra.semantic) {
    return tools;
  }
  return tools.map((tool) => {
    if (tool.name !== 'glob' && tool.name !== 'grep') {
      return tool;
    }
    return {
      ...tool,
      description: `${tool.description}\n${SEMANTIC_SEARCH_HINT}`,
    };
  });
}
