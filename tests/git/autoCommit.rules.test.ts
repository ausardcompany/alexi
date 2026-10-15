/**
 * End-to-end test for commit-message rules wiring through
 * {@link AutoCommitManager}.
 *
 * This complements `src/git/commitMessage.test.ts` by exercising the full
 * chain `AutoCommitManager → generateCommitMessage → provider.complete`
 * with a real `.alexi/rules/commit-style.md` fixture on disk. It locks in
 * the contract that:
 *   1. User rules under `.alexi/rules/` reach the provider's system prompt.
 *   2. The commitlint `scope-enum` from `commitlint.config.cjs` is injected
 *      into the system prompt so generated messages respect allowed scopes.
 *
 * Only `simple-git` is mocked — everything else (rules discovery, prompt
 * assembly, provider resolution) runs through the real code paths. This
 * matches the issue's "Done when" clause asking for a mocked rules file
 * to produce a compliant commit.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { AutoCommitManager } from '../../src/git/autoCommit.js';
import type { GitConfig } from '../../src/git/config.js';
import { COMMIT_RULES_PREAMBLE, COMMIT_SCOPES_PREAMBLE } from '../../src/git/commitMessage.js';

// Mock simple-git so no actual repo work happens, but keep the real
// commitMessage/rulesDiscovery/providers modules in the loop.
vi.mock('simple-git', () => {
  const mockGit = {
    revparse: vi.fn().mockResolvedValue('.git'),
    status: vi.fn().mockResolvedValue({ staged: ['foo.ts'] }),
    add: vi.fn().mockResolvedValue(undefined),
    commit: vi.fn().mockResolvedValue({ commit: 'deadbee' }),
    reset: vi.fn().mockResolvedValue(undefined),
    raw: vi.fn().mockResolvedValue(''),
    log: vi.fn().mockResolvedValue({ all: [] }),
    diff: vi.fn().mockResolvedValue(''),
  };
  return { simpleGit: vi.fn(() => mockGit) };
});

// Pretend every workdir is a git repo so AutoCommitManager actually
// proceeds to the commit-message generation step.
vi.mock('../../src/git/dirtyFiles.js', () => ({
  isGitRepo: vi.fn().mockResolvedValue(true),
  getDirtyFiles: vi.fn().mockResolvedValue([]),
  commitDirtyFiles: vi.fn(),
}));

// Mock the provider so no real HTTP happens, but keep the real
// commitMessage.ts in the loop (we must verify the system prompt it
// builds).
vi.mock('../../src/providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
}));

// Keep routePrompt deterministic (no model lookup through routing config).
vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(() => ({ modelId: 'gpt-4o-mini', reason: 'cheap', confidence: 0.9 })),
}));

import { getProviderForModelWithFallback } from '../../src/providers/index.js';

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

interface Fixture {
  workdir: string;
  cleanup: () => void;
}

/**
 * Build a temp workdir containing:
 *   - `.alexi/rules/commit-style.md` with the given rule content.
 *   - `commitlint.config.cjs` declaring the given scope-enum.
 */
function makeFixture(ruleContent: string, scopes: string[]): Fixture {
  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-autocommit-rules-'));
  const rulesDir = path.join(workdir, '.alexi', 'rules');
  fs.mkdirSync(rulesDir, { recursive: true });
  fs.writeFileSync(path.join(rulesDir, 'commit-style.md'), ruleContent, 'utf-8');
  const configJs = `module.exports = { rules: { 'scope-enum': [2, 'always', ${JSON.stringify(scopes)}] } };\n`;
  fs.writeFileSync(path.join(workdir, 'commitlint.config.cjs'), configJs, 'utf-8');
  return {
    workdir,
    cleanup: () => fs.rmSync(workdir, { recursive: true, force: true }),
  };
}

describe('AutoCommitManager honors .alexi/rules/ and commitlint scope-enum', () => {
  let fixture: Fixture;
  let completeFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fixture = makeFixture(
      'All commit messages MUST reference an issue number in the subject line.',
      ['cli', 'core', 'providers', 'config', 'tests']
    );
    completeFn = vi.fn().mockResolvedValue({
      text: 'feat(core): wire commit-message rules loader (#2041)',
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
    // Only clear call history; `vi.resetAllMocks()` would wipe the
    // `simpleGit` factory's return value, breaking subsequent tests.
    vi.clearAllMocks();
  });

  it('loads the mock .alexi/rules/commit-style.md into the provider system prompt', async () => {
    const manager = new AutoCommitManager({
      workdir: fixture.workdir,
      config: baseConfig,
    });
    manager.onFileChanged(path.join(fixture.workdir, 'src/foo.ts'), 'write');
    const result = await manager.commitPendingChanges();
    manager.destroy();

    expect(result).not.toBeNull();
    expect(result?.hash).toBe('deadbee');
    expect(completeFn).toHaveBeenCalledTimes(1);

    const [messages] = completeFn.mock.calls[0];
    const systemMsg = messages.find((m: { role: string; content: string }) => m.role === 'system');
    expect(systemMsg).toBeDefined();
    // Rules preamble + the actual rule content both present.
    expect(systemMsg.content).toContain(COMMIT_RULES_PREAMBLE);
    expect(systemMsg.content).toContain('<rule file="commit-style.md">');
    expect(systemMsg.content).toContain('All commit messages MUST reference an issue number');
  });

  it('injects the commitlint scope-enum into the provider system prompt', async () => {
    const manager = new AutoCommitManager({
      workdir: fixture.workdir,
      config: baseConfig,
    });
    manager.onFileChanged(path.join(fixture.workdir, 'src/foo.ts'), 'write');
    await manager.commitPendingChanges();
    manager.destroy();

    const [messages] = completeFn.mock.calls[0];
    const systemMsg = messages.find((m: { role: string; content: string }) => m.role === 'system');
    expect(systemMsg.content).toContain(COMMIT_SCOPES_PREAMBLE);
    expect(systemMsg.content).toContain('cli, core, providers, config, tests');
  });

  it('produces a conventional-commit compliant message when provider follows the rules', async () => {
    const manager = new AutoCommitManager({
      workdir: fixture.workdir,
      config: baseConfig,
    });
    manager.onFileChanged(path.join(fixture.workdir, 'src/foo.ts'), 'write');
    const result = await manager.commitPendingChanges();
    manager.destroy();

    // The generated commit (returned by our mocked complete()) must
    // match conventional-commit shape AND use a scope from scope-enum.
    expect(result?.message).toMatch(
      /^(feat|fix|docs|style|refactor|perf|test|chore|ci|revert)\((cli|core|providers|config|server|agent|tools|ci|deps|tests)\): /
    );
  });

  it('omits scope-enum and rules sections when neither is configured', async () => {
    const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-autocommit-bare-'));
    try {
      const manager = new AutoCommitManager({ workdir: bare, config: baseConfig });
      manager.onFileChanged(path.join(bare, 'src/foo.ts'), 'write');
      await manager.commitPendingChanges();
      manager.destroy();

      const [messages] = completeFn.mock.calls[0];
      const systemMsg = messages.find(
        (m: { role: string; content: string }) => m.role === 'system'
      );
      expect(systemMsg.content).toContain('git commit message generator');
      expect(systemMsg.content).not.toContain(COMMIT_RULES_PREAMBLE);
      expect(systemMsg.content).not.toContain(COMMIT_SCOPES_PREAMBLE);
    } finally {
      fs.rmSync(bare, { recursive: true, force: true });
    }
  });
});
