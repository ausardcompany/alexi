/**
 * Batch Tool - Execute multiple tool calls in parallel
 *
 * Allows executing up to 25 tool calls in parallel, improving efficiency
 * when multiple independent operations are needed.
 */

import { z } from 'zod';
import { defineTool, getTool, type ToolResult, type ToolContext } from '../index.js';

const MAX_BATCH_SIZE = 25;

/**
 * Critical tools whose failure should cause the whole batch to fail.
 * Non-critical tool failures (read, glob, grep) are tolerated — the batch
 * still reports partial success so the LLM can retry or work around them.
 */
const CRITICAL_TOOLS = new Set(['bash', 'write', 'edit', 'multiedit', 'delete']);

const ToolInvocationSchema = z.object({
  tool: z.string().describe('The name of the tool to invoke'),
  params: z.record(z.string(), z.unknown()).describe('Parameters to pass to the tool'),
});

const BatchParamsSchema = z.object({
  invocations: z
    .array(ToolInvocationSchema)
    .min(1)
    .max(MAX_BATCH_SIZE)
    .describe(`Array of tool invocations to execute in parallel (max ${MAX_BATCH_SIZE})`),
});

interface InvocationResult {
  tool: string;
  index: number;
  success: boolean;
  result?: ToolResult<unknown>;
  error?: string;
}

interface BatchResult {
  totalInvocations: number;
  successful: number;
  failed: number;
  results: InvocationResult[];
}

/**
 * Execute a single tool invocation
 */
async function executeInvocation(
  invocation: z.infer<typeof ToolInvocationSchema>,
  index: number,
  context: ToolContext
): Promise<InvocationResult> {
  const { tool: toolName, params } = invocation;

  // Get the tool from registry
  const tool = getTool(toolName);
  if (!tool) {
    return {
      tool: toolName,
      index,
      success: false,
      error: `Tool not found: ${toolName}`,
    };
  }

  // Don't allow recursive batch calls
  if (toolName === 'batch') {
    return {
      tool: toolName,
      index,
      success: false,
      error: 'Recursive batch calls are not allowed',
    };
  }

  // Disallow plan_exit from batch execution
  if (toolName === 'plan_exit') {
    return {
      tool: toolName,
      index,
      success: false,
      error: 'plan_exit cannot be executed within a batch operation',
    };
  }

  try {
    // Execute the tool
    const result = await tool.execute(params, context);

    return {
      tool: toolName,
      index,
      success: result.success,
      result,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      tool: toolName,
      index,
      success: false,
      error: errorMessage,
    };
  }
}

export const batchTool = defineTool<typeof BatchParamsSchema, BatchResult>({
  name: 'batch',
  description: `Execute multiple tool calls in parallel for improved efficiency.

Usage:
- Use when you need to perform multiple independent operations simultaneously.
- Maximum ${MAX_BATCH_SIZE} tool invocations per batch.
- Each invocation specifies a tool name and its parameters.
- All invocations run in parallel; results are collected and returned together.
- Recursive batch calls (batch within batch) are not allowed.
- Results preserve the original order of invocations.

Example invocations:
[
  { "tool": "read", "params": { "filePath": "/path/to/file1.ts" } },
  { "tool": "read", "params": { "filePath": "/path/to/file2.ts" } },
  { "tool": "glob", "params": { "pattern": "**/*.test.ts" } }
]

Best practices:
- Use for independent operations that don't depend on each other's results.
- Group related reads, searches, or file operations together.
- Consider using for parallel file exploration or bulk operations.`,

  parameters: BatchParamsSchema,

  // No permission needed for batch itself - individual tools handle their own permissions
  permission: undefined,

  async execute(params, context): Promise<ToolResult<BatchResult>> {
    const { invocations } = params;

    // Check for abort before starting
    if (context.signal?.aborted) {
      return {
        success: false,
        error: 'Operation aborted',
      };
    }

    // Execute all invocations in parallel using allSettled for isolation
    const promises = invocations.map((invocation, index) =>
      executeInvocation(invocation, index, context)
    );

    const settled = await Promise.allSettled(promises);

    // Extract results, treating rejected promises as failures
    const results: InvocationResult[] = settled.map((outcome, index) => {
      if (outcome.status === 'fulfilled') {
        return outcome.value;
      }
      // Unexpected rejection — wrap it
      const err = outcome.reason;
      return {
        tool: invocations[index].tool,
        index,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    });

    // Count successes and failures
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    // Only count critical tool failures as batch-level failures
    const criticalFailures = results.filter((r) => !r.success && CRITICAL_TOOLS.has(r.tool)).length;
    const nonCriticalFailures = failed - criticalFailures;

    // Build informative hint
    let hint: string | undefined;
    if (failed > 0) {
      const parts: string[] = [];
      if (criticalFailures > 0) {
        parts.push(`${criticalFailures} critical failure(s)`);
      }
      if (nonCriticalFailures > 0) {
        parts.push(`${nonCriticalFailures} non-critical failure(s)`);
      }
      hint = `${failed} of ${invocations.length} invocations failed (${parts.join(', ')}). Check individual results for details.`;
    }

    return {
      success: criticalFailures === 0,
      data: {
        totalInvocations: invocations.length,
        successful,
        failed,
        results,
      },
      hint,
    };
  },
});

// Export constants for testing
export { MAX_BATCH_SIZE, CRITICAL_TOOLS };
