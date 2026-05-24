/**
 * Allow-Everything Permission Mode
 * Based on upstream kilocode permission system (67 new lines)
 *
 * Bypasses all permission checks - useful for trusted environments
 * Can be enabled via environment variables for automated testing or CI/CD
 */

import type { PermissionResult, PermissionContext } from './index.js';

export interface AllowEverythingConfig {
  enabled: boolean;
  auditLog?: boolean;
}

/**
 * Allow-everything permission mode
 * When enabled, all permission checks automatically succeed
 */
export class AllowEverythingPermission {
  private config: AllowEverythingConfig;

  constructor(config: AllowEverythingConfig) {
    this.config = config;
  }

  /**
   * Check if allow-everything mode is enabled via environment variables
   */
  static isEnabled(): boolean {
    return (
      process.env['ALEXI_ALLOW_EVERYTHING'] === 'true' ||
      process.env['KILO_ALLOW_EVERYTHING'] === 'true'
    );
  }

  /**
   * Create an allow-everything permission checker
   */
  static create(config?: Partial<AllowEverythingConfig>): AllowEverythingPermission {
    const enabled = config?.enabled ?? AllowEverythingPermission.isEnabled();
    return new AllowEverythingPermission({
      enabled,
      auditLog: config?.auditLog ?? false,
    });
  }

  /**
   * Check permission - always returns allowed when enabled
   */
  async check(ctx: PermissionContext): Promise<PermissionResult> {
    if (!this.config.enabled) {
      throw new Error('AllowEverything mode not enabled');
    }

    if (this.config.auditLog) {
      console.log(`[PERMISSION AUDIT] Allowing: ${ctx.toolName} - ${ctx.action} - ${ctx.resource}`);
    }

    return {
      decision: 'allow',
      granted: true,
    };
  }

  /**
   * Batch check permissions - all return allowed when enabled
   */
  async checkBatch(contexts: PermissionContext[]): Promise<PermissionResult[]> {
    if (!this.config.enabled) {
      throw new Error('AllowEverything mode not enabled');
    }

    return contexts.map((ctx) => {
      if (this.config.auditLog) {
        console.log(
          `[PERMISSION AUDIT] Allowing: ${ctx.toolName} - ${ctx.action} - ${ctx.resource}`
        );
      }

      return {
        decision: 'allow',
        granted: true,
      };
    });
  }

  /**
   * Check if this mode is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}
