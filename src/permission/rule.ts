/**
 * Permission Rule Schema and Matching
 * Defines permission rules and pattern matching logic
 */

export type PermissionEffect = 'allow' | 'deny' | 'ask';

export interface PermissionRule {
  tool?: string;
  toolPattern?: string;
  path?: string;
  pathPattern?: string;
  command?: string;
  commandPattern?: string;
  effect: PermissionEffect;
  reason?: string;
}

/**
 * Check if a request matches a permission rule
 * @param request - The permission request to check
 * @param rule - The rule to match against
 * @returns true if the request matches the rule
 */
export function matchesRule(
  request: { tool?: string; path?: string; command?: string },
  rule: PermissionRule
): boolean {
  // Exact matches
  if (rule.tool && request.tool !== rule.tool) {
    return false;
  }
  if (rule.path && request.path !== rule.path) {
    return false;
  }
  if (rule.command && request.command !== rule.command) {
    return false;
  }

  // Pattern matches
  if (rule.toolPattern && !matchPattern(request.tool, rule.toolPattern)) {
    return false;
  }
  if (rule.pathPattern && !matchPattern(request.path, rule.pathPattern)) {
    return false;
  }
  if (rule.commandPattern && !matchPattern(request.command, rule.commandPattern)) {
    return false;
  }

  return true;
}

/**
 * Match a value against a pattern
 * @param value - The value to match
 * @param pattern - The pattern (can be a regex string)
 * @returns true if the value matches the pattern
 */
function matchPattern(value: string | undefined, pattern: string): boolean {
  if (!value) {
    return false;
  }
  try {
    const regex = new RegExp(pattern);
    return regex.test(value);
  } catch {
    // If pattern is not a valid regex, do literal match
    return value === pattern;
  }
}

/**
 * Create a permission rule
 * @param rule - Partial rule definition
 * @returns Complete permission rule
 */
export function createPermissionRule(rule: Partial<PermissionRule>): PermissionRule {
  return {
    effect: rule.effect ?? 'ask',
    ...rule,
  };
}

/**
 * Validate a permission rule
 * @param rule - The rule to validate
 * @returns true if the rule is valid
 */
export function validatePermissionRule(rule: PermissionRule): boolean {
  // Must have at least one matching criterion
  const hasCriteria =
    rule.tool !== undefined ||
    rule.toolPattern !== undefined ||
    rule.path !== undefined ||
    rule.pathPattern !== undefined ||
    rule.command !== undefined ||
    rule.commandPattern !== undefined;

  if (!hasCriteria) {
    return false;
  }

  // Must have a valid effect
  if (!['allow', 'deny', 'ask'].includes(rule.effect)) {
    return false;
  }

  return true;
}

/**
 * Merge multiple permission rules
 * Later rules override earlier ones in case of conflicts
 * @param rules - Array of rule sets to merge
 * @returns Merged rule array
 */
export function mergePermissionRules(...rules: PermissionRule[][]): PermissionRule[] {
  return rules.flat();
}
