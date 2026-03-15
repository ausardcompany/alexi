import { useEffect } from 'react';

import { useChat } from '../context/ChatContext.js';
import {
  ToolExecutionStarted,
  ToolExecutionCompleted,
  ToolExecutionFailed,
} from '../../../bus/index.js';

/**
 * Subscribes to the event bus ToolExecution events and bridges them into
 * ChatContext state. On mount it registers handlers for started, completed,
 * and failed tool executions; on unmount it tears down all subscriptions.
 *
 * This hook owns no local state — it is purely a one-way bridge from the
 * event bus into the ChatContext reducer.
 */
export function useToolEvents(): void {
  const { addToolCall, updateToolCall } = useChat();

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

    return () => {
      unsubStarted();
      unsubCompleted();
      unsubFailed();
    };
  }, [addToolCall, updateToolCall]);
}
