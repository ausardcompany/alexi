/**
 * Tests for Repository Sync System
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SyncManager,
  REFERENCE_REPOSITORIES,
  FEATURE_PATTERNS,
  RelevantChange,
  FeatureCategory,
} from '../index.js';
import { FeatureAnalyzer, OUR_FEATURES, COMPETITOR_FEATURES } from '../analyzer.js';
import { PRGenerator, PRTemplate } from '../pr-generator.js';

// ============ SyncManager Tests ============

describe('SyncManager', () => {
  let syncManager: SyncManager;

  beforeEach(() => {
    syncManager = new SyncManager();
  });

  describe('Reference Repositories', () => {
    it('should have all expected reference repositories', () => {
      const repoNames = REFERENCE_REPOSITORIES.map((r) => r.name);

      expect(repoNames).toContain('claude-code');
      expect(repoNames).toContain('kilocode');
      expect(repoNames).toContain('cline');
      expect(repoNames).toContain('aider');
      expect(repoNames).toContain('opencode');
    });

    it('should have valid repository configurations', () => {
      for (const repo of REFERENCE_REPOSITORIES) {
        expect(repo.owner).toBeTruthy();
        expect(repo.repo).toBeTruthy();
        expect(repo.branch).toBeTruthy();
        expect(repo.trackPaths.length).toBeGreaterThan(0);
        expect(['typescript', 'go', 'python', 'shell']).toContain(repo.language);
        expect(['high', 'medium', 'low']).toContain(repo.priority);
      }
    });
  });

  describe('Feature Pattern Detection', () => {
    it('should detect tool changes', () => {
      const category = syncManager.detectCategory('src/tools/bash.ts', 'Add bash tool');
      expect(category).toBe('tool');
    });

    it('should detect provider changes', () => {
      const category = syncManager.detectCategory(
        'src/provider/anthropic.ts',
        'Update anthropic provider'
      );
      expect(category).toBe('provider');
    });

    it('should detect hook changes', () => {
      const category = syncManager.detectCategory('src/hooks/PreToolUse.ts', 'Add PreToolUse hook');
      expect(category).toBe('hook');
    });

    it('should detect MCP changes', () => {
      const category = syncManager.detectCategory('src/mcp/server.ts', 'Update MCP server');
      expect(category).toBe('mcp');
    });

    it('should detect security changes', () => {
      const category = syncManager.detectCategory(
        'src/security/sanitize.ts',
        'Add input sanitization'
      );
      expect(category).toBe('security');
    });

    it('should detect command changes', () => {
      const category = syncManager.detectCategory(
        'src/commands/help.ts',
        'registerCommand for help'
      );
      expect(category).toBe('command');
    });

    it('should return other for unknown patterns', () => {
      const category = syncManager.detectCategory('random/file.txt', 'random change');
      expect(category).toBe('other');
    });
  });

  describe('Feature Patterns', () => {
    it('should have patterns for all categories', () => {
      const categories: FeatureCategory[] = [
        'tool',
        'provider',
        'hook',
        'skill',
        'command',
        'mcp',
        'ui',
        'config',
        'security',
        'performance',
        'other',
      ];

      for (const category of categories) {
        expect(FEATURE_PATTERNS[category]).toBeDefined();
        expect(FEATURE_PATTERNS[category].length).toBeGreaterThan(0);
      }
    });

    it('should match tool patterns correctly', () => {
      const toolPatterns = FEATURE_PATTERNS.tool;
      // Use realistic paths that would match the patterns
      const testPaths = ['tools/bash.ts', 'tool/edit.ts', 'BashTool.ts', 'tools/execute.ts'];

      for (const path of testPaths) {
        const matches = toolPatterns.some((p) => p.test(path));
        expect(matches).toBe(true);
      }
    });

    it('should match provider patterns correctly', () => {
      const providerPatterns = FEATURE_PATTERNS.provider;
      const testPaths = ['providers/openai.ts', 'anthropic-client.ts', 'GeminiProvider.ts'];

      for (const path of testPaths) {
        const matches = providerPatterns.some((p) => p.test(path));
        expect(matches).toBe(true);
      }
    });
  });

  describe('State Management', () => {
    it('should return initial empty state', () => {
      const state = syncManager.getState();

      expect(state).toBeDefined();
      expect(state.repositories).toBeDefined();
      expect(state.pendingChanges).toBeDefined();
      expect(state.appliedChanges).toBeDefined();
    });
  });

  describe('Markdown Report Generation', () => {
    it('should generate valid markdown report', () => {
      const report = {
        generatedAt: new Date().toISOString(),
        totalRepositories: 5,
        repositoriesChecked: 5,
        newChangesFound: 2,
        changes: [
          {
            type: 'tool' as FeatureCategory,
            description: 'Add new tool',
            sourceRepo: 'test/repo',
            sourceFile: 'tools/new.ts',
            sourceSha: 'abc123',
            priority: 'high' as const,
            suggestedAction: 'Review and implement',
          },
        ],
        errors: [],
      };

      const markdown = syncManager.generateMarkdownReport(report);

      expect(markdown).toContain('# Sync Report');
      expect(markdown).toContain('**Generated:**');
      expect(markdown).toContain('High Priority Changes');
      expect(markdown).toContain('[TOOL]');
    });

    it('should handle empty changes', () => {
      const report = {
        generatedAt: new Date().toISOString(),
        totalRepositories: 5,
        repositoriesChecked: 5,
        newChangesFound: 0,
        changes: [],
        errors: [],
      };

      const markdown = syncManager.generateMarkdownReport(report);

      expect(markdown).toContain('No New Changes');
      expect(markdown).toContain('All repositories are up to date');
    });

    it('should include errors section when errors exist', () => {
      const report = {
        generatedAt: new Date().toISOString(),
        totalRepositories: 5,
        repositoriesChecked: 3,
        newChangesFound: 0,
        changes: [],
        errors: ['Failed to fetch repo1', 'Rate limit exceeded'],
      };

      const markdown = syncManager.generateMarkdownReport(report);

      expect(markdown).toContain('## Errors');
      expect(markdown).toContain('Failed to fetch repo1');
      expect(markdown).toContain('Rate limit exceeded');
    });
  });
});

// ============ FeatureAnalyzer Tests ============

describe('FeatureAnalyzer', () => {
  let analyzer: FeatureAnalyzer;

  beforeEach(() => {
    analyzer = new FeatureAnalyzer();
  });

  describe('Our Features', () => {
    it('should have all expected tools', () => {
      expect(OUR_FEATURES.tools).toContain('bash');
      expect(OUR_FEATURES.tools).toContain('read');
      expect(OUR_FEATURES.tools).toContain('write');
      expect(OUR_FEATURES.tools).toContain('edit');
      expect(OUR_FEATURES.tools).toContain('glob');
      expect(OUR_FEATURES.tools).toContain('grep');
    });

    it('should have all expected commands', () => {
      expect(OUR_FEATURES.commands).toContain('/help');
      expect(OUR_FEATURES.commands).toContain('/model');
      expect(OUR_FEATURES.commands).toContain('/session');
      expect(OUR_FEATURES.commands).toContain('/export');
    });

    it('should have all expected hooks', () => {
      expect(OUR_FEATURES.hooks).toContain('PreToolUse');
      expect(OUR_FEATURES.hooks).toContain('PostToolUse');
    });
  });

  describe('Competitor Features', () => {
    it('should have claude-code features', () => {
      expect(COMPETITOR_FEATURES['claude-code']).toBeDefined();
      expect(COMPETITOR_FEATURES['claude-code'].unique).toContain('Plugin system');
    });

    it('should have kilocode features', () => {
      expect(COMPETITOR_FEATURES['kilocode']).toBeDefined();
      expect(COMPETITOR_FEATURES['kilocode'].providers).toContain('openrouter');
    });

    it('should have cline features', () => {
      expect(COMPETITOR_FEATURES['cline']).toBeDefined();
      expect(COMPETITOR_FEATURES['cline'].providers.length).toBeGreaterThan(10);
    });

    it('should have aider features', () => {
      expect(COMPETITOR_FEATURES['aider']).toBeDefined();
      expect(COMPETITOR_FEATURES['aider'].unique).toContain('RepoMap');
    });
  });

  describe('Feature Analysis', () => {
    it('should analyze changes and find feature gaps', () => {
      const changes: RelevantChange[] = [
        {
          type: 'tool',
          description: 'Add diagnostics tool',
          sourceRepo: 'kilocode',
          sourceFile: 'tools/diagnostics.ts',
          sourceSha: 'abc123',
          priority: 'high',
          suggestedAction: 'Review implementation',
        },
      ];

      const result = analyzer.analyzeChanges(changes);

      expect(result.timestamp).toBeDefined();
      expect(result.featureGaps).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.competitorFeatures).toBeDefined();
    });

    it('should find provider gaps', () => {
      const result = analyzer.analyzeChanges([]);

      // We should be missing some providers that competitors have
      const providerGaps = result.featureGaps.filter((g) => g.category === 'provider');

      expect(providerGaps.length).toBeGreaterThan(0);

      // Should find openrouter as a gap
      const openrouterGap = providerGaps.find((g) => g.feature === 'openrouter');
      expect(openrouterGap).toBeDefined();
    });

    it('should find tool gaps', () => {
      const result = analyzer.analyzeChanges([]);

      const toolGaps = result.featureGaps.filter((g) => g.category === 'tool');

      // Should find apply_patch as a gap (we don't have it)
      const applyPatchGap = toolGaps.find((g) => g.feature === 'apply_patch');
      expect(applyPatchGap).toBeDefined();
    });
  });

  describe('Report Generation', () => {
    it('should generate valid markdown report', () => {
      const result = analyzer.analyzeChanges([]);
      const report = analyzer.generateReport(result);

      expect(report).toContain('# Feature Analysis Report');
      expect(report).toContain('## Feature Gaps Summary');
      expect(report).toContain('## Competitor Feature Comparison');
    });
  });
});

// ============ PRGenerator Tests ============

describe('PRGenerator', () => {
  let generator: PRGenerator;

  beforeEach(() => {
    generator = new PRGenerator({ dryRun: true });
  });

  describe('PR Template Generation', () => {
    it('should generate PR from sync report', () => {
      const report = {
        generatedAt: '2024-01-15T10:00:00.000Z',
        totalRepositories: 5,
        repositoriesChecked: 5,
        newChangesFound: 2,
        changes: [
          {
            type: 'tool' as FeatureCategory,
            description: 'Add new tool',
            sourceRepo: 'test/repo',
            sourceFile: 'tools/new.ts',
            sourceSha: 'abc123',
            priority: 'high' as const,
            suggestedAction: 'Review and implement',
          },
        ],
        errors: [],
      };

      const template = generator.generateFromSyncReport(report);

      expect(template).not.toBeNull();
      expect(template?.title).toContain('sync:');
      expect(template?.body).toContain('## Sync Report');
      expect(template?.labels).toContain('sync');
      expect(template?.labels).toContain('auto-generated');
      expect(template?.branch).toContain('auto/sync/');
    });

    it('should return null for empty sync report', () => {
      const report = {
        generatedAt: new Date().toISOString(),
        totalRepositories: 5,
        repositoriesChecked: 5,
        newChangesFound: 0,
        changes: [],
        errors: [],
      };

      const template = generator.generateFromSyncReport(report);

      expect(template).toBeNull();
    });

    it('should generate PR from feature gap', () => {
      const gap = {
        category: 'provider' as FeatureCategory,
        feature: 'openrouter',
        description: 'OpenRouter provider support',
        foundIn: ['kilocode', 'cline'],
        missingInOur: true,
        implementationHint: 'Add OpenRouter support',
        estimatedEffort: 'medium' as const,
        priority: 'high' as const,
      };

      const template = generator.generateFromFeatureGap(gap);

      expect(template.title).toContain('openrouter');
      expect(template.body).toContain('## Feature Gap Analysis');
      expect(template.labels).toContain('provider');
      expect(template.branch).toContain('feature');
    });

    it('should generate PR from recommendation', () => {
      const recommendation = {
        title: 'Add OpenRouter Provider',
        description: 'Support 500+ models via OpenRouter',
        category: 'provider' as FeatureCategory,
        sourceRepos: ['kilocode', 'cline'],
        implementationSteps: ['Step 1', 'Step 2'],
        priority: 'high' as const,
        relatedFiles: ['src/providers/'],
      };

      const template = generator.generateFromRecommendation(recommendation);

      expect(template.title).toContain('add openrouter provider');
      expect(template.body).toContain('## Recommendation');
      expect(template.body).toContain('Step 1');
    });
  });

  describe('Preview Generation', () => {
    it('should generate preview markdown', () => {
      const templates: PRTemplate[] = [
        {
          title: 'Test PR 1',
          body: 'Body 1',
          labels: ['label1'],
          branch: 'feature/test-1',
        },
        {
          title: 'Test PR 2',
          body: 'Body 2',
          labels: ['label2'],
          branch: 'feature/test-2',
        },
      ];

      const preview = generator.generatePreview(templates);

      expect(preview).toContain('# PR Generation Preview');
      expect(preview).toContain('Test PR 1');
      expect(preview).toContain('Test PR 2');
      expect(preview).toContain('**Total PRs/Issues to create:** 2');
    });
  });

  describe('Branch Name Generation', () => {
    it('should generate valid branch names', () => {
      const gap = {
        category: 'tool' as FeatureCategory,
        feature: 'Some Complex Feature Name!@#',
        description: 'Test',
        foundIn: ['test'],
        missingInOur: true,
        implementationHint: 'Test',
        estimatedEffort: 'medium' as const,
        priority: 'high' as const,
      };

      const template = generator.generateFromFeatureGap(gap);

      // Branch should not contain special characters
      expect(template.branch).not.toMatch(/[!@#$%^&*()]/);
      expect(template.branch).toMatch(/^auto\/feature\//);
    });
  });
});

// ============ Integration Tests ============

describe('Sync System Integration', () => {
  it('should work end-to-end in dry run mode', async () => {
    // SyncManager instance is created to verify it initializes without errors
    const _syncManager = new SyncManager();
    const analyzer = new FeatureAnalyzer();
    const generator = new PRGenerator({ dryRun: true });

    // Simulate some changes
    const mockChanges: RelevantChange[] = [
      {
        type: 'provider',
        description: 'Add Gemini provider',
        sourceRepo: 'cline/cline',
        sourceFile: 'src/providers/gemini.ts',
        sourceSha: 'def456',
        priority: 'high',
        suggestedAction: 'Add Gemini support',
      },
    ];

    // Analyze changes
    const analysis = analyzer.analyzeChanges(mockChanges);

    expect(analysis.featureGaps.length).toBeGreaterThan(0);
    expect(analysis.recommendations.length).toBeGreaterThan(0);

    // Generate PRs (dry run)
    const results = await generator.generateFromAnalysis(analysis, {
      maxPRs: 2,
      createIssues: false, // Don't actually create issues
    });

    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.created).toBe(false);
      expect(result.template).toBeDefined();
    }
  });
});
