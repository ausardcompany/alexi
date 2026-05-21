/**
 * Shell ID Generation Module
 * Generates unique IDs for shell command execution tracking
 */

import { randomUUID } from 'crypto';

let counter = 0;

export function shellId(): string {
  counter++;
  const timestamp = Date.now().toString(36);
  const random = randomUUID().slice(0, 8);
  return `shell-${timestamp}-${counter}-${random}`;
}

export function resetShellIdCounter(): void {
  counter = 0;
}
