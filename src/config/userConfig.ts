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

// ============ Constants ============

export const CONFIG_DIR = path.join(os.homedir(), '.alexi');
export const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

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
 */
export function loadFullConfig(): Record<string, unknown> {
  ensureConfigDir();

  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }

  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    // Return empty config on parse error (corrupt file)
    return {};
  }
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
