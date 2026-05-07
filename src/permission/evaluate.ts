/**
 * Permission Evaluation Module
 * Enhanced with user override support
 */

import type { PermissionRule } from './index.js';

export type PermissionResult = 'allow' | 'deny' | 'ask';

export interface PermissionRequest {
  tool?: string;
  path?: string;
  command?: string;
  action?: string;
}

/**
 * Check if a request matches a rule
 */
function matchesRule(request: PermissionRequest, rule: PermissionRule): boolean {
  // Check tool name
  if (rule.tools && rule.tools.length > 0) {
    if (!request.tool || !rule.tools.some((t) => t === request.tool || t === '*')) {
      return false;
    }
  }

  // Check paths
  if (rule.paths && rule.paths.length > 0) {
    if (!request.path || !rule.paths.some((p) => p === request.path || p === '*')) {
      return false;
    }
  }

  // Check commands
  if (rule.commands && rule.commands.length > 0) {
    if (!request.command || !rule.commands.some((c) => c === request.command || c === '*')) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluate permission using last-match-wins with user overrides
 * User overrides take precedence over standard rules
 */
export function evaluatePermission(
  request: PermissionRequest,
  rules: PermissionRule[],
  userOverrides?: PermissionRule[]
): PermissionResult {
  // User overrides take precedence
  if (userOverrides) {
    for (const override of userOverrides) {
      if (matchesRule(request, override)) {
        return override.decision;
      }
    }
  }

  // Then check standard rules
  for (const rule of rules) {
    if (matchesRule(request, rule)) {
      return rule.decision;
    }
  }

  return 'deny';
}

/**
 * Merge permission rules with user overrides
 * User overrides are prepended to take precedence in last-match-wins evaluation
 */
export function mergePermissionRules(
  baseRules: PermissionRule[],
  userOverrides: PermissionRule[]
): PermissionRule[] {
  // User overrides are prepended to take precedence
  return [...userOverrides, ...baseRules];
}
