import { useEffect } from 'react';

import { useChat } from '../context/ChatContext.js';
import {
  ToolExecutionStarted,
  ToolExecutionCompleted,
  ToolExecutionFailed,
} from '../../../bus/index.js';
import {
  BashDetachAvailable,
  BashDetachedExited,
  resolveDetachDecision,
} from '../../../tool/tools/bash-detach.js';
import { getConfigMcpToolDisplay } from '../../../config/userConfig.js';

/**
 * MCP-namespaced tools follow the `mcp__<server>__<tool>` convention
 * (see `src/permission/index.ts`). We treat that prefix as the MCP
 * detector for the `mcp_tool_display` preference.
 */
const MCP_TOOL_PREFIX = 'mcp__';

/**
 * Resolve the completed-state expansion default for a given tool name
 * based on the user's `mcpToolDisplay` preference. Non-MCP tools keep
 * the historical behaviour (collapsed on completion). MCP tools honour
 * the preference — `'expanded'` keeps the body visible after the tool
 * finishes so users can inspect MCP output without an extra keypress.
 */
function resolveCompletedExpansion(toolName: string): boolean {
  if (!toolName.startsWith(MCP_TOOL_PREFIX)) {
    return false;
  }
  try {
    return getConfigMcpToolDisplay() === 'expanded';
  } catch {
    // Never let a corrupt config disable the completion signal.
    return false;
  }
}

/**
 * Optional handler surface for "Proceed While Running" (issue #1017).
 *
 * When a bash / shell command has been running for 5s inside an
 * interactive TUI session, `BashDetachAvailable` fires and the TUI is
 * expected to render a "Proceed" / "Wait" choice. Consumers who wire the
 * hook without providing `onDetachAvailable` still get the event-log
 * bridge (started / completed / failed / exited) — they just cannot
 * offer the detach choice interactively.
 */
export interface UseToolEventsOptions {
  /**
   * Called when a bash / shell command has crossed the detach threshold.
   * The consumer's UI presents the choice and calls the returned
   * `resolve` with the user's selection. If the consumer wants to keep
   * the command blocking they can call `resolve('wait')` (or simply
   * never resolve — the underlying tool cancels the pending decision
   * on process exit).
   */
  onDetachAvailable?: (info: {
    id: string;
    command: string;
    toolName: string;
    resolve: (decision: 'proceed' | 'wait') => void;
  }) => void;
  /**
   * Fired when a previously-detached process exits in the background.
   * Consumers use this to render "npm run dev finished (exit 0)" in
   * their log, distinct from the frozen partial-result block.
   */
  onDetachedExited?: (info: {
    id: string;
    command: string;
    toolName: string;
    exitCode: number | null;
  }) => void;
}

/**
 * Subscribes to the event bus ToolExecution events and bridges them into
 * ChatContext state. On mount it registers handlers for started, completed,
 * and failed tool executions; on unmount it tears down all subscriptions.
 *
 * This hook owns no local state — it is purely a one-way bridge from the
 * event bus into the ChatContext reducer.
 */
export function useToolEvents(options: UseToolEventsOptions = {}): void {
  const { addToolCall, updateToolCall } = useChat();
  const { onDetachAvailable, onDetachedExited } = options;

  useEffect(() => {
    // Per-effect scratch map: remember the completed-state expansion
    // default we should use for each tool id. Populated when a tool
    // starts (so we read `mcpToolDisplay` once per invocation), drained
    // when the tool completes or fails. Bounded by the number of
    // in-flight tools so no leak concerns.
    const mcpExpansionByToolId = new Map<string, boolean>();

    const unsubStarted = ToolExecutionStarted.subscribe(
      ({ toolName, toolId, parameters, timestamp }) => {
        mcpExpansionByToolId.set(toolId, resolveCompletedExpansion(toolName));
        addToolCall({
          id: toolId,
          toolName,
          params: parameters,
          status: 'running',
          output: null,
          error: null,
          isExpanded: true,
          diff: null,
          startedAt: timestamp,
          completedAt: null,
        });
      }
    );

    const unsubCompleted = ToolExecutionCompleted.subscribe(({ toolId, result, timestamp }) => {
      updateToolCall(toolId, {
        status: 'completed',
        output: String(result),
        // MCP tools honour the `mcpToolDisplay` preference — when the
        // user opted into `'expanded'`, keep the body visible after the
        // tool finishes. Non-MCP tools always collapse on completion,
        // preserving Alexi's historical behaviour.
        isExpanded: mcpExpansionByToolId.get(toolId) ?? false,
        completedAt: timestamp,
      });
      mcpExpansionByToolId.delete(toolId);
    });

    const unsubFailed = ToolExecutionFailed.subscribe(({ toolId, error, timestamp }) => {
      updateToolCall(toolId, {
        status: 'failed',
        error,
        isExpanded: true,
        completedAt: timestamp,
      });
      mcpExpansionByToolId.delete(toolId);
    });

    // Bash detach ("Proceed While Running"). We ALWAYS subscribe so late-
    // registered handlers do not miss events; if the consumer provided
    // no `onDetachAvailable`, we default the choice to 'wait' after a
    // short delay so the command does not block on a phantom prompt.
    const unsubDetach = BashDetachAvailable.subscribe(({ id, command, toolName }) => {
      if (onDetachAvailable) {
        onDetachAvailable({
          id,
          command,
          toolName,
          resolve: (decision) => resolveDetachDecision(id, decision),
        });
      } else {
        // No UI handler: fall back to the default blocking behaviour.
        resolveDetachDecision(id, 'wait');
      }
    });

    const unsubDetachedExited = BashDetachedExited.subscribe(
      ({ id, command, toolName, exitCode }) => {
        onDetachedExited?.({ id, command, toolName, exitCode });
      }
    );

    return () => {
      unsubStarted();
      unsubCompleted();
      unsubFailed();
      unsubDetach();
      unsubDetachedExited();
      mcpExpansionByToolId.clear();
    };
  }, [addToolCall, updateToolCall, onDetachAvailable, onDetachedExited]);
}
