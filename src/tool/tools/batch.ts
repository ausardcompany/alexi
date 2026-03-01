/**
 * Batch Tool - Execute multiple tool calls in parallel
 *
 * Allows executing up to 25 tool calls in parallel, improving efficiency
 * when multiple independent operations are needed.
 */

import { z } from 'zod';
import { defineTool, getTool, type ToolResult, type ToolContext } from '../index.js';

const MAX_BATCH_SIZE = 25;

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

    // Execute all invocations in parallel
    const promises = invocations.map((invocation, index) =>
      executeInvocation(invocation, index, context)
    );

    const results = await Promise.all(promises);

    // Count successes and failures
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      success: failed === 0,
      data: {
        totalInvocations: invocations.length,
        successful,
        failed,
        results,
      },
      hint:
        failed > 0
          ? `${failed} of ${invocations.length} invocations failed. Check individual results for details.`
          : undefined,
    };
  },
});

// Export constants for testing
export { MAX_BATCH_SIZE };
