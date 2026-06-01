/**
 * System Prompt Assembly Pipeline
 *
 * Assembles a complete system prompt by layering:
 *   1. Soul (core identity)
 *   2. Model-specific instructions
 *   3. Environment info
 *   4. Agent role prompt
 *   5. Instruction files (AGENTS.md, ~/.alexi/ALEXI.md, .alexi/rules/*.md)
 *   6. Plugin rule contributions (from enabled plugins' plugin.json)
 *   7. Custom rules (user-provided)
 *
 * Each layer is optional and only included when applicable.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execSync } from 'child_process';
import { getEnabledPluginRules, type ResolvedPluginRule } from '../plugin/index.js';

// ---------------------------------------------------------------------------
// Prompt file loading
// ---------------------------------------------------------------------------

/** Resolve a path relative to the prompts/ directory next to this file. */
function promptPath(filename: string): string {
  return new URL(`./prompts/${filename}`, import.meta.url).pathname;
}

/** Read a prompt text file. Returns empty string if the file doesn't exist. */
function readPromptFile(filename: string): string {
  try {
    return fs.readFileSync(promptPath(filename), 'utf-8').trim();
  } catch {
    return '';
  }
}

// Pre-load all prompt files at module init time (sync, one-time cost).
const SOUL_PROMPT = readPromptFile('soul.txt');

const MODEL_PROMPTS: Record<string, string> = {
  anthropic: readPromptFile('anthropic.txt'),
  openai: readPromptFile('openai.txt'),
  gemini: readPromptFile('gemini.txt'),
  ling: readPromptFile('ling.txt'),
  default: readPromptFile('default.txt'),
};

const AGENT_PROMPTS: Record<string, string> = {
  code: readPromptFile('code.txt'),
  debug: readPromptFile('debug.txt'),
  plan: readPromptFile('plan.txt'),
  explore: readPromptFile('explore.txt'),
  ask: readPromptFile('ask.txt'),
  orchestrator: readPromptFile('orchestrator.txt'),
};

// ---------------------------------------------------------------------------
// Model → prompt-key mapping
// ---------------------------------------------------------------------------

/**
 * Map a SAP AI Core model ID to a prompt-key used for model-specific prompts.
 *
 * Model ID patterns (from ORCHESTRATION_MODELS):
 *   - `anthropic--claude-*`   → 'anthropic'
 *   - `gpt-*`                 → 'openai'
 *   - `gemini-*`              → 'gemini'
 *   - `ling-*` or contains 'ling' → 'ling'
 *   - Everything else         → 'default'
 */
export function getModelPromptKey(modelId: string): string {
  const id = modelId.toLowerCase();

  if (id.startsWith('anthropic--')) {
    return 'anthropic';
  }
  if (id.startsWith('gpt-')) {
    return 'openai';
  }
  if (id.startsWith('gemini-')) {
    return 'gemini';
  }
  // Check for Ling models (avoiding false positives like kling, bling)
  if (id.startsWith('ling-') || id.startsWith('ling_')) {
    return 'ling';
  }
  // Check for ling after separator
  if (id.match(/[/:]ling[-_]/)) {
    return 'ling';
  }
  return 'default';
}

// ---------------------------------------------------------------------------
// Environment info
// ---------------------------------------------------------------------------

interface EnvInfo {
  workdir: string;
  isGitRepo: boolean;
  platform: string;
  date: string;
  modelId?: string;
}

function detectGitRepo(workdir: string): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd: workdir,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

function buildEnvBlock(info: EnvInfo): string {
  const lines = [
    '<env>',
    `  Working directory: ${info.workdir}`,
    `  Is directory a git repo: ${info.isGitRepo ? 'yes' : 'no'}`,
    `  Platform: ${info.platform}`,
    `  Today's date: ${info.date}`,
  ];
  if (info.modelId) {
    lines.push(`  Model: ${info.modelId}`);
  }
  lines.push('</env>');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Instruction file loading (AGENTS.md, ALEXI.md, .alexi/rules/)
// ---------------------------------------------------------------------------

/** Load a single text file, returning empty string on failure. */
function loadTextFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim();
  } catch {
    return '';
  }
}

/**
 * Resolve a path to its real (canonical) form. Falls back to the literal path
 * if resolution fails (e.g. file does not exist or symlink loop).
 */
function safeRealpath(p: string): string {
  try {
    return fs.realpathSync(p);
  } catch {
    return p;
  }
}

/**
 * Find the first existing user-level AGENTS.md, searching in this order:
 *   1. $XDG_CONFIG_HOME/AGENTS.md (if XDG_CONFIG_HOME is set)
 *   2. ~/.config/AGENTS.md
 *   3. ~/AGENTS.md
 *
 * Returns the resolved (realpath) path of the first hit, or null if none exist.
 * Skips any candidate whose resolved path equals `excludeResolved` (used to
 * de-dup against the project AGENTS.md).
 */
function findGlobalAgentsMd(excludeResolved: string | null): string | null {
  const candidates: string[] = [];
  if (process.env.XDG_CONFIG_HOME) {
    candidates.push(path.join(process.env.XDG_CONFIG_HOME, 'AGENTS.md'));
  }
  candidates.push(path.join(os.homedir(), '.config', 'AGENTS.md'));
  candidates.push(path.join(os.homedir(), 'AGENTS.md'));

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) {
      continue;
    }
    const resolved = safeRealpath(candidate);
    if (excludeResolved !== null && resolved === excludeResolved) {
      // Same file as project AGENTS.md — skip to avoid duplication.
      continue;
    }
    return resolved;
  }
  return null;
}

/**
 * Load all instruction files and return them as a combined tagged block.
 *
 * Sources (in order):
 *   1. Project-level AGENTS.md  (workdir/AGENTS.md)
 *   2. Global AGENTS.md         ($XDG_CONFIG_HOME/AGENTS.md → ~/.config/AGENTS.md → ~/AGENTS.md)
 *   3. User-level ALEXI.md      (~/.alexi/ALEXI.md)
 *   4. Project-level rule files (workdir/.alexi/rules/*.md)
 */
function loadInstructionFiles(workdir: string): string {
  const parts: string[] = [];

  // 1. Project AGENTS.md
  const projectAgentsPath = path.join(workdir, 'AGENTS.md');
  const agentsMd = loadTextFile(projectAgentsPath);
  let projectAgentsResolved: string | null = null;
  if (agentsMd) {
    parts.push(`<agents-md>\n${agentsMd}\n</agents-md>`);
    projectAgentsResolved = safeRealpath(projectAgentsPath);
  }

  // 2. Global AGENTS.md (XDG_CONFIG_HOME → ~/.config → ~)
  const globalAgentsPath = findGlobalAgentsMd(projectAgentsResolved);
  if (globalAgentsPath) {
    const globalAgentsContent = loadTextFile(globalAgentsPath);
    if (globalAgentsContent) {
      parts.push(
        `<global-agents-md path="${globalAgentsPath}">\n${globalAgentsContent}\n</global-agents-md>`
      );
    }
  }

  // 3. User-level ~/.alexi/ALEXI.md
  const userMd = loadTextFile(path.join(os.homedir(), '.alexi', 'ALEXI.md'));
  if (userMd) {
    parts.push(`<user-instructions>\n${userMd}\n</user-instructions>`);
  }

  // 4. Project .alexi/rules/*.md
  const rulesDir = path.join(workdir, '.alexi', 'rules');
  try {
    const ruleFiles = fs
      .readdirSync(rulesDir)
      .filter((f) => f.endsWith('.md'))
      .sort();
    for (const rf of ruleFiles) {
      const content = loadTextFile(path.join(rulesDir, rf));
      if (content) {
        parts.push(`<rule file="${rf}">\n${content}\n</rule>`);
      }
    }
  } catch {
    // rules directory doesn't exist — that's fine
  }

  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Per-directory AGENTS.md discovery (used by file-touching tools at runtime)
// ---------------------------------------------------------------------------

/** A single per-directory AGENTS.md discovered during a tool call. */
export interface InstructionFile {
  /** Absolute realpath of the AGENTS.md file. */
  path: string;
  /** Trimmed contents of the file. */
  content: string;
}

/** Hard cap on the number of upward iterations to defend against cycles/symlink loops. */
const MAX_INSTRUCTION_WALK_DEPTH = 32;

/**
 * Walk from `path.dirname(absPath)` upward toward `workdir` (exclusive),
 * collecting any AGENTS.md found at each level. Skips files whose
 * realpath is already in `seen`. Mutates `seen` to add freshly emitted
 * paths. Returns nearest-first.
 *
 * Refuses to walk above `workdir`: if `absPath` is not inside `workdir`,
 * returns []. The project root AGENTS.md is intentionally excluded
 * because `loadInstructionFiles()` already injects it once per session.
 */
export function instructionsForPath(
  absPath: string,
  workdir: string,
  seen: Set<string>
): InstructionFile[] {
  const resolvedWorkdir = path.resolve(workdir);
  const resolvedAbs = path.resolve(absPath);

  // Refuse paths outside the workdir.
  const rel = path.relative(resolvedWorkdir, resolvedAbs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return [];
  }

  const collected: InstructionFile[] = [];
  let dir = path.dirname(resolvedAbs);
  let iterations = 0;

  while (iterations < MAX_INSTRUCTION_WALK_DEPTH) {
    iterations++;

    // Stop when we hit the workdir (exclusive) or filesystem root.
    if (dir === resolvedWorkdir) {
      break;
    }
    // Confirm dir is still strictly inside workdir.
    const dirRel = path.relative(resolvedWorkdir, dir);
    if (dirRel.startsWith('..') || path.isAbsolute(dirRel) || dirRel === '') {
      break;
    }

    const candidate = path.join(dir, 'AGENTS.md');
    if (fs.existsSync(candidate)) {
      const realpath = safeRealpath(candidate);
      if (!seen.has(realpath)) {
        seen.add(realpath);
        const content = loadTextFile(candidate);
        if (content) {
          collected.push({ path: realpath, content });
        }
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      // Reached filesystem root.
      break;
    }
    dir = parent;
  }

  return collected;
}

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

export interface AssembleOptions {
  /** Agent ID (e.g. 'code', 'debug', 'plan'). Determines which agent role prompt to include. */
  agentId?: string;
  /** Custom agent system prompt — used when agentId is not in the built-in AGENT_PROMPTS map. */
  agentPrompt?: string;
  /** SAP AI Core model ID. Determines which model-specific prompt to include. */
  modelId?: string;
  /** Working directory. Used for env info and AGENTS.md loading. */
  workdir?: string;
  /** Custom rules to append (e.g. from --system flag or /system command). */
  customRules?: string;
  /** Whether to skip environment info block (useful for tests). */
  skipEnv?: boolean;
  /** Whether to skip instruction file loading — AGENTS.md, ALEXI.md, rules (useful for tests). */
  skipAgentsMd?: boolean;
  /**
   * Override plugin rule resolution. When omitted, the assembler calls
   * `getEnabledPluginRules()` against the global plugin manager. Tests use
   * this hook to inject deterministic rules without touching disk.
   */
  pluginRules?: ResolvedPluginRule[];
  /** Skip plugin rule injection entirely (useful for tests). */
  skipPluginRules?: boolean;
}

/**
 * Format resolved plugin rules into a system-prompt block. Each rule is
 * wrapped in a small Markdown section so the model can still distinguish
 * which plugin contributed which guidance.
 *
 * NOTE on precedence: plugin rules are appended *after* the AGENTS.md block.
 * Models treat later content as additive, so AGENTS.md still wins on direct
 * conflicts — plugin rules supplement project guidance, they don't override it.
 */
function formatPluginRules(rules: ResolvedPluginRule[]): string {
  if (rules.length === 0) {
    return '';
  }
  const sections = rules.map(
    (rule) => `## Rules from plugin "${rule.pluginName}"\n${rule.content}`
  );
  return sections.join('\n\n');
}

/**
 * Assemble a complete system prompt from layered components.
 *
 * Layer order (cache-friendly — stable content first):
 *   1. Soul prompt (core identity, always included)
 *   2. Model-specific prompt (based on modelId)
 *   3. Environment info block
 *   4. Agent role prompt (based on agentId)
 *   5. Instruction files (AGENTS.md, global AGENTS.md, ~/.alexi/ALEXI.md, .alexi/rules/*.md)
 *   6. Custom rules (user-provided)
 */
export function buildAssembledSystemPrompt(options: AssembleOptions = {}): string {
  const workdir = options.workdir ?? process.cwd();
  const parts: string[] = [];

  // 1. Soul — core identity
  if (SOUL_PROMPT) {
    parts.push(SOUL_PROMPT);
  }

  // 2. Model-specific instructions
  if (options.modelId) {
    const key = getModelPromptKey(options.modelId);
    const modelPrompt = MODEL_PROMPTS[key];
    if (modelPrompt) {
      parts.push(modelPrompt);
    }
  }

  // 3. Environment info
  if (!options.skipEnv) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    const envBlock = buildEnvBlock({
      workdir,
      isGitRepo: detectGitRepo(workdir),
      platform: process.platform,
      date: dateStr,
      modelId: options.modelId,
    });
    parts.push(envBlock);
  }

  // 4. Agent role prompt (static built-in, or custom prompt passed via options)
  if (options.agentId) {
    const agentPrompt = AGENT_PROMPTS[options.agentId] || options.agentPrompt || '';
    if (agentPrompt) {
      parts.push(agentPrompt);
    }
  }

  // 5. Instruction files (AGENTS.md, ALEXI.md, .alexi/rules/)
  if (!options.skipAgentsMd) {
    const instructions = loadInstructionFiles(workdir);
    if (instructions) {
      parts.push(instructions);
    }
  }

  // 6. Plugin rule contributions — appended *after* AGENTS.md so the project
  //    AGENTS.md takes precedence on direct conflicts (the model treats later
  //    content as additive supplementation).
  if (!options.skipPluginRules) {
    const pluginRules = options.pluginRules ?? getEnabledPluginRules();
    const block = formatPluginRules(pluginRules);
    if (block) {
      parts.push(block);
    }
  }

  // 7. Custom rules
  if (options.customRules?.trim()) {
    parts.push(options.customRules.trim());
  }

  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Prompt accessors (for use by agent registry)
// ---------------------------------------------------------------------------

/**
 * Get the raw agent role prompt text for a given agent ID.
 * Returns empty string if not found.
 */
export function getAgentPrompt(agentId: string): string {
  return AGENT_PROMPTS[agentId] ?? '';
}

/**
 * Get the raw model-specific prompt text for a given model ID.
 * Returns the default prompt if no specific match.
 */
export function getModelPrompt(modelId: string): string {
  const key = getModelPromptKey(modelId);
  return MODEL_PROMPTS[key] ?? MODEL_PROMPTS['default'] ?? '';
}

/**
 * Get the soul prompt text.
 */
export function getSoulPrompt(): string {
  return SOUL_PROMPT;
}
