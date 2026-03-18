/**
 * Bash Hierarchy - Builds hierarchical permission rules for bash commands
 *
 * For a command like "npm install lodash", generates rules:
 * - "npm"
 * - "npm install"
 * - "npm install lodash"
 *
 * This allows users to approve at different granularity levels.
 */

export namespace BashHierarchy {
  /**
   * Add all hierarchy levels for a command to the rules set.
   * @param rules - Set to add rules to
   * @param command - Array of command parts (e.g., ["npm", "install", "lodash"])
   * @param fullCommand - The full command string for the most specific rule
   */
  export function addAll(rules: Set<string>, command: string[], fullCommand: string): void {
    if (command.length === 0) {
      return;
    }

    // Add progressive prefixes: "npm", "npm install", etc.
    for (let i = 1; i <= command.length; i++) {
      const prefix = command.slice(0, i).join(' ');
      rules.add(prefix);
    }

    // Add the exact full command if different from the last prefix
    const lastPrefix = command.join(' ');
    if (fullCommand !== lastPrefix) {
      rules.add(fullCommand);
    }
  }

  /**
   * Check if a command matches any rule in the hierarchy.
   * @param rules - Set of approved rules
   * @param command - Command to check
   * @returns true if any prefix of the command is in rules
   */
  export function matches(rules: Set<string>, command: string[]): boolean {
    for (let i = 1; i <= command.length; i++) {
      const prefix = command.slice(0, i).join(' ');
      if (rules.has(prefix)) {
        return true;
      }
    }
    return false;
  }
}
