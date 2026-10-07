/**
 * Tests for commit-message rules wiring.
 *
 * Verifies that {@link generateCommitMessage} loads `.alexi/rules/` through
 * `discoverRules`, filters disabled rules via the `disabled:` frontmatter
 * flag, and appends the enabled rules to the system prompt handed to the
 * provider. Mirrors the behaviour fixed upstream in cline PR #14103 for
 * issue #1953.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mock dependencies BEFORE importing the module under test — vi.mock is
// hoisted, but keeping the order explicit matches the project convention.
vi.mock('../providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
}));

vi.mock('../core/router.js', () => ({
  routePrompt: vi.fn(() => ({ modelId: 'gpt-4o-mini', reason: 'cheap', confidence: 0.9 })),
}));

import {
  buildRulesSection,
  COMMIT_RULES_PREAMBLE,
  CommitMessageError,
  consumeLastCommitMessageError,
  generateCommitMessage,
} from './commitMessage.js';
import type { GitConfig } from './config.js';
import { getProviderForModelWithFallback } from '../providers/index.js';

const baseConfig: GitConfig = {
  autoCommits: true,
  dirtyCommits: true,
  commitVerify: false,
  attribution: {
    style: 'co-authored-by',
    name: 'Alexi AI',
    email: 'alexi@assistant.local',
  },
  commitMessage: {
    useAI: true,
    conventional: true,
  },
};

/**
 * Create a temp workdir with a `.alexi/rules/` directory containing the
 * given files. Returns the workdir path and a cleanup function.
 */
function makeWorkdirWithRules(files: Record<string, string>): {
  workdir: string;
  cleanup: () => void;
} {
  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-commit-rules-'));
  const rulesDir = path.join(workdir, '.alexi', 'rules');
  fs.mkdirSync(rulesDir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(rulesDir, name), content, 'utf-8');
  }
  return {
    workdir,
    cleanup: () => fs.rmSync(workdir, { recursive: true, force: true }),
  };
}

describe('buildRulesSection', () => {
  let fixture: { workdir: string; cleanup: () => void };

  beforeEach(() => {
    fixture = makeWorkdirWithRules({
      // Deliberately placed first alphabetically to make sort order visible.
      'a-ticket.md': 'Always include a ticket number.',
      'b-disabled.md': '---\ndisabled: true\n---\nShould never appear.',
      'c-spanish.md': 'Write messages in Spanish.',
    });
  });

  afterEach(() => {
    fixture.cleanup();
  });

  it('returns an empty string when no rules are discovered', () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-commit-norules-'));
    try {
      expect(buildRulesSection(empty)).toBe('');
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });

  it('excludes rules marked disabled: true in frontmatter', () => {
    const section = buildRulesSection(fixture.workdir);
    expect(section).not.toContain('b-disabled.md');
    expect(section).not.toContain('Should never appear');
  });

  it('includes enabled rules in deterministic (filename) order', () => {
    const section = buildRulesSection(fixture.workdir);
    expect(section.startsWith(COMMIT_RULES_PREAMBLE)).toBe(true);
    const aIdx = section.indexOf('a-ticket.md');
    const cIdx = section.indexOf('c-spanish.md');
    expect(aIdx).toBeGreaterThan(-1);
    expect(cIdx).toBeGreaterThan(-1);
    expect(aIdx).toBeLessThan(cIdx);
  });

  it('wraps each rule in a <rule file="..."> tag', () => {
    const section = buildRulesSection(fixture.workdir);
    expect(section).toContain('<rule file="a-ticket.md">');
    expect(section).toContain('Always include a ticket number.');
    expect(section).toContain('</rule>');
  });

  it('honors string disabled values (e.g. "true", "yes")', () => {
    const extra = makeWorkdirWithRules({
      'd-string-disabled.md': '---\ndisabled: "yes"\n---\nShadowed.',
      'e-live.md': 'Live content.',
    });
    try {
      const section = buildRulesSection(extra.workdir);
      expect(section).not.toContain('Shadowed');
      expect(section).toContain('Live content.');
    } finally {
      extra.cleanup();
    }
  });
});

describe('generateCommitMessage rules wiring', () => {
  let fixture: { workdir: string; cleanup: () => void };
  let completeFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fixture = makeWorkdirWithRules({
      'ticket.md': 'Always reference an issue number.',
      'ignored.md': '---\ndisabled: true\n---\nShould not appear.',
    });
    completeFn = vi.fn().mockResolvedValue({
      text: 'feat: wire rules into commit generator',
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    });
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: { complete: completeFn } as never,
      effectiveModelId: 'gpt-4o-mini',
      usedFallback: false,
    });
  });

  afterEach(() => {
    fixture.cleanup();
    vi.resetAllMocks();
  });

  it('passes enabled rules in the system message to provider.complete', async () => {
    const msg = await generateCommitMessage(
      [{ filePath: 'src/foo.ts', toolName: 'write' }],
      baseConfig,
      fixture.workdir
    );

    expect(msg).toBe('feat: wire rules into commit generator');
    expect(completeFn).toHaveBeenCalledTimes(1);
    const [messages] = completeFn.mock.calls[0];
    const systemMsg = messages.find((m: { role: string; content: string }) => m.role === 'system');
    expect(systemMsg).toBeDefined();
    expect(systemMsg.content).toContain('git commit message generator');
    expect(systemMsg.content).toContain(COMMIT_RULES_PREAMBLE);
    expect(systemMsg.content).toContain('<rule file="ticket.md">');
    expect(systemMsg.content).toContain('Always reference an issue number.');
  });

  it('excludes rules with disabled: true frontmatter from the system message', async () => {
    await generateCommitMessage(
      [{ filePath: 'src/foo.ts', toolName: 'write' }],
      baseConfig,
      fixture.workdir
    );

    const [messages] = completeFn.mock.calls[0];
    const systemMsg = messages.find((m: { role: string; content: string }) => m.role === 'system');
    expect(systemMsg.content).not.toContain('ignored.md');
    expect(systemMsg.content).not.toContain('Should not appear');
  });

  it('omits the rules preamble when no rules exist in workdir', async () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-commit-empty-'));
    try {
      await generateCommitMessage(
        [{ filePath: 'src/foo.ts', toolName: 'write' }],
        baseConfig,
        empty
      );
      const [messages] = completeFn.mock.calls[0];
      const systemMsg = messages.find(
        (m: { role: string; content: string }) => m.role === 'system'
      );
      expect(systemMsg.content).not.toContain(COMMIT_RULES_PREAMBLE);
      expect(systemMsg.content).toContain('git commit message generator');
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });

  it('respects commitMessage.rulesPath override from config', async () => {
    const customDir = path.join(fixture.workdir, 'custom-rules');
    fs.mkdirSync(customDir, { recursive: true });
    fs.writeFileSync(path.join(customDir, 'override.md'), 'Custom override rule.', 'utf-8');

    await generateCommitMessage(
      [{ filePath: 'src/foo.ts', toolName: 'write' }],
      {
        ...baseConfig,
        commitMessage: { ...baseConfig.commitMessage, rulesPath: 'custom-rules' },
      },
      fixture.workdir
    );

    const [messages] = completeFn.mock.calls[0];
    const systemMsg = messages.find((m: { role: string; content: string }) => m.role === 'system');
    expect(systemMsg.content).toContain('<rule file="override.md">');
    expect(systemMsg.content).toContain('Custom override rule.');
  });
});

describe('generateCommitMessage provider-error preservation', () => {
  // Ports upstream kilocode `f54e713dd` ("fix(cli): preserve
  // commit-message provider errors"). Previously, provider failures
  // were swallowed as a warn log and callers only observed the
  // heuristic fallback. The regression test below locks in that the
  // originating provider error is now reachable via
  // `consumeLastCommitMessageError` so the CLI / AutoCommitManager can
  // surface it to operators.
  let completeFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Drain any leftover state from previous suites so this test's
    // consume() reads reflect ONLY this test's attempt.
    consumeLastCommitMessageError();
    completeFn = vi.fn();
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: { complete: completeFn } as never,
      effectiveModelId: 'gpt-4o-mini',
      usedFallback: false,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('preserves the originating provider error for the caller', async () => {
    const providerError = new Error('SAP AI Core: 503 Service Unavailable');
    completeFn.mockRejectedValueOnce(providerError);

    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-commit-error-'));
    try {
      // Still returns a heuristic — generator never rejects.
      const msg = await generateCommitMessage(
        [{ filePath: 'src/foo.ts', toolName: 'write' }],
        baseConfig,
        empty
      );
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);

      const preserved = consumeLastCommitMessageError();
      expect(preserved).toBeInstanceOf(CommitMessageError);
      expect(preserved?.message).toContain('503 Service Unavailable');
      // The originating error is reachable via `.cause` so callers can
      // branch on provider-specific types without regex-matching the
      // message.
      expect(preserved?.cause).toBe(providerError);
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });

  it('consume() is idempotent — second read returns null', async () => {
    completeFn.mockRejectedValueOnce(new Error('boom'));
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-commit-error-'));
    try {
      await generateCommitMessage(
        [{ filePath: 'src/foo.ts', toolName: 'write' }],
        baseConfig,
        empty
      );
      expect(consumeLastCommitMessageError()).not.toBeNull();
      expect(consumeLastCommitMessageError()).toBeNull();
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });

  it('clears the stored error on a subsequent successful call', async () => {
    completeFn.mockRejectedValueOnce(new Error('transient')).mockResolvedValueOnce({
      text: 'feat: ok',
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    });

    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-commit-error-'));
    try {
      await generateCommitMessage(
        [{ filePath: 'src/foo.ts', toolName: 'write' }],
        baseConfig,
        empty
      );
      // Second call succeeds and must clear the error BEFORE returning.
      await generateCommitMessage(
        [{ filePath: 'src/foo.ts', toolName: 'write' }],
        baseConfig,
        empty
      );
      expect(consumeLastCommitMessageError()).toBeNull();
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });
});
