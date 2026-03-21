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
 * Expand pattern shorthand (currently just returns the pattern as-is)
 */
function expand(pattern: string): string {
  return pattern;
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
};
