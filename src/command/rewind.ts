/**
 * Rewind Command
 * Lets users select a turn boundary and either discard all turns after that point,
 * or summarize all turns before that point while keeping recent turns intact.
 */

import type { Message } from '../core/sessionManager.js';
import { partialCompact } from '../core/compaction.js';

// ============ Types ============

export interface RewindResult {
  success: boolean;
  mode: 'discard' | 'summarize' | 'list';
  messages?: Message[];
  turnBoundaries?: TurnBoundary[];
  error?: string;
  discardedCount?: number;
  summarizedCount?: number;
}

export interface TurnBoundary {
  turnNumber: number;
  messageIndex: number;
  preview: string;
  role: Message['role'];
}

// ============ Constants ============

const PREVIEW_MAX_LENGTH = 50;

// ============ Core Functions ============

/**
 * Identify turn boundaries in a message array.
 * A "turn" starts at each user message (ignoring system messages).
 */
export function getTurnBoundaries(messages: Message[]): TurnBoundary[] {
  const boundaries: TurnBoundary[] = [];
  let turnNumber = 0;

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.role === 'system') {
      continue;
    }
    if (message.role === 'user') {
      turnNumber++;
      const preview =
        message.content.length > PREVIEW_MAX_LENGTH
          ? message.content.slice(0, PREVIEW_MAX_LENGTH) + '...'
          : message.content;
      boundaries.push({
        turnNumber,
        messageIndex: i,
        preview,
        role: message.role,
      });
    }
  }

  return boundaries;
}

/**
 * Parse the /rewind command arguments.
 * Returns the turn number and whether --summarize flag is present.
 */
export function parseRewindArgs(args: string[]): {
  turnNumber: number | null;
  summarize: boolean;
} {
  let summarize = false;
  let turnNumber: number | null = null;

  for (const arg of args) {
    if (arg === '--summarize') {
      summarize = true;
    } else {
      const parsed = parseInt(arg, 10);
      if (!isNaN(parsed)) {
        turnNumber = parsed;
      }
    }
  }

  return { turnNumber, summarize };
}

/**
 * Validate a turn number against available boundaries.
 */
export function validateTurnNumber(
  turnNumber: number,
  boundaries: TurnBoundary[]
): { valid: boolean; error?: string } {
  if (turnNumber <= 0) {
    return { valid: false, error: 'Turn number must be a positive integer' };
  }

  if (boundaries.length === 0) {
    return { valid: false, error: 'No turns available in the conversation' };
  }

  const maxTurn = boundaries[boundaries.length - 1].turnNumber;
  if (turnNumber > maxTurn) {
    return {
      valid: false,
      error: `Turn number ${turnNumber} is out of range (max: ${maxTurn})`,
    };
  }

  return { valid: true };
}

/**
 * Execute the rewind command in discard mode.
 * Removes all messages after the specified turn number.
 */
export function rewindDiscard(messages: Message[], turnNumber: number): RewindResult {
  const boundaries = getTurnBoundaries(messages);
  const validation = validateTurnNumber(turnNumber, boundaries);

  if (!validation.valid) {
    return { success: false, mode: 'discard', error: validation.error };
  }

  // Find the boundary for the specified turn
  const boundary = boundaries.find((b) => b.turnNumber === turnNumber);
  if (!boundary) {
    return { success: false, mode: 'discard', error: `Turn ${turnNumber} not found` };
  }

  // Find the end of this turn (start of next user message or end of array)
  const nextBoundary = boundaries.find((b) => b.turnNumber === turnNumber + 1);
  const endIndex = nextBoundary ? nextBoundary.messageIndex : messages.length;

  // Keep system messages + messages up to end of specified turn
  const kept = messages.slice(0, endIndex);
  const discardedCount = messages.length - kept.length;

  return {
    success: true,
    mode: 'discard',
    messages: kept,
    discardedCount,
  };
}

/**
 * Execute the rewind command in summarize mode.
 * Summarizes all messages before the specified turn while keeping
 * messages from that turn onward intact.
 */
export async function rewindSummarize(
  messages: Message[],
  turnNumber: number
): Promise<RewindResult> {
  const boundaries = getTurnBoundaries(messages);
  const validation = validateTurnNumber(turnNumber, boundaries);

  if (!validation.valid) {
    return { success: false, mode: 'summarize', error: validation.error };
  }

  // Find the boundary for the specified turn
  const boundary = boundaries.find((b) => b.turnNumber === turnNumber);
  if (!boundary) {
    return { success: false, mode: 'summarize', error: `Turn ${turnNumber} not found` };
  }

  // If the boundary is at the first message, nothing to summarize
  if (boundary.messageIndex === 0) {
    return {
      success: false,
      mode: 'summarize',
      error: 'Nothing to summarize before turn 1',
    };
  }

  const summarizedCount = boundary.messageIndex;
  const result = await partialCompact(messages, boundary.messageIndex);

  return {
    success: true,
    mode: 'summarize',
    messages: result,
    summarizedCount,
  };
}

/**
 * List available turn boundaries for the user.
 */
export function rewindList(messages: Message[]): RewindResult {
  const boundaries = getTurnBoundaries(messages);

  if (boundaries.length === 0) {
    return {
      success: false,
      mode: 'list',
      error: 'No turns available in the conversation',
    };
  }

  return {
    success: true,
    mode: 'list',
    turnBoundaries: boundaries,
  };
}

/**
 * Main rewind command executor.
 * Dispatches to the appropriate mode based on parsed arguments.
 */
export async function executeRewind(messages: Message[], args: string[]): Promise<RewindResult> {
  const { turnNumber, summarize } = parseRewindArgs(args);

  // No turn number: list available boundaries
  if (turnNumber === null) {
    return rewindList(messages);
  }

  // With --summarize: summarize mode
  if (summarize) {
    return await rewindSummarize(messages, turnNumber);
  }

  // Default: discard mode
  return rewindDiscard(messages, turnNumber);
}
