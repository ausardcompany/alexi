/**
 * System Prompt Assembly Pipeline
 *
 * Assembles a complete system prompt by layering:
 *   1. Soul (core identity)
 *   2. Model-specific instructions
 *   3. Environment info
 *   4. Agent role prompt
 *   5. Instruction files (AGENTS.md, ~/.alexi/ALEXI.md, .alexi/rules/*.md)
 *   6. Custom rules (user-provided)
 *
 * Each layer is optional and only included when applicable.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execSync } from 'child_process';

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
 * Load all instruction files and return them as a combined tagged block.
 *
 * Sources (in order):
 *   1. Project-level AGENTS.md  (workdir/AGENTS.md)
 *   2. User-level ALEXI.md     (~/.alexi/ALEXI.md)
 *   3. Project-level rule files (workdir/.alexi/rules/*.md)
 */
function loadInstructionFiles(workdir: string): string {
  const parts: string[] = [];

  // 1. Project AGENTS.md
  const agentsMd = loadTextFile(path.join(workdir, 'AGENTS.md'));
  if (agentsMd) {
    parts.push(`<agents-md>\n${agentsMd}\n</agents-md>`);
  }

  // 2. User-level ~/.alexi/ALEXI.md
  const userMd = loadTextFile(path.join(os.homedir(), '.alexi', 'ALEXI.md'));
  if (userMd) {
    parts.push(`<user-instructions>\n${userMd}\n</user-instructions>`);
  }

  // 3. Project .alexi/rules/*.md
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
// Assembly
// ---------------------------------------------------------------------------

export interface AssembleOptions {
  /** Agent ID (e.g. 'code', 'debug', 'plan'). Determines which agent role prompt to include. */
  agentId?: string;
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
}

/**
 * Assemble a complete system prompt from layered components.
 *
 * Layer order (cache-friendly — stable content first):
 *   1. Soul prompt (core identity, always included)
 *   2. Model-specific prompt (based on modelId)
 *   3. Environment info block
 *   4. Agent role prompt (based on agentId)
 *   5. Instruction files (AGENTS.md, ~/.alexi/ALEXI.md, .alexi/rules/*.md)
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

  // 4. Agent role prompt
  if (options.agentId) {
    const agentPrompt = AGENT_PROMPTS[options.agentId];
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

  // 6. Custom rules
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
