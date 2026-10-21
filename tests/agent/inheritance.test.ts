/**
 * Subagent tool allowlist inheritance regression tests.
 *
 * Audit for issue #2104 — confirms Alexi does NOT reproduce the Kilocode
 * PR #15254 (2026-10-19) bug where a parent-session catch-all edit deny
 * followed by path-specific allows was flattened into a blanket deny on
 * every delegated subagent, stripping `write` / `edit` / `apply_patch`
 * from the subagent's tool surface.
 *
 * See `.github/research/subagent-inheritance-audit.md` for the full audit
 * and comparison with the upstream PR.
 *
 * These tests exercise `TaskTool.buildSubagentConfig` and
 * `deriveSubagentSessionPermission` directly so a future refactor that
 * removes the `editAllowlistBaselines` filter from
 * `src/agent/subagent-permissions.ts` fails CI immediately.
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

function hasDenyFor(rules: PermissionRule[], tool: string): boolean {
  return rules.some((r) => r.decision === 'deny' && r.tools?.includes(tool));
}

/**
 * The Kilocode PR #15254 customer config: an edit allowlist expressed as
 * a catch-all deny followed by one or more path-specific allows. Any
 * code path that flattens this shape (by copying the catch-all deny into
 * the subagent's ruleset without the subsequent allows) would reintroduce
 * the bug.
 */
function allowlistBaseline(tool: string, allowedPath: string): PermissionRule[] {
  return [
    {
      id: `parent-${tool}-baseline-deny`,
      tools: [tool],
      paths: ['*'],
      decision: 'deny',
      priority: 50,
    },
    {
      id: `parent-${tool}-path-allow`,
      tools: [tool],
      paths: [allowedPath],
      decision: 'allow',
      priority: 60,
    },
  ];
}

describe('subagent tool allowlist inheritance (issue #2104)', () => {
  describe('allowlist baseline is not flattened into a blanket deny', () => {
    for (const tool of ['edit', 'write', 'multiedit', 'apply_patch', 'patch'] as const) {
      it(`parent catch-all deny + path allow for '${tool}' is dropped from subagent ruleset`, () => {
        const subagent = makeAgent();
        const parentSessionPermission = allowlistBaseline(tool, 'candidate/**/*.md');

        const result = deriveSubagentSessionPermission({
          parentSessionPermission,
          parentAgent: undefined,
          subagent,
        });

        // The catch-all deny baseline MUST NOT be forwarded — otherwise it
        // flattens the subagent's edit surface.
        expect(result.find((r) => r.id === `parent-${tool}-baseline-deny`)).toBeUndefined();

        // The parent's path-specific ALLOW is dropped too (parent approvals
        // are never inherited — security contract from cline #14225).
        expect(result.find((r) => r.id === `parent-${tool}-path-allow`)).toBeUndefined();

        // Neither does the derivation synthesise a wildcard tool-level deny
        // for the edit-family tool (that is what the upstream bug did).
        expect(hasDenyFor(result, tool)).toBe(false);
      });
    }

    it('TaskTool.buildSubagentConfig also preserves the subagent edit surface', () => {
      // End-to-end check through the public buildSubagentConfig entry point.
      // Equivalent to the customer scenario in Kilocode PR #15254: a primary
      // delegates to a subagent whose own policy allows editing certain paths.
      const parentAgent = makeAgent({ id: 'primary', tools: ['*'] });
      const subagent = makeAgent({ id: 'code' });
      const parentSessionPermission = allowlistBaseline('edit', 'candidate/**/*.md');

      const context: ToolContext = { workdir: '/tmp/test', sessionId: 'parent-session' };
      const config = TaskTool.buildSubagentConfig(context, subagent, {
        parentAgent,
        parentSessionPermission,
        allowedTools: ['read', 'edit', 'write'],
      });

      // Explicit allow-list included edit — the subagent must NOT be denied
      // edit by a flattened parent baseline.
      expect(hasDenyFor(config.permission, 'edit')).toBe(false);
      expect(hasDenyFor(config.permission, 'write')).toBe(false);

      // The baseline rule object is not propagated.
      expect(config.permission.find((r) => r.id === 'parent-edit-baseline-deny')).toBeUndefined();
      expect(config.permission.find((r) => r.id === 'parent-edit-path-allow')).toBeUndefined();
    });
  });

  describe('true blanket deny still propagates (regression guard the other way)', () => {
    it('parent catch-all edit deny WITHOUT a narrowing allow is forwarded verbatim', () => {
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-blanket-edit-deny',
          tools: ['edit'],
          paths: ['*'],
          decision: 'deny',
          priority: 50,
        },
      ];

      const result = deriveSubagentSessionPermission({
        parentSessionPermission,
        parentAgent: undefined,
        subagent,
      });

      // Blanket deny MUST survive — the fix only unflattens true allowlist
      // baselines, not every catch-all deny.
      expect(result.find((r) => r.id === 'parent-blanket-edit-deny')).toBeDefined();
    });

    it('a later path-specific DENY (not an allow) still leaves the baseline deny intact', () => {
      // A path-specific *deny* that narrows the catch-all isn't an allowlist
      // baseline — it's just two denies in a row. The baseline must stay.
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-baseline-deny',
          tools: ['edit'],
          paths: ['*'],
          decision: 'deny',
          priority: 50,
        },
        {
          id: 'parent-narrow-deny',
          tools: ['edit'],
          paths: ['**/.env'],
          decision: 'deny',
          priority: 60,
        },
      ];

      const result = deriveSubagentSessionPermission({
        parentSessionPermission,
        parentAgent: undefined,
        subagent,
      });

      expect(result.find((r) => r.id === 'parent-baseline-deny')).toBeDefined();
      expect(result.find((r) => r.id === 'parent-narrow-deny')).toBeDefined();
    });
  });

  describe('parent approvals are never forwarded (cline #14225 contract)', () => {
    it('parent ALLOW for write does not surface to the subagent even when path-allowed', () => {
      // Even when the parent explicitly ALLOWED write on a path, the
      // subagent must not silently inherit that approval. If the subagent
      // needs write, the caller must list it in `allowedTools` on the
      // task invocation.
      const parentSessionPermission: PermissionRule[] = [
        {
          id: 'parent-allow-write-src',
          tools: ['write'],
          paths: ['src/**'],
          decision: 'allow',
          priority: 100,
        },
      ];
      const subagent = makeAgent();

      const result = deriveSubagentSessionPermission({
        parentSessionPermission,
        parentAgent: undefined,
        subagent,
        allowedTools: ['read'], // write deliberately omitted
      });

      expect(result.find((r) => r.id === 'parent-allow-write-src')).toBeUndefined();
      // And because `write` wasn't on `allowedTools`, derivation adds an
      // explicit deny so the subagent fails closed.
      expect(hasDenyFor(result, 'write')).toBe(true);
    });
  });

  describe('mixed shape: allowlist baseline for edit AND unrelated denies', () => {
    it('keeps unrelated denies while dropping the edit baseline', () => {
      const subagent = makeAgent();
      const parentSessionPermission: PermissionRule[] = [
        ...allowlistBaseline('edit', 'src/**'),
        {
          id: 'parent-deny-secrets',
          paths: ['**/.env'],
          decision: 'deny',
          priority: 70,
        },
      ];

      const result = deriveSubagentSessionPermission({
        parentSessionPermission,
        parentAgent: undefined,
        subagent,
      });

      // Allowlist baseline dropped.
      expect(result.find((r) => r.id === 'parent-edit-baseline-deny')).toBeUndefined();
      // Unrelated deny preserved.
      expect(result.find((r) => r.id === 'parent-deny-secrets')).toBeDefined();
    });
  });
});
