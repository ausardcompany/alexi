/**
 * Code Review Command - Structured correctness-bug review over `git diff`.
 *
 * Reuses the existing `code-review` skill prompt and lets the caller pick an
 * effort level (`low` / `medium` / `high`). The diff is read directly via
 * `child_process.execFile` (NOT the bash tool) so the executor stays
 * self-contained and easy to unit-test.
 *
 * Routing strategy by effort:
 *   - `high`   → prefer a reasoning-tier model (`reasoning === true`)
 *   - `low`    → prefer a cheap-tier model (`costTier === 'cheap'`)
 *   - `medium` → use `getDefaultModel()`
 *
 * `--fix` (auto-apply) and `--comment` (post inline PR comments) are
 * intentionally out of scope for this command and tracked separately.
 */

import { execFile } from 'child_process';
import * as path from 'path';

import { sendChat } from '../core/orchestrator.js';
import { agenticChat } from '../core/agenticChat.js';
import { getDefaultModel } from '../providers/index.js';
import { loadRoutingConfig } from '../config/routingConfig.js';
import { codeReviewSkill } from '../skill/skills/index.js';

/**
 * Promise wrapper around `execFile` that reads stdout from the standard
 * Node.js callback signature `(err, stdout, stderr)`. We avoid
 * `util.promisify` because it relies on `execFile[util.promisify.custom]`,
 * which is awkward to attach when the test suite stubs the entire
 * `child_process` module.
 */
function execFileAsync(
  file: string,
  args: string[],
  options: { cwd?: string; maxBuffer?: number }
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (err, stdout: string | Buffer, stderr: string | Buffer) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        stdout: typeof stdout === 'string' ? stdout : stdout.toString('utf-8'),
        stderr: typeof stderr === 'string' ? stderr : stderr.toString('utf-8'),
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CodeReviewEffort = 'low' | 'medium' | 'high';

export type CodeReviewTarget = 'uncommitted' | { base: string };

export interface CodeReviewOptions {
  /** Effort level — controls prompt verbosity and model routing. Default: `medium`. */
  effort?: CodeReviewEffort;
  /** What to review. `'uncommitted'` → `git diff HEAD`. Default: `'uncommitted'`. */
  target?: CodeReviewTarget;
  /** Working directory for the git invocation. Defaults to `process.cwd()`. */
  workdir?: string;
  /** Explicit model override — takes precedence over effort-based routing. */
  modelOverride?: string;
  /** AbortSignal for cancellation (e.g. Ctrl+C / Esc). */
  signal?: AbortSignal;
  /** Callback for human-readable progress messages. */
  onProgress?: (msg: string) => void;
  /**
   * If true, run a second apply pass that converts each `MUST FIX` finding
   * into concrete edits via the `edit`/`multiedit` tools. Default: false.
   */
  fix?: boolean;
  /** Hard cap on the number of `MUST FIX` findings to auto-apply. Default: 10. */
  fixMaxFindings?: number;
}

/** Per-finding outcome of an apply pass. */
export interface FixApplied {
  file: string;
  finding: string;
  status: 'applied' | 'skipped' | 'failed';
  reason?: string;
}

export interface CodeReviewResult {
  success: boolean;
  diffBytes: number;
  effort: CodeReviewEffort;
  /** Structured `MUST FIX / SHOULD IMPROVE / NICE TO HAVE` review (or skip message). */
  review: string;
  /** Resolved model id used for the review (empty for the empty-diff path). */
  modelUsed: string;
  totalTokens: number;
  elapsedMs: number;
  /** Optional error message — present when `success === false`. */
  error?: string;
  /** Per-finding outcome from the apply pass. Only set when `fix === true`. */
  fixesApplied?: FixApplied[];
}

// ---------------------------------------------------------------------------
// Effort prompt prefixes
// ---------------------------------------------------------------------------

const EFFORT_PREAMBLE: Record<CodeReviewEffort, string> = {
  low: 'Focus only on critical correctness bugs. Skip style and nice-to-haves.',
  medium: '',
  high:
    'Be thorough: trace edge cases, race conditions, error handling, ' +
    'security implications, and test coverage gaps.',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build the system prompt by prepending an effort-tag preamble to the
 * `code-review` skill prompt. Exported for snapshot-style testing.
 */
export function buildSystemPrompt(effort: CodeReviewEffort): string {
  const base = codeReviewSkill.prompt;
  const preamble = EFFORT_PREAMBLE[effort];
  if (!preamble) {
    return base;
  }
  return `${preamble}\n\n${base}`;
}

/**
 * Build the git arguments for the configured target.
 */
function buildGitDiffArgs(target: CodeReviewTarget): string[] {
  if (target === 'uncommitted') {
    return ['diff', 'HEAD'];
  }
  return ['diff', `${target.base}...HEAD`];
}

/**
 * Run `git diff` for the given target and return the raw diff text.
 * Uses `execFile` (no shell) so user-provided `base` strings can't be
 * interpreted as shell metacharacters.
 */
async function readGitDiff(target: CodeReviewTarget, workdir: string): Promise<string> {
  const args = buildGitDiffArgs(target);
  // 16 MiB buffer is plenty for normal review sizes; very large diffs are
  // truncated by the LLM context window anyway.
  const { stdout } = await execFileAsync('git', args, {
    cwd: workdir,
    maxBuffer: 16 * 1024 * 1024,
  });
  return stdout;
}

/**
 * Pick a model based on effort level using the configured routing config.
 * Falls back to `getDefaultModel()` when no suitable candidate exists.
 */
export function pickModelForEffort(effort: CodeReviewEffort): string {
  if (effort === 'medium') {
    return getDefaultModel();
  }

  const config = loadRoutingConfig();
  const enabled = config.models.filter((m) => (m as { enabled?: boolean }).enabled !== false);

  if (effort === 'high') {
    const reasoning = enabled.find((m) => m.reasoning === true && m.costTier === 'expensive');
    if (reasoning) {
      return reasoning.id;
    }
    const expensive = enabled.find((m) => m.costTier === 'expensive');
    if (expensive) {
      return expensive.id;
    }
  } else if (effort === 'low') {
    const cheap = enabled.find((m) => m.costTier === 'cheap');
    if (cheap) {
      return cheap.id;
    }
  }

  return getDefaultModel();
}

// ---------------------------------------------------------------------------
// Apply-pass helpers (`--fix`)
// ---------------------------------------------------------------------------

/** A single `MUST FIX` item parsed out of a structured review. */
export interface ParsedFinding {
  /** 1-based index assigned during parsing. */
  index: number;
  /** Repo-relative file path (best-effort). Empty when none could be parsed. */
  file: string;
  /** Optional line hint, when one was extracted from the finding text. */
  lineHint?: number;
  /** Full text of the finding (multi-line bullet body). */
  summary: string;
}

/** Tools the apply-pass agent is allowed to use. NEVER includes `bash`/`write`. */
export const APPLY_TOOL_ALLOWLIST: readonly string[] = [
  'read',
  'edit',
  'multiedit',
  'glob',
  'grep',
  'suggest',
];

/** Default cap on findings the apply pass will process. */
export const DEFAULT_FIX_MAX_FINDINGS = 10;

/**
 * Extract the `MUST FIX` section from a structured review and split it into
 * individual findings. Tolerant of formatting variation: bullets can use
 * `-`, `*`, or numbered prefixes; section headers can be `### MUST FIX` or
 * `## MUST FIX (Critical)` etc. Returns `[]` when the section is missing.
 */
export function parseMustFixFindings(review: string): ParsedFinding[] {
  // Locate the start of the MUST FIX section
  const lines = review.split('\n');
  let start = -1;
  let endHeader = -1;

  const headerRegex = /^#{1,6}\s+MUST FIX\b/i;
  const otherSectionRegex = /^#{1,6}\s+(SHOULD IMPROVE|NICE TO HAVE)\b/i;

  for (let i = 0; i < lines.length; i++) {
    if (headerRegex.test(lines[i])) {
      start = i + 1;
      // Find next major section
      for (let j = start; j < lines.length; j++) {
        if (otherSectionRegex.test(lines[j])) {
          endHeader = j;
          break;
        }
      }
      if (endHeader === -1) {
        endHeader = lines.length;
      }
      break;
    }
  }

  if (start === -1) {
    return [];
  }

  const sectionLines = lines.slice(start, endHeader);

  // Split bullets — a bullet starts with `-`, `*`, or `<digit>.`
  const bulletStart = /^\s*(?:-|\*|\d+\.)\s+/;
  const findings: string[] = [];
  let current: string[] = [];

  for (const ln of sectionLines) {
    if (bulletStart.test(ln)) {
      if (current.length > 0) {
        findings.push(current.join('\n').trim());
      }
      current = [ln.replace(bulletStart, '').trim()];
    } else if (current.length > 0 && ln.trim().length > 0) {
      // continuation of current bullet
      current.push(ln.trim());
    }
  }
  if (current.length > 0) {
    findings.push(current.join('\n').trim());
  }

  return findings
    .filter((f) => f.length > 0)
    .map((summary, i) => {
      const { file, lineHint } = extractFileHint(summary);
      return { index: i + 1, file, lineHint, summary };
    });
}

/**
 * Best-effort extraction of `file[:line]` from a finding's text. Recognises
 * inline-code (`` `path/to/file.ts:42` ``), bare paths with a line suffix,
 * and `in path/to/file.ts` phrasing.
 */
function extractFileHint(text: string): { file: string; lineHint?: number } {
  // Backtick-quoted path:line
  const codeMatch = text.match(/`([^`\s]+\.[a-zA-Z]{1,8})(?::(\d+))?`/);
  if (codeMatch) {
    return {
      file: codeMatch[1],
      lineHint: codeMatch[2] ? parseInt(codeMatch[2], 10) : undefined,
    };
  }
  // Bare path with `path/file.ext:line`
  const pathMatch = text.match(/(?:^|\s)([\w./-]+\/[\w.-]+\.[a-zA-Z]{1,8})(?::(\d+))?/);
  if (pathMatch) {
    return {
      file: pathMatch[1],
      lineHint: pathMatch[2] ? parseInt(pathMatch[2], 10) : undefined,
    };
  }
  return { file: '' };
}

/**
 * Given the full diff, return the set of files that appear in it. Used to
 * detect "unrelated dirty changes" when the target is `'uncommitted'`.
 */
function extractDiffFiles(diff: string): Set<string> {
  const files = new Set<string>();
  const re = /^diff --git a\/(\S+)\s+b\/(\S+)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(diff)) !== null) {
    files.add(m[1]);
    files.add(m[2]);
  }
  return files;
}

/**
 * Run `git status --porcelain` and return the set of files reported with
 * pending changes. Names are repo-relative.
 */
async function readGitStatusFiles(workdir: string): Promise<Set<string>> {
  const { stdout } = await execFileAsync('git', ['status', '--porcelain'], {
    cwd: workdir,
    maxBuffer: 4 * 1024 * 1024,
  });
  const out = new Set<string>();
  for (const raw of stdout.split('\n')) {
    if (raw.length === 0) {
      continue;
    }
    // Format: `XY <path>` (X/Y are status codes, then a space, then path).
    // Renames: `R  old -> new` — we capture both sides.
    const rest = raw.slice(3).trim();
    if (rest.length === 0) {
      continue;
    }
    if (rest.includes(' -> ')) {
      const [a, b] = rest.split(' -> ');
      out.add(a.trim());
      out.add(b.trim());
    } else {
      out.add(rest);
    }
  }
  return out;
}

/**
 * Determine the per-finding outcome of the apply pass by inspecting the
 * agent's tool-call summary. The matching is best-effort: tool calls are
 * matched against findings by file path.
 *
 * Rules:
 *   - Each finding starts as `skipped` (default — the agent did nothing).
 *   - First successful `edit`/`multiedit` referencing the finding's file
 *     promotes the finding to `applied`.
 *   - A failed `edit`/`multiedit` referencing the finding's file marks it
 *     `failed` (with the tool error as the reason) — but only if not
 *     already `applied`.
 *   - A `suggest` call referencing the finding's file (or unattributed if
 *     nothing else matched) records `skipped` with the suggestion text as
 *     the reason.
 */
export function reconcileFindingsWithToolCalls(
  findings: ParsedFinding[],
  toolCalls: ReadonlyArray<{
    name: string;
    success: boolean;
    error?: string;
    arguments?: string;
  }>
): FixApplied[] {
  // Normalise file paths for comparison.
  const norm = (p: string): string => p.replace(/^\.\//, '').replace(/\\/g, '/');

  // Initial outcomes — every finding starts as skipped (no action taken).
  const outcomes: FixApplied[] = findings.map((f) => ({
    file: f.file,
    finding: f.summary,
    status: 'skipped',
    reason: 'No matching edit produced by the planner.',
  }));

  for (const tc of toolCalls) {
    let args: Record<string, unknown> = {};
    if (tc.arguments) {
      try {
        args = JSON.parse(tc.arguments);
      } catch {
        // Ignore — invalid JSON args can't be matched to a finding.
        continue;
      }
    }

    const argFile = typeof args['filePath'] === 'string' ? norm(args['filePath'] as string) : '';
    const argFileBase = argFile ? path.posix.basename(argFile) : '';

    if (tc.name === 'edit' || tc.name === 'multiedit') {
      // Prefer matching to a finding that has not yet been resolved so that
      // multiple tool calls referencing the same file are distributed across
      // distinct findings instead of all collapsing onto findings[0].
      let matchedIdx = -1;
      let fallbackIdx = -1;
      for (let i = 0; i < findings.length; i++) {
        const fnFile = norm(findings[i].file);
        if (!fnFile) {
          continue;
        }
        const fnBase = path.posix.basename(fnFile);
        if (argFile === fnFile || (fnBase && fnBase === argFileBase)) {
          if (fallbackIdx === -1) {
            fallbackIdx = i;
          }
          if (outcomes[i].status === 'skipped' && outcomes[i].reason?.startsWith('No matching')) {
            matchedIdx = i;
            break;
          }
        }
      }
      if (matchedIdx === -1) {
        matchedIdx = fallbackIdx;
      }
      if (matchedIdx >= 0) {
        if (tc.success) {
          outcomes[matchedIdx] = {
            file: findings[matchedIdx].file,
            finding: findings[matchedIdx].summary,
            status: 'applied',
          };
        } else if (outcomes[matchedIdx].status !== 'applied') {
          outcomes[matchedIdx] = {
            file: findings[matchedIdx].file,
            finding: findings[matchedIdx].summary,
            status: 'failed',
            reason: tc.error ?? 'edit tool failed',
          };
        }
      }
    } else if (tc.name === 'suggest') {
      const reason = typeof args['suggestion'] === 'string' ? (args['suggestion'] as string) : '';
      const suggestFile = typeof args['file'] === 'string' ? norm(args['file'] as string) : argFile;
      const suggestBase = suggestFile ? path.posix.basename(suggestFile) : '';

      let matchedIdx = -1;
      for (let i = 0; i < findings.length; i++) {
        const fnFile = norm(findings[i].file);
        if (!fnFile) {
          continue;
        }
        const fnBase = path.posix.basename(fnFile);
        if (suggestFile === fnFile || (fnBase && fnBase === suggestBase)) {
          matchedIdx = i;
          break;
        }
      }
      if (matchedIdx === -1) {
        // Fall back to the first finding still in the default state
        for (let i = 0; i < outcomes.length; i++) {
          if (outcomes[i].status === 'skipped' && outcomes[i].reason?.startsWith('No matching')) {
            matchedIdx = i;
            break;
          }
        }
      }
      if (matchedIdx >= 0 && outcomes[matchedIdx].status !== 'applied') {
        outcomes[matchedIdx] = {
          file: findings[matchedIdx].file,
          finding: findings[matchedIdx].summary,
          status: 'skipped',
          reason: reason || 'Planner deferred the fix via suggest tool.',
        };
      }
    }
  }

  return outcomes;
}

const APPLY_SYSTEM_PROMPT = `You are applying a code review. For each finding below, produce a minimal patch using the \`edit\` or \`multiedit\` tools. Do not introduce behaviour changes beyond the finding's stated correctness fix. If you cannot make the fix safely (ambiguous location, requires new tests, breaks the public API), call the \`suggest\` tool to record \`status: skipped\` and a reason. After all findings are addressed, stop.`;

/**
 * Build the user message for the apply pass: a numbered JSON list of
 * findings plus the original diff for context. The model is instructed to
 * use `edit`/`multiedit` for safe fixes and `suggest` to record skipped
 * items.
 */
function buildApplyUserMessage(findings: ParsedFinding[], diff: string): string {
  const findingsJson = JSON.stringify(
    findings.map((f) => ({
      index: f.index,
      file: f.file,
      lineHint: f.lineHint,
      summary: f.summary,
    })),
    null,
    2
  );
  return [
    'Apply the following MUST FIX findings:',
    '',
    '```json',
    findingsJson,
    '```',
    '',
    'Original diff for context:',
    '',
    '```diff',
    diff,
    '```',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Run a structured correctness-bug review over the current `git diff`.
 *
 * - Empty diff → returns `{ success: true, review: 'No changes to review.' }`
 *   without invoking the model.
 * - Otherwise → calls `sendChat` once (single-turn, no tool calls) with the
 *   skill prompt as the system message and the diff (in a fenced ```diff
 *   block) as the user message.
 *
 * When `fix === true`, runs a second apply pass via `agenticChat` that
 * converts each `MUST FIX` finding into concrete edits using the `edit`
 * and `multiedit` tools. Guard rails:
 *   - `effort: 'low'` is rejected (low-effort reviews are too noisy to
 *     auto-apply).
 *   - When the diff target is `'uncommitted'`, the working tree is checked
 *     for unrelated dirty files; if any exist, the apply pass is refused.
 *   - Findings beyond `fixMaxFindings` (default 10) are dropped and a
 *     truncation note is appended to the review.
 *   - The apply-pass agent is given a strict tool allowlist that excludes
 *     `bash` and `write`.
 */
export async function executeCodeReview(opts: CodeReviewOptions = {}): Promise<CodeReviewResult> {
  const effort: CodeReviewEffort = opts.effort ?? 'medium';
  const target: CodeReviewTarget = opts.target ?? 'uncommitted';
  const workdir = opts.workdir ?? process.cwd();
  const startTime = Date.now();
  const fix = opts.fix === true;
  const fixMaxFindings = opts.fixMaxFindings ?? DEFAULT_FIX_MAX_FINDINGS;

  if (opts.signal?.aborted) {
    throw new Error('Code review cancelled before start');
  }

  // Guard rail: refuse --fix at low effort.
  if (fix && effort === 'low') {
    return {
      success: false,
      diffBytes: 0,
      effort,
      review: '',
      modelUsed: '',
      totalTokens: 0,
      elapsedMs: Date.now() - startTime,
      error: 'Refusing --fix with effort=low: low-effort reviews are too noisy to auto-apply.',
    };
  }

  opts.onProgress?.(`Reading git diff (${target === 'uncommitted' ? 'uncommitted' : target.base})`);

  const diff = await readGitDiff(target, workdir);
  const diffBytes = Buffer.byteLength(diff, 'utf-8');

  if (diff.trim().length === 0) {
    return {
      success: true,
      diffBytes,
      effort,
      review: 'No changes to review.',
      modelUsed: '',
      totalTokens: 0,
      elapsedMs: Date.now() - startTime,
    };
  }

  if (opts.signal?.aborted) {
    throw new Error('Code review cancelled');
  }

  // Guard rail: refuse --fix when the working tree has unrelated dirty
  // changes, but only for the `uncommitted` target (the diff IS the dirty
  // tree in that case, so any file outside the diff is "unrelated").
  if (fix && target === 'uncommitted') {
    const dirty = await readGitStatusFiles(workdir);
    const inDiff = extractDiffFiles(diff);
    const unrelated: string[] = [];
    for (const f of dirty) {
      if (!inDiff.has(f)) {
        unrelated.push(f);
      }
    }
    if (unrelated.length > 0) {
      return {
        success: false,
        diffBytes,
        effort,
        review: '',
        modelUsed: '',
        totalTokens: 0,
        elapsedMs: Date.now() - startTime,
        error:
          "Refusing to auto-apply on top of uncommitted changes you didn't ask to review. " +
          `Stash or commit first. Unrelated files: ${unrelated.slice(0, 5).join(', ')}` +
          (unrelated.length > 5 ? `, ... (${unrelated.length - 5} more)` : ''),
      };
    }
  }

  const systemPrompt = buildSystemPrompt(effort);
  const modelId = opts.modelOverride ?? pickModelForEffort(effort);
  const userMessage = `Please review the following diff:\n\n\`\`\`diff\n${diff}\n\`\`\``;

  opts.onProgress?.(`Reviewing ${diffBytes} bytes with ${modelId} (effort=${effort})`);

  const result = await sendChat(userMessage, {
    modelOverride: modelId,
    systemPrompt,
  });

  const usage = result.usage ?? {};
  const totalTokens =
    (usage.total_tokens as number | undefined) ??
    ((usage.prompt_tokens as number | undefined) ?? 0) +
      ((usage.completion_tokens as number | undefined) ?? 0);

  let review = result.text;
  let totalTokensWithFix = totalTokens;
  let fixesApplied: FixApplied[] | undefined;

  if (fix) {
    const allFindings = parseMustFixFindings(review);
    const truncated = allFindings.length > fixMaxFindings;
    const findings = truncated ? allFindings.slice(0, fixMaxFindings) : allFindings;

    if (truncated) {
      review +=
        `\n\n> [code-review --fix] Found ${allFindings.length} MUST FIX findings; ` +
        `applying only the first ${fixMaxFindings} (fixMaxFindings cap). ` +
        'The remaining findings are listed above and require manual triage.';
    }

    if (findings.length === 0) {
      fixesApplied = [];
    } else {
      opts.onProgress?.(`Applying ${findings.length} MUST FIX finding(s) via agenticChat`);

      const applyUserMessage = buildApplyUserMessage(findings, diff);
      const applyResult = await agenticChat(applyUserMessage, {
        modelOverride: modelId,
        systemPrompt: APPLY_SYSTEM_PROMPT,
        workdir,
        enabledTools: APPLY_TOOL_ALLOWLIST.slice(),
        signal: opts.signal,
      });

      totalTokensWithFix += applyResult.usage.total_tokens ?? 0;
      fixesApplied = reconcileFindingsWithToolCalls(findings, applyResult.toolCallSummary);
    }
  }

  return {
    success: true,
    diffBytes,
    effort,
    review,
    modelUsed: result.modelUsed ?? modelId,
    totalTokens: totalTokensWithFix,
    elapsedMs: Date.now() - startTime,
    fixesApplied,
  };
}
