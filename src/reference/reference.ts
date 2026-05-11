/**
 * Reference Service - Manages external repository references
 * 
 * This service enables tools to access external codebases safely through
 * configured references (local directories or git repositories).
 */

import * as path from 'path';
import * as os from 'os';

export interface ReferenceEntry {
  kind: 'git' | 'local';
  repository?: string;
  branch?: string;
  path?: string;
}

export type ResolvedReference =
  | {
      kind: 'git';
      repository: string;
      branch?: string;
    }
  | {
      kind: 'local';
      path: string;
    };

export interface ReferenceConfig {
  worktree: string;
  directory: string;
  references?: Record<string, ReferenceEntry>;
}

/**
 * Reference Service for managing external repository references
 */
export class ReferenceService {
  private resolvedPaths = new Set<string>();
  private config: ReferenceConfig;

  constructor(config: ReferenceConfig) {
    this.config = config;
  }

  /**
   * Resolve a tilde or relative path to an absolute path
   */
  private referencePath(value: string): string {
    if (value.startsWith('~/')) {
      return path.join(os.homedir(), value.slice(2));
    }
    return path.isAbsolute(value)
      ? value
      : path.resolve(
          this.config.worktree === '/' ? this.config.directory : this.config.worktree,
          value
        );
  }

  /**
   * Resolve a reference entry to a concrete reference
   */
  resolve(name: string, entry: ReferenceEntry): ResolvedReference {
    if (entry.kind === 'local' && entry.path) {
      return { kind: 'local', path: this.referencePath(entry.path) };
    }
    if (entry.kind === 'git' && entry.repository) {
      return { kind: 'git', repository: entry.repository, branch: entry.branch };
    }
    throw new Error(`Invalid reference entry for ${name}`);
  }

  /**
   * Ensure a reference path is materialized (for future git clone support)
   */
  async ensure(searchPath: string): Promise<void> {
    // Mark path as resolved
    if (!this.resolvedPaths.has(searchPath)) {
      this.resolvedPaths.add(searchPath);
    }
    // Future: Materialize git references here
  }

  /**
   * Check if a path is within a configured reference
   */
  contains(searchPath: string): boolean {
    return this.resolvedPaths.has(searchPath);
  }

  /**
   * Get the system prompt for a reference
   */
  getPrompt(name: string, reference: ResolvedReference): string {
    if (reference.kind === 'local') {
      return [
        `You are Scout reference @${name}. This reference points to a local directory outside or alongside the current workspace.`,
        `Local directory: ${reference.path}`,
        `When invoked, inspect this directory as the primary reference source. Do not edit files.`,
      ].join('\n\n');
    }

    return [
      `You are Scout reference @${name}. This reference points to a git repository.`,
      `Repository: ${reference.repository}`,
      reference.branch ? `Branch: ${reference.branch}` : '',
      `When invoked, clone and inspect this repository as the primary reference source. Do not edit files.`,
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  /**
   * Get all configured references
   */
  getReferences(): Record<string, ReferenceEntry> {
    return this.config.references || {};
  }
}

// Global reference service instance
let globalReferenceService: ReferenceService | null = null;

/**
 * Initialize the global reference service
 */
export function initReferenceService(config: ReferenceConfig): ReferenceService {
  globalReferenceService = new ReferenceService(config);
  return globalReferenceService;
}

/**
 * Get the global reference service instance
 */
export function getReferenceService(): ReferenceService | null {
  return globalReferenceService;
}
