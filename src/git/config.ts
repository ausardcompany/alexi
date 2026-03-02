/**
 * Git Configuration
 * Defines GitConfig interface and load/save helpers
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export interface GitConfig {
  autoCommits: boolean;
  dirtyCommits: boolean;
  commitVerify: boolean;
  attribution: {
    style: 'none' | 'author' | 'co-authored-by' | 'committer';
    name: string;
    email: string;
  };
  commitMessage: {
    useAI: boolean;
    model?: string;
    conventional: boolean;
  };
}

export const DEFAULT_GIT_CONFIG: GitConfig = {
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

const CONFIG_FILE_NAME = '.alexi-git.json';

/**
 * Load git config from workdir, falling back to defaults
 */
export async function loadGitConfig(workdir: string): Promise<GitConfig> {
  const configPath = path.join(workdir, CONFIG_FILE_NAME);
  try {
    const raw = await fs.readFile(configPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<GitConfig>;
    return mergeConfig(DEFAULT_GIT_CONFIG, parsed);
  } catch {
    // File not found or parse error — use defaults
    return {
      ...DEFAULT_GIT_CONFIG,
      attribution: { ...DEFAULT_GIT_CONFIG.attribution },
      commitMessage: { ...DEFAULT_GIT_CONFIG.commitMessage },
    };
  }
}

/**
 * Save git config to workdir
 */
export async function saveGitConfig(workdir: string, config: GitConfig): Promise<void> {
  const configPath = path.join(workdir, CONFIG_FILE_NAME);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

/**
 * Deep-merge partial config over defaults
 */
function mergeConfig(defaults: GitConfig, partial: Partial<GitConfig>): GitConfig {
  return {
    autoCommits: partial.autoCommits ?? defaults.autoCommits,
    dirtyCommits: partial.dirtyCommits ?? defaults.dirtyCommits,
    commitVerify: partial.commitVerify ?? defaults.commitVerify,
    attribution: {
      ...defaults.attribution,
      ...(partial.attribution ?? {}),
    },
    commitMessage: {
      ...defaults.commitMessage,
      ...(partial.commitMessage ?? {}),
    },
  };
}
