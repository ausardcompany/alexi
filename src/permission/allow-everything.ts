/**
 * Allow-Everything Permission Mode
 * Provides a permission mode that allows all operations without prompting
 * Useful for automated/CI environments
 */

import type { PermissionContext, PermissionResult } from './index.js';

export interface AllowEverythingConfig {
  readonly enabled: boolean;
  readonly logAllowed?: boolean;
}

/**
 * Check if allow-everything mode is enabled via environment variables
 */
export function isAllowEverythingEnabled(): boolean {
  return (
    process.env.ALEXI_ALLOW_EVERYTHING === 'true' ||
    process.env.ALEXI_ALLOW_EVERYTHING === '1' ||
    process.env.CI === 'true' ||
    process.env.CI === '1'
  );
}

/**
 * Create an allow-everything permission checker
 */
export function createAllowEverythingChecker(config: AllowEverythingConfig) {
  return {
    check: async (ctx: PermissionContext): Promise<PermissionResult> => {
      if (config.logAllowed) {
        console.log(
          `[allow-everything] Allowing ${ctx.action} on ${ctx.resource} by ${ctx.toolName}`
        );
      }

      return {
        decision: 'allow',
        granted: true,
      };
    },

    name: 'allow-everything',
    description: 'Allows all permission requests without prompting',
  };
}

/**
 * Get an allow-everything checker if enabled, otherwise undefined
 */
export function maybeCreateAllowEverything():
  | ReturnType<typeof createAllowEverythingChecker>
  | undefined {
  if (isAllowEverythingEnabled()) {
    return createAllowEverythingChecker({
      enabled: true,
      logAllowed: true,
    });
  }
  return undefined;
}
