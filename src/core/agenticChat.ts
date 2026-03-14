/**
 * Agentic Chat - Chat with tool execution loop
 *
 * This module provides an agentic chat interface that:
 * 1. Sends messages to the LLM with tools available
 * 2. Executes tool calls made by the LLM
 * 3. Continues the conversation until the LLM responds with text (no more tool calls)
 *
 * Used by CLI for automated workflows that need to modify files.
 */

import { getProviderForModel, getDefaultModel } from '../providers/index.js';
import { routePrompt } from './router.js';
import { SessionManager } from './sessionManager.js';
import { getCostTracker } from './costTracker.js';
import { getToolRegistry, type ToolContext, type ToolResult } from '../tool/index.js';
import { registerBuiltInTools } from '../tool/tools/index.js';
import { getPermissionManager } from '../permission/index.js';
import type { CompletionResult, TokenUsage } from '../providers/sapOrchestration.js';
import type { AutoCommitManager } from '../git/autoCommit.js';
import type { RepoMapManager } from '../context/repoMap.js';
import { type EffortLevel, getEffortConfig, DEFAULT_EFFORT } from './effortLevel.js';

// Tool call from LLM response
interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

// Message types for conversation
// Note: assistant messages with tool_calls may have undefined content — the SAP AI SDK
// AssistantChatMessage type has content as optional, and some API backends reject
// empty-string content on tool-call-only messages.
type Message =
  | { role: 'system' | 'user' | 'assistant'; content: string }
  | { role: 'assistant'; content: string | undefined; tool_calls: ToolCall[] }
  | { role: 'tool'; tool_call_id: string; content: string };

export interface AgenticChatOptions {
  modelOverride?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  sessionManager?: SessionManager;
  systemPrompt?: string;
  /** Maximum number of tool execution iterations (default: 50) */
  maxIterations?: number;
  /** Working directory for tool execution */
  workdir?: string;
  /** Tool names to enable (default: all registered tools) */
  enabledTools?: string[];
  /** Callback for progress updates */
  onProgress?: (event: AgenticProgressEvent) => void;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
  /** Optional git auto-commit manager */
  gitManager?: AutoCommitManager;
  /** Optional repo map manager for codebase indexing context */
  repoMapManager?: RepoMapManager;
  /** Effort level for cost/quality tradeoff (default: 'medium') */
  effort?: EffortLevel;
}

export interface AgenticProgressEvent {
  type: 'llm_call' | 'tool_start' | 'tool_end' | 'iteration' | 'complete';
  iteration?: number;
  toolName?: string;
  toolId?: string;
  result?: ToolResult;
  message?: string;
}

export interface AgenticChatResult {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  modelUsed: string;
  routingReason?: string;
  iterations: number;
  toolCallsExecuted: number;
  /** Summary of all tool calls made */
  toolCallSummary: Array<{
    name: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Format a tool schema for the OpenAI/SAP Orchestration tools format
 */
function formatToolForApi(schema: {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}) {
  return {
    type: 'function' as const,
    function: {
      name: schema.name,
      description: schema.description,
      parameters: schema.parameters,
    },
  };
}

/**
 * Execute a tool call and return the result
 */
async function executeToolCall(
  toolCall: ToolCall,
  context: ToolContext,
  onProgress?: (event: AgenticProgressEvent) => void
): Promise<{ id: string; result: ToolResult }> {
  const registry = getToolRegistry();
  const tool = registry.get(toolCall.function.name);

  onProgress?.({
    type: 'tool_start',
    toolName: toolCall.function.name,
    toolId: toolCall.id,
  });

  if (!tool) {
    const result: ToolResult = {
      success: false,
      error: `Unknown tool: ${toolCall.function.name}`,
    };
    onProgress?.({
      type: 'tool_end',
      toolName: toolCall.function.name,
      toolId: toolCall.id,
      result,
    });
    return { id: toolCall.id, result };
  }

  try {
    // Parse arguments
    let args: Record<string, unknown>;
    try {
      args = JSON.parse(toolCall.function.arguments);
    } catch {
      const result: ToolResult = {
        success: false,
        error: `Invalid JSON in tool arguments: ${toolCall.function.arguments}`,
      };
      onProgress?.({
        type: 'tool_end',
        toolName: toolCall.function.name,
        toolId: toolCall.id,
        result,
      });
      return { id: toolCall.id, result };
    }

    // Execute tool
    const result = await tool.execute(args, context);

    onProgress?.({
      type: 'tool_end',
      toolName: toolCall.function.name,
      toolId: toolCall.id,
      result,
    });

    return { id: toolCall.id, result };
  } catch (err) {
    const result: ToolResult = {
      success: false,
      error: `Tool execution error: ${err instanceof Error ? err.message : String(err)}`,
    };
    onProgress?.({
      type: 'tool_end',
      toolName: toolCall.function.name,
      toolId: toolCall.id,
      result,
    });
    return { id: toolCall.id, result };
  }
}

/**
 * Agentic chat - sends message and executes tools in a loop until complete
 */
export async function agenticChat(
  message: string,
  options?: AgenticChatOptions
): Promise<AgenticChatResult> {
  // Register built-in tools if not already registered
  registerBuiltInTools();

  const effortConfig = getEffortConfig(options?.effort ?? DEFAULT_EFFORT);
  const maxIterations = options?.maxIterations ?? effortConfig.maxIterations;
  const workdir = options?.workdir ?? process.cwd();

  // Configure permission manager to allow writes in the workdir
  const permissionManager = getPermissionManager();
  permissionManager.setProjectRoot(workdir);
  // Enable external directories to allow full agentic capability
  permissionManager.setAllowExternalDirectories(true);

  // Add explicit allow rule for writes in workdir (higher priority than default ask-write)
  // This enables autonomous file operations without interactive prompts
  permissionManager.addRule({
    id: 'agentic-allow-write',
    name: 'Agentic Write Allow',
    description: 'Allow writing files in workdir for agentic mode',
    actions: ['write'],
    paths: [`${workdir}/**`, workdir],
    decision: 'allow',
    priority: 200, // Higher than ask-write (10) and deny-secrets (100)
  });

  // Also allow execute for agentic operations (build, test, etc.)
  permissionManager.addRule({
    id: 'agentic-allow-execute',
    name: 'Agentic Execute Allow',
    description: 'Allow executing commands for agentic mode',
    actions: ['execute'],
    decision: 'allow',
    priority: 200,
  });

  // Determine model
  let modelId: string;
  let routingReason: string | undefined;

  const preferCheap = options?.preferCheap ?? effortConfig.preferCheap;

  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(message, { preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
  } else {
    modelId = (options?.modelOverride ?? getDefaultModel()).trim();
  }

  // Get provider
  const provider = getProviderForModel(modelId);

  // Build tool schemas for API
  const registry = getToolRegistry();
  const allTools = registry.list();
  const enabledToolNames = options?.enabledTools ?? allTools.map((t) => t.name);
  const enabledTools = allTools.filter((t) => enabledToolNames.includes(t.name));

  const toolSchemas = enabledTools.map((t) => formatToolForApi(t.toFunctionSchema()));

  // Fetch repo map if a manager is provided (non-blocking best-effort)
  let repoMapText = '';
  if (options?.repoMapManager) {
    try {
      repoMapText = await options.repoMapManager.getMap();
    } catch {
      // Non-fatal: proceed without repo map
    }
  }

  // Fetch memory context (non-blocking best-effort)
  let memoryContext = '';
  try {
    const { getMemoryManager } = await import('./memory.js');
    memoryContext = getMemoryManager().getContextString();
  } catch {
    // Non-fatal: proceed without memory context
  }

  // Fetch recent session context (non-blocking best-effort)
  let sessionContext = '';
  try {
    const { getSessionContextString } = await import('./sessionContext.js');
    sessionContext = getSessionContextString(workdir);
  } catch {
    // Non-fatal: proceed without session context
  }

  /**
   * Build the effective system prompt with cache-friendly ordering.
   * Stable content first (best prefix for prompt caching), volatile last:
   *   base (agent persona) → memory → session → repoMap
   */
  function buildSystemPrompt(base?: string): string {
    const parts: string[] = [];
    if (base) parts.push(base);
    if (memoryContext) parts.push(memoryContext);
    if (sessionContext) parts.push(sessionContext);
    if (repoMapText) parts.push(repoMapText);
    return parts.join('\n\n');
  }

  // Build initial messages
  const messages: Message[] = [];

  if (options?.sessionManager) {
    const session = options.sessionManager.getCurrentSession();
    if (!session) {
      options.sessionManager.createSession(modelId);
    }

    const history = options.sessionManager.getHistory(20);
    if (options.systemPrompt && !history.some((m) => m.role === 'system')) {
      messages.push({ role: 'system', content: buildSystemPrompt(options.systemPrompt) });
    } else if ((repoMapText || memoryContext) && !history.some((m) => m.role === 'system')) {
      messages.push({ role: 'system', content: buildSystemPrompt() });
    }
    messages.push(
      ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    );
  } else {
    const effectiveSystemPrompt = buildSystemPrompt(options?.systemPrompt);
    if (effectiveSystemPrompt) {
      messages.push({ role: 'system', content: effectiveSystemPrompt });
    }
  }

  messages.push({ role: 'user', content: message });

  // Tracking
  let iterations = 0;
  let toolCallsExecuted = 0;
  const toolCallSummary: Array<{ name: string; success: boolean; error?: string }> = [];
  const totalUsage: TokenUsage = {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0,
  };

  // Tool context
  const toolContext: ToolContext = {
    workdir,
    signal: options?.signal,
    sessionId: options?.sessionManager?.getCurrentSession()?.metadata.id,
    gitManager: options?.gitManager,
  };

  // Agent loop
  let finalText = '';

  while (iterations < maxIterations) {
    iterations++;

    options?.onProgress?.({
      type: 'iteration',
      iteration: iterations,
      message: `Starting iteration ${iterations}`,
    });

    // Check for abort
    if (options?.signal?.aborted) {
      throw new Error('Operation aborted');
    }

    // Call LLM
    options?.onProgress?.({
      type: 'llm_call',
      iteration: iterations,
    });

    // Diagnostic: log message structure before API call (helps debug 400 errors)
    if (process.env.ALEXI_DEBUG_MESSAGES === '1') {
      const msgSummary = messages.map((m, i) => {
        const msg = m as Record<string, unknown>;
        const role = msg['role'] as string;
        const hasToolCalls = 'tool_calls' in m;
        const hasToolCallId = 'tool_call_id' in m;
        const contentLen =
          typeof msg['content'] === 'string' ? (msg['content'] as string).length : 0;
        return `  [${i}] role=${role} content_len=${contentLen}${hasToolCalls ? ` tool_calls=${JSON.stringify((msg['tool_calls'] as unknown[]).length)}` : ''}${hasToolCallId ? ` tool_call_id=${msg['tool_call_id']}` : ''}`;
      });
      // eslint-disable-next-line no-console
      console.error(
        `[DEBUG] Iteration ${iterations} - sending ${messages.length} messages:\n${msgSummary.join('\n')}`
      );
    }

    const result: CompletionResult = await provider.complete(
      messages as Array<{ role: string; content: string }>,
      {
        maxTokens: 4096,
        tools: toolSchemas.length > 0 ? toolSchemas : undefined,
      }
    );

    // Accumulate usage
    if (result.usage) {
      totalUsage.prompt_tokens =
        (totalUsage.prompt_tokens ?? 0) + (result.usage.prompt_tokens ?? 0);
      totalUsage.completion_tokens =
        (totalUsage.completion_tokens ?? 0) + (result.usage.completion_tokens ?? 0);
      totalUsage.total_tokens = (totalUsage.total_tokens ?? 0) + (result.usage.total_tokens ?? 0);
    }

    // Check if LLM wants to use tools
    if (result.toolCalls && result.toolCalls.length > 0) {
      // Add assistant message with tool calls
      // Use undefined for content when empty — some API backends (e.g. Anthropic
      // via SAP AI Core) may reject empty-string content on tool-call messages
      messages.push({
        role: 'assistant',
        content: result.text || undefined,
        tool_calls: result.toolCalls as ToolCall[],
      });

      // Execute each tool call
      for (const toolCall of result.toolCalls) {
        const { id, result: toolResult } = await executeToolCall(
          toolCall as ToolCall,
          toolContext,
          options?.onProgress
        );

        toolCallsExecuted++;
        toolCallSummary.push({
          name: toolCall.function.name,
          success: toolResult.success,
          error: toolResult.error,
        });

        // Add tool response to messages
        messages.push({
          role: 'tool',
          tool_call_id: id,
          content: JSON.stringify(toolResult),
        });
      }

      // Continue loop to let LLM process tool results
    } else {
      // No tool calls - LLM is done
      finalText = result.text;
      break;
    }
  }

  // Record cost
  if (totalUsage.prompt_tokens || totalUsage.completion_tokens) {
    const sessionId = options?.sessionManager?.getCurrentSession()?.metadata.id;
    getCostTracker().recordUsage(
      modelId,
      totalUsage.prompt_tokens ?? 0,
      totalUsage.completion_tokens ?? 0,
      sessionId
    );
  }

  // Save to session if provided
  if (options?.sessionManager) {
    options.sessionManager.addMessage('user', message, {
      input: totalUsage.prompt_tokens,
    });
    options.sessionManager.addMessage('assistant', finalText, {
      output: totalUsage.completion_tokens,
    });
  }

  options?.onProgress?.({
    type: 'complete',
    iteration: iterations,
    message: `Completed after ${iterations} iterations, ${toolCallsExecuted} tool calls`,
  });

  return {
    text: finalText,
    usage: {
      prompt_tokens: totalUsage.prompt_tokens ?? 0,
      completion_tokens: totalUsage.completion_tokens ?? 0,
      total_tokens: totalUsage.total_tokens ?? 0,
    },
    modelUsed: modelId,
    routingReason,
    iterations,
    toolCallsExecuted,
    toolCallSummary,
  };
}
