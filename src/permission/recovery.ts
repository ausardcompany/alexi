/**
 * Stalled permission approval recovery
 *
 * Upstream fix (kilocode d8eaefdf1, f6d761e65, fa897b854): permission
 * approvals could stall or be lost during aborts — the tool execution
 * pipeline would then block forever waiting for a response that would
 * never arrive. This module tracks in-flight `askUser()` prompts by
 * request id and provides reconciliation entry points:
 *
 *   - `recoverStalledPermissions()` — called on session resume /
 *     provider re-init; expires prompts whose deadline has passed by
 *     resolving them as denials (with reason `stalled_recovery`).
 *   - `reconcileAbortedSave(ruleId)` — called when a permission-rule
 *     save is aborted mid-flight; drops the corresponding pending
 *     entry with reason `save_aborted` rather than letting the tool
 *     await indefinitely.
 *
 * Alexi's `PermissionManager.askUser()` in `src/permission/index.ts`
 * already uses the bus `waitForEvent(PermissionResponse, ..., timeout)`
 * pattern, so a per-prompt timeout is already enforced. The registry
 * here adds cross-cutting recovery for the case where the bus itself
 * is disrupted (session restart, hot-reload, `--yolo` toggle) between
 * the request being published and the response arriving.
 */

import { logger } from '../utils/logger.js';

export interface PermissionRecoveryResult {
  approved: boolean;
  reason: 'stalled_recovery' | 'save_aborted';
}

interface PendingPermission {
  id: string;
  createdAt: number;
  timeoutMs: number;
  resolver: (result: PermissionRecoveryResult) => void;
}

const pending = new Map<string, PendingPermission>();

/**
 * Default recovery window — 5 minutes. Any pending entry older than
 * this at the time `recoverStalledPermissions()` is called is treated
 * as stalled and resolved as a denial.
 */
const DEFAULT_RECOVERY_WINDOW_MS = 5 * 60 * 1000;

/**
 * Register a pending permission prompt so it can be reconciled on
 * session resume / rule-save abort. Returns the id assigned to the
 * entry — callers pass this to `resolvePending` when the response
 * arrives normally so the entry is cleared instead of expiring.
 */
export function trackPendingPermission(
  id: string,
  resolver: (result: PermissionRecoveryResult) => void,
  timeoutMs: number = DEFAULT_RECOVERY_WINDOW_MS
): void {
  pending.set(id, {
    id,
    createdAt: Date.now(),
    timeoutMs,
    resolver,
  });
}

/**
 * Clear a pending entry that resolved normally (user answered before
 * any recovery pass ran).
 */
export function clearPendingPermission(id: string): void {
  pending.delete(id);
}

/**
 * Sweep pending prompts and reconcile any whose deadline has passed
 * as denials. Called on session resume / provider re-init.
 */
export function recoverStalledPermissions(): number {
  const now = Date.now();
  let recovered = 0;
  for (const [id, entry] of pending.entries()) {
    if (now - entry.createdAt > entry.timeoutMs) {
      try {
        entry.resolver({ approved: false, reason: 'stalled_recovery' });
      } catch (err) {
        logger.warn(
          `[permission] stalled-recovery resolver for ${id} threw: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
      pending.delete(id);
      recovered += 1;
    }
  }
  return recovered;
}

/**
 * Reconcile an aborted permission-rule save. If a rule save was
 * in-flight when the caller aborted, ensure the pending permission
 * entry keyed by the same id does not sit around waiting for a save
 * that will never land — resolve it as a denial with reason
 * `save_aborted`.
 */
export function reconcileAbortedSave(ruleId: string): boolean {
  const entry = pending.get(ruleId);
  if (!entry) {
    return false;
  }
  try {
    entry.resolver({ approved: false, reason: 'save_aborted' });
  } catch (err) {
    logger.warn(
      `[permission] save-aborted resolver for ${ruleId} threw: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
  pending.delete(ruleId);
  return true;
}

/**
 * Test-only: reset the pending map so consecutive fixtures do not
 * observe entries from prior tests.
 */
export function _resetPendingPermissionsForTests(): void {
  pending.clear();
}

/**
 * Test-only: count currently tracked pending entries.
 */
export function _getPendingPermissionCountForTests(): number {
  return pending.size;
}
