/**
 * Repo Clone Tool - Clone git repositories for reference
 */

import { z } from 'zod';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import { defineTool, type ToolResult } from '../index.js';
import { getRepositoryCacheService } from '../../reference/repository-cache.js';

const RepoCloneParamsSchema = z.object({
  repository: z.string().describe('The git repository URL to clone'),
  branch: z.string().optional().describe('Optional branch to checkout'),
});

interface RepoCloneResult {
  path: string;
  cached: boolean;
  message: string;
}

const DESCRIPTION = `Clone a git repository for reference purposes.

Usage:
- Clones a git repository to a local cache directory
- Supports optional branch specification
- Returns the local path to the cloned repository
- Cached repositories are reused on subsequent calls

Example:
- repository: "https://github.com/user/repo.git"
- branch: "main" (optional)`;

/**
 * Execute git clone command
 */
async function gitClone(repository: string, targetPath: string, branch?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = ['clone', '--depth', '1'];
    if (branch) {
      args.push('--branch', branch);
    }
    args.push(repository, targetPath);

    const proc = spawn('git', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';
    proc.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`git clone failed with exit code ${code}: ${stderr}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn git: ${err.message}`));
    });
  });
}

export const repoCloneTool = defineTool<typeof RepoCloneParamsSchema, RepoCloneResult>({
  name: 'repo_clone',
  description: DESCRIPTION,

  parameters: RepoCloneParamsSchema,

  permission: {
    action: 'execute',
    getResource: (params) => `git clone ${params.repository}`,
  },

  async execute(params, _context): Promise<ToolResult<RepoCloneResult>> {
    const { repository, branch } = params;

    try {
      // Get repository cache
      const cache = getRepositoryCacheService();
      if (!cache) {
        return {
          success: false,
          error: 'Repository cache not initialized',
        };
      }

      // Check cache first
      const cached = cache.get(repository, branch);
      if (cached) {
        return {
          success: true,
          data: {
            path: cached.path,
            cached: true,
            message: `Repository already cloned at ${cached.path}`,
          },
        };
      }

      // Get cache path and clone
      const clonePath = cache.getCachePath(repository, branch);

      // Ensure parent directory exists
      await fs.mkdir(clonePath, { recursive: true });

      // Clone the repository
      await gitClone(repository, clonePath, branch);

      // Update cache
      cache.set(repository, clonePath, branch);

      return {
        success: true,
        data: {
          path: clonePath,
          cached: false,
          message: `Successfully cloned ${repository} to ${clonePath}`,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});
