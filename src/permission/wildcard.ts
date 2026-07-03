/**
 * Wildcard Pattern Matching
 * Supports glob-style patterns like *.ts, src/**, etc.
 * Based on kilocode/opencode pattern matching
 */

export interface MatchResult {
  matched: boolean;
  specificity: number; // Higher = more specific match
}

/**
 * Convert glob pattern to regex
 */
function globToRegex(pattern: string): RegExp {
  const regex = pattern
    // Escape special regex chars (except * and ?)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    // ** matches any path including /
    .replace(/\*\*/g, '<<<DOUBLE_STAR>>>')
    // * matches anything except /
    .replace(/\*/g, '[^/]*')
    // Restore ** as match-all
    .replace(/<<<DOUBLE_STAR>>>/g, '.*')
    // ? matches single char
    .replace(/\?/g, '.');

  return new RegExp(`^${regex}$`);
}

/**
 * Calculate specificity of a pattern (more specific = higher score)
 */
function calculateSpecificity(pattern: string): number {
  let score = 0;

  // Exact match (no wildcards) = highest
  if (!pattern.includes('*') && !pattern.includes('?')) {
    score += 1000;
  }

  // Count fixed path segments
  const segments = pattern.split('/');
  for (const seg of segments) {
    if (!seg.includes('*') && !seg.includes('?')) {
      score += 10;
    }
  }

  // Penalize ** (matches too broadly)
  score -= (pattern.match(/\*\*/g) || []).length * 5;

  // Penalize single *
  score -= (pattern.match(/(?<!\*)\*(?!\*)/g) || []).length * 2;

  return score;
}

/**
 * Match a path against a glob pattern
 */
export function matchPattern(pattern: string, path: string): MatchResult {
  try {
    const regex = globToRegex(pattern);
    const matched = regex.test(path);

    return {
      matched,
      specificity: matched ? calculateSpecificity(pattern) : 0,
    };
  } catch {
    return { matched: false, specificity: 0 };
  }
}

/**
 * Match path against multiple patterns, returning best match
 */
export function matchPatterns(
  patterns: string[],
  path: string
): { matched: boolean; pattern?: string; specificity: number } {
  let bestMatch: { pattern: string; specificity: number } | null = null;

  for (const pattern of patterns) {
    const result = matchPattern(pattern, path);
    if (result.matched) {
      if (!bestMatch || result.specificity > bestMatch.specificity) {
        bestMatch = { pattern, specificity: result.specificity };
      }
    }
  }

  return bestMatch
    ? { matched: true, pattern: bestMatch.pattern, specificity: bestMatch.specificity }
    : { matched: false, specificity: 0 };
}

/**
 * Check if path is under a directory
 */
export function isUnderDirectory(path: string, directory: string): boolean {
  const normalizedPath = path.replace(/\\/g, '/');
  const normalizedDir = directory.replace(/\\/g, '/').replace(/\/$/, '');

  return normalizedPath.startsWith(normalizedDir + '/') || normalizedPath === normalizedDir;
}

/**
 * Convert a command allowlist pattern to a regex.
 *
 * Unlike {@link globToRegex}, this treats `*` as `.*` (matches anything
 * including path separators and whitespace) because command lines carry
 * flags and paths that would otherwise be blocked by the `[^/]*` semantics
 * of file-path globbing.
 */
function commandPatternToRegex(pattern: string): RegExp {
  const regex = pattern
    // Escape special regex chars (except * and ?)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    // * matches anything, including spaces and slashes
    .replace(/\*/g, '.*')
    // ? matches single char
    .replace(/\?/g, '.');
  return new RegExp(`^${regex}$`);
}

/**
 * Decide whether an allowlist pattern targets the full command line
 * (rather than just the command name / first token).
 *
 * A pattern is treated as full-command when either:
 *  - It contains whitespace (e.g. `find *-exec*`, `sort *-o *`), or
 *  - It has a wildcard that is not at the very start (e.g. `mkfs*`, `git*`).
 *
 * Patterns like `*` (bare wildcard) or `find` (plain first token) still
 * match against the first word for backwards compatibility.
 */
function isFullCommandPattern(pattern: string): boolean {
  if (/\s/.test(pattern)) return true;
  // Look for a wildcard that is not at index 0 (non-leading).
  const idx = pattern.search(/[*?]/);
  return idx > 0;
}

/**
 * Match command against allowed commands list.
 *
 * For plain first-token patterns (`find`, `ls`, `*`) we compare against the
 * first whitespace-delimited word for a cheap fast path. For patterns that
 * embed whitespace or non-leading wildcards, we match the FULL command
 * string so that shapes like `find *-exec*` can catch exec-flag escapes.
 */
export function matchCommand(command: string, allowedCommands: string[]): boolean {
  // Trim leading/trailing whitespace so patterns like `find *-exec*` are not
  // silently bypassed by a stray leading space in the command string.
  const trimmed = command.trim();
  const cmdName = trimmed.split(/\s+/)[0]; // Get first word (the command)

  return allowedCommands.some((allowed) => {
    if (allowed === '*') return true;
    if (allowed === cmdName) return true;

    if (isFullCommandPattern(allowed)) {
      try {
        return commandPatternToRegex(allowed).test(trimmed);
      } catch {
        return false;
      }
    }

    if (allowed.includes('*')) {
      return matchPattern(allowed, cmdName).matched;
    }
    return false;
  });
}
