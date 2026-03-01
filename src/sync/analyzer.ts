/**
 * Feature Analyzer
 *
 * Анализирует изменения из референсных репозиториев и генерирует
 * конкретные предложения по улучшению нашего проекта.
 */

import { RelevantChange, FeatureCategory } from './index.js';

// ============ Type Definitions ============

export interface FeatureGap {
  category: FeatureCategory;
  feature: string;
  description: string;
  foundIn: string[];
  missingInOur: boolean;
  implementationHint: string;
  estimatedEffort: 'small' | 'medium' | 'large';
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  timestamp: string;
  featureGaps: FeatureGap[];
  recommendations: Recommendation[];
  competitorFeatures: CompetitorFeatureMap;
}

export interface Recommendation {
  title: string;
  description: string;
  category: FeatureCategory;
  sourceRepos: string[];
  implementationSteps: string[];
  priority: 'high' | 'medium' | 'low';
  relatedFiles: string[];
}

export interface CompetitorFeatureMap {
  tools: Record<string, string[]>; // tool name -> repos that have it
  providers: Record<string, string[]>;
  commands: Record<string, string[]>;
  hooks: Record<string, string[]>;
}

// ============ Known Features Map ============

// Features we already have
export const OUR_FEATURES = {
  tools: [
    'bash',
    'read',
    'write',
    'edit',
    'multiedit',
    'glob',
    'grep',
    'ls',
    'webfetch',
    'websearch',
    'browser',
    'task',
    'todoread',
    'todowrite',
    'notebook',
    'skill',
    'question',
    'diagnostics',
  ],
  providers: ['sap-ai-core'],
  commands: [
    '/help',
    '/clear',
    '/model',
    '/session',
    '/context',
    '/export',
    '/stats',
    '/alias',
    '/snippet',
    '/template',
    '/cost',
    '/memory',
    '/doctor',
    '/config',
    '/compact',
    '/permission',
    '/mcp',
    '/hook',
  ],
  hooks: ['PreToolUse', 'PostToolUse', 'SessionStart', 'Stop'],
};

// Features from competitors we might want
export const COMPETITOR_FEATURES = {
  'claude-code': {
    tools: [],
    providers: ['anthropic'],
    commands: ['/feature-dev', '/code-review', '/commit', '/plugin-dev:create-plugin'],
    hooks: ['PreToolUse', 'SessionStart', 'Stop'],
    unique: ['Plugin system', '7-phase feature development', 'Confidence scoring'],
  },
  kilocode: {
    tools: ['diagnostics', 'codesearch', 'apply_patch', 'plan'],
    providers: ['openrouter', 'anthropic', 'openai', 'gemini', 'copilot', 'bedrock', 'azure'],
    commands: [],
    hooks: ['PreToolUse', 'PostToolUse'],
    unique: ['Inline autocomplete', 'Browser automation', '500+ models via OpenRouter'],
  },
  cline: {
    tools: [],
    providers: [
      'anthropic',
      'openai',
      'gemini',
      'bedrock',
      'azure',
      'vertex',
      'groq',
      'cerebras',
      'ollama',
      'lmstudio',
      'openrouter',
      'deepseek',
      'mistral',
      'qwen',
    ],
    commands: [],
    hooks: ['PreToolUse', 'PreCompact'],
    unique: ['40+ providers', 'Tree-sitter AST parsing', 'Permission system'],
  },
  aider: {
    tools: [],
    providers: ['anthropic', 'openai', 'gemini', 'bedrock', 'azure', 'ollama'],
    commands: ['/add', '/drop', '/ask', '/architect', '/code', '/diff', '/voice'],
    hooks: [],
    unique: ['RepoMap', 'Multiple edit strategies', 'Voice input', 'Watch mode', 'Architect mode'],
  },
  opencode: {
    tools: ['diagnostics', 'patch', 'sourcegraph'],
    providers: ['anthropic', 'openai', 'gemini', 'azure', 'bedrock', 'vertexai', 'copilot'],
    commands: [],
    hooks: [],
    unique: ['LSP integration', 'Auto-compact at 95%', 'SQLite persistence'],
  },
};

// ============ FeatureAnalyzer Class ============

export class FeatureAnalyzer {
  /**
   * Analyze relevant changes and find feature gaps
   */
  analyzeChanges(changes: RelevantChange[]): AnalysisResult {
    const result: AnalysisResult = {
      timestamp: new Date().toISOString(),
      featureGaps: [],
      recommendations: [],
      competitorFeatures: {
        tools: {},
        providers: {},
        commands: {},
        hooks: {},
      },
    };

    // Build competitor feature map
    this.buildCompetitorFeatureMap(result.competitorFeatures);

    // Find gaps
    result.featureGaps = this.findFeatureGaps(result.competitorFeatures);

    // Generate recommendations based on changes and gaps
    result.recommendations = this.generateRecommendations(changes, result.featureGaps);

    return result;
  }

  /**
   * Build a map of what features each competitor has
   */
  private buildCompetitorFeatureMap(map: CompetitorFeatureMap): void {
    for (const [repo, features] of Object.entries(COMPETITOR_FEATURES)) {
      // Tools
      for (const tool of features.tools) {
        if (!map.tools[tool]) map.tools[tool] = [];
        map.tools[tool].push(repo);
      }

      // Providers
      for (const provider of features.providers) {
        if (!map.providers[provider]) map.providers[provider] = [];
        map.providers[provider].push(repo);
      }

      // Commands
      for (const command of features.commands) {
        if (!map.commands[command]) map.commands[command] = [];
        map.commands[command].push(repo);
      }

      // Hooks
      for (const hook of features.hooks) {
        if (!map.hooks[hook]) map.hooks[hook] = [];
        map.hooks[hook].push(repo);
      }
    }
  }

  /**
   * Find features we're missing compared to competitors
   */
  private findFeatureGaps(competitorMap: CompetitorFeatureMap): FeatureGap[] {
    const gaps: FeatureGap[] = [];

    // Check tools
    for (const [tool, repos] of Object.entries(competitorMap.tools)) {
      if (!OUR_FEATURES.tools.includes(tool)) {
        gaps.push({
          category: 'tool',
          feature: tool,
          description: `Tool "${tool}" is available in competitor projects`,
          foundIn: repos,
          missingInOur: true,
          implementationHint: this.getToolImplementationHint(tool),
          estimatedEffort: this.estimateEffort(tool, 'tool'),
          priority: repos.length >= 2 ? 'high' : 'medium',
        });
      }
    }

    // Check providers
    for (const [provider, repos] of Object.entries(competitorMap.providers)) {
      if (!OUR_FEATURES.providers.includes(provider)) {
        gaps.push({
          category: 'provider',
          feature: provider,
          description: `LLM provider "${provider}" is supported by competitors`,
          foundIn: repos,
          missingInOur: true,
          implementationHint: this.getProviderImplementationHint(provider),
          estimatedEffort: this.estimateEffort(provider, 'provider'),
          priority: repos.length >= 3 ? 'high' : 'medium',
        });
      }
    }

    // Check unique features from each competitor
    for (const [repo, features] of Object.entries(COMPETITOR_FEATURES)) {
      for (const unique of features.unique) {
        gaps.push({
          category: 'other',
          feature: unique,
          description: `Unique feature from ${repo}: ${unique}`,
          foundIn: [repo],
          missingInOur: true,
          implementationHint: `Research ${unique} implementation in ${repo}`,
          estimatedEffort: 'large',
          priority: 'low',
        });
      }
    }

    return gaps;
  }

  /**
   * Get implementation hint for a tool
   */
  private getToolImplementationHint(tool: string): string {
    const hints: Record<string, string> = {
      diagnostics:
        'Integrate with LSP to get code diagnostics. See kilocode/opencode implementation.',
      codesearch: 'Implement semantic code search using tree-sitter or similar AST parsing.',
      apply_patch: 'Add support for applying unified diff patches to files.',
      patch: 'Similar to apply_patch - parse and apply diff patches.',
      sourcegraph: 'Integrate with Sourcegraph API for code intelligence.',
      plan: 'Add a planning tool that creates structured implementation plans.',
    };

    return hints[tool] || `Implement ${tool} tool based on competitor implementations.`;
  }

  /**
   * Get implementation hint for a provider
   */
  private getProviderImplementationHint(provider: string): string {
    const hints: Record<string, string> = {
      openrouter: 'Add OpenRouter support - provides access to 500+ models through single API.',
      gemini: 'Add Google Gemini support using @google/generative-ai package.',
      bedrock: 'Add AWS Bedrock support using @aws-sdk/client-bedrock-runtime.',
      azure: 'Add Azure OpenAI support - similar to OpenAI but with Azure endpoints.',
      vertex: 'Add Google Vertex AI support.',
      groq: 'Add Groq support - fast inference API.',
      ollama: 'Add Ollama support for local models.',
      lmstudio: 'Add LM Studio support for local models.',
      deepseek: 'Add DeepSeek support - Chinese AI provider.',
      mistral: 'Add Mistral AI support.',
      copilot: 'Add GitHub Copilot integration.',
    };

    return hints[provider] || `Add ${provider} provider support.`;
  }

  /**
   * Estimate effort for implementing a feature
   */
  private estimateEffort(feature: string, category: string): 'small' | 'medium' | 'large' {
    // Small effort
    const smallEffort = ['patch', 'apply_patch'];
    if (smallEffort.includes(feature)) return 'small';

    // Large effort
    const largeEffort = ['diagnostics', 'codesearch', 'sourcegraph'];
    if (largeEffort.includes(feature)) return 'large';

    // Providers are generally medium effort
    if (category === 'provider') return 'medium';

    return 'medium';
  }

  /**
   * Generate recommendations based on changes and gaps
   */
  private generateRecommendations(changes: RelevantChange[], gaps: FeatureGap[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // High priority gaps -> recommendations
    const highPriorityGaps = gaps.filter((g) => g.priority === 'high');

    for (const gap of highPriorityGaps) {
      recommendations.push({
        title: `Add ${gap.feature} ${gap.category}`,
        description: gap.description,
        category: gap.category,
        sourceRepos: gap.foundIn,
        implementationSteps: this.getImplementationSteps(gap),
        priority: gap.priority,
        relatedFiles: this.getRelatedFiles(gap),
      });
    }

    // Recent changes that match high-impact categories
    const impactfulChanges = changes.filter(
      (c) => c.priority === 'high' && ['tool', 'provider', 'security', 'hook'].includes(c.type)
    );

    for (const change of impactfulChanges) {
      recommendations.push({
        title: `Review ${change.type} update from ${change.sourceRepo}`,
        description: change.description,
        category: change.type,
        sourceRepos: [change.sourceRepo],
        implementationSteps: [
          `Review changes in ${change.sourceFile}`,
          'Compare with our current implementation',
          'Create implementation plan if beneficial',
          'Write tests before implementing',
        ],
        priority: change.priority,
        relatedFiles: [change.sourceFile],
      });
    }

    return recommendations;
  }

  /**
   * Get implementation steps for a feature gap
   */
  private getImplementationSteps(gap: FeatureGap): string[] {
    const baseSteps = [
      `Research ${gap.feature} implementations in: ${gap.foundIn.join(', ')}`,
      'Design API/interface that fits our architecture',
      'Write unit tests for the new feature',
      'Implement the feature',
      'Add integration tests',
      'Update documentation',
    ];

    if (gap.category === 'provider') {
      return [
        `Add ${gap.feature} to src/providers/`,
        'Implement the Provider interface',
        'Add configuration options',
        'Add to provider registry',
        'Write tests',
        'Update documentation',
      ];
    }

    if (gap.category === 'tool') {
      return [
        `Create src/tool/tools/${gap.feature}.ts`,
        `Create src/tool/tools/${gap.feature}.txt (prompt)`,
        'Implement Tool interface',
        'Register in tool index',
        'Write tests',
        'Update help/documentation',
      ];
    }

    return baseSteps;
  }

  /**
   * Get related files in our codebase for a gap
   */
  private getRelatedFiles(gap: FeatureGap): string[] {
    const categoryPaths: Record<string, string[]> = {
      tool: ['src/tool/', 'src/tool/tools/'],
      provider: ['src/providers/'],
      hook: ['src/hooks/'],
      command: ['src/cli/commands/', 'src/command/'],
      mcp: ['src/mcp/'],
      config: ['src/config/'],
      security: ['src/permission/'],
    };

    return categoryPaths[gap.category] || ['src/'];
  }

  /**
   * Generate markdown report of analysis
   */
  generateReport(result: AnalysisResult): string {
    const lines: string[] = [
      '# Feature Analysis Report',
      '',
      `**Generated:** ${result.timestamp}`,
      '',
      '## Feature Gaps Summary',
      '',
      `| Category | Feature | Found In | Effort | Priority |`,
      `|----------|---------|----------|--------|----------|`,
    ];

    for (const gap of result.featureGaps.slice(0, 20)) {
      // Top 20
      lines.push(
        `| ${gap.category} | ${gap.feature} | ${gap.foundIn.join(', ')} | ${gap.estimatedEffort} | ${gap.priority} |`
      );
    }

    lines.push('', '## Top Recommendations', '');

    for (const rec of result.recommendations.slice(0, 10)) {
      // Top 10
      lines.push(`### ${rec.title}`);
      lines.push(`**Priority:** ${rec.priority}`);
      lines.push(`**Category:** ${rec.category}`);
      lines.push(`**Source:** ${rec.sourceRepos.join(', ')}`);
      lines.push('');
      lines.push('**Steps:**');
      for (const step of rec.implementationSteps) {
        lines.push(`1. ${step}`);
      }
      lines.push('');
    }

    lines.push('## Competitor Feature Comparison', '');
    lines.push('### Providers Support', '');
    lines.push('| Provider | Projects |');
    lines.push('|----------|----------|');

    for (const [provider, repos] of Object.entries(result.competitorFeatures.providers)) {
      const hasIt = OUR_FEATURES.providers.includes(provider) ? ' ✓' : '';
      lines.push(`| ${provider}${hasIt} | ${repos.join(', ')} |`);
    }

    return lines.join('\n');
  }
}

// ============ Singleton Instance ============

let analyzerInstance: FeatureAnalyzer | null = null;

export function getFeatureAnalyzer(): FeatureAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new FeatureAnalyzer();
  }
  return analyzerInstance;
}

// ============ Convenience Functions ============

export function analyzeChanges(changes: RelevantChange[]): AnalysisResult {
  return getFeatureAnalyzer().analyzeChanges(changes);
}

export function generateAnalysisReport(changes: RelevantChange[]): string {
  const result = analyzeChanges(changes);
  return getFeatureAnalyzer().generateReport(result);
}
