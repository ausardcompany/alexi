/**
 * External Directory Permission Module
 * Manages access control for directories outside the project workspace
 */

import * as path from 'path';

export type ExternalDirectoryMode = 'read' | 'write' | 'deny';

export interface ExternalDirectoryRule {
  path: string;
  mode: ExternalDirectoryMode;
}

export interface ExternalDirectoryConfig {
  allowedDirectories?: ExternalDirectoryRule[];
}

/**
 * Check if an external directory path is allowed
 * @param filePath - The file path to check
 * @param config - Configuration with allowed directories
 * @returns true if the path is allowed, false otherwise
 */
export async function isExternalDirectoryAllowed(
  filePath: string,
  config: ExternalDirectoryConfig
): Promise<boolean> {
  const { allowedDirectories = [] } = config;

  const normalizedPath = path.normalize(filePath);

  for (const rule of allowedDirectories) {
    const normalizedRule = path.normalize(rule.path);

    if (normalizedPath.startsWith(normalizedRule)) {
      return rule.mode !== 'deny';
    }
  }

  return false;
}

/**
 * Get the access mode for an external directory path
 * @param filePath - The file path to check
 * @param config - Configuration with allowed directories
 * @returns The access mode if a rule matches, null otherwise
 */
export function getExternalDirectoryMode(
  filePath: string,
  config: ExternalDirectoryConfig
): ExternalDirectoryMode | null {
  const { allowedDirectories = [] } = config;

  const normalizedPath = path.normalize(filePath);

  for (const rule of allowedDirectories) {
    const normalizedRule = path.normalize(rule.path);

    if (normalizedPath.startsWith(normalizedRule)) {
      return rule.mode;
    }
  }

  return null;
}

/**
 * Validate that a path is safe for the given mode
 * @param filePath - The file path to validate
 * @param mode - The intended access mode
 * @param config - Configuration with allowed directories
 * @returns true if the operation is allowed
 */
export async function validateExternalAccess(
  filePath: string,
  mode: 'read' | 'write',
  config: ExternalDirectoryConfig
): Promise<boolean> {
  const allowedMode = getExternalDirectoryMode(filePath, config);

  if (allowedMode === null) {
    return false;
  }

  if (allowedMode === 'deny') {
    return false;
  }

  if (mode === 'write' && allowedMode === 'read') {
    return false;
  }

  return true;
}
