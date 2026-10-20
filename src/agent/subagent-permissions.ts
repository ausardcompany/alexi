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
import { PermissionAllowlist } from '../permission/allowlist.js';
import type { Agent } from './index.js';

/**
 * Edit-family permissions that an allowlist baseline on the parent session
 * can describe. If the parent writes `{ tools: ['edit'], paths: ['*'],
 * decision: 'deny' }` followed by `{ tools: ['edit'], paths: ['src/**'],
 * decision: 'allow' }`, the catch-all is only a baseline — we must NOT
 * project it onto spawned subagents as a hard ceiling, otherwise the
 * subagent loses edit entirely even though the parent can edit `src/**`.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/tool/task.ts`
 * fix (companion to `src/permission/allowlist.ts`).
 */
const EDIT_PERMISSION_NAMES = ['edit', 'write', 'multiedit', 'apply_patch', 'patch'] as const;

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
 *
 * ## Native vs. custom delegator edit scoping (kilocode `0c8849c18`)
 *
 * Ports upstream kilocode `0c8849c18 fix(agent): preserve custom delegator
 * subagent edit permissions`. A CUSTOM delegator (one whose `native` flag
 * is `false`) might have a tightly-scoped edit policy that only makes
 * sense for itself — e.g. `edit: { "secrets/**": "deny" }` configured
 * so that the delegator cannot touch secrets, which should NOT be
 * projected onto its spawned subagents as a hard ceiling. The subagent
 * might legitimately need to edit paths the delegator was forbidden
 * from touching.
 *
 * The fix: when the parent (caller) agent is non-native, we DROP its
 * edit-related deny rules and let only SESSION-level edit denials
 * become hard ceilings on spawned subagents. Native (built-in) agents
 * keep the previous behaviour because their edit restrictions are
 * part of the hardening contract (e.g. plan-mode read-only ceiling).
 *
 * In Alexi, "edit-related" denies are the ones that would come from the
 * parent agent's `tools` allowlist excluding `write` / `edit` / `apply_patch`,
 * or from `disabledTools` containing those names. Those are scoped to the
 * delegator itself when `parentAgent.native === false`. All non-edit
 * parent denies (bash, shell, etc.) still propagate as ceilings — only
 * EDIT scoping changes.
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

  // Custom (non-native) delegators scope their edit policy to themselves —
  // only session-level edit denials become hard ceilings on spawned
  // subagents. Native (built-in) delegators keep the previous behaviour
  // because their edit restrictions are part of the hardening contract
  // (e.g. plan-mode read-only ceiling). Ports kilocode `0c8849c18`.
  const parentIsCustom = input.parentAgent?.native === false;
  const EDIT_TOOL_NAMES = new Set(['write', 'edit', 'multiedit', 'apply_patch', 'patch']);

  if (input.parentAgent) {
    // If parent agent has limited tools, create deny rules for other actions
    if (input.parentAgent.tools && input.parentAgent.tools.length > 0) {
      const allowedTools = new Set(input.parentAgent.tools);
      // If write is not in allowed tools, deny it — but skip this for
      // custom (non-native) delegators so a user's custom edit scope on
      // the delegator does not accidentally confine its spawned subagents.
      if (!allowedTools.has('write') && !allowedTools.has('*') && !parentIsCustom) {
        parentAgentDenies.push({
          id: 'parent-deny-write',
          tools: ['write'],
          decision: 'deny',
          priority: 1000,
        });
      }
      // If shell/bash is not in allowed tools, deny it. Non-edit rules
      // (bash, shell) ALWAYS propagate as ceilings regardless of native vs
      // custom — only edit scoping changes.
      if (!allowedTools.has('shell') && !allowedTools.has('bash') && !allowedTools.has('*')) {
        parentAgentDenies.push({
          id: 'parent-deny-shell',
          tools: ['shell', 'bash'],
          decision: 'deny',
          priority: 1000,
        });
      }
    }

    // Add explicit disabled tools as deny rules. Edit-family tools in a
    // custom delegator's `disabledTools` list are scoped to the delegator
    // itself and do not propagate to subagents. Everything else still
    // becomes a ceiling. To confine a delegated workflow's writes, add
    // the restriction to the SESSION's permission ruleset instead — those
    // denies always propagate.
    if (input.parentAgent.disabledTools) {
      for (const tool of input.parentAgent.disabledTools) {
        if (parentIsCustom && EDIT_TOOL_NAMES.has(tool)) {
          continue;
        }
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
  //
  // Additionally, when an edit-family permission's catch-all deny is only
  // an ALLOWLIST BASELINE on the parent session (i.e. a later rule
  // narrows it with a path-specific allow), we must NOT propagate the
  // baseline as a hard ceiling to the subagent — otherwise the subagent
  // loses edit entirely even though the parent can edit the narrowed
  // paths. See `src/permission/allowlist.ts` for the semantics and
  // upstream kilocode commit that introduced this fix.
  const editAllowlistBaselines = new Set<PermissionRule>();
  for (const name of EDIT_PERMISSION_NAMES) {
    if (PermissionAllowlist.exceptions(name, input.parentSessionPermission)) {
      const baseline = PermissionAllowlist.catchAll(name, input.parentSessionPermission);
      if (baseline) {
        editAllowlistBaselines.add(baseline);
      }
    }
  }
  const sessionDeniesAndExternal = input.parentSessionPermission.filter((rule) => {
    if (editAllowlistBaselines.has(rule)) {
      return false;
    }
    return (
      rule.decision === 'deny' || (rule.tools && rule.tools.includes('external_directory'))
    );
  });

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
