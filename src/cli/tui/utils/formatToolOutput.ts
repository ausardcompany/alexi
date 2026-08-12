/**
 * Utilities for formatting tool output in the TUI.
 *
 * These helpers are pure string transformations kept separate from the
 * React components so they can be unit-tested without a render harness.
 */

const DEFAULT_MAX_OUTPUT_LINES = 20;
const DEFAULT_TRUNCATED_OUTPUT_LINES = 15;
const DEFAULT_PARAM_PREVIEW_LEN = 50;

/**
 * Format a bash command with the classic terminal `$ ` prefix.
 *
 * The prefix is intentionally NOT bolded here — styling is applied by the
 * caller through Ink's `<Text bold>` element so the raw string stays easy
 * to test and reason about.
 */
export function formatBashCommand(command: string): string {
  const trimmed = command.trimEnd();
  return `$ ${trimmed}`;
}

export interface TruncatedOutput {
  text: string;
  truncated: boolean;
  remaining: number;
}

/**
 * Truncate multi-line output to at most `maxLines`. When truncation is
 * triggered we keep the first `keepLines` lines and return how many were
 * hidden so the caller can render a "N more lines" hint.
 */
export function truncateOutput(
  text: string,
  maxLines: number = DEFAULT_MAX_OUTPUT_LINES,
  keepLines: number = DEFAULT_TRUNCATED_OUTPUT_LINES
): TruncatedOutput {
  const lines = text.split('\n');
  if (lines.length > maxLines) {
    const remaining = lines.length - keepLines;
    return {
      text: lines.slice(0, keepLines).join('\n'),
      truncated: true,
      remaining,
    };
  }
  return { text, truncated: false, remaining: 0 };
}

/**
 * Render a compact "key: value" preview of the most relevant tool
 * parameter. Long values are truncated with an ellipsis.
 */
export function formatParamsPreview(
  params: Record<string, unknown>,
  maxLen: number = DEFAULT_PARAM_PREVIEW_LEN
): string {
  const entries = Object.entries(params);
  if (entries.length === 0) {
    return '';
  }
  const keyParams = ['filePath', 'path', 'file', 'command', 'pattern', 'query'];
  for (const key of keyParams) {
    if (key in params) {
      const val = String(params[key]);
      return val.length > maxLen ? `${key}: ${val.slice(0, maxLen)}\u2026` : `${key}: ${val}`;
    }
  }
  const [key, val] = entries[0];
  const valStr = String(val);
  return valStr.length > maxLen ? `${key}: ${valStr.slice(0, maxLen)}\u2026` : `${key}: ${valStr}`;
}

/**
 * Human-friendly duration string (ms or s with one decimal).
 */
export function formatDuration(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${ms}ms`;
}

/**
 * Best-effort language guess for a file path, used to drive syntax
 * highlighting of diffs. Returns `undefined` when no reasonable guess
 * can be made — callers should fall back to plain text in that case.
 */
export function guessLanguageFromPath(filePath: string): string | undefined {
  const match = /\.([a-zA-Z0-9]+)$/.exec(filePath);
  if (!match) {
    return undefined;
  }
  const ext = match[1].toLowerCase();
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
    sh: 'bash',
    bash: 'bash',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    css: 'css',
    scss: 'scss',
    html: 'html',
    xml: 'xml',
    toml: 'toml',
  };
  return map[ext];
}
