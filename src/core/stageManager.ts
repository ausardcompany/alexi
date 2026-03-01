/**
 * Stage-Based Conversation Organization
 * Organizes conversations by development stages to prevent context pollution
 */

export type ConversationStage =
  | 'architecture'
  | 'planning'
  | 'implementation'
  | 'documentation'
  | 'devops'
  | 'security';

export interface StageDefinition {
  type: ConversationStage;
  name: string;
  description: string;
  role: string;
  systemPrompt: string;
  expectedArtifacts: string[];
  dod: string[]; // Definition of Done
}

export const STAGE_DEFINITIONS: Record<ConversationStage, StageDefinition> = {
  architecture: {
    type: 'architecture',
    name: 'Architecture Review',
    description: 'Review architectural decisions, identify risks, define invariants',
    role: 'software architect',
    systemPrompt: `You are a software architect reviewing architectural decisions.

Your tasks:
1. Identify weak points: scalability, consistency, fault tolerance, observability
2. Flag controversial decisions and suggest alternatives
3. Formulate "architecture invariants" (what cannot break)
4. Recommend minimal diagrams/ADRs to document

Input: Domain description, key scenarios, draft architecture
Output: Review findings, risks, invariants, recommendations

Be critical but constructive. Consider trade-offs explicitly.`,
    expectedArtifacts: [
      'Architecture review document',
      'List of weak points and risks',
      'Architecture invariants',
      'ADR recommendations',
    ],
    dod: [
      'Component/boundary map exists',
      'Main data flows described',
      'Key invariants documented (idempotency, transactions, retries, consistency)',
    ],
  },

  planning: {
    type: 'planning',
    name: 'Work Planning',
    description: 'Decompose requirements into stages with DoD and priorities',
    role: 'technical lead',
    systemPrompt: `You are a technical lead creating work plans.

Your tasks:
1. Decompose requirements into stages
2. Define dependencies between stages
3. Set priorities and parallelization opportunities
4. Define minimal Definition of Done for each stage

Input: Architecture + requirements
Output: Stage breakdown with goals, I/O, artifacts, risks, dependencies, DoD

Be pragmatic about sequencing and resource allocation.`,
    expectedArtifacts: [
      'Work plan document',
      'Stage breakdown with dependencies',
      'Risk assessment',
      'Timeline estimates',
    ],
    dod: [
      'Each stage has goal, input/output, risks',
      'Dependencies between stages are clear',
      'Minimum checks defined (tests/linter/contracts)',
    ],
  },

  implementation: {
    type: 'implementation',
    name: 'Implementation',
    description: 'Code generation per stage with artifacts',
    role: 'senior backend engineer',
    systemPrompt: `You are a senior backend engineer implementing features.

Your tasks:
1. Write clean, maintainable code following project standards
2. Include tests (unit + integration where appropriate)
3. Write AI_NOTES.md with changes and verification steps
4. Ensure no TODOs unless explicitly agreed

Input: Stage description + architecture invariants + current code
Output: Code changes, tests, AI_NOTES.md

Always verify:
- Code compiles/builds
- Tests pass
- Public contracts match architecture
- No shortcuts or placeholders`,
    expectedArtifacts: ['Source code changes', 'Test files', 'AI_NOTES.md'],
    dod: [
      'Project builds successfully',
      'All tests pass (green)',
      'No TODOs or placeholders',
      'Public contracts (API/DTO/schemas) match architecture',
      'Changes documented in AI_NOTES.md',
    ],
  },

  documentation: {
    type: 'documentation',
    name: 'Documentation',
    description: 'Verify docs match code, update examples',
    role: 'technical writer',
    systemPrompt: `You are a technical writer ensuring documentation quality.

Your tasks:
1. Check documentation against actual code
2. Identify outdated content
3. Add missing examples
4. Ensure contracts are documented

Input: Documentation + repository
Output: Updated docs, list of discrepancies

Focus on:
- What is outdated
- Where examples are missing
- Where contracts diverge`,
    expectedArtifacts: ['Updated documentation', 'Discrepancy report', 'Example code snippets'],
    dod: [
      'Documentation matches current contracts',
      'Run and verify instructions exist',
      'Key decisions documented (ADR-style)',
    ],
  },

  devops: {
    type: 'devops',
    name: 'DevOps Review',
    description: 'CI/CD, deployment, scaling discussions',
    role: 'DevOps engineer',
    systemPrompt: `You are a DevOps engineer designing deployment pipelines.

Your tasks:
1. Design CI/CD pipelines
2. Define environments and promotion strategy
3. Plan scaling and resource allocation
4. Establish rollback procedures

Input: Deployment requirements + SLO/SLA + infrastructure constraints
Output: Pipeline config, environment setup, operational runbooks

Consider:
- Secrets management
- Database migrations
- Rollback strategies
- Monitoring and alerting`,
    expectedArtifacts: [
      'CI/CD pipeline configuration',
      'Environment definitions',
      'Deployment runbook',
      'Monitoring setup',
    ],
    dod: [
      'Pipeline defined for all environments',
      'Secrets management documented',
      'Rollback procedures established',
      'Basic monitoring in place',
    ],
  },

  security: {
    type: 'security',
    name: 'Security Review',
    description: 'Vulnerability assessment, best practices',
    role: 'security engineer',
    systemPrompt: `You are a security engineer conducting security reviews.

Your tasks:
1. Review code for security vulnerabilities
2. Check authentication/authorization
3. Validate input sanitization
4. Assess secret management
5. Review error handling and logging

Input: Repository + entry points (API, integrations, background jobs)
Output: Security report with issues, recommendations, priorities

Focus on:
- Injection vulnerabilities
- Authentication bypasses
- Data exposure
- Secret leakage
- Insecure dependencies`,
    expectedArtifacts: [
      'Security assessment report',
      'Vulnerability list with priorities',
      'Remediation recommendations',
    ],
    dod: [
      'All entry points reviewed',
      'OWASP Top 10 checked',
      'Secrets management validated',
      'Error handling audited',
    ],
  },
};

export interface StageContext {
  stage: ConversationStage;
  stageNumber?: number;
  name?: string;
  input?: string;
  expectedOutput?: string;
  artifacts: string[];
}

export class StageManager {
  private currentStage: StageContext | null = null;

  /**
   * Set current stage
   */
  setStage(stage: ConversationStage, details?: Partial<StageContext>): StageContext {
    const _definition = STAGE_DEFINITIONS[stage];

    this.currentStage = {
      stage,
      artifacts: [],
      ...details,
    };

    return this.currentStage;
  }

  /**
   * Get current stage
   */
  getCurrentStage(): StageContext | null {
    return this.currentStage;
  }

  /**
   * Get stage definition
   */
  getStageDefinition(stage: ConversationStage): StageDefinition {
    return STAGE_DEFINITIONS[stage];
  }

  /**
   * Get system prompt for current stage
   */
  getSystemPrompt(stage?: ConversationStage): string {
    const targetStage = stage || this.currentStage?.stage || 'implementation';
    return STAGE_DEFINITIONS[targetStage].systemPrompt;
  }

  /**
   * Check if current stage DoD is met
   */
  checkDoD(artifacts: string[]): { passed: boolean; missing: string[] } {
    if (!this.currentStage) {
      return { passed: false, missing: ['No active stage'] };
    }

    const definition = STAGE_DEFINITIONS[this.currentStage.stage];
    const missing = definition.dod.filter((item) => {
      // Simple check - in real implementation, this would be more sophisticated
      return !artifacts.some((a) => a.toLowerCase().includes(item.toLowerCase()));
    });

    return {
      passed: missing.length === 0,
      missing,
    };
  }

  /**
   * Add artifact to current stage
   */
  addArtifact(artifact: string): void {
    if (this.currentStage) {
      this.currentStage.artifacts.push(artifact);
    }
  }

  /**
   * List all available stages
   */
  listStages(): Array<{ type: ConversationStage; name: string; description: string }> {
    return Object.values(STAGE_DEFINITIONS).map((def) => ({
      type: def.type,
      name: def.name,
      description: def.description,
    }));
  }

  /**
   * Get expected artifacts for stage
   */
  getExpectedArtifacts(stage?: ConversationStage): string[] {
    const targetStage = stage || this.currentStage?.stage || 'implementation';
    return STAGE_DEFINITIONS[targetStage].expectedArtifacts;
  }

  /**
   * Validate stage transition
   */
  canTransition(from: ConversationStage, to: ConversationStage): boolean {
    const validTransitions: Record<ConversationStage, ConversationStage[]> = {
      architecture: ['planning'],
      planning: ['implementation', 'architecture'],
      implementation: ['documentation', 'devops', 'security', 'planning'],
      documentation: ['implementation', 'devops'],
      devops: ['security', 'implementation'],
      security: ['implementation', 'devops'],
    };

    return validTransitions[from]?.includes(to) ?? false;
  }
}

// Singleton instance
let globalStageManager: StageManager | null = null;

export function getStageManager(): StageManager {
  if (!globalStageManager) {
    globalStageManager = new StageManager();
  }
  return globalStageManager;
}

export function resetStageManager(): void {
  globalStageManager = null;
}
