/**
 * Shell Session ID Management
 * Provides unique identifiers for shell sessions
 */

import { randomUUID } from 'crypto';

export interface ShellId {
  readonly id: string;
  readonly timestamp: number;
}

/**
 * Create a new shell session ID
 */
export function createShellId(): ShellId {
  return {
    id: randomUUID(),
    timestamp: Date.now(),
  };
}

/**
 * Parse a shell ID from a JSON string
 */
export function parseShellId(raw: string): ShellId | undefined {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.id === 'string' && typeof parsed.timestamp === 'number') {
      return parsed as ShellId;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/**
 * Serialize a shell ID to JSON string
 */
export function serializeShellId(shellId: ShellId): string {
  return JSON.stringify(shellId);
}
