/**
 * Git Worktree Utilities
 * Create and manage detached-HEAD worktrees for isolated agent sessions.
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import { randomUUID } from 'crypto';
import { simpleGit } from 'simple-git';

export interface WorktreeResult {
  path: string;
  cleanup: () => Promise<void>;
}

/**
 * Resolve the base directory for alexi worktrees.
 * Uses ~/.alexi/worktrees/
 */
function getWorktreeBaseDir(): string {
  return path.join(os.homedir(), '.alexi', 'worktrees');
}

/**
 * Create a detached-HEAD git worktree for isolated task execution.
 *
 * @param repoRoot - The root of the git repository to create the worktree from
 * @returns The worktree path and a cleanup function
 * @throws If repoRoot is not a git repository
 */
export async function createWorktree(repoRoot: string): Promise<WorktreeResult> {
  const git = simpleGit(repoRoot);

  // Verify this is a git repository
  try {
    await git.revparse(['--git-dir']);
  } catch {
    throw new Error(`Not a git repository: ${repoRoot}`);
  }

  // Generate a unique path: ~/.alexi/worktrees/<uuid>/<repoName>/
  const uuid = randomUUID();
  const repoName = path.basename(repoRoot);
  const worktreePath = path.join(getWorktreeBaseDir(), uuid, repoName);

  // Ensure the parent directory exists
  await fs.mkdir(path.dirname(worktreePath), { recursive: true });

  // Create a detached worktree at HEAD
  await git.raw(['worktree', 'add', '--detach', worktreePath, 'HEAD']);

  return {
    path: worktreePath,
    cleanup: () => cleanupWorktree(worktreePath, repoRoot),
  };
}

/**
 * Remove a git worktree and its parent directories.
 *
 * @param worktreePath - The path of the worktree to remove
 * @param repoRoot - Optional repo root for running git worktree remove (falls back to worktreePath)
 */
export async function cleanupWorktree(worktreePath: string, repoRoot?: string): Promise<void> {
  const git = simpleGit(repoRoot ?? worktreePath);

  try {
    await git.raw(['worktree', 'remove', '--force', worktreePath]);
  } catch {
    // If git worktree remove fails, attempt manual cleanup
    try {
      await fs.rm(worktreePath, { recursive: true, force: true });
    } catch {
      // Silently ignore - best effort cleanup
    }
  }

  // Remove empty parent directories up to the worktrees base dir
  const baseDir = getWorktreeBaseDir();
  let dir = path.dirname(worktreePath);
  while (dir !== baseDir && dir.startsWith(baseDir)) {
    try {
      const entries = await fs.readdir(dir);
      if (entries.length === 0) {
        await fs.rmdir(dir);
        dir = path.dirname(dir);
      } else {
        break;
      }
    } catch {
      break;
    }
  }
}
