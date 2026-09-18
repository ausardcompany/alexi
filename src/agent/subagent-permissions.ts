/**
 * Subagent Permission Derivation
 *
 * Enforces subagent approval boundaries WITHOUT inheriting parent approvals.
 *
 * Security contract (aligns with cline/cline#14225):
 *
 *   1. Subagents inherit parent RESTRICTIONS (deny rules, disabled tools,
 *      external-directory guards) so they cannot bypass boundaries the
 *      parent already accepted.
 *   2. Subagents DO NOT inherit parent APPROVALS. A parent may have been
 *      granted `write` on the workspace by an interactive prompt, but a
 *      spawned subagent must re-prompt (or fail closed) unless the caller
 *      explicitly listed the tool in `allowedTools` on the `task` call.
 *   3. When `allowedTools` is provided, every OTHER tool that isn't in the
 *      allow-list is denied for the subagent's session, so the delegate
 *      only ever has the surface the parent explicitly granted.
 *
 * This is the counterpart to `src/tool/tools/task.ts` #buildSubagentConfig,
 * which previously carried `inheritPermissions: true` — that flag has been
 * removed. Subagent permissions are now derived here, not inherited.
 *
 * Original context (kilocode PR #26514, #26597): plan-mode restrictions
 * lived on the parent AGENT ruleset rather than the parent SESSION, so a
 * subagent that only inherited SESSION rules silently bypassed them.
 */

import type { PermissionRule } from '../permission/index.js';
import type { Agent } from './index.js';

/**
 * Input to {@link deriveSubagentSessionPermission}.
 */
export interface DeriveSubagentSessionPermissionInput {
  /**
   * The parent session's current permission rules. Only DENY rules and
   * external_directory rules are forwarded to the subagent — parent
   * ALLOW / ASK rules are dropped so the subagent cannot inherit
   * parent approvals.
   */
  parentSessionPermission: PermissionRule[];
  /**
   * The parent agent (if any). Its `tools` / `disabledTools` translate
   * into deny rules for the subagent.
   */
  parentAgent: Agent | undefined;
  /**
   * The subagent that will run. Used to check whether it needs default
   * `task` / `todowrite` denies.
   */
  subagent: Agent;
  /**
   * Optional explicit approval list. When provided, the subagent may only
   * use tools whose names appear here (matching upstream cline #14225 —
   * subagents only have approvals that were explicitly configured on the
   * `task` call). Every other tool is denied.
   *
   * `undefined` means "no explicit narrowing" (the subagent inherits the
   * usual restricted ruleset). An empty array is a valid "deny all
   * non-baseline tools" signal.
   */
  allowedTools?: readonly string[];
  /**
   * Optional bash rule overrides for the subagent (e.g. explore agent
   * hardening: `getExploreAgentBashRules()`). Converted into command-based
   * deny rules so `find -delete` / `gh *` / etc. cannot slip through
   * even when bash itself is in `allowedTools`.
   */
  bashRules?: Record<string, 'allow' | 'ask' | 'deny'>;
}

/**
 * Well-known baseline tools that are always available to subagents and
 * therefore should not be denied even when `allowedTools` is provided.
 * Includes read-only exploration primitives plus the reminder / status
 * tools the subagent needs to communicate back to the parent.
 */
const BASELINE_SUBAGENT_TOOLS: readonly string[] = [
  'read',
  'glob',
  'grep',
  'list',
  'ls',
  'task_status',
];

/**
 * Build the permission ruleset for a subagent's session when it's spawned
 * via the `task` tool. See module docs above for the security contract.
 */
export function deriveSubagentSessionPermission(
  input: DeriveSubagentSessionPermissionInput
): PermissionRule[] {
  const canTask = input.subagent.tools?.includes('task') ?? false;
  const canTodo = input.subagent.tools?.includes('todowrite') ?? false;

  // Extract parent agent deny rules
  // Note: In Alexi, agent permissions are expressed through tools/disabledTools
  // We need to convert these to permission rules
  const parentAgentDenies: PermissionRule[] = [];

  if (input.parentAgent) {
    // If parent agent has limited tools, create deny rules for other actions
    if (input.parentAgent.tools && input.parentAgent.tools.length > 0) {
      const allowedTools = new Set(input.parentAgent.tools);
      // If write is not in allowed tools, deny it
      if (!allowedTools.has('write') && !allowedTools.has('*')) {
        parentAgentDenies.push({
          id: 'parent-deny-write',
          tools: ['write'],
          decision: 'deny',
          priority: 1000,
        });
      }
      // If shell/bash is not in allowed tools, deny it
      if (!allowedTools.has('shell') && !allowedTools.has('bash') && !allowedTools.has('*')) {
        parentAgentDenies.push({
          id: 'parent-deny-shell',
          tools: ['shell', 'bash'],
          decision: 'deny',
          priority: 1000,
        });
      }
    }

    // Add explicit disabled tools as deny rules
    if (input.parentAgent.disabledTools) {
      for (const tool of input.parentAgent.disabledTools) {
        parentAgentDenies.push({
          id: `parent-deny-${tool}`,
          tools: [tool],
          decision: 'deny',
          priority: 1000,
        });
      }
    }
  }

  // Filter session permissions for deny rules and external_directory
  // (Deliberately drop allow / ask rules so parent approvals are NOT
  // inherited by the subagent — that would let a subagent silently
  // reuse a `write` grant the parent negotiated interactively.)
  const sessionDeniesAndExternal = input.parentSessionPermission.filter(
    (rule) => rule.decision === 'deny' || (rule.tools && rule.tools.includes('external_directory'))
  );

  // Build default denies for task and todowrite if not permitted
  const defaultDenies: PermissionRule[] = [];
  if (!canTodo) {
    defaultDenies.push({
      id: 'default-deny-todowrite',
      tools: ['todowrite'],
      paths: ['*'],
      decision: 'deny',
      priority: 500,
    });
  }
  if (!canTask) {
    defaultDenies.push({
      id: 'default-deny-task',
      tools: ['task'],
      paths: ['*'],
      decision: 'deny',
      priority: 500,
    });
  }

  // Explicit allow-list narrowing (cline #14225): when the `task` caller
  // supplied `allowed_tools`, deny every registered tool that isn't in
  // that list (plus the baseline read-only surface). This is what makes
  // the subagent's approvals purely explicit — a parent-side
  // interactive approval never reaches this level.
  const explicitDenies: PermissionRule[] = [];
  if (input.allowedTools) {
    const allowSet = new Set<string>([...BASELINE_SUBAGENT_TOOLS, ...input.allowedTools]);
    // Common tools that carry real side-effects; if any of them is not in
    // the allow-list, deny it explicitly. We do not use a wildcard tool
    // rule because the schema rejects wildcards in allow rules; deny
    // rules with globs are allowed but we prefer explicit names so error
    // messages point at the specific tool the subagent tried to invoke.
    const potentiallyDangerous = [
      'write',
      'edit',
      'multiedit',
      'patch',
      'apply_patch',
      'bash',
      'shell',
      'webfetch',
      'delete',
      'task',
      'todowrite',
    ];
    for (const tool of potentiallyDangerous) {
      if (!allowSet.has(tool)) {
        explicitDenies.push({
          id: `subagent-deny-${tool}`,
          tools: [tool],
          decision: 'deny',
          priority: 2000,
        });
      }
    }
  }

  // Explore agent (and any caller that supplies `bashRules`) gets a
  // command-based deny layer so bash escapes like `find -delete` or
  // `gh *` remain closed even if bash is otherwise permitted. Only
  // `deny`-marked entries translate into rules; `allow` / `ask` entries
  // are already the baseline behaviour of the bash permission map and
  // don't need duplication here.
  const bashDenies: PermissionRule[] = [];
  if (input.bashRules) {
    for (const [pattern, decision] of Object.entries(input.bashRules)) {
      if (decision !== 'deny') {
        continue;
      }
      bashDenies.push({
        id: `subagent-bash-deny-${pattern}`,
        tools: ['bash', 'shell'],
        commands: [pattern],
        actions: ['execute'],
        decision: 'deny',
        priority: 1500,
      });
    }
  }

  return [
    ...parentAgentDenies,
    ...sessionDeniesAndExternal,
    ...defaultDenies,
    ...explicitDenies,
    ...bashDenies,
  ];
}
