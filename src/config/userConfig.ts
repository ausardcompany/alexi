/**
 * User Configuration
 * Shared module for reading/writing ~/.alexi/config.json
 *
 * Provides a centralized API for persistent user preferences.
 * Other modules (sound, interactive, providers) should use this
 * instead of reimplementing config.json I/O inline.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

// ============ Constants ============

export const CONFIG_DIR = path.join(os.homedir(), '.alexi');
export const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// ============ macOS Managed Preferences ============

const MANAGED_DOMAIN = 'ai.alexi.cli';

interface ManagedConfig {
  disableTelemetry?: boolean;
  allowedProviders?: string[];
  defaultModel?: string;
  proxyUrl?: string;
}

function readManagedKey(key: string): string | null {
  try {
    const result = execSync(`defaults read ${MANAGED_DOMAIN} ${key} 2>/dev/null`, {
      encoding: 'utf-8',
      timeout: 5000,
    });
    return result.trim();
  } catch {
    return null;
  }
}

export function readManagedPreferences(): ManagedConfig | null {
  if (os.platform() !== 'darwin') {
    return null;
  }

  try {
    const config: ManagedConfig = {};

    const disableTelemetry = readManagedKey('disableTelemetry');
    if (disableTelemetry !== null) {
      config.disableTelemetry = disableTelemetry === '1' || disableTelemetry === 'true';
    }

    const allowedProviders = readManagedKey('allowedProviders');
    if (allowedProviders !== null) {
      config.allowedProviders = allowedProviders.split(',').map((s) => s.trim());
    }

    const defaultModel = readManagedKey('defaultModel');
    if (defaultModel !== null) {
      config.defaultModel = defaultModel;
    }

    const proxyUrl = readManagedKey('proxyUrl');
    if (proxyUrl !== null) {
      config.proxyUrl = proxyUrl;
    }

    return Object.keys(config).length > 0 ? config : null;
  } catch {
    return null;
  }
}

// ============ Low-level helpers ============

/**
 * Ensure the config directory exists
 */
export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load the full config object from disk.
 * Returns an empty object if the file doesn't exist or is corrupt.
 * Managed preferences (macOS MDM) take precedence over user config.
 */
export function loadFullConfig(): Record<string, unknown> {
  ensureConfigDir();

  let config: Record<string, unknown> = {};

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      config = JSON.parse(content) as Record<string, unknown>;
    } catch {
      // Return empty config on parse error (corrupt file)
      config = {};
    }
  }

  // Apply managed preferences (macOS MDM) - these take precedence
  const managedPrefs = readManagedPreferences();
  if (managedPrefs) {
    if (managedPrefs.disableTelemetry !== undefined) {
      config.telemetryEnabled = !managedPrefs.disableTelemetry;
    }
    if (managedPrefs.defaultModel) {
      config.defaultModel = managedPrefs.defaultModel;
    }
    if (managedPrefs.proxyUrl) {
      config.proxyUrl = managedPrefs.proxyUrl;
    }
    if (managedPrefs.allowedProviders) {
      config.allowedProviders = managedPrefs.allowedProviders;
    }
  }

  return config;
}

/**
 * Save the full config object to disk (overwrites entire file).
 */
export function saveFullConfig(config: Record<string, unknown>): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

// ============ Key-level accessors ============

/**
 * Read a single top-level key from config.
 * Returns `undefined` when the key is absent.
 */
export function getConfigValue(key: string): unknown {
  const config = loadFullConfig();
  return config[key];
}

/**
 * Write a single top-level key to config, preserving all other keys.
 * Performs a read-modify-write cycle.
 */
export function setConfigValue(key: string, value: unknown): void {
  const config = loadFullConfig();
  config[key] = value;
  saveFullConfig(config);
}

/**
 * Delete a single top-level key from config.
 */
export function deleteConfigValue(key: string): void {
  const config = loadFullConfig();
  delete config[key];
  saveFullConfig(config);
}

// ============ Typed convenience accessors ============

/**
 * Get the user's persisted default model, or undefined if not set.
 */
export function getConfigDefaultModel(): string | undefined {
  const value = getConfigValue('defaultModel');
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return undefined;
}

/**
 * Persist the user's chosen default model.
 */
export function setConfigDefaultModel(modelId: string): void {
  setConfigValue('defaultModel', modelId);
}

// ============ Batch update with options ============

export interface UpdateGlobalOptions {
  dispose?: boolean;
}

/**
 * Update multiple config keys at once.
 * The `dispose` option controls whether any config instances should be disposed after update.
 * Default behavior (dispose=true) is preserved for backward compatibility.
 */
export function updateGlobal(
  updates: Partial<Record<string, unknown>>,
  options: UpdateGlobalOptions = {}
): void {
  const { dispose = true } = options;

  const config = loadFullConfig();
  Object.assign(config, updates);
  saveFullConfig(config);

  // Disposal logic would go here if needed
  // For now, this is a placeholder for future config instance management
  if (dispose) {
    // In a more complex system, this would dispose of cached config instances
    // Currently, Alexi doesn't maintain config instances, so this is a no-op
  }
}
