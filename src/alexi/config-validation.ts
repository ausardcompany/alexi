/**
 * Config Validation Module
 * Validates configuration files after edits to ensure they remain valid
 * Prevents agents from corrupting config files
 */

import path from 'path';
import { AlexiPaths } from './paths.js';

export namespace ConfigValidation {
  /**
   * Check if a file is a config file and validate it if so.
   * Returns warning messages if validation fails.
   */
  export async function check(filePath: string): Promise<string> {
    if (!AlexiPaths.isGlobalConfigPath(filePath)) {
      return '';
    }

    const ext = path.extname(filePath).toLowerCase();
    const warnings: string[] = [];

    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(filePath, 'utf-8');

      if (ext === '.json' || ext === '.jsonc') {
        try {
          JSON.parse(content);
        } catch (e) {
          warnings.push(`Warning: ${filePath} contains invalid JSON`);
        }
      } else if (ext === '.yaml' || ext === '.yml') {
        // Optional: Add YAML validation if yaml parser is available
        try {
          const yaml = await import('yaml');
          yaml.parse(content);
        } catch (e) {
          // YAML parser may not be available - skip validation
          if ((e as Error).message && !(e as Error).message.includes('Cannot find module')) {
            warnings.push(`Warning: ${filePath} contains invalid YAML`);
          }
        }
      } else if (ext === '.toml') {
        // Optional: Add TOML validation if toml parser is available
        try {
          const toml = await import('@iarna/toml');
          toml.parse(content);
        } catch (e) {
          // TOML parser may not be available - skip validation
          if ((e as Error).message && !(e as Error).message.includes('Cannot find module')) {
            warnings.push(`Warning: ${filePath} contains invalid TOML`);
          }
        }
      }
    } catch (e) {
      // File doesn't exist or can't be read - not a validation error
    }

    return warnings.join('\n');
  }
}
