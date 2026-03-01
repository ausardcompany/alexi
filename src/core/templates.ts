/**
 * Message Templates System
 * Store and manage reusable message templates with variable substitution
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { nanoid } from 'nanoid';

// ============ Type Definitions ============

export interface MessageTemplate {
  /** Unique ID */
  id: string;
  /** Short name for the template */
  name: string;
  /** The template content with placeholders like {{var}} */
  content: string;
  /** Description */
  description?: string;
  /** Category (e.g., 'code-review', 'explain', 'debug') */
  category?: string;
  /** Variables used in the template */
  variables: string[];
  /** When created */
  created: number;
  /** Usage count */
  usageCount: number;
}

export interface TemplateManagerOptions {
  /** Data directory */
  dataDir?: string;
}

// ============ Default Templates ============

export const DEFAULT_TEMPLATES: Omit<MessageTemplate, 'id' | 'created' | 'usageCount'>[] = [
  {
    name: 'explain-code',
    content: 'Please explain this {{language}} code:\n\n```{{language}}\n{{code}}\n```',
    description: 'Ask for code explanation',
    category: 'code',
    variables: ['language', 'code'],
  },
  {
    name: 'review-code',
    content:
      'Please review this {{language}} code for:\n- Bugs and potential issues\n- Performance improvements\n- Code style and best practices\n\n```{{language}}\n{{code}}\n```',
    description: 'Request code review',
    category: 'code-review',
    variables: ['language', 'code'],
  },
  {
    name: 'fix-error',
    content:
      "I'm getting this error:\n\n```\n{{error}}\n```\n\nHere's the relevant code:\n\n```{{language}}\n{{code}}\n```\n\nHow can I fix this?",
    description: 'Ask for help fixing an error',
    category: 'debug',
    variables: ['error', 'language', 'code'],
  },
  {
    name: 'write-tests',
    content:
      'Please write unit tests for this {{language}} code using {{framework}}:\n\n```{{language}}\n{{code}}\n```',
    description: 'Request test generation',
    category: 'testing',
    variables: ['language', 'framework', 'code'],
  },
  {
    name: 'refactor',
    content:
      'Please refactor this {{language}} code to be more {{goal}}:\n\n```{{language}}\n{{code}}\n```',
    description: 'Request code refactoring',
    category: 'refactor',
    variables: ['language', 'goal', 'code'],
  },
  {
    name: 'document',
    content:
      'Please add comprehensive documentation (JSDoc/docstrings) to this {{language}} code:\n\n```{{language}}\n{{code}}\n```',
    description: 'Request code documentation',
    category: 'docs',
    variables: ['language', 'code'],
  },
  {
    name: 'convert',
    content:
      'Please convert this {{fromLang}} code to {{toLang}}:\n\n```{{fromLang}}\n{{code}}\n```',
    description: 'Convert code between languages',
    category: 'convert',
    variables: ['fromLang', 'toLang', 'code'],
  },
  {
    name: 'implement',
    content: 'Please implement {{feature}} in {{language}}. Requirements:\n{{requirements}}',
    description: 'Request feature implementation',
    category: 'implement',
    variables: ['feature', 'language', 'requirements'],
  },
];

// ============ Template Manager Class ============

export class TemplateManager {
  private dataDir: string;
  private templateFilePath: string;
  private templates: Map<string, MessageTemplate> = new Map();

  constructor(options: TemplateManagerOptions = {}) {
    this.dataDir = options.dataDir || path.join(os.homedir(), '.alexi');
    this.templateFilePath = path.join(this.dataDir, 'templates.json');
    this.loadTemplates();
  }

  /**
   * Add a new template
   */
  add(
    name: string,
    content: string,
    options: { description?: string; category?: string } = {}
  ): MessageTemplate {
    const id = nanoid(10);
    const variables = this.extractVariables(content);

    const template: MessageTemplate = {
      id,
      name: name.trim().toLowerCase(),
      content,
      description: options.description,
      category: options.category,
      variables,
      created: Date.now(),
      usageCount: 0,
    };

    this.templates.set(id, template);
    this.saveTemplates();
    return template;
  }

  /**
   * Get template by ID or name
   */
  get(idOrName: string): MessageTemplate | undefined {
    // Try by ID first
    if (this.templates.has(idOrName)) {
      return this.templates.get(idOrName);
    }

    // Try by name
    const nameLower = idOrName.toLowerCase();
    for (const template of this.templates.values()) {
      if (template.name === nameLower) {
        return template;
      }
    }

    return undefined;
  }

  /**
   * Update a template
   */
  update(
    id: string,
    updates: { name?: string; content?: string; description?: string; category?: string }
  ): MessageTemplate | null {
    const existing = this.templates.get(id);
    if (!existing) {
      return null;
    }

    const content = updates.content ?? existing.content;
    const updated: MessageTemplate = {
      ...existing,
      name: updates.name?.toLowerCase() ?? existing.name,
      content,
      description: updates.description ?? existing.description,
      category: updates.category ?? existing.category,
      variables: this.extractVariables(content),
    };

    this.templates.set(id, updated);
    this.saveTemplates();
    return updated;
  }

  /**
   * Delete a template
   */
  delete(id: string): boolean {
    const existed = this.templates.has(id);
    if (existed) {
      this.templates.delete(id);
      this.saveTemplates();
    }
    return existed;
  }

  /**
   * Apply a template with variable substitution
   */
  apply(idOrName: string, variables: Record<string, string>): string | null {
    const template = this.get(idOrName);
    if (!template) {
      return null;
    }

    // Track usage
    template.usageCount++;
    this.saveTemplates();

    // Substitute variables
    let result = template.content;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    return result;
  }

  /**
   * List all templates
   */
  list(): MessageTemplate[] {
    return Array.from(this.templates.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Search templates
   */
  search(query: string): MessageTemplate[] {
    const queryLower = query.toLowerCase();
    return this.list().filter(
      (t) =>
        t.name.includes(queryLower) ||
        t.description?.toLowerCase().includes(queryLower) ||
        t.category?.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Get templates by category
   */
  getByCategory(category: string): MessageTemplate[] {
    const categoryLower = category.toLowerCase();
    return this.list().filter((t) => t.category?.toLowerCase() === categoryLower);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const template of this.templates.values()) {
      if (template.category) {
        categories.add(template.category);
      }
    }
    return Array.from(categories).sort();
  }

  /**
   * Extract variables from template content
   */
  private extractVariables(content: string): string[] {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    if (!matches) {
      return [];
    }

    const variables = new Set<string>();
    for (const match of matches) {
      const variable = match.slice(2, -2).trim();
      variables.add(variable);
    }

    return Array.from(variables);
  }

  /**
   * Reset to default templates
   */
  resetToDefaults(): void {
    this.templates.clear();
    for (const template of DEFAULT_TEMPLATES) {
      const id = nanoid(10);
      this.templates.set(id, {
        id,
        ...template,
        created: Date.now(),
        usageCount: 0,
      });
    }
    this.saveTemplates();
  }

  /**
   * Export templates to JSON
   */
  exportToJson(): string {
    return JSON.stringify(
      {
        version: 1,
        templates: Array.from(this.templates.values()),
      },
      null,
      2
    );
  }

  /**
   * Import templates from JSON
   */
  importFromJson(json: string): number {
    try {
      const data = JSON.parse(json);
      const templates = Array.isArray(data) ? data : data.templates || [];

      let imported = 0;
      for (const template of templates) {
        if (template.name && template.content) {
          this.add(template.name, template.content, {
            description: template.description,
            category: template.category,
          });
          imported++;
        }
      }
      return imported;
    } catch {
      return 0;
    }
  }

  /**
   * Load templates from disk
   */
  private loadTemplates(): void {
    try {
      if (fs.existsSync(this.templateFilePath)) {
        const data = fs.readFileSync(this.templateFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        const entries: MessageTemplate[] = parsed.templates || parsed || [];

        this.templates.clear();
        for (const entry of entries) {
          if (entry.id && entry.name && entry.content) {
            this.templates.set(entry.id, entry);
          }
        }
      } else {
        // Initialize with defaults
        this.resetToDefaults();
      }
    } catch {
      this.resetToDefaults();
    }
  }

  /**
   * Save templates to disk
   */
  private saveTemplates(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const data = {
        version: 1,
        updated: Date.now(),
        templates: Array.from(this.templates.values()),
      };

      fs.writeFileSync(this.templateFilePath, JSON.stringify(data, null, 2));
    } catch {
      // Silently fail on save errors
    }
  }
}

// ============ Singleton Instance ============

let templateManagerInstance: TemplateManager | null = null;

export function getTemplateManager(dataDir?: string): TemplateManager {
  if (!templateManagerInstance) {
    templateManagerInstance = new TemplateManager({ dataDir });
  }
  return templateManagerInstance;
}

export function resetTemplateManager(): void {
  templateManagerInstance = null;
}
