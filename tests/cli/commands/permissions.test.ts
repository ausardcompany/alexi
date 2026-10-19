/**
 * Tests for `src/cli/commands/permissions.ts` — the
 * `alexi permissions list|show|edit` CLI flow.
 *
 * Issue #2087. Uses a fresh `PermissionManager` and a stub prompt
 * adapter so the tests never touch a real tty or the global manager
 * instance's rules.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Command } from 'commander';

import {
  PermissionManager,
  setPermissionManager,
  recordDenial,
  clearDenialStore,
  type PermissionRule,
} from '../../../src/permission/index.js';
import {
  applyEditFlags,
  describeRulePatterns,
  editRuleInteractively,
  formatRuleDetail,
  formatRuleSummary,
  listRules,
  registerPermissionsCommand,
  showRule,
  type InteractivePromptAdapter,
} from '../../../src/cli/commands/permissions.js';

function buildRules(): PermissionRule[] {
  return [
    {
      id: 'rule-allow-read',
      name: 'Allow Read',
      description: 'Allow read actions',
      actions: ['read'],
      decision: 'allow',
      priority: 10,
    },
    {
      id: 'rule-deny-secrets',
      name: 'Deny Secrets',
      description: 'Deny access to secrets',
      paths: ['**/.env'],
      decision: 'deny',
      priority: 100,
    },
    {
      id: 'rule-ask-write',
      actions: ['write'],
      decision: 'ask',
      priority: 20,
    },
  ];
}

function installManager(): PermissionManager {
  const manager = new PermissionManager(buildRules());
  setPermissionManager(manager);
  return manager;
}

interface Captured {
  stdout: string;
  stderr: string;
  exitCode: number | undefined;
}

async function runPermissionsCommand(argv: string[]): Promise<Captured> {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  const outSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((
    chunk: string | Uint8Array
  ) => {
    stdoutChunks.push(typeof chunk === 'string' ? chunk : String(chunk));
    return true;
  }) as never);
  const errSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((
    chunk: string | Uint8Array
  ) => {
    stderrChunks.push(typeof chunk === 'string' ? chunk : String(chunk));
    return true;
  }) as never);

  const previousExitCode = process.exitCode;
  process.exitCode = undefined;

  const program = new Command();
  program.exitOverride();
  registerPermissionsCommand(program);

  try {
    await program.parseAsync(argv, { from: 'user' });
  } catch {
    // Commander throws on exitOverride; assertions below are authoritative.
  }

  const captured: Captured = {
    stdout: stdoutChunks.join(''),
    stderr: stderrChunks.join(''),
    exitCode: process.exitCode,
  };
  process.exitCode = previousExitCode;
  outSpy.mockRestore();
  errSpy.mockRestore();
  return captured;
}

beforeEach(() => {
  clearDenialStore();
  installManager();
});

afterEach(() => {
  vi.restoreAllMocks();
  clearDenialStore();
});

describe('formatRuleSummary / describeRulePatterns', () => {
  it('renders decision, id, name, and priority on one line', () => {
    const rules = buildRules();
    const line = formatRuleSummary(rules[0]);
    expect(line).toContain('[ALLOW]');
    expect(line).toContain('rule-allow-read');
    expect(line).toContain('Allow Read');
    expect(line).toContain('priority 10');
  });

  it('describes path and action patterns', () => {
    const rules = buildRules();
    expect(describeRulePatterns(rules[1])).toContain('paths: **/.env');
    expect(describeRulePatterns(rules[0])).toContain('actions: read');
  });

  it('falls back to <no-id>/(unnamed) when fields are missing', () => {
    const line = formatRuleSummary({ decision: 'allow', priority: 0 });
    expect(line).toContain('<no-id>');
    expect(line).toContain('(unnamed)');
  });
});

describe('formatRuleDetail', () => {
  it('renders every populated field', () => {
    const rules = buildRules();
    const out = formatRuleDetail(rules[1]);
    expect(out).toContain('Rule: rule-deny-secrets');
    expect(out).toContain('Name:        Deny Secrets');
    expect(out).toContain('Description: Deny access to secrets');
    expect(out).toContain('Decision:    deny');
    expect(out).toContain('Priority:    100');
    expect(out).toContain('Paths:       **/.env');
  });

  it('includes provenance when a denial has been recorded', () => {
    recordDenial('rule-deny-secrets', {
      decision: 'deny',
      ruleSource: 'config',
      ruleId: 'rule-deny-secrets',
      reason: 'matched secret path',
    });
    const rules = buildRules();
    const out = formatRuleDetail(rules[1]);
    expect(out).toContain('Provenance:');
    expect(out).toContain('Denied by config');
  });
});

describe('listRules / showRule', () => {
  it('listRules returns every saved rule', () => {
    const { rules } = listRules();
    expect(rules.map((r) => r.id)).toEqual([
      'rule-allow-read',
      'rule-ask-write',
      'rule-deny-secrets',
    ]);
  });

  it('showRule returns undefined when the id is unknown', () => {
    expect(showRule('does-not-exist').rule).toBeUndefined();
  });
});

describe('applyEditFlags', () => {
  it('updates the decision when --decision is supplied', () => {
    const manager = installManager();
    const result = applyEditFlags('rule-ask-write', { decision: 'allow' }, manager);
    expect(result.updated?.decision).toBe('allow');
    expect(manager.getRule('rule-ask-write')?.decision).toBe('allow');
  });

  it('coerces --priority to a number', () => {
    const manager = installManager();
    const result = applyEditFlags('rule-ask-write', { priority: '42' }, manager);
    expect(result.updated?.priority).toBe(42);
  });

  it('rejects an invalid --decision value', () => {
    const manager = installManager();
    const result = applyEditFlags('rule-ask-write', { decision: 'bogus' }, manager);
    expect(result.updated).toBeNull();
    expect(result.reason).toMatch(/Invalid --decision/);
  });

  it('rejects a non-numeric --priority value', () => {
    const manager = installManager();
    const result = applyEditFlags('rule-ask-write', { priority: 'nope' }, manager);
    expect(result.updated).toBeNull();
    expect(result.reason).toMatch(/Invalid --priority/);
  });

  it('returns a reason when no editable field is supplied', () => {
    const manager = installManager();
    const result = applyEditFlags('rule-ask-write', {}, manager);
    expect(result.updated).toBeNull();
    expect(result.reason).toBe('no fields to update');
  });

  it('returns a reason when the rule id does not exist', () => {
    const manager = installManager();
    const result = applyEditFlags('does-not-exist', { decision: 'allow' }, manager);
    expect(result.updated).toBeNull();
    expect(result.reason).toMatch(/not found/);
  });
});

describe('editRuleInteractively', () => {
  function makeAdapter(
    overrides: Partial<InteractivePromptAdapter> = {}
  ): InteractivePromptAdapter {
    return {
      pickDecision: async () => null,
      askPriority: async () => null,
      askDescription: async () => null,
      ...overrides,
    };
  }

  it('applies decision/priority/description from the adapter', async () => {
    const manager = installManager();
    const adapter = makeAdapter({
      pickDecision: async () => 'deny',
      askPriority: async () => 55,
      askDescription: async () => 'new description',
    });
    const updated = await editRuleInteractively('rule-ask-write', adapter, manager);
    expect(updated).not.toBeNull();
    expect(updated?.decision).toBe('deny');
    expect(updated?.priority).toBe(55);
    expect(updated?.description).toBe('new description');
  });

  it('leaves fields untouched when the adapter returns null', async () => {
    const manager = installManager();
    const original = manager.getRule('rule-allow-read');
    const adapter = makeAdapter();
    const updated = await editRuleInteractively('rule-allow-read', adapter, manager);
    expect(updated?.decision).toBe(original?.decision);
    expect(updated?.priority).toBe(original?.priority);
    expect(updated?.description).toBe(original?.description);
  });

  it('returns null for an unknown rule id', async () => {
    const manager = installManager();
    const adapter = makeAdapter({ pickDecision: async () => 'allow' });
    const updated = await editRuleInteractively('does-not-exist', adapter, manager);
    expect(updated).toBeNull();
  });
});

describe('alexi permissions — command wiring', () => {
  it('`permissions list` prints each saved rule', async () => {
    const result = await runPermissionsCommand(['permissions', 'list']);
    expect(result.stdout).toContain('Permission Rules');
    expect(result.stdout).toContain('rule-allow-read');
    expect(result.stdout).toContain('rule-deny-secrets');
    expect(result.exitCode).toBeUndefined();
  });

  it('`permissions list --json` emits a parsable JSON array', async () => {
    const result = await runPermissionsCommand(['permissions', 'list', '--json']);
    const parsed = JSON.parse(result.stdout.trim());
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.map((r: PermissionRule) => r.id)).toContain('rule-allow-read');
  });

  it('`permissions show <id>` renders rule details', async () => {
    const result = await runPermissionsCommand(['permissions', 'show', 'rule-deny-secrets']);
    expect(result.stdout).toContain('Rule: rule-deny-secrets');
    expect(result.stdout).toContain('Decision:    deny');
    expect(result.exitCode).toBeUndefined();
  });

  it('`permissions show <id>` includes provenance for recent denials', async () => {
    recordDenial('rule-deny-secrets', {
      decision: 'deny',
      ruleSource: 'config',
      ruleId: 'rule-deny-secrets',
      reason: 'matched secret path',
    });
    const result = await runPermissionsCommand(['permissions', 'show', 'rule-deny-secrets']);
    expect(result.stdout).toContain('Provenance:');
    expect(result.stdout).toContain('Denied by config');
  });

  it('`permissions show <id>` reports missing rules on stderr with exit=1', async () => {
    const result = await runPermissionsCommand(['permissions', 'show', 'does-not-exist']);
    expect(result.stderr).toMatch(/not found/);
    expect(result.exitCode).toBe(1);
  });

  it('`permissions edit <id> --decision allow` updates the rule', async () => {
    const result = await runPermissionsCommand([
      'permissions',
      'edit',
      'rule-ask-write',
      '--decision',
      'allow',
    ]);
    expect(result.stdout).toContain("Updated rule 'rule-ask-write'");
    expect(result.stdout).toContain('Decision:    allow');
    expect(result.exitCode).toBeUndefined();
  });

  it('`permissions edit <id>` rejects an invalid decision', async () => {
    const result = await runPermissionsCommand([
      'permissions',
      'edit',
      'rule-ask-write',
      '--decision',
      'bogus',
    ]);
    expect(result.stderr).toMatch(/Invalid --decision/);
    expect(result.exitCode).toBe(1);
  });

  it('`permissions edit <id>` without flags refuses to run outside a TTY', async () => {
    const originalIsTTY = process.stdin.isTTY;
    Object.defineProperty(process.stdin, 'isTTY', { configurable: true, value: false });
    try {
      const result = await runPermissionsCommand(['permissions', 'edit', 'rule-ask-write']);
      expect(result.stderr).toMatch(/refusing to run interactive editor/);
      expect(result.exitCode).toBe(1);
    } finally {
      Object.defineProperty(process.stdin, 'isTTY', {
        configurable: true,
        value: originalIsTTY,
      });
    }
  });
});
