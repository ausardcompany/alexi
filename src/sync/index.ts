/**
 * Repository Sync System
 *
 * Автономная система для отслеживания обновлений в референсных репозиториях
 * (claude-code, opencode, kilocode, cline, aider) и генерации предложений
 * по улучшению нашего проекта.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

// ============ Type Definitions ============

export interface ReferenceRepository {
  name: string;
  owner: string;
  repo: string;
  branch: string;
  description: string;
  trackPaths: string[]; // Paths to monitor for changes
  language: 'typescript' | 'go' | 'python' | 'shell';
  priority: 'high' | 'medium' | 'low';
}

export interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface FileChange {
  path: string;
  additions: number;
  deletions: number;
  changeType: 'added' | 'modified' | 'removed' | 'renamed';
}

export interface RepositoryUpdate {
  repository: ReferenceRepository;
  commits: CommitInfo[];
  files: FileChange[];
  relevantChanges: RelevantChange[];
  lastChecked: string;
}

export interface RelevantChange {
  type: FeatureCategory;
  description: string;
  sourceRepo: string;
  sourceFile: string;
  sourceSha: string;
  priority: 'high' | 'medium' | 'low';
  suggestedAction: string;
}

export type FeatureCategory =
  | 'tool'
  | 'provider'
  | 'hook'
  | 'skill'
  | 'command'
  | 'mcp'
  | 'ui'
  | 'config'
  | 'security'
  | 'performance'
  | 'other';

export interface SyncState {
  lastFullSync: string;
  repositories: Record<
    string,
    {
      lastSha: string;
      lastChecked: string;
    }
  >;
  pendingChanges: RelevantChange[];
  appliedChanges: string[]; // SHA hashes of applied changes
}

export interface SyncReport {
  generatedAt: string;
  totalRepositories: number;
  repositoriesChecked: number;
  newChangesFound: number;
  changes: RelevantChange[];
  errors: string[];
}

// ============ Constants ============

const CONFIG_DIR = path.join(os.homedir(), '.alexi');
const SYNC_STATE_FILE = path.join(CONFIG_DIR, 'sync-state.json');
const SYNC_REPORT_DIR = path.join(CONFIG_DIR, 'sync-reports');

export const REFERENCE_REPOSITORIES: ReferenceRepository[] = [
  {
    name: 'claude-code',
    owner: 'anthropics',
    repo: 'claude-code',
    branch: 'main',
    description: 'Official Claude Code CLI by Anthropic',
    trackPaths: ['plugins/', 'src/', 'examples/'],
    language: 'typescript',
    priority: 'high',
  },
  {
    name: 'kilocode',
    owner: 'Kilo-Org',
    repo: 'kilocode',
    branch: 'main',
    description: 'Kilo Code - VS Code extension and CLI',
    trackPaths: ['packages/opencode/src/', 'packages/kilo-vscode/src/'],
    language: 'typescript',
    priority: 'high',
  },
  {
    name: 'cline',
    owner: 'cline',
    repo: 'cline',
    branch: 'main',
    description: 'Cline - Autonomous coding agent for VS Code',
    trackPaths: ['src/core/', 'src/services/', 'src/integrations/'],
    language: 'typescript',
    priority: 'high',
  },
  {
    name: 'aider',
    owner: 'aider-ai',
    repo: 'aider',
    branch: 'main',
    description: 'Aider - AI pair programming in terminal',
    trackPaths: ['aider/', 'aider/coders/', 'aider/commands/'],
    language: 'python',
    priority: 'medium',
  },
  {
    name: 'opencode',
    owner: 'opencode-ai',
    repo: 'opencode',
    branch: 'main',
    description: 'OpenCode - Terminal-based AI assistant (archived)',
    trackPaths: ['internal/llm/', 'cmd/'],
    language: 'go',
    priority: 'low',
  },
];

// Feature detection patterns for each category
export const FEATURE_PATTERNS: Record<FeatureCategory, RegExp[]> = {
  tool: [
    /tool[s]?\//i,
    /tools?\.(ts|go|py)$/i,
    /class\s+\w*Tool/i,
    /function\s+\w*(Tool|Execute)/i,
  ],
  provider: [
    /provider[s]?\//i,
    /provider\.(ts|go|py)$/i,
    /(anthropic|openai|gemini|bedrock|azure)/i,
    /class\s+\w*Provider/i,
  ],
  hook: [/hook[s]?\//i, /hook\.(ts|go|py)$/i, /(PreToolUse|PostToolUse|SessionStart)/i],
  skill: [/skill[s]?\//i, /skill\.(ts|go|py)$/i, /class\s+\w*Skill/i],
  command: [/command[s]?\//i, /slash[-_]?command/i, /registerCommand/i, /\.command\s*=/i],
  mcp: [/mcp\//i, /mcp\.(ts|go|py)$/i, /McpServer/i, /\.mcp\.json$/i],
  ui: [/ui\//i, /component[s]?\//i, /\.tsx$/i, /tui\//i],
  config: [/config\//i, /settings?\.(ts|go|py)$/i, /\.config\.(ts|js|json)$/i],
  security: [/security\//i, /permission[s]?\//i, /auth\//i, /(sanitize|escape|validate)/i],
  performance: [
    /cache\//i,
    /compact(ion)?\//i,
    /optimi[sz]e/i,
    /(memory|token)[-_]?(limit|usage)/i,
  ],
  other: [/.*/], // Catch-all
};

// ============ GitHub API Helpers ============

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  files?: Array<{
    filename: string;
    additions: number;
    deletions: number;
    status: string;
  }>;
}

interface GitHubCompareResponse {
  commits: GitHubCommit[];
  files: Array<{
    filename: string;
    additions: number;
    deletions: number;
    status: string;
  }>;
}

async function fetchGitHub<T>(endpoint: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'alexi-sync/1.0',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers,
  });

  if (!response.ok) {
    if (response.status === 403) {
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');
      throw new Error(
        `GitHub API rate limit exceeded. Resets at ${rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toISOString() : 'unknown'}`
      );
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// ============ SyncManager Class ============

export class SyncManager {
  private state: SyncState;
  private githubToken?: string;

  constructor(options?: { githubToken?: string }) {
    this.githubToken = options?.githubToken || process.env.GITHUB_TOKEN;
    this.state = this.loadState();
  }

  /**
   * Load sync state from disk
   */
  private loadState(): SyncState {
    try {
      if (fs.existsSync(SYNC_STATE_FILE)) {
        const content = fs.readFileSync(SYNC_STATE_FILE, 'utf-8');
        return JSON.parse(content) as SyncState;
      }
    } catch {
      // Ignore errors, return default state
    }

    return {
      lastFullSync: '',
      repositories: {},
      pendingChanges: [],
      appliedChanges: [],
    };
  }

  /**
   * Save sync state to disk
   */
  private saveState(): void {
    try {
      if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
      }
      fs.writeFileSync(SYNC_STATE_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch {
      // Silently fail
    }
  }

  /**
   * Get the latest commits from a repository
   */
  async getLatestCommits(
    repo: ReferenceRepository,
    sinceSha?: string
  ): Promise<{ commits: CommitInfo[]; files: FileChange[] }> {
    try {
      if (sinceSha) {
        // Get comparison between commits
        const comparison = await fetchGitHub<GitHubCompareResponse>(
          `/repos/${repo.owner}/${repo.repo}/compare/${sinceSha}...${repo.branch}`,
          this.githubToken
        );

        return {
          commits: comparison.commits.map((c) => ({
            sha: c.sha,
            message: c.commit.message.split('\n')[0], // First line only
            author: c.commit.author.name,
            date: c.commit.author.date,
            url: c.html_url,
          })),
          files: comparison.files.map((f) => ({
            path: f.filename,
            additions: f.additions,
            deletions: f.deletions,
            changeType: f.status as FileChange['changeType'],
          })),
        };
      } else {
        // Get recent commits
        const commits = await fetchGitHub<GitHubCommit[]>(
          `/repos/${repo.owner}/${repo.repo}/commits?sha=${repo.branch}&per_page=20`,
          this.githubToken
        );

        return {
          commits: commits.map((c) => ({
            sha: c.sha,
            message: c.commit.message.split('\n')[0],
            author: c.commit.author.name,
            date: c.commit.author.date,
            url: c.html_url,
          })),
          files: [], // No file changes without comparison
        };
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch commits for ${repo.name}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error }
      );
    }
  }

  /**
   * Detect the category of a file change
   */
  detectCategory(filePath: string, commitMessage: string): FeatureCategory {
    const input = `${filePath} ${commitMessage}`;

    for (const [category, patterns] of Object.entries(FEATURE_PATTERNS)) {
      if (category === 'other') continue;

      for (const pattern of patterns) {
        if (pattern.test(input)) {
          return category as FeatureCategory;
        }
      }
    }

    return 'other';
  }

  /**
   * Filter changes that are relevant to tracked paths
   */
  filterRelevantChanges(
    repo: ReferenceRepository,
    commits: CommitInfo[],
    files: FileChange[]
  ): RelevantChange[] {
    const relevantChanges: RelevantChange[] = [];

    // Filter files that match tracked paths
    const relevantFiles = files.filter((file) =>
      repo.trackPaths.some((trackPath) => file.path.startsWith(trackPath))
    );

    // Group by category and generate suggestions
    for (const file of relevantFiles) {
      const relatedCommit = commits[0]; // Most recent commit

      if (!relatedCommit) continue;

      const category = this.detectCategory(file.path, relatedCommit.message);

      // Skip 'other' category unless significant changes
      if (category === 'other' && file.additions < 50) continue;

      relevantChanges.push({
        type: category,
        description: `${file.changeType}: ${file.path} (${relatedCommit.message})`,
        sourceRepo: `${repo.owner}/${repo.repo}`,
        sourceFile: file.path,
        sourceSha: relatedCommit.sha,
        priority: this.calculatePriority(repo, category, file),
        suggestedAction: this.generateSuggestion(category, file, repo),
      });
    }

    return relevantChanges;
  }

  /**
   * Calculate priority of a change
   */
  private calculatePriority(
    repo: ReferenceRepository,
    category: FeatureCategory,
    file: FileChange
  ): 'high' | 'medium' | 'low' {
    // High priority categories
    if (['tool', 'provider', 'hook', 'security'].includes(category)) {
      return repo.priority === 'high' ? 'high' : 'medium';
    }

    // Large changes are more important
    if (file.additions > 200) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Generate a suggestion for what to do with this change
   */
  private generateSuggestion(
    category: FeatureCategory,
    file: FileChange,
    repo: ReferenceRepository
  ): string {
    const suggestions: Record<FeatureCategory, string> = {
      tool: `Review new tool implementation in ${repo.name} and consider adding similar functionality`,
      provider: `Check for new LLM provider support in ${repo.name}`,
      hook: `Evaluate new hook system features from ${repo.name}`,
      skill: `Review skill implementation patterns from ${repo.name}`,
      command: `Check for new slash commands in ${repo.name}`,
      mcp: `Review MCP integration changes in ${repo.name}`,
      ui: `Review UI/UX improvements in ${repo.name}`,
      config: `Check configuration changes in ${repo.name}`,
      security: `IMPORTANT: Review security-related changes in ${repo.name}`,
      performance: `Review performance optimizations in ${repo.name}`,
      other: `Review changes in ${file.path}`,
    };

    return suggestions[category];
  }

  /**
   * Check a single repository for updates
   */
  async checkRepository(repo: ReferenceRepository): Promise<RepositoryUpdate> {
    const repoKey = `${repo.owner}/${repo.repo}`;
    const lastSha = this.state.repositories[repoKey]?.lastSha;

    const { commits, files } = await this.getLatestCommits(repo, lastSha);

    // Update state with latest SHA
    if (commits.length > 0) {
      this.state.repositories[repoKey] = {
        lastSha: commits[0].sha,
        lastChecked: new Date().toISOString(),
      };
    }

    const relevantChanges = this.filterRelevantChanges(repo, commits, files);

    return {
      repository: repo,
      commits,
      files,
      relevantChanges,
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Run full sync across all repositories
   */
  async sync(_options?: { force?: boolean }): Promise<SyncReport> {
    const report: SyncReport = {
      generatedAt: new Date().toISOString(),
      totalRepositories: REFERENCE_REPOSITORIES.length,
      repositoriesChecked: 0,
      newChangesFound: 0,
      changes: [],
      errors: [],
    };

    for (const repo of REFERENCE_REPOSITORIES) {
      try {
        const update = await this.checkRepository(repo);
        report.repositoriesChecked++;

        // Add new relevant changes
        for (const change of update.relevantChanges) {
          // Skip if already applied
          if (this.state.appliedChanges.includes(change.sourceSha)) {
            continue;
          }

          report.changes.push(change);
          report.newChangesFound++;
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        report.errors.push(
          `${repo.name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Update state
    this.state.lastFullSync = report.generatedAt;
    this.state.pendingChanges = [...this.state.pendingChanges, ...report.changes];
    this.saveState();

    // Save report
    this.saveReport(report);

    return report;
  }

  /**
   * Save sync report to disk
   */
  private saveReport(report: SyncReport): void {
    try {
      if (!fs.existsSync(SYNC_REPORT_DIR)) {
        fs.mkdirSync(SYNC_REPORT_DIR, { recursive: true });
      }

      const filename = `sync-report-${report.generatedAt.replace(/[:.]/g, '-')}.json`;
      const filepath = path.join(SYNC_REPORT_DIR, filename);

      fs.writeFileSync(filepath, JSON.stringify(report, null, 2), 'utf-8');
    } catch {
      // Silently fail
    }
  }

  /**
   * Get pending changes that haven't been reviewed yet
   */
  getPendingChanges(): RelevantChange[] {
    return this.state.pendingChanges;
  }

  /**
   * Mark changes as applied
   */
  markAsApplied(shas: string[]): void {
    this.state.appliedChanges.push(...shas);
    this.state.pendingChanges = this.state.pendingChanges.filter(
      (change) => !shas.includes(change.sourceSha)
    );
    this.saveState();
  }

  /**
   * Get sync state
   */
  getState(): SyncState {
    return this.state;
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report: SyncReport): string {
    const lines: string[] = [
      '# Sync Report',
      '',
      `**Generated:** ${report.generatedAt}`,
      `**Repositories checked:** ${report.repositoriesChecked}/${report.totalRepositories}`,
      `**New changes found:** ${report.newChangesFound}`,
      '',
    ];

    if (report.errors.length > 0) {
      lines.push('## Errors', '');
      for (const error of report.errors) {
        lines.push(`- ${error}`);
      }
      lines.push('');
    }

    if (report.changes.length > 0) {
      // Group by priority
      const highPriority = report.changes.filter((c) => c.priority === 'high');
      const mediumPriority = report.changes.filter((c) => c.priority === 'medium');
      const lowPriority = report.changes.filter((c) => c.priority === 'low');

      if (highPriority.length > 0) {
        lines.push('## High Priority Changes', '');
        for (const change of highPriority) {
          lines.push(`### [${change.type.toUpperCase()}] ${change.sourceRepo}`);
          lines.push(`- **File:** ${change.sourceFile}`);
          lines.push(`- **Description:** ${change.description}`);
          lines.push(`- **Action:** ${change.suggestedAction}`);
          lines.push('');
        }
      }

      if (mediumPriority.length > 0) {
        lines.push('## Medium Priority Changes', '');
        for (const change of mediumPriority) {
          lines.push(`- **[${change.type}]** ${change.sourceRepo}: ${change.description}`);
        }
        lines.push('');
      }

      if (lowPriority.length > 0) {
        lines.push('## Low Priority Changes', '');
        for (const change of lowPriority) {
          lines.push(`- ${change.sourceRepo}: ${change.description}`);
        }
        lines.push('');
      }
    } else {
      lines.push('## No New Changes', '', 'All repositories are up to date.');
    }

    return lines.join('\n');
  }
}

// ============ Singleton Instance ============

let syncManagerInstance: SyncManager | null = null;

export function getSyncManager(options?: { githubToken?: string }): SyncManager {
  if (!syncManagerInstance) {
    syncManagerInstance = new SyncManager(options);
  }
  return syncManagerInstance;
}

export function resetSyncManager(): void {
  syncManagerInstance = null;
}

// ============ Convenience Functions ============

export async function syncRepositories(options?: { githubToken?: string }): Promise<SyncReport> {
  return getSyncManager(options).sync();
}

export function getPendingChanges(): RelevantChange[] {
  return getSyncManager().getPendingChanges();
}
