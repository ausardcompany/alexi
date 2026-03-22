/**
 * Permission Drain Module
 * Auto-resolves pending permissions now fully covered by approved or denied rules.
 * 
 * When the user approves/denies a rule on subagent A, sibling subagent B's
 * pending permission for the same pattern resolves or rejects automatically.
 */

import { PermissionResponse } from '../bus/index.js';
import { matchPattern } from './wildcard.js';

/**
 * Permission request information
 */
export interface PermissionRequestInfo {
  id: string;
  sessionID: string;
  permission: string;
  patterns: string[];
}

/**
 * Permission rule
 */
export interface PermissionRule {
  permission: string;
  pattern: string;
  action: 'allow' | 'deny' | 'ask';
}

/**
 * Ruleset type
 */
export type Ruleset = PermissionRule[];

/**
 * Evaluation result
 */
export interface EvaluationResult {
  action: 'allow' | 'deny' | 'ask';
}

/**
 * Pending permission entry
 */
export interface PendingEntry {
  info: PermissionRequestInfo;
  ruleset: Ruleset;
  resolve: () => void;
  reject: (e: any) => void;
}

/**
 * Permission denied error
 */
export class PermissionDeniedError extends Error {
  constructor(public rules: PermissionRule[]) {
    super('Permission denied by rules');
    this.name = 'PermissionDeniedError';
  }
}

/**
 * Evaluate a permission against a pattern using current and approved rulesets
 */
function evaluatePermission(
  permission: string,
  pattern: string,
  currentRuleset: Ruleset,
  approvedRuleset: Ruleset,
): EvaluationResult {
  // First check approved ruleset (newly added rules)
  for (const rule of approvedRuleset) {
    if (rule.permission === permission && matchPattern(rule.pattern, pattern).matched) {
      return { action: rule.action };
    }
  }

  // Then check current ruleset
  for (const rule of currentRuleset) {
    if (rule.permission === permission && matchPattern(rule.pattern, pattern).matched) {
      return { action: rule.action };
    }
  }

  // Default to ask if no rules match
  return { action: 'ask' };
}

/**
 * Auto-resolve pending permissions now fully covered by approved or denied rules.
 * When the user approves/denies a rule on subagent A, sibling subagent B's
 * pending permission for the same pattern resolves or rejects automatically.
 * 
 * @param pending - Map of pending permission requests
 * @param approved - Newly approved ruleset to evaluate against
 * @param exclude - Optional request ID to exclude from draining (the one that triggered this)
 */
export async function drainCovered(
  pending: Record<string, PendingEntry>,
  approved: Ruleset,
  exclude?: string,
): Promise<void> {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) {
      continue;
    }

    // Evaluate each pattern in the request
    const actions = entry.info.patterns.map((pattern) =>
      evaluatePermission(entry.info.permission, pattern, entry.ruleset, approved),
    );

    // Check if any pattern is denied
    const denied = actions.some((r) => r.action === 'deny');
    // Check if all patterns are allowed (and none are denied)
    const allowed = !denied && actions.every((r) => r.action === 'allow');

    // If not fully resolved, skip this entry
    if (!denied && !allowed) {
      continue;
    }

    // Remove from pending
    delete pending[id];

    if (denied) {
      // Publish denied response event
      PermissionResponse.publish({
        id: entry.info.id,
        granted: false,
        remember: false,
        timestamp: Date.now(),
      });

      // Reject with error containing matching rules
      const matchingRules = approved.filter((r) =>
        entry.info.patterns.some((p) => r.permission === entry.info.permission && matchPattern(r.pattern, p).matched),
      );
      entry.reject(new PermissionDeniedError(matchingRules));
    } else {
      // Publish allowed response event
      PermissionResponse.publish({
        id: entry.info.id,
        granted: true,
        remember: false,
        timestamp: Date.now(),
      });

      // Resolve the promise
      entry.resolve();
    }
  }
}
