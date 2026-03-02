/**
 * AutoCommitManager
 * Core class that collects file changes and commits them automatically
 * after a debounce window, attributing them to the AI assistant.
 */

import { simpleGit, type SimpleGit } from 'simple-git';
import type { GitConfig } from './config.js';
import { formatCommitMessage, buildAuthorEnv } from './attribution.js';
import { generateCommitMessage, type ChangedFile } from './commitMessage.js';
import { isGitRepo } from './dirtyFiles.js';

const DEBOUNCE_MS = 500;

export interface CommitResult {
  hash: string;
  message: string;
  filesCommitted: string[];
}

export interface AutoCommitManagerOptions {
  workdir: string;
  config: GitConfig;
}

export class AutoCommitManager {
  private workdir: string;
  private config: GitConfig;
  private pendingFiles: Map<string, ChangedFile> = new Map();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private git: SimpleGit;
  private repoChecked: boolean | null = null;
  private lastCommitHash: string | null = null;

  constructor(options: AutoCommitManagerOptions) {
    this.workdir = options.workdir;
    this.config = options.config;
    this.git = simpleGit(this.workdir);
  }

  /**
   * Update config (e.g. from CLI flags after construction)
   */
  updateConfig(partial: Partial<GitConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  /**
   * Called after a write/edit/delete tool succeeds.
   * Queues the file and starts (or resets) the debounce timer.
   */
  onFileChanged(filePath: string, toolName: string, description?: string): void {
    if (!this.config.autoCommits) return;

    this.pendingFiles.set(filePath, { filePath, toolName, description });

    // Reset debounce timer
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      void this.commitPendingChanges();
    }, DEBOUNCE_MS);
  }

  /**
   * Force-commit all pending changes immediately (bypasses debounce).
   * Returns the commit hash, or null if nothing to commit.
   */
  async commitPendingChanges(messageOverride?: string): Promise<CommitResult | null> {
    // Clear any pending debounce timer
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.pendingFiles.size === 0) return null;

    const inRepo = await this.checkIsGitRepo();
    if (!inRepo) return null;

    const files = [...this.pendingFiles.values()];
    this.pendingFiles.clear();

    try {
      // Stage modified/new files; skip any that no longer exist (deleted)
      const filePaths = files.map((f) => f.filePath);
      await this.git.add(filePaths);

      // Check if anything is actually staged
      const status = await this.git.status();
      if (status.staged.length === 0) return null;

      // Generate message
      const rawMessage = messageOverride ?? (await generateCommitMessage(files, this.config));
      const message = formatCommitMessage(rawMessage, this.config);

      // Apply author env if needed
      const authorEnv = buildAuthorEnv(this.config);
      if (authorEnv) {
        process.env['GIT_AUTHOR_NAME'] = authorEnv['GIT_AUTHOR_NAME'];
        process.env['GIT_AUTHOR_EMAIL'] = authorEnv['GIT_AUTHOR_EMAIL'];
      }

      const commitOptions: Record<string, string> = {};
      if (!this.config.commitVerify) {
        commitOptions['--no-verify'] = 'true';
      }

      const result = await this.git.commit(message, undefined, commitOptions);

      if (authorEnv) {
        delete process.env['GIT_AUTHOR_NAME'];
        delete process.env['GIT_AUTHOR_EMAIL'];
      }

      this.lastCommitHash = result.commit;

      return {
        hash: result.commit,
        message,
        filesCommitted: filePaths,
      };
    } catch (err) {
      // Restore pending files so they can be retried
      for (const f of files) {
        this.pendingFiles.set(f.filePath, f);
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`AutoCommit failed: ${msg}`, { cause: err });
    }
  }

  /**
   * Undo the last AI commit (soft reset — keeps changes staged)
   */
  async undoLastCommit(): Promise<void> {
    const inRepo = await this.checkIsGitRepo();
    if (!inRepo) throw new Error('Not a git repository');

    await this.git.reset(['--soft', 'HEAD~1']);
    this.lastCommitHash = null;
  }

  /**
   * Get the hash of the last commit made by this manager
   */
  getLastCommitHash(): string | null {
    return this.lastCommitHash;
  }

  /**
   * Run a raw git command and return stdout
   */
  async runRaw(args: string[]): Promise<string> {
    return this.git.raw(args);
  }

  /**
   * Get recent commits made in this repo
   */
  async getRecentCommits(
    limit = 10
  ): Promise<Array<{ hash: string; message: string; date: string }>> {
    const inRepo = await this.checkIsGitRepo();
    if (!inRepo) return [];

    const log = await this.git.log({ maxCount: limit });
    return log.all.map((entry) => ({
      hash: entry.hash.slice(0, 8),
      message: entry.message,
      date: entry.date,
    }));
  }

  /**
   * Get current git diff (unstaged)
   */
  async getDiff(): Promise<string> {
    const inRepo = await this.checkIsGitRepo();
    if (!inRepo) return '';
    return this.git.diff();
  }

  /**
   * Get count of pending (uncommitted) files queued by this manager
   */
  getPendingCount(): number {
    return this.pendingFiles.size;
  }

  private async checkIsGitRepo(): Promise<boolean> {
    if (this.repoChecked !== null) return this.repoChecked;
    this.repoChecked = await isGitRepo(this.workdir);
    return this.repoChecked;
  }

  /**
   * Flush pending changes synchronously on process exit
   * (best-effort; async commits may not complete)
   */
  destroy(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}

/**
 * Convenience factory
 */
export function createAutoCommitManager(workdir: string, config: GitConfig): AutoCommitManager {
  return new AutoCommitManager({ workdir, config });
}
