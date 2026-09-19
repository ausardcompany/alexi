/**
 * Tests for Subagent Permission Derivation
 * Ensures subagents properly inherit parent agent deny rules
 */

import { describe, it, expect } from 'vitest';
import { deriveSubagentSessionPermission } from './subagent-permissions.js';
import type { Agent } from './index.js';
import type { PermissionRule } from '../permission/index.js';

describe('deriveSubagentSessionPermission', () => {
  it('inherits parent agent deny rules from limited tool list', () => {
    const parentAgent: Agent = {
      id: 'plan-mode',
      name: 'Plan Mode',
      description: 'Plan mode agent',
      mode: 'all',
      systemPrompt: 'You are a planner',
      tools: ['read', 'glob', 'grep'], // Limited to read-only tools
      canUseTool: () => false,
    };

    const subagent: Agent = {
      id: 'coder',
      name: 'Coder',
      description: 'Coding agent',
      mode: 'all',
      systemPrompt: 'You are a coder',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission: [],
      parentAgent,
      subagent,
    });

    // Should deny write and shell since parent doesn't have them
    const writeDeny = result.find((r) => r.tools?.includes('write') && r.decision === 'deny');
    const shellDeny = result.find(
      (r) => (r.tools?.includes('shell') || r.tools?.includes('bash')) && r.decision === 'deny'
    );

    expect(writeDeny).toBeDefined();
    expect(shellDeny).toBeDefined();
  });

  it('inherits parent agent explicit disabled tools', () => {
    const parentAgent: Agent = {
      id: 'restricted',
      name: 'Restricted Agent',
      description: 'Restricted agent',
      mode: 'all',
      systemPrompt: 'You are restricted',
      disabledTools: ['write', 'delete', 'bash'],
      canUseTool: () => false,
    };

    const subagent: Agent = {
      id: 'coder',
      name: 'Coder',
      description: 'Coding agent',
      mode: 'all',
      systemPrompt: 'You are a coder',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission: [],
      parentAgent,
      subagent,
    });

    // Should have deny rules for each disabled tool
    expect(result.find((r) => r.tools?.includes('write') && r.decision === 'deny')).toBeDefined();
    expect(result.find((r) => r.tools?.includes('delete') && r.decision === 'deny')).toBeDefined();
    expect(result.find((r) => r.tools?.includes('bash') && r.decision === 'deny')).toBeDefined();
  });

  it('inherits parent session deny rules', () => {
    const sessionPermission: PermissionRule[] = [
      {
        id: 'deny-secrets',
        paths: ['**/.env', '**/secrets.*'],
        decision: 'deny',
        priority: 100,
      },
      {
        id: 'allow-read',
        actions: ['read'],
        decision: 'allow',
        priority: 0,
      },
    ];

    const subagent: Agent = {
      id: 'coder',
      name: 'Coder',
      description: 'Coding agent',
      mode: 'all',
      systemPrompt: 'You are a coder',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission: sessionPermission,
      parentAgent: undefined,
      subagent,
    });

    // Should include the deny rule but not the allow rule
    expect(result.find((r) => r.id === 'deny-secrets')).toBeDefined();
    expect(result.find((r) => r.id === 'allow-read')).toBeUndefined();
  });

  it('adds default todowrite and task denies unless subagent permits', () => {
    const subagentWithoutPermission: Agent = {
      id: 'basic',
      name: 'Basic Agent',
      description: 'Basic agent',
      mode: 'all',
      systemPrompt: 'You are basic',
      canUseTool: () => true,
    };

    const resultWithoutPermission = deriveSubagentSessionPermission({
      parentSessionPermission: [],
      parentAgent: undefined,
      subagent: subagentWithoutPermission,
    });

    expect(
      resultWithoutPermission.find((r) => r.tools?.includes('todowrite') && r.decision === 'deny')
    ).toBeDefined();
    expect(
      resultWithoutPermission.find((r) => r.tools?.includes('task') && r.decision === 'deny')
    ).toBeDefined();

    // Test with permission granted
    const subagentWithPermission: Agent = {
      id: 'advanced',
      name: 'Advanced Agent',
      description: 'Advanced agent',
      mode: 'all',
      systemPrompt: 'You are advanced',
      tools: ['todowrite', 'task', 'write', 'read'],
      canUseTool: () => true,
    };

    const resultWithPermission = deriveSubagentSessionPermission({
      parentSessionPermission: [],
      parentAgent: undefined,
      subagent: subagentWithPermission,
    });

    // Should not have todowrite/task denies
    expect(
      resultWithPermission.find((r) => r.tools?.includes('todowrite') && r.decision === 'deny')
    ).toBeUndefined();
    expect(
      resultWithPermission.find((r) => r.tools?.includes('task') && r.decision === 'deny')
    ).toBeUndefined();
  });

  // ------------------------------------------------------------------
  // Approval boundary tests (Cline #14225 / issue #1768)
  //
  // A parent session may have been granted `write` on the workspace by
  // an interactive prompt. A spawned subagent must NOT inherit that
  // approval — it should re-prompt (or fail closed) unless the caller
  // explicitly listed the tool in `allowedTools` on the `task` call.
  //
  // These tests exercise the three concrete cases spelled out in the
  // security contract at the top of `subagent-permissions.ts`:
  //   1. Parent ALLOW rule is dropped, not forwarded.
  //   2. Parent ASK rule is dropped, not forwarded.
  //   3. Parent DENY rule IS forwarded (subagents inherit restrictions).
  // ------------------------------------------------------------------

  it('does NOT inherit parent ALLOW rule for write tool', () => {
    // Simulate a parent session that was granted `write` approval by an
    // interactive prompt during the previous turn.
    const parentSessionPermission: PermissionRule[] = [
      {
        id: 'parent-allow-write',
        tools: ['write'],
        decision: 'allow',
        priority: 50,
      },
    ];

    const subagent: Agent = {
      id: 'coder',
      name: 'Coder',
      description: 'Coding agent',
      mode: 'all',
      systemPrompt: 'You are a coder',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission,
      parentAgent: undefined,
      subagent,
      // Deliberately omit `write` from allowedTools — the subagent must
      // NOT silently reuse the parent's grant.
      allowedTools: ['read', 'glob'],
    });

    // The parent ALLOW must NOT appear on the subagent's ruleset.
    expect(result.find((r) => r.id === 'parent-allow-write')).toBeUndefined();
    expect(
      result.find((r) => r.decision === 'allow' && r.tools?.includes('write'))
    ).toBeUndefined();

    // And because `write` was not in `allowedTools`, the derivation should
    // have added an explicit deny to close the door (fail-closed default).
    const writeDeny = result.find((r) => r.tools?.includes('write') && r.decision === 'deny');
    expect(writeDeny).toBeDefined();
  });

  it('does NOT inherit parent ASK rule', () => {
    // A parent that must confirm `edit` interactively should not silently
    // widen the subagent's surface to the same tool.
    const parentSessionPermission: PermissionRule[] = [
      {
        id: 'parent-ask-edit',
        tools: ['edit'],
        decision: 'ask',
        priority: 50,
      },
    ];

    const subagent: Agent = {
      id: 'coder',
      name: 'Coder',
      description: 'Coding agent',
      mode: 'all',
      systemPrompt: 'You are a coder',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission,
      parentAgent: undefined,
      subagent,
    });

    // Parent ASK rule must be filtered out.
    expect(result.find((r) => r.id === 'parent-ask-edit')).toBeUndefined();
    expect(result.some((r) => r.decision === 'ask')).toBe(false);
  });

  it('DOES inherit parent DENY rule (restrictions carry over)', () => {
    // Denies are inherited so a subagent cannot bypass a boundary the
    // parent already accepted.
    const parentSessionPermission: PermissionRule[] = [
      {
        id: 'parent-deny-secrets',
        paths: ['**/.env', '**/secrets.*'],
        decision: 'deny',
        priority: 100,
      },
    ];

    const subagent: Agent = {
      id: 'coder',
      name: 'Coder',
      description: 'Coding agent',
      mode: 'all',
      systemPrompt: 'You are a coder',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission,
      parentAgent: undefined,
      subagent,
    });

    // Deny rule must survive verbatim.
    expect(result.find((r) => r.id === 'parent-deny-secrets')).toBeDefined();
  });

  it('drops mixed ALLOW+ASK rules but retains DENY + external_directory', () => {
    // Comprehensive check: mix all four decision-shapes and verify only
    // the allowed set makes it through.
    const parentSessionPermission: PermissionRule[] = [
      {
        id: 'allow-write',
        tools: ['write'],
        decision: 'allow',
        priority: 10,
      },
      {
        id: 'ask-bash',
        tools: ['bash'],
        decision: 'ask',
        priority: 20,
      },
      {
        id: 'deny-config',
        paths: ['**/config/**'],
        decision: 'deny',
        priority: 30,
      },
      {
        id: 'external-dir',
        tools: ['external_directory'],
        // Even an ALLOW decision on an external_directory rule is kept
        // because external-directory guards are structural boundaries.
        decision: 'allow',
        priority: 40,
      },
    ];

    const subagent: Agent = {
      id: 'coder',
      name: 'Coder',
      description: 'Coding agent',
      mode: 'all',
      systemPrompt: 'You are a coder',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission,
      parentAgent: undefined,
      subagent,
    });

    expect(result.find((r) => r.id === 'allow-write')).toBeUndefined();
    expect(result.find((r) => r.id === 'ask-bash')).toBeUndefined();
    expect(result.find((r) => r.id === 'deny-config')).toBeDefined();
    expect(result.find((r) => r.id === 'external-dir')).toBeDefined();
  });

  it('combines all permission sources correctly', () => {
    const parentAgent: Agent = {
      id: 'plan',
      name: 'Plan Agent',
      description: 'Planning agent',
      mode: 'all',
      systemPrompt: 'You plan',
      tools: ['read', 'glob'],
      disabledTools: ['delete'],
      canUseTool: () => false,
    };

    const sessionPermission: PermissionRule[] = [
      {
        id: 'deny-config',
        paths: ['**/config/**'],
        decision: 'deny',
        priority: 100,
      },
    ];

    const subagent: Agent = {
      id: 'worker',
      name: 'Worker',
      description: 'Worker agent',
      mode: 'all',
      systemPrompt: 'You work',
      canUseTool: () => true,
    };

    const result = deriveSubagentSessionPermission({
      parentSessionPermission: sessionPermission,
      parentAgent,
      subagent,
    });

    // Should have:
    // 1. Parent agent tool denies (write, shell, delete)
    expect(result.find((r) => r.tools?.includes('write') && r.decision === 'deny')).toBeDefined();
    expect(result.find((r) => r.tools?.includes('delete') && r.decision === 'deny')).toBeDefined();

    // 2. Session deny rules
    expect(result.find((r) => r.id === 'deny-config')).toBeDefined();

    // 3. Default todowrite/task denies
    expect(
      result.find((r) => r.tools?.includes('todowrite') && r.decision === 'deny')
    ).toBeDefined();
    expect(result.find((r) => r.tools?.includes('task') && r.decision === 'deny')).toBeDefined();
  });
});
