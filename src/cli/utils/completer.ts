/**
 * Shared autocomplete engine for both the readline REPL and Ink TUI.
 *
 * Provides fuzzy-matched completions for slash commands, model names,
 * and file paths. Framework-agnostic — no React or Ink dependencies.
 *
 * @module completer
 */

import * as fs from 'fs';
import * as path from 'path';
import { ORCHESTRATION_MODELS } from '../../providers/sapOrchestration.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single completion suggestion. */
export interface CompletionItem {
  /** The completion text to insert. */
  text: string;
  /** What to show in the menu (e.g. "/model  — Switch model"). */
  display: string;
  /** Sort score (higher = better match). */
  score: number;
  /** The kind of completion. */
  kind: 'command' | 'model' | 'path';
}

/** Result returned by every `complete*` function. */
export interface CompletionResult {
  items: CompletionItem[];
  /** The character offset in the input where the replacement begins. */
  replacementStart: number;
  /** The length of the text being replaced. */
  replacementLength: number;
}

// ---------------------------------------------------------------------------
// Slash-command registry
// ---------------------------------------------------------------------------

/**
 * Lightweight slash-command definition used by the autocomplete engine.
 *
 * Unlike the TUI's `SlashCommand` this carries no React components, making it
 * safe to import from any context (readline, tests, etc.).
 */
export interface CommandDef {
  /** Primary command name, e.g. `'model'`. */
  name: string;
  /** Optional aliases, e.g. `['m']`. */
  aliases?: string[];
  /** Short human-readable description. */
  description: string;
  /** Grouping category, e.g. `'general'`, `'session'`, `'config'`. */
  category: string;
  /** When `true` the first argument should be completed as a model name. */
  completesModel?: boolean;
  /** When `true` the first argument should be completed as a file path. */
  completesPath?: boolean;
}

/**
 * Full slash-command registry.
 *
 * Extracted from the REPL's `printHelp()` and its `switch` dispatcher so that
 * completions stay in sync with the actual command surface.
 */
export const SLASH_COMMANDS: readonly CommandDef[] = [
  // -- general ---------------------------------------------------------------
  { name: 'help', aliases: ['h'], description: 'Show help message', category: 'general' },
  { name: 'exit', aliases: ['quit', 'q'], description: 'Exit the REPL', category: 'general' },
  { name: 'clear', description: 'Clear screen', category: 'general' },
  { name: 'agent', description: 'Switch agent', category: 'general' },
  { name: 'stage', description: 'Switch development stage', category: 'general' },
  { name: 'dod', description: 'Run Definition of Done checks', category: 'general' },
  {
    name: 'bug',
    aliases: ['feedback'],
    description: 'Report issues and feedback',
    category: 'general',
  },
  {
    name: 'export',
    description: 'Export data to file',
    category: 'general',
    completesPath: true,
  },
  {
    name: 'import',
    description: 'Import data from file',
    category: 'general',
    completesPath: true,
  },
  { name: 'map', description: 'Show repo map', category: 'general' },
  { name: 'map-refresh', description: 'Rebuild repo map', category: 'general' },
  { name: 'map-tokens', description: 'Set repo map token budget', category: 'general' },

  // -- model -----------------------------------------------------------------
  {
    name: 'model',
    description: 'Switch to a different model',
    category: 'model',
    completesModel: true,
  },
  { name: 'models', description: 'Pick a model (interactive selector)', category: 'model' },
  { name: 'autoroute', description: 'Toggle auto model routing', category: 'model' },

  // -- session ---------------------------------------------------------------
  { name: 'session', description: 'Show/manage session info', category: 'session' },
  { name: 'sessions', description: 'List all sessions', category: 'session' },
  { name: 'history', description: 'Show conversation history', category: 'session' },
  { name: 'tokens', description: 'Show token usage stats', category: 'session' },
  { name: 'compact', description: 'Trigger manual context compaction', category: 'session' },
  { name: 'context', description: 'Show context usage', category: 'session' },
  { name: 'status', description: 'Show current status', category: 'session' },
  { name: 'fork', description: 'Fork current session', category: 'session' },
  { name: 'rename', description: 'Rename current session', category: 'session' },
  {
    name: 'clear-history',
    description: 'Clear conversation history',
    category: 'session',
  },
  { name: 'cost', description: 'Show cost summary', category: 'session' },
  { name: 'remember', description: 'Save a memory', category: 'session' },
  { name: 'mem', description: 'Manage memories', category: 'session' },
  { name: 'stats', description: 'Show usage statistics', category: 'session' },

  // -- config ----------------------------------------------------------------
  { name: 'system', description: 'Set system prompt', category: 'config' },
  { name: 'config', description: 'Show/set configuration', category: 'config' },
  { name: 'permissions', description: 'List/reset permission rules', category: 'config' },
  { name: 'mcp', description: 'Manage MCP servers', category: 'config' },
  { name: 'think', description: 'Toggle extended thinking mode', category: 'config' },
  { name: 'effort', description: 'Set effort level', category: 'config' },
  { name: 'doctor', description: 'Run environment health checks', category: 'config' },
  { name: 'memory', description: 'List/edit instruction files', category: 'config' },
  { name: 'alias', description: 'Manage command aliases', category: 'config' },
  { name: 'snippet', description: 'Manage code snippets', category: 'config' },
  { name: 'template', description: 'Manage message templates', category: 'config' },
  { name: 't', description: 'Apply a template', category: 'config' },

  // -- git -------------------------------------------------------------------
  { name: 'diff', description: 'Show files changed in current session', category: 'git' },
  { name: 'undo', description: 'Undo last file change', category: 'git' },
  { name: 'redo', description: 'Redo last undone change', category: 'git' },
  { name: 'commit', description: 'Force commit pending changes', category: 'git' },
  { name: 'git', description: 'Run a git command', category: 'git' },
  { name: 'git-log', description: 'Show recent AI commits', category: 'git' },
  { name: 'git-config', description: 'Show git config', category: 'git' },
] as const;

// ---------------------------------------------------------------------------
// Fuzzy matching
// ---------------------------------------------------------------------------

/** Result of a fuzzy match attempt. */
export interface FuzzyMatchResult {
  match: boolean;
  score: number;
}

/**
 * Score how well `query` matches `target` using a lightweight fuzzy algorithm.
 *
 * Scoring rules:
 * - **Prefix match** — `target.startsWith(query)`:
 *   `score = query.length / target.length * 100 + 50`
 * - **Subsequence match** — every character in `query` appears in `target` in
 *   order: `score = consecutiveMatches * 10`
 * - Otherwise — no match.
 *
 * @param query  The user's partial input (lower-cased internally).
 * @param target The candidate string to test against (lower-cased internally).
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatchResult {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (q.length === 0) {
    return { match: true, score: 0 };
  }

  // Prefix match — highest quality.
  if (t.startsWith(q)) {
    return { match: true, score: (q.length / t.length) * 100 + 50 };
  }

  // Subsequence match — every char in q appears in t in order.
  let qi = 0;
  let consecutive = 0;
  let maxConsecutive = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      consecutive++;
      if (consecutive > maxConsecutive) {
        maxConsecutive = consecutive;
      }
      qi++;
    } else {
      consecutive = 0;
    }
  }

  if (qi === q.length) {
    return { match: true, score: maxConsecutive * 10 };
  }

  return { match: false, score: 0 };
}

// ---------------------------------------------------------------------------
// Completion helpers
// ---------------------------------------------------------------------------

/**
 * Build an index mapping every name **and** alias to its owning `CommandDef`.
 * Computed once at module load time.
 */
function buildNameIndex(): Map<string, CommandDef> {
  const idx = new Map<string, CommandDef>();
  for (const cmd of SLASH_COMMANDS) {
    idx.set(cmd.name, cmd);
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        idx.set(alias, cmd);
      }
    }
  }
  return idx;
}

const NAME_INDEX = buildNameIndex();

// ---------------------------------------------------------------------------
// Complete functions
// ---------------------------------------------------------------------------

/**
 * Complete a partial slash-command (the text after `/`, before any space).
 *
 * @example
 * ```ts
 * completeSlashCommand('mod');
 * // → items for /model, /models, …
 * ```
 */
export function completeSlashCommand(partial: string): CompletionResult {
  const items: CompletionItem[] = [];

  for (const [name, cmd] of NAME_INDEX) {
    const result = fuzzyMatch(partial, name);
    if (result.match) {
      const isAlias = name !== cmd.name;
      const label = isAlias ? `/${name} (→ /${cmd.name})` : `/${name}`;
      items.push({
        text: `/${name}`,
        display: `${label}  — ${cmd.description}`,
        score: result.score,
        kind: 'command',
      });
    }
  }

  items.sort((a, b) => b.score - a.score);

  return {
    items,
    replacementStart: 0,
    replacementLength: partial.length + 1, // include the leading `/`
  };
}

/**
 * Complete a partial model name against `ORCHESTRATION_MODELS`.
 *
 * @param partial Text typed after `/model ` (e.g. `"gpt"`).
 */
export function completeModelName(partial: string): CompletionResult {
  const items: CompletionItem[] = [];

  for (const model of ORCHESTRATION_MODELS) {
    const result = fuzzyMatch(partial, model);
    if (result.match) {
      items.push({
        text: model,
        display: model,
        score: result.score,
        kind: 'model',
      });
    }
  }

  items.sort((a, b) => b.score - a.score);

  return {
    items,
    replacementStart: '/model '.length,
    replacementLength: partial.length,
  };
}

/** Maximum number of file-path completions returned. */
const MAX_PATH_RESULTS = 20;

/**
 * Complete a partial file path relative to `cwd`.
 *
 * Directories are suffixed with `/`. At most {@link MAX_PATH_RESULTS} results
 * are returned to avoid flooding the UI on large directories.
 *
 * @param partial A (possibly incomplete) relative or absolute path fragment.
 * @param cwd    The working directory used to resolve relative paths.
 */
export function completeFilePath(partial: string, cwd: string): CompletionResult {
  const resolved = path.resolve(cwd, partial);
  const dir = partial.endsWith('/') ? resolved : path.dirname(resolved);
  const prefix = partial.endsWith('/') ? '' : path.basename(resolved);

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return { items: [], replacementStart: 0, replacementLength: partial.length };
  }

  const items: CompletionItem[] = [];
  const lowerPrefix = prefix.toLowerCase();

  for (const entry of entries) {
    if (!entry.name.toLowerCase().startsWith(lowerPrefix)) {
      continue;
    }

    // Skip hidden files unless the user explicitly typed a dot.
    if (entry.name.startsWith('.') && !prefix.startsWith('.')) {
      continue;
    }

    const isDir = entry.isDirectory();
    const suffix = isDir ? '/' : '';
    const dirPortion = partial.endsWith('/')
      ? partial
      : partial.substring(0, partial.length - prefix.length);
    const text = `${dirPortion}${entry.name}${suffix}`;

    items.push({
      text,
      display: `${entry.name}${suffix}`,
      score: prefix.length > 0 ? (prefix.length / entry.name.length) * 100 + 50 : 0,
      kind: 'path',
    });

    if (items.length >= MAX_PATH_RESULTS) {
      break;
    }
  }

  items.sort((a, b) => b.score - a.score || a.text.localeCompare(b.text));

  return {
    items,
    replacementStart: 0,
    replacementLength: partial.length,
  };
}

/**
 * Find the `CommandDef` that matches the first word of `line` (after `/`).
 *
 * @returns The matching command, or `undefined` if none match.
 */
function findCommandForLine(line: string): CommandDef | undefined {
  const match = line.match(/^\/(\S+)/);
  if (!match) {
    return undefined;
  }
  return NAME_INDEX.get(match[1]);
}

/**
 * Main entry point — dispatches to the appropriate completer based on the
 * current input line.
 *
 * Dispatch rules (evaluated in order):
 * 1. `/` with no space → slash-command completion
 * 2. `/model <partial>` → model-name completion
 * 3. Slash command with `completesPath` + space → file-path completion
 * 4. `@<partial>` anywhere in the line → file-path completion
 * 5. Otherwise → empty result
 *
 * @param line The full current input line.
 * @param cwd  Working directory for path resolution.
 */
export function completeLine(line: string, cwd: string): CompletionResult {
  const empty: CompletionResult = { items: [], replacementStart: 0, replacementLength: 0 };

  // 1. Slash-command completion (no space yet → still typing the command name).
  if (line.startsWith('/') && !line.includes(' ')) {
    const partial = line.slice(1); // strip leading `/`
    return completeSlashCommand(partial);
  }

  // 2. Model-name completion after `/model `.
  if (line.startsWith('/model ')) {
    const partial = line.slice('/model '.length);
    return completeModelName(partial);
  }

  // 3. Path completion for commands flagged with `completesPath`.
  const cmd = findCommandForLine(line);
  if (cmd?.completesPath) {
    const spaceIdx = line.indexOf(' ');
    if (spaceIdx !== -1) {
      const partial = line.slice(spaceIdx + 1);
      const result = completeFilePath(partial, cwd);
      // Shift replacement positions to account for the command prefix.
      return {
        items: result.items,
        replacementStart: spaceIdx + 1 + result.replacementStart,
        replacementLength: result.replacementLength,
      };
    }
  }

  // 4. `@path` completion — find the last `@` and complete the text after it.
  const atIdx = line.lastIndexOf('@');
  if (atIdx !== -1) {
    const partial = line.slice(atIdx + 1);
    // Only trigger when the `@` is preceded by whitespace or is at position 0,
    // and the partial doesn't contain spaces (indicating it's still a path).
    if ((atIdx === 0 || /\s/.test(line[atIdx - 1])) && !partial.includes(' ')) {
      const result = completeFilePath(partial, cwd);
      return {
        items: result.items,
        replacementStart: atIdx + 1 + result.replacementStart,
        replacementLength: result.replacementLength,
      };
    }
  }

  return empty;
}

// ---------------------------------------------------------------------------
// Readline adapter
// ---------------------------------------------------------------------------

/**
 * Adapter for Node.js `readline.createInterface({ completer })`.
 *
 * Usage:
 * ```ts
 * import { readlineCompleter } from './completer.js';
 * const rl = readline.createInterface({ input, output, completer: readlineCompleter });
 * ```
 *
 * @param line     The current input line from readline.
 * @param callback Standard readline completer callback.
 */
export function readlineCompleter(
  line: string,
  callback: (err: null, result: [string[], string]) => void
): void {
  const result = completeLine(line, process.cwd());

  if (result.items.length === 0) {
    callback(null, [[], line]);
    return;
  }

  const prefix = line.slice(0, result.replacementStart);
  const completions = result.items.map((item) => `${prefix}${item.text}`);

  callback(null, [completions, line]);
}
