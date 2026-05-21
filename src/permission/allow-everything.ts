/**
 * Allow-Everything Permission Handler
 * For controlled environments where all permissions should be granted
 * (e.g., automated CI/CD pipelines, trusted execution contexts)
 */

import type { PermissionContext, PermissionResult } from './index.js';

export interface AllowEverythingConfig {
  enabled: boolean;
  auditLog?: boolean;
  allowedContexts?: string[];
}

export function createAllowEverythingHandler(config: AllowEverythingConfig) {
  return {
    async check(request: PermissionContext): Promise<PermissionResult> {
      if (!config.enabled) {
        return {
          decision: 'deny',
          granted: false,
        };
      }

      if (config.auditLog) {
        console.log(
          `[PERMISSION AUDIT] Allowing: ${request.action} on ${request.resource} by ${request.toolName}`
        );
      }

      return {
        decision: 'allow',
        granted: true,
      };
    },
  };
}

export function isAllowEverythingEnabled(): boolean {
  return (
    process.env.ALEXI_ALLOW_EVERYTHING === 'true' ||
    process.env.ALEXI_ALLOW_EVERYTHING === '1'
  );
}

export function getAllowEverythingConfig(): AllowEverythingConfig {
  return {
    enabled: isAllowEverythingEnabled(),
    auditLog: process.env.ALEXI_AUDIT_LOG === 'true',
    allowedContexts: process.env.ALEXI_ALLOWED_CONTEXTS?.split(',').map((s) => s.trim()),
  };
}
