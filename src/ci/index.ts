/**
 * CI/CD Workflow Template Generator
 * Generates workflow files for GitHub Actions and GitLab CI
 */

import fs from 'fs';
import path from 'path';
import {
  ALL_TEMPLATES,
  getTemplate,
  getTemplatesByPlatform,
  type CIPlatform,
  type CITemplate,
  type TemplateType,
} from './templates.js';

// ============ Type Definitions ============

export interface CIInitOptions {
  platform: CIPlatform;
  template?: TemplateType;
  outputDir?: string;
  overwrite?: boolean;
}

export interface CIInitResult {
  created: string[];
  skipped: string[];
  errors: string[];
}

// ============ Re-export types from templates ============

export type { CIPlatform, CITemplate, TemplateType } from './templates.js';

// ============ CIManager Class ============

/**
 * Manages CI/CD workflow template generation
 */
export class CIManager {
  /**
   * List available templates
   * @param platform - Optional filter by platform
   * @returns Array of available templates
   */
  listTemplates(platform?: CIPlatform): CITemplate[] {
    if (platform) {
      return getTemplatesByPlatform(platform);
    }
    return [...ALL_TEMPLATES];
  }

  /**
   * Get a specific template
   * @param platform - Target CI platform
   * @param type - Template type
   * @returns Template if found, undefined otherwise
   */
  getTemplate(platform: CIPlatform, type: TemplateType): CITemplate | undefined {
    return getTemplate(platform, type);
  }

  /**
   * Preview template content without writing
   * @param platform - Target CI platform
   * @param type - Template type
   * @returns Template content or error message
   */
  preview(platform: CIPlatform, type: TemplateType): string {
    const template = getTemplate(platform, type);
    if (!template) {
      return `Template not found for platform: ${platform}, type: ${type}`;
    }
    return template.content;
  }

  /**
   * Initialize CI workflow files
   * @param options - Initialization options
   * @returns Result with created, skipped, and error files
   */
  init(options: CIInitOptions): CIInitResult {
    const result: CIInitResult = {
      created: [],
      skipped: [],
      errors: [],
    };

    const outputDir = options.outputDir || process.cwd();

    // Get templates to generate
    let templatesToGenerate: CITemplate[];

    if (options.template) {
      // Generate specific template
      const template = getTemplate(options.platform, options.template);
      if (!template) {
        result.errors.push(`Template not found: ${options.platform}/${options.template}`);
        return result;
      }
      templatesToGenerate = [template];
    } else {
      // Generate all templates for the platform
      templatesToGenerate = getTemplatesByPlatform(options.platform);
    }

    // Generate each template
    for (const template of templatesToGenerate) {
      try {
        const outputPath = path.join(outputDir, template.outputPath);

        // Check if file exists
        if (fs.existsSync(outputPath)) {
          if (options.overwrite) {
            // Overwrite existing file
            this.writeTemplate(outputPath, template.content);
            result.created.push(outputPath);
          } else {
            // Skip existing file
            result.skipped.push(outputPath);
          }
        } else {
          // Create new file
          this.writeTemplate(outputPath, template.content);
          result.created.push(outputPath);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push(`Failed to create ${template.outputPath}: ${message}`);
      }
    }

    return result;
  }

  /**
   * Write template content to file, creating directories as needed
   * @param filePath - Target file path
   * @param content - Template content
   */
  private writeTemplate(filePath: string, content: string): void {
    const dir = path.dirname(filePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Get platform display name
   * @param platform - Platform identifier
   * @returns Human-readable platform name
   */
  getPlatformDisplayName(platform: CIPlatform): string {
    const names: Record<CIPlatform, string> = {
      github: 'GitHub Actions',
      gitlab: 'GitLab CI',
    };
    return names[platform] || platform;
  }

  /**
   * Get template type display name
   * @param type - Template type
   * @returns Human-readable type name
   */
  getTypeDisplayName(type: TemplateType): string {
    const names: Record<TemplateType, string> = {
      'pr-review': 'PR/MR Review',
      'code-check': 'Code Quality Check',
      'feature-implement': 'Feature Implementation',
    };
    return names[type] || type;
  }

  /**
   * Validate that required secrets are documented for a template
   * @param template - Template to check
   * @returns List of required secrets
   */
  getRequiredSecrets(template: CITemplate): string[] {
    const secrets: string[] = [];

    if (template.platform === 'github') {
      secrets.push('SAP_AICORE_SERVICE_KEY');
      secrets.push('SAP_PROXY_BASE_URL (alternative)');
      secrets.push('SAP_PROXY_API_KEY (optional)');

      if (template.type === 'feature-implement') {
        secrets.push('GITHUB_TOKEN (automatic)');
      }
    } else if (template.platform === 'gitlab') {
      secrets.push('SAP_AICORE_SERVICE_KEY');
      secrets.push('SAP_PROXY_BASE_URL (alternative)');
      secrets.push('SAP_PROXY_API_KEY (optional)');

      if (template.type === 'pr-review') {
        secrets.push('GITLAB_TOKEN (for posting comments)');
      }
    }

    return secrets;
  }
}

// ============ Singleton Instance ============

let ciManagerInstance: CIManager | null = null;

/**
 * Get the singleton CIManager instance
 */
export function getCIManager(): CIManager {
  if (!ciManagerInstance) {
    ciManagerInstance = new CIManager();
  }
  return ciManagerInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetCIManager(): void {
  ciManagerInstance = null;
}

// ============ Convenience Exports ============

export { ALL_TEMPLATES };

// ============ CLI Helper Functions ============

/**
 * Format init result for CLI output
 * @param result - Init result
 * @returns Formatted string for CLI display
 */
export function formatInitResultForCLI(result: CIInitResult): string {
  const lines: string[] = [];

  if (result.created.length > 0) {
    lines.push('Created files:');
    for (const file of result.created) {
      lines.push(`  + ${file}`);
    }
  }

  if (result.skipped.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push('Skipped files (already exist, use --overwrite to replace):');
    for (const file of result.skipped) {
      lines.push(`  - ${file}`);
    }
  }

  if (result.errors.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push('Errors:');
    for (const error of result.errors) {
      lines.push(`  ! ${error}`);
    }
  }

  if (result.created.length === 0 && result.skipped.length === 0 && result.errors.length === 0) {
    lines.push('No templates found for the specified options.');
  }

  return lines.join('\n');
}

/**
 * Format template list for CLI output
 * @param templates - Templates to display
 * @returns Formatted string for CLI display
 */
export function formatTemplateListForCLI(templates: CITemplate[]): string {
  const lines: string[] = [];

  const manager = getCIManager();

  // Group by platform
  const byPlatform = new Map<CIPlatform, CITemplate[]>();

  for (const template of templates) {
    const platformTemplates = byPlatform.get(template.platform) || [];
    platformTemplates.push(template);
    byPlatform.set(template.platform, platformTemplates);
  }

  for (const [platform, platformTemplates] of byPlatform) {
    lines.push(`${manager.getPlatformDisplayName(platform)}:`);
    lines.push('');

    for (const template of platformTemplates) {
      lines.push(`  ${template.id}`);
      lines.push(`    Type: ${manager.getTypeDisplayName(template.type)}`);
      lines.push(`    Output: ${template.outputPath}`);
      lines.push(`    ${template.description}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Format template preview for CLI output
 * @param template - Template to preview
 * @returns Formatted string with template info and content
 */
export function formatTemplatePreviewForCLI(template: CITemplate): string {
  const manager = getCIManager();
  const lines: string[] = [];

  lines.push(`Template: ${template.name}`);
  lines.push(`Platform: ${manager.getPlatformDisplayName(template.platform)}`);
  lines.push(`Type: ${manager.getTypeDisplayName(template.type)}`);
  lines.push(`Output Path: ${template.outputPath}`);
  lines.push('');
  lines.push('Required Secrets:');
  for (const secret of manager.getRequiredSecrets(template)) {
    lines.push(`  - ${secret}`);
  }
  lines.push('');
  lines.push('--- Template Content ---');
  lines.push('');
  lines.push(template.content);

  return lines.join('\n');
}
