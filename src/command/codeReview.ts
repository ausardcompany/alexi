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

import { sendChat } from '../core/orchestrator.js';
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
 */
export async function executeCodeReview(opts: CodeReviewOptions = {}): Promise<CodeReviewResult> {
  const effort: CodeReviewEffort = opts.effort ?? 'medium';
  const target: CodeReviewTarget = opts.target ?? 'uncommitted';
  const workdir = opts.workdir ?? process.cwd();
  const startTime = Date.now();

  if (opts.signal?.aborted) {
    throw new Error('Code review cancelled before start');
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

  return {
    success: true,
    diffBytes,
    effort,
    review: result.text,
    modelUsed: result.modelUsed ?? modelId,
    totalTokens,
    elapsedMs: Date.now() - startTime,
  };
}
