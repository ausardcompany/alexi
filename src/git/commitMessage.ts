/**
 * Commit Message Generator
 * Generates Conventional Commits messages via cheap LLM or heuristics
 */

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
 * Generate commit message via LLM (cheap model)
 * Uses non-streaming completion to ensure full message is received
 */
async function generateWithLLM(files: ChangedFile[], config: GitConfig): Promise<string | null> {
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

    // Use non-streaming complete() to ensure full response is received
    // This prevents infinite loading states that can occur with streaming
    const result = await provider.complete(
      [
        {
          role: 'system',
          content:
            'You are a git commit message generator. Respond with ONLY the commit message, nothing else. No markdown, no quotes, no explanation.',
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
    // silently getting heuristic commit messages. Kilocode 738163bb1.
    const err = new CommitMessageError(
      `Failed to generate commit message via LLM: ${cause instanceof Error ? cause.message : String(cause)}`,
      cause
    );
    logger.warn(err.message);
    return null;
  }
}

/**
 * Generate a commit message for a set of changed files
 */
export async function generateCommitMessage(
  files: ChangedFile[],
  config: GitConfig
): Promise<string> {
  if (files.length === 0) return 'chore: ai-assisted changes';

  if (config.commitMessage.useAI) {
    const llmMessage = await generateWithLLM(files, config);
    if (llmMessage) return llmMessage;
  }

  // Fallback to heuristics
  return buildHeuristicMessage(files, config.commitMessage.conventional);
}
