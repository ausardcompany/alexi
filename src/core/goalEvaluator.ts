/**
 * Goal Evaluator - Evaluates completion conditions for the /goal command
 *
 * Provides interfaces and functions for defining goals, tracking progress,
 * and evaluating whether a goal has been met via shell commands or LLM judgment.
 */

import { spawn } from 'child_process';
import type { ToolContext } from '../tool/index.js';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface GoalDefinition {
  /** Natural language description of the goal */
  description: string;
  /** Maximum number of autonomous turns (default: 20) */
  maxTurns?: number;
  /** Maximum elapsed time in milliseconds (default: 300000 = 5 minutes) */
  maxTimeMs?: number;
  /** Optional shell command — goal is met if exit code is 0 */
  checkCommand?: string;
}

export interface GoalProgress {
  turnsElapsed: number;
  elapsedMs: number;
  tokensUsed: number;
  lastAssistantMessage: string;
  isComplete: boolean;
  reason?: 'goal_met' | 'max_turns' | 'max_time' | 'cancelled' | 'error';
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_MAX_TURNS = 20;
const DEFAULT_MAX_TIME_MS = 300_000; // 5 minutes
const CHECK_COMMAND_TIMEOUT_MS = 30_000; // 30 seconds

// ---------------------------------------------------------------------------
// Shell command runner
// ---------------------------------------------------------------------------

/**
 * Run a shell command and return its exit code.
 * Resolves with the exit code (0 = success).
 */
function runCheckCommand(command: string, workdir: string, signal?: AbortSignal): Promise<number> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Operation aborted'));
      return;
    }

    const proc = spawn(command, {
      shell: true,
      cwd: workdir,
      env: { ...process.env, FORCE_COLOR: '0' },
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
    }, CHECK_COMMAND_TIMEOUT_MS);

    const onAbort = () => {
      proc.kill('SIGTERM');
    };
    signal?.addEventListener('abort', onAbort, { once: true });

    proc.on('close', (code) => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);

      if (timedOut) {
        resolve(1); // Treat timeout as failure
      } else {
        resolve(code ?? 1);
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(err);
    });
  });
}

// ---------------------------------------------------------------------------
// Goal evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate whether the goal has been met.
 *
 * - If `checkCommand` is set, run it and return `exitCode === 0`.
 * - Otherwise, use heuristic analysis of the last assistant message to
 *   determine if the goal appears to be met. (LLM-based evaluation would
 *   require a provider call — the caller in agenticChat handles that.)
 */
export async function evaluateGoal(
  goal: GoalDefinition,
  progress: GoalProgress,
  context: ToolContext
): Promise<boolean> {
  // If a check command is provided, use it as the definitive evaluation
  if (goal.checkCommand) {
    try {
      const exitCode = await runCheckCommand(goal.checkCommand, context.workdir, context.signal);
      return exitCode === 0;
    } catch {
      return false;
    }
  }

  // Without a check command, we rely on the LLM's self-assessment.
  // The assistant's last message is analyzed for completion signals.
  // This is a lightweight heuristic; the full LLM evaluation is done
  // by the caller in the goal loop.
  const msg = progress.lastAssistantMessage.toLowerCase();
  const completionIndicators = [
    'goal has been met',
    'goal is complete',
    'task is complete',
    'all done',
    'successfully completed',
    'goal achieved',
  ];
  return completionIndicators.some((indicator) => msg.includes(indicator));
}

// ---------------------------------------------------------------------------
// Limit checking
// ---------------------------------------------------------------------------

/**
 * Check if the goal loop should terminate due to limits.
 * Returns the termination reason, or undefined if the loop should continue.
 */
export function checkGoalLimits(
  goal: GoalDefinition,
  progress: GoalProgress,
  signal?: AbortSignal
): GoalProgress['reason'] | undefined {
  if (signal?.aborted) {
    return 'cancelled';
  }

  const maxTurns = goal.maxTurns ?? DEFAULT_MAX_TURNS;
  if (progress.turnsElapsed >= maxTurns) {
    return 'max_turns';
  }

  const maxTimeMs = goal.maxTimeMs ?? DEFAULT_MAX_TIME_MS;
  if (progress.elapsedMs >= maxTimeMs) {
    return 'max_time';
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// Prompt generation
// ---------------------------------------------------------------------------

/**
 * Generate the system-level instruction prepended to each turn when a goal is active.
 */
export function createGoalPrompt(goal: GoalDefinition): string {
  const parts: string[] = [
    '## Active Goal',
    '',
    `You are working autonomously toward the following goal:`,
    `"${goal.description}"`,
    '',
    'Continue working toward this goal. When you believe the goal is fully met, ' +
      'explicitly state "Goal has been met" in your response.',
  ];

  if (goal.checkCommand) {
    parts.push('');
    parts.push(`A verification command will be run after each turn: \`${goal.checkCommand}\``);
    parts.push('The goal is considered met when this command exits with code 0.');
  }

  return parts.join('\n');
}

/**
 * Generate the continuation prompt injected when the goal is not yet met.
 */
export function createContinuationPrompt(goal: GoalDefinition, progress: GoalProgress): string {
  const maxTurns = goal.maxTurns ?? DEFAULT_MAX_TURNS;
  const remaining = maxTurns - progress.turnsElapsed;

  return (
    `The goal is not yet met. Continue working toward: "${goal.description}"\n` +
    `Progress: ${progress.turnsElapsed} turns elapsed, ` +
    `${Math.round(progress.elapsedMs / 1000)}s elapsed, ` +
    `${remaining} turns remaining.`
  );
}

// ---------------------------------------------------------------------------
// Defaults export (for testing)
// ---------------------------------------------------------------------------

export const GOAL_DEFAULTS = {
  maxTurns: DEFAULT_MAX_TURNS,
  maxTimeMs: DEFAULT_MAX_TIME_MS,
  checkCommandTimeoutMs: CHECK_COMMAND_TIMEOUT_MS,
} as const;
