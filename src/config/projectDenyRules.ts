/**
 * Project Deny Rules Configuration Loader
 * Reads hard deny rules from project-level config files (kilo.json, .kilo/kilo.json, alexi.json)
 * and loads them into the PermissionManager.
 *
 * Deny rules are specified under the "denyRules" key in the project config file.
 * They take absolute priority over allow rules and cannot be overridden
 * except by explicit user bypass.
 *
 * Example kilo.json:
 * ```json
 * {
 *   "denyRules": {
 *     "rules": [
 *       {
 *         "id": "deny-production-writes",
 *         "name": "Protect Production Config",
 *         "description": "Never auto-approve writes to production configs",
 *         "actions": ["write"],
 *         "paths": ["production/config.json", "prod.env"]
 *       }
 *     ]
 *   }
 * }
 * ```
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseDenyRulesConfig, type HardDenyRule } from '../permission/deny-rules.js';

/**
 * Config file candidates for project-level deny rules, checked in priority order.
 * Later files override earlier ones (higher priority wins).
 */
const CONFIG_FILE_CANDIDATES = ['kilo.json', 'alexi.json', '.kilo/kilo.json', '.kilo/config.json'];

/**
 * Result of loading project deny rules from config files.
 */
export interface ProjectDenyRulesResult {
  /** The deny rules that were loaded */
  rules: HardDenyRule[];
  /** The config file the rules were loaded from (if any) */
  source?: string;
  /** Any error encountered while loading */
  error?: string;
}

/**
 * Load project deny rules from the project root directory.
 * Searches through config file candidates in priority order.
 * The highest-priority file that contains denyRules wins.
 *
 * @param projectRoot - The root directory of the project
 * @returns The loaded deny rules and metadata
 */
export function loadProjectDenyRules(projectRoot: string): ProjectDenyRulesResult {
  // Search config files in reverse priority order (last found wins)
  let lastResult: ProjectDenyRulesResult = { rules: [] };

  for (const candidate of CONFIG_FILE_CANDIDATES) {
    const filePath = path.resolve(projectRoot, candidate);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const config = JSON.parse(content) as Record<string, unknown>;

      if ('denyRules' in config && config.denyRules !== undefined) {
        const rules = parseDenyRulesConfig(config.denyRules);
        lastResult = { rules, source: filePath };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      lastResult = {
        rules: [],
        error: `Failed to parse ${candidate}: ${message}`,
      };
    }
  }

  return lastResult;
}

/**
 * Load deny rules from a specific config file path.
 * Useful for testing or when the config file location is already known.
 *
 * @param filePath - Absolute path to the config file
 * @returns The loaded deny rules and metadata
 */
export function loadDenyRulesFromFile(filePath: string): ProjectDenyRulesResult {
  if (!fs.existsSync(filePath)) {
    return { rules: [] };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const config = JSON.parse(content) as Record<string, unknown>;

    if ('denyRules' in config && config.denyRules !== undefined) {
      const rules = parseDenyRulesConfig(config.denyRules);
      return { rules, source: filePath };
    }

    return { rules: [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      rules: [],
      error: `Failed to parse ${filePath}: ${message}`,
    };
  }
}
