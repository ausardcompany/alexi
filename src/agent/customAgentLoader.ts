/**
 * Custom Agent Loader
 * Loads user-defined agents from markdown files with YAML frontmatter
 * and from JSON configuration (alexi.json / config.json).
 *
 * Search paths (in precedence order, lowest → highest):
 * 1. ~/.alexi/agents/*.md  (user-global)
 * 2. .alexi/agents/*.md    (project-local)
 *
 * Markdown format:
 * ---
 * name: "My Agent"
 * slug: my-agent          # optional, defaults to filename
 * aliases: [ma, myagent]
 * mode: all               # primary | subagent | all
 * model: gpt-4o           # SAP AI Core deployment ID or alias
 * tools: [read, write, edit, glob, grep, bash]
 * disabledTools: []
 * temperature: 0.3
 * maxTokens: 16384
 * ---
 *
 * You are a specialized agent for...
 */

import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import os from 'os';
import matter from 'gray-matter';
import { AgentSchema, type AgentConfig } from './index.js';

export type AgentSource = 'built-in' | 'user-global' | 'project-local' | 'config';

export interface CustomAgentConfig extends AgentConfig {
  /** Where this agent was loaded from */
  source: AgentSource;
  /** File path if loaded from a file */
  sourcePath?: string;
}

/**
 * Maximum recursion depth for nested file inclusions.
 */
const MAX_INCLUSION_DEPTH = 3;

/**
 * Resolve `{file:path/to/file}` inclusions in content.
 * Replaces each `{file:...}` tag with the referenced file's contents.
 * Paths are resolved relative to `basePath`.
 * Supports recursive inclusions up to `MAX_INCLUSION_DEPTH` levels.
 */
export async function resolveFileInclusions(
  content: string,
  basePath: string,
  depth: number = 0
): Promise<string> {
  const pattern = /\{file:([^}]+)\}/g;
  const matches = [...content.matchAll(pattern)];

  if (matches.length === 0) {
    return content;
  }

  let result = content;

  for (const match of matches) {
    const fullMatch = match[0];
    const filePath = match[1];
    const resolvedPath = path.resolve(basePath, filePath);

    if (depth >= MAX_INCLUSION_DEPTH) {
      result = result.replace(fullMatch, `<!-- ${fullMatch} max inclusion depth reached -->`);
      continue;
    }

    try {
      let fileContent = await fsPromises.readFile(resolvedPath, 'utf-8');
      // Recursively resolve inclusions in the included content
      fileContent = await resolveFileInclusions(fileContent, path.dirname(resolvedPath), depth + 1);
      result = result.replace(fullMatch, fileContent);
    } catch {
      result = result.replace(fullMatch, `<!-- {file:${filePath}} not found -->`);
    }
  }

  return result;
}

/**
 * Load a single agent from a markdown file with YAML frontmatter.
 * The markdown body becomes the agent's systemPrompt.
 */
export async function loadAgentFromFile(
  filePath: string,
  source: AgentSource
): Promise<CustomAgentConfig | null> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: promptContent } = matter(content);

    const id = data.slug || data.id || path.basename(filePath, path.extname(filePath));
    const resolvedContent = await resolveFileInclusions(promptContent, path.dirname(filePath));
    const systemPrompt = resolvedContent.trim();

    if (!systemPrompt) {
      // eslint-disable-next-line no-console
      console.warn(`[agent-loader] Skipping ${filePath}: empty system prompt`);
      return null;
    }

    const rawConfig = {
      id,
      name: data.name || id,
      displayName: data.displayName,
      description: data.description || `Custom agent: ${id}`,
      mode: data.mode || 'all',
      systemPrompt,
      tools: data.tools,
      disabledTools: data.disabledTools,
      preferredModel: data.model || data.preferredModel,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      aliases: data.aliases,
      options: data.options,
    };

    // Validate via Zod — strip undefined fields first
    const cleaned = Object.fromEntries(
      Object.entries(rawConfig).filter(([, v]) => v !== undefined)
    );

    const validated = AgentSchema.parse(cleaned);

    return {
      ...validated,
      source,
      sourcePath: filePath,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.warn(`[agent-loader] Failed to load agent from ${filePath}: ${message}`);
    return null;
  }
}

/**
 * Load all agents from a directory of markdown files.
 */
export async function loadAgentsFromDirectory(
  dirPath: string,
  source: AgentSource
): Promise<CustomAgentConfig[]> {
  const agents: CustomAgentConfig[] = [];

  if (!fs.existsSync(dirPath)) {
    return agents;
  }

  try {
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith('.md'))
      .sort();

    for (const file of files) {
      const agent = await loadAgentFromFile(path.join(dirPath, file), source);
      if (agent) {
        agents.push(agent);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.warn(`[agent-loader] Failed to read directory ${dirPath}: ${message}`);
  }

  return agents;
}

/**
 * Load agents from a JSON config object (e.g., from alexi.json).
 * Expected format:
 * {
 *   "agents": {
 *     "my-agent": {
 *       "name": "My Agent",
 *       "description": "...",
 *       "prompt": "You are...",
 *       ...
 *     }
 *   }
 * }
 */
export function loadAgentsFromConfig(config: Record<string, unknown>): CustomAgentConfig[] {
  const agents: CustomAgentConfig[] = [];
  const agentsSection = config.agents;

  if (!agentsSection || typeof agentsSection !== 'object') {
    return agents;
  }

  for (const [id, value] of Object.entries(agentsSection as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') {
      continue;
    }

    const data = value as Record<string, unknown>;

    try {
      const rawConfig = {
        id,
        name: (data.name as string) || id,
        description: (data.description as string) || `Custom agent: ${id}`,
        mode: (data.mode as string) || 'all',
        systemPrompt: (data.prompt as string) || (data.systemPrompt as string) || '',
        tools: data.tools as string[] | undefined,
        disabledTools: data.disabledTools as string[] | undefined,
        preferredModel: (data.model as string) || (data.preferredModel as string),
        temperature: data.temperature as number | undefined,
        maxTokens: data.maxTokens as number | undefined,
        aliases: data.aliases as string[] | undefined,
      };

      const cleaned = Object.fromEntries(
        Object.entries(rawConfig).filter(([, v]) => v !== undefined)
      );

      const validated = AgentSchema.parse(cleaned);

      agents.push({
        ...validated,
        source: 'config',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // eslint-disable-next-line no-console
      console.warn(`[agent-loader] Failed to load agent '${id}' from config: ${message}`);
    }
  }

  return agents;
}

/**
 * Load all custom agents from all default locations.
 *
 * Precedence (lowest → highest, last wins for duplicate IDs):
 * 1. ~/.alexi/agents/*.md  (user-global)
 * 2. .alexi/agents/*.md    (project-local)
 *
 * Returns all loaded agents. Duplicates are handled by the caller
 * (AgentRegistry.register overwrites on same ID).
 */
export async function loadAllCustomAgents(workdir?: string): Promise<CustomAgentConfig[]> {
  const cwd = workdir || process.cwd();

  const userDir = path.join(os.homedir(), '.alexi', 'agents');
  const projectDir = path.join(cwd, '.alexi', 'agents');

  // Load in precedence order (lowest first — registry overwrites on duplicate)
  const userAgents = await loadAgentsFromDirectory(userDir, 'user-global');
  const projectAgents = await loadAgentsFromDirectory(projectDir, 'project-local');

  return [...userAgents, ...projectAgents];
}
