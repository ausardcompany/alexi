/**
 * Goal Command - Autonomous loop that iterates until a condition is met.
 *
 * Accepts a completion condition string and uses agenticChat() to work
 * toward meeting it. After each iteration, evaluates whether the condition
 * has been satisfied via a lightweight LLM call.
 *
 * Supports:
 * - Progress tracking (turns, tokens, elapsed time)
 * - Cancellation via AbortSignal
 * - Max turns safety cap (default 25, configurable via ALEXI_GOAL_MAX_TURNS)
 * - Event bus progress emission
 */

import { z } from 'zod';
import { agenticChat } from '../core/agenticChat.js';
import type { AgenticChatResult } from '../core/agenticChat.js';
import { sendChat } from '../core/orchestrator.js';
import { defineEvent } from '../bus/index.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_MAX_TURNS = 25;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GoalProgress {
  turn: number;
  maxTurns: number;
  elapsedMs: number;
  totalTokens: number;
  condition: string;
  status: 'running' | 'completed' | 'cancelled' | 'max_turns_reached';
  evaluation?: string;
}

export interface GoalResult {
  success: boolean;
  turns: number;
  elapsedMs: number;
  totalTokens: number;
  condition: string;
  finalEvaluation: string;
  status: 'completed' | 'cancelled' | 'max_turns_reached';
}

export interface GoalOptions {
  /** The condition to evaluate for completion */
  condition: string;
  /** AbortSignal for cancellation (e.g. Ctrl+C / Esc) */
  signal?: AbortSignal;
  /** Maximum number of turns before stopping (default: 25) */
  maxTurns?: number;
  /** Working directory for tool execution */
  workdir?: string;
  /** Model override for the agentic chat calls */
  modelOverride?: string;
  /** Callback for progress updates */
  onProgress?: (progress: GoalProgress) => void;
}

// ---------------------------------------------------------------------------
// Event Bus Events
// ---------------------------------------------------------------------------

export const GoalProgressEvent = defineEvent(
  'goal.progress',
  z.object({
    turn: z.number(),
    maxTurns: z.number(),
    elapsedMs: z.number(),
    totalTokens: z.number(),
    condition: z.string(),
    status: z.enum(['running', 'completed', 'cancelled', 'max_turns_reached']),
    evaluation: z.string().optional(),
    timestamp: z.number(),
  })
);

// ---------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------

/**
 * Evaluate whether the goal condition has been met by asking the LLM.
 * Returns { met: boolean, explanation: string }.
 */
async function evaluateCondition(
  condition: string,
  lastResponse: string,
  options?: { modelOverride?: string; signal?: AbortSignal }
): Promise<{ met: boolean; explanation: string }> {
  const evaluationPrompt =
    `Given the following work that was just performed:\n\n` +
    `---\n${lastResponse}\n---\n\n` +
    `Is this condition now met: "${condition}"?\n\n` +
    `Answer with exactly YES or NO on the first line, followed by a brief explanation.`;

  const result = await sendChat(evaluationPrompt, {
    modelOverride: options?.modelOverride,
    systemPrompt:
      'You are a condition evaluator. Assess whether a goal condition has been met ' +
      'based on the work performed. Be precise and conservative — only answer YES ' +
      'if the condition is clearly satisfied.',
    signal: options?.signal,
  });

  const text = result.text.trim();
  const firstLine = text.split('\n')[0].trim().toUpperCase();
  const met = firstLine.startsWith('YES');
  const explanation = text.split('\n').slice(1).join('\n').trim() || text;

  return { met, explanation };
}

// ---------------------------------------------------------------------------
// Main Goal Loop
// ---------------------------------------------------------------------------

/**
 * Execute an autonomous goal loop.
 *
 * Iterates calling agenticChat() with a prompt to continue working toward
 * the given condition. After each iteration, evaluates whether the condition
 * is met. Stops when:
 * - The condition is met (success)
 * - The AbortSignal is triggered (cancelled)
 * - Max turns are reached (safety cap)
 */
export async function executeGoal(options: GoalOptions): Promise<GoalResult> {
  const { condition, signal, workdir, modelOverride, onProgress } = options;

  const maxTurns =
    options.maxTurns ?? (parseInt(process.env.ALEXI_GOAL_MAX_TURNS ?? '', 10) || DEFAULT_MAX_TURNS);

  const startTime = Date.now();
  let totalTokens = 0;
  let turn = 0;
  let finalEvaluation = '';

  const emitProgress = (status: GoalProgress['status'], evaluation?: string): void => {
    const progress: GoalProgress = {
      turn,
      maxTurns,
      elapsedMs: Date.now() - startTime,
      totalTokens,
      condition,
      status,
      evaluation,
    };
    onProgress?.(progress);
    GoalProgressEvent.publish({ ...progress, timestamp: Date.now() });
  };

  while (turn < maxTurns) {
    // Check cancellation before starting a new turn
    if (signal?.aborted) {
      emitProgress('cancelled');
      return {
        success: false,
        turns: turn,
        elapsedMs: Date.now() - startTime,
        totalTokens,
        condition,
        finalEvaluation: 'Cancelled by user',
        status: 'cancelled',
      };
    }

    turn++;

    // Emit running progress
    emitProgress('running');

    // Build the prompt for this iteration
    const iterationPrompt =
      turn === 1
        ? `Work toward this goal: ${condition}`
        : `Continue working toward this goal: ${condition}\n\n` +
          `This is turn ${turn} of up to ${maxTurns}. ` +
          `Focus on making progress toward the goal.`;

    // Execute agentic chat
    let chatResult: AgenticChatResult;
    try {
      chatResult = await agenticChat(iterationPrompt, {
        modelOverride,
        workdir,
        signal,
        maxIterations: 25,
      });
    } catch (err: unknown) {
      // If aborted, treat as cancellation
      if (signal?.aborted || (err instanceof Error && err.name === 'AbortError')) {
        emitProgress('cancelled');
        return {
          success: false,
          turns: turn,
          elapsedMs: Date.now() - startTime,
          totalTokens,
          condition,
          finalEvaluation: 'Cancelled by user',
          status: 'cancelled',
        };
      }
      throw err;
    }

    // Accumulate token usage
    totalTokens += chatResult.usage.total_tokens;

    // Check cancellation after the turn
    if (signal?.aborted) {
      emitProgress('cancelled');
      return {
        success: false,
        turns: turn,
        elapsedMs: Date.now() - startTime,
        totalTokens,
        condition,
        finalEvaluation: 'Cancelled by user',
        status: 'cancelled',
      };
    }

    // Evaluate the condition
    const evaluation = await evaluateCondition(condition, chatResult.text, {
      modelOverride,
      signal,
    });

    finalEvaluation = evaluation.explanation;

    if (evaluation.met) {
      emitProgress('completed', evaluation.explanation);
      return {
        success: true,
        turns: turn,
        elapsedMs: Date.now() - startTime,
        totalTokens,
        condition,
        finalEvaluation: evaluation.explanation,
        status: 'completed',
      };
    }
  }

  // Max turns reached
  emitProgress('max_turns_reached', finalEvaluation);
  return {
    success: false,
    turns: turn,
    elapsedMs: Date.now() - startTime,
    totalTokens,
    condition,
    finalEvaluation: finalEvaluation || `Max turns (${maxTurns}) reached without meeting condition`,
    status: 'max_turns_reached',
  };
}
