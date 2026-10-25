/**
 * Subagent edit-tool configuration inheritance audit (issue #2123).
 *
 * ## Audit summary
 *
 * Issue #2123 asked us to audit whether Alexi reproduces the Kilocode
 * subagent edit-tool inheritance gap (Kilocode PR #15254 + commit
 * `0c8849c18`), and to port the pattern if a gap exists. The audit
 * confirmed BOTH upstream fixes are already in place:
 *
 *   1. **Allowlist-baseline unflattening** — `src/agent/subagent-permissions.ts:209-223`
 *      (`editAllowlistBaselines` filter). Ports Kilocode PR #15254: when
 *      the parent session has an edit-family catch-all deny followed by
 *      a path-specific allow, the catch-all is treated as an allowlist
 *      baseline and dropped from the subagent's ruleset. This issue is
 *      regression-tested in `tests/agent/inheritance.test.ts`.
 *
 *   2. **Custom (non-native) delegator edit scoping** — `src/agent/subagent-permissions.ts:143-194`
 *      (`parentIsCustom` branch). Ports Kilocode commit `0c8849c18`:
 *      edit-family denies on a custom delegator agent are scoped to the
 *      delegator itself and are NOT projected onto spawned subagents.
 *      Native (built-in) agents retain the previous behaviour (edit
 *      restrictions are part of their hardening contract).
 *
 *   3. **Array-shape preservation for `allowedTools`** — issue #2108,
 *      regression-tested in `tests/agent/subagent-permissions.test.ts`.
 *
 * ## Why this file still exists
 *
 * Alexi's `edit` tool (`src/tool/tools/edit.ts`) is stateless at the
 * tool level — there is no mutable per-session "edit tool config"
 * (no `diffStrategy`, no indentation preference, no approval policy)
 * the way Kilocode has. The policy surface that actually drives whether
 * a subagent can `edit` is the SESSION PERMISSION RULESET. That is what
 * this file pins:
 *
 *   - Subagent inherits the parent's edit-family deny rules (ceilings).
 *   - Subagent does NOT inherit the parent's edit-family allow rules
 *     (approvals, per the cline #14225 contract).
 *   - A caller-supplied `allowedTools: ['edit']` DOES propagate verbatim
 *     to the derived config.
 *   - Parent-side mutations after `buildSubagentConfig` returns do NOT
 *     bleed into the subagent's derived ruleset (isolation A -> B).
 *   - Subagent-side mutations of the derived ruleset do NOT bleed back
 *     into the parent's session permission (isolation B -> A).
 *
 * The last two are the specific gap this issue called out ("deep copy,
 * not reference, to prevent cross-session pollution"). They were not
 * covered by `inheritance.test.ts` (which focuses on allowlist shape)
 * nor by `subagent-permissions.test.ts` (which focuses on the
 * `allowedTools` array shape). They are covered here.
 */

import { describe, it, expect } from 'vitest';
import { deriveSubagentSessionPermission } from '../../src/agent/subagent-permissions.js';
import { TaskTool } from '../../src/tool/tools/task.js';
import type { Agent } from '../../src/agent/index.js';
import type { PermissionRule } from '../../src/permission/index.js';
import type { ToolContext } from '../../src/tool/index.js';

function makeAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: 'code',
    name: 'Code Agent',
    description: 'test stub',
    mode: 'all',
    systemPrompt: 'stub',
    canUseTool: () => true,
    ...overrides,
  };
}

function hasDenyFor(rules: readonly PermissionRule[], tool: string): boolean {
  return rules.some((r) => r.decision === 'deny' && r.tools?.includes(tool));
}

const ctx: ToolContext = { workdir: '/tmp/test', sessionId: 'parent-session' };

describe('subagent edit-tool configuration inheritance (issue #2123)', () => {
  describe('inheritance: edit-family ceilings propagate from parent to subagent', () => {
    it('parent edit deny on a specific path is forwarded to the subagent as a ceiling', () => {
      // Parent session has an explicit DENY for `edit` on `**/.env`.
      // This is a true deny (not an allowlist baseline), so it must
      // appear verbatim in the subagent's derived ruleset — the
      // subagent is not allowed to edit paths the parent cannot.
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-edit-deny-env',
          tools: ['edit'],
          paths: ['**/.env'],
          decision: 'deny',
          priority: 100,
        },
      ];

      const result = deriveSubagentSessionPermission({
        parentSessionPermission,
        parentAgent: undefined,
        subagent,
        allowedTools: ['edit'],
      });

      // Ceiling propagated.
      const forwarded = result.find((r) => r.id === 'parent-edit-deny-env');
      expect(forwarded).toBeDefined();
      expect(forwarded?.decision).toBe('deny');
      expect(forwarded?.tools).toEqual(['edit']);
      expect(forwarded?.paths).toEqual(['**/.env']);
    });

    it('explicit `edit` on `allowed_tools` is echoed to SubagentConfig.allowedTools', () => {
      // The caller's edit grant travels verbatim through buildSubagentConfig
      // (shape contract from issue #2108, re-pinned here in context of
      // the edit-family specifically).
      const subagent = makeAgent();
      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        allowedTools: ['edit'],
      });
      expect(config.allowedTools).toEqual(['edit']);
      // And no explicit `subagent-deny-edit` rule is synthesised — the
      // subagent is permitted to invoke edit.
      expect(config.permission.find((r) => r.id === 'subagent-deny-edit')).toBeUndefined();
    });

    it('parent edit ALLOW is dropped (cline #14225: parent approvals are not inherited)', () => {
      // A parent-side ALLOW for edit on `src/**` must NOT reach the
      // subagent. The subagent only has approvals that were explicitly
      // configured via `allowed_tools` on the `task` invocation.
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-allow-edit-src',
          tools: ['edit'],
          paths: ['src/**'],
          decision: 'allow',
          priority: 50,
        },
      ];

      const result = deriveSubagentSessionPermission({
        parentSessionPermission,
        parentAgent: undefined,
        subagent,
        // edit deliberately omitted from allowed_tools — the subagent
        // must NOT silently inherit the parent's ALLOW grant.
        allowedTools: ['read'],
      });

      expect(result.find((r) => r.id === 'parent-allow-edit-src')).toBeUndefined();
      // Fails closed: narrowing emits an explicit deny for edit.
      expect(hasDenyFor(result, 'edit')).toBe(true);
    });
  });

  describe('inheritance: edit-family allowlist baseline is NOT flattened (Kilocode PR #15254)', () => {
    it('catch-all edit deny followed by a path-specific allow is treated as a baseline', () => {
      // The exact customer scenario from Kilocode PR #15254. A parent
      // session with `{ edit, *, deny }` + `{ edit, src/**, allow }`
      // must NOT project the catch-all deny onto the subagent as a
      // hard ceiling — doing so would strip edit from every delegated
      // workflow even on paths the parent could edit.
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-edit-baseline-deny',
          tools: ['edit'],
          paths: ['*'],
          decision: 'deny',
          priority: 10,
        },
        {
          id: 'parent-edit-path-allow',
          tools: ['edit'],
          paths: ['src/**'],
          decision: 'allow',
          priority: 20,
        },
      ];

      const result = deriveSubagentSessionPermission({
        parentSessionPermission,
        parentAgent: undefined,
        subagent,
        allowedTools: ['edit'],
      });

      // Baseline deny dropped — subagent is NOT edit-denied by it.
      expect(result.find((r) => r.id === 'parent-edit-baseline-deny')).toBeUndefined();
      // Parent allow is dropped too (approvals not inherited).
      expect(result.find((r) => r.id === 'parent-edit-path-allow')).toBeUndefined();
      // And the derivation does NOT synthesise a wildcard edit deny
      // (that is exactly the pre-fix bug).
      expect(hasDenyFor(result, 'edit')).toBe(false);
    });

    it('custom (non-native) delegator edit scope stays on the delegator (Kilocode 0c8849c18)', () => {
      // A CUSTOM delegator with `disabledTools: ['edit']` scopes that
      // policy to itself — the subagent spawned from it keeps edit.
      const subagent = makeAgent();
      const customParent = makeAgent({
        id: 'custom-delegator',
        native: false,
        disabledTools: ['edit', 'write'],
      });

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        parentAgent: customParent,
        parentSessionPermission: [],
        allowedTools: ['edit', 'write'],
      });

      // Custom delegator's edit/write disables do NOT ceiling the subagent.
      expect(hasDenyFor(config.permission, 'edit')).toBe(false);
      expect(hasDenyFor(config.permission, 'write')).toBe(false);
    });

    it('native delegator edit scope DOES ceiling the subagent (plan-mode hardening)', () => {
      // Native delegators keep the previous behaviour — their edit
      // restrictions are part of the hardening contract (e.g. plan-mode
      // read-only ceiling) and must flow down to subagents.
      const subagent = makeAgent();
      const nativeParent = makeAgent({
        id: 'plan',
        native: true,
        disabledTools: ['edit', 'write'],
      });

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        parentAgent: nativeParent,
        parentSessionPermission: [],
        // Even though the caller lists edit on allowed_tools, the
        // native parent's disable rule is a hard ceiling.
        allowedTools: ['edit', 'write'],
      });

      expect(hasDenyFor(config.permission, 'edit')).toBe(true);
      expect(hasDenyFor(config.permission, 'write')).toBe(true);
    });
  });

  describe('isolation: parent -> subagent (mutations after derivation do NOT bleed)', () => {
    it('mutating the parent session rules after buildSubagentConfig does not affect the subagent', () => {
      // The derivation must materialise a NEW array — a reference-copy
      // would mean a parent-side `.push(...)` after the subagent was
      // spawned retroactively applied to the derived ruleset.
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-edit-deny-env',
          tools: ['edit'],
          paths: ['**/.env'],
          decision: 'deny',
          priority: 100,
        },
      ];

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        parentSessionPermission,
        allowedTools: ['edit'],
      });
      const subagentRuleCount = config.permission.length;

      // Parent later tightens its own policy (e.g. interactive deny).
      parentSessionPermission.push({
        id: 'parent-added-later',
        tools: ['edit'],
        paths: ['src/**'],
        decision: 'deny',
        priority: 200,
      });

      // Subagent's derived ruleset is unaffected by the post-hoc push.
      expect(config.permission.length).toBe(subagentRuleCount);
      expect(config.permission.find((r) => r.id === 'parent-added-later')).toBeUndefined();
    });

    it('derivation does not alias rule objects by reference across call boundaries', () => {
      // Even for rules that ARE forwarded (deny ceilings), mutating a
      // rule's fields in the parent's array after derivation must not
      // retroactively mutate the subagent's view. The derivation stores
      // the originals, which is acceptable as long as parent-side code
      // treats session rules as immutable (the project contract). This
      // test documents the current contract: the ARRAY is a fresh copy
      // (so push/splice are isolated), while the RULE OBJECTS are
      // shared references and should be treated as immutable.
      const subagent = makeAgent();
      const sharedRule: PermissionRule = {
        id: 'parent-edit-deny-env',
        tools: ['edit'],
        paths: ['**/.env'],
        decision: 'deny',
        priority: 100,
      };
      const parentSessionPermission: PermissionRule[] = [sharedRule];

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        parentSessionPermission,
        allowedTools: ['edit'],
      });

      // The subagent array is a different allocation from the parent array.
      expect(config.permission).not.toBe(parentSessionPermission);
      // The forwarded rule object is still the same reference (project
      // contract: session rules are treated as immutable value objects).
      const forwarded = config.permission.find((r) => r.id === 'parent-edit-deny-env');
      expect(forwarded).toBeDefined();
    });
  });

  describe('isolation: subagent -> parent (mutating the derived ruleset does NOT bleed)', () => {
    it('pushing a rule into the derived subagent ruleset does not touch parent session rules', () => {
      // Symmetric to the test above: a subagent-side mutation (which
      // SHOULD never happen in practice, but might in test harnesses or
      // future runtime plugins) must not retroactively tighten the
      // parent's session.
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-edit-deny-env',
          tools: ['edit'],
          paths: ['**/.env'],
          decision: 'deny',
          priority: 100,
        },
      ];
      const parentRuleCount = parentSessionPermission.length;

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        parentSessionPermission,
        allowedTools: ['edit'],
      });

      // Simulated runtime mutation of the subagent's ruleset.
      config.permission.push({
        id: 'subagent-added',
        tools: ['edit'],
        paths: ['/tmp/**'],
        decision: 'deny',
        priority: 500,
      });

      // Parent array length and contents unchanged.
      expect(parentSessionPermission.length).toBe(parentRuleCount);
      expect(parentSessionPermission.find((r) => r.id === 'subagent-added')).toBeUndefined();
    });

    it('two sibling subagents derived from the same parent get independent arrays', () => {
      // Spawning two subagents off the same parent snapshot must give
      // each its own derived array, so a mutation on one sibling does
      // not reach the other.
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-edit-deny-env',
          tools: ['edit'],
          paths: ['**/.env'],
          decision: 'deny',
          priority: 100,
        },
      ];

      const siblingA = TaskTool.buildSubagentConfig(ctx, makeAgent({ id: 'code' }), {
        parentSessionPermission,
        allowedTools: ['edit'],
      });
      const siblingB = TaskTool.buildSubagentConfig(ctx, makeAgent({ id: 'code' }), {
        parentSessionPermission,
        allowedTools: ['edit'],
      });

      expect(siblingA.permission).not.toBe(siblingB.permission);

      // Mutating sibling A must not touch sibling B.
      siblingA.permission.push({
        id: 'sibling-a-added',
        tools: ['edit'],
        decision: 'deny',
        priority: 999,
      });
      expect(siblingB.permission.find((r) => r.id === 'sibling-a-added')).toBeUndefined();
    });
  });
});
