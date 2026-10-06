import React, { createContext, useCallback, useContext, useState } from 'react';

import { steerSubagent as postSteering } from '../../../agent/session.js';

/**
 * Tracks the TUI's knowledge of the currently-running subagent, if
 * any, and the pending steering prompt that should be rendered on top
 * of its output.
 *
 * This context is the glue between {@link useKeyboard} (which handles
 * Ctrl+S) and {@link SubagentView} (which displays the badge / border
 * treatment). It never owns subagent *execution*; the real subagent
 * lifecycle lives in `src/tool/tools/task.ts`.
 */
export interface SubagentState {
  /**
   * Session id of the currently-running subagent, or `null` when no
   * subagent is active. The parent registers the id as soon as it
   * spawns the subagent and clears it when the subagent completes.
   */
  activeSubagentId: string | null;
  /**
   * The latest steering prompt the user injected via Ctrl+S. Rendered
   * above the subagent output until the user clears it, the subagent
   * exits, or a newer steering prompt replaces it.
   */
  steeringPrompt: string | null;
  /**
   * ISO timestamp of the last successful steering post. Used by the
   * SubagentView to show how fresh the guidance is; `null` when no
   * steering has happened yet in this subagent run.
   */
  steeringDeliveredAt: string | null;
}

export interface SubagentContextValue extends SubagentState {
  /**
   * Mark a subagent as active. Called by the orchestrator when
   * spawning a subagent so the TUI knows to enable Ctrl+S.
   */
  setActiveSubagent: (sessionId: string | null) => void;
  /**
   * Post a steering prompt to the active subagent via the board, and
   * cache it locally for display. Returns `true` on successful post,
   * `false` when there is no active subagent or the board layer did
   * not accept the write (missing board, empty prompt).
   */
  steer: (prompt: string) => Promise<boolean>;
  /**
   * Drop the cached steering prompt (visual only; the posted board
   * message is unaffected). Called when the user dismisses the badge
   * or the subagent completes.
   */
  clearSteering: () => void;
}

const SubagentContext = createContext<SubagentContextValue | null>(null);

export function SubagentProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [activeSubagentId, setActiveSubagentId] = useState<string | null>(null);
  const [steeringPrompt, setSteeringPrompt] = useState<string | null>(null);
  const [steeringDeliveredAt, setSteeringDeliveredAt] = useState<string | null>(null);

  const setActiveSubagent = useCallback((sessionId: string | null) => {
    setActiveSubagentId(sessionId);
    if (sessionId === null) {
      setSteeringPrompt(null);
      setSteeringDeliveredAt(null);
    }
  }, []);

  const steer = useCallback(
    async (prompt: string): Promise<boolean> => {
      if (activeSubagentId === null) {
        return false;
      }
      const result = await postSteering(activeSubagentId, prompt);
      if (result === null) {
        return false;
      }
      setSteeringPrompt(result.prompt);
      setSteeringDeliveredAt(result.deliveredAt);
      return true;
    },
    [activeSubagentId]
  );

  const clearSteering = useCallback(() => {
    setSteeringPrompt(null);
    setSteeringDeliveredAt(null);
  }, []);

  const value: SubagentContextValue = {
    activeSubagentId,
    steeringPrompt,
    steeringDeliveredAt,
    setActiveSubagent,
    steer,
    clearSteering,
  };

  return <SubagentContext.Provider value={value}>{children}</SubagentContext.Provider>;
}

export function useSubagent(): SubagentContextValue {
  const ctx = useContext(SubagentContext);
  if (ctx === null) {
    throw new Error('useSubagent must be used within a SubagentProvider');
  }
  return ctx;
}

export { SubagentContext };
