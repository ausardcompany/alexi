/**
 * Compaction Configuration Loader
 * Reads compaction settings from project config files (alexi.config.json or kilo.json)
 * and applies them to the global compaction configuration.
 */

import fs from 'fs';
import path from 'path';

import {
  setCompactionConfig,
  type CompactionConfig,
  type CompactionStrategy,
} from '../compaction/index.js';

// ============ Constants ============

const CONFIG_FILES = ['alexi.config.json', 'kilo.json'];

const VALID_STRATEGIES: CompactionStrategy[] = ['truncate', 'summarize', 'sliding', 'smart'];

// ============ Validation ============

/**
 * Validate and parse a raw compaction config object.
 * Returns a validated CompactionConfig or throws on invalid values.
 */
export function validateCompactionConfig(raw: unknown): CompactionConfig {
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  const config: CompactionConfig = {};
  const obj = raw as Record<string, unknown>;

  if (obj.maxTokens !== undefined) {
    if (typeof obj.maxTokens !== 'number' || obj.maxTokens <= 0) {
      throw new Error('compaction.maxTokens must be a number greater than 0');
    }
    config.maxTokens = obj.maxTokens;
  }

  if (obj.warningThreshold !== undefined) {
    if (
      typeof obj.warningThreshold !== 'number' ||
      obj.warningThreshold < 0 ||
      obj.warningThreshold > 1
    ) {
      throw new Error('compaction.warningThreshold must be a number between 0 and 1');
    }
    config.warningThreshold = obj.warningThreshold;
  }

  if (obj.strategy !== undefined) {
    if (
      typeof obj.strategy !== 'string' ||
      !VALID_STRATEGIES.includes(obj.strategy as CompactionStrategy)
    ) {
      throw new Error(`compaction.strategy must be one of: ${VALID_STRATEGIES.join(', ')}`);
    }
    config.strategy = obj.strategy as CompactionStrategy;
  }

  if (obj.preserveRecent !== undefined) {
    if (typeof obj.preserveRecent !== 'number' || obj.preserveRecent < 0) {
      throw new Error('compaction.preserveRecent must be a non-negative number');
    }
    config.preserveRecent = Math.floor(obj.preserveRecent);
  }

  return config;
}

// ============ Loading ============

/**
 * Load compaction configuration from project config files.
 * Searches for alexi.config.json and kilo.json in the specified directory.
 * Returns the parsed CompactionConfig or an empty object if no config found.
 */
export function loadCompactionConfigFromFile(projectDir?: string): CompactionConfig {
  const searchDir = projectDir ?? process.cwd();

  for (const file of CONFIG_FILES) {
    const filePath = path.join(searchDir, file);

    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content) as Record<string, unknown>;

        if (parsed.compaction !== undefined) {
          return validateCompactionConfig(parsed.compaction);
        }
      } catch (err) {
        // If it's a validation error, re-throw for the caller to handle
        if (err instanceof Error && err.message.startsWith('compaction.')) {
          throw err;
        }
        // Otherwise (parse errors, file read errors), continue to next file
        continue;
      }
    }
  }

  return {};
}

/**
 * Load compaction config from project files and apply it globally.
 * This is the main entry point for config initialization.
 */
export function initCompactionConfig(projectDir?: string): CompactionConfig {
  const config = loadCompactionConfigFromFile(projectDir);

  if (Object.keys(config).length > 0) {
    setCompactionConfig(config);
  }

  return config;
}
