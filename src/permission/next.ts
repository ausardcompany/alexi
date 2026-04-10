/**
 * Permission Pattern Matching Utilities
 * Supports glob patterns with wildcards for granular permission control
 */

/**
 * Evaluates a permission pattern against a path.
 * Supports glob patterns with wildcards.
 *
 * @param pattern - The permission pattern (e.g., "*.md", "src/**")
 * @param targetPath - The path to check
 * @returns true if pattern matches the path
 */
export function matchesPattern(pattern: string, targetPath: string): boolean {
  // Handle exact matches
  if (pattern === targetPath) return true;

  // Handle wildcard patterns
  if (pattern === '*') return true;

  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{GLOBSTAR}}/g, '.*')
    .replace(/\?/g, '.');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(targetPath);
}

/**
 * Evaluates permission rules in order, returning the first matching rule's action.
 * Rules are evaluated from most specific to least specific.
 */
export function evaluatePatternRules(
  rules: Array<{ pattern: string; action: 'allow' | 'deny' }>,
  targetPath: string
): 'allow' | 'deny' | undefined {
  for (const rule of rules) {
    if (matchesPattern(rule.pattern, targetPath)) {
      return rule.action;
    }
  }
  return undefined;
}

/**
 * Permission configuration types and utilities
 */
export type Action = 'allow' | 'deny' | 'ask';

export type PermissionRule = Action | { [pattern: string]: Action | null } | null;

export interface PermissionConfig {
  [permission: string]: PermissionRule;
}

export interface Rule {
  permission: string;
  pattern: string;
  action: Action;
}

export type Ruleset = Rule[];

/**
 * Pending permission request structure
 * Includes ruleset for later evaluation during drain
 */
export interface PendingRequest {
  info: {
    id: string;
    sessionID: string;
    permission: string;
    patterns: string[];
  };
  ruleset: Ruleset; // Store ruleset for later evaluation
  resolve: () => void;
  reject: (e: any) => void;
}

/**
 * Expand pattern shorthand (currently just returns the pattern as-is)
 */
function expand(pattern: string): string {
  return pattern;
}

/**
 * Permission state interface with allow-everything support
 */
export namespace Permission {
  export interface State {
    approved: string[];
    denied: string[];
    allowEverything: boolean;
    allowEverythingScope?: 'session' | 'project';
  }

  export function allowEverything(
    state: State,
    scope: 'session' | 'project' = 'session'
  ): State {
    return {
      ...state,
      allowEverything: true,
      allowEverythingScope: scope,
      approved: [...state.approved, '*'],
    };
  }

  export function disableAllowEverything(state: State): State {
    return {
      ...state,
      allowEverything: false,
      allowEverythingScope: undefined,
      approved: state.approved.filter((p) => p !== '*'),
    };
  }

  export function isAllowed(state: State, permission: string): boolean {
    if (state.allowEverything) return true;
    if (state.denied.includes(permission)) return false;
    if (state.approved.includes('*')) return true;
    return state.approved.includes(permission);
  }

  export function pending(state: State): string[] {
    if (state.allowEverything) return [];
    // Return permissions that are neither approved nor denied
    return [];
  }
}

/**
 * Permission configuration parsing and serialization utilities
 * Handles null sentinels for deletion in config patches
 */
export const PermissionNext = {
  fromConfig(config: PermissionConfig): Ruleset {
    const ruleset: Ruleset = [];
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string') {
        ruleset.push({
          permission: key,
          pattern: '*',
          action: value,
        });
        continue;
      }
      // null is a delete sentinel — skip it (it only appears in patches, not in stored config)
      if (value === null) {
        continue;
      }
      ruleset.push(
        // Filter out null entries (delete sentinels) — they don't represent real rules
        ...Object.entries(value)
          .filter(([, action]) => action !== null)
          .map(([pattern, action]) => ({
            permission: key,
            pattern: expand(pattern),
            action: action as Action,
          }))
      );
    }
    return ruleset;
  },

  toConfig(rules: Ruleset): PermissionConfig {
    const result: PermissionConfig = {};
    for (const rule of rules) {
      const existing = result[rule.permission];
      if (existing === undefined || existing === null) {
        // Use object format to avoid replacing existing granular rules
        // when merged via updateGlobal (e.g. { read: "allow" } would wipe
        // { read: { "*": "ask", "src/*": "allow" } })
        result[rule.permission] = { [rule.pattern]: rule.action };
      } else if (typeof existing === 'string') {
        // Convert string to object format and add new pattern
        result[rule.permission] = {
          '*': existing,
          [rule.pattern]: rule.action,
        };
      } else {
        // Add to existing object
        existing[rule.pattern] = rule.action;
      }
    }
    return result;
  },

  /**
   * Evaluate a permission pattern against rulesets
   * Returns the action to take (allow, deny, or ask)
   */
  evaluate(
    permission: string,
    pattern: string,
    ruleset: Ruleset,
    approved: Ruleset
  ): { action: Action } {
    // Check approved rules first (highest priority)
    for (const rule of approved) {
      if (rule.permission === permission && matchesPattern(rule.pattern, pattern)) {
        return { action: rule.action };
      }
    }

    // Check local ruleset
    for (const rule of ruleset) {
      if (rule.permission === permission && matchesPattern(rule.pattern, pattern)) {
        return { action: rule.action };
      }
    }

    // Default to ask
    return { action: 'ask' };
  },

  /**
   * Events for permission system
   */
  Event: {
    Replied: 'permission.replied',
  },

  /**
   * Merge multiple rulesets into one
   * Later rulesets take precedence
   */
  merge(...rulesets: Ruleset[]): Ruleset {
    const result: Ruleset = [];
    for (const ruleset of rulesets) {
      result.push(...ruleset);
    }
    return result;
  },

  /**
   * Error thrown when permission is denied
   */
  DeniedError: class extends Error {
    constructor(public rules: Rule[]) {
      super('Permission denied');
      this.name = 'PermissionDeniedError';
    }
  },
};
