/**
 * Commit Message Generator
 * Generates Conventional Commits messages via cheap LLM or heuristics
 */

import matter from 'gray-matter';
import {
  discoverRules,
  normalizeRulesPathValue,
  type DiscoveredRule,
} from '../config/rulesDiscovery.js';
import { routePrompt } from '../core/router.js';
import { getProviderForModelWithFallback } from '../providers/index.js';
import { logger } from '../utils/logger.js';
import type { GitConfig } from './config.js';

export interface ChangedFile {
  filePath: string;
  toolName: string;
  description?: string;
}

/**
 * Error thrown when commit-message generation via the LLM fails for a
 * non-recoverable reason (provider unreachable, auth error, invalid
 * response shape, …). The generator itself still falls back to the
 * heuristic path so `generateCommitMessage` never rejects, but the
 * underlying cause is now logged instead of silently swallowed —
 * ported from upstream kilocode commit 738163bb1 so operators can
 * diagnose SAP AI Core provider failures instead of wondering why
 * they always see heuristic commit messages.
 */
export class CommitMessageError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'CommitMessageError';
  }
}

/**
 * Build a heuristic commit message without LLM
 */
export function buildHeuristicMessage(files: ChangedFile[], conventional: boolean): string {
  const paths = files.map((f) => f.filePath);
  const toolNames = [...new Set(files.map((f) => f.toolName))];

  // Determine conventional commit type
  const allPaths = paths.join(' ').toLowerCase();

  const type: string = toolNames.includes('delete')
    ? 'chore'
    : allPaths.includes('test') ||
        allPaths.includes('spec') ||
        allPaths.includes('.test.') ||
        allPaths.includes('.spec.')
      ? 'test'
      : allPaths.includes('readme') || allPaths.includes('.md') || allPaths.includes('docs/')
        ? 'docs'
        : allPaths.includes('fix') || allPaths.includes('bug') || allPaths.includes('patch')
          ? 'fix'
          : 'feat';

  // Build a short summary from file names
  const shortPaths = paths.map((p) => {
    const parts = p.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1];
  });

  const summary =
    shortPaths.length === 1
      ? shortPaths[0]
      : shortPaths.length <= 3
        ? shortPaths.join(', ')
        : `${shortPaths.slice(0, 2).join(', ')} and ${shortPaths.length - 2} more`;

  if (conventional) {
    return `${type}: update ${summary}`;
  }

  return `Update ${summary}`;
}

/**
 * Base system prompt for the LLM commit-message generator. User-defined
 * rules from `.alexi/rules/` (and other discovery paths) are appended to
 * this string in {@link buildSystemPrompt} so operators can enforce
 * project-wide commit conventions (language, ticket references, …) that
 * agents already honor in chat sessions.
 */
const BASE_SYSTEM_PROMPT =
  'You are a git commit message generator. Respond with ONLY the commit message, nothing else. No markdown, no quotes, no explanation.';

/**
 * Preamble prefixed to the formatted rules block when any user rules are
 * discovered. The explicit framing nudges the model to pick only the
 * relevant ones instead of blindly applying every rule it sees.
 *
 * Mirrors cline PR #14103 which solved the same inconsistency by appending
 * `.clinerules` to the commit-message system prompt. See issue #1953.
 */
export const COMMIT_RULES_PREAMBLE = 'User rules (apply those relevant to commit messages):';

/**
 * Parse a rule file through gray-matter and return it unless the
 * frontmatter contains `disabled: true`. We treat any truthy coercion of
 * the `disabled` field as a disable signal so string `"true"` / `"yes"`
 * authored by users still work.
 */
function isRuleEnabled(rule: DiscoveredRule): boolean {
  try {
    // Pass an options object (even empty) to bypass gray-matter's internal
    // content-keyed cache — see `src/skill/index.ts` for the same guard.
    const { data } = matter(rule.content, {});
    const disabled = (data as Record<string, unknown>).disabled;
    if (disabled === true) {
      return false;
    }
    if (typeof disabled === 'string') {
      const normalized = disabled.trim().toLowerCase();
      return normalized !== 'true' && normalized !== 'yes' && normalized !== '1';
    }
    return true;
  } catch (err) {
    // A malformed frontmatter must NOT silently drop the rule — log and
    // keep it. The user may have intentionally included `---` separators
    // in the body for readability.
    logger.debug(
      `[commit-message] failed to parse frontmatter for ${rule.filePath}: ${err instanceof Error ? err.message : String(err)}`
    );
    return true;
  }
}

/**
 * Load enabled rule files for `workdir` and return a system-prompt
 * section ready to append. Returns `''` when no rules are discovered
 * so callers can concatenate unconditionally.
 */
export function buildRulesSection(workdir: string, rulesPathOverride?: string | string[]): string {
  const customPaths =
    rulesPathOverride === undefined ? undefined : normalizeRulesPathValue(rulesPathOverride);
  const discovery = discoverRules({ workdir, customPaths, silent: true });
  const enabled = discovery.rules
    .filter(isRuleEnabled)
    .slice()
    .sort((a, b) => a.fileName.localeCompare(b.fileName));
  if (enabled.length === 0) {
    return '';
  }
  const formatted = enabled
    .map((rule) => `<rule file="${rule.fileName}">\n${rule.content}\n</rule>`)
    .join('\n\n');
  return `${COMMIT_RULES_PREAMBLE}\n\n${formatted}`;
}

/** Compose the base commit-message prompt with any user rules. */
function buildSystemPrompt(workdir: string, rulesPathOverride?: string | string[]): string {
  const rulesSection = buildRulesSection(workdir, rulesPathOverride);
  return rulesSection.length === 0
    ? BASE_SYSTEM_PROMPT
    : `${BASE_SYSTEM_PROMPT}\n\n${rulesSection}`;
}

/**
 * The most recent provider failure observed by {@link generateWithLLM},
 * or `null` if the last call succeeded. Preserved as a module-local
 * for callers (e.g. {@link AutoCommitManager}, CLI diagnostics) that
 * want to surface provider errors instead of silently seeing heuristic
 * commit messages — ports upstream kilocode `f54e713dd`
 * ("fix(cli): preserve commit-message provider errors").
 *
 * Reset to `null` at the start of every {@link generateWithLLM} call.
 */
let lastLlmError: CommitMessageError | null = null;

/**
 * Return (and consume) the most recent commit-message provider error.
 * Returns `null` when the previous LLM call succeeded or when there has
 * been no call yet. Consuming the error clears it so the next read
 * reflects the most recent attempt only.
 */
export function consumeLastCommitMessageError(): CommitMessageError | null {
  const err = lastLlmError;
  lastLlmError = null;
  return err;
}

/**
 * Generate commit message via LLM (cheap model)
 * Uses non-streaming completion to ensure full message is received
 */
async function generateWithLLM(
  files: ChangedFile[],
  config: GitConfig,
  workdir: string
): Promise<string | null> {
  lastLlmError = null;
  try {
    let modelId = config.commitMessage.model
      ? config.commitMessage.model
      : routePrompt('summarize in 10 words', { preferCheap: true }).modelId;

    // Resolve provider, falling back to routingConfig.preferences.fallbackModel
    // if the primary id is not recognized (e.g. typo in user config).
    const resolution = getProviderForModelWithFallback(modelId);
    const provider = resolution.provider;
    if (resolution.usedFallback) {
      modelId = resolution.effectiveModelId;
    }

    const fileList = files
      .map((f) => {
        const rel = f.filePath.replace(/\\/g, '/');
        const desc = f.description ? ` (${f.description})` : '';
        return `- ${rel}${desc} [via ${f.toolName}]`;
      })
      .join('\n');

    const prompt = config.commitMessage.conventional
      ? `Generate a single Conventional Commits message (type(scope): description) for these AI-edited files. Be concise, max 72 chars, no quotes:\n${fileList}`
      : `Generate a single short git commit message (max 72 chars, no quotes) describing these AI-edited files:\n${fileList}`;

    const systemPrompt = buildSystemPrompt(workdir, config.commitMessage.rulesPath);

    // Use non-streaming complete() to ensure full response is received
    // This prevents infinite loading states that can occur with streaming
    const result = await provider.complete(
      [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: prompt },
      ],
      { maxTokens: 100 }
    );

    const msg = result.text?.trim();
    if (!msg) {
      // Empty response is treated as "no message available" (not an
      // error); caller falls back to heuristics. This is expected when
      // the model is over-conservative on empty diffs.
      logger.debug('[commit-message] LLM returned empty response — falling back to heuristic');
      return null;
    }

    // Strip surrounding quotes if LLM added them
    return msg.replace(/^["'`]|["'`]$/g, '');
  } catch (cause) {
    // Distinguish transient/expected failures from real errors so
    // operators can diagnose SAP AI Core provider issues instead of
    // silently getting heuristic commit messages. Kilocode 738163bb1
    // + f54e713dd: preserve the originating provider error on the
    // module-local accessor so callers can surface it to the UI
    // without having to install a logger spy.
    const err = new CommitMessageError(
      `Failed to generate commit message via LLM: ${cause instanceof Error ? cause.message : String(cause)}`,
      cause
    );
    lastLlmError = err;
    logger.warn(err.message);
    return null;
  }
}

/**
 * Generate a commit message for a set of changed files.
 *
 * `workdir` is the project root used for `.alexi/rules/` discovery. It
 * defaults to `process.cwd()` to preserve the existing signature for
 * callers that never looked up rules (tests, legacy callers), while
 * {@link AutoCommitManager} threads its own workdir through.
 */
export async function generateCommitMessage(
  files: ChangedFile[],
  config: GitConfig,
  workdir: string = process.cwd()
): Promise<string> {
  if (files.length === 0) return 'chore: ai-assisted changes';

  if (config.commitMessage.useAI) {
    const llmMessage = await generateWithLLM(files, config, workdir);
    if (llmMessage) return llmMessage;
  }

  // Fallback to heuristics
  return buildHeuristicMessage(files, config.commitMessage.conventional);
}
