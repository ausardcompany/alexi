/**
 * Shell ID Management
 * Generate and validate unique shell execution IDs
 * Based on kilocode/opencode shell ID patterns
 */

import { nanoid } from 'nanoid';

export namespace ShellId {
  export type ShellId = string & { readonly _brand: unique symbol };

  export function generate(): ShellId {
    return `shell_${nanoid(12)}` as ShellId;
  }

  export function isValid(id: string): id is ShellId {
    return id.startsWith('shell_') && id.length === 18;
  }
}
