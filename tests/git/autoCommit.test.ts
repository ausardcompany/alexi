import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AutoCommitManager } from '../../src/git/autoCommit.js';
import type { GitConfig } from '../../src/git/config.js';

// Mock simple-git
vi.mock('simple-git', () => {
  const mockGit = {
    revparse: vi.fn().mockResolvedValue('.git'),
    status: vi.fn().mockResolvedValue({
      staged: [],
      modified: [],
      not_added: [],
      deleted: [],
      renamed: [],
      created: [],
    }),
    add: vi.fn().mockResolvedValue(undefined),
    commit: vi.fn().mockResolvedValue({ commit: 'abc1234' }),
    reset: vi.fn().mockResolvedValue(undefined),
    raw: vi.fn().mockResolvedValue(''),
    log: vi.fn().mockResolvedValue({ all: [] }),
    diff: vi.fn().mockResolvedValue(''),
  };
  return {
    simpleGit: vi.fn(() => mockGit),
    __mockGit: mockGit,
  };
});

// Mock commitMessage to avoid LLM calls
vi.mock('../../src/git/commitMessage.js', () => ({
  generateCommitMessage: vi.fn().mockResolvedValue('feat: update foo.ts'),
  buildHeuristicMessage: vi.fn().mockReturnValue('feat: update foo.ts'),
}));

// Mock isGitRepo from dirtyFiles
vi.mock('../../src/git/dirtyFiles.js', () => ({
  isGitRepo: vi.fn().mockResolvedValue(true),
  getDirtyFiles: vi.fn().mockResolvedValue([]),
  commitDirtyFiles: vi.fn().mockResolvedValue({
    committed: false,
    filesCommitted: [],
    skipped: true,
    reason: 'no dirty files',
  }),
}));

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
    useAI: false,
    conventional: true,
  },
};

describe('AutoCommitManager', () => {
  let manager: AutoCommitManager;

  beforeEach(() => {
    manager = new AutoCommitManager({ workdir: '/tmp/test-repo', config: baseConfig });
    vi.useFakeTimers();
  });

  afterEach(() => {
    manager.destroy();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('does not queue files when autoCommits=false', () => {
    const config: GitConfig = { ...baseConfig, autoCommits: false };
    const mgr = new AutoCommitManager({ workdir: '/tmp/test-repo', config });
    mgr.onFileChanged('/tmp/test-repo/foo.ts', 'write');
    expect(mgr.getPendingCount()).toBe(0);
    mgr.destroy();
  });

  it('queues files when autoCommits=true', () => {
    manager.onFileChanged('/tmp/test-repo/foo.ts', 'write');
    expect(manager.getPendingCount()).toBe(1);
  });

  it('deduplicates the same file path', () => {
    manager.onFileChanged('/tmp/test-repo/foo.ts', 'write');
    manager.onFileChanged('/tmp/test-repo/foo.ts', 'edit');
    expect(manager.getPendingCount()).toBe(1);
  });

  it('commitPendingChanges returns null when no pending files', async () => {
    const result = await manager.commitPendingChanges();
    expect(result).toBeNull();
  });

  it('commitPendingChanges commits staged files and clears pending queue', async () => {
    const simpleGitMod = await import('simple-git');

    const mockGit =
      (simpleGitMod.simpleGit as any).mock.results[0]?.value ?? (simpleGitMod.simpleGit as any)();
    mockGit.status.mockResolvedValueOnce({ staged: ['foo.ts'] });

    manager.onFileChanged('/tmp/test-repo/foo.ts', 'write');
    const result = await manager.commitPendingChanges();

    expect(result).not.toBeNull();
    expect(result?.hash).toBe('abc1234');
    expect(manager.getPendingCount()).toBe(0);
  });

  it('getLastCommitHash returns the last commit hash after commit', async () => {
    const simpleGitMod = await import('simple-git');

    const mockGit =
      (simpleGitMod.simpleGit as any).mock.results[0]?.value ?? (simpleGitMod.simpleGit as any)();
    mockGit.status.mockResolvedValueOnce({ staged: ['foo.ts'] });

    manager.onFileChanged('/tmp/test-repo/foo.ts', 'write');
    await manager.commitPendingChanges();

    expect(manager.getLastCommitHash()).toBe('abc1234');
  });

  it('updateConfig applies partial config update', () => {
    manager.updateConfig({ autoCommits: false });
    manager.onFileChanged('/tmp/test-repo/foo.ts', 'write');
    // With autoCommits=false, nothing should be queued
    expect(manager.getPendingCount()).toBe(0);
  });

  it('debounce timer fires commit after delay', async () => {
    const simpleGitMod = await import('simple-git');

    const mockGit =
      (simpleGitMod.simpleGit as any).mock.results[0]?.value ?? (simpleGitMod.simpleGit as any)();
    mockGit.status.mockResolvedValue({ staged: ['foo.ts'] });

    manager.onFileChanged('/tmp/test-repo/foo.ts', 'write');
    expect(manager.getPendingCount()).toBe(1);

    // Fast-forward the debounce
    await vi.runAllTimersAsync();

    // After debounce, commitPendingChanges should have been called
    expect(manager.getPendingCount()).toBe(0);
  });
});
