/**
 * Skill System
 * Defines reusable AI prompts/behaviors that can be activated during conversations
 * Based on kilocode/opencode patterns
 */

import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Constant for built-in skills that don't have filesystem locations
export const BUILTIN_LOCATION = '<builtin>' as const;

// Skill definition schema
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),

  // Core prompt content
  prompt: z.string(),

  // Optional structured prompts for different contexts
  prompts: z
    .object({
      system: z.string().optional(),
      review: z.string().optional(),
      planning: z.string().optional(),
      codeReview: z.string().optional(),
    })
    .optional(),

  // Tool constraints
  tools: z.array(z.string()).optional(),
  disabledTools: z.array(z.string()).optional(),

  // Model preferences
  preferredModel: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),

  // Metadata
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),

  // Source information
  source: z.enum(['builtin', 'file', 'mcp']).optional(),
  sourcePath: z.string().optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  prompt: string;
  prompts?: {
    system?: string;
    review?: string;
    planning?: string;
    codeReview?: string;
  };
  tools?: string[];
  disabledTools?: string[];
  preferredModel?: string;
  temperature?: number;
  maxTokens?: number;
  category?: string;
  tags?: string[];
  aliases?: string[];
}

/**
 * Define a new skill
 */
export function defineSkill(definition: SkillDefinition): Skill {
  return {
    ...definition,
    source: 'builtin',
  };
}

/**
 * Load skill from markdown file with frontmatter
 */
export function loadSkillFromFile(filePath: string): Skill | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: promptContent } = matter(content);

    const skill: Skill = {
      id: data.id || path.basename(filePath, path.extname(filePath)),
      name: data.name || data.id || path.basename(filePath, path.extname(filePath)),
      description: data.description || '',
      prompt: promptContent.trim(),
      prompts: data.prompts,
      tools: data.tools,
      disabledTools: data.disabledTools,
      preferredModel: data.preferredModel || data.model,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      category: data.category,
      tags: data.tags,
      aliases: data.aliases,
      source: 'file',
      sourcePath: filePath,
    };

    return skill;
  } catch (error) {
    console.warn(`Failed to load skill from ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all skills from a directory
 */
export function loadSkillsFromDirectory(dirPath: string): Skill[] {
  const skills: Skill[] = [];

  if (!fs.existsSync(dirPath)) {
    return skills;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.yaml') || file.endsWith('.yml')) {
      const skill = loadSkillFromFile(path.join(dirPath, file));
      if (skill) {
        skills.push(skill);
      }
    }
  }

  return skills;
}

/**
 * Skill Registry - manages all available skills
 */
class SkillRegistry {
  private skills: Map<string, Skill> = new Map();
  private aliasMap: Map<string, string> = new Map();
  private builtinSkills: Map<string, Skill> = new Map();

  /**
   * Register a skill
   */
  register(skill: Skill): void {
    this.skills.set(skill.id, skill);

    // Register aliases
    if (skill.aliases) {
      for (const alias of skill.aliases) {
        this.aliasMap.set(alias.toLowerCase(), skill.id);
      }
    }
  }

  /**
   * Register a built-in skill
   */
  registerBuiltin(skill: Skill): void {
    this.builtinSkills.set(skill.id, skill);
    this.register(skill);
  }

  /**
   * Check if a skill is built-in
   */
  isBuiltin(idOrAlias: string): boolean {
    const id = this.aliasMap.get(idOrAlias.toLowerCase()) || idOrAlias;
    return this.builtinSkills.has(id);
  }

  /**
   * Get skill by id or alias
   */
  get(idOrAlias: string): Skill | undefined {
    const id = this.aliasMap.get(idOrAlias.toLowerCase()) || idOrAlias;
    return this.skills.get(id);
  }

  /**
   * Check if skill exists
   */
  has(idOrAlias: string): boolean {
    const id = this.aliasMap.get(idOrAlias.toLowerCase()) || idOrAlias;
    return this.skills.has(id);
  }

  /**
   * List all skills
   */
  list(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * List skills by category
   */
  listByCategory(category: string): Skill[] {
    return this.list().filter((s) => s.category === category);
  }

  /**
   * List skills by tag
   */
  listByTag(tag: string): Skill[] {
    return this.list().filter((s) => s.tags?.includes(tag));
  }

  /**
   * Search skills
   */
  search(query: string): Skill[] {
    const q = query.toLowerCase();
    return this.list().filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const skill of this.skills.values()) {
      if (skill.category) {
        categories.add(skill.category);
      }
    }
    return Array.from(categories);
  }

  /**
   * Remove a skill
   */
  remove(id: string): boolean {
    const skill = this.skills.get(id);
    if (!skill) return false;

    // Remove aliases
    if (skill.aliases) {
      for (const alias of skill.aliases) {
        this.aliasMap.delete(alias.toLowerCase());
      }
    }

    return this.skills.delete(id);
  }

  /**
   * Clear all skills
   */
  clear(): void {
    this.skills.clear();
    this.aliasMap.clear();
  }
}

// Global registry
let globalRegistry: SkillRegistry | null = null;

export function getSkillRegistry(): SkillRegistry {
  if (!globalRegistry) {
    globalRegistry = new SkillRegistry();
  }
  return globalRegistry;
}

export function registerSkill(skill: Skill): void {
  getSkillRegistry().register(skill);
}

export function getSkill(idOrAlias: string): Skill | undefined {
  return getSkillRegistry().get(idOrAlias);
}

export function listSkills(): Skill[] {
  return getSkillRegistry().list();
}

export function isBuiltinSkill(idOrAlias: string): boolean {
  return getSkillRegistry().isBuiltin(idOrAlias);
}

// Re-export
export { SkillRegistry };
