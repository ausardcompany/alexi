/**
 * Git Attribution
 * Formats Co-authored-by / author trailers for AI commits
 */

import type { GitConfig } from './config.js';

/**
 * Build git commit trailers based on attribution style
 */
export function buildAttributionTrailers(config: GitConfig): string[] {
  const { style, name, email } = config.attribution;

  switch (style) {
    case 'none':
      return [];

    case 'co-authored-by':
      return [`Co-authored-by: ${name} <${email}>`];

    case 'author':
      // Used to override the git author via env vars (GIT_AUTHOR_NAME / GIT_AUTHOR_EMAIL)
      // The trailer itself just records the AI name
      return [`Co-authored-by: ${name} <${email}>`];

    case 'committer':
      return [`Committed-by: ${name} <${email}>`];

    default:
      return [];
  }
}

/**
 * Append attribution trailers to a commit message body
 * Trailers are separated from body by a blank line (git convention)
 */
export function appendTrailers(message: string, trailers: string[]): string {
  if (trailers.length === 0) return message;

  const trimmed = message.trimEnd();

  // If the message already has a blank line before trailers section, don't add another
  const trailersBlock = trailers.join('\n');
  return `${trimmed}\n\n${trailersBlock}`;
}

/**
 * Build git env vars override for author-style attribution
 * Returns an env object to spread into child_process / simple-git options
 */
export function buildAuthorEnv(config: GitConfig): Record<string, string> | undefined {
  if (config.attribution.style !== 'author') return undefined;

  return {
    GIT_AUTHOR_NAME: config.attribution.name,
    GIT_AUTHOR_EMAIL: config.attribution.email,
  };
}

/**
 * Format a complete commit message with attribution
 */
export function formatCommitMessage(body: string, config: GitConfig): string {
  const trailers = buildAttributionTrailers(config);
  return appendTrailers(body, trailers);
}
