/**
 * Workflow Manager
 * Manages structured development workflow based on DDD (Documentation-Driven Development)
 * Implements: Architecture → Planning → Implementation → Documentation → DevOps → Security
 */

import fs from 'fs';
import path from 'path';
import { ConversationStage, STAGE_DEFINITIONS, getStageManager } from './stageManager.js';
import { AINotesGenerator } from './aiNotes.js';
import { DoDChecker, DoDReport } from './dodChecker.js';
import { getProjectContextManager } from '../config/projectContext.js';

export interface WorkflowState {
  currentStage: ConversationStage;
  stageNumber: number;
  stageName: string;
  startedAt: number;
  artifacts: string[];
  dodPassed: boolean;
  history: StageHistoryEntry[];
}

export interface StageHistoryEntry {
  stage: ConversationStage;
  stageNumber: number;
  stageName: string;
  startedAt: number;
  completedAt?: number;
  artifacts: string[];
  dodReport?: DoDReport;
}

export interface StagePrompts {
  system: string;
  review: string;
  planning: string;
  codeReview: string;
  aiNotesTemplate: string;
}

/**
 * Structured prompts for each development stage
 */
export const STAGE_PROMPTS: Record<ConversationStage, StagePrompts> = {
  architecture: {
    system: `You are a software architect reviewing architectural decisions.
Work as a senior software architect + reviewer.

Context from project:
{PROJECT_CONTEXT}

Requirements:
- Output ONLY files you change/create
- Always add AI_NOTES.md with: what was done, why, risks, how to verify

Quality standards:
- Follow project style and best practices
- Prefer reuse over duplication
- No placeholders/TODOs unless explicitly agreed
- Write tests for critical behavior/contracts
- If unsure, list options but don't make hidden assumptions`,

    review: `Review this architecture decision as an architect:

1) Find weak points: scalability, consistency, fault tolerance, observability
2) Flag controversial decisions and suggest alternatives  
3) Formulate "architecture invariants" (what cannot break)
4) Recommend minimal diagrams/ADRs to document

Architecture:
{ARCHITECTURE_DOC}`,

    planning: `Based on architecture, create work breakdown:

- Break into stages with dependencies
- For each stage: goal, input/output, artifacts (code/tests/docs), risks
- Define priorities and parallelization opportunities
- Provide minimal Definition of Done for each stage

Architecture:
{ARCHITECTURE_DOC}

Requirements:
{REQUIREMENTS}`,

    codeReview: `Conduct code review as strict reviewer:

- correctness, edge cases, error handling
- style and consistency
- duplication and unnecessary abstractions
- testability (what's not covered and why it matters)
- security (injections, secrets, authorization, input validation)
- performance (N+1, allocations, locks, IO)

At the end provide:
- MUST FIX list
- SHOULD IMPROVE list  
- NICE TO HAVE list`,

    aiNotesTemplate: `# Changes — Stage {STAGE_NUMBER}: {STAGE_NAME}

## What Was Done
- {CHANGES}

## Why This Way
- {RATIONALE}

## Risks / Limitations
- {RISKS}

## How to Verify
1. {VERIFICATION_STEPS}`,
  },

  planning: {
    system: `You are a technical lead creating work plans.
Work as a senior technical lead + project manager.

Context from project:
{PROJECT_CONTEXT}

Requirements:
- Create actionable, measurable tasks
- Consider team capacity and dependencies
- Identify blockers and risks early`,

    review: `Review this work plan:

1) Are stages properly sized (not too big, not too small)?
2) Are dependencies correctly identified?
3) Are estimates realistic?
4) Are risks properly assessed?

Plan:
{PLAN_DOC}`,

    planning: `Create detailed work plan from these requirements:

Requirements:
{REQUIREMENTS}

Consider:
- What can be parallelized
- What has external dependencies
- What needs spike/research first
- What has highest business value`,

    codeReview: `Review task breakdown for completeness:

- Are acceptance criteria clear and testable?
- Are technical decisions deferred appropriately?
- Is scope creep prevented?`,

    aiNotesTemplate: `# Work Plan — Stage {STAGE_NUMBER}: {STAGE_NAME}

## Planned Work
- {PLANNED_ITEMS}

## Dependencies
- {DEPENDENCIES}

## Risks
- {RISKS}

## Timeline
- {TIMELINE}`,
  },

  implementation: {
    system: `You are a senior backend engineer implementing features.
Work as a senior backend engineer + reviewer.

Context from project:
{PROJECT_CONTEXT}

Requirements:
- Output ONLY files you change/create
- Always add AI_NOTES.md with: what was done, why, risks, how to verify

Quality standards:
- Follow project style and best practices for {LANGUAGE}
- Prefer reuse over duplication
- No placeholders/TODOs unless explicitly agreed
- Write tests for critical behavior/contracts
- If unsure, list options but don't make hidden assumptions

Verification checklist:
- Code compiles/builds
- Tests pass
- Public contracts match architecture
- No shortcuts or placeholders`,

    review: `Implement this feature following the plan:

Plan:
{PLAN_DOC}

Architecture invariants to respect:
{INVARIANTS}

Expected artifacts:
- Source code changes
- Test files
- AI_NOTES.md`,

    planning: `Plan implementation of this stage:

Stage goal: {STAGE_GOAL}

Break down into:
1. Files to create/modify
2. Tests to write
3. Integration points
4. Verification steps`,

    codeReview: `Conduct code review as strict reviewer:

- correctness, edge cases, error handling
- style and consistency
- duplication and unnecessary abstractions
- testability (what's not covered and why it matters)
- security (injections, secrets, authorization, input validation)
- performance (N+1, allocations, locks, IO)

At the end provide:
- MUST FIX list
- SHOULD IMPROVE list  
- NICE TO HAVE list

Code:
{CODE_CHANGES}`,

    aiNotesTemplate: `# Changes — Stage {STAGE_NUMBER}: {STAGE_NAME}

## What Was Done
- {CHANGES}

## Why This Way
- {RATIONALE}

## Risks / Limitations
- {RISKS}

## How to Verify
1. {BUILD_COMMAND}
2. {TEST_COMMAND}
3. {MANUAL_CHECKS}`,
  },

  documentation: {
    system: `You are a technical writer ensuring documentation quality.

Context from project:
{PROJECT_CONTEXT}

Requirements:
- Documentation must match actual code
- Include runnable examples
- Keep it concise but complete`,

    review: `Review documentation against code:

1) What is outdated?
2) Where are examples missing?
3) Where do contracts diverge?

Documentation:
{DOCUMENTATION}

Code/API reference:
{CODE_REFERENCE}`,

    planning: `Plan documentation updates:

1) Which sections need updating?
2) What new examples are needed?
3) What API changes need documenting?`,

    codeReview: `Review documentation for:

- Technical accuracy
- Completeness
- Clarity and readability
- Runnable examples
- Up-to-date API references`,

    aiNotesTemplate: `# Documentation Update — Stage {STAGE_NUMBER}: {STAGE_NAME}

## Updated Sections
- {SECTIONS}

## Added Examples
- {EXAMPLES}

## Fixed Discrepancies
- {FIXES}`,
  },

  devops: {
    system: `You are a DevOps engineer designing deployment pipelines.

Context from project:
{PROJECT_CONTEXT}

Consider:
- Secrets management
- Database migrations
- Rollback strategies
- Monitoring and alerting`,

    review: `Review DevOps configuration:

1) Is the pipeline secure?
2) Are secrets properly managed?
3) Is rollback possible?
4) Is monitoring adequate?

Configuration:
{DEVOPS_CONFIG}`,

    planning: `Plan DevOps setup for:

Deployment requirements:
{REQUIREMENTS}

SLO/SLA targets:
{SLO_SLA}

Infrastructure constraints:
{CONSTRAINTS}`,

    codeReview: `Review DevOps changes for:

- Security vulnerabilities
- Secret exposure risks
- Downtime risks
- Resource efficiency`,

    aiNotesTemplate: `# DevOps Changes — Stage {STAGE_NUMBER}: {STAGE_NAME}

## Pipeline Changes
- {PIPELINE_CHANGES}

## Environment Changes
- {ENV_CHANGES}

## Rollback Plan
- {ROLLBACK_PLAN}`,
  },

  security: {
    system: `You are a security engineer conducting security reviews.

Context from project:
{PROJECT_CONTEXT}

Focus areas:
- OWASP Top 10
- Injection vulnerabilities
- Authentication bypasses
- Data exposure
- Secret leakage
- Insecure dependencies`,

    review: `Conduct security review:

1) Review code for security vulnerabilities
2) Check authentication/authorization
3) Validate input sanitization
4) Assess secret management
5) Review error handling and logging

Entry points:
{ENTRY_POINTS}

Code:
{CODE_TO_REVIEW}`,

    planning: `Plan security assessment:

1) Which entry points to review?
2) What threat model applies?
3) What compliance requirements exist?`,

    codeReview: `Security-focused code review:

- Injection points
- Auth/authz flows
- Sensitive data handling
- Cryptographic usage
- Logging of sensitive data`,

    aiNotesTemplate: `# Security Review — Stage {STAGE_NUMBER}: {STAGE_NAME}

## Vulnerabilities Found
- {VULNERABILITIES}

## Recommendations
- {RECOMMENDATIONS}

## Compliance Status
- {COMPLIANCE}`,
  },
};

export class WorkflowManager {
  private state: WorkflowState | null = null;
  private workflowPath: string;
  private stageManager = getStageManager();
  private dodChecker = new DoDChecker();
  private notesGenerator = new AINotesGenerator();

  constructor(projectPath?: string) {
    const basePath = projectPath || process.cwd();
    this.workflowPath = path.join(basePath, '.workflow-state.json');
    this.loadState();
  }

  /**
   * Start a new workflow
   */
  startWorkflow(initialStage: ConversationStage = 'architecture', name?: string): WorkflowState {
    this.state = {
      currentStage: initialStage,
      stageNumber: 1,
      stageName: name || STAGE_DEFINITIONS[initialStage].name,
      startedAt: Date.now(),
      artifacts: [],
      dodPassed: false,
      history: [],
    };

    this.stageManager.setStage(initialStage, {
      stageNumber: 1,
      name: this.state.stageName,
    });

    this.saveState();
    return this.state;
  }

  /**
   * Transition to next stage
   */
  nextStage(targetStage?: ConversationStage, name?: string): WorkflowState | null {
    if (!this.state) {
      throw new Error('No active workflow. Call startWorkflow() first.');
    }

    // Check DoD before transition
    const dodReport = this.dodChecker.runChecks(this.state.currentStage);

    // Add current stage to history
    this.state.history.push({
      stage: this.state.currentStage,
      stageNumber: this.state.stageNumber,
      stageName: this.state.stageName,
      startedAt: this.state.startedAt,
      completedAt: Date.now(),
      artifacts: [...this.state.artifacts],
      dodReport,
    });

    // Determine next stage
    const nextStage = targetStage || this.getDefaultNextStage();

    if (!nextStage) {
      // Workflow complete
      this.saveState();
      return null;
    }

    // Validate transition
    if (!this.stageManager.canTransition(this.state.currentStage, nextStage)) {
      console.warn(`Warning: Unusual transition from ${this.state.currentStage} to ${nextStage}`);
    }

    // Update state
    this.state.currentStage = nextStage;
    this.state.stageNumber++;
    this.state.stageName = name || STAGE_DEFINITIONS[nextStage].name;
    this.state.startedAt = Date.now();
    this.state.artifacts = [];
    this.state.dodPassed = false;

    this.stageManager.setStage(nextStage, {
      stageNumber: this.state.stageNumber,
      name: this.state.stageName,
    });

    this.saveState();
    return this.state;
  }

  /**
   * Get default next stage based on workflow order
   */
  private getDefaultNextStage(): ConversationStage | null {
    const order: ConversationStage[] = [
      'architecture',
      'planning',
      'implementation',
      'documentation',
      'devops',
      'security',
    ];

    const currentIndex = order.indexOf(this.state!.currentStage);
    if (currentIndex < order.length - 1) {
      return order[currentIndex + 1];
    }
    return null; // Workflow complete
  }

  /**
   * Get system prompt for current stage with project context
   */
  getSystemPrompt(): string {
    if (!this.state) {
      throw new Error('No active workflow');
    }

    const prompts = STAGE_PROMPTS[this.state.currentStage];
    const context = this.getProjectContextString();

    return prompts.system
      .replace('{PROJECT_CONTEXT}', context)
      .replace('{LANGUAGE}', this.getLanguage());
  }

  /**
   * Get review prompt for current stage
   */
  getReviewPrompt(content: string): string {
    if (!this.state) {
      throw new Error('No active workflow');
    }

    const prompts = STAGE_PROMPTS[this.state.currentStage];
    return prompts.review.replace(/\{[A-Z_]+\}/g, content);
  }

  /**
   * Get code review prompt
   */
  getCodeReviewPrompt(codeChanges: string): string {
    if (!this.state) {
      throw new Error('No active workflow');
    }

    const prompts = STAGE_PROMPTS[this.state.currentStage];
    return prompts.codeReview.replace('{CODE_CHANGES}', codeChanges);
  }

  /**
   * Generate AI_NOTES for current stage
   */
  generateAINotes(options: {
    changes: Array<{ description: string; files: string[]; rationale?: string }>;
    rationale: string[];
    risks: Array<{ description: string; severity: 'low' | 'medium' | 'high'; mitigation?: string }>;
    verificationSteps: Array<{ description: string; command?: string; expectedResult?: string }>;
  }): string {
    if (!this.state) {
      throw new Error('No active workflow');
    }

    const builder = AINotesGenerator.builder(
      this.state.currentStage,
      this.state.stageName
    ).stageNumber(this.state.stageNumber);

    options.changes.forEach((c) => builder.addChange(c.description, c.files, c.rationale));
    options.rationale.forEach((r) => builder.addRationale(r));
    options.risks.forEach((r) => builder.addRisk(r.description, r.severity, r.mitigation));
    options.verificationSteps.forEach((s) =>
      builder.addVerificationStep(s.description, s.command, s.expectedResult)
    );

    const content = builder.build();
    const filePath = this.notesGenerator.save(content);

    this.addArtifact(filePath);
    return filePath;
  }

  /**
   * Run DoD checks for current stage
   */
  runDoDChecks(): DoDReport {
    if (!this.state) {
      throw new Error('No active workflow');
    }

    const report = this.dodChecker.runChecks(this.state.currentStage);
    this.state.dodPassed = report.failed === 0;
    this.saveState();

    return report;
  }

  /**
   * Add artifact to current stage
   */
  addArtifact(artifact: string): void {
    if (this.state) {
      this.state.artifacts.push(artifact);
      this.stageManager.addArtifact(artifact);
      this.saveState();
    }
  }

  /**
   * Get current workflow state
   */
  getState(): WorkflowState | null {
    return this.state;
  }

  /**
   * Get stage definition
   */
  getStageDefinition(stage?: ConversationStage) {
    return STAGE_DEFINITIONS[stage || this.state?.currentStage || 'implementation'];
  }

  /**
   * Get workflow summary
   */
  getSummary(): string {
    if (!this.state) {
      return 'No active workflow';
    }

    const lines: string[] = [
      `# Workflow Summary`,
      ``,
      `**Current Stage:** ${this.state.stageName} (${this.state.currentStage})`,
      `**Stage Number:** ${this.state.stageNumber}`,
      `**DoD Status:** ${this.state.dodPassed ? '✅ Passed' : '❌ Not passed'}`,
      `**Artifacts:** ${this.state.artifacts.length}`,
      ``,
    ];

    if (this.state.history.length > 0) {
      lines.push(`## Completed Stages`);
      lines.push(``);

      this.state.history.forEach((entry) => {
        const duration = entry.completedAt
          ? Math.round((entry.completedAt - entry.startedAt) / 60000)
          : '?';
        const dodStatus = entry.dodReport?.failed === 0 ? '✅' : '⚠️';

        lines.push(`- **${entry.stageName}** (${entry.stage}) ${dodStatus}`);
        lines.push(`  Duration: ${duration} minutes, Artifacts: ${entry.artifacts.length}`);
      });
    }

    return lines.join('\n');
  }

  /**
   * Reset workflow
   */
  reset(): void {
    this.state = null;
    if (fs.existsSync(this.workflowPath)) {
      fs.unlinkSync(this.workflowPath);
    }
  }

  // Private helpers

  private loadState(): void {
    if (fs.existsSync(this.workflowPath)) {
      try {
        const data = fs.readFileSync(this.workflowPath, 'utf-8');
        this.state = JSON.parse(data);
      } catch (error) {
        console.warn('Could not load workflow state:', error);
        this.state = null;
      }
    }
  }

  private saveState(): void {
    if (this.state) {
      fs.writeFileSync(this.workflowPath, JSON.stringify(this.state, null, 2), 'utf-8');
    }
  }

  private getProjectContextString(): string {
    try {
      const manager = getProjectContextManager();
      const context = manager.load();

      return `Project: ${context.name}
Stack: ${context.stack.language}${context.stack.framework ? ` / ${context.stack.framework}` : ''}
Versions: ${JSON.stringify(context.stack.versions)}
Platform: ${context.infrastructure.platform}
Invariants: ${context.architectureInvariants.join(', ') || 'None defined'}
Constraints: ${context.constraints.join(', ') || 'None defined'}`;
    } catch {
      return 'No project context available';
    }
  }

  private getLanguage(): string {
    try {
      const manager = getProjectContextManager();
      return manager.load().stack.language;
    } catch {
      return 'TypeScript';
    }
  }
}

// Singleton instance
let globalWorkflowManager: WorkflowManager | null = null;

export function getWorkflowManager(): WorkflowManager {
  if (!globalWorkflowManager) {
    globalWorkflowManager = new WorkflowManager();
  }
  return globalWorkflowManager;
}

export function resetWorkflowManager(): void {
  if (globalWorkflowManager) {
    globalWorkflowManager.reset();
  }
  globalWorkflowManager = null;
}
