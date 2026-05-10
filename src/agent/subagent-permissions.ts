/**
 * Subagent Permission Derivation
 * Ensures subagents inherit parent agent deny rules to prevent security bypasses
 * Security fix from PR #26597
 */

import type { PermissionRule } from '../permission/index.js';
import type { Agent } from './index.js';

/**
 * Build the permission ruleset for a subagent's session when it's spawned
 * via the task tool. Combines:
 *
 * 1. The parent **agent's** deny rules — Plan Mode and other agent-level
 *    restrictions live on the agent ruleset, not on the session, so a
 *    subagent that only inherited the parent SESSION's permission would
 *    silently bypass them. (#26514)
 * 2. The parent **session's** deny rules and external_directory rules —
 *    same forwarding the original code already did.
 * 3. Default `todowrite` and `task` denies if the subagent's own ruleset
 *    doesn't already permit them.
 */
export function deriveSubagentSessionPermission(input: {
  parentSessionPermission: PermissionRule[];
  parentAgent: Agent | undefined;
  subagent: Agent;
}): PermissionRule[] {
  const canTask = input.subagent.tools?.includes('task') ?? false;
  const canTodo =
    input.subagent.tools?.includes('todowrite') ||
    !input.subagent.disabledTools?.includes('todowrite');

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
      if (
        !allowedTools.has('shell') &&
        !allowedTools.has('bash') &&
        !allowedTools.has('*')
      ) {
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
  const sessionDeniesAndExternal = input.parentSessionPermission.filter(
    (rule) =>
      rule.decision === 'deny' ||
      (rule.tools && rule.tools.includes('external_directory'))
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

  return [...parentAgentDenies, ...sessionDeniesAndExternal, ...defaultDenies];
}
