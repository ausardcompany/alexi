import path from 'path';

/**
 * Extracts a canonical entry name from a file path.
 * Handles both absolute and relative paths, normalizing to a consistent format.
 *
 * @example
 * resolveEntryName('./agents/my-agent.ts') // 'my-agent'
 * resolveEntryName('/full/path/to/custom-command.ts') // 'custom-command'
 * resolveEntryName('agents/nested/deep-agent.ts') // 'deep-agent'
 */
export function resolveEntryName(filePath: string): string {
  // Normalize the path to handle different OS separators
  const normalized = path.normalize(filePath);

  // Get the base name without extension
  const baseName = path.basename(normalized, path.extname(normalized));

  // Handle index files by using parent directory name
  if (baseName === 'index') {
    const parentDir = path.dirname(normalized);
    return path.basename(parentDir);
  }

  return baseName;
}

/**
 * Resolves agent name from a configuration path entry.
 * Supports both string names and file path references.
 */
export function resolveAgentName(entry: string): string {
  // If it looks like a path (contains separator or extension)
  if (entry.includes(path.sep) || entry.includes('/') || path.extname(entry)) {
    return resolveEntryName(entry);
  }
  // Otherwise treat as a direct name
  return entry;
}

/**
 * Resolves command name from a configuration path entry.
 */
export function resolveCommandName(entry: string): string {
  return resolveAgentName(entry); // Same logic applies
}
