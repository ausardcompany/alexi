/**
 * Reference Service - Manages external repository references
 *
 * This service enables tools to access external codebases safely through
 * configured references (local directories or git repositories).
 */

import * as path from 'path';
import * as os from 'os';
import { createHash } from 'crypto';

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

// ============ Reference Normalization ============

/**
 * Normalized reference with consistent structure
 * Based on opencode refactor(reference): normalize config entries
 */
export interface NormalizedReference {
  id: string;
  name: string;
  kind: 'git' | 'local';
  resolvedPath?: string;
  repository?: string;
  branch?: string;
  alias: string;
  description: string;
  metadata: Record<string, unknown>;
}

export class ReferenceNormalizationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ReferenceNormalizationError';
  }
}

/**
 * Generate a unique ID for a reference
 */
function generateReferenceId(name: string, entry: ReferenceEntry): string {
  const hash = createHash('sha256');
  const source = entry.kind === 'git' ? entry.repository : entry.path;
  hash.update(`${entry.kind}:${source || name}`);
  return hash.digest('hex').slice(0, 12);
}

/**
 * Derive an alias from a path or repository URL
 */
function deriveAlias(entry: ReferenceEntry, name: string): string {
  if (entry.kind === 'local' && entry.path) {
    const segments = entry.path.split(/[\/\\]/);
    const lastSegment = segments[segments.length - 1] || name;
    return lastSegment.replace(/\.[^.]+$/, ''); // Remove extension
  }
  
  if (entry.kind === 'git' && entry.repository) {
    // Extract repo name from URL (e.g., "owner/repo" from "https://github.com/owner/repo")
    const match = entry.repository.match(/([^\/]+\/[^\/]+?)(?:\.git)?$/);
    if (match) {
      return match[1];
    }
  }
  
  return name;
}

/**
 * Normalize reference config entries for consistent handling
 * Based on opencode refactor(reference): normalize config entries
 */
export function normalizeReferenceConfig(
  name: string,
  entry: ReferenceEntry,
  baseDir: string
): NormalizedReference {
  try {
    const id = generateReferenceId(name, entry);
    
    // Resolve path for local references
    let resolvedPath: string | undefined;
    if (entry.kind === 'local' && entry.path) {
      if (entry.path.startsWith('~/')) {
        resolvedPath = path.join(os.homedir(), entry.path.slice(2));
      } else if (path.isAbsolute(entry.path)) {
        resolvedPath = entry.path;
      } else {
        resolvedPath = path.resolve(baseDir, entry.path);
      }
    }
    
    // Generate alias if not provided
    const alias = deriveAlias(entry, name);
    
    // Generate description
    const description =
      entry.kind === 'local'
        ? `Local reference to ${entry.path || name}`
        : `Git repository ${entry.repository || name}${entry.branch ? ` (${entry.branch})` : ''}`;
    
    return {
      id,
      name,
      kind: entry.kind,
      resolvedPath,
      repository: entry.repository,
      branch: entry.branch,
      alias,
      description,
      metadata: {},
    };
  } catch (error) {
    throw new ReferenceNormalizationError(
      `Failed to normalize reference '${name}': ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    );
  }
}

/**
 * Normalize all references in a config
 */
export function normalizeAllReferences(
  references: Record<string, ReferenceEntry>,
  baseDir: string
): Record<string, NormalizedReference> {
  const normalized: Record<string, NormalizedReference> = {};
  
  for (const [name, entry] of Object.entries(references)) {
    try {
      normalized[name] = normalizeReferenceConfig(name, entry, baseDir);
    } catch (error) {
      console.warn(`Failed to normalize reference '${name}':`, error);
      // Continue with other references
    }
  }
  
  return normalized;
}

