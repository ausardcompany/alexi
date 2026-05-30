/**
 * Skill System
 * Defines reusable AI prompts/behaviors that can be activated during conversations
 * Based on kilocode/opencode patterns
 */

import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getGlobalPaths } from '../utils/global.js';
import { defineEvent } from '../bus/index.js';

// ============ Events ============

/**
 * Emitted whenever the skill registry is re-scanned and replaced via
 * {@link reloadSkills}.
 */
export const SkillReloaded = defineEvent(
  'skill.reloaded',
  z.object({
    added: z.number(),
    removed: z.number(),
    total: z.number(),
    timestamp: z.number(),
  })
);

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
 * Load skill from markdown file with frontmatter.
 *
 * Recognized frontmatter fields:
 * - `tools` — allowlist of tools the skill may use
 * - `disallowed-tools` (kebab-case, upstream Claude Code convention) — denylist of tools
 *   the skill may not use. Also accepted as `disallowedTools` and the legacy `disabledTools`.
 *   All three spellings are honored as synonyms; the kebab-case form takes precedence.
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
      disabledTools: data['disallowed-tools'] ?? data.disallowedTools ?? data.disabledTools,
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
 * Check whether a path has a skill file extension.
 */
function isSkillFileName(name: string): boolean {
  return name.endsWith('.md') || name.endsWith('.yaml') || name.endsWith('.yml');
}

/**
 * Load all skills from a directory.
 *
 * Follows symlinks: a symlinked file with a skill extension is loaded, and a
 * symlinked subdirectory is recursed into. Cycles are guarded by a visited
 * set keyed on resolved (`fs.realpathSync`) paths. Broken symlinks are logged
 * via `console.warn` and skipped without aborting the rest of the traversal.
 */
export function loadSkillsFromDirectory(dirPath: string, visited?: Set<string>): Skill[] {
  const skills: Skill[] = [];

  if (!fs.existsSync(dirPath)) {
    return skills;
  }

  const seen = visited ?? new Set<string>();

  let resolvedDir: string;
  try {
    resolvedDir = fs.realpathSync(dirPath);
  } catch (error) {
    console.warn(`Failed to resolve skill directory ${dirPath}:`, error);
    return skills;
  }

  if (seen.has(resolvedDir)) {
    return skills;
  }
  seen.add(resolvedDir);

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(resolvedDir, { withFileTypes: true });
  } catch (error) {
    console.warn(`Failed to read skill directory ${resolvedDir}:`, error);
    return skills;
  }

  for (const entry of entries) {
    const entryPath = path.join(resolvedDir, entry.name);

    if (entry.isFile()) {
      if (isSkillFileName(entry.name)) {
        const skill = loadSkillFromFile(entryPath);
        if (skill) {
          skills.push(skill);
        }
      }
      continue;
    }

    if (entry.isSymbolicLink()) {
      let resolvedTarget: string;
      try {
        resolvedTarget = fs.realpathSync(entryPath);
      } catch (error) {
        console.warn(`Skipping broken skill symlink ${entryPath}:`, error);
        continue;
      }

      let stat: fs.Stats;
      try {
        stat = fs.statSync(resolvedTarget);
      } catch (error) {
        console.warn(`Skipping broken skill symlink ${entryPath}:`, error);
        continue;
      }

      if (stat.isFile() && isSkillFileName(entry.name)) {
        const skill = loadSkillFromFile(entryPath);
        if (skill) {
          skills.push(skill);
        }
      } else if (stat.isDirectory()) {
        skills.push(...loadSkillsFromDirectory(resolvedTarget, seen));
      }
      continue;
    }

    if (entry.isDirectory()) {
      skills.push(...loadSkillsFromDirectory(entryPath, seen));
    }
  }

  return skills;
}

/**
 * Get skill directories in precedence order (project first, then global).
 *
 * Each directory is resolved with `fs.realpathSync` so that, e.g., a project
 * `.alexi/skills` symlinked to the global skills dir is not loaded twice.
 */
export function skillDirectories(projectRoot: string): string[] {
  const dirs: string[] = [];
  const seenResolved = new Set<string>();
  const globalPaths = getGlobalPaths();

  const tryAdd = (candidate: string): void => {
    if (!fs.existsSync(candidate)) {
      return;
    }
    let resolved: string;
    try {
      resolved = fs.realpathSync(candidate);
    } catch (error) {
      console.warn(`Failed to resolve skill directory ${candidate}:`, error);
      return;
    }
    if (seenResolved.has(resolved)) {
      return;
    }
    seenResolved.add(resolved);
    dirs.push(candidate);
  };

  // Add project skills FIRST (higher precedence)
  tryAdd(path.join(projectRoot, '.alexi', 'skills'));

  // Add global skills (lower precedence)
  tryAdd(globalPaths.skills);

  return dirs;
}

/**
 * Built-in skills that cannot be removed
 */
const BUILTIN_SKILLS = new Set(['alexi-config', 'kilo-config']);

/**
 * Check if a skill is built-in
 */
export function isBuiltinSkill(skillName: string): boolean {
  return BUILTIN_SKILLS.has(skillName);
}

/**
 * Remove a skill by ID
 */
export function removeSkill(skillId: string): { success: boolean; error?: string } {
  if (isBuiltinSkill(skillId)) {
    return {
      success: false,
      error: `Cannot remove built-in skill: ${skillId}`,
    };
  }

  const registry = getSkillRegistry();
  const removed = registry.remove(skillId);

  if (!removed) {
    return {
      success: false,
      error: `Skill not found: ${skillId}`,
    };
  }

  return { success: true };
}

/**
 * Skill Registry - manages all available skills
 */
class SkillRegistry {
  private skills: Map<string, Skill> = new Map();
  private aliasMap: Map<string, string> = new Map();

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

/**
 * Re-scan all skill directories and replace the file-sourced entries in the
 * active registry.
 *
 * - Built-in skills (anything not loaded from a file) are preserved verbatim.
 * - File-sourced skills that no longer appear on disk are removed.
 * - New on-disk skills are added.
 * - Existing on-disk skills are refreshed in case their content changed.
 *
 * Publishes a `skill.reloaded` event with `{ added, removed, total }` counts.
 */
export function reloadSkills(projectRoot: string): {
  added: number;
  removed: number;
  total: number;
} {
  const registry = getSkillRegistry();

  // Snapshot the current file-sourced skills before re-scanning.
  const previousFileIds = new Set<string>();
  for (const skill of registry.list()) {
    if (skill.source === 'file') {
      previousFileIds.add(skill.id);
    }
  }

  // Re-scan all configured skill directories with a fresh visited set so a
  // call after a directory was newly created actually picks up the entries.
  const directories = skillDirectories(projectRoot);
  const seen = new Set<string>();
  const discovered: Skill[] = [];
  for (const dir of directories) {
    discovered.push(...loadSkillsFromDirectory(dir, seen));
  }

  // Deduplicate by id; first occurrence wins (project before global because
  // skillDirectories returns them in precedence order).
  const discoveredById = new Map<string, Skill>();
  for (const skill of discovered) {
    if (!discoveredById.has(skill.id)) {
      discoveredById.set(skill.id, skill);
    }
  }

  // Remove file-sourced skills that have disappeared. Built-ins (any non-file
  // source) are never touched here. We also defensively skip ids in the
  // BUILTIN_SKILLS set in case a built-in was somehow loaded as a file.
  let removed = 0;
  for (const id of previousFileIds) {
    if (discoveredById.has(id)) {
      continue;
    }
    if (isBuiltinSkill(id)) {
      continue;
    }
    if (registry.remove(id)) {
      removed++;
    }
  }

  // Register / refresh discovered skills. Track adds (skills that weren't
  // present as file-sourced before this reload).
  let added = 0;
  for (const skill of discoveredById.values()) {
    if (!previousFileIds.has(skill.id)) {
      added++;
    }
    registry.register(skill);
  }

  const total = registry.list().length;

  SkillReloaded.publish({
    added,
    removed,
    total,
    timestamp: Date.now(),
  });

  return { added, removed, total };
}

// Re-export
export { SkillRegistry };
