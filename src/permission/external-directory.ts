/**
 * External Directory Permission Support
 * Allows read-only external directory access for Ask mode
 */

import * as path from 'path';

export interface ExternalDirectoryConfig {
  path: string;
  readonly: boolean;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Normalize path for consistent comparison
 */
function normalizePath(filePath: string): string {
  return path.resolve(filePath).toLowerCase();
}

/**
 * External Directory Permission Manager
 */
export const ExternalDirectoryPermission = {
  /**
   * Evaluate if a path operation is allowed based on external directory config
   */
  evaluate(
    config: ExternalDirectoryConfig,
    requestedPath: string,
    operation: 'read' | 'write'
  ): PermissionResult {
    try {
      // Normalize paths for comparison
      const normalizedConfig = normalizePath(config.path);
      const normalizedRequest = normalizePath(requestedPath);

      // Check if requested path is within allowed directory
      if (!normalizedRequest.startsWith(normalizedConfig)) {
        return {
          allowed: false,
          reason: 'Path outside allowed directory',
        };
      }

      // Check readonly constraint
      if (config.readonly && operation === 'write') {
        return {
          allowed: false,
          reason: 'Write operations not allowed in readonly directory',
        };
      }

      return { allowed: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        allowed: false,
        reason: `Permission evaluation failed: ${message}`,
      };
    }
  },

  /**
   * Support for Ask mode external directories
   * Creates readonly configs for multiple paths
   */
  allowReadOnly(paths: string[]): ExternalDirectoryConfig[] {
    return paths.map((p) => ({ path: p, readonly: true }));
  },

  /**
   * Check if any configured directory allows the operation
   */
  evaluateMultiple(
    configs: ExternalDirectoryConfig[],
    requestedPath: string,
    operation: 'read' | 'write'
  ): PermissionResult {
    for (const config of configs) {
      const result = this.evaluate(config, requestedPath, operation);
      if (result.allowed) {
        return result;
      }
    }

    return {
      allowed: false,
      reason: 'No matching external directory permission',
    };
  },
};
