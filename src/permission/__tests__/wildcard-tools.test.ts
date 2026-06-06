import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';

import {
  PermissionManager,
  PermissionRuleSchema,
  type PermissionContext,
  type PermissionRule,
} from '../index.js';
import { getToolRegistry } from '../../tool/index.js';
import { registerBuiltInTools } from '../../tool/tools/index.js';

/**
 * Tests for issue #713: deny-rule glob warnings + asymmetric allow-rule
 * guard around `PermissionRule.tools` glob handling.
 *
 * Covers:
 *   1. `tools: ['*']` + decision: 'deny' denies every registered tool name.
 *   2. `tools: ['Bsah']` (typo) + decision: 'deny' produces a `logger.warn`
 *      at PermissionManager construction and is otherwise a no-op.
 *   3. `tools: ['*']` + decision: 'allow' is rejected by Zod schema parse.
 *   4. `tools: ['mcp__server__*']` + decision: 'allow' is accepted (MCP
 *      namespace exemption).
 */

function ctx(toolName: string, action: PermissionContext['action'] = 'read'): PermissionContext {
  return {
    toolName,
    action,
    resource: '/tmp/wildcard-tools-test/file.txt',
  };
}

describe('PermissionRule.tools wildcard guards (issue #713)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  function getWarnLines(): string[] {
    const calls = warnSpy.mock.calls as unknown as unknown[][];
    return calls.map((call) => call.map((part) => String(part)).join(' '));
  }

  beforeAll(() => {
    // Ensure built-in tools are registered so the warning logic and
    // wildcard-deny tests have a real registry to consult. registerTool
    // is idempotent on the global registry (Map.set semantics).
    registerBuiltInTools();
  });

  beforeEach(() => {
    // Silence and capture logger.warn output (logger.warn -> console.warn).
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  describe('schema validation: asymmetric allow-rule glob guard', () => {
    it("rejects allow rules with a literal '*' tool pattern", () => {
      const rule = {
        id: 'bad-allow-wildcard',
        tools: ['*'],
        decision: 'allow',
      };
      expect(() => PermissionRuleSchema.parse(rule)).toThrow();
    });

    it("rejects allow rules with a '?' tool pattern", () => {
      const rule = {
        id: 'bad-allow-question-mark',
        tools: ['rea?'],
        decision: 'allow',
      };
      expect(() => PermissionRuleSchema.parse(rule)).toThrow();
    });

    it("accepts allow rules with an 'mcp__'-prefixed glob (MCP namespace exemption)", () => {
      const rule = {
        id: 'allow-mcp-namespace',
        tools: ['mcp__server__*'],
        decision: 'allow',
      };
      const parsed = PermissionRuleSchema.parse(rule);
      expect(parsed.tools).toEqual(['mcp__server__*']);
      expect(parsed.decision).toBe('allow');
    });

    it('accepts allow rules with literal tool names (no glob chars)', () => {
      const rule = {
        id: 'allow-literal',
        tools: ['read', 'write'],
        decision: 'allow',
      };
      const parsed = PermissionRuleSchema.parse(rule);
      expect(parsed.tools).toEqual(['read', 'write']);
    });

    it("permits 'deny' rules to use globs without restriction", () => {
      const rule = {
        id: 'deny-wildcard',
        tools: ['*'],
        decision: 'deny',
      };
      const parsed = PermissionRuleSchema.parse(rule);
      expect(parsed.decision).toBe('deny');
      expect(parsed.tools).toEqual(['*']);
    });
  });

  describe("rule evaluation: tools: ['*'] + deny denies every tool", () => {
    it('matches every registered tool name for a wildcard deny rule', () => {
      // Sanity check: registry must contain at least the built-in tools so
      // the assertion below is not vacuously true.
      const registeredNames = getToolRegistry()
        .list()
        .map((t) => t.name);
      expect(registeredNames.length).toBeGreaterThan(0);

      const wildcardDeny: PermissionRule = {
        id: 'wildcard-deny',
        tools: ['*'],
        decision: 'deny',
        priority: 100,
      };

      const manager = new PermissionManager([wildcardDeny]);

      for (const name of registeredNames) {
        const result = manager.evaluate(ctx(name));
        expect(result.decision).toBe('deny');
        expect(result.rule?.id).toBe('wildcard-deny');
      }
    });

    it('also denies arbitrary unknown tool names (matching engine treats * literally)', () => {
      const wildcardDeny: PermissionRule = {
        id: 'wildcard-deny-2',
        tools: ['*'],
        decision: 'deny',
        priority: 0,
      };
      const manager = new PermissionManager([wildcardDeny]);

      expect(manager.evaluate(ctx('definitely-not-a-real-tool')).decision).toBe('deny');
    });
  });

  describe('startup warnings for unknown deny-rule tool names', () => {
    it('warns once per typo when constructing a PermissionManager', () => {
      const typoRule: PermissionRule = {
        id: 'deny-typo',
        tools: ['Bsah'], // intentional typo of 'bash'
        decision: 'deny',
        priority: 0,
      };

      const manager = new PermissionManager([typoRule]);

      // The warning should mention the rule label and the unknown tool name.
      const matched = getWarnLines().find(
        (line) => line.includes("'deny-typo'") && line.includes("'Bsah'")
      );
      expect(matched).toBeDefined();

      // The rule still parses and is stored, but does not match anything
      // because the wildcard matcher will not equate 'Bsah' with 'bash'.
      const result = manager.evaluate(ctx('bash'));
      expect(result.decision).not.toBe('deny');
    });

    it('does not warn for deny rules whose tool entries contain glob chars', () => {
      const rule: PermissionRule = {
        id: 'deny-glob',
        tools: ['*'],
        decision: 'deny',
        priority: 0,
      };
      const manager = new PermissionManager([rule]);
      expect(manager.getRules()).toHaveLength(1);

      const offending = getWarnLines().find((line) => line.includes("'deny-glob'"));
      expect(offending).toBeUndefined();
    });

    it('does not warn for deny rules referencing real registered tools', () => {
      const known = getToolRegistry()
        .list()
        .map((t) => t.name)[0];
      // Skip if no tools are registered in this test environment - the
      // wildcard deny test above would also be vacuous in that case.
      if (!known) {
        return;
      }

      const rule: PermissionRule = {
        id: 'deny-known-tool',
        tools: [known],
        decision: 'deny',
        priority: 0,
      };
      const manager = new PermissionManager([rule]);
      expect(manager.getRules()).toHaveLength(1);

      const offending = getWarnLines().find((line) => line.includes("'deny-known-tool'"));
      expect(offending).toBeUndefined();
    });
  });
});
