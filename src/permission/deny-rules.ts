/**
 * Hard Deny Rules for Auto-Mode
 * Prevents certain operations from being automatically approved,
 * regardless of allow rules or session grants.
 *
 * Deny rules take absolute priority - they cannot be overridden
 * by allow rules. Only explicit user override can bypass them.
 */

import { z } from 'zod';
import { matchPattern, matchCommand } from './wildcard.js';
import type { PermissionContext } from './index.js';

// ============ Schema ============

/**
 * Schema for a single hard deny rule.
 * Rules use glob patterns for paths and commands.
 */
export const HardDenyRuleSchema = z.object({
  /** Unique identifier for the rule */
  id: z.string().optional(),
  /** Human-readable name */
  name: z.string().optional(),
  /** Description of why this rule exists */
  description: z.string().optional(),
  /** Actions this rule applies to (e.g., 'write', 'execute') */
  actions: z.array(z.enum(['read', 'write', 'execute', 'network', 'admin'])).optional(),
  /** File path glob patterns to deny */
  paths: z.array(z.string()).optional(),
  /** Command patterns to deny */
  commands: z.array(z.string()).optional(),
  /** Tool name patterns to deny */
  tools: z.array(z.string()).optional(),
  /** Network host patterns to deny */
  hosts: z.array(z.string()).optional(),
});

export type HardDenyRule = z.infer<typeof HardDenyRuleSchema>;

/**
 * Schema for the deny rules configuration section in kilo.json
 */
export const DenyRulesConfigSchema = z.object({
  /** Hard deny rules that cannot be overridden by allow rules */
  rules: z.array(HardDenyRuleSchema).default([]),
});

export type DenyRulesConfig = z.infer<typeof DenyRulesConfigSchema>;

// ============ Matching Result ============

export interface DenyRuleMatchResult {
  /** Whether a deny rule matched */
  denied: boolean;
  /** The rule that matched, if any */
  rule?: HardDenyRule;
  /** Human-readable reason for the denial */
  reason?: string;
}

// ============ Deny Rules Evaluator ============

/**
 * Evaluates hard deny rules against a permission context.
 * Returns denial information if any rule matches.
 */
export function evaluateDenyRules(
  rules: HardDenyRule[],
  ctx: PermissionContext
): DenyRuleMatchResult {
  for (const rule of rules) {
    if (matchesDenyRule(rule, ctx)) {
      return {
        denied: true,
        rule,
        reason: buildDenyReason(rule, ctx),
      };
    }
  }
  return { denied: false };
}

/**
 * Check if a permission context matches a deny rule.
 * All specified criteria in a rule must match (AND logic).
 * At least one criterion must be specified for a rule to be valid.
 */
function matchesDenyRule(rule: HardDenyRule, ctx: PermissionContext): boolean {
  // A rule with no criteria matches nothing
  if (!hasAnyCriteria(rule)) {
    return false;
  }

  // Check actions - if specified, context action must be in the list
  if (rule.actions && rule.actions.length > 0) {
    if (!rule.actions.includes(ctx.action)) {
      return false;
    }
  }

  // Check tool names - if specified, context tool must match at least one pattern
  if (rule.tools && rule.tools.length > 0) {
    const toolMatches = rule.tools.some((pattern) => matchPattern(pattern, ctx.toolName).matched);
    if (!toolMatches) {
      return false;
    }
  }

  // Check paths - if specified, context resource must match at least one pattern
  // (only for file operations, not network)
  if (rule.paths && rule.paths.length > 0 && ctx.action !== 'network') {
    const pathMatches = rule.paths.some((pattern) => matchPattern(pattern, ctx.resource).matched);
    if (!pathMatches) {
      return false;
    }
  }

  // Check commands - if specified, context resource must match (only for execute actions)
  if (rule.commands && rule.commands.length > 0 && ctx.action === 'execute') {
    if (!matchCommand(ctx.resource, rule.commands)) {
      return false;
    }
  }

  // Check hosts - if specified, context resource must match (only for network actions)
  if (rule.hosts && rule.hosts.length > 0 && ctx.action === 'network') {
    const hostMatches = rule.hosts.some((pattern) => matchPattern(pattern, ctx.resource).matched);
    if (!hostMatches) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a rule has at least one matching criterion defined
 */
function hasAnyCriteria(rule: HardDenyRule): boolean {
  return (
    (rule.actions !== undefined && rule.actions.length > 0) ||
    (rule.paths !== undefined && rule.paths.length > 0) ||
    (rule.commands !== undefined && rule.commands.length > 0) ||
    (rule.tools !== undefined && rule.tools.length > 0) ||
    (rule.hosts !== undefined && rule.hosts.length > 0)
  );
}

/**
 * Build a human-readable reason for a denial
 */
function buildDenyReason(rule: HardDenyRule, ctx: PermissionContext): string {
  const parts: string[] = [];

  if (rule.name) {
    parts.push(`Hard deny rule "${rule.name}"`);
  } else if (rule.id) {
    parts.push(`Hard deny rule [${rule.id}]`);
  } else {
    parts.push('Hard deny rule');
  }

  parts.push(`blocked ${ctx.action} on "${ctx.resource}"`);

  if (rule.description) {
    parts.push(`(${rule.description})`);
  }

  return parts.join(' ');
}

// ============ Configuration Loading ============

/**
 * Parse deny rules from a raw configuration object.
 * Validates against the schema and returns typed rules.
 */
export function parseDenyRulesConfig(config: unknown): HardDenyRule[] {
  if (!config || typeof config !== 'object') {
    return [];
  }

  // Handle the case where config is directly an array of rules
  if (Array.isArray(config)) {
    const result = z.array(HardDenyRuleSchema).safeParse(config);
    return result.success ? result.data : [];
  }

  // Handle the object format { rules: [...] }
  const result = DenyRulesConfigSchema.safeParse(config);
  return result.success ? result.data.rules : [];
}

/**
 * Validate a single deny rule without parsing the full config.
 * Useful for runtime validation when adding rules dynamically.
 */
export function validateDenyRule(rule: unknown): {
  valid: boolean;
  rule?: HardDenyRule;
  error?: string;
} {
  const result = HardDenyRuleSchema.safeParse(rule);
  if (result.success) {
    if (!hasAnyCriteria(result.data)) {
      return {
        valid: false,
        error:
          'Deny rule must have at least one matching criterion (actions, paths, commands, tools, or hosts)',
      };
    }
    return { valid: true, rule: result.data };
  }
  return { valid: false, error: result.error.message };
}
