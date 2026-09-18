/**
 * Approval-boundary tests for the task tool.
 *
 * Verifies cline PR #14225 parity: subagents spawned via the `task` tool
 * do NOT inherit parent-session approvals. Only tools that are either on
 * the baseline read-only surface OR explicitly listed in the caller's
 * `allowed_tools` parameter are permitted for the subagent.
 *
 * We drive the derivation through `TaskTool.buildSubagentConfig`, which is
 * what `taskTool.execute` uses internally, so any behavioural regression
 * in the runtime wiring surfaces here as well.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../../src/tool/index.js';
import type { Agent } from '../../../src/agent/index.js';
import type { PermissionRule } from '../../../src/permission/index.js';

// Mock the agent registry BEFORE importing the task tool so the depth
// / validate paths never surprise us.
vi.mock('../../../src/agent/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../../src/agent/index.js')>(
    '../../../src/agent/index.js'
  );
  const codeAgent: Agent = {
    id: 'code',
    name: 'Code Agent',
    description: 'Test stub',
    mode: 'all',
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const exploreAgent: Agent = {
    id: 'explore',
    name: 'Explore Agent',
    description: 'Test stub',
    mode: 'subagent',
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const registry = {
    get(idOrAlias: string) {
      if (idOrAlias === 'code') {
        return codeAgent;
      }
      if (idOrAlias === 'explore') {
        return exploreAgent;
      }
      return undefined;
    },
  };
  return {
    ...actual,
    getAgentRegistry: () => registry,
    isExploreAgent: (idOrAlias: string) => idOrAlias === 'explore',
  };
});

import { TaskTool, taskTool, getTaskStore } from '../../../src/tool/tools/task.js';

function makeAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: 'code',
    name: 'Code Agent',
    description: 'Test stub',
    mode: 'all',
    systemPrompt: 'stub',
    canUseTool: () => true,
    ...overrides,
  };
}

function hasDenyFor(rules: PermissionRule[], tool: string): boolean {
  return rules.some((r) => r.decision === 'deny' && r.tools?.includes(tool));
}

function hasAllowFor(rules: PermissionRule[], tool: string): boolean {
  return rules.some((r) => r.decision === 'allow' && r.tools?.includes(tool));
}

describe('task tool approval boundaries', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = { workdir: '/tmp/test', sessionId: 'parent-session' };
  });

  afterEach(() => {
    getTaskStore().clear();
  });

  describe('buildSubagentConfig — approval inheritance', () => {
    it('does NOT forward parent allow rules to the subagent permission set', () => {
      const parentAgent = makeAgent({ id: 'parent', tools: ['*'] });
      const subagent = makeAgent({ id: 'code' });
      const parentSessionPermission: PermissionRule[] = [
        // Parent approved bash interactively — subagent must NOT inherit this.
        {
          id: 'parent-allow-bash',
          tools: ['bash'],
          decision: 'allow',
          priority: 100,
        },
        {
          id: 'parent-allow-write',
          tools: ['write'],
          decision: 'allow',
          priority: 100,
        },
        // A deny rule the subagent SHOULD inherit.
        {
          id: 'parent-deny-secrets',
          paths: ['**/.env'],
          decision: 'deny',
          priority: 200,
        },
      ];

      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentAgent,
        parentSessionPermission,
      });

      // Parent ALLOW rules must NOT appear in the derived permission set.
      expect(hasAllowFor(config.permission, 'bash')).toBe(false);
      expect(hasAllowFor(config.permission, 'write')).toBe(false);
      expect(config.permission.find((r) => r.id === 'parent-allow-bash')).toBeUndefined();
      expect(config.permission.find((r) => r.id === 'parent-allow-write')).toBeUndefined();

      // Parent DENY rule must still be forwarded.
      expect(config.permission.find((r) => r.id === 'parent-deny-secrets')).toBeDefined();
    });

    it('with explicit allowed_tools, denies every non-baseline tool NOT in the list', () => {
      const subagent = makeAgent({ id: 'code' });

      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentSessionPermission: [],
        allowedTools: ['read', 'grep'], // baseline + grep, deliberately excludes write/bash/edit
      });

      // Explicitly disallowed tools must have deny rules.
      expect(hasDenyFor(config.permission, 'write')).toBe(true);
      expect(hasDenyFor(config.permission, 'edit')).toBe(true);
      expect(hasDenyFor(config.permission, 'bash')).toBe(true);
      expect(hasDenyFor(config.permission, 'shell')).toBe(true);
      expect(hasDenyFor(config.permission, 'webfetch')).toBe(true);
      expect(hasDenyFor(config.permission, 'multiedit')).toBe(true);
      expect(hasDenyFor(config.permission, 'apply_patch')).toBe(true);

      // The tools the caller explicitly granted must NOT be denied.
      expect(hasDenyFor(config.permission, 'read')).toBe(false);
      expect(hasDenyFor(config.permission, 'grep')).toBe(false);
    });

    it('with explicit allowed_tools including bash, does not deny bash', () => {
      const subagent = makeAgent({ id: 'code' });

      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentSessionPermission: [],
        allowedTools: ['bash', 'read'],
      });

      // Bash is on the explicit allow-list, so the derived permission
      // should not contain a subagent-narrowing deny for it.
      expect(config.permission.find((r) => r.id === 'subagent-deny-bash')).toBeUndefined();
      // Write was NOT on the allow-list — still denied.
      expect(hasDenyFor(config.permission, 'write')).toBe(true);
    });

    it('with empty allowed_tools array, denies ALL dangerous tools', () => {
      const subagent = makeAgent({ id: 'code' });

      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentSessionPermission: [
          { id: 'parent-allow-all', tools: ['bash'], decision: 'allow', priority: 100 },
        ],
        allowedTools: [], // "only the read-only baseline"
      });

      // Even though bash was allowed on the parent session, the empty
      // allow-list means the subagent has zero explicit approvals and
      // must be denied bash/write/edit/etc.
      expect(hasDenyFor(config.permission, 'bash')).toBe(true);
      expect(hasDenyFor(config.permission, 'write')).toBe(true);
      expect(hasDenyFor(config.permission, 'edit')).toBe(true);
      // And still no inherited allow.
      expect(hasAllowFor(config.permission, 'bash')).toBe(false);
    });

    it('without allowed_tools, applies parent restrictions but no explicit narrowing', () => {
      const parentAgent = makeAgent({
        id: 'parent',
        tools: ['read', 'grep'], // limited parent → subagent inherits denies
      });
      const subagent = makeAgent({ id: 'code' });

      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentAgent,
        parentSessionPermission: [],
        // No allowedTools — falls back to the baseline restricted set.
      });

      // Parent-derived denies (limited tool list -> deny write / shell).
      expect(hasDenyFor(config.permission, 'write')).toBe(true);
      const shellDenied = config.permission.find(
        (r) => r.decision === 'deny' && (r.tools?.includes('shell') || r.tools?.includes('bash'))
      );
      expect(shellDenied).toBeDefined();

      // No explicit subagent-deny-* rules because allowedTools wasn't set.
      expect(config.permission.find((r) => r.id?.startsWith('subagent-deny-'))).toBeUndefined();
    });

    it('for the explore subagent, adds bash command denies for `gh *` and `find *`', () => {
      const exploreAgent = makeAgent({ id: 'explore' });

      const config = TaskTool.buildSubagentConfig(context, exploreAgent, {
        parentSessionPermission: [],
      });

      const bashDenies = config.permission.filter(
        (r) =>
          r.decision === 'deny' && r.commands && r.tools?.some((t) => t === 'bash' || t === 'shell')
      );

      const commandPatterns = bashDenies.flatMap((r) => r.commands ?? []);
      expect(commandPatterns).toContain('gh *');
      expect(commandPatterns).toContain('find *');
    });

    it('does not inherit parent ask rules', () => {
      const subagent = makeAgent({ id: 'code' });
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-ask-edit',
          tools: ['edit'],
          decision: 'ask',
          priority: 100,
        },
      ];

      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentSessionPermission,
      });

      expect(config.permission.find((r) => r.id === 'parent-ask-edit')).toBeUndefined();
    });

    it('exposes allowedTools on the returned config', () => {
      const subagent = makeAgent({ id: 'code' });

      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentSessionPermission: [],
        allowedTools: ['read', 'grep', 'bash'],
      });

      expect(config.allowedTools).toEqual(['read', 'grep', 'bash']);
    });
  });

  describe('taskTool.execute — plumbs allowed_tools through the schema', () => {
    it('accepts an allowed_tools parameter without erroring', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'run a scoped task',
          description: 'scoped',
          subagent_type: 'general',
          allowed_tools: ['read', 'grep'],
        },
        context
      );

      expect(result.success).toBe(true);
    });

    it('accepts an empty allowed_tools list (deny-all-dangerous)', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'read-only exploration only',
          description: 'read-only',
          subagent_type: 'explore',
          allowed_tools: [],
        },
        context
      );

      expect(result.success).toBe(true);
    });
  });
});
