/**
 * Allow Everything Permission Handler
 * WARNING: Only use in development/testing environments
 * Based on kilocode/opencode permission patterns
 */

import type { PermissionContext, PermissionResult } from './index.js';

/**
 * Permission handler that allows all operations.
 *
 * WARNING: Only use in development/testing environments.
 * Never use in production as it bypasses all security checks.
 */
export class AllowEverythingPermission {
  static readonly name = 'allow-everything';

  static check(_request: PermissionContext): PermissionResult {
    return {
      decision: 'allow',
      granted: true,
    };
  }

  static isEnabled(): boolean {
    return (
      process.env.NODE_ENV === 'development' ||
      process.env.ALEXI_ALLOW_ALL_PERMISSIONS === 'true'
    );
  }
}

/**
 * Apply allow-everything permission to a context
 * Only applies if enabled via environment variables
 */
export function withAllowEverything<T>(
  operation: () => Promise<T>,
  enabled?: boolean
): Promise<T> {
  const shouldAllow = enabled ?? AllowEverythingPermission.isEnabled();

  if (shouldAllow) {
    // Log warning in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SECURITY] Allow-everything permission is active');
    }
  }

  return operation();
}
