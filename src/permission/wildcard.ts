/**
 * Wildcard Pattern Matching
 * Supports glob-style patterns like *.ts, src/**, etc.
 * Based on kilocode/opencode pattern matching
 */

export interface MatchResult {
  matched: boolean
  specificity: number // Higher = more specific match
}

/**
 * Convert glob pattern to regex
 */
function globToRegex(pattern: string): RegExp {
  let regex = pattern
    // Escape special regex chars (except * and ?)
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    // ** matches any path including /
    .replace(/\*\*/g, "<<<DOUBLE_STAR>>>")
    // * matches anything except /
    .replace(/\*/g, "[^/]*")
    // Restore ** as match-all
    .replace(/<<<DOUBLE_STAR>>>/g, ".*")
    // ? matches single char
    .replace(/\?/g, ".")

  return new RegExp(`^${regex}$`)
}

/**
 * Calculate specificity of a pattern (more specific = higher score)
 */
function calculateSpecificity(pattern: string): number {
  let score = 0
  
  // Exact match (no wildcards) = highest
  if (!pattern.includes("*") && !pattern.includes("?")) {
    score += 1000
  }
  
  // Count fixed path segments
  const segments = pattern.split("/")
  for (const seg of segments) {
    if (!seg.includes("*") && !seg.includes("?")) {
      score += 10
    }
  }
  
  // Penalize ** (matches too broadly)
  score -= (pattern.match(/\*\*/g) || []).length * 5
  
  // Penalize single * 
  score -= (pattern.match(/(?<!\*)\*(?!\*)/g) || []).length * 2
  
  return score
}

/**
 * Match a path against a glob pattern
 */
export function matchPattern(pattern: string, path: string): MatchResult {
  try {
    const regex = globToRegex(pattern)
    const matched = regex.test(path)
    
    return {
      matched,
      specificity: matched ? calculateSpecificity(pattern) : 0,
    }
  } catch {
    return { matched: false, specificity: 0 }
  }
}

/**
 * Match path against multiple patterns, returning best match
 */
export function matchPatterns(
  patterns: string[],
  path: string
): { matched: boolean; pattern?: string; specificity: number } {
  let bestMatch: { pattern: string; specificity: number } | null = null
  
  for (const pattern of patterns) {
    const result = matchPattern(pattern, path)
    if (result.matched) {
      if (!bestMatch || result.specificity > bestMatch.specificity) {
        bestMatch = { pattern, specificity: result.specificity }
      }
    }
  }
  
  return bestMatch
    ? { matched: true, pattern: bestMatch.pattern, specificity: bestMatch.specificity }
    : { matched: false, specificity: 0 }
}

/**
 * Check if path is under a directory
 */
export function isUnderDirectory(path: string, directory: string): boolean {
  const normalizedPath = path.replace(/\\/g, "/")
  const normalizedDir = directory.replace(/\\/g, "/").replace(/\/$/, "")
  
  return normalizedPath.startsWith(normalizedDir + "/") || normalizedPath === normalizedDir
}

/**
 * Match command against allowed commands list
 */
export function matchCommand(
  command: string,
  allowedCommands: string[]
): boolean {
  const cmdName = command.split(/\s+/)[0] // Get first word (the command)
  
  return allowedCommands.some((allowed) => {
    if (allowed === "*") return true
    if (allowed === cmdName) return true
    if (allowed.includes("*")) {
      return matchPattern(allowed, cmdName).matched
    }
    return false
  })
}
