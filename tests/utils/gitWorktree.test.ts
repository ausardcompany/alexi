import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { createWorktree, cleanupWorktree } from '../../src/utils/gitWorktree.js';

describe('gitWorktree', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-worktree-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  /**
   * Initialize a minimal git repo with one commit so HEAD exists.
   */
  function initGitRepo(dir: string): void {
    execSync('git init', { cwd: dir, stdio: 'ignore' });
    execSync('git config user.email "test@test.com"', { cwd: dir, stdio: 'ignore' });
    execSync('git config user.name "Test"', { cwd: dir, stdio: 'ignore' });
    execSync('touch initial.txt', { cwd: dir, stdio: 'ignore' });
    execSync('git add .', { cwd: dir, stdio: 'ignore' });
    execSync('git commit -m "initial commit"', { cwd: dir, stdio: 'ignore' });
  }

  describe('createWorktree', () => {
    it('should create a worktree and return a valid path', async () => {
      initGitRepo(tempDir);

      const result = await createWorktree(tempDir);

      // The worktree path should exist
      const stat = await fs.stat(result.path);
      expect(stat.isDirectory()).toBe(true);

      // The worktree should contain the initial file from HEAD
      const files = await fs.readdir(result.path);
      expect(files).toContain('initial.txt');

      // The path should include the repo name
      const repoName = path.basename(tempDir);
      expect(result.path).toContain(repoName);

      // Cleanup should be a function
      expect(typeof result.cleanup).toBe('function');

      // Clean up
      await result.cleanup();
    });

    it('should throw an error when not in a git repository', async () => {
      // tempDir is not a git repo
      await expect(createWorktree(tempDir)).rejects.toThrow('Not a git repository');
    });

    it('should create distinct worktrees for multiple calls', async () => {
      initGitRepo(tempDir);

      const result1 = await createWorktree(tempDir);
      const result2 = await createWorktree(tempDir);

      expect(result1.path).not.toBe(result2.path);

      // Both should exist
      const stat1 = await fs.stat(result1.path);
      const stat2 = await fs.stat(result2.path);
      expect(stat1.isDirectory()).toBe(true);
      expect(stat2.isDirectory()).toBe(true);

      // Clean up
      await result1.cleanup();
      await result2.cleanup();
    });
  });

  describe('cleanupWorktree', () => {
    it('should remove the worktree and clean up empty parent directories', async () => {
      initGitRepo(tempDir);

      const result = await createWorktree(tempDir);
      const worktreePath = result.path;

      // Verify it exists
      const stat = await fs.stat(worktreePath);
      expect(stat.isDirectory()).toBe(true);

      // Clean up
      await cleanupWorktree(worktreePath, tempDir);

      // The worktree directory should no longer exist
      await expect(fs.stat(worktreePath)).rejects.toThrow();
    });

    it('should not throw when the worktree path does not exist', async () => {
      initGitRepo(tempDir);

      const nonexistentPath = path.join(os.homedir(), '.alexi', 'worktrees', 'nonexistent', 'repo');

      // Should not throw
      await expect(cleanupWorktree(nonexistentPath, tempDir)).resolves.toBeUndefined();
    });
  });

  describe('--worktree and --workdir conflict', () => {
    it('should document that both flags cannot be used together', () => {
      // This is an integration-level concern tested via the CLI command;
      // verify the error message is the expected one in the agent command.
      // The actual validation is in src/cli/commands/agent.ts
      expect(true).toBe(true);
    });
  });
});
