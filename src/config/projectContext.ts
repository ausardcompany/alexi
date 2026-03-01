/**
 * Project Context Management System
 * Tracks project-wide context (stack, constraints, guidelines) for consistent AI interactions
 */

import fs from 'fs';
import path from 'path';

export interface ProjectStack {
  language: string;
  framework?: string;
  versions: Record<string, string>;
}

export interface Infrastructure {
  platform: string;
  containerization?: string;
  domains?: string[];
  deployment?: string;
}

export interface QualityRequirements {
  minTestCoverage?: number;
  requireLinting: boolean;
  requireTypes: boolean;
  maxComplexity?: number;
  noTODOs: boolean;
}

export interface CodingStyle {
  indentation: 'spaces' | 'tabs';
  indentSize: number;
  lineLength: number;
  namingConventions: {
    variables: string;
    functions: string;
    classes: string;
    constants: string;
  };
}

export interface ProjectContext {
  name: string;
  description: string;
  stack: ProjectStack;
  infrastructure: Infrastructure;
  quality: QualityRequirements;
  style: CodingStyle;
  architectureInvariants: string[];
  constraints: string[];
  externalDependencies: string[];
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_CONTEXT: ProjectContext = {
  name: 'Untitled Project',
  description: '',
  stack: {
    language: 'TypeScript',
    framework: 'Node.js',
    versions: {
      node: '22.x',
      typescript: '5.x',
    },
  },
  infrastructure: {
    platform: 'docker',
    containerization: 'docker',
  },
  quality: {
    requireLinting: true,
    requireTypes: true,
    noTODOs: true,
  },
  style: {
    indentation: 'spaces',
    indentSize: 2,
    lineLength: 100,
    namingConventions: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'UPPER_SNAKE_CASE',
    },
  },
  architectureInvariants: [],
  constraints: [],
  externalDependencies: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export class ProjectContextManager {
  private contextPath: string;
  private context: ProjectContext | null = null;

  constructor(projectPath?: string) {
    this.contextPath = projectPath
      ? path.join(projectPath, 'project-context.json')
      : path.join(process.cwd(), 'project-context.json');
  }

  /**
   * Load or initialize project context
   */
  load(): ProjectContext {
    if (this.context) return this.context;

    try {
      if (fs.existsSync(this.contextPath)) {
        const content = fs.readFileSync(this.contextPath, 'utf-8');
        const parsed = JSON.parse(content);
        this.context = { ...DEFAULT_CONTEXT, ...parsed } as ProjectContext;
        return this.context;
      }
    } catch (error) {
      console.warn('Failed to load project context, using defaults:', error);
    }

    this.context = { ...DEFAULT_CONTEXT };
    return this.context;
  }

  /**
   * Save context to disk
   */
  save(context: ProjectContext): void {
    context.updatedAt = Date.now();
    this.context = context;

    try {
      fs.writeFileSync(this.contextPath, JSON.stringify(context, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save project context:', error);
      throw error;
    }
  }

  /**
   * Initialize new project context
   */
  init(overrides: Partial<ProjectContext> = {}): ProjectContext {
    const context: ProjectContext = {
      ...DEFAULT_CONTEXT,
      ...overrides,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.save(context);
    return context;
  }

  /**
   * Update specific fields
   */
  update(updates: Partial<ProjectContext>): ProjectContext {
    const current = this.load();
    const updated = { ...current, ...updates, updatedAt: Date.now() };
    this.save(updated);
    return updated;
  }

  /**
   * Add architecture invariant
   */
  addInvariant(invariant: string): void {
    const context = this.load();
    if (!context.architectureInvariants.includes(invariant)) {
      context.architectureInvariants.push(invariant);
      this.save(context);
    }
  }

  /**
   * Remove architecture invariant
   */
  removeInvariant(invariant: string): void {
    const context = this.load();
    context.architectureInvariants = context.architectureInvariants.filter((i) => i !== invariant);
    this.save(context);
  }

  /**
   * Add constraint
   */
  addConstraint(constraint: string): void {
    const context = this.load();
    if (!context.constraints.includes(constraint)) {
      context.constraints.push(constraint);
      this.save(context);
    }
  }

  /**
   * Generate system prompt with project context
   */
  generateSystemPrompt(role: string = 'senior backend engineer + reviewer'): string {
    const ctx = this.load();

    return `You are ${role} helping with project "${ctx.name}".

## Project Context
${ctx.description ? `Description: ${ctx.description}` : ''}

### Stack
- Language: ${ctx.stack.language}
${ctx.stack.framework ? `- Framework: ${ctx.stack.framework}` : ''}
${Object.entries(ctx.stack.versions)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}

### Infrastructure
- Platform: ${ctx.infrastructure.platform}
${ctx.infrastructure.containerization ? `- Containerization: ${ctx.infrastructure.containerization}` : ''}
${ctx.infrastructure.domains ? `- Domains: ${ctx.infrastructure.domains.join(', ')}` : ''}

### Quality Requirements
${ctx.quality.requireLinting ? '- Linting: Required' : ''}
${ctx.quality.requireTypes ? '- Type checking: Required' : ''}
${ctx.quality.minTestCoverage ? `- Min test coverage: ${ctx.quality.minTestCoverage}%` : ''}
${ctx.quality.noTODOs ? '- No TODO comments unless agreed' : ''}

### Coding Style
- Indentation: ${ctx.style.indentation} (${ctx.style.indentSize})
- Line length: ${ctx.style.lineLength}
- Naming: ${Object.entries(ctx.style.namingConventions)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ')}

### Architecture Invariants
${
  ctx.architectureInvariants.length > 0
    ? ctx.architectureInvariants.map((i) => `- ${i}`).join('\n')
    : '- No invariants defined yet'
}

### Constraints
${
  ctx.constraints.length > 0
    ? ctx.constraints.map((c) => `- ${c}`).join('\n')
    : '- No constraints defined yet'
}

## Response Requirements
- Provide only files you changed/created
- Follow project coding style strictly
- No TODOs unless explicitly requested
- Include tests for critical behavior
- If unsure, list options instead of making assumptions`;
  }

  /**
   * Get context as formatted string for injection
   */
  toString(): string {
    return this.generateSystemPrompt();
  }

  /**
   * Check if context file exists
   */
  exists(): boolean {
    return fs.existsSync(this.contextPath);
  }

  /**
   * Get context file path
   */
  getPath(): string {
    return this.contextPath;
  }
}

// Singleton instance
let globalManager: ProjectContextManager | null = null;

export function getProjectContextManager(projectPath?: string): ProjectContextManager {
  if (!globalManager) {
    globalManager = new ProjectContextManager(projectPath);
  }
  return globalManager;
}

export function resetProjectContextManager(): void {
  globalManager = null;
}
