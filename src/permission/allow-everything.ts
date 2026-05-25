/**
 * Allow-Everything Permission Mode
 * For trusted environments where all operations should be allowed
 */

import type { PermissionContext, PermissionResult, PermissionDecision } from './index.js';

export interface AllowEverythingConfig {
  enabled: boolean;
  excludePatterns?: string[];
}

export interface PermissionRequest {
  toolName: string;
  action: string;
  resource: string;
  description?: string;
}

export class AllowEverythingPermission {
  private config: AllowEverythingConfig;

  constructor(config: AllowEverythingConfig = { enabled: false }) {
    this.config = config;
  }

  async check(request: PermissionRequest | PermissionContext): Promise<PermissionResult> {
    if (!this.config.enabled) {
      return {
        decision: 'ask' as PermissionDecision,
        granted: false,
      };
    }

    // Check exclusion patterns
    if (this.config.excludePatterns) {
      for (const pattern of this.config.excludePatterns) {
        if (this.matchesPattern(request.resource, pattern)) {
          return {
            decision: 'deny' as PermissionDecision,
            granted: false,
          };
        }
      }
    }

    return {
      decision: 'allow' as PermissionDecision,
      granted: true,
    };
  }

  private matchesPattern(resource: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(resource);
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  setExcludePatterns(patterns: string[]): void {
    this.config.excludePatterns = patterns;
  }

  getExcludePatterns(): string[] {
    return this.config.excludePatterns || [];
  }

  getConfig(): AllowEverythingConfig {
    return { ...this.config };
  }
}

export function createAllowEverythingPermission(
  config?: AllowEverythingConfig
): AllowEverythingPermission {
  return new AllowEverythingPermission(config);
}
