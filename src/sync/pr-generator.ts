/**
 * PR Generator
 *
 * Генерирует Pull Requests с предложениями по улучшению проекта
 * на основе анализа изменений в референсных репозиториях.
 */

import { execSync } from 'child_process';
import { RelevantChange, SyncReport } from './index.js';
import { AnalysisResult, Recommendation, FeatureGap } from './analyzer.js';

// ============ Type Definitions ============

export interface PRTemplate {
  title: string;
  body: string;
  labels: string[];
  branch: string;
}

export interface PRGeneratorOptions {
  dryRun?: boolean;
  autoCreate?: boolean;
  baseBranch?: string;
}

export interface GeneratedPR {
  type: 'feature' | 'improvement' | 'sync';
  template: PRTemplate;
  created: boolean;
  url?: string;
  error?: string;
}

// ============ Constants ============

const DEFAULT_BASE_BRANCH = 'master';
const PR_LABELS = {
  feature: ['enhancement', 'auto-sync'],
  improvement: ['improvement', 'auto-sync'],
  sync: ['sync', 'auto-generated'],
  provider: ['provider', 'enhancement'],
  tool: ['tool', 'enhancement'],
  security: ['security', 'high-priority'],
};

// ============ PRGenerator Class ============

export class PRGenerator {
  private baseBranch: string;
  private dryRun: boolean;

  constructor(options?: PRGeneratorOptions) {
    this.baseBranch = options?.baseBranch || DEFAULT_BASE_BRANCH;
    this.dryRun = options?.dryRun ?? true;
  }

  /**
   * Generate PR from sync report
   */
  generateFromSyncReport(report: SyncReport): PRTemplate | null {
    if (report.changes.length === 0) {
      return null;
    }

    const highPriority = report.changes.filter((c) => c.priority === 'high');
    const mediumPriority = report.changes.filter((c) => c.priority === 'medium');

    const title = this.generateTitle(report);
    const body = this.generateSyncReportBody(report, highPriority, mediumPriority);
    const branch = this.generateBranchName('sync', report.generatedAt);

    return {
      title,
      body,
      labels: PR_LABELS.sync,
      branch,
    };
  }

  /**
   * Generate PR from feature gap
   */
  generateFromFeatureGap(gap: FeatureGap): PRTemplate {
    const title = `feat: add ${gap.feature} ${gap.category}`;
    const body = this.generateFeatureGapBody(gap);
    const branch = this.generateBranchName('feature', gap.feature);

    return {
      title,
      body,
      labels: [...PR_LABELS.feature, gap.category],
      branch,
    };
  }

  /**
   * Generate PR from recommendation
   */
  generateFromRecommendation(recommendation: Recommendation): PRTemplate {
    const title = `feat: ${recommendation.title.toLowerCase()}`;
    const body = this.generateRecommendationBody(recommendation);
    const branch = this.generateBranchName(
      'feature',
      recommendation.title.replace(/\s+/g, '-').toLowerCase()
    );

    return {
      title,
      body,
      labels: [...PR_LABELS.feature, recommendation.category],
      branch,
    };
  }

  /**
   * Generate title for sync PR
   */
  private generateTitle(report: SyncReport): string {
    const date = new Date(report.generatedAt).toISOString().split('T')[0];
    return `sync: update from reference repositories (${date})`;
  }

  /**
   * Generate branch name
   */
  private generateBranchName(type: string, identifier: string): string {
    const sanitized = identifier
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .slice(0, 30);

    return `auto/${type}/${sanitized}`;
  }

  /**
   * Generate body for sync report PR
   */
  private generateSyncReportBody(
    report: SyncReport,
    highPriority: RelevantChange[],
    mediumPriority: RelevantChange[]
  ): string {
    const lines: string[] = [
      '## Sync Report',
      '',
      `This PR was auto-generated based on changes detected in reference repositories.`,
      '',
      '### Summary',
      '',
      `- **Repositories checked:** ${report.repositoriesChecked}/${report.totalRepositories}`,
      `- **New changes found:** ${report.newChangesFound}`,
      `- **Generated at:** ${report.generatedAt}`,
      '',
    ];

    if (highPriority.length > 0) {
      lines.push('### High Priority Changes', '');
      lines.push('These changes should be reviewed and potentially implemented:', '');

      for (const change of highPriority) {
        lines.push(`#### [${change.type.toUpperCase()}] ${change.sourceRepo}`);
        lines.push(`- **File:** \`${change.sourceFile}\``);
        lines.push(`- **Description:** ${change.description}`);
        lines.push(`- **Suggested Action:** ${change.suggestedAction}`);
        lines.push('');
      }
    }

    if (mediumPriority.length > 0) {
      lines.push('### Medium Priority Changes', '');

      for (const change of mediumPriority) {
        lines.push(`- **[${change.type}]** ${change.sourceRepo}: ${change.description}`);
      }
      lines.push('');
    }

    if (report.errors.length > 0) {
      lines.push('### Errors During Sync', '');
      for (const error of report.errors) {
        lines.push(`- ${error}`);
      }
      lines.push('');
    }

    lines.push(
      '---',
      '',
      '> This PR was automatically generated by the sync system.',
      '> Review the changes and merge if appropriate.'
    );

    return lines.join('\n');
  }

  /**
   * Generate body for feature gap PR
   */
  private generateFeatureGapBody(gap: FeatureGap): string {
    const lines: string[] = [
      '## Feature Gap Analysis',
      '',
      `This PR proposes adding the **${gap.feature}** ${gap.category}.`,
      '',
      '### Details',
      '',
      `- **Category:** ${gap.category}`,
      `- **Feature:** ${gap.feature}`,
      `- **Found in:** ${gap.foundIn.join(', ')}`,
      `- **Estimated Effort:** ${gap.estimatedEffort}`,
      `- **Priority:** ${gap.priority}`,
      '',
      '### Description',
      '',
      gap.description,
      '',
      '### Implementation Hint',
      '',
      gap.implementationHint,
      '',
      '### Checklist',
      '',
      '- [ ] Research implementation in reference repositories',
      '- [ ] Design API/interface',
      '- [ ] Write tests',
      '- [ ] Implement feature',
      '- [ ] Update documentation',
      '',
      '---',
      '',
      '> This PR was automatically generated based on feature gap analysis.',
    ];

    return lines.join('\n');
  }

  /**
   * Generate body for recommendation PR
   */
  private generateRecommendationBody(recommendation: Recommendation): string {
    const lines: string[] = [
      '## Recommendation',
      '',
      recommendation.description,
      '',
      '### Details',
      '',
      `- **Category:** ${recommendation.category}`,
      `- **Priority:** ${recommendation.priority}`,
      `- **Source Repositories:** ${recommendation.sourceRepos.join(', ')}`,
      '',
      '### Implementation Steps',
      '',
    ];

    for (let i = 0; i < recommendation.implementationSteps.length; i++) {
      lines.push(`${i + 1}. ${recommendation.implementationSteps[i]}`);
    }

    lines.push('', '### Related Files', '');
    for (const file of recommendation.relatedFiles) {
      lines.push(`- \`${file}\``);
    }

    lines.push(
      '',
      '---',
      '',
      '> This PR was automatically generated based on competitor analysis.'
    );

    return lines.join('\n');
  }

  /**
   * Create the PR using gh CLI
   */
  async createPR(template: PRTemplate): Promise<GeneratedPR> {
    if (this.dryRun) {
      return {
        type: 'sync',
        template,
        created: false,
        error: 'Dry run mode - PR not created',
      };
    }

    try {
      // Check if gh CLI is available
      try {
        execSync('gh --version', { stdio: 'ignore' });
      } catch {
        throw new Error('GitHub CLI (gh) is not installed');
      }

      // Create branch
      execSync(`git checkout -b ${template.branch}`, { stdio: 'inherit' });

      // Create empty commit to allow PR
      execSync(`git commit --allow-empty -m "${template.title}"`, { stdio: 'inherit' });

      // Push branch
      execSync(`git push -u origin ${template.branch}`, { stdio: 'inherit' });

      // Create PR
      const labelsArg = template.labels.map((l) => `--label "${l}"`).join(' ');
      const prCommand = `gh pr create --title "${template.title}" --body "${template.body.replace(/"/g, '\\"')}" ${labelsArg} --base ${this.baseBranch}`;

      const result = execSync(prCommand, { encoding: 'utf-8' });
      const prUrl = result.trim();

      // Return to base branch
      execSync(`git checkout ${this.baseBranch}`, { stdio: 'inherit' });

      return {
        type: 'sync',
        template,
        created: true,
        url: prUrl,
      };
    } catch (error) {
      // Return to base branch on error
      try {
        execSync(`git checkout ${this.baseBranch}`, { stdio: 'ignore' });
      } catch {
        // Ignore checkout errors
      }

      return {
        type: 'sync',
        template,
        created: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Create GitHub issue instead of PR (for tracking)
   */
  async createIssue(template: PRTemplate): Promise<GeneratedPR> {
    if (this.dryRun) {
      return {
        type: 'feature',
        template,
        created: false,
        error: 'Dry run mode - Issue not created',
      };
    }

    try {
      const labelsArg = template.labels.map((l) => `--label "${l}"`).join(' ');
      const issueCommand = `gh issue create --title "${template.title}" --body "${template.body.replace(/"/g, '\\"')}" ${labelsArg}`;

      const result = execSync(issueCommand, { encoding: 'utf-8' });
      const issueUrl = result.trim();

      return {
        type: 'feature',
        template,
        created: true,
        url: issueUrl,
      };
    } catch (error) {
      return {
        type: 'feature',
        template,
        created: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Generate all PRs/issues from analysis result
   */
  async generateFromAnalysis(
    analysis: AnalysisResult,
    options?: { maxPRs?: number; createIssues?: boolean }
  ): Promise<GeneratedPR[]> {
    const results: GeneratedPR[] = [];
    const maxPRs = options?.maxPRs ?? 5;
    const createIssues = options?.createIssues ?? true;

    // Generate from high priority recommendations
    const highPriorityRecs = analysis.recommendations
      .filter((r) => r.priority === 'high')
      .slice(0, maxPRs);

    for (const rec of highPriorityRecs) {
      const template = this.generateFromRecommendation(rec);

      if (createIssues) {
        const result = await this.createIssue(template);
        results.push(result);
      } else {
        results.push({
          type: 'feature',
          template,
          created: false,
          error: 'Issue creation disabled',
        });
      }
    }

    // Generate from high priority feature gaps
    const highPriorityGaps = analysis.featureGaps
      .filter((g) => g.priority === 'high')
      .slice(0, maxPRs);

    for (const gap of highPriorityGaps) {
      const template = this.generateFromFeatureGap(gap);

      if (createIssues) {
        const result = await this.createIssue(template);
        results.push(result);
      } else {
        results.push({
          type: 'feature',
          template,
          created: false,
          error: 'Issue creation disabled',
        });
      }
    }

    return results;
  }

  /**
   * Generate markdown summary of what would be created
   */
  generatePreview(templates: PRTemplate[]): string {
    const lines: string[] = [
      '# PR Generation Preview',
      '',
      `**Total PRs/Issues to create:** ${templates.length}`,
      '',
    ];

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      lines.push(`## ${i + 1}. ${template.title}`);
      lines.push(`**Branch:** \`${template.branch}\``);
      lines.push(`**Labels:** ${template.labels.join(', ')}`);
      lines.push('');
      lines.push('<details>');
      lines.push('<summary>View PR Body</summary>');
      lines.push('');
      lines.push(template.body);
      lines.push('</details>');
      lines.push('');
    }

    return lines.join('\n');
  }
}

// ============ Singleton Instance ============

let prGeneratorInstance: PRGenerator | null = null;

export function getPRGenerator(options?: PRGeneratorOptions): PRGenerator {
  if (!prGeneratorInstance) {
    prGeneratorInstance = new PRGenerator(options);
  }
  return prGeneratorInstance;
}

export function resetPRGenerator(): void {
  prGeneratorInstance = null;
}
