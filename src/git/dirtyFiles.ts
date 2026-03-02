/**
 * Dirty Files Handler
 * Commits pre-existing dirty (modified/untracked) files before AI edits begin
 * so AI changes are isolated in their own commits.
 */

import { simpleGit, type SimpleGit } from 'simple-git';
import type { GitConfig } from './config.js';
import { formatCommitMessage } from './attribution.js';
import { buildAuthorEnv } from './attribution.js';

export interface DirtyFilesResult {
  committed: boolean;
  hash?: string;
  filesCommitted: string[];
  skipped: boolean;
  reason?: string;
}

/**
 * Check if workdir is inside a git repo
 */
export async function isGitRepo(workdir: string): Promise<boolean> {
  try {
    const git: SimpleGit = simpleGit(workdir);
    await git.revparse(['--git-dir']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get list of dirty files (modified tracked + untracked non-ignored)
 */
export async function getDirtyFiles(workdir: string): Promise<string[]> {
  const git: SimpleGit = simpleGit(workdir);
  const status = await git.status();

  const dirty: string[] = [
    ...status.modified,
    ...status.not_added, // untracked
    ...status.deleted,
    ...status.renamed.map((r) => r.to),
    ...status.created,
  ];

  // Deduplicate
  return [...new Set(dirty)];
}

/**
 * Commit pre-existing dirty files before AI work begins.
 * Returns info about what was committed (or skipped).
 */
export async function commitDirtyFiles(
  workdir: string,
  config: GitConfig
): Promise<DirtyFilesResult> {
  if (!config.dirtyCommits) {
    return { committed: false, filesCommitted: [], skipped: true, reason: 'dirtyCommits disabled' };
  }

  const inRepo = await isGitRepo(workdir);
  if (!inRepo) {
    return { committed: false, filesCommitted: [], skipped: true, reason: 'not a git repository' };
  }

  const dirtyFiles = await getDirtyFiles(workdir);
  if (dirtyFiles.length === 0) {
    return { committed: false, filesCommitted: [], skipped: true, reason: 'no dirty files' };
  }

  const git: SimpleGit = simpleGit(workdir);

  // Stage all dirty files
  await git.add('.');

  const rawMessage = 'chore: save uncommitted changes before ai session';
  const message = formatCommitMessage(rawMessage, config);

  const commitOptions: Record<string, string> = {};
  const authorEnv = buildAuthorEnv(config);
  if (authorEnv) {
    // simple-git doesn't directly support env overrides per-call;
    // set them on the git instance options instead via environment
    process.env['GIT_AUTHOR_NAME'] = authorEnv['GIT_AUTHOR_NAME'];
    process.env['GIT_AUTHOR_EMAIL'] = authorEnv['GIT_AUTHOR_EMAIL'];
  }

  if (!config.commitVerify) {
    commitOptions['--no-verify'] = 'true';
  }

  const result = await git.commit(message, undefined, commitOptions);

  if (authorEnv) {
    delete process.env['GIT_AUTHOR_NAME'];
    delete process.env['GIT_AUTHOR_EMAIL'];
  }

  return {
    committed: true,
    hash: result.commit,
    filesCommitted: dirtyFiles,
    skipped: false,
  };
}
