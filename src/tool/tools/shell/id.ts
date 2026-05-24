/**
 * Shell ID Generation Module
 * Based on upstream kilocode shell tool refactor
 * Generates unique identifiers for shell sessions
 */

import { nanoid } from 'nanoid';

export namespace ShellId {
  export type ShellId = string & { readonly _tag: 'ShellId' };

  /**
   * Generate a new unique shell session ID
   */
  export function generate(): ShellId {
    return `shell_${nanoid(12)}` as ShellId;
  }

  /**
   * Validate if a string is a valid shell ID
   */
  export function isValid(id: string): id is ShellId {
    return id.startsWith('shell_') && id.length === 18;
  }

  /**
   * Parse a shell ID from a string, returning undefined if invalid
   */
  export function parse(id: string): ShellId | undefined {
    return isValid(id) ? (id as ShellId) : undefined;
  }
}
