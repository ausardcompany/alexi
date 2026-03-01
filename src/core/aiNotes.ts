/**
 * AI_NOTES.md Generation System
 * Automatically generates structured change documentation
 */

import fs from 'fs';
import path from 'path';
import type { ConversationStage } from './stageManager.js';

export interface ChangeEntry {
  description: string;
  files: string[];
  rationale?: string;
}

export interface RiskItem {
  description: string;
  severity: 'low' | 'medium' | 'high';
  mitigation?: string;
}

export interface VerificationStep {
  step: number;
  description: string;
  command?: string;
  expectedResult?: string;
}

export interface AINotesContent {
  stage: ConversationStage;
  stageNumber?: number;
  title: string;
  changes: ChangeEntry[];
  rationale: string[];
  risks: RiskItem[];
  verification: VerificationStep[];
  notes?: string[];
  createdAt: number;
}

export class AINotesGenerator {
  private outputDir: string;

  constructor(outputDir?: string) {
    this.outputDir = outputDir || process.cwd();
  }

  /**
   * Generate AI_NOTES.md content
   */
  generate(content: AINotesContent): string {
    const timestamp = new Date(content.createdAt).toISOString();
    const stageLabel = content.stageNumber
      ? `Stage ${content.stageNumber}: ${content.title}`
      : content.title;

    let markdown = `# Changes — ${stageLabel}\n\n`;
    markdown += `**Stage Type:** ${content.stage}\n`;
    markdown += `**Generated:** ${timestamp}\n\n`;
    markdown += `---\n\n`;

    // What was done
    markdown += `## What Was Done\n\n`;
    if (content.changes.length === 0) {
      markdown += `No changes recorded.\n\n`;
    } else {
      content.changes.forEach((change, index) => {
        markdown += `${index + 1}. **${change.description}**\n`;
        if (change.files.length > 0) {
          markdown += `   - Files: ${change.files.map((f) => `\`${f}\``).join(', ')}\n`;
        }
        if (change.rationale) {
          markdown += `   - Rationale: ${change.rationale}\n`;
        }
        markdown += `\n`;
      });
    }

    // Why this way
    markdown += `## Why This Way\n\n`;
    if (content.rationale.length === 0) {
      markdown += `No rationale provided.\n\n`;
    } else {
      content.rationale.forEach((r) => {
        markdown += `- ${r}\n`;
      });
      markdown += `\n`;
    }

    // Risks and limitations
    markdown += `## Risks / Limitations\n\n`;
    if (content.risks.length === 0) {
      markdown += `No known risks.\n\n`;
    } else {
      content.risks.forEach((risk) => {
        const emoji = risk.severity === 'high' ? '🔴' : risk.severity === 'medium' ? '🟡' : '🟢';
        markdown += `${emoji} **${risk.severity.toUpperCase()}:** ${risk.description}\n`;
        if (risk.mitigation) {
          markdown += `   - Mitigation: ${risk.mitigation}\n`;
        }
        markdown += `\n`;
      });
    }

    // How to verify
    markdown += `## How to Verify\n\n`;
    if (content.verification.length === 0) {
      markdown += `No verification steps defined.\n\n`;
    } else {
      content.verification.forEach((step) => {
        markdown += `${step.step}. ${step.description}\n`;
        if (step.command) {
          markdown += `   \`\`\`bash\n   ${step.command}\n   \`\`\`\n`;
        }
        if (step.expectedResult) {
          markdown += `   Expected: ${step.expectedResult}\n`;
        }
        markdown += `\n`;
      });
    }

    // Additional notes
    if (content.notes && content.notes.length > 0) {
      markdown += `## Additional Notes\n\n`;
      content.notes.forEach((note) => {
        markdown += `- ${note}\n`;
      });
      markdown += `\n`;
    }

    return markdown;
  }

  /**
   * Save AI_NOTES.md to disk
   */
  save(content: AINotesContent, filename?: string): string {
    const markdown = this.generate(content);

    const defaultName = content.stageNumber
      ? `AI_NOTES_stage_${content.stageNumber}_${content.stage}.md`
      : `AI_NOTES_${content.stage}_${Date.now()}.md`;

    const fileName = filename || defaultName;
    const filePath = path.join(this.outputDir, fileName);

    try {
      fs.writeFileSync(filePath, markdown, 'utf-8');
      return filePath;
    } catch (error) {
      console.error('Failed to save AI_NOTES.md:', error);
      throw error;
    }
  }

  /**
   * Load existing AI_NOTES.md
   */
  load(filePath: string): AINotesContent | null {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      return this.parse(content);
    } catch (error) {
      console.error('Failed to load AI_NOTES.md:', error);
      return null;
    }
  }

  /**
   * Parse AI_NOTES.md content
   */
  parse(markdown: string): AINotesContent {
    // Simple parser - in production, use a proper markdown parser
    const lines = markdown.split('\n');

    const content: AINotesContent = {
      stage: 'implementation',
      title: 'Unknown',
      changes: [],
      rationale: [],
      risks: [],
      verification: [],
      createdAt: Date.now(),
    };

    let currentSection: string | null = null;
    let currentChange: Partial<ChangeEntry> = {};
    let currentStep: Partial<VerificationStep> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      // Parse header
      if (trimmed.startsWith('# Changes —')) {
        const match = trimmed.match(/Stage (\d+):\s*(.+)/);
        if (match) {
          content.stageNumber = parseInt(match[1]);
          content.title = match[2];
        } else {
          content.title = trimmed.replace('# Changes — ', '');
        }
      }

      // Parse stage type
      if (trimmed.startsWith('**Stage Type:**')) {
        content.stage = trimmed.replace('**Stage Type:**', '').trim() as ConversationStage;
      }

      // Parse sections
      if (trimmed === '## What Was Done') {
        currentSection = 'changes';
        continue;
      }
      if (trimmed === '## Why This Way') {
        currentSection = 'rationale';
        continue;
      }
      if (trimmed === '## Risks / Limitations') {
        currentSection = 'risks';
        continue;
      }
      if (trimmed === '## How to Verify') {
        currentSection = 'verification';
        continue;
      }
      if (trimmed === '## Additional Notes') {
        currentSection = 'notes';
        continue;
      }

      // Parse content based on section
      if (currentSection === 'changes') {
        if (trimmed.match(/^\d+\.\s+\*\*/)) {
          if (currentChange.description) {
            content.changes.push(currentChange as ChangeEntry);
          }
          currentChange = {
            description: trimmed.replace(/^\d+\.\s+\*\*/, '').replace(/\*\*$/, ''),
            files: [],
          };
        } else if (trimmed.includes('- Files:')) {
          const filesMatch = trimmed.match(/Files:\s*(.+)/);
          if (filesMatch) {
            currentChange.files = filesMatch[1].split(',').map((f) => f.trim().replace(/`/g, ''));
          }
        } else if (trimmed.includes('- Rationale:')) {
          currentChange.rationale = trimmed.replace(/.*- Rationale:\s*/, '');
        }
      }

      if (currentSection === 'rationale' && trimmed.startsWith('- ')) {
        content.rationale.push(trimmed.substring(2));
      }

      if (currentSection === 'risks') {
        const riskMatch = trimmed.match(/^\S+\s+\*\*(\w+):\*\*\s+(.+)/);
        if (riskMatch) {
          content.risks.push({
            severity: riskMatch[1].toLowerCase() as RiskItem['severity'],
            description: riskMatch[2],
          });
        }
      }

      if (currentSection === 'verification') {
        const stepMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (stepMatch) {
          if (currentStep.step) {
            content.verification.push(currentStep as VerificationStep);
          }
          currentStep = {
            step: parseInt(stepMatch[1]),
            description: stepMatch[2],
          };
        }
      }

      if (currentSection === 'notes' && trimmed.startsWith('- ')) {
        if (!content.notes) content.notes = [];
        content.notes.push(trimmed.substring(2));
      }
    }

    // Push last items
    if (currentChange.description) {
      content.changes.push(currentChange as ChangeEntry);
    }
    if (currentStep.step) {
      content.verification.push(currentStep as VerificationStep);
    }

    return content;
  }

  /**
   * Create builder for fluent API
   */
  static builder(stage: ConversationStage, title: string): AINotesBuilder {
    return new AINotesBuilder(stage, title);
  }
}

export class AINotesBuilder {
  private content: AINotesContent;

  constructor(stage: ConversationStage, title: string) {
    this.content = {
      stage,
      title,
      changes: [],
      rationale: [],
      risks: [],
      verification: [],
      createdAt: Date.now(),
    };
  }

  stageNumber(num: number): this {
    this.content.stageNumber = num;
    return this;
  }

  addChange(description: string, files: string[], rationale?: string): this {
    this.content.changes.push({ description, files, rationale });
    return this;
  }

  addRationale(reason: string): this {
    this.content.rationale.push(reason);
    return this;
  }

  addRisk(description: string, severity: RiskItem['severity'], mitigation?: string): this {
    this.content.risks.push({ description, severity, mitigation });
    return this;
  }

  addVerificationStep(description: string, command?: string, expectedResult?: string): this {
    this.content.verification.push({
      step: this.content.verification.length + 1,
      description,
      command,
      expectedResult,
    });
    return this;
  }

  addNote(note: string): this {
    if (!this.content.notes) this.content.notes = [];
    this.content.notes.push(note);
    return this;
  }

  build(): AINotesContent {
    return { ...this.content };
  }

  generate(): string {
    const generator = new AINotesGenerator();
    return generator.generate(this.content);
  }

  save(outputDir?: string, filename?: string): string {
    const generator = new AINotesGenerator(outputDir);
    return generator.save(this.content, filename);
  }
}
