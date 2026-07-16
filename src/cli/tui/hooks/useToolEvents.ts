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
    const unsubStarted = ToolExecutionStarted.subscribe(
      ({ toolName, toolId, parameters, timestamp }) => {
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
        isExpanded: false,
        completedAt: timestamp,
      });
    });

    const unsubFailed = ToolExecutionFailed.subscribe(({ toolId, error, timestamp }) => {
      updateToolCall(toolId, {
        status: 'failed',
        error,
        isExpanded: true,
        completedAt: timestamp,
      });
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
    };
  }, [addToolCall, updateToolCall, onDetachAvailable, onDetachedExited]);
}
