/**
 * Permission Drain Module
 * Auto-resolves pending permissions when rules change
 *
 * When a user approves/denies a permission rule, other pending permissions
 * for the same or similar patterns should auto-resolve to prevent redundant
 * permission prompts and improve UX consistency.
 *
 * Note: This implementation is adapted for Alexi's PermissionManager architecture.
 * It provides the foundation for cross-subagent permission resolution when
 * subagents are fully implemented with independent permission states.
 */

import type { PermissionRule, PermissionContext } from './index.js';
import { PermissionResponse } from '../bus/index.js';

/**
 * Pending permission request with resolution callbacks
 */
export interface PendingPermission {
  id: string;
  context: PermissionContext;
  rules: PermissionRule[]; // Ruleset snapshot at request time
  resolve: (granted: boolean) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

/**
 * Storage for pending permission requests across sessions
 */
const pendingPermissions = new Map<string, PendingPermission>();

/**
 * Register a pending permission request
 */
export function registerPending(pending: PendingPermission): void {
  pendingPermissions.set(pending.id, pending);
}

/**
 * Remove a pending permission request
 */
export function removePending(id: string): boolean {
  return pendingPermissions.delete(id);
}

/**
 * Get all pending permission requests
 */
export function getPendingPermissions(): PendingPermission[] {
  return Array.from(pendingPermissions.values());
}

/**
 * Clear all pending permissions (useful for cleanup)
 */
export function clearPendingPermissions(): void {
  pendingPermissions.clear();
}

/**
 * Check if a permission context matches a rule
 */
function matchesRule(context: PermissionContext, rule: PermissionRule): boolean {
  // Check action
  if (rule.actions && rule.actions.length > 0) {
    if (!rule.actions.includes(context.action)) {
      return false;
    }
  }

  // Check tool name
  if (rule.tools && rule.tools.length > 0) {
    const toolMatches = rule.tools.some((pattern) => {
      // Simple wildcard matching
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(context.toolName);
    });
    if (!toolMatches) {
      return false;
    }
  }

  // Check paths (for file operations)
  if (rule.paths && rule.paths.length > 0 && context.action !== 'network') {
    const pathMatches = rule.paths.some((pattern) => {
      // Simple wildcard matching
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
      return regex.test(context.resource);
    });
    if (!pathMatches) {
      return false;
    }
  }

  // Check commands (for execute actions)
  if (rule.commands && rule.commands.length > 0 && context.action === 'execute') {
    const cmdMatches = rule.commands.some((pattern) => {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(context.resource);
    });
    if (!cmdMatches) {
      return false;
    }
  }

  // Check hosts (for network actions)
  if (rule.hosts && rule.hosts.length > 0 && context.action === 'network') {
    const hostMatches = rule.hosts.some((pattern) => {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(context.resource);
    });
    if (!hostMatches) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluate if a context is fully covered by new rules
 * Returns: 'allow' | 'deny' | 'ask'
 */
function evaluateWithRules(
  context: PermissionContext,
  newRules: PermissionRule[]
): 'allow' | 'deny' | 'ask' {
  // Evaluate rules in priority order (last match wins)
  let decision: 'allow' | 'deny' | 'ask' = 'ask';

  for (const rule of newRules) {
    if (matchesRule(context, rule)) {
      decision = rule.decision;
    }
  }

  return decision;
}

/**
 * Auto-resolve pending permissions now fully covered by approved or denied rules.
 *
 * When the user approves/denies a rule, sibling pending permissions
 * for the same pattern resolve or reject automatically.
 *
 * @param newRules - Newly added or updated rules
 * @param excludeId - Request ID to exclude (the one that triggered this drain)
 */
export async function drainCovered(newRules: PermissionRule[], excludeId?: string): Promise<void> {
  const toResolve: Array<{ id: string; granted: boolean }> = [];
  const toReject: Array<{ id: string; error: Error }> = [];

  // Iterate through pending permissions
  for (const [id, pending] of pendingPermissions.entries()) {
    // Skip the request that triggered this drain
    if (id === excludeId) {
      continue;
    }

    // Evaluate the pending context against new rules
    const decision = evaluateWithRules(pending.context, newRules);

    // Only process if fully resolved (not 'ask')
    if (decision === 'allow') {
      toResolve.push({ id, granted: true });
    } else if (decision === 'deny') {
      toReject.push({
        id,
        error: new Error(
          `Permission denied by rule for ${pending.context.action} on ${pending.context.resource}`
        ),
      });
    }
  }

  // Process resolutions
  for (const { id, granted } of toResolve) {
    const pending = pendingPermissions.get(id);
    if (pending) {
      // Publish response event
      PermissionResponse.publish({
        id,
        granted,
        remember: false,
        timestamp: Date.now(),
      });

      // Resolve the pending promise
      pending.resolve(granted);

      // Remove from pending
      pendingPermissions.delete(id);
    }
  }

  // Process rejections
  for (const { id, error } of toReject) {
    const pending = pendingPermissions.get(id);
    if (pending) {
      // Publish response event
      PermissionResponse.publish({
        id,
        granted: false,
        remember: false,
        timestamp: Date.now(),
      });

      // Reject the pending promise
      pending.reject(error);

      // Remove from pending
      pendingPermissions.delete(id);
    }
  }
}

/**
 * Cleanup expired pending permissions (older than timeout)
 */
export function cleanupExpired(timeoutMs: number = 60000): void {
  const now = Date.now();

  for (const [id, pending] of pendingPermissions.entries()) {
    if (now - pending.timestamp > timeoutMs) {
      // Reject expired permissions
      pending.reject(new Error('Permission request timed out'));
      pendingPermissions.delete(id);
    }
  }
}
