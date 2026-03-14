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
  if (pattern === "*") return true;
  
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\*\*/g, "{{GLOBSTAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/{{GLOBSTAR}}/g, ".*")
    .replace(/\?/g, ".");
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(targetPath);
}

/**
 * Evaluates permission rules in order, returning the first matching rule's action.
 * Rules are evaluated from most specific to least specific.
 */
export function evaluatePatternRules(
  rules: Array<{ pattern: string; action: "allow" | "deny" }>,
  targetPath: string
): "allow" | "deny" | undefined {
  for (const rule of rules) {
    if (matchesPattern(rule.pattern, targetPath)) {
      return rule.action;
    }
  }
  return undefined;
}
