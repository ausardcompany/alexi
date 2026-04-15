/**
 * Alexi Task Module
 * Handles subagent validation and permission inheritance for task tool operations
 */

import type { Agent } from '../../agent/index.js';

// Simple permission rule type
interface PermissionRule {
  permission: string;
  pattern: string;
  action: 'allow' | 'ask' | 'deny';
}

type Ruleset = PermissionRule[];

export namespace AlexiTask {
  /** Reject primary agents used as subagents */
  export function validate(agent: Agent, name: string): void {
    if (agent.mode === 'primary') {
      throw new Error(`Agent "${name}" is a primary agent and cannot be used as a subagent`);
    }
  }

  /**
   * Build inherited permission rules from the calling agent.
   * Merges the static agent definition with the session's accumulated permissions
   * so restrictions survive multi-hop chains.
   */
  export function inherited(input: {
    callerPermissions?: Ruleset;
    sessionPermissions?: Ruleset;
    mcpConfig?: Record<string, unknown>;
  }): Ruleset {
    const rules = mergePermissions(
      input.callerPermissions ?? [],
      input.sessionPermissions ?? []
    );
    const prefixes = Object.keys(input.mcpConfig ?? {}).map(
      (k) => k.replace(/[^a-zA-Z0-9_-]/g, '_') + '_'
    );
    const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix));
    return rules.filter(
      (r: PermissionRule) =>
        r.permission === 'edit' || r.permission === 'bash' || isMcp(r.permission)
    );
  }

  /** Extra permission rules appended to subagent sessions */
  export function permissions(rules: Ruleset): Ruleset {
    return [{ permission: 'task', pattern: '*', action: 'deny' }, ...rules];
  }

  /** Merge two permission rulesets */
  function mergePermissions(rules1: Ruleset, rules2: Ruleset): Ruleset {
    const merged = new Map<string, PermissionRule>();

    // Add all rules from first set
    for (const rule of rules1) {
      const key = `${rule.permission}:${rule.pattern}`;
      merged.set(key, rule);
    }

    // Add/override with rules from second set
    for (const rule of rules2) {
      const key = `${rule.permission}:${rule.pattern}`;
      merged.set(key, rule);
    }

    return Array.from(merged.values());
  }
}
