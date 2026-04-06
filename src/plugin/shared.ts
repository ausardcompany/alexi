/**
 * Plugin Shared Utilities
 * Common utilities for plugin management
 */

import path from 'path';
import os from 'os';

export interface ParsedPluginSpecifier {
  name: string;
  version?: string;
  scope?: string;
}

export function parsePluginSpecifier(specifier: string): ParsedPluginSpecifier {
  try {
    // Simple parsing for common formats: package, package@version, @scope/package, @scope/package@version
    const parts = specifier.split('@');

    if (specifier.startsWith('@')) {
      // Scoped package
      if (parts.length < 2) {
        throw new Error('Invalid scoped package format');
      }
      const scope = parts[1];
      const nameAndVersion = parts.slice(2).join('@');
      const [name, version] = nameAndVersion ? nameAndVersion.split('@') : [scope, undefined];

      return {
        name: nameAndVersion ? `@${scope}/${name}` : `@${scope}`,
        version,
        scope: `@${scope}`,
      };
    } else {
      // Regular package
      const [name, version] = parts;
      return {
        name,
        version,
      };
    }
  } catch (error) {
    throw new Error(`Invalid plugin specifier: ${specifier}. ${error}`);
  }
}

export function sanitizeCachePath(cachePath: string): string {
  if (process.platform === 'win32') {
    // Remove or replace characters that are invalid in Windows paths
    return cachePath
      .replace(/[<>:"|?*]/g, '_')
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/');
  }
  return cachePath;
}

export function getPluginCachePath(pluginSpecifier: string): string {
  const parsed = parsePluginSpecifier(pluginSpecifier);
  const pluginName = parsed.name || pluginSpecifier;

  const cacheDir = process.env.ALEXI_PLUGIN_CACHE || path.join(os.homedir(), '.alexi', 'plugins');
  const unsanitizedPath = path.join(cacheDir, pluginName);

  return sanitizeCachePath(unsanitizedPath);
}
