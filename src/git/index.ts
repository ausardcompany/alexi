/**
 * Git Module
 * Auto-commit AI-assisted changes with attribution
 */

export type { GitConfig } from './config.js';
export { DEFAULT_GIT_CONFIG, loadGitConfig, saveGitConfig } from './config.js';

export {
  buildAttributionTrailers,
  appendTrailers,
  buildAuthorEnv,
  formatCommitMessage,
} from './attribution.js';

export type { ChangedFile } from './commitMessage.js';
export { generateCommitMessage, buildHeuristicMessage } from './commitMessage.js';

export type { DirtyFilesResult } from './dirtyFiles.js';
export { isGitRepo, getDirtyFiles, commitDirtyFiles } from './dirtyFiles.js';

export type { CommitResult, AutoCommitManagerOptions } from './autoCommit.js';
export { AutoCommitManager, createAutoCommitManager } from './autoCommit.js';
