/**
 * Integration tests for native vs. custom delegator edit scoping in
 * `deriveSubagentSessionPermission`.
 *
 * Guards the kilocode `0c8849c18` port (`fix(agent): preserve custom
 * delegator subagent edit permissions`). The pure-function suite in
 * `src/agent/subagent-permissions.test.ts` already pins the three
 * decision-shapes of the APPROVAL boundary (ALLOW dropped, ASK dropped,
 * DENY retained). This file complements it with scenarios that mix a
 * parent AGENT ruleset (native vs custom), a parent SESSION ruleset
 * (catch-all / scoped edit denials), and the explicit `allowed_tools`
 * narrowing on the `task` call.
 *
 * The three contract points verified below:
 *
 *   1. CUSTOM delegator + session edit deny → parent-agent edit denies
 *      are NOT projected onto the subagent; the subagent remains free to
 *      use edit-family tools the caller granted.
 *   2. NATIVE delegator + session edit deny → parent-agent edit denies
 *      ARE projected onto the subagent (plan-mode read-only ceiling, etc.).
 *   3. SESSION-level edit denies are ALWAYS a ceiling, regardless of
 *      whether the parent agent is native or custom.
 */

import { describe, it, expect } from 'vitest';

import { deriveSubagentSessionPermission } from '../../src/agent/subagent-permissions.js';
import type { Agent } from '../../src/agent/index.js';
import type { PermissionRule } from '../../src/permission/index.js';

function makeAgent(overrides: Partial<Agent>): Agent {
  return {
    id: 'agent',
    name: 'Agent',
    description: 'Test stub',
    mode: 'all',
    systemPrompt: 'stub',
    canUseTool: () => true,
    ...overrides,
  };
}

function parentAgentEditDenyFor(rules: PermissionRule[], tool: string): PermissionRule | undefined {
  // Edit-family denies that originate from the PARENT AGENT ruleset are
  // emitted with the stable `parent-deny-*` id prefix by
  // `deriveSubagentSessionPermission`. Filtering by id prefix avoids
  // confusing them with session-level denies (which keep their original id)
  // or `subagent-deny-*` explicit narrowing denies.
  return rules.find(
    (r) =>
      typeof r.id === 'string' &&
      r.id.startsWith('parent-deny-') &&
      r.decision === 'deny' &&
      r.tools?.includes(tool)
  );
}

describe('deriveSubagentSessionPermission — custom vs native delegator edit scoping', () => {
  it('custom delegator with edit deny does NOT restrict subagent', () => {
    const parentAgent = makeAgent({
      id: 'custom-agent',
      native: false,
      // Custom delegator restricts itself to read-only tools. Previously
      // this emitted `parent-deny-write` onto spawned subagents too; the
      // 0c8849c18 fix scopes that deny to the delegator itself.
      tools: ['read', 'grep'],
    });
    const parentSessionPermission: PermissionRule[] = [
      {
        id: 'catch-all-edit-deny',
        tools: ['edit'],
        decision: 'deny',
        priority: 10,
      },
    ];
    const subagent = makeAgent({
      id: 'subagent',
      native: true,
      tools: ['write', 'read', 'grep', 'task', 'todowrite'],
    });

    const derived = deriveSubagentSessionPermission({
      parentSessionPermission,
      parentAgent,
      subagent,
      allowedTools: ['write'],
    });

    // The parent agent must NOT contribute an edit-family deny.
    expect(parentAgentEditDenyFor(derived, 'write')).toBeUndefined();
    expect(parentAgentEditDenyFor(derived, 'edit')).toBeUndefined();

    // And because `write` is explicitly on `allowed_tools`, the subagent's
    // `write` surface is not denied anywhere in the derived ruleset.
    const anyWriteDeny = derived.some((r) => r.decision === 'deny' && r.tools?.includes('write'));
    expect(anyWriteDeny).toBe(false);

    // Non-edit parent restrictions still propagate (shell is NOT edit-family).
    expect(parentAgentEditDenyFor(derived, 'shell')).toBeDefined();

    // Session-level catch-all edit deny still propagates — that is the
    // SESSION's ceiling, not the delegator's self-restriction.
    expect(derived.find((r) => r.id === 'catch-all-edit-deny')).toBeDefined();
  });

  it('native delegator with edit deny DOES restrict subagent', () => {
    const parentAgent = makeAgent({
      id: 'plan-mode',
      native: true,
      tools: ['read', 'grep'],
    });
    const parentSessionPermission: PermissionRule[] = [
      {
        id: 'catch-all-edit-deny',
        tools: ['edit'],
        decision: 'deny',
        priority: 10,
      },
    ];
    const subagent = makeAgent({
      id: 'subagent',
      native: true,
      tools: ['write', 'read', 'grep', 'task', 'todowrite'],
    });

    const derived = deriveSubagentSessionPermission({
      parentSessionPermission,
      parentAgent,
      subagent,
      allowedTools: ['write'],
    });

    // Native delegator keeps the previous propagation: a `tools` allowlist
    // that excludes `write` becomes a hard ceiling on the subagent.
    expect(parentAgentEditDenyFor(derived, 'write')).toBeDefined();

    // The subagent CANNOT write — the parent-agent-derived deny is in
    // the ruleset regardless of what `allowed_tools` requested.
    const anyWriteDeny = derived.some((r) => r.decision === 'deny' && r.tools?.includes('write'));
    expect(anyWriteDeny).toBe(true);
  });

  it('session-level edit deny IS ceiling for all subagents', () => {
    // Even when the parent delegator is custom AND edit-capable (so the
    // 0c8849c18 fix drops the delegator's self-restriction), a session-level
    // scoped edit deny MUST still propagate — that is the operator-controlled
    // ceiling for the whole delegated workflow.
    const parentAgent = makeAgent({
      id: 'custom-agent',
      native: false,
      tools: ['write', 'edit', 'read', 'grep'],
    });
    const parentSessionPermission: PermissionRule[] = [
      {
        id: 'session-secrets-deny',
        tools: ['edit'],
        paths: ['secrets/**'],
        decision: 'deny',
        priority: 20,
      },
    ];
    const subagent = makeAgent({
      id: 'subagent',
      native: true,
      tools: ['write', 'edit', 'read', 'grep', 'task', 'todowrite'],
    });

    const derived = deriveSubagentSessionPermission({
      parentSessionPermission,
      parentAgent,
      subagent,
      allowedTools: ['write', 'edit'],
    });

    // The session-level secrets deny survives into the subagent ruleset
    // with its original id, paths, and decision — this is the hard ceiling.
    const sessionDeny = derived.find((r) => r.id === 'session-secrets-deny');
    expect(sessionDeny).toBeDefined();
    expect(sessionDeny?.decision).toBe('deny');
    expect(sessionDeny?.tools).toEqual(['edit']);
    expect(sessionDeny?.paths).toEqual(['secrets/**']);

    // Sanity check: the custom delegator's own tool list is edit-capable,
    // so there is no `parent-deny-*` for write or edit. Only the SESSION
    // deny gates edits on `secrets/**`.
    expect(parentAgentEditDenyFor(derived, 'write')).toBeUndefined();
    expect(parentAgentEditDenyFor(derived, 'edit')).toBeUndefined();
  });
});
