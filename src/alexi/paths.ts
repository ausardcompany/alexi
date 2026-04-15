/**
 * Alexi-specific path management
 * Centralized management of Alexi-specific global directories for config, cache, and data paths
 */

import path from 'path';
import os from 'os';

export namespace AlexiPaths {
  /**
   * Returns all global directories that Alexi uses for configuration and data.
   * These directories are whitelisted for agent read access.
   */
  export function globalDirs(): string[] {
    const home = os.homedir();
    const dirs: string[] = [];

    // XDG-style config directories
    const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
    dirs.push(path.join(xdgConfig, 'alexi'));

    // XDG-style data directories
    const xdgData = process.env.XDG_DATA_HOME || path.join(home, '.local', 'share');
    dirs.push(path.join(xdgData, 'alexi'));

    // Legacy home directory config
    dirs.push(path.join(home, '.alexi'));

    // Platform-specific paths
    if (process.platform === 'darwin') {
      dirs.push(path.join(home, 'Library', 'Application Support', 'alexi'));
    } else if (process.platform === 'win32') {
      const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
      dirs.push(path.join(appData, 'alexi'));
    }

    return dirs;
  }

  /**
   * Check if a path is within a global config directory
   */
  export function isGlobalConfigPath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath);
    return globalDirs().some((dir) => normalizedPath.startsWith(path.normalize(dir)));
  }
}
