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
