/**
 * Subagent tool allowlist shape-preservation tests (issue #2108).
 *
 * These tests pin the specific scenario documented in Kilocode PR #15254
 * (merged 2026-10-19): the delegation path must preserve the TypeScript
 * array shape of `allowedTools` when inheriting from parent to subagent.
 *
 * The upstream bug: a parent agent configured with
 * `allowedTools: ['edit']` was flattened by the subagent-spawning path
 * into `allowedTools: true`, which the registry interpreted as "grant
 * every tool" — collapsing a tight allow-list into a blanket grant and
 * leaking tools (bash, write, delete, ...) the delegator had deliberately
 * withheld. See `.github/research/subagent-inheritance-audit.md` for the
 * full audit trail and the companion regression tests in
 * `tests/agent/inheritance.test.ts` (allowlist-baseline flattening) and
 * `tests/tool/tools/task-approval-boundary.test.ts` (end-to-end approval
 * boundary enforcement).
 *
 * This file focuses narrowly on the shape contract:
 *
 *   1. The derivation accepts a string[] `allowedTools` and preserves it
 *      as a string[] (never a boolean, never a widened `true`).
 *   2. `TaskTool.buildSubagentConfig` echoes the array verbatim on
 *      `SubagentConfig.allowedTools` so downstream consumers (the
 *      registry, the subagent-session wiring, serialisation code paths)
 *      see the same list the caller supplied.
 *   3. An omitted `allowedTools` stays `undefined` (does NOT default to
 *      `true` / all tools), so a subagent without an explicit grant
 *      inherits only the restricted baseline — not the parent's full
 *      surface.
 */

import { describe, it, expect } from 'vitest';
import { deriveSubagentSessionPermission } from '../../src/agent/subagent-permissions.js';
import { TaskTool } from '../../src/tool/tools/task.js';
import type { Agent } from '../../src/agent/index.js';
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

const ctx: ToolContext = { workdir: '/tmp/test', sessionId: 'parent-session' };

describe('subagent allowedTools shape preservation (issue #2108)', () => {
  describe('TaskTool.buildSubagentConfig echoes the array verbatim', () => {
    it("preserves ['bash'] as a string array, NOT a boolean", () => {
      // The exact scenario named in the issue: parent calls `task` with
      // `allowed_tools: ['bash']`. The derived SubagentConfig MUST surface
      // `allowedTools` as the same string array — never widened to `true`.
      const subagent = makeAgent();

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        allowedTools: ['bash'],
      });

      expect(Array.isArray(config.allowedTools)).toBe(true);
      // The derived list reflects the caller's grant exactly.
      expect(config.allowedTools).toEqual(['bash']);
      // Negative pins for the upstream bug: the field must NOT be a
      // boolean under any interpretation.
      expect(typeof config.allowedTools).toBe('object');
      // @ts-expect-error — the type says `readonly string[] | undefined`,
      // but assert at runtime that it is not `true` even after a widening
      // cast would have slipped through.
      expect(config.allowedTools === true).toBe(false);
    });

    it("preserves ['edit'] (the exact upstream Kilocode #15254 case) as a string array", () => {
      const subagent = makeAgent();

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        allowedTools: ['edit'],
      });

      expect(config.allowedTools).toEqual(['edit']);
      expect(Array.isArray(config.allowedTools)).toBe(true);
    });

    it('preserves a multi-entry list verbatim', () => {
      const subagent = makeAgent();

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        allowedTools: ['read', 'grep', 'bash'],
      });

      expect(config.allowedTools).toEqual(['read', 'grep', 'bash']);
      expect(Array.isArray(config.allowedTools)).toBe(true);
    });

    it('leaves allowedTools undefined when not supplied (does NOT default to true)', () => {
      // If the caller omits `allowedTools`, the subagent falls back to the
      // baseline restricted surface. The field must remain undefined so
      // downstream code can distinguish "no explicit grant" from
      // "grant everything". A default of `true` here is exactly the
      // Kilocode #15254 bug.
      const subagent = makeAgent();

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {});

      expect(config.allowedTools).toBeUndefined();
      // Belt-and-braces: never a boolean, never `true`.
      expect(typeof config.allowedTools).not.toBe('boolean');
    });

    it('preserves an empty allow-list verbatim ([], NOT true, NOT undefined)', () => {
      // The empty array is a meaningful signal — "only the read-only
      // baseline" — and must NOT be re-interpreted as a widened grant.
      const subagent = makeAgent();

      const config = TaskTool.buildSubagentConfig(ctx, subagent, {
        allowedTools: [],
      });

      expect(Array.isArray(config.allowedTools)).toBe(true);
      expect(config.allowedTools).toEqual([]);
      expect(config.allowedTools).not.toBeUndefined();
    });
  });

  describe('deriveSubagentSessionPermission respects the array shape', () => {
    it('narrows the ruleset using the array contents, not a widened boolean', () => {
      // The permission derivation reads `allowedTools` as a string list
      // and emits explicit deny rules for every dangerous tool NOT in the
      // list. If the array had been flattened to `true`, the derivation
      // would see a non-iterable, throw, or silently iterate the
      // characters of a stringified boolean — any of which would break
      // the narrowing contract.
      const subagent = makeAgent();

      const rules = deriveSubagentSessionPermission({
        parentSessionPermission: [],
        parentAgent: undefined,
        subagent,
        allowedTools: ['bash'],
      });

      // `bash` is on the allow-list, so no subagent-narrowing deny for it.
      expect(rules.find((r) => r.id === 'subagent-deny-bash')).toBeUndefined();

      // Every other dangerous tool is denied because the subagent only
      // has `bash` + baseline read-only tools.
      expect(
        rules.find((r) => r.id === 'subagent-deny-write' && r.decision === 'deny')
      ).toBeDefined();
      expect(
        rules.find((r) => r.id === 'subagent-deny-edit' && r.decision === 'deny')
      ).toBeDefined();
      expect(
        rules.find((r) => r.id === 'subagent-deny-delete' && r.decision === 'deny')
      ).toBeDefined();
      expect(
        rules.find((r) => r.id === 'subagent-deny-webfetch' && r.decision === 'deny')
      ).toBeDefined();
    });

    it('with allowedTools omitted, applies NO explicit narrowing (no subagent-deny-* rules)', () => {
      // Omitting `allowedTools` means "no explicit grant" — the baseline
      // restricted set applies, but the derivation does NOT synthesise
      // subagent-deny-* rules. This is the shape contract on the
      // `undefined` branch: the parameter stays undefined and the
      // narrowing step is skipped entirely.
      const subagent = makeAgent();

      const rules = deriveSubagentSessionPermission({
        parentSessionPermission: [],
        parentAgent: undefined,
        subagent,
      });

      expect(rules.find((r) => r.id?.startsWith('subagent-deny-'))).toBeUndefined();
    });

    it('with an empty allowedTools array, denies every dangerous tool explicitly', () => {
      // `[]` is NOT `undefined` and NOT `true` — it is a precise signal
      // that no non-baseline tool is permitted. Derivation must iterate
      // the (empty) array, treat the allow-set as "baseline only", and
      // emit a deny for every dangerous tool.
      const subagent = makeAgent();

      const rules = deriveSubagentSessionPermission({
        parentSessionPermission: [],
        parentAgent: undefined,
        subagent,
        allowedTools: [],
      });

      for (const tool of [
        'write',
        'edit',
        'multiedit',
        'patch',
        'apply_patch',
        'bash',
        'shell',
        'webfetch',
        'delete',
      ]) {
        expect(rules.some((r) => r.decision === 'deny' && r.tools?.includes(tool))).toBe(true);
      }
    });
  });
});
