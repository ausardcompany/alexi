/**
 * Core Configuration Management
 * Handles loading and validation of configuration from environment variables
 * with defensive parsing to prevent application crashes
 */

import { defaultRules, type PermissionRule } from '../permission/index.js';

export interface PermissionConfig {
  rules?: PermissionRule[];
  allowExternalDirectories?: boolean;
  doomLoop?: {
    maxRetries?: number;
    windowMs?: number;
    onDetected?: 'warn' | 'block' | 'ask';
  };
}

/**
 * Get default permission configuration
 */
export function getDefaultPermissionConfig(): PermissionConfig {
  return {
    rules: defaultRules,
    allowExternalDirectories: false,
    doomLoop: {
      maxRetries: 3,
      windowMs: 60000,
      onDetected: 'warn',
    },
  };
}

/**
 * Validate and normalize permission configuration
 */
function validatePermissionConfig(config: unknown): PermissionConfig {
  const defaults = getDefaultPermissionConfig();
  if (typeof config !== 'object' || config === null) {
    return defaults;
  }

  const cfg = config as Record<string, unknown>;

  return {
    rules: Array.isArray(cfg.rules) ? cfg.rules : defaults.rules,
    allowExternalDirectories:
      typeof cfg.allowExternalDirectories === 'boolean'
        ? cfg.allowExternalDirectories
        : defaults.allowExternalDirectories,
    doomLoop:
      typeof cfg.doomLoop === 'object' && cfg.doomLoop !== null
        ? {
            maxRetries:
              typeof (cfg.doomLoop as any).maxRetries === 'number'
                ? (cfg.doomLoop as any).maxRetries
                : defaults.doomLoop!.maxRetries,
            windowMs:
              typeof (cfg.doomLoop as any).windowMs === 'number'
                ? (cfg.doomLoop as any).windowMs
                : defaults.doomLoop!.windowMs,
            onDetected: ['warn', 'block', 'ask'].includes((cfg.doomLoop as any).onDetected)
              ? (cfg.doomLoop as any).onDetected
              : defaults.doomLoop!.onDetected,
          }
        : defaults.doomLoop,
  };
}

/**
 * Load permission configuration from environment variable
 * Tolerates invalid JSON and provides defensive handling
 */
export function loadPermissionConfig(): PermissionConfig {
  const envValue = process.env.ALEXI_PERMISSION;
  if (envValue) {
    try {
      const parsed = JSON.parse(envValue);
      if (typeof parsed !== 'object' || parsed === null) {
        console.warn('ALEXI_PERMISSION must be a JSON object, using defaults');
        return getDefaultPermissionConfig();
      }
      return validatePermissionConfig(parsed);
    } catch (error) {
      console.warn(
        `Invalid ALEXI_PERMISSION JSON: ${error instanceof Error ? error.message : 'unknown error'}, using defaults`
      );
      return getDefaultPermissionConfig();
    }
  }
  return getDefaultPermissionConfig();
}

/**
 * Load general configuration from environment
 */
export interface AppConfig {
  permission: PermissionConfig;
  workdir: string;
  debug: boolean;
}

export function loadAppConfig(): AppConfig {
  return {
    permission: loadPermissionConfig(),
    workdir: process.env.ALEXI_WORKDIR || process.cwd(),
    debug: process.env.ALEXI_DEBUG === 'true',
  };
}
